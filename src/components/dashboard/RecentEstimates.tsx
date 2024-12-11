import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import type { Database } from "@/integrations/supabase/types";

type Estimate = Database['public']['Tables']['estimates']['Row'];

interface RecentEstimatesProps {
  estimates: Estimate[] | undefined;
  isLoading: boolean;
}

const RecentEstimates = ({ estimates, isLoading }: RecentEstimatesProps) => {
  const navigate = useNavigate();

  const formatDescription = (description: string | null) => {
    if (!description) return 'No description';
    return description.split('\n').map((line, index) => (
      <div key={index} className="text-left">• {line.trim()}</div>
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Estimates</CardTitle>
        <CardDescription>View and manage your estimates</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading estimates...</div>
        ) : estimates && estimates.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {estimates.map((estimate) => (
                <TableRow 
                  key={estimate.id}
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => navigate(`/estimates/${estimate.id}`)}
                >
                  <TableCell>
                    {estimate.client_info ? 
                      (estimate.client_info as any).name || 'No client name' 
                      : 'No client info'}
                  </TableCell>
                  <TableCell className="text-left whitespace-normal">
                    {formatDescription(estimate.description)}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(estimate.created_at), { addSuffix: true })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No estimates found. Create your first estimate to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentEstimates;
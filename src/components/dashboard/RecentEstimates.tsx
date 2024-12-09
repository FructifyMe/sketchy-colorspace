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

  console.log('RecentEstimates rendering with estimates:', estimates?.length);

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
                <TableHead>Description</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {estimates.map((estimate) => {
                console.log('Rendering estimate row:', estimate.id);
                return (
                  <TableRow 
                    key={estimate.id}
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => navigate(`/estimates/${estimate.id}`)}
                  >
                    <TableCell>{estimate.description || 'No description'}</TableCell>
                    <TableCell>
                      {estimate.client_info ? 
                        (estimate.client_info as any).name || 'No client name' 
                        : 'No client info'}
                    </TableCell>
                    <TableCell className="capitalize">{estimate.status}</TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(estimate.created_at), { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                );
              })}
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
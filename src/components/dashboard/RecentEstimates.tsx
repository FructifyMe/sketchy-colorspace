import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Added import statement for Button component
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Estimates</CardTitle>
          <CardDescription>View and manage your estimates</CardDescription>
        </CardHeader>
        <CardContent>
          <div>Loading estimates...</div>
        </CardContent>
      </Card>
    );
  }

  if (!estimates || estimates.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Estimates</CardTitle>
          <CardDescription>View and manage your estimates</CardDescription>
        </CardHeader>
        <CardContent>
          <div>No estimates found</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Estimates</CardTitle>
        <CardDescription>View and manage your estimates</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Desktop View */}
        <div className="hidden sm:block">
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
                      : 'No client name'}
                  </TableCell>
                  <TableCell>{formatDescription(estimate.description)}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(estimate.created_at), { addSuffix: true })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile View */}
        <div className="grid grid-cols-1 gap-3 sm:hidden">
          {estimates.map((estimate) => (
            <div
              key={estimate.id}
              className="cursor-pointer"
              onClick={() => navigate(`/estimates/${estimate.id}`)}
            >
              <Card className="hover:bg-muted transition-colors">
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="font-medium">
                        {estimate.client_info ? 
                          (estimate.client_info as any).name || 'No client name' 
                          : 'No client name'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(estimate.created_at), { addSuffix: true })}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDescription(estimate.description)}
                    </div>
                    <div className="flex justify-end pt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click
                          navigate(`/estimates/${estimate.id}/edit`);
                        }}
                      >
                        Edit Estimate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentEstimates;
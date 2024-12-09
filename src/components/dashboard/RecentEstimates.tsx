import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import type { Database } from "@/integrations/supabase/types";
import DeleteEstimateDialog from "../estimates/DeleteEstimateDialog";
import { useEstimateDelete } from "@/hooks/useEstimateDelete";

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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {estimates.map((estimate) => {
                console.log('Rendering estimate row:', estimate.id);
                // Create a delete handler for this specific estimate
                const handleDelete = () => {
                  const { mutate } = useEstimateDelete(estimate.id);
                  mutate();
                };
                
                return (
                  <TableRow 
                    key={estimate.id}
                  >
                    <TableCell 
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => navigate(`/estimates/${estimate.id}`)}
                    >
                      {estimate.description || 'No description'}
                    </TableCell>
                    <TableCell 
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => navigate(`/estimates/${estimate.id}`)}
                    >
                      {estimate.client_info ? 
                        (estimate.client_info as any).name || 'No client name' 
                        : 'No client info'}
                    </TableCell>
                    <TableCell 
                      className="cursor-pointer hover:bg-muted capitalize"
                      onClick={() => navigate(`/estimates/${estimate.id}`)}
                    >
                      {estimate.status}
                    </TableCell>
                    <TableCell 
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => navigate(`/estimates/${estimate.id}`)}
                    >
                      {formatDistanceToNow(new Date(estimate.created_at), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      <DeleteEstimateDialog onDelete={() => handleDelete()} />
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
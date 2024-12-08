import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';

const EstimateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: estimate, isLoading } = useQuery({
    queryKey: ['estimate', id],
    queryFn: async () => {
      console.log('Fetching estimate:', id);
      const { data, error } = await supabase
        .from('estimates')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error fetching estimate:", error);
        throw error;
      }

      console.log('Fetched estimate:', data);
      return data;
    }
  });

  if (isLoading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  if (!estimate) {
    return (
      <div className="container mx-auto p-6">
        <div className="rounded-lg bg-destructive/15 p-4 text-destructive">
          Estimate not found
        </div>
      </div>
    );
  }

  const clientInfo = estimate.client_info as { name?: string; email?: string; phone?: string; address?: string; } | null;

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Estimate Details</h2>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="font-medium text-gray-500">Name</dt>
                <dd>{clientInfo?.name || 'N/A'}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Email</dt>
                <dd>{clientInfo?.email || 'N/A'}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Phone</dt>
                <dd>{clientInfo?.phone || 'N/A'}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Address</dt>
                <dd>{clientInfo?.address || 'N/A'}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estimate Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-500">Description</h4>
                <p>{estimate.description || 'No description provided'}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-500">Items</h4>
                {estimate.items && Array.isArray(estimate.items) && estimate.items.length > 0 ? (
                  <div className="space-y-2">
                    {estimate.items.map((item: any, index: number) => (
                      <div key={index} className="border p-3 rounded-lg">
                        <p><strong>Item:</strong> {item.name}</p>
                        {item.quantity && <p><strong>Quantity:</strong> {item.quantity}</p>}
                        {item.price && <p><strong>Price:</strong> ${item.price}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No items added</p>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div>
                  <span className="text-sm text-gray-500">Status: </span>
                  <span className="capitalize">{estimate.status}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Created {formatDistanceToNow(new Date(estimate.created_at), { addSuffix: true })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EstimateDetail;
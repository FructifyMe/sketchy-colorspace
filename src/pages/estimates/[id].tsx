import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const EstimateView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: estimate, isLoading } = useQuery({
    queryKey: ['estimate', id],
    queryFn: async () => {
      console.log("Fetching estimate with ID:", id);
      const { data, error } = await supabase
        .from('estimates')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      console.log("Fetched estimate:", data);
      return data;
    }
  });

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!estimate) {
    return <div className="flex justify-center items-center min-h-screen">Estimate not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Estimate Details</h1>
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </div>

      <Card className="p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Client Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p>{estimate.client_info?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p>{estimate.client_info?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p>{estimate.client_info?.phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p>{estimate.client_info?.address || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="whitespace-pre-wrap">{estimate.description}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Items</h2>
          <div className="space-y-4">
            {estimate.items?.map((item: any, index: number) => (
              <Card key={index} className="p-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Item</p>
                    <p>{item.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Quantity</p>
                    <p>{item.quantity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p>${item.price}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <p className="text-lg font-semibold">
            Total: ${estimate.items?.reduce((acc: number, item: any) => 
              acc + (item.price || 0) * (item.quantity || 1), 0
            )}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default EstimateView;
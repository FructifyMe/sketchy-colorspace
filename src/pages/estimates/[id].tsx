import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import type { ClientInfo, EstimateItem } from '@/types/estimate';
import EstimateHeader from '@/components/estimates/EstimateHeader';
import EstimateActions from '@/components/estimates/EstimateActions';

interface EstimateData {
  id: string;
  description: string;
  client_info: ClientInfo;
  items: EstimateItem[];
  status: string;
}

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
      
      const convertedData: EstimateData = {
        id: data.id,
        description: data.description || '',
        status: data.status || 'draft',
        client_info: data.client_info as ClientInfo,
        items: (data.items as EstimateItem[]) || []
      };

      return convertedData;
    }
  });

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!estimate) {
    return <div className="flex justify-center items-center min-h-screen">Estimate not found</div>;
  }

  const calculateTotal = () => {
    return estimate.items.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 1)), 0);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="print:hidden mb-6">
        <EstimateActions 
          estimateId={estimate.id}
          onPrint={() => window.print()}
          onEmail={() => console.log('Email functionality to be implemented')}
          onDownload={() => console.log('Download functionality to be implemented')}
        />
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 print:p-4">
        <EstimateHeader estimateId={estimate.id} />

        <div className="mb-8 print:mb-6">
          <h2 className="font-semibold text-gray-900 mb-2">Bill To:</h2>
          <div className="space-y-1">
            <p className="font-medium">{estimate.client_info.name}</p>
            <p>{estimate.client_info.address}</p>
            <p>{estimate.client_info.phone}</p>
            <p>{estimate.client_info.email}</p>
          </div>
        </div>

        <div className="mt-8">
          <table className="w-full">
            <thead>
              <tr className="border-t border-b">
                <th className="py-2 px-4 text-left font-medium text-gray-700 w-20">QTY</th>
                <th className="py-2 px-4 text-left font-medium text-gray-700">Description</th>
                <th className="py-2 px-4 text-right font-medium text-gray-700 w-32">Unit Price</th>
                <th className="py-2 px-4 text-right font-medium text-gray-700 w-32">Amount</th>
              </tr>
            </thead>
            <tbody>
              {estimate.items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3 px-4 text-left">{item.quantity}</td>
                  <td className="py-3 px-4 text-left">{item.name}</td>
                  <td className="py-3 px-4 text-right">${(item.price || 0).toFixed(2)}</td>
                  <td className="py-3 px-4 text-right">
                    ${((item.quantity || 1) * (item.price || 0)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 text-right border-t pt-4">
            <p className="text-lg font-bold">Total: ${calculateTotal().toFixed(2)}</p>
          </div>
        </div>

        {estimate.description && (
          <div className="mt-8">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-600">{estimate.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EstimateView;
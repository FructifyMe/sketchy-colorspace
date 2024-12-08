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
        client_info: data.client_info as ClientInfo || {},
        items: (data.items as any[] || []).map(item => ({
          name: item.name || '',
          quantity: item.quantity || 1,
          price: item.price || 0
        }))
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

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    console.log('Email functionality to be implemented');
  };

  const handleDownload = () => {
    console.log('Download functionality to be implemented');
  };

  const calculateTotal = () => {
    return estimate.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 print:p-4">
      <EstimateActions 
        estimateId={estimate.id}
        onPrint={handlePrint}
        onEmail={handleEmail}
        onDownload={handleDownload}
      />

      <div className="space-y-6 print:space-y-4 bg-white">
        <EstimateHeader estimateId={estimate.id} />

        <div className="mb-8 print:mb-6 text-left">
          <h2 className="font-semibold text-gray-900 mb-2">Bill To:</h2>
          <div className="space-y-1">
            <p>{estimate.client_info?.name || 'N/A'}</p>
            <p>{estimate.client_info?.address || 'N/A'}</p>
            <p>{estimate.client_info?.phone || 'N/A'}</p>
            <p>{estimate.client_info?.email || 'N/A'}</p>
          </div>
        </div>

        <div className="space-y-4 print:space-y-2">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left w-20">QTY</th>
                <th className="py-2 text-left">Description</th>
                <th className="py-2 text-right w-32">Unit Price</th>
                <th className="py-2 text-right w-32">Amount</th>
              </tr>
            </thead>
            <tbody>
              {estimate.items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3 text-left">{item.quantity}</td>
                  <td className="py-3 text-left">{item.name}</td>
                  <td className="py-3 text-right">${item.price.toFixed(2)}</td>
                  <td className="py-3 text-right">${(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pt-4 text-right border-t">
            <p className="text-lg font-bold">Total: ${calculateTotal().toFixed(2)}</p>
          </div>
        </div>

        {estimate.description && (
          <div className="mt-8 print:mt-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-600">{estimate.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EstimateView;
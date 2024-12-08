import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
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
    // TODO: Implement email functionality
    console.log('Email functionality to be implemented');
  };

  const handleDownload = () => {
    // TODO: Implement download functionality
    console.log('Download functionality to be implemented');
  };

  const calculateTotal = () => {
    return estimate.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <EstimateActions
        estimateId={estimate.id}
        onPrint={handlePrint}
        onEmail={handleEmail}
        onDownload={handleDownload}
      />

      <Card className="p-8 space-y-6 bg-white shadow-lg print:shadow-none">
        <EstimateHeader estimateId={estimate.id} />

        <div className="mt-8">
          <div className="space-y-1">
            <h2 className="font-semibold text-gray-700">Customer Information</h2>
            <p>{estimate.client_info?.name || 'N/A'}</p>
            <p>{estimate.client_info?.address || 'N/A'}</p>
            <p>{estimate.client_info?.phone || 'N/A'}</p>
            <p>{estimate.client_info?.email || 'N/A'}</p>
          </div>
        </div>

        <div className="mt-8">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 px-4 text-left font-semibold text-gray-700">Description</th>
                <th className="py-2 px-4 text-right font-semibold text-gray-700">Quantity</th>
                <th className="py-2 px-4 text-right font-semibold text-gray-700">Unit Price</th>
                <th className="py-2 px-4 text-right font-semibold text-gray-700">Amount</th>
              </tr>
            </thead>
            <tbody>
              {estimate.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-2 px-4">{item.name}</td>
                  <td className="py-2 px-4 text-right">{item.quantity}</td>
                  <td className="py-2 px-4 text-right">${item.price.toFixed(2)}</td>
                  <td className="py-2 px-4 text-right">${(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="py-2 px-4 text-right font-semibold">Total:</td>
                <td className="py-2 px-4 text-right font-semibold">${calculateTotal().toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {estimate.description && (
          <div className="mt-8">
            <h3 className="font-semibold mb-2 text-gray-700">Description</h3>
            <p className="whitespace-pre-wrap text-gray-600">{estimate.description}</p>
          </div>
        )}

        <div className="mt-8">
          <h3 className="font-semibold mb-2 text-gray-700">Terms and Conditions</h3>
          <p className="text-gray-600">Payment is due within 30 days</p>
        </div>

        <div className="mt-12 pt-8 border-t">
          <div className="w-64">
            <div className="border-b border-gray-300 mt-16"></div>
            <p className="text-center mt-2 text-gray-600">Customer Signature</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EstimateView;
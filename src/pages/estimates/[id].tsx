import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ClientInfo, EstimateItem } from '@/types/estimate';
import type { Json } from '@/integrations/supabase/types';
import { Printer, Mail, Download, ArrowLeft, Edit } from 'lucide-react';

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
      
      // Convert the JSON data to our expected types
      const convertedData: EstimateData = {
        id: data.id,
        description: data.description || '',
        status: data.status || 'draft',
        client_info: data.client_info as ClientInfo || {},
        items: Array.isArray(data.items) 
          ? data.items.map((item: any) => ({
              name: item.name || '',
              quantity: item.quantity || 1,
              price: item.price || 0
            }))
          : []
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

  const handleEdit = () => {
    navigate(`/estimates/${id}/edit`);
  };

  const calculateTotal = () => {
    return estimate.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <Button
            variant="outline"
            onClick={handleEdit}
            className="flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handlePrint}
            className="flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print
          </Button>
          <Button
            variant="outline"
            onClick={handleEmail}
            className="flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Email
          </Button>
          <Button
            variant="outline"
            onClick={handleDownload}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>
      </div>

      <Card className="p-8 space-y-6 bg-white shadow-lg print:shadow-none">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-[#003087] mb-6">ESTIMATE</h1>
            <div className="space-y-1">
              <h2 className="font-semibold">Bill To</h2>
              <p>{estimate.client_info?.name || 'N/A'}</p>
              <p>{estimate.client_info?.address || 'N/A'}</p>
              <p>{estimate.client_info?.phone || 'N/A'}</p>
              <p>{estimate.client_info?.email || 'N/A'}</p>
            </div>
          </div>
          <div className="text-right space-y-2">
            <p><span className="font-semibold">Estimate #:</span> {estimate.id.slice(0, 8)}</p>
            <p><span className="font-semibold">Date:</span> {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mt-8">
          <table className="w-full">
            <thead>
              <tr className="bg-[#003087] text-white">
                <th className="py-2 px-4 text-left">Description</th>
                <th className="py-2 px-4 text-right">Quantity</th>
                <th className="py-2 px-4 text-right">Unit Price</th>
                <th className="py-2 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {estimate.items.map((item, index) => (
                <tr key={index} className="border-b">
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
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="whitespace-pre-wrap">{estimate.description}</p>
          </div>
        )}

        <div className="mt-8">
          <h3 className="font-semibold mb-2">Terms and Conditions</h3>
          <p>Payment is due within 30 days</p>
        </div>

        <div className="mt-12 pt-8 border-t">
          <div className="w-64">
            <div className="border-b border-black mt-16"></div>
            <p className="text-center mt-2">Customer Signature</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EstimateView;
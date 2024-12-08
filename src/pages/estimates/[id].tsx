import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ClientInfo, EstimateItem } from '@/types/estimate';
import EstimateHeader from '@/components/estimates/EstimateHeader';
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

  const handleBack = () => {
    navigate('/estimates');
  };

  const handleEdit = () => {
    navigate(`/estimates/${id}/edit`);
  };

  const calculateTotal = () => {
    return estimate.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex gap-4 mb-6 print:hidden">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button variant="outline" onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" /> Edit
        </Button>
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" /> Print
        </Button>
        <Button variant="outline" onClick={handleEmail}>
          <Mail className="mr-2 h-4 w-4" /> Email
        </Button>
        <Button variant="outline" onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" /> Download
        </Button>
      </div>

      <Card className="p-8 space-y-6 bg-white shadow-lg print:shadow-none">
        <EstimateHeader estimateId={estimate.id} />

        <div className="mt-8">
          <div className="space-y-1 text-left">
            <h2 className="font-semibold text-gray-700 mb-2">Customer Information</h2>
            <p>{estimate.client_info?.name || 'N/A'}</p>
            <p>{estimate.client_info?.address || 'N/A'}</p>
            <p>{estimate.client_info?.phone || 'N/A'}</p>
            <p>{estimate.client_info?.email || 'N/A'}</p>
          </div>
        </div>

        <div className="mt-8">
          <ul className="space-y-4">
            {estimate.items.map((item, index) => (
              <li key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                </div>
                <div className="flex gap-8">
                  <p className="text-gray-600">Qty: {item.quantity}</p>
                  <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  <p className="font-medium">${(item.quantity * item.price).toFixed(2)}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-right">
            <p className="text-lg font-bold">Total: ${calculateTotal().toFixed(2)}</p>
          </div>
        </div>

        {estimate.description && (
          <div className="mt-8">
            <h3 className="font-semibold mb-2 text-gray-700">Description</h3>
            <p className="text-gray-600">{estimate.description}</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default EstimateView;
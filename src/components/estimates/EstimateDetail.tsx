import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EstimateClientInfo from './EstimateClientInfo';
import EstimateItemsSection from './EstimateItemsSection';
import EstimateHeader from './EstimateHeader';
import { useEstimateOperations } from '@/hooks/useEstimateOperations';
import type { Estimate } from '@/types/estimateDetail';
import { parseClientInfo, parseItems } from '@/types/estimateDetail';

const EstimateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const { deleteMutation, handleUpdateItem, handleRemoveItem, handleAddItem } = useEstimateOperations(id!);

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

      const parsedData: Estimate = {
        ...data,
        client_info: parseClientInfo(data.client_info),
        items: parseItems(data.items),
        status: data.status || 'draft',
      };

      console.log('Fetched estimate:', parsedData);
      return parsedData;
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

  return (
    <div className="container mx-auto p-6">
      <EstimateHeader
        isEditing={isEditing}
        onToggleEdit={() => setIsEditing(!isEditing)}
        onDelete={() => deleteMutation.mutate()}
        onNavigateBack={() => navigate('/dashboard')}
        estimateId={estimate.id}
      />

      <div className="space-y-6">
        <EstimateClientInfo clientInfo={estimate.client_info} />

        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{estimate.description || 'No description provided'}</p>
          </CardContent>
        </Card>

        <EstimateItemsSection
          items={estimate.items}
          isEditing={isEditing}
          onUpdateItem={(index, item) => handleUpdateItem(estimate, index, item)}
          onRemoveItem={(index) => handleRemoveItem(estimate, index)}
          onAddItem={() => handleAddItem(estimate)}
        />

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm text-gray-500">Status: </span>
                <span className="capitalize">{estimate.status}</span>
              </div>
              <div className="text-sm text-gray-500">
                Created {formatDistanceToNow(new Date(estimate.created_at), { addSuffix: true })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EstimateDetail;
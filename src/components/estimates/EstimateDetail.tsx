import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { useState } from 'react';
import type { EstimateItem } from '@/types/estimate';
import EstimateClientInfo from './EstimateClientInfo';
import EstimateItemsSection from './EstimateItemsSection';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Estimate {
  id: string;
  description: string | null;
  client_info: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  } | null;
  items: EstimateItem[];
  status: string;
  created_at: string;
}

const EstimateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

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

      // Parse the items from JSON to ensure they match our EstimateItem type
      const parsedItems = Array.isArray(data.items) ? data.items.map((item: any) => ({
        name: item.name || '',
        quantity: item.quantity || 0,
        price: item.price || 0
      })) : [];

      const parsedData: Estimate = {
        ...data,
        items: parsedItems
      };

      console.log('Fetched estimate:', parsedData);
      return parsedData;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      console.log('Deleting estimate:', id);
      const { error } = await supabase
        .from('estimates')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Estimate deleted",
        description: "The estimate has been successfully deleted",
      });
      navigate('/dashboard');
    },
    onError: (error) => {
      console.error('Error deleting estimate:', error);
      toast({
        title: "Error",
        description: "Failed to delete the estimate",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedData: Partial<Estimate>) => {
      console.log('Updating estimate:', id, updatedData);
      const { error } = await supabase
        .from('estimates')
        .update({
          ...updatedData,
          items: updatedData.items // Supabase will handle the JSON serialization
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Estimate updated",
        description: "Changes have been saved successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['estimate', id] });
    },
    onError: (error) => {
      console.error('Error updating estimate:', error);
      toast({
        title: "Error",
        description: "Failed to update the estimate",
        variant: "destructive",
      });
    },
  });

  const handleUpdateItem = (index: number, updatedItem: EstimateItem) => {
    if (!estimate) return;
    
    const newItems = [...estimate.items];
    newItems[index] = updatedItem;
    
    updateMutation.mutate({
      ...estimate,
      items: newItems,
    });
  };

  const handleRemoveItem = (index: number) => {
    if (!estimate) return;
    
    const newItems = estimate.items.filter((_, i) => i !== index);
    updateMutation.mutate({
      ...estimate,
      items: newItems,
    });
  };

  const handleAddItem = () => {
    if (!estimate) return;
    
    const newItem: EstimateItem = {
      name: '',
      quantity: 1,
      price: 0
    };
    
    updateMutation.mutate({
      ...estimate,
      items: [...estimate.items, newItem],
    });
  };

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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Estimate Details</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
          <Button 
            variant="secondary"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Done Editing' : 'Edit'}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the estimate.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteMutation.mutate()}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

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
          onUpdateItem={handleUpdateItem}
          onRemoveItem={handleRemoveItem}
          onAddItem={handleAddItem}
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
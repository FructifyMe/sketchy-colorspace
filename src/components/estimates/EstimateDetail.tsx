import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import EstimateItemForm from '../EstimateItemForm';
import type { EstimateItem } from '@/types/estimate';

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

      // Ensure items is always an array
      const parsedData = {
        ...data,
        items: Array.isArray(data.items) ? data.items : []
      } as Estimate;

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
        .update(updatedData)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Estimate updated",
        description: "Changes have been saved successfully",
      });
      setIsEditing(false);
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
            {isEditing ? 'Cancel Edit' : 'Edit'}
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
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="font-medium text-gray-500">Name</dt>
                <dd>{estimate.client_info?.name || 'N/A'}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Email</dt>
                <dd>{estimate.client_info?.email || 'N/A'}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Phone</dt>
                <dd>{estimate.client_info?.phone || 'N/A'}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Address</dt>
                <dd>{estimate.client_info?.address || 'N/A'}</dd>
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
                <div className="space-y-2">
                  {estimate.items.map((item, index) => (
                    <div key={index}>
                      {isEditing ? (
                        <EstimateItemForm
                          item={item}
                          index={index}
                          onUpdate={handleUpdateItem}
                          onRemove={() => handleRemoveItem(index)}
                        />
                      ) : (
                        <div className="border p-3 rounded-lg">
                          <p><strong>Item:</strong> {item.name}</p>
                          {item.quantity && <p><strong>Quantity:</strong> {item.quantity}</p>}
                          {item.price && <p><strong>Price:</strong> ${item.price}</p>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
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
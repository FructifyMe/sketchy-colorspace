import { supabase } from "@/integrations/supabase/client";
import type { EstimateData } from '@/types/estimate';
import { toSupabaseJson } from '@/types/estimate';

export class EstimateServiceError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'EstimateServiceError';
  }
}

export const estimateService = {
  async createEstimate(formData: EstimateData, userId: string) {
    try {
      const { data, error } = await supabase
        .from('estimates')
        .insert({
          user_id: userId,
          description: formData.description,
          items: toSupabaseJson(formData.items),
          client_info: toSupabaseJson(formData.clientInfo),
          notes: formData.notes || null,
          status: 'draft'
        })
        .select()
        .single();

      if (error) throw new EstimateServiceError('Failed to create estimate', error);
      return data;
    } catch (error) {
      if (error instanceof EstimateServiceError) throw error;
      throw new EstimateServiceError('Unexpected error while creating estimate', error);
    }
  }
};

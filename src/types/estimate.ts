import type { Json } from '@/integrations/supabase/types';
import type { EstimateItem as DetailEstimateItem, EstimateClientInfo } from './estimateDetail';

export type EstimateItem = DetailEstimateItem;

export type { EstimateClientInfo };

export interface EstimateData {
  description: string;
  items: EstimateItem[];
  clientInfo: EstimateClientInfo;
}

export const toSupabaseJson = (data: any): Json => {
  return JSON.parse(JSON.stringify(data));
};

export interface TranscriptionResult {
  description: string;
  items: EstimateItem[];
  clientInfo?: EstimateClientInfo;
}
import type { Json } from '@/integrations/supabase/types';

export interface EstimateItem {
  name: string;
  quantity?: number;
  price?: number;
}

export interface ClientInfo {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface EstimateData {
  description: string;
  items: EstimateItem[];
  clientInfo: ClientInfo;
}

// Helper type to convert our frontend types to Supabase-compatible JSON
export const toSupabaseJson = (data: any): Json => {
  return JSON.parse(JSON.stringify(data));
};

export interface TranscriptionResult {
  description: string;
  items: EstimateItem[];
  clientInfo?: ClientInfo;
}
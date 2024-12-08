import type { Json } from '@/integrations/supabase/types';

export interface EstimateClientInfo {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface Estimate {
  id: string;
  description: string | null;
  client_info: EstimateClientInfo | null;
  items: EstimateItem[];
  status: string;
  created_at: string;
}

export interface EstimateItem {
  name: string;
  quantity: number;
  price: number;
}

export const toSupabaseJson = (data: any): Json => {
  if (Array.isArray(data)) {
    return data.map(item => ({
      name: item.name || '',
      quantity: item.quantity || 0,
      price: item.price || 0
    }));
  }
  return JSON.parse(JSON.stringify(data));
};
import type { Json } from '@/integrations/supabase/types';

export interface EstimateClientInfo {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface EstimateItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Estimate {
  id: string;
  description: string | null;
  client_info: EstimateClientInfo | null;
  items: EstimateItem[];
  status: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

// Helper function to parse client info from Supabase JSON
export const parseClientInfo = (data: Json | null): EstimateClientInfo | null => {
  if (!data || typeof data !== 'object') return null;
  return {
    name: typeof data.name === 'string' ? data.name : undefined,
    email: typeof data.email === 'string' ? data.email : undefined,
    phone: typeof data.phone === 'string' ? data.phone : undefined,
    address: typeof data.address === 'string' ? data.address : undefined
  };
};

// Helper function to parse items from Supabase JSON
export const parseItems = (data: Json | null): EstimateItem[] => {
  if (!Array.isArray(data)) return [];
  return data.map(item => ({
    name: typeof item.name === 'string' ? item.name : '',
    quantity: typeof item.quantity === 'number' ? item.quantity : 0,
    price: typeof item.price === 'number' ? item.price : 0
  }));
};

// Helper function to convert to Supabase JSON
export const toSupabaseJson = (data: any): Json => {
  return JSON.parse(JSON.stringify(data));
};
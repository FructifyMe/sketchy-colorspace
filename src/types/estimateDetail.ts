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

export interface BusinessSettings {
  company_name: string | null;
  company_logo: string | null;
  company_header: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  phone: string | null;
  email: string | null;
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
  business_settings: BusinessSettings;
  terms_and_conditions: string | null;
  payment_policy: string | null;
  expiration_date: string | null;
  notes: string | null;
  show_terms: boolean;
  show_payment_policy: boolean;
}

// Helper function to parse client info from Supabase JSON
export const parseClientInfo = (data: Json | null): EstimateClientInfo | null => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null;
  const jsonData = data as Record<string, unknown>;
  
  return {
    name: typeof jsonData.name === 'string' ? jsonData.name : undefined,
    email: typeof jsonData.email === 'string' ? jsonData.email : undefined,
    phone: typeof jsonData.phone === 'string' ? jsonData.phone : undefined,
    address: typeof jsonData.address === 'string' ? jsonData.address : undefined
  };
};

// Helper function to parse items from Supabase JSON
export const parseItems = (data: Json | null): EstimateItem[] => {
  if (!Array.isArray(data)) return [];
  return data.map(item => {
    if (typeof item !== 'object' || item === null) {
      return { name: '', quantity: 0, price: 0 };
    }
    const jsonItem = item as Record<string, unknown>;
    return {
      name: typeof jsonItem.name === 'string' ? jsonItem.name : '',
      quantity: typeof jsonItem.quantity === 'number' ? jsonItem.quantity : 0,
      price: typeof jsonItem.price === 'number' ? jsonItem.price : 0
    };
  });
};

// Helper function to convert to Supabase JSON
export const toSupabaseJson = (data: any): Json => {
  return JSON.parse(JSON.stringify(data));
};

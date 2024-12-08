import type { Json } from '@/integrations/supabase/types';

export interface EstimateItem {
  [key: string]: string | number | undefined;
  name: string;
  quantity?: number;
  price?: number;
}

export interface ClientInfo {
  [key: string]: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface EstimateData {
  description: string;
  items: EstimateItem[];
  clientInfo: ClientInfo;
}

export interface TranscriptionResult {
  description?: string;
  items?: EstimateItem[];
  clientInfo?: Partial<ClientInfo>;
}
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

export interface TranscriptionResult {
  description: string;
  items: EstimateItem[];
  clientInfo?: ClientInfo;
}
export interface Profile {
  id: string;
  updated_at: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  website: string | null;
  role: 'admin' | 'user';
  email: string | null;
}

export interface InventoryItem {
  id: number;
  created_at: string;
  user_id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiration_date: string;
  purchase_price: number | null;
  storage_location: string | null;
}

export interface WasteLog {
  id: number;
  created_at: string;
  user_id: string;
  item_name: string;
  category: string;
  quantity: number;
  unit: string;
  reason: string;
  waste_date: string;
  notes: string | null;
}

export interface MarketplaceListing {
  id: number;
  created_at: string;
  user_id: string;
  title: string;
  description: string;
  original_price: number;
  discounted_price: number;
  quantity: string;
  category: string;
  vendor: string;
  location: string;
  expires_in: string;
  image_url: string | null;
}

export interface Notification {
  id: number;
  created_at: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
}

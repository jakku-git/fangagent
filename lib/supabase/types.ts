// Database row types matching the Supabase schema

export interface Profile {
  id: string;
  role: "agent" | "staff";
  account_type: "agent" | "agency";
  full_name: string | null;
  agency_name: string | null;
  phone: string | null;
  licence_number: string | null;
  address: string | null;
  suburb: string | null;
  state: string | null;
  postcode: string | null;
  website: string | null;
  bio: string | null;
  profile_photo_url: string | null;
  agency_logo_url: string | null;
  billing_type: "upfront" | "credit";
  credit_status: "none" | "pending" | "approved";
  account_status: "active" | "pending" | "suspended";
  crm_system: string | null;
  crm_integration_status: "none" | "pending" | "connected";
  agent_count: number | null;
  created_at: string;
  updated_at: string;
}

export interface Listing {
  id: string;
  listing_ref: string | null;
  agent_id: string;
  package: "Essential" | "Premium" | "Premium+";
  status: "draft" | "pending_payment" | "pending_review" | "in_progress" | "live" | "completed" | "cancelled";
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  property_type: string | null;
  land_size: string | null;
  features: string[] | null;
  description: string | null;
  open_home_times: string | null;
  auction_date: string | null;
  vendor_instructions: string | null;
  agent_notes: string | null;
  listing_url: string | null;
  fang_url: string | null;
  red_note_url: string | null;
  wechat_url: string | null;
  views: number;
  enquiries: number;
  saves: number;
  created_at: string;
  updated_at: string;
  // joined
  profiles?: Profile;
  listing_photos?: ListingPhoto[];
}

export interface ListingRequest {
  id: string;
  listing_id: string;
  agent_id: string;
  type: "edit" | "withdrawal";
  status: "pending" | "approved" | "rejected";
  message: string;
  staff_notes: string | null;
  created_at: string;
  updated_at: string;
  // joined
  profiles?: Profile;
}

export interface ListingPhoto {
  id: string;
  listing_id: string;
  url: string;
  created_at: string;
}

export interface Invoice {
  id: string;
  invoice_ref: string | null;
  listing_id: string;
  agent_id: string;
  package: string;
  address: string;
  amount: number;
  status: "unpaid" | "remittance_uploaded" | "paid" | "overdue";
  due_date: string;
  paid_at: string | null;
  created_at: string;
  // joined
  remittances?: Remittance[];
}

export interface Remittance {
  id: string;
  invoice_id: string;
  agent_id: string;
  file_url: string;
  file_name: string;
  notes: string | null;
  created_at: string;
}

export interface CrmRequest {
  id: string;
  agent_id: string;
  crm_system: string;
  notes: string | null;
  status: "pending" | "in_progress" | "connected" | "rejected";
  created_at: string;
  updated_at: string;
  profiles?: Profile;
}

export interface CreditApplication {
  id: string;
  agent_id: string;
  status: "pending" | "approved" | "rejected";
  monthly_limit: number | null;
  notes: string | null;
  file_url: string | null;
  file_name: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  profiles?: Profile;
}

export const PACKAGE_PRICES: Record<string, number> = {
  Essential: 425,
  Premium: 750,
  "Premium+": 1250,
};

export const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  pending_payment: "Pending Payment",
  pending_review: "Pending Review",
  in_progress: "In Progress",
  live: "Live",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const STATUS_COLORS: Record<string, string> = {
  draft: "bg-zinc-100 text-zinc-600",
  pending_payment: "bg-amber-50 text-amber-700",
  pending_review: "bg-blue-50 text-blue-700",
  in_progress: "bg-purple-50 text-purple-700",
  live: "bg-green-50 text-green-700",
  completed: "bg-zinc-100 text-zinc-600",
  cancelled: "bg-red-50 text-red-600",
};

// ─── Types ───────────────────────────────────────────────────────────────────

export type UserRole = "agent" | "staff";
export type AccountType = "agent" | "agency";
export type BillingType = "upfront" | "credit";
export type AccountStatus = "active" | "pending" | "suspended";
export type CreditStatus = "none" | "pending" | "approved";
export type ListingStatus = "draft" | "pending_payment" | "pending_review" | "in_progress" | "live" | "completed" | "cancelled";
export type PackageName = "Essential" | "Premium" | "Premium+";
export type InvoiceStatus = "unpaid" | "paid" | "overdue";
export type IntegrationStatus = "none" | "pending" | "connected";
export type CRMSystem = "AgentBox" | "VaultRE" | "Eagle Software" | "Rex" | "Console Cloud" | "PropertyMe" | "Inspect Real Estate" | "Other";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  createdAt: string;
}

export interface AgentProfile {
  userId: string;
  accountType: AccountType;
  agencyName: string;
  agentName: string;
  phone: string;
  licenceNumber: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  website: string;
  bio: string;
  profilePhoto: string | null;
  agencyLogo: string | null;
  billingType: BillingType;
  creditStatus: CreditStatus;
  accountStatus: AccountStatus;
  crmSystem: CRMSystem | null;
  crmIntegrationStatus: IntegrationStatus;
  // Agency-only: list of sub-agents
  agentCount?: number;
}

export interface Listing {
  id: string;
  agentId: string;
  agentName: string;
  agencyName: string;
  package: PackageName;
  status: ListingStatus;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  landSize: string;
  description: string;
  openHomeTimes: string;
  agentNotes: string;
  listingUrl: string | null;
  photos: string[];
  createdAt: string;
  updatedAt: string;
  // Campaign (filled by staff)
  redNoteUrl: string | null;
  wechatUrl: string | null;
  // Performance (filled by staff)
  views: number;
  enquiries: number;
  saves: number;
  reportUrl: string | null;
  brochureUrl: string | null;
}

export interface Invoice {
  id: string;
  listingId: string;
  agentId: string;
  agentName: string;
  agencyName: string;
  package: PackageName;
  address: string;
  amount: number;
  status: InvoiceStatus;
  createdAt: string;
  dueDate: string;
  paidAt: string | null;
}

export interface CRMIntegrationRequest {
  id: string;
  agentId: string;
  agentName: string;
  agencyName: string;
  crmSystem: CRMSystem;
  notes: string;
  status: "pending" | "in_progress" | "connected" | "rejected";
  createdAt: string;
}

export interface CreditApplication {
  id: string;
  agentId: string;
  agentName: string;
  agencyName: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt: string | null;
  monthlyLimit: number | null;
}

// ─── Mock Users ──────────────────────────────────────────────────────────────

export const MOCK_USERS: User[] = [
  { id: "agent-1", email: "agent@demo.com", role: "agent", name: "Sarah Chen", createdAt: "2025-11-01" },
  { id: "agent-2", email: "agency@demo.com", role: "agent", name: "James Wu", createdAt: "2025-10-15" },
  { id: "staff-1", email: "staff@fang.com.au", role: "staff", name: "Fang Staff", createdAt: "2024-01-01" },
];

export const MOCK_PROFILES: AgentProfile[] = [
  {
    userId: "agent-1",
    accountType: "agent" as AccountType,
    agencyName: "Chen & Associates Real Estate",
    agentName: "Sarah Chen",
    phone: "0412 345 678",
    licenceNumber: "20123456",
    address: "Suite 5, 123 George Street",
    suburb: "Sydney",
    state: "NSW",
    postcode: "2000",
    website: "https://chenassociates.com.au",
    bio: "Specialising in Sydney CBD and Inner West residential and investment properties for over 10 years.",
    profilePhoto: null,
    agencyLogo: null,
    billingType: "upfront",
    creditStatus: "none",
    accountStatus: "active",
    crmSystem: "AgentBox",
    crmIntegrationStatus: "connected",
  },
  {
    userId: "agent-2",
    accountType: "agency" as AccountType,
    agencyName: "Wu Property Group",
    agentName: "James Wu",
    phone: "0423 456 789",
    licenceNumber: "20234567",
    address: "Level 2, 88 Pitt Street",
    suburb: "Sydney",
    state: "NSW",
    postcode: "2000",
    website: "https://wupropertygroup.com.au",
    bio: "Award-winning agency specialising in luxury residential and off-the-plan sales across Greater Sydney.",
    profilePhoto: null,
    agencyLogo: null,
    billingType: "credit",
    creditStatus: "approved",
    accountStatus: "active",
    crmSystem: "Rex",
    crmIntegrationStatus: "pending",
    agentCount: 12,
  },
];

export const MOCK_LISTINGS: Listing[] = [
  {
    id: "lst-001",
    agentId: "agent-1",
    agentName: "Sarah Chen",
    agencyName: "Chen & Associates Real Estate",
    package: "Premium",
    status: "live",
    address: "12 Harbour View Terrace",
    suburb: "Balmain",
    state: "NSW",
    postcode: "2041",
    price: "$2,450,000",
    bedrooms: 4,
    bathrooms: 2,
    parking: 2,
    landSize: "420 sqm",
    description: "Stunning Federation home with harbour glimpses, fully renovated kitchen and bathrooms, entertainer's backyard.",
    openHomeTimes: "Saturday 10:00am – 10:30am",
    agentNotes: "Vendor is motivated. Please highlight school catchment (Balmain Public).",
    listingUrl: "https://www.realestate.com.au/property/12-harbour-view-terrace-balmain-nsw-2041",
    photos: [],
    createdAt: "2026-02-10",
    updatedAt: "2026-02-12",
    redNoteUrl: "https://www.xiaohongshu.com/explore/example1",
    wechatUrl: "https://mp.weixin.qq.com/example1",
    views: 3842,
    enquiries: 14,
    saves: 67,
    reportUrl: "/reports/lst-001-report.pdf",
    brochureUrl: "/brochures/lst-001-brochure.pdf",
  },
  {
    id: "lst-002",
    agentId: "agent-1",
    agentName: "Sarah Chen",
    agencyName: "Chen & Associates Real Estate",
    package: "Essential",
    status: "pending_payment",
    address: "7/45 Crown Street",
    suburb: "Surry Hills",
    state: "NSW",
    postcode: "2010",
    price: "$895,000",
    bedrooms: 2,
    bathrooms: 1,
    parking: 1,
    landSize: "N/A",
    description: "Bright and airy apartment in the heart of Surry Hills. Walking distance to cafes, restaurants, and transport.",
    openHomeTimes: "Sunday 1:00pm – 1:30pm",
    agentNotes: "",
    listingUrl: null,
    photos: [],
    createdAt: "2026-02-20",
    updatedAt: "2026-02-20",
    redNoteUrl: null,
    wechatUrl: null,
    views: 0,
    enquiries: 0,
    saves: 0,
    reportUrl: null,
    brochureUrl: null,
  },
  {
    id: "lst-003",
    agentId: "agent-2",
    agentName: "James Wu",
    agencyName: "Wu Property Group",
    package: "Premium+",
    status: "in_progress",
    address: "88 Pacific Highway",
    suburb: "Chatswood",
    state: "NSW",
    postcode: "2067",
    price: "$3,200,000",
    bedrooms: 5,
    bathrooms: 3,
    parking: 2,
    landSize: "650 sqm",
    description: "Architecturally designed family home in the heart of Chatswood. Double garage, home theatre, and resort-style pool.",
    openHomeTimes: "Saturday 11:00am – 11:30am",
    agentNotes: "Video production scheduled for 28 Feb. Please coordinate with production team.",
    listingUrl: "https://www.domain.com.au/property/88-pacific-highway-chatswood-nsw-2067",
    photos: [],
    createdAt: "2026-02-15",
    updatedAt: "2026-02-22",
    redNoteUrl: null,
    wechatUrl: null,
    views: 1204,
    enquiries: 6,
    saves: 31,
    reportUrl: null,
    brochureUrl: null,
  },
  {
    id: "lst-004",
    agentId: "agent-2",
    agentName: "James Wu",
    agencyName: "Wu Property Group",
    package: "Premium",
    status: "completed",
    address: "3 Rosewood Avenue",
    suburb: "Epping",
    state: "NSW",
    postcode: "2121",
    price: "$1,850,000 (SOLD)",
    bedrooms: 4,
    bathrooms: 2,
    parking: 2,
    landSize: "556 sqm",
    description: "Beautifully presented family home in the sought-after Epping school catchment.",
    openHomeTimes: "Sold",
    agentNotes: "",
    listingUrl: "https://www.realestate.com.au/property/3-rosewood-avenue-epping-nsw-2121",
    photos: [],
    createdAt: "2025-12-01",
    updatedAt: "2026-01-15",
    redNoteUrl: "https://www.xiaohongshu.com/explore/example4",
    wechatUrl: "https://mp.weixin.qq.com/example4",
    views: 8921,
    enquiries: 38,
    saves: 142,
    reportUrl: "/reports/lst-004-report.pdf",
    brochureUrl: "/brochures/lst-004-brochure.pdf",
  },
];

export const MOCK_INVOICES: Invoice[] = [
  {
    id: "inv-001",
    listingId: "lst-001",
    agentId: "agent-1",
    agentName: "Sarah Chen",
    agencyName: "Chen & Associates Real Estate",
    package: "Premium",
    address: "12 Harbour View Terrace, Balmain NSW 2041",
    amount: 750,
    status: "paid",
    createdAt: "2026-02-10",
    dueDate: "2026-02-17",
    paidAt: "2026-02-11",
  },
  {
    id: "inv-002",
    listingId: "lst-002",
    agentId: "agent-1",
    agentName: "Sarah Chen",
    agencyName: "Chen & Associates Real Estate",
    package: "Essential",
    address: "7/45 Crown Street, Surry Hills NSW 2010",
    amount: 425,
    status: "unpaid",
    createdAt: "2026-02-20",
    dueDate: "2026-02-27",
    paidAt: null,
  },
  {
    id: "inv-003",
    listingId: "lst-003",
    agentId: "agent-2",
    agentName: "James Wu",
    agencyName: "Wu Property Group",
    package: "Premium+",
    address: "88 Pacific Highway, Chatswood NSW 2067",
    amount: 1250,
    status: "paid",
    createdAt: "2026-02-15",
    dueDate: "2026-02-22",
    paidAt: "2026-02-15",
  },
];

export const MOCK_CRM_REQUESTS: CRMIntegrationRequest[] = [
  {
    id: "crm-001",
    agentId: "agent-2",
    agentName: "James Wu",
    agencyName: "Wu Property Group",
    crmSystem: "Rex",
    notes: "We use Rex CRM across our whole team. Would like listings to sync automatically.",
    status: "pending",
    createdAt: "2026-02-18",
  },
];

export const MOCK_CREDIT_APPLICATIONS: CreditApplication[] = [
  {
    id: "cred-001",
    agentId: "agent-2",
    agentName: "James Wu",
    agencyName: "Wu Property Group",
    status: "approved",
    submittedAt: "2025-10-20",
    reviewedAt: "2025-10-25",
    monthlyLimit: 5000,
  },
];

// ─── Package pricing ──────────────────────────────────────────────────────────

export const PACKAGE_PRICES: Record<PackageName, number> = {
  Essential: 425,
  Premium: 750,
  "Premium+": 1250,
};

export const CRM_SYSTEMS: CRMSystem[] = [
  "AgentBox", "VaultRE", "Eagle Software", "Rex", "Console Cloud", "PropertyMe", "Inspect Real Estate", "Other"
];

// ─── Status helpers ───────────────────────────────────────────────────────────

export const STATUS_LABELS: Record<ListingStatus, string> = {
  draft: "Draft",
  pending_payment: "Awaiting Payment",
  pending_review: "Pending Review",
  in_progress: "In Progress",
  live: "Live",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const STATUS_COLORS: Record<ListingStatus, string> = {
  draft: "bg-zinc-100 text-zinc-600",
  pending_payment: "bg-amber-50 text-amber-700",
  pending_review: "bg-blue-50 text-blue-700",
  in_progress: "bg-purple-50 text-purple-700",
  live: "bg-green-50 text-green-700",
  completed: "bg-zinc-100 text-zinc-500",
  cancelled: "bg-red-50 text-red-600",
};

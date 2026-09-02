// Mirrors the DRF serializers in the Django backend field-for-field.
// Keep this in sync any time a serializer changes.

export interface ProjectImage {
  id: number;
  image: string;
  is_before_after: boolean;
  order: number;
}

export interface ProjectListItem {
  id: number;
  slug: string;
  title_fr: string;
  title_en: string;
  category: string;
  location: string;
  cover_image: string | null;
  before_image: string | null;
  after_image: string | null;
}

export interface ProjectDetail {
  id: number;
  slug: string;
  title_fr: string;
  title_en: string;
  description_fr: string;
  description_en: string;
  category: string;
  location: string;
  completed_date: string | null;
  images: ProjectImage[];
}

export interface TeamMember {
  id: number;
  name: string;
  role_fr: string;
  role_en: string;
  bio_fr: string;
  bio_en: string;
  photo: string | null;
}

export interface Equipment {
  id: number;
  name_fr: string;
  name_en: string;
  description_fr: string;
  description_en: string;
  photo: string | null;
}

export interface CatalogItem {
  id: number;
  name_fr: string;
  name_en: string;
  description_fr: string;
  description_en: string;
  category: string;
  photo: string | null;
  is_available: boolean;
}

export interface Product {
  id: number;
  sku: string;
  name_fr: string;
  name_en: string;
  description_fr: string;
  description_en: string;
  category: string;
  price: string; // DRF DecimalField serializes as a string
  stock_quantity: number;
  in_stock: boolean;
  photo: string | null;
}

export interface OrderItemInput {
  product_id: number;
  quantity: number;
}

export interface OrderItem {
  product: number;
  product_name: string;
  quantity: number;
  unit_price: string;
  line_total: number;
}

export interface Order {
  order_number: string;
  guest_name: string;
  guest_phone: string;
  guest_email: string;
  delivery_address: string;
  status: "pending" | "paid" | "fulfilled" | "cancelled";
  total: string;
  created_at: string;
  items: OrderItem[];
  payment: { status: string; amount: string; campay_reference: string } | null;
}

export interface AvailabilityResponse {
  date: string;
  available_times: string[]; // "HH:MM" strings
}

export interface BookingInput {
  guest_name: string;
  guest_phone: string;
  guest_email?: string;
  service_type: string;
  project_address: string;
  notes?: string;
  catalog_item?: number;
  slot_start: string; // ISO datetime
  slot_end: string; // ISO datetime
}

export interface Booking {
  id: number;
  guest_name: string;
  service_type: string;
  project_address: string;
  slot_start: string;
  slot_end: string;
  status: "requested" | "confirmed" | "cancelled";
  created_at: string;
}

export interface ContactInput {
  name: string;
  email_or_phone: string;
  message: string;
}

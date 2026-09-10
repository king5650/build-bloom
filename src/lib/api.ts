import type {
  AvailabilityResponse,
  Booking,
  BookingInput,
  CatalogItem,
  ContactInput,
  Equipment,
  Order,
  OrderItemInput,
  Product,
  ProjectDetail,
  ProjectListItem,
  TeamMember,
} from "./types";

// Set VITE_API_URL in .env — see .env.example. Falls back to local Django dev server.
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";
const API_ORIGIN = new URL(API_URL).origin;

function resolveMediaUrl(url: string | null) {
  return url && url.startsWith("/") ? `${API_ORIGIN}${url}` : url;
}

class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, body: unknown) {
    super(`API request failed with status ${status}`);
    this.status = status;
    this.body = body;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      /* no JSON body */
    }
    throw new ApiError(res.status, body);
  }

  // 204/201-with-no-body endpoints
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

// --- content ---
export const getProjects = async (category?: string) => {
  const projects = await request<ProjectListItem[]>(
    `/projects/${category ? `?category=${category}` : ""}`,
  );
  return projects.map((project) => ({
    ...project,
    cover_image: resolveMediaUrl(project.cover_image),
    before_image: resolveMediaUrl(project.before_image),
    after_image: resolveMediaUrl(project.after_image),
  }));
};

export const getProject = async (slug: string) => {
  const project = await request<ProjectDetail>(`/projects/${slug}/`);
  return {
    ...project,
    images: project.images.map((image) => ({
      ...image,
      image: resolveMediaUrl(image.image) ?? image.image,
    })),
  };
};

export const getTeam = async () => {
  const members = await request<TeamMember[]>("/team/");
  return members.map((member) => ({
    ...member,
    photo: resolveMediaUrl(member.photo),
  }));
};

export const getEquipment = async () => {
  const equipment = await request<Equipment[]>("/equipment/");
  return equipment.map((item) => ({
    ...item,
    photo: resolveMediaUrl(item.photo),
  }));
};

// --- catalog ---
export const getCatalog = async (category?: string) => {
  const items = await request<CatalogItem[]>(`/catalog/${category ? `?category=${category}` : ""}`);
  return items.map((item) => ({
    ...item,
    photo: resolveMediaUrl(item.photo),
  }));
};

export const getCatalogItem = async (id: number) => {
  const item = await request<CatalogItem>(`/catalog/${id}/`);
  return { ...item, photo: resolveMediaUrl(item.photo) };
};

// --- products ---
export const getProducts = async (category?: string) => {
  const items = await request<Product[]>(`/products/${category ? `?category=${category}` : ""}`);
  return items.map((item) => ({
    ...item,
    photo: resolveMediaUrl(item.photo),
  }));
};

export const getProduct = async (id: number) => {
  const item = await request<Product>(`/products/${id}/`);
  return { ...item, photo: resolveMediaUrl(item.photo) };
};

// --- orders ---
export const createOrder = (data: {
  guest_name: string;
  guest_phone: string;
  guest_email?: string;
  delivery_address?: string;
  channel?: "mobile_money" | "whatsapp";
  items: OrderItemInput[];
}) => request<Order>("/orders/", { method: "POST", body: JSON.stringify(data) });

export const initiateOrderPayment = (orderNumber: string) =>
  request<{ reference: string; ussd_code: string | null; operator: string | null }>(
    `/orders/${orderNumber}/payment/`,
    { method: "POST" },
  );

export const getOrder = (orderNumber: string, phone?: string) =>
  request<Order>(`/orders/${orderNumber}/${phone ? `?phone=${encodeURIComponent(phone)}` : ""}`);

export const getOrderPaymentStatus = (orderNumber: string) =>
  request<Order>(`/orders/${orderNumber}/payment/status/`);

// --- bookings ---
export const getAvailability = (date: string) =>
  request<AvailabilityResponse>(`/bookings/availability/?date=${date}`);

export const createBooking = (data: BookingInput) =>
  request<Booking>("/bookings/", { method: "POST", body: JSON.stringify(data) });

// --- contact ---
export const sendContactMessage = (data: ContactInput) =>
  request<void>("/contact/", { method: "POST", body: JSON.stringify(data) });

export { ApiError };

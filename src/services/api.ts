import { Product, Collection, Fragrance, PageSection, GlobalSettings, DesignSettings, MediaItem, ContactEnquiry } from '../types';

const TOKEN_KEY = 'immerse_lume_admin_token';

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

// Auth API
export async function loginUser(username: string, password: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Login failed');
  }
  const data = await res.json();
  setAuthToken(data.token);
  return data;
}

export async function fetchCurrentUser() {
  const res = await fetch('/api/auth/me', {
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    removeAuthToken();
    return null;
  }
  return await res.json();
}

export async function changeAdminPassword(currentPassword: string, newPassword: string) {
  const res = await fetch('/api/auth/change-password', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ currentPassword, newPassword })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Password update failed');
  }
  return await res.json();
}

// Products API
export async function fetchProducts(admin = false): Promise<Product[]> {
  const res = await fetch(`/api/products?admin=${admin}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to load products');
  return await res.json();
}

export async function fetchProductBySlug(slug: string): Promise<Product> {
  const res = await fetch(`/api/products/${slug}`);
  if (!res.ok) throw new Error('Product not found');
  return await res.json();
}

export async function createProduct(product: Partial<Product>): Promise<Product> {
  const res = await fetch('/api/products', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(product)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create product');
  }
  return await res.json();
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  const res = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(product)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update product');
  }
  return await res.json();
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`/api/products/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete product');
}

export async function duplicateProduct(id: string): Promise<Product> {
  const res = await fetch(`/api/products/${id}/duplicate`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to duplicate product');
  return await res.json();
}

// Collections API
export async function fetchCollections(admin = false): Promise<Collection[]> {
  const res = await fetch(`/api/collections?admin=${admin}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to load collections');
  return await res.json();
}

export async function createCollection(collection: Partial<Collection>): Promise<Collection> {
  const res = await fetch('/api/collections', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(collection)
  });
  if (!res.ok) throw new Error('Failed to create collection');
  return await res.json();
}

export async function updateCollection(id: string, collection: Partial<Collection>): Promise<Collection> {
  const res = await fetch(`/api/collections/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(collection)
  });
  if (!res.ok) throw new Error('Failed to update collection');
  return await res.json();
}

export async function deleteCollection(id: string): Promise<void> {
  const res = await fetch(`/api/collections/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete collection');
}

// Fragrances API
export async function fetchFragrances(admin = false): Promise<Fragrance[]> {
  const res = await fetch(`/api/fragrances?admin=${admin}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to load fragrances');
  return await res.json();
}

export async function createFragrance(fragrance: Partial<Fragrance>): Promise<Fragrance> {
  const res = await fetch('/api/fragrances', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(fragrance)
  });
  if (!res.ok) throw new Error('Failed to create fragrance');
  return await res.json();
}

export async function updateFragrance(id: string, fragrance: Partial<Fragrance>): Promise<Fragrance> {
  const res = await fetch(`/api/fragrances/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(fragrance)
  });
  if (!res.ok) throw new Error('Failed to update fragrance');
  return await res.json();
}

export async function deleteFragrance(id: string): Promise<void> {
  const res = await fetch(`/api/fragrances/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete fragrance');
}

// Sections API
export async function fetchSections(page = 'home', admin = false): Promise<PageSection[]> {
  const res = await fetch(`/api/sections?page=${page}&admin=${admin}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to load page sections');
  return await res.json();
}

export async function createSection(section: Partial<PageSection>): Promise<PageSection> {
  const res = await fetch('/api/sections', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(section)
  });
  if (!res.ok) throw new Error('Failed to create section');
  return await res.json();
}

export async function updateSection(id: string, section: Partial<PageSection>): Promise<PageSection> {
  const res = await fetch(`/api/sections/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(section)
  });
  if (!res.ok) throw new Error('Failed to update section');
  return await res.json();
}

export async function reorderSections(orderedIds: string[]): Promise<void> {
  const res = await fetch('/api/sections/reorder', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ orderedIds })
  });
  if (!res.ok) throw new Error('Failed to reorder sections');
}

export async function deleteSection(id: string): Promise<void> {
  const res = await fetch(`/api/sections/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete section');
}

// Settings API
export async function fetchSettings(): Promise<{ global: GlobalSettings; design: DesignSettings }> {
  const res = await fetch('/api/settings');
  if (!res.ok) throw new Error('Failed to load settings');
  return await res.json();
}

export async function updateSettings(data: { global?: Partial<GlobalSettings>; design?: Partial<DesignSettings> }) {
  const res = await fetch('/api/settings', {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to save settings');
  return await res.json();
}

// Media API
export async function fetchMedia(): Promise<MediaItem[]> {
  const res = await fetch('/api/media', {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to load media');
  return await res.json();
}

export async function uploadMedia(name: string, dataUrl: string, folder = 'General', type: 'image' | 'video' = 'image'): Promise<MediaItem> {
  const res = await fetch('/api/media/upload', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ name, dataUrl, folder, type })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to upload media');
  }
  return await res.json();
}

export async function deleteMedia(id: string): Promise<void> {
  const res = await fetch(`/api/media/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete media');
}

// Contact Enquiries
export async function submitEnquiry(data: { name: string; email: string; phone?: string; subject?: string; message: string }) {
  const res = await fetch('/api/enquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to submit enquiry');
  }
  return await res.json();
}

export async function fetchEnquiries(): Promise<ContactEnquiry[]> {
  const res = await fetch('/api/enquiries', {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to load enquiries');
  return await res.json();
}

export async function updateEnquiryStatus(id: string, status: 'new' | 'reviewed' | 'archived') {
  const res = await fetch(`/api/enquiries/${id}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update enquiry status');
  return await res.json();
}

// Supabase Status
export async function fetchSupabaseStatus() {
  const res = await fetch('/api/supabase/status');
  if (!res.ok) throw new Error('Failed to query Supabase status');
  return await res.json();
}

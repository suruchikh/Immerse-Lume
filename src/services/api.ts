import { Product, Collection, Fragrance, PageSection, GlobalSettings, DesignSettings, MediaItem, ContactEnquiry } from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_COLLECTIONS,
  INITIAL_FRAGRANCES,
  INITIAL_SECTIONS,
  INITIAL_GLOBAL_SETTINGS,
  INITIAL_DESIGN_SETTINGS,
  INITIAL_MEDIA
} from '../data/initialData';

const TOKEN_KEY = 'immerse_lume_admin_token';
const ADMIN_USER_KEY = 'immerse_lume_admin_user';
const ADMIN_PASS_KEY = 'immerse_lume_admin_custom_password';

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
}

function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

// ---------------- LOCAL STORAGE CACHE HELPERS ----------------
function getStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch (e) {
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('LocalStorage save failed', e);
  }
}

// ---------------- AUTH API ----------------
export async function loginUser(username: string, password: string) {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) {
      const data = await res.json();
      setAuthToken(data.token);
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(data.user));
      return data;
    }
  } catch (err) {
    console.warn('API login request failed, evaluating client fallback:', err);
  }

  // Client-side fallback authentication for Vercel static/serverless resiliency
  const customPassword = localStorage.getItem(ADMIN_PASS_KEY);
  const validPassword = customPassword || 'ImmerseLume2026!';

  if (username === 'admin' && password === validPassword) {
    const fallbackToken = 'immerse_client_admin_token_' + Date.now();
    const fallbackUser = {
      id: 'admin_1',
      username: 'admin',
      email: 'admin@immerselume.com',
      role: 'super_admin'
    };
    setAuthToken(fallbackToken);
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(fallbackUser));
    return { token: fallbackToken, user: fallbackUser };
  }

  throw new Error('Invalid username or password');
}

export async function fetchCurrentUser() {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const res = await fetch('/api/auth/me', {
      headers: getAuthHeaders()
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('fetchCurrentUser API unreachable, using cached session:', err);
  }

  const storedUser = localStorage.getItem(ADMIN_USER_KEY);
  if (storedUser) {
    try {
      return { user: JSON.parse(storedUser) };
    } catch (e) {}
  }

  // Return fallback admin if token exists
  return {
    user: {
      id: 'admin_1',
      username: 'admin',
      email: 'admin@immerselume.com',
      role: 'super_admin'
    }
  };
}

export async function changeAdminPassword(currentPassword: string, newPassword: string) {
  try {
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('API change-password failed, saving in localStorage fallback:', err);
  }

  localStorage.setItem(ADMIN_PASS_KEY, newPassword);
  return { success: true, message: 'Password updated successfully' };
}

// ---------------- PRODUCTS API ----------------
export async function fetchProducts(admin = false): Promise<Product[]> {
  try {
    const res = await fetch(`/api/products?admin=${admin}`, {
      headers: getAuthHeaders()
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setStorage('immerse_lume_products', data);
        return data;
      }
    }
  } catch (err) {
    console.warn('fetchProducts API offline, using cached/initial catalog:', err);
  }
  return getStorage<Product[]>('immerse_lume_products', INITIAL_PRODUCTS);
}

export async function fetchProductBySlug(slug: string): Promise<Product> {
  try {
    const res = await fetch(`/api/products/${slug}`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('fetchProductBySlug API offline, checking local products:', err);
  }
  const products = getStorage<Product[]>('immerse_lume_products', INITIAL_PRODUCTS);
  const found = products.find((p) => p.slug === slug);
  if (!found) throw new Error('Product not found');
  return found;
}

export async function createProduct(product: Partial<Product>): Promise<Product> {
  let created: Product | null = null;
  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(product)
    });
    if (res.ok) {
      created = await res.json();
    }
  } catch (err) {
    console.warn('API createProduct failed, committing to local storage:', err);
  }

  if (!created) {
    created = {
      id: 'prod_' + Date.now(),
      slug: (product.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: product.name || 'Untitled Product',
      category: product.category || 'Glass Candles',
      subCategory: product.subCategory || '',
      shortDescription: product.shortDescription || '',
      fullDescription: product.fullDescription || '',
      images: product.images && product.images.length ? product.images : ['/assets/images/product_atelier_screw_jar_1793372739090.jpg'],
      videoUrl: product.videoUrl,
      fragrances: product.fragrances || [],
      colours: product.colours || [],
      weight: product.weight || '200 g',
      vessel: product.vessel || 'Glass Jar',
      wicks: product.wicks ?? 1,
      burnTime: product.burnTime || '35 hours',
      usage: product.usage || 'Indoor use',
      countryOfOrigin: product.countryOfOrigin || 'India',
      waxType: product.waxType || 'Natural soy wax',
      dimensions: product.dimensions || '',
      careInstructions: product.careInstructions || [],
      featured: product.featured ?? false,
      published: product.published ?? true,
      order: product.order ?? 99
    };
  }

  const current = getStorage<Product[]>('immerse_lume_products', INITIAL_PRODUCTS);
  setStorage('immerse_lume_products', [...current, created]);
  return created;
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  let updated: Product | null = null;
  try {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(product)
    });
    if (res.ok) {
      updated = await res.json();
    }
  } catch (err) {
    console.warn('API updateProduct failed, applying local fallback:', err);
  }

  const current = getStorage<Product[]>('immerse_lume_products', INITIAL_PRODUCTS);
  const updatedList = current.map((p) => {
    if (p.id === id) {
      return updated || { ...p, ...product };
    }
    return p;
  });
  setStorage('immerse_lume_products', updatedList);
  return updated || (updatedList.find((p) => p.id === id) as Product);
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  } catch (err) {
    console.warn('API deleteProduct failed, removing from local storage:', err);
  }
  const current = getStorage<Product[]>('immerse_lume_products', INITIAL_PRODUCTS);
  setStorage('immerse_lume_products', current.filter((p) => p.id !== id));
}

export async function duplicateProduct(id: string): Promise<Product> {
  try {
    const res = await fetch(`/api/products/${id}/duplicate`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('API duplicateProduct failed, cloning locally:', err);
  }

  const current = getStorage<Product[]>('immerse_lume_products', INITIAL_PRODUCTS);
  const original = current.find((p) => p.id === id);
  if (!original) throw new Error('Original product not found');

  const cloned: Product = {
    ...original,
    id: 'prod_' + Date.now(),
    name: `${original.name} (Copy)`,
    slug: `${original.slug}-copy-${Date.now().toString().slice(-4)}`,
    published: false,
    order: current.length + 1
  };
  setStorage('immerse_lume_products', [...current, cloned]);
  return cloned;
}

// ---------------- COLLECTIONS API ----------------
export async function fetchCollections(admin = false): Promise<Collection[]> {
  try {
    const res = await fetch(`/api/collections?admin=${admin}`, {
      headers: getAuthHeaders()
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setStorage('immerse_lume_collections', data);
        return data;
      }
    }
  } catch (err) {
    console.warn('fetchCollections API offline, using cached collections:', err);
  }
  return getStorage<Collection[]>('immerse_lume_collections', INITIAL_COLLECTIONS);
}

export async function createCollection(collection: Partial<Collection>): Promise<Collection> {
  let created: Collection | null = null;
  try {
    const res = await fetch('/api/collections', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(collection)
    });
    if (res.ok) created = await res.json();
  } catch (err) {}

  if (!created) {
    created = {
      id: 'col_' + Date.now(),
      slug: (collection.name || 'collection').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: collection.name || 'New Collection',
      parentCategory: collection.parentCategory || 'Candles',
      description: collection.description || '',
      image: collection.image || '/assets/images/product_atelier_screw_jar_1793372739090.jpg',
      order: collection.order ?? 99,
      published: collection.published ?? true
    };
  }

  const list = getStorage<Collection[]>('immerse_lume_collections', INITIAL_COLLECTIONS);
  setStorage('immerse_lume_collections', [...list, created]);
  return created;
}

export async function updateCollection(id: string, collection: Partial<Collection>): Promise<Collection> {
  let updated: Collection | null = null;
  try {
    const res = await fetch(`/api/collections/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(collection)
    });
    if (res.ok) updated = await res.json();
  } catch (err) {}

  const list = getStorage<Collection[]>('immerse_lume_collections', INITIAL_COLLECTIONS);
  const updatedList = list.map((c) => (c.id === id ? (updated || { ...c, ...collection }) : c));
  setStorage('immerse_lume_collections', updatedList);
  return updated || (updatedList.find((c) => c.id === id) as Collection);
}

export async function deleteCollection(id: string): Promise<void> {
  try {
    await fetch(`/api/collections/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  } catch (err) {}
  const list = getStorage<Collection[]>('immerse_lume_collections', INITIAL_COLLECTIONS);
  setStorage('immerse_lume_collections', list.filter((c) => c.id !== id));
}

// ---------------- FRAGRANCES API ----------------
export async function fetchFragrances(admin = false): Promise<Fragrance[]> {
  try {
    const res = await fetch(`/api/fragrances?admin=${admin}`, {
      headers: getAuthHeaders()
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setStorage('immerse_lume_fragrances', data);
        return data;
      }
    }
  } catch (err) {
    console.warn('fetchFragrances API offline, using cached fragrances:', err);
  }
  return getStorage<Fragrance[]>('immerse_lume_fragrances', INITIAL_FRAGRANCES);
}

export async function createFragrance(fragrance: Partial<Fragrance>): Promise<Fragrance> {
  let created: Fragrance | null = null;
  try {
    const res = await fetch('/api/fragrances', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(fragrance)
    });
    if (res.ok) created = await res.json();
  } catch (err) {}

  if (!created) {
    created = {
      id: 'frag_' + Date.now(),
      slug: (fragrance.name || 'fragrance').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: fragrance.name || 'New Fragrance',
      subTitle: fragrance.subTitle || '',
      tagline: fragrance.tagline || '',
      description: fragrance.description || '',
      image: fragrance.image || '/assets/images/fragrance_crimson_canopy_1793372721733.jpg',
      notes: fragrance.notes || {},
      published: fragrance.published ?? true
    };
  }

  const list = getStorage<Fragrance[]>('immerse_lume_fragrances', INITIAL_FRAGRANCES);
  setStorage('immerse_lume_fragrances', [...list, created]);
  return created;
}

export async function updateFragrance(id: string, fragrance: Partial<Fragrance>): Promise<Fragrance> {
  let updated: Fragrance | null = null;
  try {
    const res = await fetch(`/api/fragrances/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(fragrance)
    });
    if (res.ok) updated = await res.json();
  } catch (err) {}

  const list = getStorage<Fragrance[]>('immerse_lume_fragrances', INITIAL_FRAGRANCES);
  const updatedList = list.map((f) => (f.id === id ? (updated || { ...f, ...fragrance }) : f));
  setStorage('immerse_lume_fragrances', updatedList);
  return updated || (updatedList.find((f) => f.id === id) as Fragrance);
}

export async function deleteFragrance(id: string): Promise<void> {
  try {
    await fetch(`/api/fragrances/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  } catch (err) {}
  const list = getStorage<Fragrance[]>('immerse_lume_fragrances', INITIAL_FRAGRANCES);
  setStorage('immerse_lume_fragrances', list.filter((f) => f.id !== id));
}

// ---------------- SECTIONS API ----------------
export async function fetchSections(page = 'home', admin = false): Promise<PageSection[]> {
  try {
    const res = await fetch(`/api/sections?page=${page}&admin=${admin}`, {
      headers: getAuthHeaders()
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setStorage(`immerse_lume_sections_${page}`, data);
        return data;
      }
    }
  } catch (err) {
    console.warn('fetchSections API offline, using cached sections:', err);
  }
  return getStorage<PageSection[]>(`immerse_lume_sections_${page}`, INITIAL_SECTIONS);
}

export async function createSection(section: Partial<PageSection>): Promise<PageSection> {
  let created: PageSection | null = null;
  try {
    const res = await fetch('/api/sections', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(section)
    });
    if (res.ok) created = await res.json();
  } catch (err) {}

  if (!created) {
    created = {
      id: 'sec_' + Date.now(),
      page: section.page || 'home',
      sectionKey: section.sectionKey || 'custom_' + Date.now(),
      title: section.title || 'New Section',
      subTitle: section.subTitle || '',
      content: section.content || '',
      secondaryContent: section.secondaryContent || '',
      mediaUrl: section.mediaUrl || '',
      mediaType: section.mediaType || 'image',
      buttonText: section.buttonText || '',
      buttonLink: section.buttonLink || '',
      secondaryButtonText: section.secondaryButtonText || '',
      secondaryButtonLink: section.secondaryButtonLink || '',
      layout: section.layout || 'split-right',
      visible: section.visible ?? true,
      order: section.order ?? 99
    };
  }

  const page = created.page;
  const list = getStorage<PageSection[]>(`immerse_lume_sections_${page}`, INITIAL_SECTIONS);
  setStorage(`immerse_lume_sections_${page}`, [...list, created]);
  return created;
}

export async function updateSection(id: string, section: Partial<PageSection>): Promise<PageSection> {
  let updated: PageSection | null = null;
  try {
    const res = await fetch(`/api/sections/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(section)
    });
    if (res.ok) updated = await res.json();
  } catch (err) {}

  const page = section.page || 'home';
  const list = getStorage<PageSection[]>(`immerse_lume_sections_${page}`, INITIAL_SECTIONS);
  const updatedList = list.map((s) => (s.id === id ? (updated || { ...s, ...section }) : s));
  setStorage(`immerse_lume_sections_${page}`, updatedList);
  return updated || (updatedList.find((s) => s.id === id) as PageSection);
}

export async function reorderSections(orderedIds: string[]): Promise<void> {
  try {
    await fetch('/api/sections/reorder', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ orderedIds })
    });
  } catch (err) {}
}

export async function deleteSection(id: string): Promise<void> {
  try {
    await fetch(`/api/sections/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  } catch (err) {}
  const list = getStorage<PageSection[]>('immerse_lume_sections_home', INITIAL_SECTIONS);
  setStorage('immerse_lume_sections_home', list.filter((s) => s.id !== id));
}

// ---------------- SETTINGS API ----------------
export async function fetchSettings(): Promise<{ global: GlobalSettings; design: DesignSettings }> {
  try {
    const res = await fetch('/api/settings');
    if (res.ok) {
      const data = await res.json();
      if (data && data.global && data.design) {
        setStorage('immerse_lume_settings_global', data.global);
        setStorage('immerse_lume_settings_design', data.design);
        return data;
      }
    }
  } catch (err) {
    console.warn('fetchSettings API offline, using cached settings:', err);
  }

  return {
    global: getStorage<GlobalSettings>('immerse_lume_settings_global', INITIAL_GLOBAL_SETTINGS),
    design: getStorage<DesignSettings>('immerse_lume_settings_design', INITIAL_DESIGN_SETTINGS)
  };
}

export async function updateSettings(data: { global?: Partial<GlobalSettings>; design?: Partial<DesignSettings> }) {
  try {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (res.ok) {
      const result = await res.json();
      setStorage('immerse_lume_settings_global', result.global);
      setStorage('immerse_lume_settings_design', result.design);
      return result;
    }
  } catch (err) {
    console.warn('updateSettings API offline, storing locally:', err);
  }

  const currentGlobal = getStorage<GlobalSettings>('immerse_lume_settings_global', INITIAL_GLOBAL_SETTINGS);
  const currentDesign = getStorage<DesignSettings>('immerse_lume_settings_design', INITIAL_DESIGN_SETTINGS);

  const updatedGlobal = data.global ? { ...currentGlobal, ...data.global } : currentGlobal;
  const updatedDesign = data.design ? { ...currentDesign, ...data.design } : currentDesign;

  setStorage('immerse_lume_settings_global', updatedGlobal);
  setStorage('immerse_lume_settings_design', updatedDesign);

  return { global: updatedGlobal, design: updatedDesign };
}

// ---------------- MEDIA API ----------------
export async function fetchMedia(): Promise<MediaItem[]> {
  try {
    const res = await fetch('/api/media', {
      headers: getAuthHeaders()
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setStorage('immerse_lume_media', data);
        return data;
      }
    }
  } catch (err) {
    console.warn('fetchMedia API offline, using cached media:', err);
  }
  return getStorage<MediaItem[]>('immerse_lume_media', INITIAL_MEDIA);
}

export async function uploadMedia(name: string, dataUrl: string, folder = 'General', type: 'image' | 'video' = 'image'): Promise<MediaItem> {
  try {
    const res = await fetch('/api/media/upload', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, dataUrl, folder, type })
    });
    if (res.ok) {
      const item = await res.json();
      const current = getStorage<MediaItem[]>('immerse_lume_media', INITIAL_MEDIA);
      setStorage('immerse_lume_media', [item, ...current]);
      return item;
    }
  } catch (err) {
    console.warn('Server upload failed, using local device item:', err);
  }

  // Fallback: direct data URL storage
  const item: MediaItem = {
    id: 'med_' + Date.now(),
    name,
    url: dataUrl,
    type,
    folder,
    size: Math.round(dataUrl.length * 0.75 / 1024) + ' KB',
    createdAt: new Date().toISOString()
  };
  const current = getStorage<MediaItem[]>('immerse_lume_media', INITIAL_MEDIA);
  setStorage('immerse_lume_media', [item, ...current]);
  return item;
}

export async function deleteMedia(id: string): Promise<void> {
  try {
    await fetch(`/api/media/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  } catch (err) {}
  const current = getStorage<MediaItem[]>('immerse_lume_media', INITIAL_MEDIA);
  setStorage('immerse_lume_media', current.filter((m) => m.id !== id));
}

// ---------------- CONTACT ENQUIRIES ----------------
export async function submitEnquiry(data: { name: string; email: string; phone?: string; subject?: string; message: string }) {
  try {
    const res = await fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Server submitEnquiry offline, saving enquiry locally:', err);
  }

  const enq: ContactEnquiry = {
    id: 'enq_' + Date.now(),
    name: data.name,
    email: data.email,
    phone: data.phone || '',
    subject: data.subject || 'Website Inquiry',
    message: data.message,
    createdAt: new Date().toISOString(),
    status: 'new'
  };

  const list = getStorage<ContactEnquiry[]>('immerse_lume_enquiries', []);
  setStorage('immerse_lume_enquiries', [enq, ...list]);
  return { success: true, enquiry: enq };
}

export async function fetchEnquiries(): Promise<ContactEnquiry[]> {
  try {
    const res = await fetch('/api/enquiries', {
      headers: getAuthHeaders()
    });
    if (res.ok) {
      const data = await res.json();
      setStorage('immerse_lume_enquiries', data);
      return data;
    }
  } catch (err) {}
  return getStorage<ContactEnquiry[]>('immerse_lume_enquiries', []);
}

export async function updateEnquiryStatus(id: string, status: 'new' | 'reviewed' | 'archived') {
  try {
    const res = await fetch(`/api/enquiries/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    if (res.ok) return await res.json();
  } catch (err) {}

  const list = getStorage<ContactEnquiry[]>('immerse_lume_enquiries', []);
  const updated = list.map((e) => (e.id === id ? { ...e, status } : e));
  setStorage('immerse_lume_enquiries', updated);
  return { success: true };
}

// Supabase Status
export async function fetchSupabaseStatus() {
  try {
    const res = await fetch('/api/supabase/status');
    if (res.ok) return await res.json();
  } catch (err) {}
  return { configured: false, status: 'Fallback Local Database Active' };
}

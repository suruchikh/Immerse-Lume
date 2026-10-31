import React, { useState, useEffect } from 'react';
import {
  Product,
  Collection,
  Fragrance,
  PageSection,
  GlobalSettings,
  DesignSettings,
  MediaItem,
  ContactEnquiry,
  AdminUser
} from './types';
import {
  fetchProducts,
  fetchCollections,
  fetchFragrances,
  fetchSections,
  fetchSettings,
  fetchMedia,
  fetchEnquiries,
  fetchCurrentUser,
  removeAuthToken
} from './services/api';
import {
  INITIAL_PRODUCTS,
  INITIAL_COLLECTIONS,
  INITIAL_FRAGRANCES,
  INITIAL_SECTIONS,
  INITIAL_GLOBAL_SETTINGS,
  INITIAL_DESIGN_SETTINGS,
  INITIAL_MEDIA
} from './data/initialData';

// Public Components
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';
import { EnquiryModal } from './components/EnquiryModal';

// Public Pages
import { HomePage } from './pages/HomePage';
import { StoryPage } from './pages/StoryPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { FragrancesPage } from './pages/FragrancesPage';
import { GiftingPage } from './pages/GiftingPage';
import { ContactPage } from './pages/ContactPage';

// Admin Components
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminCollections } from './pages/admin/AdminCollections';
import { AdminFragrances } from './pages/admin/AdminFragrances';
import { AdminPageBuilder } from './pages/admin/AdminPageBuilder';
import { AdminMediaLibrary } from './pages/admin/AdminMediaLibrary';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminEnquiries } from './pages/admin/AdminEnquiries';
import { AdminSupabase } from './pages/admin/AdminSupabase';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [currentAdminTab, setCurrentAdminTab] = useState<string>('dashboard');

  // Application Data State - Pre-populated with luxury brand catalog
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [collections, setCollections] = useState<Collection[]>(INITIAL_COLLECTIONS);
  const [fragrances, setFragrances] = useState<Fragrance[]>(INITIAL_FRAGRANCES);
  const [sections, setSections] = useState<PageSection[]>(INITIAL_SECTIONS);
  const [settings, setSettings] = useState<GlobalSettings>(INITIAL_GLOBAL_SETTINGS);
  const [design, setDesign] = useState<DesignSettings>(INITIAL_DESIGN_SETTINGS);
  const [media, setMedia] = useState<MediaItem[]>(INITIAL_MEDIA);
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);

  // Auth State
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [enquirySubject, setEnquirySubject] = useState<string>('');

  // Initial Data Fetch
  const loadData = async (isAdmin = false) => {
    try {
      const [prodsData, colsData, fragsData, secsData, settingsData] = await Promise.all([
        fetchProducts(isAdmin).catch(() => INITIAL_PRODUCTS),
        fetchCollections(isAdmin).catch(() => INITIAL_COLLECTIONS),
        fetchFragrances(isAdmin).catch(() => INITIAL_FRAGRANCES),
        fetchSections('home', isAdmin).catch(() => INITIAL_SECTIONS),
        fetchSettings().catch(() => ({ global: INITIAL_GLOBAL_SETTINGS, design: INITIAL_DESIGN_SETTINGS }))
      ]);

      if (prodsData && prodsData.length > 0) setProducts(prodsData);
      if (colsData && colsData.length > 0) setCollections(colsData);
      if (fragsData && fragsData.length > 0) setFragrances(fragsData);
      if (secsData && secsData.length > 0) setSections(secsData);
      if (settingsData?.global) setSettings(settingsData.global);
      if (settingsData?.design) setDesign(settingsData.design);

      // If admin, load media and enquiries
      if (isAdmin) {
        const [mediaData, enqsData] = await Promise.all([
          fetchMedia().catch(() => INITIAL_MEDIA),
          fetchEnquiries().catch(() => [])
        ]);
        if (mediaData && mediaData.length > 0) setMedia(mediaData);
        if (enqsData) setEnquiries(enqsData);
      }
    } catch (err) {
      console.warn('Non-blocking background data sync notice:', err);
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Safety timeout: dismiss luxury splash after 600ms so website never gets stuck
    const splashTimer = setTimeout(() => {
      if (isMounted) setInitialLoading(false);
    }, 600);

    async function init() {
      try {
        const user = await fetchCurrentUser();
        if (user?.user && isMounted) {
          setAdminUser(user.user);
          await loadData(true);
        } else if (isMounted) {
          await loadData(false);
        }
      } catch (err) {
        if (isMounted) await loadData(false);
      } finally {
        if (isMounted) setInitialLoading(false);
      }
    }
    init();

    // Check search params and hash on initial mount
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const catParam = searchParams.get('category');
      if (catParam) {
        setCategoryFilter(decodeURIComponent(catParam));
      }
      if (window.location.hash) {
        const hashId = window.location.hash.substring(1);
        setTimeout(() => {
          const el = document.getElementById(hashId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    } catch (e) {
      // Ignore URL parsing errors
    }

    // Listen to popstate
    const handlePopState = () => {
      const path = window.location.pathname || '/';
      const searchParams = new URLSearchParams(window.location.search);
      const catParam = searchParams.get('category');
      if (catParam) {
        setCategoryFilter(decodeURIComponent(catParam));
      } else {
        setCategoryFilter('All');
      }
      setCurrentPath(path);
      if (window.location.hash) {
        const hashId = window.location.hash.substring(1);
        setTimeout(() => {
          const el = document.getElementById(hashId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      isMounted = false;
      clearTimeout(splashTimer);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleNavigate = (path: string) => {
    if (path.includes('?category=')) {
      const [base, query] = path.split('?category=');
      const cat = decodeURIComponent(query);
      setCategoryFilter(cat);
      setCurrentPath(base);
      window.history.pushState({}, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (path.includes('#')) {
      const [base, hash] = path.split('#');
      setCategoryFilter('All');
      setCurrentPath(base || '/');
      window.history.pushState({}, '', path);
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    setCategoryFilter('All');
    setCurrentPath(path);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEnquiry = (subject?: string) => {
    setEnquirySubject(subject || 'Concierge Product Enquiry');
    setEnquiryModalOpen(true);
  };

  const handleLogout = () => {
    removeAuthToken();
    setAdminUser(null);
    setCurrentPath('/');
    loadData(false);
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center space-y-4 transition-opacity duration-500">
        <span className="font-serif text-2xl tracking-[0.24em] uppercase text-[#1C1B1A]">
          IMMERSE LUME
        </span>
        <div className="w-12 h-[1px] bg-[#C29B38] animate-pulse" />
        <span className="text-[11px] uppercase tracking-[0.2em] text-[#8A7E72]">
          Elevate Every Moment
        </span>
      </div>
    );
  }

  // ---------------- ADMIN PANEL ROUTE ----------------
  if (currentPath.startsWith('/admin')) {
    if (!adminUser) {
      return (
        <AdminLogin
          onLoginSuccess={(user) => {
            setAdminUser(user);
            loadData(true);
          }}
          onBackToWebsite={() => handleNavigate('/')}
        />
      );
    }

    return (
      <AdminLayout
        currentTab={currentAdminTab}
        onSelectTab={setCurrentAdminTab}
        onLogout={handleLogout}
        onViewWebsite={() => handleNavigate('/')}
        newEnquiriesCount={enquiries.filter((e) => e.status === 'new').length}
        user={adminUser}
      >
        {currentAdminTab === 'dashboard' && (
          <AdminDashboard
            products={products}
            collections={collections}
            fragrances={fragrances}
            sections={sections}
            enquiries={enquiries}
            onNavigateTab={setCurrentAdminTab}
            onOpenCreateProduct={() => setCurrentAdminTab('products')}
            onViewWebsite={() => handleNavigate('/')}
          />
        )}

        {currentAdminTab === 'products' && (
          <AdminProducts
            products={products}
            fragrances={fragrances}
            collections={collections}
            onRefresh={() => loadData(true)}
          />
        )}

        {currentAdminTab === 'collections' && (
          <AdminCollections
            collections={collections}
            onRefresh={() => loadData(true)}
          />
        )}

        {currentAdminTab === 'fragrances' && (
          <AdminFragrances
            fragrances={fragrances}
            onRefresh={() => loadData(true)}
          />
        )}

        {currentAdminTab === 'page_builder' && (
          <AdminPageBuilder
            sections={sections}
            onRefresh={() => loadData(true)}
          />
        )}

        {currentAdminTab === 'media' && (
          <AdminMediaLibrary
            media={media}
            onRefresh={() => loadData(true)}
          />
        )}

        {currentAdminTab === 'settings' && (
          <AdminSettings
            settings={settings}
            design={design}
            onRefresh={() => loadData(true)}
          />
        )}

        {currentAdminTab === 'enquiries' && (
          <AdminEnquiries
            enquiries={enquiries}
            onRefresh={() => loadData(true)}
          />
        )}

        {currentAdminTab === 'supabase' && (
          <AdminSupabase />
        )}
      </AdminLayout>
    );
  }

  // ---------------- PUBLIC WEBSITE ROUTES ----------------
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1C1B1A] flex flex-col font-sans selection:bg-[#E8D8B8]">
      {/* 1. Announcement Bar */}
      <AnnouncementBar settings={settings} onNavigate={handleNavigate} />

      {/* 2. Navigation Header */}
      <Navbar
        currentPath={currentPath}
        onNavigate={handleNavigate}
        settings={settings}
        collections={collections}
      />

      {/* 3. Page Content */}
      <main className="flex-1">
        {currentPath === '/' && (
          <HomePage
            products={products}
            collections={collections}
            fragrances={fragrances}
            sections={sections}
            settings={settings}
            onNavigate={handleNavigate}
            onSelectProduct={setSelectedProduct}
            onOpenEnquiry={handleOpenEnquiry}
          />
        )}

        {currentPath === '/story' && (
          <StoryPage
            onNavigate={handleNavigate}
            onOpenEnquiry={() => handleOpenEnquiry('Brand Story Enquiry')}
          />
        )}

        {currentPath === '/collections' && (
          <CollectionsPage
            products={products}
            collections={collections}
            initialCategory={categoryFilter}
            onSelectProduct={setSelectedProduct}
          />
        )}

        {currentPath === '/fragrances' && (
          <FragrancesPage
            fragrances={fragrances}
            products={products}
            onSelectProduct={setSelectedProduct}
            onNavigate={handleNavigate}
            onOpenEnquiry={handleOpenEnquiry}
          />
        )}

        {currentPath === '/gifting' && (
          <GiftingPage
            products={products}
            onSelectProduct={setSelectedProduct}
            onOpenEnquiry={handleOpenEnquiry}
          />
        )}

        {currentPath === '/contact' && (
          <ContactPage settings={settings} />
        )}

        {!['/', '/story', '/collections', '/fragrances', '/gifting', '/contact'].includes(currentPath) && (
          <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-20 text-center space-y-6">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#C29B38] font-medium">
              404 · Sanctuary Unseen
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-medium text-[#1C1B1A]">
              Page Not Found
            </h1>
            <p className="text-xs sm:text-sm text-[#5C5854] font-light max-w-md mx-auto leading-relaxed">
              The page or sanctuary you are seeking does not exist or has been relocated. We invite you to return to our curated home.
            </p>
            <button
              onClick={() => handleNavigate('/')}
              className="px-8 py-3.5 bg-[#1C1B1A] text-[#FDFBF7] hover:bg-[#323827] text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer"
            >
              Return to Sanctuary
            </button>
          </div>
        )}
      </main>

      {/* 4. Luxury Brand Footer */}
      <Footer
        settings={settings}
        collections={collections}
        onNavigate={handleNavigate}
      />

      {/* 5. Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        fragrancesList={fragrances}
        onClose={() => setSelectedProduct(null)}
        onOpenEnquiry={handleOpenEnquiry}
        onSelectRelated={setSelectedProduct}
        allProducts={products}
      />

      {/* 6. Concierge Enquiry Modal */}
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        defaultSubject={enquirySubject}
      />
    </div>
  );
}

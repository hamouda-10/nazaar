import { useCallback, useEffect, useMemo, useState } from 'react';
import BoutiquesModal from './components/BoutiquesModal';
import CartDrawer from './components/CartDrawer';
import CatalogView from './components/CatalogView';
import CheckoutModal from './components/CheckoutModal';
import CustomCursor from './components/CustomCursor';
import FramePreviewModal from './components/FramePreviewModal';
import Header, { AppView } from './components/Header';
import MenuOverlay from './components/MenuOverlay';
import ProductModal from './components/ProductModal';
import SphereStage, { SCULPTURE_REST_VH } from './components/SphereStage';
import { EYEWEAR_PRODUCTS, EyewearProduct, LENS_PACKAGES, LensPackage } from './data/eyewear';
import { Lang } from './data/i18n';
import { CartItem, OrderReceipt, PrescriptionData } from './types/store';

const CART_STORAGE_KEY = 'nazar_atelier_cart_v1';

export default function App() {
  const [lang, setLang] = useState<Lang>('ar');
  const [revealed, setRevealed] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [activeSection, setActiveSection] = useState<AppView>('sphere');
  const [menuOpen, setMenuOpen] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<EyewearProduct | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<EyewearProduct | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [boutiquesOpen, setBoutiquesOpen] = useState(false);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = window.localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (item): item is CartItem =>
              Boolean(
                item &&
                  typeof item.uid === 'string' &&
                  item.product &&
                  typeof item.product.id === 'string' &&
                  typeof item.product.price === 'number' &&
                  item.lens &&
                  typeof item.lens.priceDelta === 'number' &&
                  typeof item.quantity === 'number' &&
                  item.quantity > 0
              )
          );
        }
      }
    } catch {
      // ignore storage errors
    }
    return [];
  });

  // Sync HTML lang & dir attributes
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title =
      lang === 'ar'
        ? 'دار نَظَر للبصريات — Nazar Optical Atelier'
        : 'Nazar Optical Atelier — Luxury Eyewear Saudi Arabia';
  }, [lang]);

  // Persist cart
  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Global Escape key priority handler
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (checkoutOpen) {
        setCheckoutOpen(false);
      } else if (boutiquesOpen) {
        setBoutiquesOpen(false);
      } else if (cartOpen) {
        setCartOpen(false);
      } else if (selectedProduct) {
        setSelectedProduct(null);
      } else if (previewProduct) {
        setPreviewProduct(null);
      } else if (menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [checkoutOpen, boutiquesOpen, cartOpen, selectedProduct, previewProduct, menuOpen]);

  const handleIntroReveal = useCallback(() => {
    setRevealed(true);
  }, []);

  const handleReplayIntro = useCallback(() => {
    setMenuOpen(false);
    setRevealed(false);
    setActiveSection('sphere');
    window.scrollTo(0, 0);
    setReplayKey((k) => k + 1);
  }, []);

  const handleNavigateView = useCallback((nextView: AppView, scrollToLensLab = false) => {
    setMenuOpen(false);
    if (nextView === 'sphere') {
      const restY = Math.round(window.innerHeight * SCULPTURE_REST_VH);
      window.scrollTo({ top: restY, behavior: 'smooth' });
    } else if (scrollToLensLab) {
      document.getElementById('lens-lab')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const addToCart = useCallback(
    (
      product: EyewearProduct,
      colorId: string,
      lens: LensPackage,
      prescription?: PrescriptionData
    ) => {
      const rxSig = prescription ? JSON.stringify(prescription) : 'none';
      const uid = `${product.id}__${colorId}__${lens.id}__${rxSig}`;
      setCart((prev) => {
        const idx = prev.findIndex((item) => item.uid === uid);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
          return next;
        }
        return [
          ...prev,
          {
            uid,
            product,
            colorId,
            lens,
            prescription,
            quantity: 1,
          },
        ];
      });
    },
    []
  );

  const handleQuickAdd = useCallback(
    (product: EyewearProduct) => {
      const defaultLens =
        LENS_PACKAGES.find((l) => l.id === product.defaultLensId) ?? LENS_PACKAGES[0];
      const defaultColor = product.colors[0]?.id ?? '';
      addToCart(product, defaultColor, defaultLens);
    },
    [addToCart]
  );

  const handleUpdateQty = useCallback((uid: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.uid === uid ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const handleRemoveItem = useCallback((uid: string) => {
    setCart((prev) => prev.filter((item) => item.uid !== uid));
  }, []);

  const handleApplyPromo = useCallback((code: string): boolean => {
    if (code === 'KSA15' || code === 'RIYADH') {
      setPromoCode(code);
      return true;
    }
    return false;
  }, []);

  const handleOrderComplete = useCallback((_receipt: OrderReceipt) => {
    setCart([]);
    setPromoCode(null);
  }, []);

  const cartCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

  return (
    <div className="min-h-screen bg-black text-[#f4f2ef] selection:bg-[#d4b483] selection:text-black">
      <CustomCursor />

      <Header
        lang={lang}
        view={activeSection}
        revealed={revealed}
        menuOpen={menuOpen}
        cartCount={cartCount}
        onToggleLang={() => setLang((prev) => (prev === 'ar' ? 'en' : 'ar'))}
        onNavigateView={handleNavigateView}
        onOpenBoutiques={() => {
          setMenuOpen(false);
          setBoutiquesOpen(true);
        }}
        onOpenCart={() => {
          setMenuOpen(false);
          setCartOpen(true);
        }}
        onToggleMenu={() => setMenuOpen((v) => !v)}
      />

      <MenuOverlay
        open={menuOpen}
        lang={lang}
        onClose={() => setMenuOpen(false)}
        onNavigateView={handleNavigateView}
        onOpenBoutiques={() => setBoutiquesOpen(true)}
      />

      {/* Continuous Scroll Experience: Eye Portal -> 62-Glasses 3D Sculpture -> Full Shopping Catalog */}
      <SphereStage
        products={EYEWEAR_PRODUCTS}
        lang={lang}
        revealed={revealed}
        replayKey={replayKey}
        focusedId={previewProduct?.id ?? selectedProduct?.id ?? null}
        onRevealed={handleIntroReveal}
        onSectionChange={setActiveSection}
        onPreviewProduct={setPreviewProduct}
        onOpenCatalog={() => handleNavigateView('catalog', false)}
        onReplayIntro={handleReplayIntro}
      />

      <CatalogView
        products={EYEWEAR_PRODUCTS}
        lang={lang}
        onSelectProduct={setSelectedProduct}
        onQuickAdd={handleQuickAdd}
        onBackToSphere={() => handleNavigateView('sphere')}
        onOpenBoutiques={() => setBoutiquesOpen(true)}
      />

      {/* Standalone Quick 3D Frame Preview Modal (opened directly from the 3D glasses without shopping) */}
      <FramePreviewModal
        product={previewProduct}
        products={EYEWEAR_PRODUCTS}
        lang={lang}
        onClose={() => setPreviewProduct(null)}
        onSelectProduct={setPreviewProduct}
        onOpenOrderConfig={(product) => {
          setPreviewProduct(null);
          setSelectedProduct(product);
        }}
      />

      <ProductModal
        product={selectedProduct}
        lang={lang}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
      />

      <CartDrawer
        open={cartOpen}
        lang={lang}
        items={cart}
        promoCode={promoCode}
        onClose={() => setCartOpen(false)}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onApplyPromo={handleApplyPromo}
        onProceedCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
        onExploreFrames={() => handleNavigateView('catalog', false)}
      />

      <CheckoutModal
        open={checkoutOpen}
        lang={lang}
        items={cart}
        promoCode={promoCode}
        onClose={() => setCheckoutOpen(false)}
        onOrderComplete={handleOrderComplete}
      />

      <BoutiquesModal
        open={boutiquesOpen}
        lang={lang}
        onClose={() => setBoutiquesOpen(false)}
      />
    </div>
  );
}

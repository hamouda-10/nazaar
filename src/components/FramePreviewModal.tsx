import { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { EyewearProduct } from '../data/eyewear';
import { Lang, T } from '../data/i18n';
import { getTransparentCutoutUrl } from '../utils/cutout';

interface FramePreviewModalProps {
  product: EyewearProduct | null;
  products: EyewearProduct[];
  lang: Lang;
  onClose: () => void;
  onSelectProduct: (product: EyewearProduct) => void;
  onOpenOrderConfig: (product: EyewearProduct) => void;
}

export default function FramePreviewModal({
  product,
  products,
  lang,
  onClose,
  onSelectProduct,
  onOpenOrderConfig,
}: FramePreviewModalProps) {
  const copy = T[lang];
  const [viewMode, setViewMode] = useState<'cutout' | 'studio'>('cutout');
  const [zoom, setZoom] = useState<number>(1);
  const [rotX, setRotX] = useState<number>(-4);
  const [rotY, setRotY] = useState<number>(10);
  const [cutoutUrl, setCutoutUrl] = useState<string | null>(null);
  const [selectedColorIdx, setSelectedColorIdx] = useState<number>(0);

  const draggingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  // Load transparent PNG cutout for the previewed frame
  useEffect(() => {
    if (!product) return;
    let alive = true;
    setZoom(1);
    setRotX(-4);
    setRotY(10);
    setSelectedColorIdx(0);
    setCutoutUrl(null);

    getTransparentCutoutUrl(product.cutoutImage, {
      clearWhiteLenses: product.clearWhiteLenses,
    }).then((url) => {
      if (alive) setCutoutUrl(url);
    });

    return () => {
      alive = false;
    };
  }, [product]);

  // Keyboard navigation (Left / Right arrows to browse frames inside preview)
  useEffect(() => {
    if (!product) return;
    const currentIndex = products.findIndex((p) => p.id === product.id);
    if (currentIndex < 0) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        const nextIdx = (currentIndex + 1) % products.length;
        onSelectProduct(products[nextIdx]);
      } else if (e.key === 'ArrowLeft') {
        const prevIdx = (currentIndex - 1 + products.length) % products.length;
        onSelectProduct(products[prevIdx]);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [product, products, onSelectProduct]);

  if (!product) return null;

  const currentIndex = products.findIndex((p) => p.id === product.id);
  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + products.length) % products.length;
    onSelectProduct(products[prevIdx]);
  };
  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % products.length;
    onSelectProduct(products[nextIdx]);
  };

  const handleStagePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handleStagePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastPosRef.current.x;
    const dy = e.clientY - lastPosRef.current.y;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    setRotY((prev) => Math.max(-55, Math.min(55, prev + dx * 0.45)));
    setRotX((prev) => Math.max(-35, Math.min(35, prev - dy * 0.38)));
  };

  const handleStagePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const activeColor = product.colors[selectedColorIdx] ?? product.colors[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="previewTitle"
      className="fixed inset-0 z-[105] flex items-center justify-center p-3 sm:p-6 bg-black/88 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[960px] bg-[#08080a] border border-[#d4b483]/30 rounded-2xl overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.92)] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar: Preview Mode Switcher + Counter + Close */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-[#f4f2ef]/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#d4b483]">
              <Eye className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'معاينة سريعة للنظارة' : 'Quick Frame Preview'}</span>
            </span>
            <span className="text-[#f4f2ef]/25 text-xs">·</span>
            <span className="text-xs text-[#9b9691] tabular-nums">
              {currentIndex + 1} / {products.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center bg-black border border-[#f4f2ef]/15 rounded-md p-0.5 text-[11px]">
              <button
                type="button"
                onClick={() => setViewMode('cutout')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer whitespace-nowrap ${
                  viewMode === 'cutout'
                    ? 'bg-[#d4b483] text-black font-medium'
                    : 'text-[#f4f2ef]/70 hover:text-white'
                }`}
              >
                {lang === 'ar' ? 'عرض 3D حر' : '3D Floating'}
              </button>
              <button
                type="button"
                onClick={() => setViewMode('studio')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer whitespace-nowrap ${
                  viewMode === 'studio'
                    ? 'bg-[#d4b483] text-black font-medium'
                    : 'text-[#f4f2ef]/70 hover:text-white'
                }`}
              >
                {lang === 'ar' ? 'صورة الاستوديو' : 'Studio Shot'}
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label={copy.close}
              className="min-w-[38px] min-h-[38px] px-2.5 bg-black/70 hover:bg-[#1a1a1f] text-[#f4f2ef] border border-[#f4f2ef]/25 hover:border-white rounded-md inline-flex items-center justify-center gap-1.5 text-xs transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Preview Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Interactive Visual Inspection Stage */}
          <div className="lg:col-span-7 relative bg-[radial-gradient(ellipse_75%_70%_at_50%_46%,rgba(212,180,131,0.14)_0%,rgba(12,12,15,0.96)_62%,#050507_100%)] border-b lg:border-b-0 lg:border-e border-[#f4f2ef]/10 min-h-[300px] sm:min-h-[410px] flex flex-col justify-between overflow-hidden">
            {/* Prev / Next Frame Navigation */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label={lang === 'ar' ? 'النظارة السابقة' : 'Previous frame'}
              className="absolute top-1/2 -translate-y-1/2 start-3 z-20 w-10 h-10 rounded-full bg-black/70 border border-[#f4f2ef]/20 hover:border-[#d4b483] text-[#f4f2ef] hover:text-[#d4b483] flex items-center justify-center transition-colors cursor-pointer"
            >
              {lang === 'ar' ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label={lang === 'ar' ? 'النظارة التالية' : 'Next frame'}
              className="absolute top-1/2 -translate-y-1/2 end-3 z-20 w-10 h-10 rounded-full bg-black/70 border border-[#f4f2ef]/20 hover:border-[#d4b483] text-[#f4f2ef] hover:text-[#d4b483] flex items-center justify-center transition-colors cursor-pointer"
            >
              {lang === 'ar' ? (
                <ChevronLeft className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>

            {/* Interactive Drag-to-Tilt Inspection Surface */}
            <div
              onPointerDown={handleStagePointerDown}
              onPointerMove={handleStagePointerMove}
              onPointerUp={handleStagePointerUp}
              onPointerCancel={handleStagePointerUp}
              className="flex-1 flex items-center justify-center p-8 sm:p-12 cursor-grab active:cursor-grabbing select-none touch-none"
              style={{ perspective: '900px' }}
            >
              {viewMode === 'cutout' ? (
                <div
                  className="w-full max-w-[380px] aspect-[4/3] flex items-center justify-center transition-transform duration-100 ease-out"
                  style={{
                    transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${zoom})`,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <img
                    src={cutoutUrl ?? product.cutoutImage}
                    alt={product.name[lang]}
                    draggable={false}
                    className={`w-full h-full object-contain drop-shadow-[0_24px_38px_rgba(0,0,0,0.88)] transition-opacity duration-300 ${
                      cutoutUrl ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </div>
              ) : (
                <div
                  className="w-full max-w-[440px] aspect-[4/3] rounded-xl overflow-hidden border border-[#f4f2ef]/15 transition-transform duration-150 ease-out shadow-2xl"
                  style={{
                    transform: `rotateX(${rotX * 0.35}deg) rotateY(${rotY * 0.35}deg) scale(${zoom})`,
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name[lang]}
                    draggable={false}
                    style={product.imageFilter ? { filter: product.imageFilter } : undefined}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Bottom Stage Controls: Zoom + Reset + Hint */}
            <div className="px-4 py-3 border-t border-[#f4f2ef]/10 bg-black/50 flex items-center justify-between gap-3 text-[11px] text-[#9b9691]">
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#d4b483]" />
                <span>
                  {lang === 'ar'
                    ? 'اسحب على النظارة لتحريكها ومعاينة الزوايا'
                    : 'Drag on the frame to tilt & inspect'}
                </span>
              </span>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(0.85, Number((z - 0.2).toFixed(2))))}
                  aria-label="Zoom out"
                  className="w-8 h-8 rounded bg-black border border-[#f4f2ef]/20 hover:border-[#d4b483] text-[#f4f2ef] flex items-center justify-center cursor-pointer"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(1.75, Number((z + 0.2).toFixed(2))))}
                  aria-label="Zoom in"
                  className="w-8 h-8 rounded bg-black border border-[#f4f2ef]/20 hover:border-[#d4b483] text-[#f4f2ef] flex items-center justify-center cursor-pointer"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setZoom(1);
                    setRotX(-4);
                    setRotY(10);
                  }}
                  aria-label="Reset preview"
                  className="w-8 h-8 rounded bg-black border border-[#f4f2ef]/20 hover:border-[#d4b483] text-[#f4f2ef] flex items-center justify-center cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Info Panel: Pure Price, Specs & Colors (No Heavy Shopping Form) */}
          <div className="lg:col-span-5 p-5 sm:p-7 flex flex-col justify-between gap-6">
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#9b9691] mb-1.5">
                  <span>{product.sku}</span>
                  <span aria-hidden="true">·</span>
                  <span>{product.shape[lang]}</span>
                  {product.badge && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#d4b483]">{product.badge[lang]}</span>
                    </>
                  )}
                </div>

                <h2
                  id="previewTitle"
                  className="font-editorial text-2xl sm:text-3xl text-[#f4f2ef] leading-snug"
                >
                  {product.name[lang]}
                </h2>
                <p className="text-xs text-[#f4f2ef]/65 mt-1">{product.subtitle[lang]}</p>

                <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-2xl font-semibold text-[#d4b483] tabular-nums">
                    {product.price.toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US')} {copy.sar}
                  </span>
                  <span className="text-xs text-[#9b9691]">{copy.vatIncluded}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm leading-relaxed text-[#f4f2ef]/80">
                {product.note[lang]}
              </p>

              {/* Available Finishes Preview */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[#9b9691]">
                    {lang === 'ar' ? 'الألوان المتوفرة' : 'Available Finishes'}
                  </span>
                  <span className="text-[#f4f2ef] font-medium">{activeColor?.name[lang]}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {product.colors.map((c, idx) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedColorIdx(idx)}
                      className={`px-2.5 py-1.5 rounded-md border text-xs inline-flex items-center gap-2 transition-colors cursor-pointer ${
                        idx === selectedColorIdx
                          ? 'border-[#d4b483] bg-[#161513] text-white'
                          : 'border-[#f4f2ef]/15 bg-[#0f0f11] text-[#f4f2ef]/75 hover:border-[#f4f2ef]/40'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-white/30"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name[lang]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Technical Frame Specifications */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#f4f2ef]/10 text-xs">
                <div>
                  <span className="text-[#9b9691] block">{copy.materialLabel}</span>
                  <span className="text-[#f4f2ef] font-medium">{product.material[lang]}</span>
                </div>
                <div>
                  <span className="text-[#9b9691] block">{copy.originLabel}</span>
                  <span className="text-[#f4f2ef] font-medium">{product.origin[lang]}</span>
                </div>
                <div>
                  <span className="text-[#9b9691] block">{copy.dimensionsLabel}</span>
                  <span className="text-[#f4f2ef] font-medium tabular-nums" dir="ltr">
                    {product.dimensions}
                  </span>
                </div>
                <div>
                  <span className="text-[#9b9691] block">{copy.weightLabel}</span>
                  <span className="text-[#f4f2ef] font-medium tabular-nums">{product.weight}</span>
                </div>
              </div>
            </div>

            {/* Quiet Optional Actions: Close Preview or Optionally Customize/Order */}
            <div className="pt-4 border-t border-[#f4f2ef]/10 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 min-h-[44px] px-4 py-2.5 text-xs font-medium bg-[#f4f2ef] text-black hover:bg-[#d4b483] rounded-md transition-colors cursor-pointer"
              >
                {lang === 'ar' ? 'إغلاق المعاينة والعودة للمجسم' : 'Close Preview'}
              </button>
              <button
                type="button"
                onClick={() => onOpenOrderConfig(product)}
                className="min-h-[44px] px-4 py-2.5 text-xs font-medium text-[#f4f2ef]/85 hover:text-[#d4b483] border border-[#f4f2ef]/20 hover:border-[#d4b483] rounded-md transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'تخصيص وطلب' : 'Order / Lenses'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

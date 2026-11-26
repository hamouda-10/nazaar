import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, ChevronUp, ShoppingBag, X } from 'lucide-react';
import { EyewearProduct, LENS_PACKAGES, LensPackage } from '../data/eyewear';
import { Lang, T } from '../data/i18n';
import { PrescriptionData } from '../types/store';

interface ProductModalProps {
  product: EyewearProduct | null;
  lang: Lang;
  onClose: () => void;
  onAddToCart: (
    product: EyewearProduct,
    colorId: string,
    lens: LensPackage,
    prescription?: PrescriptionData
  ) => void;
}

const SPH_OPTIONS = [
  '0.00',
  '-0.50',
  '-1.00',
  '-1.50',
  '-2.00',
  '-2.50',
  '-3.00',
  '-3.50',
  '-4.00',
  '-5.00',
  '+1.00',
  '+1.50',
  '+2.00',
  '+2.50',
  '+3.00',
];

const CYL_OPTIONS = ['0.00', '-0.25', '-0.50', '-0.75', '-1.00', '-1.50', '-2.00'];

export default function ProductModal({
  product,
  lang,
  onClose,
  onAddToCart,
}: ProductModalProps) {
  const copy = T[lang];
  const [selectedColorId, setSelectedColorId] = useState<string>('');
  const [selectedLensId, setSelectedLensId] = useState<string>('clear-ar');
  const [showRx, setShowRx] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [rx, setRx] = useState<PrescriptionData>({
    sendLater: false,
    odSph: '-1.00',
    odCyl: '0.00',
    odAxis: '90',
    osSph: '-1.00',
    osCyl: '0.00',
    osAxis: '90',
    pd: '63',
  });

  const closeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (!product) return;
    setSelectedColorId(product.colors[0]?.id ?? '');
    setSelectedLensId(product.defaultLensId || 'clear-ar');
    setShowRx(false);
    setAddedFeedback(false);

    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };
  }, [product]);

  if (!product) return null;

  const selectedLens =
    LENS_PACKAGES.find((l) => l.id === selectedLensId) ?? LENS_PACKAGES[0];
  const selectedColor =
    product.colors.find((c) => c.id === selectedColorId) ?? product.colors[0];
  const unitPrice = product.price + selectedLens.priceDelta;
  const installment = Math.ceil(unitPrice / 4);

  const handleSubmit = () => {
    onAddToCart(
      product,
      selectedColor?.id ?? '',
      selectedLens,
      showRx ? rx : undefined
    );
    setAddedFeedback(true);
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      onClose();
    }, 550);
  };

  return (
    <div
      id="lit"
      role="dialog"
      aria-modal="true"
      aria-labelledby="litTitle"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[1040px] bg-[#0b0b0d] border border-[#f4f2ef]/16 rounded-xl overflow-hidden shadow-2xl my-auto max-h-[92dvh] flex flex-col lg:grid lg:grid-cols-12"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label={copy.close}
          className="absolute top-3.5 end-3.5 z-20 min-w-[42px] min-h-[42px] px-3 bg-black/70 hover:bg-black text-[#f4f2ef] border border-[#f4f2ef]/30 hover:border-white rounded-md inline-flex items-center justify-center gap-1.5 text-xs transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
          <span className="hidden sm:inline">{copy.close}</span>
        </button>

        {/* Left Column: High-Res Studio Photo & Frame Specs */}
        <div className="lg:col-span-6 bg-[#070708] flex flex-col justify-between border-b lg:border-b-0 lg:border-e border-[#f4f2ef]/12">
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <img
              src={product.image}
              alt={product.name[lang]}
              referrerPolicy="no-referrer"
              style={product.imageFilter ? { filter: product.imageFilter } : undefined}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-5 sm:p-6 space-y-4">
            <p className="text-xs sm:text-sm leading-relaxed text-[#f4f2ef]/80">
              {product.note[lang]}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#f4f2ef]/10 text-xs">
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
        </div>

        {/* Right Column: Contiguous Purchase & Lens Configurator */}
        <div className="lg:col-span-6 p-5 sm:p-7 overflow-y-auto space-y-6">
          {/* Header & Price */}
          <div className="pe-10">
            <div className="flex items-center gap-2 text-xs text-[#9b9691] mb-1.5">
              <span>{product.sku}</span>
              <span aria-hidden="true">·</span>
              <span>{product.shape[lang]}</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#d4b483]">{copy.inStock}</span>
            </div>
            <h2
              id="litTitle"
              className="font-editorial text-2xl sm:text-3xl text-[#f4f2ef] leading-tight"
            >
              {product.name[lang]}
            </h2>
            <p className="text-xs text-[#f4f2ef]/65 mt-1">{product.subtitle[lang]}</p>

            <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-2xl font-semibold text-[#f4f2ef] tabular-nums">
                {unitPrice.toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US')} {copy.sar}
              </span>
              <span className="text-xs text-[#9b9691]">{copy.vatIncluded}</span>
            </div>

            <p className="mt-1.5 text-xs text-[#d4b483] tabular-nums">
              {copy.installmentNote} {installment} {copy.sar} (Tamara / Tabby)
            </p>
          </div>

          {/* Color Finish Selector */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2.5">
              <span className="text-[#9b9691]">{copy.chooseColor}</span>
              <span className="text-[#f4f2ef] font-medium">{selectedColor?.name[lang]}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              {product.colors.map((c) => {
                const active = c.id === selectedColor?.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedColorId(c.id)}
                    className={`min-h-[40px] px-3 py-1.5 rounded-md border text-xs inline-flex items-center gap-2 transition-colors cursor-pointer ${
                      active
                        ? 'border-[#d4b483] bg-[#161513] text-white'
                        : 'border-[#f4f2ef]/15 bg-[#0f0f11] text-[#f4f2ef]/75 hover:border-[#f4f2ef]/40'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/30 shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name[lang]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lens Package Selector */}
          <div>
            <div className="text-xs text-[#9b9691] mb-2.5">{copy.chooseLens}</div>
            <div className="space-y-2">
              {LENS_PACKAGES.map((lens) => {
                const active = lens.id === selectedLens.id;
                return (
                  <button
                    key={lens.id}
                    type="button"
                    onClick={() => setSelectedLensId(lens.id)}
                    className={`w-full text-start p-3 rounded-md border transition-colors cursor-pointer flex items-start justify-between gap-3 ${
                      active
                        ? 'border-[#d4b483] bg-[#161513]'
                        : 'border-[#f4f2ef]/14 bg-[#0f0f11] hover:border-[#f4f2ef]/35'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-medium text-[#f4f2ef]">
                        {lens.name[lang]}
                      </div>
                      <div className="text-[11px] text-[#9b9691] mt-0.5 leading-snug">
                        {lens.description[lang]}
                      </div>
                    </div>
                    <span className="text-xs font-medium text-[#d4b483] tabular-nums whitespace-nowrap shrink-0">
                      {lens.priceDelta === 0
                        ? copy.free
                        : `+${lens.priceDelta} ${copy.sar}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Prescription Drawer */}
          {selectedLens.requiresRx && (
            <div className="border border-[#f4f2ef]/14 rounded-md bg-[#0f0f11] overflow-hidden">
              <button
                type="button"
                onClick={() => setShowRx((v) => !v)}
                className="w-full min-h-[44px] px-4 py-2.5 flex items-center justify-between text-xs font-medium text-[#f4f2ef] cursor-pointer hover:bg-[#f4f2ef]/5 transition-colors"
              >
                <span>{copy.prescriptionToggle}</span>
                {showRx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showRx && (
                <div className="p-4 pt-2 border-t border-[#f4f2ef]/10 space-y-3 text-xs">
                  <p className="text-[11px] text-[#9b9691] leading-relaxed">
                    {copy.prescriptionHint}
                  </p>

                  <label className="flex items-center gap-2 cursor-pointer text-[#f4f2ef]">
                    <input
                      type="checkbox"
                      checked={rx.sendLater}
                      onChange={(e) => setRx({ ...rx, sendLater: e.target.checked })}
                      className="accent-[#d4b483]"
                    />
                    <span>{copy.sendRxLater}</span>
                  </label>

                  {!rx.sendLater && (
                    <div className="space-y-3 pt-1">
                      {/* OD Right Eye */}
                      <div>
                        <div className="text-[11px] text-[#d4b483] mb-1.5">{copy.rightEye}</div>
                        <div className="grid grid-cols-3 gap-2">
                          <select
                            value={rx.odSph}
                            onChange={(e) => setRx({ ...rx, odSph: e.target.value })}
                            aria-label="OD SPH"
                            className="bg-black border border-[#f4f2ef]/20 rounded px-2 py-2 text-xs text-[#f4f2ef] tabular-nums"
                          >
                            {SPH_OPTIONS.map((v) => (
                              <option key={v} value={v}>
                                SPH {v}
                              </option>
                            ))}
                          </select>
                          <select
                            value={rx.odCyl}
                            onChange={(e) => setRx({ ...rx, odCyl: e.target.value })}
                            aria-label="OD CYL"
                            className="bg-black border border-[#f4f2ef]/20 rounded px-2 py-2 text-xs text-[#f4f2ef] tabular-nums"
                          >
                            {CYL_OPTIONS.map((v) => (
                              <option key={v} value={v}>
                                CYL {v}
                              </option>
                            ))}
                          </select>
                          <input
                            type="number"
                            min={0}
                            max={180}
                            value={rx.odAxis}
                            onChange={(e) => setRx({ ...rx, odAxis: e.target.value })}
                            placeholder="AXIS"
                            className="bg-black border border-[#f4f2ef]/20 rounded px-2 py-2 text-xs text-[#f4f2ef] tabular-nums"
                          />
                        </div>
                      </div>

                      {/* OS Left Eye */}
                      <div>
                        <div className="text-[11px] text-[#d4b483] mb-1.5">{copy.leftEye}</div>
                        <div className="grid grid-cols-3 gap-2">
                          <select
                            value={rx.osSph}
                            onChange={(e) => setRx({ ...rx, osSph: e.target.value })}
                            aria-label="OS SPH"
                            className="bg-black border border-[#f4f2ef]/20 rounded px-2 py-2 text-xs text-[#f4f2ef] tabular-nums"
                          >
                            {SPH_OPTIONS.map((v) => (
                              <option key={v} value={v}>
                                SPH {v}
                              </option>
                            ))}
                          </select>
                          <select
                            value={rx.osCyl}
                            onChange={(e) => setRx({ ...rx, osCyl: e.target.value })}
                            aria-label="OS CYL"
                            className="bg-black border border-[#f4f2ef]/20 rounded px-2 py-2 text-xs text-[#f4f2ef] tabular-nums"
                          >
                            {CYL_OPTIONS.map((v) => (
                              <option key={v} value={v}>
                                CYL {v}
                              </option>
                            ))}
                          </select>
                          <input
                            type="number"
                            min={0}
                            max={180}
                            value={rx.osAxis}
                            onChange={(e) => setRx({ ...rx, osAxis: e.target.value })}
                            placeholder="AXIS"
                            className="bg-black border border-[#f4f2ef]/20 rounded px-2 py-2 text-xs text-[#f4f2ef] tabular-nums"
                          />
                        </div>
                      </div>

                      {/* PD */}
                      <div className="flex items-center justify-between gap-3">
                        <label htmlFor="pd-input" className="text-[11px] text-[#9b9691]">
                          {copy.pdLabel}
                        </label>
                        <input
                          id="pd-input"
                          type="number"
                          min={50}
                          max={76}
                          value={rx.pd}
                          onChange={(e) => setRx({ ...rx, pd: e.target.value })}
                          className="w-24 bg-black border border-[#f4f2ef]/20 rounded px-2.5 py-1.5 text-xs text-[#f4f2ef] tabular-nums text-center"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Primary Add to Bag CTA */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full min-h-[48px] px-5 py-3 text-sm font-medium bg-[#f4f2ef] text-black hover:bg-[#d4b483] rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {addedFeedback ? (
              <>
                <Check className="w-4 h-4" />
                <span>{copy.addedToBag}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {copy.addToBag} — {unitPrice.toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US')}{' '}
                  {copy.sar}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

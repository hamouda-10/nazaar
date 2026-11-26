import { useState } from 'react';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from '../data/eyewear';
import { Lang, T } from '../data/i18n';
import { CartItem } from '../types/store';

interface CartDrawerProps {
  open: boolean;
  lang: Lang;
  items: CartItem[];
  promoCode: string | null;
  onClose: () => void;
  onUpdateQty: (uid: string, delta: number) => void;
  onRemoveItem: (uid: string) => void;
  onApplyPromo: (code: string) => boolean;
  onProceedCheckout: () => void;
  onExploreFrames: () => void;
}

export default function CartDrawer({
  open,
  lang,
  items,
  promoCode,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onApplyPromo,
  onProceedCheckout,
  onExploreFrames,
}: CartDrawerProps) {
  const copy = T[lang];
  const [promoInput, setPromoInput] = useState('');
  const [promoStatus, setPromoStatus] = useState<'idle' | 'ok' | 'err'>('idle');

  if (!open) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + (item.product.price + item.lens.priceDelta) * item.quantity,
    0
  );
  const discount =
    promoCode === 'KSA15'
      ? Math.round(subtotal * 0.15)
      : promoCode === 'RIYADH'
        ? Math.min(50, subtotal)
        : 0;
  const afterDiscount = Math.max(0, subtotal - discount);
  const shipping =
    afterDiscount === 0 || afterDiscount >= FREE_SHIPPING_THRESHOLD
      ? 0
      : STANDARD_SHIPPING_FEE;
  const total = afterDiscount + shipping;
  const vatIncludedAmount = Math.round((total * 15) / 115);
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - afterDiscount);
  const progressPct = Math.min(100, (afterDiscount / FREE_SHIPPING_THRESHOLD) * 100);

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onApplyPromo(promoInput.trim().toUpperCase());
    setPromoStatus(ok ? 'ok' : 'err');
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex justify-end bg-black/75 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={copy.cartTitle}
    >
      <aside
        className="w-full max-w-[440px] h-full bg-[#0a0a0c] border-s border-[#f4f2ef]/14 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-[#f4f2ef]/12 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-4 h-4 text-[#d4b483]" />
            <h2 className="font-editorial text-xl text-[#f4f2ef]">{copy.cartTitle}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={copy.close}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center text-[#f4f2ef]/75 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free KSA Shipping Bar */}
        {items.length > 0 && (
          <div className="px-6 py-3.5 bg-[#101013] border-b border-[#f4f2ef]/10">
            <p className="text-xs text-[#f4f2ef]/85 mb-2">
              {remainingForFree === 0
                ? copy.freeShippingUnlocked
                : copy.freeShippingRemaining.replace('{amount}', String(remainingForFree))}
            </p>
            <div className="h-1 bg-[#f4f2ef]/15 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#d4b483] transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Itemized List */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <ShoppingBag className="w-9 h-9 text-[#f4f2ef]/25 mb-4" />
              <h3 className="font-editorial text-xl text-[#f4f2ef] mb-2">
                {copy.cartEmptyTitle}
              </h3>
              <p className="text-xs text-[#9b9691] max-w-[260px] mb-6 leading-relaxed">
                {copy.cartEmptyBody}
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onExploreFrames();
                }}
                className="min-h-[42px] px-5 py-2 text-xs font-medium bg-[#f4f2ef] text-black hover:bg-[#d4b483] rounded-md transition-colors cursor-pointer"
              >
                {copy.exploreFrames}
              </button>
            </div>
          ) : (
            items.map((item) => {
              const colorObj = item.product.colors.find((c) => c.id === item.colorId);
              const unit = item.product.price + item.lens.priceDelta;
              return (
                <div
                  key={item.uid}
                  className="p-3.5 bg-[#111114] border border-[#f4f2ef]/10 rounded-lg flex gap-3.5"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name[lang]}
                    referrerPolicy="no-referrer"
                    style={item.product.imageFilter ? { filter: item.product.imageFilter } : undefined}
                    className="w-20 h-16 rounded object-cover shrink-0 bg-black"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-editorial text-base text-[#f4f2ef] leading-snug truncate">
                        {item.product.name[lang]}
                      </h3>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.uid)}
                        aria-label="Remove item"
                        className="text-[#9b9691] hover:text-red-400 transition-colors p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-[#9b9691] mt-0.5 space-y-0.5">
                      {colorObj && <div>{colorObj.name[lang]}</div>}
                      <div className="truncate">{item.lens.name[lang]}</div>
                      {item.prescription && (
                        <div className="text-[#d4b483]">
                          {item.prescription.sendLater
                            ? copy.sendRxLater
                            : `OD ${item.prescription.odSph} / OS ${item.prescription.osSph} · PD ${item.prescription.pd}`}
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="inline-flex items-center border border-[#f4f2ef]/20 rounded">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.uid, -1)}
                          aria-label="Decrease quantity"
                          className="w-7 h-7 flex items-center justify-center text-[#f4f2ef]/80 hover:text-white cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.uid, 1)}
                          aria-label="Increase quantity"
                          className="w-7 h-7 flex items-center justify-center text-[#f4f2ef]/80 hover:text-white cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-xs font-semibold text-[#f4f2ef] tabular-nums">
                        {(unit * item.quantity).toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US')}{' '}
                        {copy.sar}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Totals & Saudi Checkout CTA */}
        {items.length > 0 && (
          <div className="p-6 border-t border-[#f4f2ef]/12 bg-[#0d0d10] space-y-4">
            {/* Promo Code */}
            <form onSubmit={handlePromoSubmit} className="space-y-1.5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder={copy.promoPlaceholder}
                  className="flex-1 min-h-[40px] bg-black border border-[#f4f2ef]/18 focus:border-[#d4b483] rounded-md px-3 text-xs text-[#f4f2ef] placeholder:text-[#9b9691] outline-none"
                />
                <button
                  type="submit"
                  className="min-h-[40px] px-4 text-xs font-medium border border-[#f4f2ef]/25 hover:border-[#d4b483] text-[#f4f2ef] hover:text-[#d4b483] rounded-md transition-colors cursor-pointer whitespace-nowrap"
                >
                  {copy.apply}
                </button>
              </div>
              {promoStatus === 'ok' && (
                <p className="text-[11px] text-emerald-400">{copy.promoApplied}</p>
              )}
              {promoStatus === 'err' && (
                <p className="text-[11px] text-amber-400">{copy.promoInvalid}</p>
              )}
              {promoStatus === 'idle' && (
                <p className="text-[11px] text-[#9b9691]">{copy.promoHint}</p>
              )}
            </form>

            {/* Price Breakdown */}
            <div className="space-y-2 text-xs pt-2 border-t border-[#f4f2ef]/10">
              <div className="flex justify-between text-[#f4f2ef]/75">
                <span>{copy.subtotal}</span>
                <span className="tabular-nums">
                  {subtotal.toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US')} {copy.sar}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>
                    {copy.discount} ({promoCode})
                  </span>
                  <span className="tabular-nums">
                    -{discount.toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US')} {copy.sar}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-[#f4f2ef]/75">
                <span>{copy.shipping}</span>
                <span className="tabular-nums">
                  {shipping === 0 ? copy.free : `${shipping} ${copy.sar}`}
                </span>
              </div>
              <div className="flex justify-between text-[#9b9691] text-[11px]">
                <span>{copy.vatLine}</span>
                <span className="tabular-nums">
                  {vatIncludedAmount} {copy.sar}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[#f4f2ef] pt-2 border-t border-[#f4f2ef]/12">
                <span>{copy.total}</span>
                <span className="tabular-nums">
                  {total.toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US')} {copy.sar}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onProceedCheckout}
              className="w-full min-h-[48px] px-5 py-3 text-sm font-medium bg-[#f4f2ef] text-black hover:bg-[#d4b483] rounded-md transition-colors cursor-pointer"
            >
              {copy.proceedCheckout}
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

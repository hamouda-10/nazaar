import { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  CreditCard,
  Lock,
  ShieldCheck,
  Smartphone,
  Truck,
  X,
} from 'lucide-react';
import {
  COD_FEE,
  COD_FREE_THRESHOLD,
  FREE_SHIPPING_THRESHOLD,
  PaymentMethodId,
  SAUDI_CITIES,
  STANDARD_SHIPPING_FEE,
} from '../data/eyewear';
import { Lang, T } from '../data/i18n';
import { CartItem, OrderReceipt } from '../types/store';

interface CheckoutModalProps {
  open: boolean;
  lang: Lang;
  items: CartItem[];
  promoCode: string | null;
  onClose: () => void;
  onOrderComplete: (receipt: OrderReceipt) => void;
}

const PAYMENT_OPTIONS: {
  id: PaymentMethodId;
  ar: string;
  en: string;
  subAr: string;
  subEn: string;
  mark: string;
}[] = [
  {
    id: 'mada',
    ar: 'بطاقة مدى',
    en: 'mada Debit Card',
    subAr: 'الشبكة السعودية للمدفوعات — دفع فوري آمن',
    subEn: 'Saudi National Payment Network',
    mark: 'mada',
  },
  {
    id: 'applepay',
    ar: 'Apple Pay',
    en: 'Apple Pay',
    subAr: 'دفع سريع بلمسة واحدة بالريال السعودي',
    subEn: 'One-tap biometric checkout in SAR',
    mark: 'Pay',
  },
  {
    id: 'stcpay',
    ar: 'STC Pay',
    en: 'STC Pay',
    subAr: 'المحفظة الرقمية السعودية عبر رقم الجوال',
    subEn: 'Saudi mobile wallet with instant OTP',
    mark: 'stc pay',
  },
  {
    id: 'tamara',
    ar: 'تمارا — ٤ دفعات بدون فوائد',
    en: 'Tamara — Split in 4 (0% Fees)',
    subAr: 'قسّم فاتورتك على ٤ دفعات شهرية متوافقة مع الشريعة',
    subEn: 'Sharia-compliant 4 monthly payments',
    mark: 'tamara',
  },
  {
    id: 'tabby',
    ar: 'تابي — ٤ دفعات بدون فوائد',
    en: 'Tabby — Split in 4 (0% Fees)',
    subAr: 'ادفع ٢٥٪ اليوم والباقي على ٣ أشهر بدون رسوم',
    subEn: 'Pay 25% today, 3 monthly payments',
    mark: 'tabby',
  },
  {
    id: 'cod',
    ar: 'الدفع عند الاستلام',
    en: 'Cash on Delivery (COD)',
    subAr: 'نقداً أو ببطاقة مدى عند استلام الطلب',
    subEn: 'Pay cash or tap mada at your doorstep',
    mark: 'COD',
  },
  {
    id: 'card',
    ar: 'Visa / Mastercard',
    en: 'Visa / Mastercard',
    subAr: 'البطاقات الائتمانية الدولية والمحلية',
    subEn: 'Credit & international debit cards',
    mark: 'VISA',
  },
];

export default function CheckoutModal({
  open,
  lang,
  items,
  promoCode,
  onClose,
  onOrderComplete,
}: CheckoutModalProps) {
  const copy = T[lang];
  const [step, setStep] = useState<'delivery' | 'payment' | 'receipt'>('delivery');
  const [processing, setProcessing] = useState(false);

  // Delivery form
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('05');
  const [cityId, setCityId] = useState('riyadh');
  const [districtStreet, setDistrictStreet] = useState('');
  const [nationalAddress, setNationalAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  // Payment form
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('mada');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [stcPhone, setStcPhone] = useState('05');
  const [stcOtpSent, setStcOtpSent] = useState(false);
  const [stcOtp, setStcOtp] = useState('');

  const [receipt, setReceipt] = useState<OrderReceipt | null>(null);
  const processTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (processTimerRef.current !== null) {
        window.clearTimeout(processTimerRef.current);
      }
    };
  }, []);

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
  const shippingFee =
    afterDiscount === 0 || afterDiscount >= FREE_SHIPPING_THRESHOLD
      ? 0
      : STANDARD_SHIPPING_FEE;
  const codFee =
    paymentMethod === 'cod' && afterDiscount < COD_FREE_THRESHOLD ? COD_FEE : 0;
  const total = afterDiscount + shippingFee + codFee;
  const vatAmount = Math.round((total * 15) / 115);
  const installment = Number((total / 4).toFixed(2));
  const selectedCity = SAUDI_CITIES.find((c) => c.id === cityId) ?? SAUDI_CITIES[0];

  const handleDeliveryNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || phone.replace(/\D/g, '').length < 9 || !districtStreet.trim()) {
      setFormError(
        lang === 'ar'
          ? 'يرجى إدخال الاسم، رقم الجوال السعودي (05XXXXXXXX)، والحي والشارع.'
          : 'Please complete your name, Saudi mobile (05XXXXXXXX), and district/street.'
      );
      return;
    }
    setFormError('');
    setStcPhone(phone);
    setStep('payment');
  };

  const formatCardNum = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === 'mada' || paymentMethod === 'card') {
      if (cardNumber.replace(/\D/g, '').length < 16 || cardExpiry.length < 5 || cardCvv.length < 3) {
        setFormError(
          lang === 'ar'
            ? 'يرجى إدخال بيانات البطاقة كاملة (١٦ رقم، تاريخ الانتهاء، ورمز CVV).'
            : 'Please enter complete card details (16 digits, MM/YY, and CVV).'
        );
        return;
      }
    }

    if (paymentMethod === 'stcpay' && stcOtp.trim().length < 4) {
      setFormError(
        lang === 'ar'
          ? 'يرجى إرسال وإدخال رمز التحقق المكون من ٤ أرقام لمحفظة STC Pay (مثال: 4821).'
          : 'Please request and enter the 4-digit STC Pay verification code (e.g. 4821).'
      );
      return;
    }

    setFormError('');
    setProcessing(true);

    if (processTimerRef.current !== null) {
      window.clearTimeout(processTimerRef.current);
    }
    processTimerRef.current = window.setTimeout(() => {
      processTimerRef.current = null;
      const orderNum = `NZ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const newReceipt: OrderReceipt = {
        orderNumber: orderNum,
        createdAt: new Date().toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-GB', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        items: [...items],
        subtotal,
        discount,
        shippingFee,
        codFee,
        total,
        vatAmount,
        paymentMethod,
        customerName: fullName.trim(),
        phone: phone.trim(),
        cityLabel: selectedCity.name[lang],
        districtStreet: districtStreet.trim(),
        nationalAddress: nationalAddress.trim().toUpperCase(),
        etaLabel: selectedCity.eta[lang],
      };

      setProcessing(false);
      setReceipt(newReceipt);
      setStep('receipt');
      onOrderComplete(newReceipt);
    }, 950);
  };

  const handleCloseAll = () => {
    if (processTimerRef.current !== null) {
      window.clearTimeout(processTimerRef.current);
      processTimerRef.current = null;
    }
    setProcessing(false);
    if (step === 'receipt') {
      setStep('delivery');
      setReceipt(null);
    }
    onClose();
  };

  const getPaymentLabel = (id: PaymentMethodId) => {
    const found = PAYMENT_OPTIONS.find((p) => p.id === id);
    return found ? (lang === 'ar' ? found.ar : found.en) : id;
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={copy.checkoutTitle}
      onClick={handleCloseAll}
    >
      <div
        className="relative w-full max-w-[920px] bg-[#0b0b0d] border border-[#f4f2ef]/16 rounded-xl overflow-hidden shadow-2xl my-auto max-h-[92dvh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="px-6 py-4 border-b border-[#f4f2ef]/12 flex items-center justify-between">
          <div>
            <h2 className="font-editorial text-xl sm:text-2xl text-[#f4f2ef]">
              {step === 'receipt' ? copy.orderConfirmedTitle : copy.checkoutTitle}
            </h2>
            {step !== 'receipt' && (
              <div className="flex items-center gap-4 mt-1 text-xs">
                <span className={step === 'delivery' ? 'text-[#d4b483] font-medium' : 'text-[#9b9691]'}>
                  {copy.stepDelivery}
                </span>
                <span className="text-[#f4f2ef]/25">/</span>
                <span className={step === 'payment' ? 'text-[#d4b483] font-medium' : 'text-[#9b9691]'}>
                  {copy.stepPayment}
                </span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleCloseAll}
            aria-label={copy.close}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center text-[#f4f2ef]/75 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6">
          {step === 'receipt' && receipt ? (
            <div className="max-w-2xl mx-auto py-4 space-y-6">
              <div className="text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="font-editorial text-3xl text-[#f4f2ef]">
                  {copy.orderConfirmedTitle}
                </h3>
                <p className="text-sm text-[#9b9691]">{copy.orderConfirmedSub}</p>
              </div>

              <div className="p-5 bg-[#111114] border border-[#f4f2ef]/14 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#9b9691] block">{copy.orderNumber}</span>
                  <span className="text-sm font-semibold text-[#d4b483] tabular-nums">
                    #{receipt.orderNumber}
                  </span>
                </div>
                <div>
                  <span className="text-[#9b9691] block">{copy.zatcaVatNo}</span>
                  <span className="text-[#f4f2ef] tabular-nums">310948271600003</span>
                </div>
                <div>
                  <span className="text-[#9b9691] block">{copy.paymentUsed}</span>
                  <span className="text-[#f4f2ef] font-medium">
                    {getPaymentLabel(receipt.paymentMethod)}
                  </span>
                </div>
                <div>
                  <span className="text-[#9b9691] block">{copy.estimatedDelivery}</span>
                  <span className="text-[#f4f2ef] font-medium">{receipt.etaLabel}</span>
                </div>
                <div className="sm:col-span-2 pt-2 border-t border-[#f4f2ef]/10">
                  <span className="text-[#9b9691] block">{copy.shippingTo}</span>
                  <span className="text-[#f4f2ef]">
                    {receipt.customerName} · {receipt.phone} · {receipt.cityLabel} —{' '}
                    {receipt.districtStreet}
                    {receipt.nationalAddress ? ` (${receipt.nationalAddress})` : ''}
                  </span>
                </div>
              </div>

              {/* Receipt Line Items */}
              <div className="p-5 bg-[#111114] border border-[#f4f2ef]/14 rounded-lg space-y-3 text-xs">
                {receipt.items.map((item) => (
                  <div key={item.uid} className="flex justify-between gap-3">
                    <span className="text-[#f4f2ef]/85">
                      {item.quantity}× {item.product.name[lang]} ({item.lens.name[lang]})
                    </span>
                    <span className="tabular-nums text-[#f4f2ef] shrink-0">
                      {((item.product.price + item.lens.priceDelta) * item.quantity).toLocaleString(
                        lang === 'ar' ? 'ar-SA' : 'en-US'
                      )}{' '}
                      {copy.sar}
                    </span>
                  </div>
                ))}

                <div className="pt-3 border-t border-[#f4f2ef]/10 space-y-1.5">
                  {receipt.discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>{copy.discount}</span>
                      <span className="tabular-nums">
                        -{receipt.discount} {copy.sar}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#9b9691]">
                    <span>{copy.vatLine}</span>
                    <span className="tabular-nums">
                      {receipt.vatAmount} {copy.sar}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-semibold text-[#f4f2ef] pt-2 border-t border-[#f4f2ef]/10">
                    <span>{copy.total}</span>
                    <span className="tabular-nums">
                      {receipt.total.toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US')} {copy.sar}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseAll}
                className="w-full min-h-[46px] bg-[#f4f2ef] text-black hover:bg-[#d4b483] rounded-md text-sm font-medium transition-colors cursor-pointer"
              >
                {copy.continueShopping}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: Active Form Step */}
              <div className="lg:col-span-7">
                {step === 'delivery' ? (
                  <form onSubmit={handleDeliveryNext} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-[#9b9691] mb-1.5">
                          {copy.fullName} *
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder={lang === 'ar' ? 'محمد عبدالله القحطاني' : 'Mohammed Al-Qahtani'}
                          className="w-full min-h-[44px] bg-black border border-[#f4f2ef]/18 focus:border-[#d4b483] rounded-md px-3.5 text-sm text-[#f4f2ef] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[#9b9691] mb-1.5">
                          {copy.saudiPhone} *
                        </label>
                        <input
                          type="tel"
                          required
                          dir="ltr"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="05X XXX XXXX"
                          className="w-full min-h-[44px] bg-black border border-[#f4f2ef]/18 focus:border-[#d4b483] rounded-md px-3.5 text-sm text-[#f4f2ef] outline-none tabular-nums"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-[#9b9691] mb-1.5">
                          {copy.city} *
                        </label>
                        <select
                          value={cityId}
                          onChange={(e) => setCityId(e.target.value)}
                          className="w-full min-h-[44px] bg-black border border-[#f4f2ef]/18 focus:border-[#d4b483] rounded-md px-3 text-sm text-[#f4f2ef] outline-none cursor-pointer"
                        >
                          {SAUDI_CITIES.map((c) => (
                            <option key={c.id} value={c.id} className="bg-black">
                              {c.name[lang]} — {c.eta[lang]}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-[#9b9691] mb-1.5">
                          {copy.nationalAddress}
                        </label>
                        <input
                          type="text"
                          dir="ltr"
                          maxLength={8}
                          value={nationalAddress}
                          onChange={(e) => setNationalAddress(e.target.value)}
                          placeholder={copy.nationalAddressPlaceholder}
                          className="w-full min-h-[44px] bg-black border border-[#f4f2ef]/18 focus:border-[#d4b483] rounded-md px-3.5 text-sm text-[#f4f2ef] uppercase outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-[#9b9691] mb-1.5">
                        {copy.districtStreet} *
                      </label>
                      <input
                        type="text"
                        required
                        value={districtStreet}
                        onChange={(e) => setDistrictStreet(e.target.value)}
                        placeholder={
                          lang === 'ar'
                            ? 'حي الملقا، شارع أنس بن مالك، مبنى ١٤'
                            : 'Al Malqa District, Anas Ibn Malik Rd, Bldg 14'
                        }
                        className="w-full min-h-[44px] bg-black border border-[#f4f2ef]/18 focus:border-[#d4b483] rounded-md px-3.5 text-sm text-[#f4f2ef] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-[#9b9691] mb-1.5">
                        {copy.deliveryNotes}
                      </label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-black border border-[#f4f2ef]/18 focus:border-[#d4b483] rounded-md p-3 text-sm text-[#f4f2ef] outline-none resize-none"
                      />
                    </div>

                    {formError && <p className="text-xs text-amber-400">{formError}</p>}

                    <button
                      type="submit"
                      className="w-full min-h-[48px] bg-[#f4f2ef] text-black hover:bg-[#d4b483] rounded-md text-sm font-medium transition-colors cursor-pointer"
                    >
                      {copy.continueToPayment}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handlePlaceOrder} className="space-y-5">
                    <div>
                      <div className="text-xs text-[#9b9691] mb-3">{copy.selectSaudiPayment}</div>
                      <div className="space-y-2">
                        {PAYMENT_OPTIONS.map((opt) => {
                          const active = paymentMethod === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => {
                                setPaymentMethod(opt.id);
                                setFormError('');
                              }}
                              className={`w-full text-start p-3.5 rounded-lg border transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                                active
                                  ? 'border-[#d4b483] bg-[#161513]'
                                  : 'border-[#f4f2ef]/14 bg-[#0f0f11] hover:border-[#f4f2ef]/35'
                              }`}
                            >
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-[#f4f2ef]">
                                  {lang === 'ar' ? opt.ar : opt.en}
                                </div>
                                <div className="text-[11px] text-[#9b9691] mt-0.5">
                                  {lang === 'ar' ? opt.subAr : opt.subEn}
                                </div>
                              </div>
                              <span className="px-2.5 py-1 text-[11px] font-semibold tracking-wide bg-black border border-[#f4f2ef]/20 rounded text-[#f4f2ef] whitespace-nowrap shrink-0">
                                {opt.mark}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Tailored Payment Method Panel */}
                    {(paymentMethod === 'mada' || paymentMethod === 'card') && (
                      <div className="p-4 bg-[#101013] border border-[#f4f2ef]/12 rounded-lg space-y-3">
                        <div className="flex items-center gap-2 text-xs text-[#d4b483]">
                          <CreditCard className="w-4 h-4" />
                          <span>
                            {paymentMethod === 'mada'
                              ? lang === 'ar'
                                ? 'بوابة مدى المشفرة (3D Secure)'
                                : 'Encrypted mada Gateway (3D Secure)'
                              : 'Visa / Mastercard 3DS'}
                          </span>
                        </div>

                        <div>
                          <label className="block text-[11px] text-[#9b9691] mb-1">
                            {copy.cardNumber}
                          </label>
                          <input
                            type="text"
                            dir="ltr"
                            inputMode="numeric"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardNum(e.target.value))}
                            placeholder="5888 4500 1234 5678"
                            className="w-full min-h-[42px] bg-black border border-[#f4f2ef]/20 rounded px-3 text-sm text-[#f4f2ef] tabular-nums outline-none focus:border-[#d4b483]"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="col-span-1">
                            <label className="block text-[11px] text-[#9b9691] mb-1">
                              {copy.expiry}
                            </label>
                            <input
                              type="text"
                              dir="ltr"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                              placeholder="09/29"
                              className="w-full min-h-[42px] bg-black border border-[#f4f2ef]/20 rounded px-3 text-sm text-[#f4f2ef] tabular-nums outline-none focus:border-[#d4b483]"
                            />
                          </div>
                          <div className="col-span-1">
                            <label className="block text-[11px] text-[#9b9691] mb-1">
                              {copy.cvv}
                            </label>
                            <input
                              type="password"
                              dir="ltr"
                              maxLength={4}
                              value={cardCvv}
                              onChange={(e) =>
                                setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))
                              }
                              placeholder="•••"
                              className="w-full min-h-[42px] bg-black border border-[#f4f2ef]/20 rounded px-3 text-sm text-[#f4f2ef] tabular-nums outline-none focus:border-[#d4b483]"
                            />
                          </div>
                          <div className="col-span-1">
                            <label className="block text-[11px] text-[#9b9691] mb-1">
                              {copy.cardHolder}
                            </label>
                            <input
                              type="text"
                              value={cardHolder}
                              onChange={(e) => setCardHolder(e.target.value)}
                              placeholder={fullName || 'NAME'}
                              className="w-full min-h-[42px] bg-black border border-[#f4f2ef]/20 rounded px-3 text-sm text-[#f4f2ef] outline-none focus:border-[#d4b483]"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'applepay' && (
                      <div className="p-4 bg-[#101013] border border-[#f4f2ef]/12 rounded-lg flex items-start gap-3 text-xs text-[#f4f2ef]/80">
                        <ShieldCheck className="w-5 h-5 text-[#d4b483] shrink-0 mt-0.5" />
                        <p className="leading-relaxed">{copy.applePayNotice}</p>
                      </div>
                    )}

                    {paymentMethod === 'stcpay' && (
                      <div className="p-4 bg-[#101013] border border-[#f4f2ef]/12 rounded-lg space-y-3">
                        <div className="flex items-center gap-2 text-xs text-[#d4b483]">
                          <Smartphone className="w-4 h-4" />
                          <span>STC Pay — Saudi Mobile Wallet</span>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="tel"
                            dir="ltr"
                            value={stcPhone}
                            onChange={(e) => setStcPhone(e.target.value)}
                            placeholder="05X XXX XXXX"
                            className="flex-1 min-h-[42px] bg-black border border-[#f4f2ef]/20 rounded px-3 text-sm text-[#f4f2ef] tabular-nums outline-none focus:border-[#d4b483]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setStcOtpSent(true);
                              setStcOtp('4821');
                            }}
                            className="min-h-[42px] px-3.5 text-xs font-medium border border-[#d4b483] text-[#d4b483] hover:bg-[#d4b483] hover:text-black rounded transition-colors cursor-pointer whitespace-nowrap"
                          >
                            {copy.stcSendOtp}
                          </button>
                        </div>
                        {stcOtpSent && (
                          <div className="space-y-2">
                            <p className="text-[11px] text-emerald-400">{copy.stcOtpSent}</p>
                            <input
                              type="text"
                              dir="ltr"
                              maxLength={4}
                              value={stcOtp}
                              onChange={(e) => setStcOtp(e.target.value.replace(/\D/g, ''))}
                              placeholder={copy.stcOtpPlaceholder}
                              className="w-full min-h-[42px] bg-black border border-[#f4f2ef]/20 rounded px-3 text-sm text-[#f4f2ef] tabular-nums outline-none focus:border-[#d4b483]"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {(paymentMethod === 'tamara' || paymentMethod === 'tabby') && (
                      <div className="p-4 bg-[#101013] border border-[#f4f2ef]/12 rounded-lg space-y-3">
                        <div className="text-xs font-medium text-[#f4f2ef]">
                          {copy.installmentPlanTitle}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          {[
                            copy.installmentToday,
                            copy.installmentMonth2,
                            copy.installmentMonth3,
                            copy.installmentMonth4,
                          ].map((label, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 bg-black border border-[#f4f2ef]/12 rounded text-center"
                            >
                              <div className="text-[10px] text-[#9b9691]">{label}</div>
                              <div className="font-semibold text-[#d4b483] tabular-nums mt-1">
                                {installment} {copy.sar}
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-[11px] text-[#9b9691]">
                          {copy.installmentZeroInterest}
                        </p>
                      </div>
                    )}

                    {paymentMethod === 'cod' && (
                      <div className="p-4 bg-[#101013] border border-[#f4f2ef]/12 rounded-lg flex items-start gap-3 text-xs text-[#f4f2ef]/80">
                        <Truck className="w-5 h-5 text-[#d4b483] shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="leading-relaxed">{copy.codNotice}</p>
                          <p className="text-[#9b9691] tabular-nums">
                            {copy.codFeeLabel}:{' '}
                            {codFee === 0 ? copy.free : `${codFee} ${copy.sar}`}
                          </p>
                        </div>
                      </div>
                    )}

                    {formError && <p className="text-xs text-amber-400">{formError}</p>}

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setStep('delivery')}
                        className="min-h-[46px] px-5 text-xs font-medium border border-[#f4f2ef]/25 text-[#f4f2ef] hover:border-white rounded-md transition-colors cursor-pointer"
                      >
                        {copy.backToDelivery}
                      </button>
                      <button
                        type="submit"
                        disabled={processing}
                        className="flex-1 min-h-[46px] px-5 text-sm font-medium bg-[#f4f2ef] text-black hover:bg-[#d4b483] disabled:opacity-60 rounded-md transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Lock className="w-4 h-4" />
                        <span>
                          {processing
                            ? copy.processingOrder
                            : `${copy.placeOrder} — ${total.toLocaleString(
                                lang === 'ar' ? 'ar-SA' : 'en-US'
                              )} ${copy.sar}`}
                        </span>
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Right: Order Summary */}
              <div className="lg:col-span-5">
                <div className="p-5 bg-[#101013] border border-[#f4f2ef]/12 rounded-lg space-y-4">
                  <div className="text-xs font-medium text-[#d4b483]">
                    {lang === 'ar' ? 'ملخص الفاتورة الضريبية (السعودية)' : 'Saudi Order Summary'}
                  </div>

                  <div className="space-y-3 max-h-56 overflow-y-auto pe-1">
                    {items.map((item) => (
                      <div key={item.uid} className="flex items-center gap-3 text-xs">
                        <img
                          src={item.product.image}
                          alt={item.product.name[lang]}
                          referrerPolicy="no-referrer"
                          className="w-12 h-10 rounded object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-[#f4f2ef] truncate">{item.product.name[lang]}</div>
                          <div className="text-[11px] text-[#9b9691] truncate">
                            {item.quantity}× · {item.lens.name[lang]}
                          </div>
                        </div>
                        <div className="tabular-nums text-[#f4f2ef] shrink-0">
                          {(
                            (item.product.price + item.lens.priceDelta) *
                            item.quantity
                          ).toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US')}{' '}
                          {copy.sar}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 text-xs pt-3 border-t border-[#f4f2ef]/10">
                    <div className="flex justify-between text-[#f4f2ef]/75">
                      <span>{copy.subtotal}</span>
                      <span className="tabular-nums">
                        {subtotal.toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US')} {copy.sar}
                      </span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>{copy.discount}</span>
                        <span className="tabular-nums">
                          -{discount} {copy.sar}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-[#f4f2ef]/75">
                      <span>{copy.shipping}</span>
                      <span className="tabular-nums">
                        {shippingFee === 0 ? copy.free : `${shippingFee} ${copy.sar}`}
                      </span>
                    </div>
                    {codFee > 0 && (
                      <div className="flex justify-between text-[#f4f2ef]/75">
                        <span>{copy.codFeeLabel}</span>
                        <span className="tabular-nums">
                          {codFee} {copy.sar}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-[11px] text-[#9b9691]">
                      <span>{copy.vatLine}</span>
                      <span className="tabular-nums">
                        {vatAmount} {copy.sar}
                      </span>
                    </div>
                    <div className="flex justify-between text-base font-semibold text-[#f4f2ef] pt-2.5 border-t border-[#f4f2ef]/12">
                      <span>{copy.total}</span>
                      <span className="tabular-nums">
                        {total.toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US')} {copy.sar}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

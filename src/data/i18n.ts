export type Lang = 'ar' | 'en';

export interface Translations {
  brand: string;
  brandEm: string;
  splashTag: string;
  skipSplash: string;
  navArchive: string;
  navCollection: string;
  navLensLab: string;
  navBoutiques: string;
  bag: string;
  menu: string;
  close: string;
  sphereHeadline: string[];
  sphereSubline: string;
  atelierCardTitle: string;
  atelierCardBody: string;
  dragToRotate: string;
  scrollReverseCue: string;
  replayEye: string;
  skipVideo: string;
  browseCatalog: string;
  backToSphere: string;
  saudiPaymentsShort: string;
  sar: string;
  vatIncluded: string;
  searchPlaceholder: string;
  allCategories: string;
  allShapes: string;
  sortFeatured: string;
  sortPriceAsc: string;
  sortPriceDesc: string;
  framesCount: string;
  noResultsTitle: string;
  noResultsSub: string;
  resetFilters: string;
  quickView: string;
  addToBag: string;
  addedToBag: string;
  inStock: string;
  limitedEdition: string;
  chooseColor: string;
  chooseLens: string;
  prescriptionToggle: string;
  prescriptionHint: string;
  rightEye: string;
  leftEye: string;
  pdLabel: string;
  sendRxLater: string;
  frameSpecs: string;
  materialLabel: string;
  originLabel: string;
  dimensionsLabel: string;
  weightLabel: string;
  installmentNote: string;
  lensLabTitle: string;
  lensLabLead: string;
  ksaTrustTitle: string;
  ksaTrustItems: { title: string; detail: string }[];
  cartTitle: string;
  cartEmptyTitle: string;
  cartEmptyBody: string;
  exploreFrames: string;
  freeShippingUnlocked: string;
  freeShippingRemaining: string;
  promoPlaceholder: string;
  apply: string;
  promoApplied: string;
  promoInvalid: string;
  promoHint: string;
  subtotal: string;
  discount: string;
  shipping: string;
  free: string;
  vatLine: string;
  total: string;
  proceedCheckout: string;
  checkoutTitle: string;
  stepDelivery: string;
  stepPayment: string;
  fullName: string;
  saudiPhone: string;
  city: string;
  districtStreet: string;
  nationalAddress: string;
  nationalAddressPlaceholder: string;
  deliveryNotes: string;
  continueToPayment: string;
  backToDelivery: string;
  selectSaudiPayment: string;
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
  applePayNotice: string;
  stcPhoneLabel: string;
  stcSendOtp: string;
  stcOtpSent: string;
  stcOtpPlaceholder: string;
  installmentPlanTitle: string;
  installmentToday: string;
  installmentMonth2: string;
  installmentMonth3: string;
  installmentMonth4: string;
  installmentZeroInterest: string;
  codNotice: string;
  codFeeLabel: string;
  placeOrder: string;
  processingOrder: string;
  orderConfirmedTitle: string;
  orderConfirmedSub: string;
  orderNumber: string;
  zatcaVatNo: string;
  estimatedDelivery: string;
  paymentUsed: string;
  shippingTo: string;
  continueShopping: string;
  boutiquesTitle: string;
  boutiquesLead: string;
  bookEyeExam: string;
  examBookedMsg: string;
  preferredBranch: string;
  preferredDate: string;
  confirmBooking: string;
  footerAddress: string;
  footerCopyright: string;
}

export const T: Record<Lang, Translations> = {
  ar: {
    brand: 'دار ',
    brandEm: 'نَظَر',
    splashTag: 'الرياض · جدة · الخبر · بصريات فاخرة ٢٠٢٦',
    skipSplash: 'دخول مباشر',
    navArchive: 'المعرض الثلاثي',
    navCollection: 'النظارات',
    navLensLab: 'مختبر العدسات',
    navBoutiques: 'الفروع والفحص',
    bag: 'السلة',
    menu: 'القائمة',
    close: 'إغلاق',
    sphereHeadline: ['رؤية', 'تتجاوز', 'حدود', 'الإطار'],
    sphereSubline: '٢٤ تصميماً بصرياً من التيتانيوم الياباني والأسيتات الإيطالي',
    atelierCardTitle: 'دار نَظَر للبصريات',
    atelierCardBody:
      'مجموعة متكاملة من النظارات الطبية، الشمسية المستقطبة، عدسات حماية الشاشات، الفوتوكروميك، والكليب أون المغناطيسي — مع تجهيز العدسات الطبية والدفع السعودي.',
    dragToRotate: 'اسحب للتدوير',
    scrollReverseCue: 'اسحب للتدوير · مرّر للأعلى للعودة إلى العين',
    replayEye: 'إعادة دخول العين',
    skipVideo: 'تخطي',
    browseCatalog: 'تصفح ٢٤ نظارة',
    backToSphere: 'المعرض الثلاثي',
    saudiPaymentsShort: 'مدى · Apple Pay · STC Pay · تمارا · تابي · الدفع عند الاستلام',
    sar: 'ر.س',
    vatIncluded: 'شامل ضريبة القيمة المضافة ١٥٪',
    searchPlaceholder: 'ابحث باسم النظارة، النوع، أو الخامة...',
    allCategories: 'الكل',
    allShapes: 'جميع الأشكال',
    sortFeatured: 'الأكثر تميزاً',
    sortPriceAsc: 'السعر: من الأقل للأعلى',
    sortPriceDesc: 'السعر: من الأعلى للأقل',
    framesCount: 'إطاراً متوفراً',
    noResultsTitle: 'لم يتم العثور على نظارات مطابقة',
    noResultsSub: 'جرّب تغيير الفئة أو كلمات البحث لاستعراض باقي المجموعة.',
    resetFilters: 'إعادة ضبط التصفية',
    quickView: 'تخصيص وشراء',
    addToBag: 'أضف إلى السلة',
    addedToBag: 'تمت الإضافة للسلة',
    inStock: 'متوفر للشحن الفوري',
    limitedEdition: 'إصدار محدود',
    chooseColor: 'لون الإطار',
    chooseLens: 'اختر نوع العدسة',
    prescriptionToggle: 'إدخال مقاس النظر الطبي (اختياري)',
    prescriptionHint: 'يمكنك إدخال مقاسك الآن أو إرسال صورة الوصفة عبر واتساب بعد إتمام الطلب مجاناً.',
    rightEye: 'العين اليمنى (OD)',
    leftEye: 'العين اليسرى (OS)',
    pdLabel: 'المسافة البؤرية (PD)',
    sendRxLater: 'سأرسل الوصفة الطبية لاحقاً عبر واتساب',
    frameSpecs: 'مواصفات الإطار',
    materialLabel: 'الخامة',
    originLabel: 'بلد الصنع',
    dimensionsLabel: 'المقاسات',
    weightLabel: 'الوزن',
    installmentNote: 'أو ٤ دفعات شهرية بدون فوائد بقيمة',
    lensLabTitle: 'مختبر نَظَر للعدسات الطبية',
    lensLabLead:
      'نجهّز جميع النظارات بعدسات ألمانية ويابانية دقيقة وفق مقاس نظرك، مع طبقة حماية من الخدوش والأشعة فوق البنفسجية UV400 وتوصيل سريع لجميع مدن المملكة.',
    ksaTrustTitle: 'تجربة تسوق سعودية موثوقة',
    ksaTrustItems: [
      {
        title: 'الدفع السعودي الكامل',
        detail: 'مدى، Apple Pay، STC Pay، تقسيط تمارا وتابي على ٤ دفعات بدون فوائد، أو الدفع عند الاستلام.',
      },
      {
        title: 'توصيل سريع داخل المملكة',
        detail: 'توصيل في نفس اليوم داخل الرياض، وخلال ١–٢ يوم عمل لجدة والدمام والخبر وكافة المناطق.',
      },
      {
        title: 'فحص نظر مجاني وضمان سنتين',
        detail: 'ضمان شامل لمدة ٢٤ شهراً على الإطار والعدسات، مع استبدال مرن خلال ١٤ يوماً.',
      },
    ],
    cartTitle: 'حقيبة التسوق',
    cartEmptyTitle: 'حقيبة التسوق فارغة حالياً',
    cartEmptyBody: 'استكشف أكثر من ٢٤ نوعاً من النظارات الطبية والشمسية والرياضية.',
    exploreFrames: 'تصفح المجموعة',
    freeShippingUnlocked: 'تهانينا! حصلت على شحن سريع مجاني داخل المملكة',
    freeShippingRemaining: 'أضف بقيمة {amount} ر.س للحصول على شحن مجاني في السعودية',
    promoPlaceholder: 'كود الخصم (جرّب KSA15 أو RIYADH)',
    apply: 'تطبيق',
    promoApplied: 'تم تطبيق كود الخصم بنجاح',
    promoInvalid: 'كود غير صالح — جرّب KSA15 (خصم ١٥٪) أو RIYADH (خصم ٥٠ ر.س)',
    promoHint: 'أكواد فعّالة: KSA15 · RIYADH',
    subtotal: 'المجموع الفرعي',
    discount: 'الخصم',
    shipping: 'الشحن السريع (السعودية)',
    free: 'مجاني',
    vatLine: 'يشمل ضريبة القيمة المضافة (١٥٪)',
    total: 'الإجمالي النهائي',
    proceedCheckout: 'إتمام الطلب والدفع السعودي',
    checkoutTitle: 'إتمام الطلب — المملكة العربية السعودية',
    stepDelivery: '١. عنوان التوصيل',
    stepPayment: '٢. وسيلة الدفع السعودي',
    fullName: 'الاسم الكامل',
    saudiPhone: 'رقم الجوال السعودي',
    city: 'المدينة',
    districtStreet: 'الحي والشارع',
    nationalAddress: 'العنوان الوطني المختصر (اختياري)',
    nationalAddressPlaceholder: 'مثال: RRRD2929',
    deliveryNotes: 'ملاحظات المندوب أو مقاس النظر (اختياري)',
    continueToPayment: 'المتابعة للدفع',
    backToDelivery: 'العودة للعنوان',
    selectSaudiPayment: 'اختر وسيلة الدفع المفضلة',
    cardNumber: 'رقم بطاقة مدى / الائتمان',
    cardHolder: 'الاسم على البطاقة',
    expiry: 'تاريخ الانتهاء (MM/YY)',
    cvv: 'رمز الأمان CVV',
    applePayNotice: 'سيتم تأكيد الدفع فوراً عبر Apple Pay باستخدام Face ID أو Touch ID بالريال السعودي.',
    stcPhoneLabel: 'رقم الجوال المسجل في STC Pay',
    stcSendOtp: 'إرسال رمز التحقق',
    stcOtpSent: 'تم إرسال رمز تحقق تجريبي (4821) إلى جوالك',
    stcOtpPlaceholder: 'أدخل رمز التحقق (مثال: 4821)',
    installmentPlanTitle: 'جدول الأقساط الأربعة بدون فوائد (متوافق مع الشريعة)',
    installmentToday: 'اليوم (الدفعة الأولى)',
    installmentMonth2: 'بعد شهر',
    installmentMonth3: 'بعد شهرين',
    installmentMonth4: 'بعد ٣ أشهر',
    installmentZeroInterest: '٠٪ فوائد · بدون رسوم تأخير · موافقة فورية بالهوية السعودية',
    codNotice: 'ادفع نقداً أو ببطاقة مدى عبر جهاز الدفع المحمول لدى المندوب عند استلام طلبك.',
    codFeeLabel: 'رسوم الدفع عند الاستلام',
    placeOrder: 'تأكيد الطلب الآن',
    processingOrder: 'جاري توثيق الدفع وإصدار الفاتورة الضريبية...',
    orderConfirmedTitle: 'تم تأكيد طلبك بنجاح',
    orderConfirmedSub: 'تم إصدار الفاتورة الضريبية المبسطة وجاري تجهيز عدساتك في مختبر الرياض.',
    orderNumber: 'رقم الطلب',
    zatcaVatNo: 'الرقم الضريبي (هيئة الزكاة)',
    estimatedDelivery: 'موعد التوصيل المتوقع',
    paymentUsed: 'وسيلة الدفع',
    shippingTo: 'التوصيل إلى',
    continueShopping: 'متابعة التسوق',
    boutiquesTitle: 'فروع دار نَظَر في المملكة',
    boutiquesLead: 'احجز فحص نظر رقمي مجاني وتجربة الإطارات في أحد معارضنا بالرياض أو جدة أو الخبر.',
    bookEyeExam: 'حجز فحص نظر مجاني',
    examBookedMsg: 'تم تأكيد موعد فحص النظر المجاني! سنتواصل معك عبر الواتساب لتأكيد الوقت.',
    preferredBranch: 'الفرع المفضل',
    preferredDate: 'التاريخ المناسب',
    confirmBooking: 'تأكيد الحجز المجاني',
    footerAddress: 'الرياض (العليا) · جدة (التحلية) · الخبر (الكورنيش) — care@nazaratelier.sa',
    footerCopyright: '© ٢٠٢٦ دار نَظَر للبصريات · سجل تجاري ١٠١٠٨٤٢٩١٥ · المملكة العربية السعودية',
  },
  en: {
    brand: 'Nazar ',
    brandEm: 'Atelier',
    splashTag: 'Riyadh · Jeddah · Al-Khobar · Optical Archive 2026',
    skipSplash: 'Enter Store',
    navArchive: '3D Archive',
    navCollection: 'Collection',
    navLensLab: 'Lens Lab',
    navBoutiques: 'Boutiques',
    bag: 'Bag',
    menu: 'Menu',
    close: 'Close',
    sphereHeadline: ['See', 'Beyond', 'the', 'Frame'],
    sphereSubline: '24 sculpted optical & sun silhouettes in Japanese titanium & Italian acetate',
    atelierCardTitle: 'Nazar Optical Atelier',
    atelierCardBody:
      'A complete optical house offering prescription, polarized sun, blue-light, photochromic, magnetic clip-on, reading, sports, and youth eyewear — with Saudi checkout.',
    dragToRotate: 'Drag to rotate',
    scrollReverseCue: 'Drag to rotate · Scroll up to return to the eye',
    replayEye: 'Replay Eye Dive',
    skipVideo: 'Skip',
    browseCatalog: 'Browse All 24 Frames',
    backToSphere: '3D Archive',
    saudiPaymentsShort: 'mada · Apple Pay · STC Pay · Tamara · Tabby · Cash on Delivery',
    sar: 'SAR',
    vatIncluded: 'Incl. 15% KSA VAT',
    searchPlaceholder: 'Search frames, lens types, or materials...',
    allCategories: 'All',
    allShapes: 'All Shapes',
    sortFeatured: 'Featured',
    sortPriceAsc: 'Price: Low to High',
    sortPriceDesc: 'Price: High to Low',
    framesCount: 'frames available',
    noResultsTitle: 'No matching eyewear found',
    noResultsSub: 'Try another category, shape, or search keyword to explore the collection.',
    resetFilters: 'Reset Filters',
    quickView: 'Configure & Buy',
    addToBag: 'Add to Bag',
    addedToBag: 'Added to Bag',
    inStock: 'Ready to Ship in KSA',
    limitedEdition: 'Limited Run',
    chooseColor: 'Frame Finish',
    chooseLens: 'Select Lens Package',
    prescriptionToggle: 'Add Optical Prescription (Optional)',
    prescriptionHint: 'Enter your prescription values now, or send a photo via WhatsApp after checkout.',
    rightEye: 'Right Eye (OD)',
    leftEye: 'Left Eye (OS)',
    pdLabel: 'Pupillary Distance (PD)',
    sendRxLater: 'Send prescription later via WhatsApp',
    frameSpecs: 'Frame Specifications',
    materialLabel: 'Material',
    originLabel: 'Crafted In',
    dimensionsLabel: 'Sizing',
    weightLabel: 'Weight',
    installmentNote: 'Or 4 interest-free payments of',
    lensLabTitle: 'Nazar Optical Lens Lab',
    lensLabLead:
      'Every frame is custom-fitted in our Riyadh optical lab with German and Japanese high-index lenses, hydrophobic anti-reflective coatings, and full UV400 protection.',
    ksaTrustTitle: 'Built for Seamless Saudi Shopping',
    ksaTrustItems: [
      {
        title: 'Complete Saudi Payments',
        detail: 'Pay securely with mada, Apple Pay, STC Pay, Tamara or Tabby 4x installments, or Cash on Delivery.',
      },
      {
        title: 'Express KSA Delivery',
        detail: 'Same-day courier in Riyadh, and 1–2 business days to Jeddah, Dammam, Al-Khobar, Makkah, and nationwide.',
      },
      {
        title: 'Free Eye Exam & 2-Year Warranty',
        detail: '24-month optical warranty on every frame and lens, with effortless 14-day exchanges across Saudi Arabia.',
      },
    ],
    cartTitle: 'Shopping Bag',
    cartEmptyTitle: 'Your shopping bag is empty',
    cartEmptyBody: 'Explore 24 optical, polarized sun, blue-light, clip-on, and sport eyewear designs.',
    exploreFrames: 'Explore Collection',
    freeShippingUnlocked: 'Complimentary express KSA shipping unlocked',
    freeShippingRemaining: 'Add {amount} SAR more for free express KSA delivery',
    promoPlaceholder: 'Promo code (try KSA15 or RIYADH)',
    apply: 'Apply',
    promoApplied: 'Promo code applied',
    promoInvalid: 'Invalid code — try KSA15 (15% off) or RIYADH (50 SAR off)',
    promoHint: 'Active codes: KSA15 · RIYADH',
    subtotal: 'Subtotal',
    discount: 'Discount',
    shipping: 'Express KSA Shipping',
    free: 'Free',
    vatLine: 'Includes 15% Saudi VAT',
    total: 'Total Due',
    proceedCheckout: 'Proceed to Saudi Checkout',
    checkoutTitle: 'Checkout — Saudi Arabia',
    stepDelivery: '1. Delivery Address',
    stepPayment: '2. Saudi Payment',
    fullName: 'Full Name',
    saudiPhone: 'Saudi Mobile Number',
    city: 'City',
    districtStreet: 'District & Street',
    nationalAddress: 'Saudi National Short Address (Optional)',
    nationalAddressPlaceholder: 'e.g. RRRD2929',
    deliveryNotes: 'Courier or prescription notes (Optional)',
    continueToPayment: 'Continue to Payment',
    backToDelivery: 'Back to Address',
    selectSaudiPayment: 'Choose Your Payment Method',
    cardNumber: 'mada / Card Number',
    cardHolder: 'Cardholder Name',
    expiry: 'Expiry (MM/YY)',
    cvv: 'CVV',
    applePayNotice: 'Instant encrypted settlement in SAR via Apple Pay using Face ID or Touch ID.',
    stcPhoneLabel: 'STC Pay Registered Mobile',
    stcSendOtp: 'Send Verification Code',
    stcOtpSent: 'Demo verification code (4821) sent to your mobile',
    stcOtpPlaceholder: 'Enter 4-digit OTP (e.g. 4821)',
    installmentPlanTitle: '4 Interest-Free Installments (Sharia-Compliant)',
    installmentToday: 'Today (1st Payment)',
    installmentMonth2: 'In 1 Month',
    installmentMonth3: 'In 2 Months',
    installmentMonth4: 'In 3 Months',
    installmentZeroInterest: '0% interest · No hidden fees · Instant Saudi ID approval',
    codNotice: 'Pay in cash or tap your mada card on the courier’s POS terminal upon delivery.',
    codFeeLabel: 'Cash on Delivery Fee',
    placeOrder: 'Confirm & Place Order',
    processingOrder: 'Authorizing payment & generating ZATCA tax invoice...',
    orderConfirmedTitle: 'Order Confirmed',
    orderConfirmedSub: 'Your simplified ZATCA tax invoice is ready and our Riyadh lab has queued your frame.',
    orderNumber: 'Order Reference',
    zatcaVatNo: 'ZATCA VAT Registration',
    estimatedDelivery: 'Estimated Delivery',
    paymentUsed: 'Payment Method',
    shippingTo: 'Delivering To',
    continueShopping: 'Continue Exploring',
    boutiquesTitle: 'Nazar Boutiques in Saudi Arabia',
    boutiquesLead: 'Book a complimentary digital eye test and personal frame fitting in Riyadh, Jeddah, or Al-Khobar.',
    bookEyeExam: 'Book Complimentary Eye Exam',
    examBookedMsg: 'Your complimentary eye exam is booked. Our optometrist will confirm via WhatsApp.',
    preferredBranch: 'Preferred Boutique',
    preferredDate: 'Preferred Date',
    confirmBooking: 'Confirm Booking',
    footerAddress: 'Riyadh (Olaya) · Jeddah (Tahlia) · Al-Khobar (Corniche) — care@nazaratelier.sa',
    footerCopyright: '© 2026 Nazar Optical Atelier · CR 1010842915 · Kingdom of Saudi Arabia',
  },
};

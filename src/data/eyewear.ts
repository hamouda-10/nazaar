export type CategoryId =
  | 'all'
  | 'optical'
  | 'sunglasses'
  | 'bluelight'
  | 'photochromic'
  | 'clipon'
  | 'reading'
  | 'sports'
  | 'rimless'
  | 'kids';

export type PaymentMethodId =
  | 'mada'
  | 'applepay'
  | 'stcpay'
  | 'tamara'
  | 'tabby'
  | 'cod'
  | 'card';

export interface BiText {
  ar: string;
  en: string;
}

export interface ColorOption {
  id: string;
  name: BiText;
  hex: string;
}

export interface EyewearProduct {
  id: string;
  sku: string;
  name: BiText;
  subtitle: BiText;
  category: Exclude<CategoryId, 'all'>;
  shape: BiText;
  shapeId: string;
  material: BiText;
  origin: BiText;
  dimensions: string;
  weight: string;
  price: number; // SAR inclusive of 15% VAT
  image: string;
  cutoutImage: string;
  clearWhiteLenses?: boolean;
  imageFilter?: string;
  tall?: boolean;
  inSphere: boolean;
  badge?: BiText;
  colors: ColorOption[];
  note: BiText;
  defaultLensId: string;
}

export interface LensPackage {
  id: string;
  name: BiText;
  description: BiText;
  priceDelta: number;
  requiresRx?: boolean;
}

export interface SaudiCity {
  id: string;
  name: BiText;
  eta: BiText;
}

const IMG = {
  aviatorGold: '/src/assets/images/eyewear_aviator_gold_1795726465856.jpg',
  acetateRound: '/src/assets/images/eyewear_acetate_round_1795726465485.jpg',
  obsidianWayfarer: '/src/assets/images/eyewear_obsidian_wayfarer_1795726469051.jpg',
  titaniumRimless: '/src/assets/images/eyewear_titanium_rimless_1795726468623.jpg',
  cateyeChampagne: '/src/assets/images/eyewear_cateye_champagne_1795726468737.jpg',
  browlineClassic: '/src/assets/images/eyewear_browline_classic_1795726469566.jpg',
  sportWrap: '/src/assets/images/eyewear_sport_wrap_1795726472134.jpg',
  geometricClipon: '/src/assets/images/eyewear_geometric_clipon_1795726471373.jpg',
};

const CUTOUT = {
  aviatorGold: '/src/assets/images/cutout_aviator_gold_1795729538037.jpg',
  acetateRound: '/src/assets/images/cutout_acetate_round_1795729539483.jpg',
  obsidianWayfarer: '/src/assets/images/cutout_obsidian_wayfarer_1795729539603.jpg',
  titaniumRimless: '/src/assets/images/cutout_titanium_rimless_1795729539541.jpg',
  cateyeChampagne: '/src/assets/images/cutout_cateye_champagne_1795729542748.jpg',
  browlineClassic: '/src/assets/images/cutout_browline_classic_1795729543812.jpg',
  sportWrap: '/src/assets/images/cutout_sport_wrap_1795729542989.jpg',
  geometricClipon: '/src/assets/images/cutout_geometric_clipon_1795729545096.jpg',
};

export const CATEGORIES: { id: CategoryId; label: BiText }[] = [
  { id: 'all', label: { ar: 'الكل (٢٤)', en: 'All (24)' } },
  { id: 'optical', label: { ar: 'طبية يومية', en: 'Optical' } },
  { id: 'sunglasses', label: { ar: 'شمسية مستقطبة', en: 'Sunglasses' } },
  { id: 'bluelight', label: { ar: 'حماية الشاشات', en: 'Blue-Light' } },
  { id: 'photochromic', label: { ar: 'فوتوكروميك', en: 'Photochromic' } },
  { id: 'clipon', label: { ar: 'كليب أون مغناطيسي', en: 'Clip-On' } },
  { id: 'reading', label: { ar: 'نظارات قراءة', en: 'Reading' } },
  { id: 'sports', label: { ar: 'رياضية وقيادة', en: 'Sports & Drive' } },
  { id: 'rimless', label: { ar: 'بدون إطار فاخرة', en: 'Rimless' } },
  { id: 'kids', label: { ar: 'أطفال وناشئة', en: 'Kids & Youth' } },
];

export const SHAPES: { id: string; label: BiText }[] = [
  { id: 'all', label: { ar: 'كل الأشكال', en: 'All Shapes' } },
  { id: 'aviator', label: { ar: 'أفياتور طيار', en: 'Aviator' } },
  { id: 'round', label: { ar: 'دائري', en: 'Round' } },
  { id: 'square', label: { ar: 'مربع / وايفارير', en: 'Wayfarer / Square' } },
  { id: 'rimless', label: { ar: 'بدون إطار', en: 'Rimless' } },
  { id: 'cateye', label: { ar: 'عين القطة', en: 'Cat-Eye' } },
  { id: 'browline', label: { ar: 'براولاين كلاسيكي', en: 'Browline' } },
  { id: 'geometric', label: { ar: 'هندسي مثمن', en: 'Geometric' } },
  { id: 'wrap', label: { ar: 'رياضي انسيابي', en: 'Sport Wrap' } },
];

export const LENS_PACKAGES: LensPackage[] = [
  {
    id: 'frame-only',
    name: { ar: 'إطار فقط (عدسات عرض)', en: 'Frame Only (Demo Lenses)' },
    description: {
      ar: 'مناسب إذا رغبت في تركيب العدسات لاحقاً في فرعك المفضل.',
      en: 'Ideal if you prefer fitting custom lenses locally later.',
    },
    priceDelta: 0,
  },
  {
    id: 'clear-ar',
    name: { ar: 'عدسات طبية شفافة مضادة للانعكاس 1.56', en: 'Clear Anti-Reflective Optical 1.56' },
    description: {
      ar: 'وضوح عالٍ مع طبقة مقاومة للخدش والأتربة والماء.',
      en: 'Crisp clarity with scratch-resistant, hydrophobic AR coating.',
    },
    priceDelta: 0,
    requiresRx: true,
  },
  {
    id: 'blue-shield',
    name: { ar: 'عدسات حماية من الضوء الأزرق للشاشات', en: 'Digital Blue-Light Filter 420nm' },
    description: {
      ar: 'تقلل إجهاد العين أثناء العمل على الحاسوب والهاتف بدون اصفرار مزعج.',
      en: 'Blocks harmful HEV screen light without heavy yellow tint.',
    },
    priceDelta: 120,
    requiresRx: true,
  },
  {
    id: 'polarized-sun',
    name: { ar: 'عدسات شمسية مستقطبة UV400 للصحراء', en: 'Polarized Desert UV400 Sun Lenses' },
    description: {
      ar: 'تلغي وهج الطرق والشمس القوية في أجواء المملكة بوضوح فائق.',
      en: 'Eliminates harsh road and desert glare with full UV400 shielding.',
    },
    priceDelta: 220,
  },
  {
    id: 'high-index-167',
    name: { ar: 'عدسات طبية مضغوطة فائقة النحافة 1.67', en: 'Ultra-Thin 1.67 High-Index Prescription' },
    description: {
      ar: 'أنحف بنسبة ٣٥٪ للمقاسات المتوسطة والعالية مع خفة وزن مذهلة.',
      en: '35% thinner profile engineered for stronger prescriptions.',
    },
    priceDelta: 280,
    requiresRx: true,
  },
  {
    id: 'photochromic',
    name: { ar: 'عدسات فوتوكروميك (تتغير مع الشمس تلقائياً)', en: 'Photochromic Transitions Gen-S' },
    description: {
      ar: 'شفافة تماماً في الداخل وتتحول إلى نظارة شمسية داكنة خلال ثوانٍ بالخارج.',
      en: 'Crystal clear indoors, rapidly darkens into sun tint outdoors.',
    },
    priceDelta: 390,
    requiresRx: true,
  },
];

export const EYEWEAR_PRODUCTS: EyewearProduct[] = [
  {
    id: 'diriyah-aviator-gold',
    sku: 'NZ-AV-01',
    name: { ar: 'الدرعية أفياتور ١٨ قيراط', en: 'Diriyah Aviator 18K' },
    subtitle: { ar: 'شمسية مستقطبة · تيتانيوم ياباني مطلي ذهب', en: 'Polarized Sun · 18K Gold-Plated Titanium' },
    category: 'sunglasses',
    shape: { ar: 'أفياتور طيار', en: 'Aviator' },
    shapeId: 'aviator',
    material: { ar: 'تيتانيوم بيتا ياباني', en: 'Japanese Beta-Titanium' },
    origin: { ar: 'ساباي، اليابان', en: 'Sabae, Japan' },
    dimensions: '57 □ 16 — 145 mm',
    weight: '19g',
    price: 1290,
    image: IMG.aviatorGold,
    cutoutImage: CUTOUT.aviatorGold,
    inSphere: true,
    badge: { ar: 'الأكثر مبيعاً', en: 'Bestseller' },
    colors: [
      { id: 'brushed-gold', name: { ar: 'ذهب مطفي وزيتوني', en: 'Brushed Gold / Olive' }, hex: '#c8a664' },
      { id: 'gunmetal', name: { ar: 'رمادي فحمي ودخاني', en: 'Gunmetal / Smoke' }, hex: '#4b4e54' },
      { id: 'champagne', name: { ar: 'شامبين وبني دافئ', en: 'Champagne / Amber' }, hex: '#d8c29d' },
    ],
    note: {
      ar: 'إطار طيار منحوت من التيتانيوم الياباني فائق الخفة مع عدسات معدنية مستقطبة مصممة خصيصاً لشمس الجزيرة العربية القوية.',
      en: 'Sculpted from featherweight Sabae titanium with mineral polarized lenses engineered to neutralize high-noon desert glare.',
    },
    defaultLensId: 'polarized-sun',
  },
  {
    id: 'alula-havana-round',
    sku: 'NZ-OP-02',
    name: { ar: 'العُلا دائري هافانا', en: 'AlUla Havana Round' },
    subtitle: { ar: 'نظارة طبية · أسيتات ماتزوكيلي الإيطالي', en: 'Optical · Mazzucchelli Italian Acetate' },
    category: 'optical',
    shape: { ar: 'دائري', en: 'Round' },
    shapeId: 'round',
    material: { ar: 'أسيتات إيطالي طبيعي', en: 'Mazzucchelli Acetate' },
    origin: { ar: 'كادوري، إيطاليا', en: 'Cadore, Italy' },
    dimensions: '48 □ 21 — 145 mm',
    weight: '22g',
    price: 840,
    image: IMG.acetateRound,
    cutoutImage: CUTOUT.acetateRound,
    clearWhiteLenses: true,
    inSphere: true,
    badge: { ar: 'اختيار المحررين', en: 'Atelier Pick' },
    colors: [
      { id: 'havana', name: { ar: 'هافانا سلحفائي', en: 'Dark Havana' }, hex: '#5a3821' },
      { id: 'obsidian', name: { ar: 'أسود أوبسيديان', en: 'Obsidian Black' }, hex: '#19191b' },
      { id: 'sand', name: { ar: 'رملي شفاف', en: 'Desert Sand' }, hex: '#b69c7a' },
    ],
    note: {
      ar: 'حرفية إيطالية بلمسة كلاسيكية دائرية ومفاصل ذهبية خماسية الأسنان تمنحك ثباتاً وراحة طوال اليوم.',
      en: 'Hand-tumbled Italian cellulose acetate paired with five-barrel brushed gold hinges for effortless all-day balance.',
    },
    defaultLensId: 'clear-ar',
  },
  {
    id: 'tuwaiq-obsidian-wayfarer',
    sku: 'NZ-SU-03',
    name: { ar: 'طويق أوبسيديان وايفارير', en: 'Tuwaiq Obsidian Wayfarer' },
    subtitle: { ar: 'شمسية مستقطبة · أسيتات سميك ٨ مم', en: 'Polarized Sun · 8mm Sculpted Acetate' },
    category: 'sunglasses',
    shape: { ar: 'مربع / وايفارير', en: 'Wayfarer' },
    shapeId: 'square',
    material: { ar: 'أسيتات معماري مطفي', en: '8mm Matte Acetate' },
    origin: { ar: 'كادوري، إيطاليا', en: 'Cadore, Italy' },
    dimensions: '52 □ 20 — 148 mm',
    weight: '31g',
    price: 960,
    image: IMG.obsidianWayfarer,
    cutoutImage: CUTOUT.obsidianWayfarer,
    inSphere: true,
    colors: [
      { id: 'matte-black', name: { ar: 'أسود مطفي', en: 'Matte Obsidian' }, hex: '#171719' },
      { id: 'espresso', name: { ar: 'بني إسبريسو', en: 'Espresso Horn' }, hex: '#3e2d24' },
    ],
    note: {
      ar: 'خطوط معمارية جريئة مقطوعة من كتلة أسيتات بسمك ٨ مم، مصقولة يدوياً مع عدسات نايلون مستقطبة داكنة.',
      en: 'Architectural silhouette milled from 8mm matte obsidian acetate and fitted with high-contrast smoke polarized nylon optics.',
    },
    defaultLensId: 'polarized-sun',
  },
  {
    id: 'najd-rimless-feather',
    sku: 'NZ-RL-04',
    name: { ar: 'نجد بدون إطار ريشة', en: 'Najd Rimless Feather' },
    subtitle: { ar: 'بدون إطار فاخرة · وزن ٩ غرام فقط', en: 'Luxury Rimless · 9g Ultra-Light' },
    category: 'rimless',
    shape: { ar: 'بدون إطار', en: 'Rimless' },
    shapeId: 'rimless',
    material: { ar: 'تيتانيوم ياباني نقي', en: 'Pure Japanese Titanium' },
    origin: { ar: 'ساباي، اليابان', en: 'Sabae, Japan' },
    dimensions: '53 □ 18 — 145 mm',
    weight: '9g',
    price: 1450,
    image: IMG.titaniumRimless,
    cutoutImage: CUTOUT.titaniumRimless,
    inSphere: true,
    badge: { ar: 'أخف وزن', en: '9g Featherweight' },
    colors: [
      { id: 'brushed-silver', name: { ar: 'فضي تيتانيوم', en: 'Brushed Silver' }, hex: '#a9aeb4' },
      { id: 'pale-gold', name: { ar: 'ذهب شاحب', en: 'Pale Gold' }, hex: '#ccb382' },
    ],
    note: {
      ar: 'تصميم بدون إطار شبه غير مرئي على الوجه، مصنوع من التيتانيوم النقي بدون براغي تقليدية لمظهر تنفيذي راقٍ.',
      en: 'Virtually weightless architectural rimless engineering with screwless tension mounts for understated executive presence.',
    },
    defaultLensId: 'high-index-167',
  },
  {
    id: 'jeddah-champagne-cateye',
    sku: 'NZ-OP-05',
    name: { ar: 'جدة شامبين كات آي', en: 'Jeddah Champagne Cat-Eye' },
    subtitle: { ar: 'نظارة طبية نسائية · أسيتات كريستال دافئ', en: 'Women’s Optical · Warm Crystal Acetate' },
    category: 'optical',
    shape: { ar: 'عين القطة', en: 'Cat-Eye' },
    shapeId: 'cateye',
    material: { ar: 'أسيتات كريستال وتيتانيوم', en: 'Crystal Acetate & Titanium' },
    origin: { ar: 'ميلانو، إيطاليا', en: 'Milan, Italy' },
    dimensions: '51 □ 17 — 142 mm',
    weight: '18g',
    price: 890,
    image: IMG.cateyeChampagne,
    cutoutImage: CUTOUT.cateyeChampagne,
    inSphere: true,
    badge: { ar: 'إصدار محدود', en: 'Limited Run' },
    colors: [
      { id: 'champagne', name: { ar: 'شامبين عسلي', en: 'Warm Champagne' }, hex: '#d3a668' },
      { id: 'rose-quartz', name: { ar: 'وردي كوارتز', en: 'Rose Crystal' }, hex: '#cfa09c' },
      { id: 'noir', name: { ar: 'أسود لامع', en: 'Gloss Noir' }, hex: '#1c1c1e' },
    ],
    note: {
      ar: 'انحناءة عين القطة المتوازنة بأذرع ذهبية رفيعة تبرز ملامح الوجه بأناقة ناعمة ومثالية للعدسات الطبية أو حماية الشاشات.',
      en: 'A refined sculpted cat-eye in luminous honey-champagne crystal with slender brushed gold titanium temples.',
    },
    defaultLensId: 'clear-ar',
  },
  {
    id: 'olaya-browline-heritage',
    sku: 'NZ-OP-06',
    name: { ar: 'العليا براولاين التراثي', en: 'Olaya Heritage Browline' },
    subtitle: { ar: 'طبية كلاسيكية · أبانوس مطفي وبرونز عتيق', en: 'Classic Optical · Ebony & Antique Bronze' },
    category: 'optical',
    shape: { ar: 'براولاين كلاسيكي', en: 'Browline' },
    shapeId: 'browline',
    material: { ar: 'أسيتات أبانوس وتيتانيوم برونزي', en: 'Ebony Acetate & Bronze Metal' },
    origin: { ar: 'ساباي، اليابان', en: 'Sabae, Japan' },
    dimensions: '50 □ 20 — 145 mm',
    weight: '21g',
    price: 980,
    image: IMG.browlineClassic,
    cutoutImage: CUTOUT.browlineClassic,
    inSphere: true,
    colors: [
      { id: 'ebony-bronze', name: { ar: 'أبانوس وبرونز', en: 'Ebony / Antique Bronze' }, hex: '#6f583f' },
      { id: 'black-silver', name: { ar: 'أسود وفضي', en: 'Black / Silver' }, hex: '#383a3f' },
    ],
    note: {
      ar: 'إعادة صياغة حديثة لطراز الخمسينيات الأيقوني مع وسادات أنف تيتانيوم قابلة للتعديل وجسر محفور بدقة مجهرية.',
      en: 'A contemporary interpretation of mid-century optical architecture featuring an engraved bronze bridge and custom titanium nose pads.',
    },
    defaultLensId: 'clear-ar',
  },
  {
    id: 'redsea-carbon-sport',
    sku: 'NZ-SP-07',
    name: { ar: 'البحر الأحمر كاربون سبورت', en: 'Red Sea Carbon Shield' },
    subtitle: { ar: 'رياضية · درع فوتوكروميك مقاوم للصدمات', en: 'Sports Wrap · Impact Photochromic Shield' },
    category: 'sports',
    shape: { ar: 'رياضي انسيابي', en: 'Sport Wrap' },
    shapeId: 'wrap',
    material: { ar: 'ألياف كربون و TR90', en: 'Carbon Composite & TR90' },
    origin: { ar: 'زيورخ، سويسرا', en: 'Zurich, Switzerland' },
    dimensions: '138 □ 00 — 132 mm',
    weight: '24g',
    price: 780,
    image: IMG.sportWrap,
    cutoutImage: CUTOUT.sportWrap,
    inSphere: true,
    colors: [
      { id: 'carbon-copper', name: { ar: 'كاربون وعدسة نحاسية', en: 'Carbon / Copper Shield' }, hex: '#7a523c' },
      { id: 'stealth-black', name: { ar: 'أسود رياضي ورمادي', en: 'Stealth / Smoke' }, hex: '#26282b' },
    ],
    note: {
      ar: 'مصممة لركوب الدراجات والجري والقيادة الصحراوية؛ تهوية مضادة للضباب مع تثبيت محكم لا ينزلق مع الحركة.',
      en: 'Aerodynamic wrap shield built for cycling, desert trails, and coastal running with anti-fog vents and hydrophilic grip temples.',
    },
    defaultLensId: 'polarized-sun',
  },
  {
    id: 'khobar-octa-clipon',
    sku: 'NZ-CL-08',
    name: { ar: 'الخبر مثمّن كليب أون ٢ في ١', en: 'Khobar Octa Magnetic 2-in-1' },
    subtitle: { ar: 'كليب أون مغناطيسي · طبية + شمسية مستقطبة', en: 'Magnetic Clip-On · Optical + Polarized Sun' },
    category: 'clipon',
    shape: { ar: 'هندسي مثمن', en: 'Geometric' },
    shapeId: 'geometric',
    material: { ar: 'تيتانيوم جان ميتال', en: 'Gunmetal Titanium' },
    origin: { ar: 'ساباي، اليابان', en: 'Sabae, Japan' },
    dimensions: '49 □ 20 — 145 mm',
    weight: '16g',
    price: 1090,
    image: IMG.geometricClipon,
    cutoutImage: CUTOUT.geometricClipon,
    inSphere: true,
    badge: { ar: '٢ في ١ مغناطيسي', en: '2-in-1 Magnetic' },
    colors: [
      { id: 'gunmetal', name: { ar: 'جان ميتال داكن', en: 'Dark Gunmetal' }, hex: '#52565c' },
      { id: 'matte-gold', name: { ar: 'ذهبي مطفي', en: 'Matte Gold' }, hex: '#bfa065' },
    ],
    note: {
      ar: 'تتحول من نظارة طبية مثمّنة أنيقة إلى نظارة شمسية مستقطبة بلمسة مغناطيسية خفية في أقل من ثانية واحدة.',
      en: 'Precision octagonal optical frame with an invisible neodymium magnetic polarized sun clip that snaps flush in a single motion.',
    },
    defaultLensId: 'clear-ar',
  },
  {
    id: 'kafd-screen-blueblock',
    sku: 'NZ-BL-09',
    name: { ar: 'كافد ديجيتال بلو شيلد', en: 'KAFD Studio Blue-Shield' },
    subtitle: { ar: 'حماية من الضوء الأزرق · للعمل والشاشات', en: 'Blue-Light Blocking · Executive Screen' },
    category: 'bluelight',
    shape: { ar: 'براولاين كلاسيكي', en: 'Browline' },
    shapeId: 'browline',
    material: { ar: 'تيتانيوم وأسيتات خفيف', en: 'Lightweight Acetate & Steel' },
    origin: { ar: 'برلين، ألمانيا', en: 'Berlin, Germany' },
    dimensions: '51 □ 19 — 145 mm',
    weight: '17g',
    price: 620,
    image: IMG.browlineClassic,
    cutoutImage: CUTOUT.browlineClassic,
    imageFilter: 'contrast(1.06) saturate(0.75) brightness(0.96)',
    inSphere: true,
    colors: [
      { id: 'graphite', name: { ar: 'جرافيت وأسود', en: 'Graphite Matte' }, hex: '#36393e' },
      { id: 'navy', name: { ar: 'كحلي ليلي', en: 'Midnight Navy' }, hex: '#232c3d' },
    ],
    note: {
      ar: 'مجهزة مسبقاً بعدسات ترشيح الضوء الأزرق ٤٢٠ نانومتر لحماية العين من الصداع وجفاف الشاشات لساعات العمل الطويلة.',
      en: 'Pre-fitted with 420nm blue-violet filtration optics to ease digital eye fatigue during long studio and trading sessions.',
    },
    defaultLensId: 'blue-shield',
  },
  {
    id: 'neom-photochromic-titanium',
    sku: 'NZ-PH-10',
    name: { ar: 'نيوم فوتوكروميك تيتانيوم', en: 'NEOM Adaptive Photochromic' },
    subtitle: { ar: 'عدسات متغيرة مع الشمس · تلقائية الذكاء', en: 'Photochromic Transitions · Smart Titanium' },
    category: 'photochromic',
    shape: { ar: 'هندسي مثمن', en: 'Geometric' },
    shapeId: 'geometric',
    material: { ar: 'تيتانيوم مرن', en: 'Flex Beta-Titanium' },
    origin: { ar: 'ساباي، اليابان', en: 'Sabae, Japan' },
    dimensions: '50 □ 19 — 145 mm',
    weight: '14g',
    price: 1180,
    image: IMG.geometricClipon,
    cutoutImage: CUTOUT.geometricClipon,
    imageFilter: 'sepia(0.18) contrast(1.04)',
    inSphere: true,
    badge: { ar: 'متغيرة تلقائياً', en: 'Sun-Adaptive' },
    colors: [
      { id: 'titanium-slate', name: { ar: 'سليت فضي', en: 'Titanium Slate' }, hex: '#6c7076' },
      { id: 'bronze', name: { ar: 'برونزي دافئ', en: 'Warm Bronze' }, hex: '#8b6f4e' },
    ],
    note: {
      ar: 'تأتي مجهزة بعدسات فوتوكروميك من الجيل الأحدث تتحول من شفافة تماماً داخل المكتب إلى شمسية داكنة فور خروجك للشمس.',
      en: 'Equipped with rapid-response photochromic lenses that remain crystal clear indoors and shift to deep sun shade within seconds outside.',
    },
    defaultLensId: 'photochromic',
  },
  {
    id: 'tahlia-amber-sun',
    sku: 'NZ-SU-11',
    name: { ar: 'التحلية كات آي شمسية', en: 'Tahlia Amber Sun Cat-Eye' },
    subtitle: { ar: 'شمسية نسائية · عدسات متدرجة UV400', en: 'Women’s Sun · Gradient Amber UV400' },
    category: 'sunglasses',
    shape: { ar: 'عين القطة', en: 'Cat-Eye' },
    shapeId: 'cateye',
    material: { ar: 'أسيتات فرنسي مصقول', en: 'Polished French Acetate' },
    origin: { ar: 'باريس، فرنسا', en: 'Paris, France' },
    dimensions: '53 □ 18 — 143 mm',
    weight: '26g',
    price: 920,
    image: IMG.cateyeChampagne,
    cutoutImage: CUTOUT.cateyeChampagne,
    imageFilter: 'contrast(1.1) saturate(1.18) brightness(0.92)',
    inSphere: true,
    colors: [
      { id: 'amber-gold', name: { ar: 'عنبر وذهب', en: 'Amber / Gold' }, hex: '#c88c42' },
      { id: 'tortoise', name: { ar: 'سلحفائي داكن', en: 'Deep Tortoise' }, hex: '#54351e' },
    ],
    note: {
      ar: 'أناقة مسائية ونهارية بإطار كات آي مصقول وعدسات عنبرية متدرجة تخفف حدة الشمس مع الحفاظ على وضوح التفاصيل.',
      en: 'Architectural cat-eye sun frame paired with warm amber gradient UV400 lenses for refined daytime poise.',
    },
    defaultLensId: 'polarized-sun',
  },
  {
    id: 'abha-folding-reader',
    sku: 'NZ-RD-12',
    name: { ar: 'أبها للقراءة الفاخرة', en: 'Abha Precision Reader' },
    subtitle: { ar: 'نظارة قراءة · مقاسات +1.00 إلى +3.00', en: 'Reading Glasses · +1.00 to +3.00' },
    category: 'reading',
    shape: { ar: 'دائري', en: 'Round' },
    shapeId: 'round',
    material: { ar: 'أسيتات خفيف ومفصل مرن', en: 'Feather Acetate & Spring Hinge' },
    origin: { ar: 'كادوري، إيطاليا', en: 'Cadore, Italy' },
    dimensions: '47 □ 20 — 142 mm',
    weight: '15g',
    price: 460,
    image: IMG.acetateRound,
    cutoutImage: CUTOUT.acetateRound,
    clearWhiteLenses: true,
    imageFilter: 'hue-rotate(-14deg) contrast(1.06)',
    inSphere: true,
    colors: [
      { id: 'walnut', name: { ar: 'خشب الجوز', en: 'Walnut Tortoise' }, hex: '#634129' },
      { id: 'charcoal', name: { ar: 'فحمي مطفي', en: 'Matte Charcoal' }, hex: '#2e3034' },
    ],
    note: {
      ar: 'نظارة قراءة مريحة بعدسات مضادة للتوهج ووزن خفيف جداً للقراءة المطوّلة، مع حافظة جلدية نحيفة للجيب.',
      en: 'Aspheric anti-glare reading optics housed in a spring-hinged acetate frame with a slim leather pocket case.',
    },
    defaultLensId: 'clear-ar',
  },
  {
    id: 'rubalkhali-night-drive',
    sku: 'NZ-SP-13',
    name: { ar: 'الربع الخالي للقيادة الليلية', en: 'Empty Quarter Night-Drive' },
    subtitle: { ar: 'قيادة ليلية ونهارية · مانع لوهج المصابيح', en: 'Night & Highway Drive · Anti-Glare' },
    category: 'sports',
    shape: { ar: 'أفياتور طيار', en: 'Aviator' },
    shapeId: 'aviator',
    material: { ar: 'تيتانيوم مطفي خفيف', en: 'Matte Alloy Titanium' },
    origin: { ar: 'ميونخ، ألمانيا', en: 'Munich, Germany' },
    dimensions: '58 □ 15 — 145 mm',
    weight: '18g',
    price: 740,
    image: IMG.aviatorGold,
    cutoutImage: CUTOUT.aviatorGold,
    imageFilter: 'saturate(1.25) contrast(1.08) brightness(0.95)',
    inSphere: true,
    colors: [
      { id: 'bronze-night', name: { ar: 'برونزي وعدسة قيادة', en: 'Bronze / Contrast Amber' }, hex: '#b88948' },
      { id: 'matte-black', name: { ar: 'أسود مطفي', en: 'Matte Black' }, hex: '#202124' },
    ],
    note: {
      ar: 'عدسات عالية التباين مصممة خصيصاً للطرق السريعة لتقليل وهج أنوار LED المقابلة ليلاً وتحسين الرؤية في الغبار.',
      en: 'High-contrast driving lenses engineered to cut oncoming LED headlight glare at night and sharpen visibility in desert haze.',
    },
    defaultLensId: 'polarized-sun',
  },
  {
    id: 'riyadh-executive-rimless',
    sku: 'NZ-RL-14',
    name: { ar: 'الرياض التنفيذية بدون إطار', en: 'Riyadh Sovereign Rimless' },
    subtitle: { ar: 'فائقة الفخامة · جسر تيتانيوم مصقول', en: 'Haute Rimless · Brushed Platinum Finish' },
    category: 'rimless',
    shape: { ar: 'بدون إطار', en: 'Rimless' },
    shapeId: 'rimless',
    material: { ar: 'تيتانيوم مطلي بلاتينيوم', en: 'Platinum-Finished Titanium' },
    origin: { ar: 'ساباي، اليابان', en: 'Sabae, Japan' },
    dimensions: '54 □ 17 — 145 mm',
    weight: '10g',
    price: 1690,
    image: IMG.titaniumRimless,
    cutoutImage: CUTOUT.titaniumRimless,
    imageFilter: 'brightness(1.06) contrast(1.08)',
    inSphere: true,
    badge: { ar: 'فئة النخبة', en: 'Sovereign Series' },
    colors: [
      { id: 'platinum', name: { ar: 'بلاتينيوم فضي', en: 'Brushed Platinum' }, hex: '#bfc4ca' },
      { id: 'gold-18k', name: { ar: 'ذهب ١٨ قيراط', en: '18K Satin Gold' }, hex: '#d4b472' },
    ],
    note: {
      ar: 'قطعة فاخرة مصممة للاجتماعات والمناسبات الرسمية؛ حواف عدسات مقصوصة بالألماس وجسر تيتانيوم محفور بالليزر.',
      en: 'Diamond-bevelled rimless optics anchored by a laser-fluted platinum titanium bridge crafted for formal precision.',
    },
    defaultLensId: 'high-index-167',
  },
  {
    id: 'dammam-blue-wayfarer',
    sku: 'NZ-BL-15',
    name: { ar: 'الدمام وايفارير للشاشات', en: 'Dammam Digital Wayfarer' },
    subtitle: { ar: 'حماية الشاشات والألعاب · إطار TR90 مرن', en: 'Blue-Light & Gaming · Matte Black' },
    category: 'bluelight',
    shape: { ar: 'مربع / وايفارير', en: 'Wayfarer' },
    shapeId: 'square',
    material: { ar: 'أسيتات خفيف مقاوم للصدمات', en: 'Impact-Resistant Bio-Acetate' },
    origin: { ar: 'سيول، كوريا', en: 'Seoul, South Korea' },
    dimensions: '52 □ 18 — 145 mm',
    weight: '20g',
    price: 540,
    image: IMG.obsidianWayfarer,
    cutoutImage: CUTOUT.obsidianWayfarer,
    imageFilter: 'brightness(1.08) contrast(0.95)',
    inSphere: true,
    colors: [
      { id: 'matte-ink', name: { ar: 'حبر أسود مطفي', en: 'Matte Ink' }, hex: '#1d1e21' },
      { id: 'smoke-clear', name: { ar: 'رمادي شفاف', en: 'Translucent Smoke' }, hex: '#5f6369' },
    ],
    note: {
      ar: 'مناسبة للمبرمجين والمصممين واللاعبين؛ تحجب الضوء الأزرق عالي الطاقة مع إمكانية إضافة مقاس النظر الطبي.',
      en: 'Designed for developers, creatives, and extended screen hours—blocks HEV glare while supporting full prescription upgrades.',
    },
    defaultLensId: 'blue-shield',
  },
  {
    id: 'makkah-clipon-traveller',
    sku: 'NZ-CL-16',
    name: { ar: 'مكة كليب أون للسفر ٣ في ١', en: 'Makkah 3-in-1 Travel Clip-On' },
    subtitle: { ar: 'طبية + عدسة شمسية + عدسة قيادة ليلية', en: 'Optical + Polarized Sun + Night Clip' },
    category: 'clipon',
    shape: { ar: 'مربع / وايفارير', en: 'Wayfarer' },
    shapeId: 'square',
    material: { ar: 'TR90 سويسري فائق المرونة', en: 'Swiss Flex TR90' },
    origin: { ar: 'جنيف، سويسرا', en: 'Geneva, Switzerland' },
    dimensions: '53 □ 17 — 144 mm',
    weight: '17g',
    price: 690,
    image: IMG.obsidianWayfarer,
    cutoutImage: CUTOUT.obsidianWayfarer,
    imageFilter: 'sepia(0.12) contrast(1.05)',
    inSphere: true,
    colors: [
      { id: 'obsidian', name: { ar: 'أسود كلاسيكي', en: 'Classic Obsidian' }, hex: '#18181a' },
      { id: 'espresso', name: { ar: 'بني داكن', en: 'Dark Espresso' }, hex: '#433024' },
    ],
    note: {
      ar: 'رفيق السفر المثالي: نظارة طبية واحدة تأتي مع قطعتين مغناطيسيتين (شمسية مستقطبة للنهار وصفراء مانعة للوهج ليلاً).',
      en: 'One optical chassis bundled with two snap-on magnetic shields: polarized charcoal for noon sun and amber contrast for night driving.',
    },
    defaultLensId: 'clear-ar',
  },
  {
    id: 'taif-photochromic-round',
    sku: 'NZ-PH-17',
    name: { ar: 'الطائف فوتوكروميك الدائرية', en: 'Taif Transitions Round' },
    subtitle: { ar: 'تتكيّف مع الإضاءة · داخلية وخارجية', en: 'Photochromic Optical · Indoor-to-Sun' },
    category: 'photochromic',
    shape: { ar: 'دائري', en: 'Round' },
    shapeId: 'round',
    material: { ar: 'أسيتات إيطالي وتيتانيوم', en: 'Italian Acetate & Titanium' },
    origin: { ar: 'كادوري، إيطاليا', en: 'Cadore, Italy' },
    dimensions: '49 □ 20 — 145 mm',
    weight: '20g',
    price: 1120,
    image: IMG.acetateRound,
    cutoutImage: CUTOUT.acetateRound,
    clearWhiteLenses: true,
    imageFilter: 'brightness(0.95) saturate(0.85) contrast(1.08)',
    inSphere: true,
    colors: [
      { id: 'dark-tortoise', name: { ar: 'سلحفائي وذهب', en: 'Dark Tortoise / Gold' }, hex: '#5b3c25' },
      { id: 'amber-smoke', name: { ar: 'دخاني دافئ', en: 'Warm Smoke' }, hex: '#4c4640' },
    ],
    note: {
      ar: 'مريحة للانتقال السريع بين الأماكن المغلقة وأشعة الشمس المباشرة دون الحاجة لتبديل نظارتك.',
      en: 'Effortless transition between sunlit courtyards and shaded interiors—never swap glasses again.',
    },
    defaultLensId: 'photochromic',
  },
  {
    id: 'madinah-pocket-reader',
    sku: 'NZ-RD-18',
    name: { ar: 'المدينة للقراءة نصف إطار', en: 'Madinah Half-Rim Reader' },
    subtitle: { ar: 'قراءة خفيفة الوزن · تصميم نصف إطار', en: 'Featherweight Half-Rim Reading' },
    category: 'reading',
    shape: { ar: 'بدون إطار', en: 'Rimless' },
    shapeId: 'rimless',
    material: { ar: 'تيتانيوم مرن', en: 'Flexible Titanium' },
    origin: { ar: 'ساباي، اليابان', en: 'Sabae, Japan' },
    dimensions: '51 □ 18 — 140 mm',
    weight: '11g',
    price: 520,
    image: IMG.titaniumRimless,
    cutoutImage: CUTOUT.titaniumRimless,
    imageFilter: 'sepia(0.14) brightness(0.98)',
    inSphere: true,
    colors: [
      { id: 'silver', name: { ar: 'فضي ناعم', en: 'Satin Silver' }, hex: '#aeb3b9' },
      { id: 'gunmetal', name: { ar: 'رمادي معدني', en: 'Gunmetal' }, hex: '#555960' },
    ],
    note: {
      ar: 'تمنحك مجال رؤية سفلي واضح للقراءة والهاتف دون إعاقة النظر البعيد، مع طلاء مضاد لبصمات الأصابع.',
      en: 'Minimalist half-rim silhouette crafted for crisp near focus and unobstructed glance-over clarity.',
    },
    defaultLensId: 'clear-ar',
  },
  {
    id: 'qassim-junior-safeflex',
    sku: 'NZ-KD-19',
    name: { ar: 'نَظَر جونيور سيف فليكس', en: 'Nazar Junior Safe-Flex' },
    subtitle: { ar: 'أطفال وناشئة · إطار مرن غير قابل للكسر', en: 'Kids & Youth · Bendable TR90' },
    category: 'kids',
    shape: { ar: 'دائري', en: 'Round' },
    shapeId: 'round',
    material: { ar: 'TR90 طبي آمن ١٠٠٪', en: 'Medical-Grade Flex TR90' },
    origin: { ar: 'ميلانو، إيطاليا', en: 'Milan, Italy' },
    dimensions: '44 □ 16 — 130 mm',
    weight: '12g',
    price: 360,
    image: IMG.acetateRound,
    cutoutImage: CUTOUT.acetateRound,
    clearWhiteLenses: true,
    imageFilter: 'brightness(1.06) saturate(1.12)',
    inSphere: true,
    colors: [
      { id: 'amber-honey', name: { ar: 'عسلي دافئ', en: 'Honey Tortoise' }, hex: '#8c5a30' },
      { id: 'midnight', name: { ar: 'أزرق ليلي', en: 'Midnight Blue' }, hex: '#283650' },
    ],
    note: {
      ar: 'مصممة خصيصاً للأطفال والناشئة (٦–١٤ سنة) بمفاصل مرنة ١٨٠ درجة وعدسات بولي كربونات مقاومة للكسر وحامية من شاشات الدراسة.',
      en: 'Built for ages 6–14 with 180-degree flexible hinges and shatterproof polycarbonate lenses for school and tablets.',
    },
    defaultLensId: 'blue-shield',
  },
  {
    id: 'yanbu-tall-monolith',
    sku: 'NZ-SU-20',
    name: { ar: 'ينبع مونوليث شمسية', en: 'Yanbu Monolith Sun' },
    subtitle: { ar: 'إصدار خاص · عدسة داكنة فائقة التباين', en: 'Archival Sun · High-Contrast Smoke' },
    category: 'sunglasses',
    shape: { ar: 'مربع / وايفارير', en: 'Wayfarer' },
    shapeId: 'square',
    material: { ar: 'أسيتات ياباني منحوت', en: 'Takiron Japanese Acetate' },
    origin: { ar: 'ساباي، اليابان', en: 'Sabae, Japan' },
    dimensions: '54 □ 19 — 148 mm',
    weight: '33g',
    price: 1150,
    image: IMG.obsidianWayfarer,
    cutoutImage: CUTOUT.obsidianWayfarer,
    imageFilter: 'contrast(1.16) brightness(0.92)',
    tall: true,
    inSphere: true,
    badge: { ar: 'إصدار أرشيفي', en: 'Archival Edition' },
    colors: [
      { id: 'jet-black', name: { ar: 'أسود فاحم', en: 'Jet Black' }, hex: '#111112' },
      { id: 'obsidian-olive', name: { ar: 'زيتوني داكن', en: 'Deep Olive' }, hex: '#383d33' },
    ],
    note: {
      ar: 'إطار جريء بحواف مشطوفة يدوياً مستوحى من صخور البازلت الداكنة، يمنح تغطية شمسية واسعة ووقاراً استثنائياً.',
      en: 'Hand-bevelled Japanese Takiron acetate inspired by volcanic basalt, offering wide solar coverage and sculptural presence.',
    },
    defaultLensId: 'polarized-sun',
  },
  {
    id: 'hail-desert-endurance',
    sku: 'NZ-SP-21',
    name: { ar: 'حائل رالي إنديورانس', en: 'Hail Rally Endurance' },
    subtitle: { ar: 'رياضية صحراوية · مقاومة للغبار والرياح', en: 'Desert Sport · Wind & Sand Shield' },
    category: 'sports',
    shape: { ar: 'رياضي انسيابي', en: 'Sport Wrap' },
    shapeId: 'wrap',
    material: { ar: 'كاربون فايبر خفيف', en: 'Forged Carbon Composite' },
    origin: { ar: 'زيورخ، سويسرا', en: 'Zurich, Switzerland' },
    dimensions: '140 □ 00 — 134 mm',
    weight: '25g',
    price: 890,
    image: IMG.sportWrap,
    cutoutImage: CUTOUT.sportWrap,
    imageFilter: 'hue-rotate(15deg) contrast(1.1)',
    inSphere: true,
    colors: [
      { id: 'desert-bronze', name: { ar: 'برونزي صحراوي', en: 'Desert Bronze' }, hex: '#886145' },
      { id: 'matte-carbon', name: { ar: 'كاربون أسود', en: 'Matte Carbon' }, hex: '#232426' },
    ],
    note: {
      ar: 'تغطية محيطية كاملة للعين مع طبقة مقاومة للخدش والأتربة لرحلات البر والدراجات النارية والرياضات الخارجية.',
      en: 'Full peripheral dust and UV shield with oleophobic scratch-resistant optics crafted for off-road rallies and outdoor athletics.',
    },
    defaultLensId: 'polarized-sun',
  },
  {
    id: 'tabuk-octa-optical',
    sku: 'NZ-OP-22',
    name: { ar: 'تبوك هندسي تيتانيوم', en: 'Tabuk Architectural Octa' },
    subtitle: { ar: 'نظارة طبية · تيتانيوم رفيع ١.٢ مم', en: 'Optical · 1.2mm Ultra-Thin Titanium' },
    category: 'optical',
    shape: { ar: 'هندسي مثمن', en: 'Geometric' },
    shapeId: 'geometric',
    material: { ar: 'تيتانيوم ياباني مصقول', en: 'Japanese Beta-Titanium' },
    origin: { ar: 'ساباي، اليابان', en: 'Sabae, Japan' },
    dimensions: '49 □ 21 — 145 mm',
    weight: '12g',
    price: 940,
    image: IMG.geometricClipon,
    cutoutImage: CUTOUT.geometricClipon,
    imageFilter: 'brightness(1.06) contrast(1.02)',
    inSphere: false,
    colors: [
      { id: 'steel', name: { ar: 'فولاذي مطفي', en: 'Brushed Steel' }, hex: '#71757c' },
      { id: 'gold', name: { ar: 'ذهب ناعم', en: 'Satin Gold' }, hex: '#c8ab71' },
    ],
    note: {
      ar: 'إطار مثمّن هندسي فائق النحافة يجمع بين الحداثة والوزن الريشي، مثالي للارتداء المتواصل من الصباح حتى المساء.',
      en: 'Ultra-slender 1.2mm octagonal titanium rim combining crisp geometric lines with virtually weightless comfort.',
    },
    defaultLensId: 'clear-ar',
  },
  {
    id: 'jubail-junior-sun',
    sku: 'NZ-KD-23',
    name: { ar: 'الجبيل جونيور شمسية UV400', en: 'Jubail Youth Polarized Sun' },
    subtitle: { ar: 'أطفال وناشئة · شمسية مستقطبة مرنة', en: 'Kids & Youth · Flexible Polarized Sun' },
    category: 'kids',
    shape: { ar: 'عين القطة', en: 'Cat-Eye' },
    shapeId: 'cateye',
    material: { ar: 'أسيتات حيوي خفيف', en: 'Lightweight Bio-Acetate' },
    origin: { ar: 'ميلانو، إيطاليا', en: 'Milan, Italy' },
    dimensions: '46 □ 16 — 132 mm',
    weight: '15g',
    price: 390,
    image: IMG.cateyeChampagne,
    cutoutImage: CUTOUT.cateyeChampagne,
    imageFilter: 'brightness(1.05) saturate(0.95)',
    inSphere: false,
    colors: [
      { id: 'champagne', name: { ar: 'عسلي فاتح', en: 'Light Honey' }, hex: '#d4ab73' },
      { id: 'clear-rose', name: { ar: 'وردي شفاف', en: 'Soft Rose' }, hex: '#cca29e' },
    ],
    note: {
      ar: 'حماية كاملة ١٠٠٪ من الأشعة فوق البنفسجية لعيون الأطفال الحساسة مع إطار لطيف ومريح لا يضغط خلف الأذن.',
      en: '100% UV400 polarized protection engineered for young eyes in a featherweight, pressure-free silhouette.',
    },
    defaultLensId: 'polarized-sun',
  },
  {
    id: 'alahsa-gold-browline-clipon',
    sku: 'NZ-CL-24',
    name: { ar: 'الأحساء براولاين كليب أون', en: 'Al-Ahsa Browline Clip-On' },
    subtitle: { ar: 'كليب أون كلاسيكي · طبية مع غطاء شمسي ذهبي', en: 'Classic Clip-On · Optical + Gold Sun Clip' },
    category: 'clipon',
    shape: { ar: 'براولاين كلاسيكي', en: 'Browline' },
    shapeId: 'browline',
    material: { ar: 'أسيتات وبرونز مطلي ذهب', en: 'Acetate & Gold-Plated Bronze' },
    origin: { ar: 'ساباي، اليابان', en: 'Sabae, Japan' },
    dimensions: '51 □ 20 — 145 mm',
    weight: '22g',
    price: 1140,
    image: IMG.browlineClassic,
    cutoutImage: CUTOUT.browlineClassic,
    imageFilter: 'sepia(0.16) contrast(1.07)',
    inSphere: false,
    badge: { ar: 'جديد ٢٠٢٦', en: 'New 2026' },
    colors: [
      { id: 'ebony-gold', name: { ar: 'أسود وذهب عتيق', en: 'Ebony / Antique Gold' }, hex: '#947849' },
      { id: 'havana-gold', name: { ar: 'هافانا وذهب', en: 'Havana / Gold' }, hex: '#6c492d' },
    ],
    note: {
      ar: 'يجمع هيبة تصميم البراولاين الكلاسيكي مع سهولة التحويل المغناطيسي إلى نظارة شمسية مستقطبة في لحظة.',
      en: 'Classic clubmaster elegance upgraded with an ultra-slim magnetic polarized sun shield for effortless Saudi transitions.',
    },
    defaultLensId: 'clear-ar',
  },
];

export const SAUDI_CITIES: SaudiCity[] = [
  { id: 'riyadh', name: { ar: 'الرياض', en: 'Riyadh' }, eta: { ar: 'نفس اليوم (٤–٦ ساعات)', en: 'Same-Day (4–6 hrs)' } },
  { id: 'jeddah', name: { ar: 'جدة', en: 'Jeddah' }, eta: { ar: 'خلال ٢٤ ساعة', en: 'Next Business Day' } },
  { id: 'dammam', name: { ar: 'الدمام', en: 'Dammam' }, eta: { ar: 'خلال ٢٤ ساعة', en: 'Next Business Day' } },
  { id: 'khobar', name: { ar: 'الخبر', en: 'Al-Khobar' }, eta: { ar: 'خلال ٢٤ ساعة', en: 'Next Business Day' } },
  { id: 'makkah', name: { ar: 'مكة المكرمة', en: 'Makkah' }, eta: { ar: '١–٢ يوم عمل', en: '1–2 Business Days' } },
  { id: 'madinah', name: { ar: 'المدينة المنورة', en: 'Madinah' }, eta: { ar: '١–٢ يوم عمل', en: '1–2 Business Days' } },
  { id: 'taif', name: { ar: 'الطائف', en: 'Taif' }, eta: { ar: '١–٢ يوم عمل', en: '1–2 Business Days' } },
  { id: 'qassim', name: { ar: 'القصيم (بريدة / عنيزة)', en: 'Al-Qassim' }, eta: { ar: '١–٢ يوم عمل', en: '1–2 Business Days' } },
  { id: 'abha', name: { ar: 'أبها / خميس مشيط', en: 'Abha / Khamis Mushait' }, eta: { ar: '٢ يوم عمل', en: '2 Business Days' } },
  { id: 'tabuk', name: { ar: 'تبوك', en: 'Tabuk' }, eta: { ar: '٢ يوم عمل', en: '2 Business Days' } },
  { id: 'hail', name: { ar: 'حائل', en: 'Hail' }, eta: { ar: '٢ يوم عمل', en: '2 Business Days' } },
  { id: 'alahsa', name: { ar: 'الأحساء', en: 'Al-Ahsa' }, eta: { ar: '١–٢ يوم عمل', en: '1–2 Business Days' } },
  { id: 'jubail', name: { ar: 'الجبيل', en: 'Jubail' }, eta: { ar: '١–٢ يوم عمل', en: '1–2 Business Days' } },
  { id: 'yanbu', name: { ar: 'ينبع', en: 'Yanbu' }, eta: { ar: '٢ يوم عمل', en: '2 Business Days' } },
];

export const BOUTIQUES = [
  {
    id: 'riyadh-olaya',
    name: { ar: 'الرياض — طريق العليا، سنتريا', en: 'Riyadh — Olaya Road, Centria' },
    hours: { ar: 'السبت – الخميس: ١٠ ص – ١١ م · الجمعة: ٤ م – ١١ م', en: 'Sat–Thu: 10 AM – 11 PM · Fri: 4 PM – 11 PM' },
    phone: '+966 11 490 8820',
  },
  {
    id: 'jeddah-tahlia',
    name: { ar: 'جدة — شارع التحلية، الخياط سنتر', en: 'Jeddah — Tahlia Street, Al Khayyat' },
    hours: { ar: 'السبت – الخميس: ١٠ ص – ١١ م · الجمعة: ٤:٣٠ م – ١١:٣٠ م', en: 'Sat–Thu: 10 AM – 11 PM · Fri: 4:30 PM – 11:30 PM' },
    phone: '+966 12 664 3190',
  },
  {
    id: 'khobar-corniche',
    name: { ar: 'الخبر — الكورنيش الشمالي، أجدان ووك', en: 'Al-Khobar — North Corniche, Ajdan Walk' },
    hours: { ar: 'يومياً: ١١ ص – ١١ م', en: 'Daily: 11 AM – 11 PM' },
    phone: '+966 13 881 5540',
  },
];

export const FREE_SHIPPING_THRESHOLD = 499;
export const STANDARD_SHIPPING_FEE = 29;
export const COD_FEE = 18;
export const COD_FREE_THRESHOLD = 800;

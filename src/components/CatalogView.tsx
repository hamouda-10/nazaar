import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Compass, Plus, Search, SlidersHorizontal } from 'lucide-react';
import {
  CATEGORIES,
  CategoryId,
  EyewearProduct,
  LENS_PACKAGES,
  SHAPES,
} from '../data/eyewear';
import { Lang, T } from '../data/i18n';

interface CatalogViewProps {
  products: EyewearProduct[];
  lang: Lang;
  onSelectProduct: (product: EyewearProduct) => void;
  onQuickAdd: (product: EyewearProduct) => void;
  onBackToSphere: () => void;
  onOpenBoutiques: () => void;
}

type SortMode = 'featured' | 'price-asc' | 'price-desc';

export default function CatalogView({
  products,
  lang,
  onSelectProduct,
  onQuickAdd,
  onBackToSphere,
  onOpenBoutiques,
}: CatalogViewProps) {
  const copy = T[lang];
  const [category, setCategory] = useState<CategoryId>('all');
  const [shape, setShape] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortMode>('featured');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const quickAddTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (quickAddTimerRef.current !== null) {
        window.clearTimeout(quickAddTimerRef.current);
      }
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((item) => {
      if (category !== 'all' && item.category !== category) return false;
      if (shape !== 'all' && item.shapeId !== shape) return false;
      if (q) {
        const hay = [
          item.name.ar,
          item.name.en,
          item.subtitle.ar,
          item.subtitle.en,
          item.material.ar,
          item.material.en,
          item.shape.ar,
          item.shape.en,
          item.sku,
        ]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (sort === 'price-asc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }, [products, category, shape, query, sort]);

  const handleQuickAddClick = (e: React.MouseEvent, product: EyewearProduct) => {
    e.stopPropagation();
    onQuickAdd(product);
    setJustAddedId(product.id);
    if (quickAddTimerRef.current !== null) {
      window.clearTimeout(quickAddTimerRef.current);
    }
    quickAddTimerRef.current = window.setTimeout(() => {
      quickAddTimerRef.current = null;
      setJustAddedId((curr) => (curr === product.id ? null : curr));
    }, 1200);
  };

  return (
    <main
      id="catalog-section"
      className="relative z-30 min-h-screen bg-black text-[#f4f2ef] pt-20 sm:pt-24 pb-20 border-t border-[#f4f2ef]/10"
    >
      <div className="max-w-[1380px] mx-auto px-4 sm:px-8">
        {/* Editorial Collection Header */}
        <section className="pb-10 border-b border-[#f4f2ef]/12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-xs text-[#d4b483] mb-3 tracking-wide">
                {copy.saudiPaymentsShort}
              </p>
              <h1 className="font-editorial text-[clamp(30px,4.2vw,54px)] leading-[1.12] text-[#f4f2ef] [text-wrap:balance]">
                {lang === 'ar'
                  ? 'مجموعة النظارات المتكاملة — ٢٤ تصميماً لكل احتياج'
                  : 'Complete Optical & Sun Archive — 24 Sculpted Frames'}
              </h1>
              <p className="mt-4 text-sm sm:text-base text-[#f4f2ef]/70 leading-relaxed max-w-xl">
                {copy.atelierCardBody}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={onBackToSphere}
                className="min-h-[42px] px-4 py-2 text-xs font-medium text-[#f4f2ef] border border-[#f4f2ef]/25 hover:border-[#d4b483] hover:text-[#d4b483] rounded-md transition-colors inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Compass className="w-4 h-4" />
                <span>{copy.backToSphere}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Interactive Filter Toolbar */}
        <section className="py-7 space-y-5" aria-label="Filter eyewear">
          {/* Category Segmented Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => {
              const active = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`min-h-[40px] px-4 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 border ${
                    active
                      ? 'bg-[#f4f2ef] text-black border-[#f4f2ef]'
                      : 'bg-[#0e0e10] text-[#f4f2ef]/75 border-[#f4f2ef]/14 hover:border-[#f4f2ef]/40 hover:text-white'
                  }`}
                >
                  {cat.label[lang]}
                </button>
              );
            })}
          </div>

          {/* Search + Shape + Sort Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-[#f4f2ef]/45 absolute top-1/2 -translate-y-1/2 start-3.5 pointer-events-none" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={copy.searchPlaceholder}
                className="w-full min-h-[44px] bg-[#0d0d0f] border border-[#f4f2ef]/16 focus:border-[#d4b483] rounded-md ps-10 pe-4 text-sm text-[#f4f2ef] placeholder:text-[#f4f2ef]/40 outline-none transition-colors"
              />
            </div>

            <div className="md:col-span-3 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#f4f2ef]/45 shrink-0" />
              <select
                value={shape}
                onChange={(e) => setShape(e.target.value)}
                aria-label={copy.allShapes}
                className="w-full min-h-[44px] bg-[#0d0d0f] border border-[#f4f2ef]/16 focus:border-[#d4b483] rounded-md px-3 text-sm text-[#f4f2ef] outline-none cursor-pointer"
              >
                {SHAPES.map((s) => (
                  <option key={s.id} value={s.id} className="bg-[#0d0d0f] text-[#f4f2ef]">
                    {s.label[lang]}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortMode)}
                aria-label="Sort eyewear"
                className="w-full min-h-[44px] bg-[#0d0d0f] border border-[#f4f2ef]/16 focus:border-[#d4b483] rounded-md px-3 text-sm text-[#f4f2ef] outline-none cursor-pointer"
              >
                <option value="featured" className="bg-[#0d0d0f]">
                  {copy.sortFeatured}
                </option>
                <option value="price-asc" className="bg-[#0d0d0f]">
                  {copy.sortPriceAsc}
                </option>
                <option value="price-desc" className="bg-[#0d0d0f]">
                  {copy.sortPriceDesc}
                </option>
              </select>
            </div>

            <div className="md:col-span-2 text-xs text-[#9b9691] md:text-end tabular-nums">
              {filtered.length} {copy.framesCount}
            </div>
          </div>
        </section>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center border border-[#f4f2ef]/12 rounded-lg bg-[#09090b]">
            <h2 className="font-editorial text-2xl text-[#f4f2ef] mb-2">{copy.noResultsTitle}</h2>
            <p className="text-sm text-[#9b9691] mb-6">{copy.noResultsSub}</p>
            <button
              type="button"
              onClick={() => {
                setCategory('all');
                setShape('all');
                setQuery('');
              }}
              className="min-h-[42px] px-5 py-2 text-xs font-medium bg-[#f4f2ef] text-black hover:bg-[#d4b483] rounded-md transition-colors cursor-pointer"
            >
              {copy.resetFilters}
            </button>
          </div>
        ) : (
          <section
            aria-label="Eyewear collection"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {filtered.map((item) => {
              const installment = Math.ceil(item.price / 4);
              const added = justAddedId === item.id;
              return (
                <article
                  key={item.id}
                  onClick={() => onSelectProduct(item)}
                  data-cursor="wide"
                  className="group bg-[#0b0b0d] border border-[#f4f2ef]/10 hover:border-[#f4f2ef]/30 rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-0.5 cursor-pointer flex flex-col"
                >
                  {/* 4:3 Uniform Studio Media */}
                  <div className="relative aspect-[4/3] bg-[#070708] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name[lang]}
                      referrerPolicy="no-referrer"
                      style={item.imageFilter ? { filter: item.imageFilter } : undefined}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />

                    {/* Quiet Single Text Tag if present (no pill spam) */}
                    {item.badge && (
                      <span className="absolute top-3 start-3.5 text-[11px] font-medium text-[#f4f2ef] bg-black/65 backdrop-blur-sm px-2.5 py-1 rounded">
                        {item.badge[lang]}
                      </span>
                    )}

                    {/* Quick Add Action */}
                    <button
                      type="button"
                      onClick={(e) => handleQuickAddClick(e, item)}
                      aria-label={`${copy.addToBag} — ${item.name[lang]}`}
                      className={`absolute bottom-3 end-3 min-h-[38px] px-3 py-1.5 text-xs font-medium rounded-md transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                        added
                          ? 'bg-[#d4b483] text-black'
                          : 'bg-black/80 text-[#f4f2ef] border border-[#f4f2ef]/25 hover:bg-[#f4f2ef] hover:text-black'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{added ? copy.addedToBag : copy.addToBag}</span>
                    </button>
                  </div>

                  {/* Clean Metadata & Price */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-[#9b9691] mb-1.5">
                        <span>{item.shape[lang]}</span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{item.material[lang]}</span>
                      </div>

                      <h3 className="font-editorial text-xl text-[#f4f2ef] group-hover:text-[#d4b483] transition-colors leading-snug">
                        {item.name[lang]}
                      </h3>

                      <p className="text-xs text-[#f4f2ef]/65 mt-1 line-clamp-1">
                        {item.subtitle[lang]}
                      </p>
                    </div>

                    <div className="pt-3.5 border-t border-[#f4f2ef]/10 flex items-end justify-between gap-3">
                      <div>
                        <div className="text-base font-semibold text-[#f4f2ef] tabular-nums">
                          {item.price.toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US')} {copy.sar}
                        </div>
                        <div className="text-[11px] text-[#9b9691] tabular-nums mt-0.5">
                          {lang === 'ar'
                            ? `٤ دفعات × ${installment} ر.س (تمارا / تابي)`
                            : `4 × ${installment} SAR via Tamara / Tabby`}
                        </div>
                      </div>

                      {/* Color Swatch Dots */}
                      <div className="flex items-center gap-1.5 shrink-0" aria-label={copy.chooseColor}>
                        {item.colors.map((c) => (
                          <span
                            key={c.id}
                            title={c.name[lang]}
                            className="w-3.5 h-3.5 rounded-full border border-[#f4f2ef]/35"
                            style={{ backgroundColor: c.hex }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        {/* Optical Lens Lab Section */}
        <section
          id="lens-lab"
          className="mt-20 pt-14 border-t border-[#f4f2ef]/12"
          aria-labelledby="lens-lab-heading"
        >
          <div className="max-w-2xl mb-10">
            <h2
              id="lens-lab-heading"
              className="font-editorial text-[clamp(26px,3.2vw,42px)] text-[#f4f2ef] leading-tight [text-wrap:balance]"
            >
              {copy.lensLabTitle}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#f4f2ef]/70 leading-relaxed">
              {copy.lensLabLead}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LENS_PACKAGES.map((lens, idx) => (
              <div
                key={lens.id}
                className="p-6 bg-[#0b0b0d] border border-[#f4f2ef]/12 rounded-lg flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="text-xs text-[#d4b483] tabular-nums mb-2">
                    0{idx + 1}.
                  </div>
                  <h3 className="text-base font-medium text-[#f4f2ef] mb-2">
                    {lens.name[lang]}
                  </h3>
                  <p className="text-xs leading-relaxed text-[#f4f2ef]/65">
                    {lens.description[lang]}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#f4f2ef]/10 text-xs text-[#f4f2ef]/85 tabular-nums">
                  {lens.priceDelta === 0
                    ? lang === 'ar'
                      ? 'مشمول ضمن سعر الإطار (٠ ر.س)'
                      : 'Included with frame (+0 SAR)'
                    : `+${lens.priceDelta} ${copy.sar}`}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Saudi Payment & Service Trust Section */}
        <section className="mt-20 pt-14 border-t border-[#f4f2ef]/12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <h2 className="font-editorial text-[clamp(24px,3vw,36px)] text-[#f4f2ef]">
              {copy.ksaTrustTitle}
            </h2>
            <button
              type="button"
              onClick={onOpenBoutiques}
              className="min-h-[42px] px-4 py-2 text-xs font-medium text-[#f4f2ef] border border-[#f4f2ef]/25 hover:border-[#d4b483] hover:text-[#d4b483] rounded-md transition-colors inline-flex items-center gap-2 cursor-pointer self-start md:self-auto whitespace-nowrap"
            >
              <span>{copy.bookEyeExam}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {copy.ksaTrustItems.map((trust, idx) => (
              <div
                key={idx}
                className="p-6 bg-[#0b0b0d] border border-[#f4f2ef]/12 rounded-lg space-y-2.5"
              >
                <h3 className="font-editorial text-xl text-[#f4f2ef]">{trust.title}</h3>
                <p className="text-xs leading-relaxed text-[#f4f2ef]/70">{trust.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quiet Editorial Footer */}
        <footer className="mt-20 pt-8 border-t border-[#f4f2ef]/12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#9b9691]">
          <p>{copy.footerAddress}</p>
          <p>{copy.footerCopyright}</p>
        </footer>
      </div>
    </main>
  );
}

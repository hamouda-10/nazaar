import { Menu, ShoppingBag, X } from 'lucide-react';
import { Lang, T } from '../data/i18n';

export type AppView = 'sphere' | 'catalog';

interface HeaderProps {
  lang: Lang;
  view: AppView;
  revealed: boolean;
  menuOpen: boolean;
  cartCount: number;
  onToggleLang: () => void;
  onNavigateView: (view: AppView, scrollToLensLab?: boolean) => void;
  onOpenBoutiques: () => void;
  onOpenCart: () => void;
  onToggleMenu: () => void;
}

export default function Header({
  lang,
  view,
  revealed,
  menuOpen,
  cartCount,
  onToggleLang,
  onNavigateView,
  onOpenBoutiques,
  onOpenCart,
  onToggleMenu,
}: HeaderProps) {
  const copy = T[lang];

  return (
    <header
      className={`portal-chrome fixed top-0 inset-x-0 z-[70] px-4 sm:px-8 transition-colors duration-500 ${
        view === 'catalog' && !menuOpen
          ? 'bg-black/88 backdrop-blur-md border-b border-[#f4f2ef]/10'
          : 'bg-gradient-to-b from-black/75 via-black/25 to-transparent'
      }`}
      style={{
        paddingTop: 'calc(14px + var(--safe-top))',
        paddingBottom: '12px',
      }}
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-6">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            onNavigateView('sphere');
          }}
          className="font-editorial text-[clamp(21px,2.1vw,28px)] leading-none text-[#f4f2ef] hover:text-white transition-colors whitespace-nowrap shrink-0"
        >
          {copy.brand}
          <em className="not-italic text-[#d4b483]">{copy.brandEm}</em>
        </a>

        {/* Zone 2: 4 Clean Single-Line Nav Links */}
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-7 text-sm text-[#f4f2ef]/75"
        >
          <button
            type="button"
            onClick={() => onNavigateView('sphere')}
            className={`whitespace-nowrap shrink-0 py-1.5 transition-colors cursor-pointer border-b ${
              view === 'sphere'
                ? 'text-white border-[#d4b483]'
                : 'border-transparent hover:text-white'
            }`}
          >
            {copy.navArchive}
          </button>
          <button
            type="button"
            onClick={() => onNavigateView('catalog', false)}
            className={`whitespace-nowrap shrink-0 py-1.5 transition-colors cursor-pointer border-b ${
              view === 'catalog'
                ? 'text-white border-[#d4b483]'
                : 'border-transparent hover:text-white'
            }`}
          >
            {copy.navCollection}
          </button>
          <button
            type="button"
            onClick={() => onNavigateView('catalog', true)}
            className="whitespace-nowrap shrink-0 py-1.5 border-b border-transparent hover:text-white transition-colors cursor-pointer"
          >
            {copy.navLensLab}
          </button>
          <button
            type="button"
            onClick={onOpenBoutiques}
            className="whitespace-nowrap shrink-0 py-1.5 border-b border-transparent hover:text-white transition-colors cursor-pointer"
          >
            {copy.navBoutiques}
          </button>
        </nav>

        {/* Zone 3: Language Switch + Shopping Bag CTA + Mobile Menu */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleLang}
            aria-label={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
            className="min-h-[40px] px-3 py-1.5 text-xs font-medium text-[#f4f2ef]/80 hover:text-white border border-[#f4f2ef]/20 hover:border-[#f4f2ef]/50 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            {lang === 'ar' ? 'EN' : 'العربية'}
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            className="min-h-[40px] px-4 py-2 text-xs font-medium bg-[#f4f2ef] text-black hover:bg-[#d4b483] rounded-md transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
          >
            <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
            <span>{copy.bag}</span>
            <span className="tabular-nums font-semibold">({cartCount})</span>
          </button>

          <button
            type="button"
            onClick={onToggleMenu}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? copy.close : copy.menu}
            className="md:hidden min-h-[40px] min-w-[40px] flex items-center justify-center text-[#f4f2ef] hover:text-[#d4b483] transition-colors cursor-pointer shrink-0"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}

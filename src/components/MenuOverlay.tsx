import { Lang, T } from '../data/i18n';
import { AppView } from './Header';

interface MenuOverlayProps {
  open: boolean;
  lang: Lang;
  onClose: () => void;
  onNavigateView: (view: AppView, scrollToLensLab?: boolean) => void;
  onOpenBoutiques: () => void;
}

export default function MenuOverlay({
  open,
  lang,
  onClose,
  onNavigateView,
  onOpenBoutiques,
}: MenuOverlayProps) {
  const copy = T[lang];

  const handleLink = (action: () => void) => {
    onClose();
    action();
  };

  return (
    <div
      id="menu"
      aria-hidden={!open}
      className={`fixed inset-0 z-[65] bg-[#050506] grid place-items-center transition-all duration-700 ${
        open
          ? 'opacity-100 pointer-events-auto [clip-path:inset(0)]'
          : 'opacity-0 pointer-events-none [clip-path:inset(0_0_100%_0)]'
      }`}
    >
      <nav className="flex flex-col items-center gap-3 text-center px-6">
        <button
          type="button"
          onClick={() => handleLink(() => onNavigateView('sphere'))}
          className="font-editorial text-[clamp(30px,8vw,64px)] leading-tight text-[#f4f2ef]/65 hover:text-[#f4f2ef] transition-all cursor-pointer"
        >
          {copy.navArchive}
        </button>
        <button
          type="button"
          onClick={() => handleLink(() => onNavigateView('catalog', false))}
          className="font-editorial text-[clamp(30px,8vw,64px)] leading-tight text-[#f4f2ef]/65 hover:text-[#f4f2ef] transition-all cursor-pointer"
        >
          {copy.navCollection}
        </button>
        <button
          type="button"
          onClick={() => handleLink(() => onNavigateView('catalog', true))}
          className="font-editorial text-[clamp(30px,8vw,64px)] leading-tight text-[#f4f2ef]/65 hover:text-[#f4f2ef] transition-all cursor-pointer"
        >
          {copy.navLensLab}
        </button>
        <button
          type="button"
          onClick={() => handleLink(onOpenBoutiques)}
          className="font-editorial text-[clamp(30px,8vw,64px)] leading-tight text-[#f4f2ef]/65 hover:text-[#f4f2ef] transition-all cursor-pointer"
        >
          {copy.navBoutiques}
        </button>
      </nav>

      <div className="fixed bottom-[calc(var(--pad)+var(--safe-bottom))] inset-x-6 text-center text-xs text-[#9b9691] leading-relaxed">
        {copy.footerAddress}
      </div>
    </div>
  );
}

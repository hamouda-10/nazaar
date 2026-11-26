import { useState } from 'react';
import { CheckCircle2, MapPin, Phone, X } from 'lucide-react';
import { BOUTIQUES } from '../data/eyewear';
import { Lang, T } from '../data/i18n';

interface BoutiquesModalProps {
  open: boolean;
  lang: Lang;
  onClose: () => void;
}

export default function BoutiquesModal({ open, lang, onClose }: BoutiquesModalProps) {
  const copy = T[lang];
  const [branch, setBranch] = useState(BOUTIQUES[0].id);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('05');
  const [date, setDate] = useState('2026-11-28');
  const [booked, setBooked] = useState(false);

  if (!open) return null;

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setBooked(true);
  };

  return (
    <div
      className="fixed inset-0 z-[115] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={copy.boutiquesTitle}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[760px] bg-[#0b0b0d] border border-[#f4f2ef]/16 rounded-xl overflow-hidden shadow-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-[#f4f2ef]/12 flex items-center justify-between">
          <h2 className="font-editorial text-2xl text-[#f4f2ef]">{copy.boutiquesTitle}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={copy.close}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center text-[#f4f2ef]/75 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[82dvh] overflow-y-auto">
          <p className="text-sm text-[#f4f2ef]/75 leading-relaxed">{copy.boutiquesLead}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BOUTIQUES.map((b) => (
              <div
                key={b.id}
                className="p-4 bg-[#111114] border border-[#f4f2ef]/12 rounded-lg space-y-2"
              >
                <div className="flex items-start gap-2 text-sm font-medium text-[#f4f2ef]">
                  <MapPin className="w-4 h-4 text-[#d4b483] shrink-0 mt-0.5" />
                  <span>{b.name[lang]}</span>
                </div>
                <p className="text-[11px] text-[#9b9691] leading-relaxed">{b.hours[lang]}</p>
                <div
                  className="flex items-center gap-1.5 text-xs text-[#d4b483] tabular-nums"
                  dir="ltr"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{b.phone}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#f4f2ef]/12">
            <h3 className="font-editorial text-xl text-[#f4f2ef] mb-4">{copy.bookEyeExam}</h3>

            {booked ? (
              <div className="p-5 bg-[#111114] border border-emerald-500/30 rounded-lg flex items-center gap-3 text-sm text-emerald-300">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{copy.examBookedMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleBook} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#9b9691] mb-1.5">{copy.fullName}</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full min-h-[42px] bg-black border border-[#f4f2ef]/18 focus:border-[#d4b483] rounded-md px-3 text-sm text-[#f4f2ef] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#9b9691] mb-1.5">{copy.saudiPhone}</label>
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full min-h-[42px] bg-black border border-[#f4f2ef]/18 focus:border-[#d4b483] rounded-md px-3 text-sm text-[#f4f2ef] tabular-nums outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#9b9691] mb-1.5">
                    {copy.preferredBranch}
                  </label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full min-h-[42px] bg-black border border-[#f4f2ef]/18 focus:border-[#d4b483] rounded-md px-3 text-sm text-[#f4f2ef] outline-none cursor-pointer"
                  >
                    {BOUTIQUES.map((b) => (
                      <option key={b.id} value={b.id} className="bg-black">
                        {b.name[lang]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#9b9691] mb-1.5">
                    {copy.preferredDate}
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full min-h-[42px] bg-black border border-[#f4f2ef]/18 focus:border-[#d4b483] rounded-md px-3 text-sm text-[#f4f2ef] outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="w-full min-h-[46px] bg-[#f4f2ef] text-black hover:bg-[#d4b483] rounded-md text-sm font-medium transition-colors cursor-pointer"
                  >
                    {copy.confirmBooking}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

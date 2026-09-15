export default function ContactSuccess() {
  return (
    <div
      role="status"
      className="rounded-[1.5rem] border border-green-400/30 bg-white/5 px-6 py-12 text-center shadow-card backdrop-blur-xl light:bg-white"
    >
      <p className="font-heading text-[24px] font-semibold text-white light:text-slate-900">
        Povpraševanje je oddano.
      </p>
      <p className="mx-auto mt-3 max-w-md text-[16px] leading-[1.7] text-slate-400">
        Kmalu vas kontaktiramo. Po oddaji povpraševanja se dogovorimo za termin.
      </p>
    </div>
  );
}

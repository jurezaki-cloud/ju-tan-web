interface Props {
  step: string;
  title: string;
  description: string;
}

export default function ProcessCard({ step, title, description }: Props) {
  return (
    <div className="pb-8">
      <div className="font-heading text-[13px] font-medium tabular-nums tracking-[0.14em] text-green-600/80">
        {step}
      </div>
      <h3 className="heading-3 mt-2 text-white light:text-slate-900">{title}</h3>
      <p className="mt-2 max-w-xl text-[15px] leading-[1.7] text-slate-400">
        {description}
      </p>
    </div>
  );
}

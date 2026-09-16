type PageLoaderProps = {
  label?: string;
};

export default function PageLoader({ label = "Nalaganje" }: PageLoaderProps) {
  return (
    <div className="flex min-h-[12rem] items-center justify-center" role="status">
      <p className="text-[14px] text-slate-500">{label}</p>
    </div>
  );
}

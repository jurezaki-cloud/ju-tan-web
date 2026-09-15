import CTAButton from "@/components/navbar/CTAButton";

type SectionCtaProps = {
  label?: string;
};

export default function SectionCta({
  label = "Brezplačen posvet",
}: SectionCtaProps) {
  return (
    <div className="mt-12 flex justify-center">
      <CTAButton>{label}</CTAButton>
    </div>
  );
}

import Card, { type CardProps } from "./Card";

export default function GlassCard({ variant = "glass", ...props }: CardProps) {
  return <Card variant={variant} {...props} />;
}

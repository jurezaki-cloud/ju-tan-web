import { FileText, QrCode, Image, Gift, Map, Activity } from "lucide-react";
import type { LabTool } from "@/lib/free-lab/catalog";

const icons = {
  pdf: FileText,
  qr: QrCode,
  image: Image,
  gift: Gift,
  quiz: Map,
  web: Activity,
};
export default function ToolIcon({ icon }: { icon: LabTool["icon"] }) {
  const Icon = icons[icon];
  return <Icon size={26} strokeWidth={1.6} aria-hidden="true" />;
}

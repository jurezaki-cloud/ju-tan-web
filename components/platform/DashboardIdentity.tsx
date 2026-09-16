"use client";

import { useAuth } from "@/components/platform/auth/AuthContext";
import { cardSurface, headingCard, metaClass } from "@/design";
import { roleLabels } from "@/src/config/roles";

export default function DashboardIdentity() {
  const { session } = useAuth();
  const user = session.user;
  if (!user) return null;
  return (
    <section className={`${cardSurface} mb-6 flex items-center gap-4 p-4`}>
      <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 text-[14px] font-semibold text-[#16a34a] light:border-slate-200">
        {user.avatar}
      </span>
      <div>
        <h2 className={`${headingCard} text-[16px]`}>{user.name}</h2>
        <p className={metaClass}>
          {roleLabels[user.role]}
          {user.department ? ` · ${user.department}` : ""}
        </p>
      </div>
    </section>
  );
}

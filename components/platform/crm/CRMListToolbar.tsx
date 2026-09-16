import type { ReactNode } from "react";
import SearchInput from "@/components/platform/SearchInput";
import FilterBar, { type FilterOption } from "@/components/platform/FilterBar";

export default function CRMListToolbar({
  search,
  onSearch,
  placeholder,
  filters,
  filter,
  onFilter,
  actions,
}: {
  search?: string;
  onSearch?: (value: string) => void;
  placeholder?: string;
  filters?: FilterOption[];
  filter?: string;
  onFilter?: (id: string) => void;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      {onSearch ? (
        <SearchInput value={search ?? ""} onChange={onSearch} placeholder={placeholder ?? "Iskanje"} id="crm-toolbar-search" className="w-full max-w-sm" />
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        {filters && onFilter ? <FilterBar options={filters} value={filter ?? "all"} onChange={onFilter} /> : null}
        {actions}
      </div>
    </div>
  );
}

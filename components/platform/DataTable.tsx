"use client";

import { useMemo, useState, type ReactNode } from "react";
import SearchInput from "./SearchInput";
import FilterBar, { type FilterOption } from "./FilterBar";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import PageLoader from "./PageLoader";
import { ctaBase, ctaSizes, ctaVariants, cardSurface, metaClass, colorTransition, focusRing } from "@/design";
import { cn } from "@/lib/utils";

export type DataColumn<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  hideOnMobile?: boolean;
  sortable?: boolean;
  sortValue?: (row: T) => string | number;
};

type DataTableProps<T extends { id: string }> = {
  rows: T[];
  columns: DataColumn<T>[];
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  filters?: FilterOption[];
  filterKey?: keyof T;
  pageSize?: number;
  caption: string;
  loading?: boolean;
  error?: string | null;
  selectable?: boolean;
};

type SortState = { key: string; direction: "asc" | "desc" } | null;

export default function DataTable<T extends { id: string }>({
  rows,
  columns,
  searchPlaceholder = "Iskanje",
  searchKeys,
  filters,
  filterKey,
  pageSize = 5,
  caption,
  loading = false,
  error = null,
  selectable = false,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(filters?.[0]?.id ?? "all");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortState>(null);
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const next = rows.filter((row) => {
      const matchesQuery =
        !q ||
        (searchKeys ?? []).some((key) =>
          String(row[key] ?? "").toLowerCase().includes(q),
        );
      const matchesFilter =
        !filters || filter === "all" || String(row[filterKey ?? "id"]) === filter;
      return matchesQuery && matchesFilter;
    });

    if (!sort) return next;
    const column = columns.find((item) => item.key === sort.key);
    return [...next].sort((a, b) => {
      const left = column?.sortValue?.(a) ?? String(a[sort.key as keyof T] ?? "");
      const right = column?.sortValue?.(b) ?? String(b[sort.key as keyof T] ?? "");
      const compared =
        typeof left === "number" && typeof right === "number"
          ? left - right
          : String(left).localeCompare(String(right), "sl");
      return sort.direction === "asc" ? compared : -compared;
    });
  }, [rows, query, filter, filters, searchKeys, filterKey, sort, columns]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * pageSize;
  const visible = filtered.slice(start, start + pageSize);

  const onQuery = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const onFilter = (id: string) => {
    setFilter(id);
    setPage(1);
  };

  const toggleSort = (column: DataColumn<T>) => {
    if (!column.sortable) return;
    setSort((current) => {
      if (current?.key !== column.key) return { key: column.key, direction: "asc" };
      if (current.direction === "asc") return { key: column.key, direction: "desc" };
      return null;
    });
    setPage(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {searchKeys ? (
          <SearchInput
            value={query}
            onChange={onQuery}
            placeholder={searchPlaceholder}
            id={`table-search-${caption.replace(/\s+/g, "-").toLowerCase()}`}
            className="w-full max-w-sm"
          />
        ) : null}
        {filters ? (
          <FilterBar options={filters} value={filter} onChange={onFilter} />
        ) : null}
      </div>

      <div className={cn(cardSurface, "overflow-hidden")}>
        {loading ? (
          <PageLoader />
        ) : error ? (
          <ErrorState description={error} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <caption className="sr-only">{caption}</caption>
                <thead>
                  <tr className="border-b border-white/10 light:border-slate-200">
                    {selectable ? (
                      <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
                        <span className="sr-only">Izbira</span>
                      </th>
                    ) : null}
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        className={cn(
                          "px-4 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500",
                          column.hideOnMobile && "hidden md:table-cell",
                        )}
                      >
                        {column.sortable ? (
                          <button
                            type="button"
                            onClick={() => toggleSort(column)}
                            className={cn(
                              "inline-flex min-h-11 items-center gap-1 rounded-lg",
                              colorTransition,
                              focusRing,
                            )}
                            aria-label={`Razvrsti: ${column.header}`}
                          >
                            {column.header}
                            {sort?.key === column.key
                              ? sort.direction === "asc"
                                ? " ↑"
                                : " ↓"
                              : ""}
                          </button>
                        ) : (
                          column.header
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visible.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-white/10 last:border-0 light:border-slate-200"
                    >
                      {selectable ? (
                        <td className="px-4 py-3.5">
                          <input
                            type="checkbox"
                            checked={selected.includes(row.id)}
                            onChange={() =>
                              setSelected((current) =>
                                current.includes(row.id)
                                  ? current.filter((item) => item !== row.id)
                                  : [...current, row.id],
                              )
                            }
                            aria-label={`Izberi ${row.id}`}
                          />
                        </td>
                      ) : null}
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className={cn(
                            "px-4 py-3.5 text-[14px] text-slate-300 light:text-slate-700",
                            column.hideOnMobile && "hidden md:table-cell",
                          )}
                        >
                          {column.render(row)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {visible.length === 0 ? (
              <EmptyState
                title="Ni zadetkov"
                description="Prilagodite iskanje, filter ali razvrščanje."
              />
            ) : null}
          </>
        )}
      </div>

      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <p className={metaClass}>
          {loading || error || filtered.length === 0
            ? "0 zapisov"
            : `${start + 1}–${start + visible.length} od ${filtered.length}${
                selectable && selected.length ? ` · ${selected.length} izbranih` : ""
              }`}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className={cn(ctaBase, ctaSizes.compact, ctaVariants.secondary)}
            disabled={safePage <= 1 || loading}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Nazaj
          </button>
          <button
            type="button"
            className={cn(ctaBase, ctaSizes.compact, ctaVariants.secondary)}
            disabled={safePage >= pageCount || loading}
            onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
          >
            Naprej
          </button>
        </div>
      </div>
    </div>
  );
}

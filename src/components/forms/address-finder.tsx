"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, Loader2, MapPin, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { searchBangladeshAddresses, type AddressResult } from "@/lib/mapbox-geocoding";

export function AddressFinder({
  value,
  onValueChange,
  onSelect,
  invalid,
}: {
  value: string;
  onValueChange: (value: string) => void;
  onSelect: (address: AddressResult) => void;
  invalid?: boolean;
}) {
  const listId = useId();
  const requestId = useRef(0);
  const suppressSearch = useRef(false);
  const [suggestions, setSuggestions] = useState<AddressResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    if (suppressSearch.current) {
      suppressSearch.current = false;
      return;
    }

    const query = value.trim();
    if (query.length < 3) {
      return;
    }

    const controller = new AbortController();
    const currentRequest = ++requestId.current;
    const timeout = window.setTimeout(() => {
      setLoading(true);
      setSearchError(null);
      void searchBangladeshAddresses(query, controller.signal)
        .then((results) => {
          if (currentRequest !== requestId.current) return;
          setSuggestions(results);
          setOpen(true);
          setActiveIndex(results.length ? 0 : -1);
        })
        .catch((error: unknown) => {
          if (axiosAbort(error)) return;
          setSuggestions([]);
          setOpen(true);
          setSearchError(error instanceof Error ? error.message : "Address search is unavailable.");
        })
        .finally(() => {
          if (currentRequest === requestId.current) setLoading(false);
        });
    }, 380);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [value]);

  function selectAddress(address: AddressResult) {
    suppressSearch.current = true;
    onValueChange(address.fullAddress);
    onSelect(address);
    setSuggestions([]);
    setOpen(false);
    setActiveIndex(-1);
  }

  return (
    <div className="relative flex-1">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={value}
          onChange={(event) => {
            const nextValue = event.target.value;
            onValueChange(nextValue);
            if (nextValue.trim().length < 3) {
              setSuggestions([]);
              setOpen(false);
              setLoading(false);
              setSearchError(null);
            } else {
              setOpen(true);
            }
          }}
          onFocus={() => suggestions.length && setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 150)}
          onKeyDown={(event) => {
            if (!open || !suggestions.length) return;
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setActiveIndex((index) => Math.min(index + 1, suggestions.length - 1));
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setActiveIndex((index) => Math.max(index - 1, 0));
            } else if (event.key === "Enter" && activeIndex >= 0) {
              event.preventDefault();
              selectAddress(suggestions[activeIndex]);
            } else if (event.key === "Escape") {
              setOpen(false);
            }
          }}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
          aria-autocomplete="list"
          aria-invalid={invalid}
          autoComplete="off"
          placeholder="Search road, area, landmark or district"
          className={cn(
            "h-11 w-full rounded-lg border bg-transparent py-2 pl-9 pr-10 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/20",
            invalid ? "border-danger" : "border-input",
          )}
        />
        {loading && <Loader2 className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-primary" />}
      </div>

      {open && (
        <div id={listId} role="listbox" className="absolute inset-x-0 top-[calc(100%+6px)] z-40 overflow-hidden rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-xl">
          {searchError ? (
            <p role="alert" className="px-3 py-3 text-xs text-danger">{searchError}</p>
          ) : suggestions.length ? (
            suggestions.map((address, index) => (
              <button
                type="button"
                role="option"
                aria-selected={activeIndex === index}
                id={`${listId}-${index}`}
                key={address.id}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectAddress(address)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition",
                  activeIndex === index ? "bg-primary/8" : "hover:bg-muted/70",
                )}
              >
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"><MapPin className="size-4" /></span>
                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{address.name}</span><span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{address.fullAddress}</span></span>
                {activeIndex === index && <Check className="mt-2 size-4 shrink-0 text-primary" />}
              </button>
            ))
          ) : !loading ? (
            <p className="px-3 py-3 text-xs text-muted-foreground">No Bangladesh addresses found. Try a nearby road, area, or district.</p>
          ) : null}
          <div className="border-t border-border px-3 py-2 text-right text-[9px] font-medium uppercase tracking-wide text-muted-foreground">Powered by Mapbox</div>
        </div>
      )}
    </div>
  );
}

function axiosAbort(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ERR_CANCELED";
}

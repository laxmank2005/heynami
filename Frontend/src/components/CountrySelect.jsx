import React, { useState, useRef, useEffect } from "react";
import { BsChevronDown, BsSearch, BsCheck2 } from "react-icons/bs";
import { IoCloseCircleOutline } from "react-icons/io5";
import { COUNTRIES } from "../utils/countries";

const CountrySelect = ({ value, onChange, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Find currently selected country by dialCode
  const selectedCountry = COUNTRIES.find((c) => c.dialCode === value) || COUNTRIES[0];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Filter countries by name, code, or dialCode
  const filteredCountries = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return COUNTRIES;
    const cleanQ = q.startsWith("+") ? q : `+${q}`;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.dialCode.includes(q) ||
        c.dialCode === cleanQ
    );
  }, [searchQuery]);

  const handleSelect = (country) => {
    onChange(country.dialCode);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className="h-full flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-stone-800/80 transition-all duration-150 text-gray-700 dark:text-stone-300 select-none group focus:outline-none"
        title="Select Country Code"
      >
        <span className="text-lg leading-none" role="img" aria-label={selectedCountry.name}>
          {selectedCountry.flag}
        </span>
        <span className="text-sm font-semibold tracking-tight text-gray-800 dark:text-stone-200">
          {selectedCountry.dialCode}
        </span>
        <span className="text-[11px] font-medium text-gray-400 dark:text-stone-500 uppercase">
          ({selectedCountry.code})
        </span>
        <BsChevronDown
          className={`text-[11px] text-gray-400 group-hover:text-gray-600 dark:group-hover:text-stone-300 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-violet-500" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu Modal */}
      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 w-[300px] sm:w-[340px] bg-white dark:bg-[#161618] border border-gray-200 dark:border-stone-800 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          style={{ transformOrigin: "top left" }}
        >
          {/* Header & Search */}
          <div className="p-2.5 border-b border-gray-100 dark:border-stone-800/80 bg-gray-50/70 dark:bg-stone-900/40">
            <div className="relative flex items-center">
              <BsSearch className="absolute left-3 text-xs text-gray-400 dark:text-stone-500 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search country or code..."
                className="w-full pl-8 pr-7 py-2 text-xs bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-700 rounded-xl outline-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-stone-500 focus:border-violet-500 dark:focus:border-violet-500 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-stone-300 transition-colors"
                >
                  <IoCloseCircleOutline className="text-sm" />
                </button>
              )}
            </div>
          </div>

          {/* Country List */}
          <div className="max-h-60 overflow-y-auto overscroll-contain py-1.5 px-1 divide-y divide-transparent">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => {
                const isSelected = country.dialCode === selectedCountry.dialCode && country.code === selectedCountry.code;
                return (
                  <button
                    key={`${country.code}-${country.dialCode}`}
                    type="button"
                    onClick={() => handleSelect(country)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-xl transition-all duration-150 group ${
                      isSelected
                        ? "bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300"
                        : "hover:bg-gray-100/80 dark:hover:bg-stone-800/60 text-gray-700 dark:text-stone-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <span className="text-xl leading-none flex-shrink-0" role="img" aria-label={country.name}>
                        {country.flag}
                      </span>
                      <span className="text-xs font-medium truncate text-gray-900 dark:text-stone-200 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                        {country.name}
                      </span>
                      <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-gray-100 dark:bg-stone-800 text-gray-500 dark:text-stone-400 flex-shrink-0">
                        {country.code}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`text-xs font-bold tracking-tight ${
                          isSelected
                            ? "text-violet-600 dark:text-violet-400"
                            : "text-gray-500 dark:text-stone-400"
                        }`}
                      >
                        {country.dialCode}
                      </span>
                      {isSelected && <BsCheck2 className="text-violet-600 dark:text-violet-400 text-sm" />}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="py-8 text-center text-xs text-gray-400 dark:text-stone-500">
                No countries found for "{searchQuery}"
              </div>
            )}
          </div>

          {/* Quick Footer hint */}
          <div className="px-3 py-1.5 bg-gray-50/50 dark:bg-stone-900/30 border-t border-gray-100 dark:border-stone-800/60 flex items-center justify-between text-[10px] text-gray-400 dark:text-stone-500">
            <span>{filteredCountries.length} countries</span>
            <span>ESC to close</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelect;

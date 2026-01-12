import { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import { Z_INDEX } from "../../constants/z-index";
import { Card } from "../Card";
import { Input } from "../Input";
import { LoadingDots } from "../LoadingDots";

type CommandPaletteProps<T> = {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  items: T[];
  onSearch: (query: string) => void;
  onSelect: (item: T) => void;
  renderItem: (item: T, isSelected: boolean) => React.ReactNode;
  getItemKey: (item: T) => string;
  placeholder?: string;
  isLoading?: boolean;
};

export const CommandPalette = <T,>({
  isOpen,
  onClose,
  value,
  items,
  onSearch,
  onSelect,
  renderItem,
  getItemKey,
  placeholder = "Search...",
  isLoading = false,
}: CommandPaletteProps<T>) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const filteredItems = items;

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (resultsRef.current && selectedIndex >= 0) {
      const selectedElement = resultsRef.current.children[
        selectedIndex
      ] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [selectedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredItems.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          onSelect(filteredItems[selectedIndex]);
          onClose();
        }
        break;
      case "Escape":
        e.preventDefault();
        onClose();
        break;
      case "Tab":
        e.preventDefault();
        onClose();
        break;
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onSearch(value);
    setSelectedIndex(0);
  };

  const handleItemClick = (item: T) => {
    onSelect(item);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50"
      style={{ zIndex: Z_INDEX.commandPalette }}
      onClick={onClose}
    >
      <div className="w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <Card className="flex flex-col gap-2 p-4">
          <div className="relative">
            <Input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              className="w-full py-3 pr-10 text-lg"
            />

            <FaSearch className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-white/70" />
          </div>

          {filteredItems.length > 0 && (
            <div
              ref={resultsRef}
              className="max-h-[400px] overflow-y-auto border-t-2 border-t-[#555555] pt-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {filteredItems.map((item, index) => {
                const isSelected = selectedIndex === index;
                const hoverEffect =
                  "hover:bg-[#8b8b8b] transition-all duration-100";
                const selectedEffect = isSelected ? "bg-[#8b8b8b]" : "";

                const classes = twMerge(
                  "cursor-pointer px-3 py-2",
                  hoverEffect,
                  selectedEffect,
                );

                return (
                  <div
                    key={getItemKey(item)}
                    className={classes}
                    onClick={() => handleItemClick(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    {renderItem(item, isSelected)}
                  </div>
                );
              })}
            </div>
          )}

          {isLoading && (
            <div className="text-secondary p-4 text-center">
              <LoadingDots />
            </div>
          )}

          {!isLoading && filteredItems.length === 0 && !!value && (
            <div className="text-secondary p-4 text-center">
              No results found
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

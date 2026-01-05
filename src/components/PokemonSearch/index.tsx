import { useState } from "react";
import { twMerge } from "tailwind-merge";
import pokemonRegistry from "../../../data/pokemon-registry.json";
import { Card } from "../Card";
import { Input } from "../Input";
import { Inventory } from "../Inventory";
import type { InventoryItemData } from "../InventoryItem";

type PokemonRegistryItem = {
  id: string;
  registrationNumber: string;
  name: string;
};

type InventoryItemPosition = {
  id: string;
  row: number;
  col: number;
  data: InventoryItemData;
};

const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

type PokemonSearchProps = {
  className?: string;
  title?: string;
  onPokemonSelect?: (id: string) => void;
};

export const PokemonSearch = ({
  className,
  title = "Pokemon Search",
  onPokemonSelect,
}: PokemonSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const pokemonData = pokemonRegistry as PokemonRegistryItem[];

  const normalizedSearchTerm = normalizeText(searchTerm);

  const filteredPokemons = pokemonData.filter((pokemon) => {
    const normalizedName = normalizeText(pokemon.name);
    return normalizedName.includes(normalizedSearchTerm);
  });

  const cols = 9;
  const rows = Math.ceil(filteredPokemons.length / cols);
  const inventoryWidth = cols * 48;

  const items: InventoryItemPosition[] = filteredPokemons.map(
    (pokemon, index) => {
      const row = Math.floor(index / cols) + 1;
      const col = (index % cols) + 1;

      return {
        id: pokemon.id,
        row,
        col,
        data: {
          path: `/images/pokemon/${pokemon.registrationNumber}.webp`,
          name: pokemon.name,
          description: `#${pokemon.registrationNumber}`,
          onClick: () => {
            onPokemonSelect?.(pokemon.id);
          },
        },
      };
    },
  );

  const titleStyles = "text-xl text-[#3f3f3f] py-2";
  const paddingStyles = "px-4 pb-4 pt-0";
  const headerStyles = "flex flex-col";

  return (
    <Card
      className={twMerge("flex w-fit flex-col gap-4", paddingStyles, className)}
    >
      <div className={headerStyles} style={{ width: `${inventoryWidth}px` }}>
        <p className={titleStyles}>{title}</p>
        <Input
          type="text"
          placeholder="Search Pokemon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full min-w-0"
        />
      </div>
      <div className="max-h-[600px] overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Inventory
          rows={rows}
          cols={cols}
          items={items}
          lazyLoad={true}
          scale={1.2}
        />
      </div>
    </Card>
  );
};

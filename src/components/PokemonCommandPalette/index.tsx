import { useState } from "react";
import pokemonRegistry from "../../../data/pokemon-registry.json";
import type { PokemonRegistryItem } from "../../types/pokemon-registry";
import { CommandPalette } from "../CommandPalette";
import { InventoryItem } from "../InventoryItem";

const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const getFilteredPokemons = (
  searchQuery: string,
  pokemonData: PokemonRegistryItem[],
) => {
  if (!searchQuery.trim()) return pokemonData;

  const normalizedSearchTerm = normalizeText(searchQuery);
  return pokemonData.filter((pokemon) => {
    const normalizedName = normalizeText(pokemon.name);
    return normalizedName.includes(normalizedSearchTerm);
  });
};

const renderPokemonItem = (
  pokemon: PokemonRegistryItem,
  _isSelected: boolean, // eslint-disable-line @typescript-eslint/no-unused-vars
) => {
  return (
    <div className="flex items-center gap-3">
      <InventoryItem
        data={{
          path: `/images/pokemon/${pokemon.registrationNumber}.webp`,
          name: pokemon.name,
        }}
        scale={1.2}
      />

      <div className="flex flex-col">
        <span className="minecraft-text-shadow text-md text-white">
          {pokemon.name}
        </span>

        <span className="text-sm text-[#3e3e3e]">
          #{pokemon.registrationNumber.padStart(3, "0")}
        </span>
      </div>
    </div>
  );
};

const getPokemonKey = (pokemon: PokemonRegistryItem) => {
  return pokemon.id;
};

const MAX_DISPLAYED_POKEMONS = 15;

type PokemonCommandPaletteProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (pokemonId: string) => void;
};

export const PokemonCommandPalette = ({
  isOpen,
  onClose,
  onSelect,
}: PokemonCommandPaletteProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const pokemonData = pokemonRegistry as PokemonRegistryItem[];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSelect = (pokemon: PokemonRegistryItem) => {
    onSelect(pokemon.id);
    setSearchQuery("");
  };

  const handleClose = () => {
    onClose();
    setSearchQuery("");
  };

  const filteredPokemonsResult = getFilteredPokemons(searchQuery, pokemonData);
  const displayedPokemons = filteredPokemonsResult.slice(
    0,
    MAX_DISPLAYED_POKEMONS,
  );

  return (
    <CommandPalette
      isOpen={isOpen}
      onClose={handleClose}
      items={displayedPokemons}
      onSearch={handleSearch}
      onSelect={handleSelect}
      renderItem={renderPokemonItem}
      getItemKey={getPokemonKey}
      placeholder="Search Pokemon..."
      searchQuery={searchQuery}
    />
  );
};

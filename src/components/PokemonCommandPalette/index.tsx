import type { Pokemon } from "../../types/seasoning-cookbook-service";
import { CommandPalette } from "../CommandPalette";
import { InventoryItem } from "../InventoryItem";

const renderPokemonItem = (
  pokemon: Pokemon,
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

const getPokemonKey = (pokemon: Pokemon) => {
  return pokemon._id;
};

type PokemonCommandPaletteProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (pokemonId: string) => void;
  value: string;
  pokemons: Pokemon[];
  onSearchChange: (query: string) => void;
  isLoading?: boolean;
};

export const PokemonCommandPalette = ({
  isOpen,
  onClose,
  onSelect,
  value,
  pokemons,
  onSearchChange,
  isLoading = false,
}: PokemonCommandPaletteProps) => {
  const handleSearch = (query: string) => {
    onSearchChange(query);
  };

  const handleSelect = (pokemon: Pokemon) => {
    onSelect(pokemon._id);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <CommandPalette
      isOpen={isOpen}
      onClose={handleClose}
      value={value}
      items={pokemons}
      onSearch={handleSearch}
      onSelect={handleSelect}
      renderItem={renderPokemonItem}
      getItemKey={getPokemonKey}
      placeholder="Search Pokemon..."
      isLoading={isLoading}
    />
  );
};

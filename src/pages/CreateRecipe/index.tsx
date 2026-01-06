import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, ItemFrame, PokemonCommandPalette } from "../../components";
import { searchPokemons } from "../../api/queries/searchPokemons";
import { useDebounceValue } from "../../hooks/useDebounceValue";

export const CreateRecipe = () => {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounceValue({
    inputValue: searchQuery,
  });

  const queryValue =
    debouncedSearchQuery === "" && searchQuery !== ""
      ? searchQuery
      : debouncedSearchQuery;

  const { data: pokemons = [], isLoading } = useQuery({
    queryKey: ["pokemons", "search", queryValue],
    queryFn: () => searchPokemons({ name: queryValue }),
    enabled: queryValue.length > 0 && isPaletteOpen,
  });

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSelect = (pokemonId: string) => {
    console.log("Selected pokemon:", pokemonId);
  };

  return (
    <div>
      <Card title="Select your pokemon to show recipes">
        <div className="p-4">
          <ItemFrame
            src="/icons/pokeball.png"
            alt="Select Pokemon"
            onClick={() => setIsPaletteOpen(true)}
            pulsingIcon={true}
            scale={0.8}
            className="h-24 w-24 shrink-0"
          />
        </div>
      </Card>

      <PokemonCommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onSelect={handleSelect}
        pokemons={pokemons}
        onSearchChange={handleSearchChange}
        isLoading={isLoading}
      />
    </div>
  );
};

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  Select,
  SelectableInventoryItem,
  Button,
} from "../../../../components";
import { PokemonCommandPalette } from "../../../../components/PokemonCommandPalette";
import { SelectSeasoningItemModal } from "../../../CreateRecipe/components/SelectSeasoningItemModal";
import { getSeasoningItems } from "../../../../api/queries/getSeasoningItems";
import { searchPokemons } from "../../../../api/queries/searchPokemons";
import { useDebounceValue } from "../../../../hooks/useDebounceValue";
import type {
  RecipeCategory,
  SeasoningItem,
  Pokemon,
} from "../../../../types/seasoning-cookbook-service";

type RecipeFiltersProps = {
  sortBy: "most-upvotes" | "least-upvotes" | "";
  pokemonIds: string[];
  seasoningItemIds: string[];
  category: RecipeCategory[];
  onSortByChange: (value: "most-upvotes" | "least-upvotes" | "") => void;
  onPokemonIdsChange: (ids: string[]) => void;
  onSeasoningItemIdsChange: (ids: string[]) => void;
  onCategoryChange: (categories: RecipeCategory[]) => void;
};

export const RecipeFilters = ({
  sortBy,
  pokemonIds,
  seasoningItemIds,
  category,
  onSortByChange,
  onPokemonIdsChange,
  onSeasoningItemIdsChange,
  onCategoryChange,
}: RecipeFiltersProps) => {
  const [isPokemonPaletteOpen, setIsPokemonPaletteOpen] = useState(false);
  const [isSeasoningModalOpen, setIsSeasoningModalOpen] = useState(false);
  const [pokemonSearchQuery, setPokemonSearchQuery] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const debouncedPokemonSearchQuery = useDebounceValue({
    inputValue: pokemonSearchQuery,
    delayInMillis: 700,
  });

  const { data: seasoningItems = [] } = useQuery({
    queryKey: ["seasoningItems"],
    queryFn: getSeasoningItems,
  });

  const { data: searchPokemonsResult = [], isLoading: isLoadingPokemons } =
    useQuery({
      queryKey: ["pokemons", "search", debouncedPokemonSearchQuery],
      queryFn: () => searchPokemons({ name: debouncedPokemonSearchQuery }),
      enabled: debouncedPokemonSearchQuery.length > 0 && isPokemonPaletteOpen,
    });

  const pokemonsForPalette = searchPokemonsResult;
  const selectedSeasoningItems = seasoningItems.filter((item) =>
    seasoningItemIds.includes(item._id),
  );

  useEffect(() => {
    if (pokemonIds.length === 0) {
      setSelectedPokemon(null);
    }
  }, [pokemonIds]);

  const formatSelectedItemsList = (items: { name: string }[]): string => {
    if (items.length === 0) return "";
    if (items.length === 1) return items[0].name;
    if (items.length === 2) return `${items[0].name} and ${items[1].name}`;
    const allButLast = items
      .slice(0, -1)
      .map((item) => item.name)
      .join(", ");
    const last = items[items.length - 1].name;
    return `${allButLast} and ${last}`;
  };

  const handlePokemonSelect = (pokemonId: string) => {
    const selectedPokemonData = searchPokemonsResult.find(
      (p) => p._id === pokemonId,
    );
    if (pokemonIds.includes(pokemonId)) {
      onPokemonIdsChange([]);
      setSelectedPokemon(null);
    } else {
      onPokemonIdsChange([pokemonId]);
      if (selectedPokemonData) {
        setSelectedPokemon(selectedPokemonData);
      }
    }
    setIsPokemonPaletteOpen(false);
  };

  const handleSeasoningSelect = (item: SeasoningItem) => {
    if (seasoningItemIds.includes(item._id)) {
      onSeasoningItemIdsChange(
        seasoningItemIds.filter((id) => id !== item._id),
      );
    } else {
      onSeasoningItemIdsChange([...seasoningItemIds, item._id]);
    }
    setIsSeasoningModalOpen(false);
  };

  const handleCategoryToggle = (cat: RecipeCategory) => {
    if (category.includes(cat)) {
      onCategoryChange(category.filter((c) => c !== cat));
    } else {
      onCategoryChange([...category, cat]);
    }
  };

  const handleClearPokemonFilter = () => {
    onPokemonIdsChange([]);
    setSelectedPokemon(null);
  };

  const handleClearSeasoningItemsFilter = () => {
    onSeasoningItemIdsChange([]);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <Card title="Filters">
          <div className="flex flex-col gap-4 p-4">
            <div className="flex flex-col gap-1">
              <label className="text-primary text-lg font-semibold">
                Sort By
              </label>
              <Select
                value={sortBy}
                onChange={(e) =>
                  onSortByChange(
                    e.target.value as "most-upvotes" | "least-upvotes" | "",
                  )
                }
                className="w-full"
              >
                <option value="">None</option>
                <option value="most-upvotes">Most Upvotes</option>
                <option value="least-upvotes">Least Upvotes</option>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-primary text-lg font-semibold">
                  Pokemon
                </label>
                {pokemonIds.length > 0 && (
                  <button
                    onClick={handleClearPokemonFilter}
                    className="text-primary cursor-pointer text-xs hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
              <Button
                onClick={() => setIsPokemonPaletteOpen(true)}
                variant="default"
                size="sm"
                className="w-full"
              >
                Select Pokemon
              </Button>
              {selectedPokemon && (
                <div className="text-secondary text-sm">
                  {selectedPokemon.name}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-primary text-lg font-semibold">
                  Seasoning Items
                </label>
                {seasoningItemIds.length > 0 && (
                  <button
                    onClick={handleClearSeasoningItemsFilter}
                    className="text-primary cursor-pointer text-xs hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
              <Button
                onClick={() => setIsSeasoningModalOpen(true)}
                variant="default"
                size="sm"
                className="w-full"
              >
                Select Seasoning Items
              </Button>
              {selectedSeasoningItems.length > 0 && (
                <div className="text-secondary text-sm">
                  {formatSelectedItemsList(
                    selectedSeasoningItems.map((item) => ({
                      name: item.itemName,
                    })),
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-primary text-lg font-semibold">
                Category
              </label>
              <div className="flex flex-row gap-4">
                <SelectableInventoryItem
                  data={{
                    path: "/images/poke_rod.png",
                    name: "Fishing",
                  }}
                  isSelected={category.includes("fishing")}
                  onToggle={() => handleCategoryToggle("fishing")}
                  className="h-10 w-10"
                />
                <SelectableInventoryItem
                  data={{
                    path: "/images/poke_snack.png",
                    name: "Pokesnack",
                  }}
                  isSelected={category.includes("pokesnack")}
                  onToggle={() => handleCategoryToggle("pokesnack")}
                  className="h-10 w-10"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <PokemonCommandPalette
        isOpen={isPokemonPaletteOpen}
        value={pokemonSearchQuery}
        onClose={() => {
          setIsPokemonPaletteOpen(false);
          setPokemonSearchQuery("");
        }}
        onSelect={handlePokemonSelect}
        pokemons={pokemonsForPalette}
        onSearchChange={setPokemonSearchQuery}
        isLoading={isLoadingPokemons}
      />

      <SelectSeasoningItemModal
        isOpen={isSeasoningModalOpen}
        onClose={() => setIsSeasoningModalOpen(false)}
        onSelect={handleSeasoningSelect}
        selectedItemIds={
          seasoningItemIds.length > 0 ? seasoningItemIds : undefined
        }
      />
    </>
  );
};

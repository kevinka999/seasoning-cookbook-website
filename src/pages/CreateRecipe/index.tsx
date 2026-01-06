import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import {
  Card,
  ItemFrame,
  PokemonCommandPalette,
  PokemonDisplayCard,
  Textarea,
  PokemonTypeTag,
  Tag,
  RecipePot,
  SelectableInventoryItem,
  Button,
  LoadingDots,
} from "../../components";
import { useToast } from "../../contexts/ToastContext";
import { searchPokemons } from "../../api/queries/searchPokemons";
import { getSeasoningItems } from "../../api/queries/getSeasoningItems";
import { useDebounceValue } from "../../hooks/useDebounceValue";
import { SelectSeasoningItemModal } from "./components/SelectSeasoningItemModal";
import { createRecipe } from "../../api/mutations/createRecipe";
import {
  combineRecipeEffects,
  formatCombinedEffect,
  parseSeasoningEffects,
} from "../../utils/seasoning-parser";
import { capitalizeWords, normalizeWord } from "../../utils";
import { POKEMON_TYPES } from "../../constants/pokemon";
import type {
  SeasoningItem,
  RecipeCategory,
  PokemonType,
} from "../../types/seasoning-cookbook-service";

const validationSchema = yup.object({
  pokemonId: yup.string().required("Pokemon is required"),
  category: yup
    .array()
    .of(yup.string().oneOf(["fishing", "pokesnack"]))
    .min(1, "At least one category is required")
    .required("Category is required"),
  seasoningItemIds: yup
    .array()
    .of(yup.string().nullable())
    .length(3, "Exactly 3 seasoning slots are required")
    .test(
      "at-least-one",
      "At least one seasoning item is required",
      (value) => value && value.some((id) => id !== null && id !== ""),
    )
    .required("Seasoning items are required"),
  description: yup.string().nullable(),
});

type FormValues = {
  pokemonId: string;
  category: RecipeCategory[];
  seasoningItemIds: [string | null, string | null, string | null];
  description: string | null;
};

const formatCombinedEffects = (
  effect: ReturnType<typeof combineRecipeEffects>[number],
): React.ReactNode => {
  const formattedEffects = formatCombinedEffect(effect);

  return (
    <span className="flex flex-row flex-wrap items-center gap-2">
      {formattedEffects.map((part, partIndex) => {
        if (typeof part === "string") {
          return (
            <span
              key={partIndex}
              className="text-base leading-relaxed text-[#3f3f3f]"
            >
              {part}
            </span>
          );
        }

        if (part.type === "category") {
          const type = part.content.toLowerCase() as PokemonType;
          if (POKEMON_TYPES.includes(type as PokemonType)) {
            return (
              <PokemonTypeTag key={partIndex} type={type} className="text-xs" />
            );
          }

          return (
            <Tag
              key={partIndex}
              text={normalizeWord(part.content)}
              className="text-xs"
            />
          );
        }

        if (part.type === "value") {
          return (
            <Tag
              key={partIndex}
              text={capitalizeWords(part.content)}
              className="p-1 text-xs"
            />
          );
        }
      })}
    </span>
  );
};

export const CreateRecipe = () => {
  const navigate = useNavigate();
  const { dispatchToast } = useToast();
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [seasoningModalSlot, setSeasoningModalSlot] = useState<number | null>(
    null,
  );
  const [hasSelectedPokemonBefore, setHasSelectedPokemonBefore] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounceValue({
    inputValue: searchQuery,
    delayInMillis: 700,
  });

  const { data: pokemons = [], isLoading } = useQuery({
    queryKey: ["pokemons", "search", debouncedSearchQuery],
    queryFn: () => searchPokemons({ name: debouncedSearchQuery }),
    enabled: debouncedSearchQuery.length > 0 && isPaletteOpen,
  });

  const { data: allSeasoningItems = [] } = useQuery({
    queryKey: ["seasoningItems"],
    queryFn: getSeasoningItems,
  });

  const createRecipeMutation = useMutation({
    mutationFn: createRecipe,
    onSuccess: () => {
      dispatchToast({
        type: "success",
        content: "Recipe created successfully!",
      });
      navigate("/");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create recipe";
      dispatchToast({
        type: "error",
        content: errorMessage,
      });
    },
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      pokemonId: "",
      category: [],
      seasoningItemIds: [null, null, null],
      description: null,
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const seasoningItemIds = values.seasoningItemIds.filter(
        (id): id is string => id !== null && id !== "",
      );

      await createRecipeMutation.mutateAsync({
        pokemonId: values.pokemonId,
        seasoningItemIds,
        category: values.category,
        description: values.description,
      });
    },
  });

  const handleSubmit = async () => {
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      formik.setErrors(errors);
      if (errors.pokemonId) {
        dispatchToast({
          type: "error",
          content: errors.pokemonId,
        });
      } else if (errors.category) {
        const categoryError =
          typeof errors.category === "string"
            ? errors.category
            : "At least one category is required";
        dispatchToast({
          type: "error",
          content: categoryError,
        });
      } else if (errors.seasoningItemIds) {
        const seasoningError =
          typeof errors.seasoningItemIds === "string"
            ? errors.seasoningItemIds
            : "Seasoning items are required";
        dispatchToast({
          type: "error",
          content: seasoningError,
        });
      }
      return;
    }

    formik.handleSubmit();
  };

  const selectedPokemon = pokemons.find(
    (p) => p._id === formik.values.pokemonId,
  );

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSelect = (pokemonId: string) => {
    formik.setFieldValue("pokemonId", pokemonId);
    setHasSelectedPokemonBefore(true);
    setIsPaletteOpen(false);
  };

  const handleSeasoningSelect = (item: SeasoningItem, slot: number) => {
    const newSeasoningItemIds = [...formik.values.seasoningItemIds] as [
      string | null,
      string | null,
      string | null,
    ];
    newSeasoningItemIds[slot] = item._id;
    formik.setFieldValue("seasoningItemIds", newSeasoningItemIds);
    setSeasoningModalSlot(null);
  };

  const handleCategoryToggle = (category: RecipeCategory) => {
    const currentCategories = formik.values.category;
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter((c) => c !== category)
      : [...currentCategories, category];
    formik.setFieldValue("category", newCategories, false);
  };

  const getSeasoningItemById = (id: string | null): SeasoningItem | null => {
    if (!id) return null;
    return allSeasoningItems.find((item) => item._id === id) || null;
  };

  const getSelectedSeasoningItems = (): SeasoningItem[] => {
    return formik.values.seasoningItemIds
      .map((id) => getSeasoningItemById(id))
      .filter((item): item is SeasoningItem => item !== null);
  };

  const getRecipePotItems = () => {
    return formik.values.seasoningItemIds.map((id) => {
      const seasoningItem = getSeasoningItemById(id);
      return seasoningItem
        ? {
            path: `/images/seasoning/${seasoningItem.image}`,
            name: seasoningItem.itemName,
            description: parseSeasoningEffects(seasoningItem.effects),
          }
        : null;
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {!hasSelectedPokemonBefore && !selectedPokemon && (
        <Card title="Select your pokemon to show recipes">
          <div className="px-4 pt-2 pb-1">
            <p className="text-base leading-relaxed text-[#3f3f3f]">
              Click on the item frame to select the pokemon
            </p>
          </div>
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
      )}

      {selectedPokemon && (
        <PokemonDisplayCard
          pokemon={selectedPokemon}
          onPokemonClick={() => setIsPaletteOpen(true)}
        />
      )}

      <Card title="Category">
        <div className="px-4 pt-2 pb-1">
          <p className="text-base leading-relaxed text-[#3f3f3f]">
            Select which type of recipe this is for
          </p>
        </div>

        <div className="flex flex-row gap-4 p-4">
          <SelectableInventoryItem
            data={{
              path: "/images/poke_rod.png",
              name: "Fishing",
            }}
            isSelected={formik.values.category.includes("fishing")}
            onToggle={() => handleCategoryToggle("fishing")}
          />
          <SelectableInventoryItem
            data={{
              path: "/images/poke_snack.png",
              name: "Pokesnack",
            }}
            isSelected={formik.values.category.includes("pokesnack")}
            onToggle={() => handleCategoryToggle("pokesnack")}
          />
        </div>
      </Card>

      <Card title="Seasoning Items">
        <div className="px-4 pt-2 pb-1">
          <p className="text-base leading-relaxed text-[#3f3f3f]">
            Select up to 3 seasoning items to create your recipe
          </p>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row items-start gap-8 p-4">
            <RecipePot
              items={getRecipePotItems()}
              onItemClick={(slot) => setSeasoningModalSlot(slot)}
              emptyLabel="Choose seasoning"
            />

            {getSelectedSeasoningItems().length > 0 && (
              <div className="flex flex-1 flex-col items-start gap-3">
                <div className="flex flex-row items-center gap-2">
                  <span className="text-2xl text-black">Combined Effects</span>
                </div>
                <div className="flex flex-col gap-1 pl-2">
                  {combineRecipeEffects(getSelectedSeasoningItems()).map(
                    (effect, effectIndex) => (
                      <div
                        key={effectIndex}
                        className="flex flex-row items-center gap-2"
                      >
                        <div className="h-1.5 w-1.5 shrink-0 bg-[#3f3f3f]" />
                        {formatCombinedEffects(effect)}
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card title="Description">
        <div className="px-4 pt-2 pb-1">
          <p className="text-base leading-relaxed text-[#3f3f3f]">
            Add an optional description for your recipe
          </p>
        </div>
        <div className="p-4">
          <Textarea
            name="description"
            value={formik.values.description || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter recipe description (optional)"
            rows={6}
            className="w-full"
          />
        </div>
      </Card>

      <div className="flex flex-row justify-end gap-4">
        <Button
          onClick={() => navigate("/")}
          variant="default"
          disabled={createRecipeMutation.isPending}
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          variant="green"
          disabled={createRecipeMutation.isPending}
        >
          {createRecipeMutation.isPending ? <LoadingDots /> : "Submit"}
        </Button>
      </div>

      <PokemonCommandPalette
        isOpen={isPaletteOpen}
        value={debouncedSearchQuery}
        onClose={() => setIsPaletteOpen(false)}
        onSelect={handleSelect}
        pokemons={pokemons}
        onSearchChange={handleSearchChange}
        isLoading={isLoading}
      />

      {seasoningModalSlot !== null && (
        <SelectSeasoningItemModal
          isOpen={seasoningModalSlot !== null}
          onClose={() => setSeasoningModalSlot(null)}
          onSelect={(item) => handleSeasoningSelect(item, seasoningModalSlot)}
        />
      )}
    </div>
  );
};

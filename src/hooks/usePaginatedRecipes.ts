import { useState, useEffect, useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { getRecipes } from "../api/queries/getRecipes";
import type { Recipe } from "../types/seasoning-cookbook-service";

type UsePaginatedRecipesParams = {
  sortBy?: "most-upvotes" | "least-upvotes";
  pokemonIds?: string[];
  seasoningItemIds?: string[];
};

type UsePaginatedRecipesReturn = {
  recipes: Recipe[];
  hasMore: boolean;
  loadMore: () => void;
  isLoadingMore: boolean;
  isLoading: boolean;
};

const PAGE_SIZE = 10;

export const usePaginatedRecipes = (
  params: UsePaginatedRecipesParams,
): UsePaginatedRecipesReturn => {
  const [loadedPages, setLoadedPages] = useState<number[]>([1]);

  const { sortBy, pokemonIds, seasoningItemIds } = params;

  const queryParams = useMemo(
    () => ({
      sortBy: sortBy || undefined,
      pokemonIds: pokemonIds && pokemonIds.length > 0 ? pokemonIds : undefined,
      seasoningItemIds:
        seasoningItemIds && seasoningItemIds.length > 0
          ? seasoningItemIds
          : undefined,
    }),
    [sortBy, pokemonIds, seasoningItemIds],
  );

  useEffect(() => {
    setLoadedPages([1]);
  }, [sortBy, pokemonIds, seasoningItemIds]);

  const queries = useQueries({
    queries: loadedPages.map((page) => ({
      queryKey: ["recipes", { ...queryParams, page }],
      queryFn: () => getRecipes({ ...queryParams, page }),
    })),
  });

  const isLoading = queries[0]?.isLoading ?? false;
  const isLoadingMore =
    queries.length > 1 && queries[queries.length - 1]?.isLoading
      ? true
      : false;

  const allRecipes = useMemo(() => {
    const recipes: Recipe[] = [];
    queries.forEach((query) => {
      if (query.data) {
        recipes.push(...query.data);
      }
    });
    return recipes;
  }, [queries]);

  const lastPageData = queries[queries.length - 1]?.data ?? [];
  const hasMore = lastPageData.length === PAGE_SIZE;

  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      const nextPage = loadedPages.length + 1;
      setLoadedPages([...loadedPages, nextPage]);
    }
  };

  return {
    recipes: allRecipes,
    hasMore,
    loadMore,
    isLoadingMore,
    isLoading,
  };
};

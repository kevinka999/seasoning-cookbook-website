import { httpModule } from "../shared/http-module";
import type { AxiosRequestConfig } from "axios";
import type { Pokemon } from "../../types/seasoning-cookbook-service";

interface SearchPokemonsParams {
  name: string;
  limit?: number;
}

export const searchPokemons = async (
  params: SearchPokemonsParams
): Promise<Pokemon[]> => {
  const config: AxiosRequestConfig = {
    params: {
      name: params.name,
      ...(params.limit && { limit: params.limit }),
    },
  };

  return await httpModule.get<Pokemon[]>(
    "seasoningCookbook",
    "/pokemons/search",
    config
  );
};


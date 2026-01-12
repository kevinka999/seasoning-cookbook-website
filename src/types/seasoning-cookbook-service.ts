export type PokemonType =
  | "bug"
  | "dark"
  | "dragon"
  | "electric"
  | "fairy"
  | "fighting"
  | "fire"
  | "flying"
  | "ghost"
  | "grass"
  | "ground"
  | "ice"
  | "normal"
  | "poison"
  | "psychic"
  | "rock"
  | "steel"
  | "water";

export type EggGroup =
  | "bug"
  | "ditto"
  | "dragon"
  | "fairy"
  | "flying"
  | "ground"
  | "humanshape"
  | "indeterminate"
  | "mineral"
  | "monster"
  | "no-eggs"
  | "plant"
  | "water1"
  | "water2"
  | "water3";

export type RecipeCategory = "fishing" | "pokesnack";

export type EffectType =
  | "REDUCE_BITE_TIME_PERCENT"
  | "BOOST_RARITY_BUCKET"
  | "INCREASE_SHINY_CHANCE_MULTIPLIER"
  | "ATTRACT_HIDDEN_ABILITY"
  | "INCREASE_REEL_CHANCE"
  | "BOOST_POKEMON_LEVEL"
  | "ATTRACT_EV_YIELD"
  | "BOOST_FRIENDSHIP"
  | "ATTRACT_FEMALE_POKEMON"
  | "ATTRACT_MALE_POKEMON"
  | "DROPS_REROLL_COUNT"
  | "BOOST_IVS"
  | "EGG_GROUP_BOOST"
  | "TYPE_BOOST"
  | "ATTRACT_NATURE"
  | "NO_EFFECT";

export type EffectCategory =
  | "HP"
  | "ATTACK"
  | "DEFENSE"
  | "SPECIAL_ATTACK"
  | "SPECIAL_DEFENSE"
  | "SPEED"
  | "DRAGON"
  | "MONSTER"
  | "WATER_1"
  | "WATER_2"
  | "WATER_3"
  | "BUG"
  | "FAIRY"
  | "GRASS"
  | "HUMAN_LIKE"
  | "FLYING"
  | "FIELD"
  | "MINERAL"
  | "AMORPHOUS"
  | "DARK"
  | "ELECTRIC"
  | "FIGHTING"
  | "FIRE"
  | "GHOST"
  | "GROUND"
  | "ICE"
  | "NORMAL"
  | "POISON"
  | "PSYCHIC"
  | "ROCK"
  | "STEEL"
  | "WATER";

export interface Pokemon {
  _id: string;
  registrationNumber: string;
  name: string;
  bucket: "common" | "uncommon" | "rare" | "ultra-rare";
  types: PokemonType[];
  eggGroups: EggGroup[];
}

export interface SeasoningCookbookUser {
  _id: string;
  identityId: string;
  nickname: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Recipe {
  _id: string;
  authorId: string;
  authorNickname: string;
  pokemonId: string;
  pokemon: Pokemon;
  seasoningItemIds: string[];
  description: string | null;
  category: RecipeCategory[];
  upvoteCount: number;
  upvotedBy: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ItemEffect {
  type: EffectType;
  category?: EffectCategory;
  value?: string | null;
}

export interface SeasoningItem {
  _id: string;
  itemName: string;
  effects: ItemEffect[];
  image?: string;
}

export type CombinedEffect = {
  type: EffectType;
  category?: EffectCategory;
  totalValue: number;
};

export type FormattedEffectPart =
  | string
  | {
      type: "category" | "value" | "effectType";
      content: string;
      rawValue?: number;
      effectType?: EffectType;
      category?: EffectCategory;
    };

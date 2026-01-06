import type {
  CombinedEffect,
  FormattedEffectPart,
  EffectType,
  EffectCategory,
  SeasoningItem,
  ItemEffect,
} from "../types/seasoning-cookbook-service";

const parseBoostValue = (value: string | null | undefined): number => {
  if (value === null || value === undefined) return 0;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};

// Effect types that don't require numeric values
const EFFECTS_WITHOUT_VALUE: EffectType[] = [
  "ATTRACT_HIDDEN_ABILITY",
  "ATTRACT_FEMALE_POKEMON",
  "ATTRACT_MALE_POKEMON",
];

export const combineRecipeEffects = (
  recipe: SeasoningItem[],
): CombinedEffect[] => {
  const effectMap = new Map<
    string,
    {
      type: EffectType;
      category?: EffectCategory;
      totalValue: number;
    }
  >();

  // Iterate through all seasonings in the recipe
  for (const seasoning of recipe) {
    // Iterate through all effects of each seasoning
    for (const effect of seasoning.effects) {
      // Create a key for grouping: type + category (or 'NO_CATEGORY')
      const groupKey = `${effect.type}-${effect.category ?? "NO_CATEGORY"}`;

      // Check if this effect type doesn't require a value
      if (EFFECTS_WITHOUT_VALUE.includes(effect.type)) {
        // For effects without value, just mark them as present (totalValue = 1)
        if (!effectMap.has(groupKey)) {
          effectMap.set(groupKey, {
            type: effect.type,
            category: effect.category,
            totalValue: 1,
          });
        }
        continue;
      }

      // For ATTRACT_EV_YIELD, it can exist without a value but with a category
      if (effect.type === "ATTRACT_EV_YIELD") {
        if (!effectMap.has(groupKey)) {
          effectMap.set(groupKey, {
            type: effect.type,
            category: effect.category,
            totalValue: 0,
          });
        }
        continue;
      }

      // For other effects, require numeric values
      if (effect.value === null || effect.value === undefined) {
        continue;
      }

      const numericValue = parseBoostValue(effect.value);
      if (numericValue === 0) {
        continue;
      }

      if (effectMap.has(groupKey)) {
        const existing = effectMap.get(groupKey);
        if (existing) {
          existing.totalValue += numericValue;
        }
      } else {
        effectMap.set(groupKey, {
          type: effect.type,
          category: effect.category,
          totalValue: numericValue,
        });
      }
    }
  }

  return Array.from(effectMap.values());
};

export const formatCombinedEffect = (
  effect: CombinedEffect,
): FormattedEffectPart[] => {
  const { type, category, totalValue } = effect;

  switch (type) {
    case "EGG_GROUP_BOOST":
      return category
        ? [
            "Boost ",
            { type: "category", content: category, category },
            " egg group by ",
            { type: "value", content: `${totalValue}x`, rawValue: totalValue },
          ]
        : [
            "Boost egg group by ",
            { type: "value", content: `${totalValue}x`, rawValue: totalValue },
          ];
    case "TYPE_BOOST":
      return category
        ? [
            "Boost ",
            { type: "category", content: category, category },
            " type by ",
            { type: "value", content: `${totalValue}x`, rawValue: totalValue },
          ]
        : [
            "Boost type by ",
            { type: "value", content: `${totalValue}x`, rawValue: totalValue },
          ];
    case "BOOST_IVS":
      return category
        ? [
            "Boost ",
            { type: "category", content: category, category },
            " IVs by ",
            { type: "value", content: `${totalValue}x`, rawValue: totalValue },
          ]
        : [
            "Boost IVs by ",
            { type: "value", content: `${totalValue}x`, rawValue: totalValue },
          ];
    case "ATTRACT_EV_YIELD":
      return category
        ? [
            "Attract ",
            { type: "category", content: category, category },
            " EV yield",
          ]
        : ["Attract EV yield"];
    case "ATTRACT_NATURE":
      return category
        ? [
            "Attract ",
            { type: "category", content: category, category },
            " nature by ",
            { type: "value", content: `${totalValue}%`, rawValue: totalValue },
          ]
        : [
            "Attract nature by ",
            { type: "value", content: `${totalValue}%`, rawValue: totalValue },
          ];
    case "REDUCE_BITE_TIME_PERCENT":
      return [
        "Reduce bite time by ",
        { type: "value", content: `${totalValue}%`, rawValue: totalValue },
      ];
    case "BOOST_RARITY_BUCKET":
      return [
        "Boost rarity bucket by ",
        { type: "value", content: `${totalValue}x`, rawValue: totalValue },
      ];
    case "INCREASE_SHINY_CHANCE_MULTIPLIER":
      return [
        "Increase shiny chance multiplier by ",
        { type: "value", content: `${totalValue}x`, rawValue: totalValue },
      ];
    case "INCREASE_REEL_CHANCE":
      return [
        "Increase reel chance by ",
        { type: "value", content: `${totalValue}%`, rawValue: totalValue },
      ];
    case "BOOST_POKEMON_LEVEL":
      return [
        "Boost pokemon level by ",
        { type: "value", content: `${totalValue}`, rawValue: totalValue },
      ];
    case "BOOST_FRIENDSHIP":
      return [
        "Boost friendship by ",
        { type: "value", content: `${totalValue}`, rawValue: totalValue },
      ];
    case "DROPS_REROLL_COUNT":
      return [
        "Drops reroll count by ",
        { type: "value", content: `${totalValue}`, rawValue: totalValue },
      ];
    case "ATTRACT_HIDDEN_ABILITY":
      return ["Attract hidden ability"];
    case "ATTRACT_FEMALE_POKEMON":
      return ["Attract female pokemon"];
    case "ATTRACT_MALE_POKEMON":
      return ["Attract male pokemon"];
    case "NO_EFFECT":
      return ["No effect"];
    default:
      return ["Unknown effect"];
  }
};

export const parseSeasoningEffects = (effects: ItemEffect[]): string => {
  return effects
    .map((effect) => {
      switch (effect.type) {
        case "EGG_GROUP_BOOST":
          return effect.category
            ? effect.value
              ? `Boost ${effect.category} egg group by ${effect.value}x`
              : `Boost ${effect.category} egg group`
            : "Boost egg group";
        case "TYPE_BOOST":
          return effect.category
            ? effect.value
              ? `Boost ${effect.category} type by ${effect.value}x`
              : `Boost ${effect.category} type`
            : "Boost type";
        case "BOOST_IVS":
          return effect.category
            ? effect.value
              ? `Boost ${effect.category} IVs by ${effect.value}x`
              : `Boost ${effect.category} IVs`
            : "Boost IVs";
        case "ATTRACT_EV_YIELD":
          return effect.category
            ? `Attract ${effect.category} EV yield`
            : "Attract EV yield";
        case "ATTRACT_NATURE":
          return effect.category
            ? effect.value
              ? `Attract ${effect.category} nature by ${effect.value}%`
              : `Attract ${effect.category} nature`
            : "Attract nature";
        case "REDUCE_BITE_TIME_PERCENT":
          return effect.value
            ? `Reduce bite time by ${effect.value}%`
            : "Reduce bite time";
        case "BOOST_RARITY_BUCKET":
          return effect.value
            ? `Boost rarity bucket by ${effect.value}x`
            : "Boost rarity bucket";
        case "INCREASE_SHINY_CHANCE_MULTIPLIER":
          return effect.value
            ? `Increase shiny chance multiplier by ${effect.value}x`
            : "Increase shiny chance multiplier";
        case "INCREASE_REEL_CHANCE":
          return effect.value
            ? `Increase reel chance by ${effect.value}%`
            : "Increase reel chance";
        case "BOOST_POKEMON_LEVEL":
          return effect.value
            ? `Boost pokemon level by ${effect.value}`
            : "Boost pokemon level";
        case "ATTRACT_HIDDEN_ABILITY":
          return "Attract hidden ability";
        case "ATTRACT_FEMALE_POKEMON":
          return "Attract female pokemon";
        case "ATTRACT_MALE_POKEMON":
          return "Attract male pokemon";
        case "DROPS_REROLL_COUNT":
          return effect.value
            ? `Drops reroll count by ${effect.value}`
            : "Drops reroll count";
        case "BOOST_FRIENDSHIP":
          return effect.value
            ? `Boost friendship by ${effect.value}`
            : "Boost friendship";
        case "NO_EFFECT":
          return `No effect`;
        default:
          return `Unknown effect`;
      }
    })
    .map((effect) => `- ${effect}`)
    .join("\n");
};

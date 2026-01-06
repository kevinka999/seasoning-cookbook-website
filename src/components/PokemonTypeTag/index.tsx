import { twMerge } from "tailwind-merge";
import type { PokemonType } from "../../types/seasoning-cookbook-service";
import { capitalizeWords } from "../../utils";

type TypeTheme = {
  bgColor: string;
  textColor: string;
  lightColor: string;
  darkColor: string;
};

const pokemonTypeColors: Record<PokemonType, TypeTheme> = {
  normal: {
    bgColor: "#A8A77A",
    textColor: "#FFFFFF",
    lightColor: "#C6C5AA",
    darkColor: "#6D6D4E",
  },
  fire: {
    bgColor: "#EE8130",
    textColor: "#FFFFFF",
    lightColor: "#F4A76D",
    darkColor: "#B26023",
  },
  water: {
    bgColor: "#6390F0",
    textColor: "#FFFFFF",
    lightColor: "#91B1F5",
    darkColor: "#4A6CB3",
  },
  grass: {
    bgColor: "#7AC74C",
    textColor: "#FFFFFF",
    lightColor: "#A2D881",
    darkColor: "#5B9539",
  },
  electric: {
    bgColor: "#F7D02C",
    textColor: "#FFFFFF",
    lightColor: "#F9DE6B",
    darkColor: "#B99C21",
  },
  ice: {
    bgColor: "#96D9D6",
    textColor: "#FFFFFF",
    lightColor: "#B6E4E2",
    darkColor: "#70A2A0",
  },
  fighting: {
    bgColor: "#C22E28",
    textColor: "#FFFFFF",
    lightColor: "#D46C68",
    darkColor: "#91221E",
  },
  poison: {
    bgColor: "#A33EA1",
    textColor: "#FFFFFF",
    lightColor: "#BE78BC",
    darkColor: "#7A2E79",
  },
  ground: {
    bgColor: "#E2BF65",
    textColor: "#FFFFFF",
    lightColor: "#EAD293",
    darkColor: "#A98F4B",
  },
  flying: {
    bgColor: "#A98FF3",
    textColor: "#FFFFFF",
    lightColor: "#C3B0F6",
    darkColor: "#7E6BB6",
  },
  psychic: {
    bgColor: "#F95587",
    textColor: "#FFFFFF",
    lightColor: "#FB88AB",
    darkColor: "#BA3F65",
  },
  bug: {
    bgColor: "#A6B91A",
    textColor: "#FFFFFF",
    lightColor: "#C1D25E",
    darkColor: "#7C8A13",
  },
  rock: {
    bgColor: "#B6A136",
    textColor: "#FFFFFF",
    lightColor: "#CCBC72",
    darkColor: "#887828",
  },
  ghost: {
    bgColor: "#735797",
    textColor: "#FFFFFF",
    lightColor: "#9D89B6",
    darkColor: "#564171",
  },
  dragon: {
    bgColor: "#6F35FC",
    textColor: "#FFFFFF",
    lightColor: "#9A71FD",
    darkColor: "#5327BD",
  },
  steel: {
    bgColor: "#B7B7CE",
    textColor: "#FFFFFF",
    lightColor: "#CDCDDD",
    darkColor: "#89899A",
  },
  dark: {
    bgColor: "#705746",
    textColor: "#FFFFFF",
    lightColor: "#9B7861",
    darkColor: "#544134",
  },
  fairy: {
    bgColor: "#D685AD",
    textColor: "#FFFFFF",
    lightColor: "#E2A9C5",
    darkColor: "#A06381",
  },
};

type PokemonTypeTagProps = React.ComponentPropsWithoutRef<"span"> & {
  type: PokemonType;
  className?: string;
};

export const PokemonTypeTag = ({
  type,
  className = "",
  ...props
}: PokemonTypeTagProps) => {
  const colors = pokemonTypeColors[type];
  const baseStyles =
    "inline-block border-2 border-black rounded-none text-white minecraft-text-shadow";
  const sizeStyles = "px-3 py-1 text-sm";

  const tagStyles = twMerge(baseStyles, sizeStyles, className);
  const innerBorderShadow = `inset 0 2px 0 0 ${colors.lightColor}, inset 2px 0 0 0 ${colors.lightColor}, inset -2px 0 0 0 ${colors.darkColor}, inset 0 -2px 0 0 ${colors.darkColor}`;

  return (
    <span
      className={tagStyles}
      style={{
        backgroundColor: colors.bgColor,
        color: colors.textColor,
        boxShadow: innerBorderShadow,
      }}
      {...props}
    >
      {capitalizeWords(type)}
    </span>
  );
};

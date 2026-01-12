import { InventoryItem, PokemonTypeTag, Tag } from "../";
import { normalizeWord } from "../../utils";
import type { Pokemon } from "../../types/seasoning-cookbook-service";

type PokemonInfoProps = {
  pokemon: Pokemon;
  onPokemonClick?: () => void;
};

export const PokemonInfo = ({ pokemon, onPokemonClick }: PokemonInfoProps) => {
  return (
    <div className="flex gap-6">
      <InventoryItem
        data={{
          path: `/images/pokemon/${pokemon.registrationNumber}.webp`,
          name: pokemon.name,
          onClick: onPokemonClick,
        }}
        className="h-24 w-24 shrink-0"
      />

      <div className="flex flex-row items-start gap-8">
        <div className="flex flex-col gap-1">
          <span className="text-lg font-semibold text-primary">Types</span>
          <div className="flex flex-wrap gap-2">
            {pokemon.types.map((type) => (
              <PokemonTypeTag key={type} type={type} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-lg font-semibold text-primary">Egg Groups</span>
          <div className="flex flex-wrap gap-2">
            {pokemon.eggGroups.map((eggGroup) => (
              <Tag key={eggGroup} text={normalizeWord(eggGroup)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

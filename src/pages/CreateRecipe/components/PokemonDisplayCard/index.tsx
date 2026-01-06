import { capitalizeWords } from "../../../../utils";
import { Card } from "../../../../components";
import { ItemFrame } from "../../../../components";
import { PokemonTypeTag } from "../../../../components";
import { Tag } from "../../../../components";
import type {
  Pokemon,
  PokemonType,
} from "../../../../types/seasoning-cookbook-service";

type PokemonDisplayCardProps = {
  pokemon: Pokemon;
  onPokemonClick?: () => void;
};

const PokemonTitle = ({ pokemon }: { pokemon: Pokemon }) => {
  return (
    <div className="flex flex-row items-center gap-1">
      <img src="/icons/pokeball.png" alt="Pokeball" className="h-8 w-8" />
      {pokemon.name}
    </div>
  );
};

export const PokemonDisplayCard = ({
  pokemon,
  onPokemonClick,
}: PokemonDisplayCardProps) => {
  const title = <PokemonTitle pokemon={pokemon} />;
  return (
    <Card title={title}>
      <div className="flex gap-6 p-4">
        <ItemFrame
          src={`/images/pokemon/${pokemon.registrationNumber}.webp`}
          alt={pokemon.name}
          onClick={onPokemonClick}
          className="h-24 w-24 shrink-0"
        />

        <div className="flex flex-row items-center gap-8">
          <div className="flex flex-col gap-1">
            <span className="text-base leading-relaxed text-[#3f3f3f]">
              Types:
            </span>
            <div className="flex flex-wrap gap-2">
              {pokemon.types.map((type: PokemonType) => (
                <PokemonTypeTag key={type} type={type} />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-base leading-relaxed text-[#3f3f3f]">
              Egg Groups:
            </span>
            <div className="flex flex-wrap gap-2">
              {pokemon.eggGroups.map((eggGroup) => (
                <Tag key={eggGroup} text={capitalizeWords(eggGroup)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

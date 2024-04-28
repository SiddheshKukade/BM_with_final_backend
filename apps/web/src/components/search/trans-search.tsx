import { TransMask } from "@/components/search/trans-mask.tsx";
import { TransInput } from "./trans-input";
import { useAtom } from "jotai";
import {
  hinterAtom,
  isInFocusAtom,
  searchTextAtom,
    maskLocationAtom
} from "@/components/search/atoms.ts";
import { TransSelect } from "@/components/search/trans-select.tsx";

export const TransSearch = () => {
  const [search, writSearch] = useAtom(searchTextAtom);
  const [, toggleInFocus] = useAtom(isInFocusAtom);
  const [hint] = useAtom(hinterAtom);
    const [location] = useAtom(maskLocationAtom);
  return (
    <div>
      <TransMask />
      <TransInput
        id="esy-trans-search"
        value={search}
        onChange={(e) => writSearch(e.target.value)}
        onFocus={() => toggleInFocus()}
        onBlur={() => toggleInFocus()}
      />
      <TransSelect />
        <p>{location}</p>
        <p>{write(hint)}</p>
    </div>
  );
};

const write = (hint: string[][]) => {
  return hint.map((itm) => itm.join(":")).join(", ");
};

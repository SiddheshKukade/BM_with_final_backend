import { TransMask } from "@/components/search/trans-mask.tsx";
import { TransInput } from "./trans-input";
import { useAtom } from "jotai";
import { isInFocusAtom, searchTextAtom } from "@/components/search/atoms.ts";
import { TransSelect } from "@/components/search/trans-select.tsx";
import { TransTable } from "@/components/search/trans-table.tsx";

export const TransSearch = () => {
  const [search, writSearch] = useAtom(searchTextAtom);
  const [, toggleInFocus] = useAtom(isInFocusAtom);

  return (
    <div>
      {/*{isBusy && <p>working...</p>}*/}
      <TransMask />
      <TransInput
        id="esy-trans-search"
        value={search}
        onChange={(e) => writSearch(e.target.value)}
        onFocus={() => toggleInFocus(true)}
        onBlur={() => toggleInFocus(false)}
      />
      <TransSelect />
      <TransTable />
    </div>
  );
};

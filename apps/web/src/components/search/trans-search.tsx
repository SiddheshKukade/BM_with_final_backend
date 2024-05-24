import { TransMask } from "@/components/search/trans-mask.tsx";
import { TransInput } from "./trans-input";
import { useAtom } from "jotai";
import { hinterAtom, isInFocusAtom, searchTextAtom } from "@/components/search/atoms.ts";
import { TransSelect } from "@/components/search/trans-select.tsx";
import { TransTable } from "@/components/search/trans-table.tsx";
import TableUI from "../table/TableUI";
import { useState } from "react";

export const TransSearch = () => {
  
  const [search, writSearch] = useAtom(searchTextAtom);
  const [, toggleInFocus] = useAtom(isInFocusAtom);
  const [tableData, setTableData] = useState([])
  const [hint] = useAtom(hinterAtom);

  const submitPressed = () => {
    console.log("pressed submitPressed ")
    const jsonObject = {};
    hint.forEach(([key, value]) => {
      jsonObject[key] = value;
    });
    setTableData((prev) => [...prev, jsonObject])
    writSearch("")
  }
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      submitPressed();
    }
  };
  return (
    <div>
      {/*{isBusy && <p>working...</p>}*/}
      <TransMask />
      <TransInput
        // submitPressed={submitPressed}
onSubmit={submitPressed}
onKeyDown={handleKeyDown}
        id="esy-trans-search"
        value={search}
        onChange={(e) => writSearch(e.target.value)}
        onFocus={() => toggleInFocus(true)}
        onBlur={() => toggleInFocus(false)}
      />
      <TransSelect />
      {/* <TransTable /> */}
      <TableUI tableData={tableData} setTableData={setTableData} />

    </div>
  );
};

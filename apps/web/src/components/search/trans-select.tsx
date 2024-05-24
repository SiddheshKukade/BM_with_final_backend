import { ScrollArea } from "@/components/ui/scroll-area";
import { useAtom } from "jotai";
import { foundKeysAtom ,isAutoCompleteVisibleAtom, isInFocusAtom, searchTextAtom, sourceCitiesAtom} from "@/components/search/atoms.ts";
import { useState } from "react";

//relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50
export const TransSelect = () => {
  const [isFocused, setIsFocused] = useAtom(isInFocusAtom);
  const [isAutoComplete] = useAtom(isAutoCompleteVisibleAtom);
  const [cities] = useAtom(sourceCitiesAtom);
  const [tableData, setTableData] = useState([])
  const [foundKeys, setFoundKetys] = useAtom(foundKeysAtom);
  
  const [search, setSearch] = useAtom(searchTextAtom);

console.log('first')
  const handleClickSourceDestination = (e, tag) => {
console.log('second')

    console.log(tag.name)
    if (foundKeys[foundKeys.length - 1]) {
      foundKeys[foundKeys.length - 1][1] = tag.name
    } else {
      console.log("ca't find the last one.")
    }
    console.log("-------------------------------------", search)
    // console.log(foundKeys)
    let arr = search.split(' ')
    arr[arr.length - 1] = tag.name;
    setSearch(arr.join(' '))
    console.log("-------------------------------------", search)
    setFoundKetys(foundKeys);
  }
console.log('third')

  return (  isAutoComplete &&
    <ScrollArea className="h-60 w-100 rounded-md border z-1 relative">
      <div className="p-1" style={{ width: "100%" }}>
        {cities.map((tag) => (
      //    <div key={Math.random()} className="py-1 text-gray-400 border-b border-b-gray-300 text-xs hover:bg-accent hover:text-accent-foreground hover:cursor-pointer">
      //    <div >{tag?.name}</div>
      //  </div>
        <div onClick={(e) => handleClickSourceDestination(e, tag)} key={Math.random()} className="py-1 text-gray-400 border-b border-b-gray-300 text-xs hover:bg-accent hover:text-accent-foreground hover:cursor-pointer">
        {tag?.name}
      </div>
        ))}
      </div>
    </ScrollArea>
  );
};

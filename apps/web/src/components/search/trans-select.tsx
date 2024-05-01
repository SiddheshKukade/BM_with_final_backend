import { ScrollArea } from "@/components/ui/scroll-area";
import { useAtom } from "jotai";
import {  isAutoCompleteVisibleAtom, isInFocusAtom, sourceCitiesAtom} from "@/components/search/atoms.ts";

//relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50
export const TransSelect = () => {
  const [isFocused] = useAtom(isInFocusAtom);
  const [isAutoComplete] = useAtom(isAutoCompleteVisibleAtom);
  const [cities] = useAtom(sourceCitiesAtom);

  return ( isFocused && isAutoComplete &&
    <ScrollArea className="h-60 w-100 rounded-md border z-1 relative">
      <div className="p-1" style={{ width: "100%" }}>
        {cities.map((tag) => (
          <div key={tag.id} className="py-1 text-gray-400 border-b border-b-gray-300 text-xs hover:bg-accent hover:text-accent-foreground hover:cursor-pointer">
            <div >{tag.city}</div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

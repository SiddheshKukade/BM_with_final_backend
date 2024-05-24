/// atoms.ts

import { atom, createStore, WritableAtom } from "jotai";
import { getCanvasFont, getTextWidth } from "./utils";
import { sortBy } from "lodash";
import { cities } from "../../data";

import { getAutoComplete, getPredictions } from "@/lib/api.ts";
import { productNames, products } from "../../data/products";

const MODULE = "delivery";
const sortedCities = sortBy(cities, (it: any) => it.city);
const sortedProducts = sortBy(products, (it: any) => it.name)
const  productLists = products;
const sourceCities = sortedCities.filter(
  (it) => !it.type || it.type === "source",
);
const destinitionCities = sortedCities.filter(
  (it) => !it.type || it.type === "destination",
);
let first = [
  { key: "source", autoComplete: true, autoCompleteSource: sourceCities },
  {
    key: "destination",
    autoComplete: true,
    autoCompleteSource: destinitionCities,
  },
  { key: "mode" },
  { key: "product",  autoComplete: true, autoCompleteSource: productLists  },
  { key: "qty" },
];
let second = [
  { key: "product",  autoComplete: true, autoCompleteSource: productLists  },
  { key: "qty" },
];

const TEMPLATES = {
  delivery: {
    default: "please enter search ...",
    prompts: first,
    prompts2: second,
  },
};
let elemtnCache: HTMLElement;
type template = { default: string; prompts: { key: string }[] };
export const APP_STORE = createStore();
export const templateAtom = atom<template | any>(null);
// base atoms
// export const sourceCitiesAtom = (() => {
//   const baseAtom = atom([]);
//   return atom(
//     (get) => get(baseAtom),
//     async (get, set, payload) => {
//       const foundKeys = get(foundKeysAtom);
//       const [currentKey] =
//         foundKeys.length > 0 ? foundKeys[foundKeys.length - 1] : ["", ""];
//       if (!["source", "destination"].includes(currentKey)) {
//         set(isAutoCompleteVisibleAtom, true);
//       }
//       console.log("found keys", foundKeys)
//       const autoCompleteData = await getAutoComplete({
//         predictions: foundKeys,
//       });
//       set(isAutoCompleteVisibleAtom, true);
//       set(baseAtom, autoCompleteData);
//     },
//   );
// })();
export const sourceCitiesAtom = (() => {
  const baseAtom = atom(sortedCities);
  return atom(
    (get) => get(baseAtom),
    (get, set) => {
      const foundKeys = get(foundKeysAtom);
      // console.log(foundKeys, "are found keys ")
      const [currentKey, currentVal] =
        foundKeys.length > 0 ? foundKeys[foundKeys.length - 1] : ["", ""];

      // console.log(currentVal, currentKey, "are found keys 2 ", TEMPLATES.delivery.default)
      // console.log("===?> ", foundKeys,currentVal )
      // foundKeys[foundKeys.length-1][1] = 'sdfeds'
      // console.log("===> ", foundKeys, currentVal, )

      if (!["source", "destination"].includes(currentKey)) {
        set(isAutoCompleteVisibleAtom, false);
      }
      set(isAutoCompleteVisibleAtom, true);
      const cities = currentKey === "source" ? sourceCities : destinitionCities;
      set(
        baseAtom,
        cities.filter(
          (it) => it?.city?.toLowerCase().indexOf(currentVal?.toLowerCase()) === 0,
        ).slice(0, 3),
      );
    },
  );
})();
export const productNameAtom = (()=>{ 
  const baseProductsAtom = atom(sortedProducts);
  return atom(
    (get) => get(baseProductsAtom),
    (get,set) => {
      const foundKeys = get(foundKeysAtom);
      const [currentKey, currentVal] =
        foundKeys.length > 0 ? foundKeys[foundKeys.length - 1] : ["", ""];
      console.log(currentVal, currentKey, "are found keys 2 products ", TEMPLATES.delivery.default)

        if (!["product"].includes(currentKey)) {
          set(isAutoCompleteVisibleAtom, false);
        }
        // set(isAutoCompleteVisibleAtom, true);
        console.log("======-------=====",    products.filter( it => it?.name?.toLowerCase().indexOf(currentVal?.toLowerCase()) == 0,).slice(0,3),)
      set(
        baseProductsAtom,
        products.filter( it => it?.name?.toLowerCase().indexOf(currentVal?.toLowerCase()) == 0,).slice(0,3),
      )
    }
  )

})();
export const maskAtom = atom("");

export const foundKeysAtom = atom<string[][]>([]);
export const baseSearchTextAtom = atom("");
export const baseMaskLocationAtom = atom(0);
export const isInFocusAtom = atom(false);
export const isAutoCompleteVisibleAtom = atom(false);
export const isBusyAtom = atom(false);
//derived atoms
export const hinterAtom = atom((get) => get(foundKeysAtom));
export const maskLocationAtom = atom(
  (get) => get(baseMaskLocationAtom),
  (_get, set, update) => {
    if (!elemtnCache) {
      elemtnCache = document.getElementById("esy-trans-search")!;
    }
    const width = getTextWidth(update, getCanvasFont(elemtnCache));
    set(baseMaskLocationAtom, width && width + 7);
  },
);
export const searchTextAtom = atom(
  (get) => get(baseSearchTextAtom),
  async (get, set, update: string) => {
    const text = update.trim();
    set(baseSearchTextAtom, update);
    if (!text) {
      set(foundKeysAtom, []);
      set(maskOnInteractionAtom);
      set(maskLocationAtom, update);
      // set(sourceCitiesAtom);
      return;
    }
    set(isBusyAtom, true);
    const { prompts } = get(templateAtom);
    const predictions = get(foundKeysAtom) || [];
    const result = await getPredictions({
      update: text,
      prompts,
      predictions,
    });
    set(isBusyAtom, false);
    set(foundKeysAtom, [...result.predictions]);
    set(maskOnInteractionAtom);
    set(maskLocationAtom, update);
    // set(sourceCitiesAtom);

  },
);
console.log("atoms", foundKeysAtom);
function guessSourceDestination(entry: string, nextKey = "") {
  const lowerEntry = entry.toLowerCase();
  const sourceFund =
    ["", "source"].includes(nextKey) &&
    sourceCities.find((it) => it.city.toLowerCase().indexOf(lowerEntry) === 0);
  if (sourceFund) {
    return ["source", entry];
  }
  const destinationFund =
    ["", "destination"].includes(nextKey) &&
    destinitionCities.find(
      (it) => it.city.toLowerCase().indexOf(lowerEntry) === 0,
    );
  if (destinationFund) {
    return ["destination", entry];
  }
}
const identifyValue = ({ prompts, foundKeys, entries, entry }) => {
  if (isNumeric(entry)) {
    return ["qty", entry];
  }
  if (["train", "road", "flight"].includes(entry)) {
    return ["mode", entry];
  }
  if ([productNames].includes(entry)) {
    return ["product", entry];
  }
  //
  if (foundKeys.length === 0) {
    return guessSourceDestination(entry);
  } else if (entries.length > foundKeys.length) {
    const sourceExist = foundKeys.find((it) => it[0] === "source");
    const destinationExist = foundKeys.find((it) => it[0] === "destination");
    if (sourceExist && destinationExist) {
      return ["product", entry];
    } else if (sourceExist && !destinationExist) {
      return guessSourceDestination(entry, "destination");
    }
    return guessSourceDestination(entry, "source");
  } else if (entries.length === foundKeys.length) {
    const updateKeys = foundKeys[foundKeys.length - 1];
    if (!["source", "destination"].includes(updateKeys[0])) {
      return [updateKeys[0], entry];
    }
    const sourceExist = foundKeys.find((it) => it[0] === "source");
    const destinationExist = foundKeys.find((it) => it[0] === "destination");
    let guessed;
    if (sourceExist && !destinationExist) {
      guessed = guessSourceDestination(entry, "destination");
    } else if (destinationExist && !sourceExist) {
      guessed = guessSourceDestination(entry, "destination");
    }
    return guessed ? guessed : [updateKeys[0], entry];
  }
};
export const maskOnInteractionAtom = atom(
  (get) => get(maskAtom),
  (get, set) => {
    const foundKeys = get(foundKeysAtom);
    const { prompts, prompts2 } = TEMPLATES[MODULE];
    let currPrompts = prompts;
    let state = localStorage.getItem("templateMode")
    if (state == "INVENTORY") {
      currPrompts = prompts2;
    }

    let maskedPrompts = currPrompts.reduce((maskList, { key }) => {
      if (!foundKeys.find(([targetKey]) => targetKey === key)) {
        maskList.push(key);
      }
      return maskList;
    }, [] as string[]);

    console.log("masked prompot", maskedPrompts)
    if (isArrayExactlyMatching(maskedPrompts)) {
      maskedPrompts = [];
    }
    set(maskAtom, maskedPrompts.join(" "));
  },
);
//utils
export function atomWithToggle(
  initialValue?: boolean,
): WritableAtom<boolean, [boolean?], void> {
  const anAtom = atom(initialValue, (get, set, nextValue?: boolean) => {
    const update = nextValue ?? !get(anAtom);
    set(anAtom, update);
  });
  return anAtom as WritableAtom<boolean, [boolean?], void>;
}
function isNumeric(str: string | number) {
  if (typeof str != "string") return false; // we only process strings!
  return (
    // @ts-expect-error use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}
function isArrayExactlyMatching(arr) {
  const expectedArray = ['source', 'destination', 'mode'];

  if (arr.length !== expectedArray.length) {
    return false;
  }

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== expectedArray[i]) {
      return false;
    }
  }

  return true;
}



//  trans-selector 
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAtom } from "jotai";
import { foundKeysAtom, isAutoCompleteVisibleAtom, isInFocusAtom, sourceCitiesAtom } from "@/components/search/atoms.ts";
import { useDebounce } from "../hooks/useDebounce";
import { useEffect } from "react";
import { getAutoComplete } from "@/lib/api";
import _ from "lodash";

//relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50
export const TransSelect = () => {
  const [isFocused] = useAtom(isInFocusAtom);
  const [autoCompleteData, setIsAutoCompleteVisible] = useAtom(isAutoCompleteVisibleAtom);
  const [cities, setSourceCities] = useAtom(sourceCitiesAtom);
  const [foundKeys] = useAtom(foundKeysAtom)
  // const debouncedFoundKeys = useDebounce(foundKeys, 300); // Adjust the debounce delay as needed
  const debouncedSearch = _.debounce((foundKeys) => {
    getAutoComplete({
      predictions: foundKeys,
    }).then(autoCompleteData =>
      setSourceCities(autoCompleteData)
    );
    console.log('API call with debounced text:', foundKeys);
  }, 300);
  useEffect(() => {
    const fetchAutoComplete = async () => {
      const [currentKey] = foundKeys.length > 0 ? foundKeys[foundKeys.length - 1] : ["", ""];
      // if (!["source", "destination"].includes(currentKey)) {
      //   setIsAutoCompleteVisible(true);
      // }

      // setIsAutoCompleteVisible(true);
      debouncedSearch(foundKeys);
      // set(baseAtom, autoCompleteData);
    }
    if (foundKeys.length > 0) {
      fetchAutoComplete();
    }
    return () => {
      debouncedSearch.cancel(); // Cancel any pending debounce call
    };

  }, [foundKeys]); // Run only on component mount and unmount

  return (isFocused && autoCompleteData &&
    <ScrollArea className="h-60 w-100 rounded-md border z-1 relative">
      <div className="p-1" style={{ width: "100%" }}>
        {cities.map((tag) => (
          <div key={tag.index} className="py-1 text-gray-400 border-b border-b-gray-300 text-xs hover:bg-accent hover:text-accent-foreground hover:cursor-pointer">
            <div >{tag.name}</div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

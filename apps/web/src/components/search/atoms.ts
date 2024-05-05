import { atom, createStore, WritableAtom } from "jotai";
import { getCanvasFont, getTextWidth } from "./utils";
import { getAutoComplete, getPredictions } from "@/lib/api.ts";


let elemtnCache: HTMLElement;
type template = { default: string; prompts: { key: string }[] };
export const APP_STORE = createStore();
export const templateAtom = atom<template | any>(null);
// base atoms
export const sourceCitiesAtom = (() => {
  const baseAtom = atom([]);
  return atom(
    (get) => get(baseAtom),
    async (get, set) => {
      const foundKeys = get(foundKeysAtom);
      const [currentKey] =
        foundKeys.length > 0 ? foundKeys[foundKeys.length - 1] : ["", ""];
      if (!["source", "destination"].includes(currentKey)) {
        set(isAutoCompleteVisibleAtom, false);
      }
      const autoCompleteData = await getAutoComplete({
        predictions: foundKeys,
      });
      set(isAutoCompleteVisibleAtom, true);
      set(baseAtom, autoCompleteData);
    },
  );
})();

export const maskAtom = atom("");

const foundKeysAtom = atom<string[][]>([]);
const baseSearchTextAtom = atom("");
const baseMaskLocationAtom = atom(0);
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
      set(sourceCitiesAtom);
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
    set(sourceCitiesAtom);
  },
);

export const maskOnInteractionAtom = atom(
  (get) => get(maskAtom),
  (get, set) => {
    const foundKeys = get(foundKeysAtom);
    const { prompts } = get(templateAtom);
    const maskedPrompts = prompts.reduce((maskList, { key }) => {
      if (!foundKeys.find(([targetKey]) => targetKey === key)) {
        maskList.push(key);
      }
      return maskList;
    }, [] as string[]);
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

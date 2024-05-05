import { sortBy } from "lodash";
import { cities } from "./db";
import { SearchInput } from "./common";
import { sourceCitiesAtom } from "trans-web/src/components/search/atoms";

const sortedCities = sortBy(cities, (it: any) => it.city);
const sourceCities = sortedCities.filter(
  (it) => !it.type || it.type === "source",
);
const destinitionCities = sortedCities.filter(
  (it) => !it.type || it.type === "destination",
);

export const customLogger = (message: string, ...rest: string[]) => {
  console.log(message, ...rest);
};
export function guessSourceDestination(entry: string, nextKey = "") {
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
export const identifyValue = ({ foundKeys, entries, entry }) => {
  if (isNumeric(entry)) {
    return ["qty", entry];
  }
  if (["train", "road"].includes(entry)) {
    return ["mode", entry];
  }
  if (["parle"].includes(entry)) {
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

function isNumeric(str: string | number) {
  if (typeof str != "string") return false; // we only process strings!
  return (
    // @ts-expect-error use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

export const searchText = ({
  update,
  prompts,
  predictions: foundKeys,
}: SearchInput) => {
  const text = update.trim();
  const entries = text.split(" ");
  if (foundKeys.length > entries.length) {
    foundKeys.length = entries.length;
  }
  const nextFoundkey = foundKeys.length;
  const entry =
    entries[nextFoundkey === entries.length ? nextFoundkey - 1 : nextFoundkey];
  const key = identifyValue({ prompts, foundKeys, entries, entry })!;
  if (nextFoundkey !== entries.length) {
    key && foundKeys.push(key);
  } else {
    const found = foundKeys.find((it: any[]) => it[0] === key[0]);
    if (found) {
      found[1] = key[1];
    } else {
      foundKeys.pop();
      foundKeys.push(key);
    }
  }
  return foundKeys;
};

export const getSourceCities = ({ predictions: foundKeys }: SearchInput) => {
  const [currentKey, currentVal] =
    foundKeys.length > 0 ? foundKeys[foundKeys.length - 1] : ["", ""];
  const cities = currentKey === "source" ? sourceCities : destinitionCities;
  console.log(currentKey, currentVal);
  return cities.filter(
    (it) => it.city.toLowerCase().indexOf(currentVal.toLowerCase()) === 0,
  );
};

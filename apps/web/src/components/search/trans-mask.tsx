import { styled } from "@/stitches";
import { cn } from "@/lib/utils.ts";
import { Spinner } from "@/components/ui/spinner.tsx";
import { useAtom } from "jotai";
import {
  maskLocationAtom,
  maskOnInteractionAtom,
} from "@/components/search/atoms.ts";

const StyledSpan = styled("div", {
  position: "relative",
  top: 40,
  color: "#ababab",
  pointerEvents: "none",
  zIndex: -1,
  display: "flex",
  justifyContent: "space-between",
});

const StyledSpnnerDiv = styled("span", {
  position: "relative",
  color: "#ababab",
  pointerEvents: "none",
  zIndex: -1,
  top: 7,
});

export const TransMask = () => {
  const [mask] = useAtom(maskOnInteractionAtom);
  const [location] = useAtom(maskLocationAtom);
  return (
    <StyledSpan
      className={cn("px-3 py-2 ")}
      css={{
        left: location,
      }}
    >
      <span>{mask} </span>
      <StyledSpnnerDiv>
        <Spinner size="small" show={true} />
      </StyledSpnnerDiv>
    </StyledSpan>
  );
};

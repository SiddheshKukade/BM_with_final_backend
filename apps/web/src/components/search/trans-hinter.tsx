import { styled } from "@/stitches";
import React, { FC } from "react";

const StyledSpan = styled("span", {
  position: "relative",
  top: 28,
  left: 5,
  color: "$gray400",
});

export const TransHint: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <StyledSpan>{children}</StyledSpan>;
};

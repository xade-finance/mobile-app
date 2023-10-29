import * as React from "react";
import Svg, { Path } from "react-native-svg";
const TradeSvg = (props) => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M7.50002 18.3333H12.5C16.6667 18.3333 18.3334 16.6667 18.3334 12.5V7.5C18.3334 3.33334 16.6667 1.66667 12.5 1.66667H7.50002C3.33335 1.66667 1.66669 3.33334 1.66669 7.5V12.5C1.66669 16.6667 3.33335 18.3333 7.50002 18.3333Z"
      stroke="white"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6.10834 12.075L8.09167 9.5C8.375 9.13334 8.9 9.06667 9.26667 9.35L10.7917 10.55C11.1583 10.8333 11.6833 10.7667 11.9667 10.4083L13.8917 7.925"
      stroke="white"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default TradeSvg;

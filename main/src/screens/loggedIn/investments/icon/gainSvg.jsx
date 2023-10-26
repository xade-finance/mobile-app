import * as React from "react";
import Svg, { Path } from "react-native-svg";
const GainSvg = (props) => (
  <Svg
    width={18}
    height={18}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M4.84376 4.24264L13.329 4.24264L13.329 12.7279"
      stroke="#ADFF6C"
      strokeWidth={2}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4.24243 13.3288L13.1541 4.41715"
      stroke="#ADFF6C"
      strokeWidth={2}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default GainSvg;

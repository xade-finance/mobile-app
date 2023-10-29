import * as React from "react"
import Svg, { Defs, G, Path, RadialGradient, Rect, Stop } from "react-native-svg";
const ChipSvg = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={33}
    height={22}
    fill="none"
    {...props}
  >
    <Rect
      width={32.001}
      height={21.334}
      x={0.364}
      y={0.412}
      fill="url(#a)"
      rx={5}
    />
    <Path
      stroke="#C7C7B6"
      strokeLinejoin="bevel"
      strokeWidth={1.3}
      d="M16.365.624 12.809 6.2s1.422 4.879 0 9.06l3.556 6.272 3.555-6.272s-1.422-3.484 0-9.06L16.365.624Z"
      clipRule="evenodd"
    />
    <Path
      stroke="#C7C7B6"
      strokeLinejoin="bevel"
      strokeWidth={1.3}
      d="M.364 6.455H12.81M19.564 6.455h12.8M.364 14.989H12.81M19.564 14.989h12.8"
    />
    <Defs>
      <RadialGradient
        id="a"
        cx={0}
        cy={0}
        r={1}
        gradientTransform="rotate(141.302 7.934 7.382) scale(21.6927 21.5282)"
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#fff" />
        <Stop offset={1} stopColor="#DDDCDA" />
      </RadialGradient>
    </Defs>
  </Svg>
)
export default ChipSvg

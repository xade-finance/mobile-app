import * as React from "react"
import Svg, { Path } from "react-native-svg"
const ChangeSVG = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path stroke="#F1F1F1" strokeWidth={2} d="m9 6 6 6-6 6" />
  </Svg>
)
export default ChangeSVG;
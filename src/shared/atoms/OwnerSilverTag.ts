import styled from "@emotion/styled";
import {Tag} from "antd/es";

export default styled(Tag)`
  color: #ffffff;
  background: radial-gradient(
      ellipse farthest-corner at right bottom,
      #d3d3d3 0%,
      #c0c0c0 8%,
      #a9a9a9 30%,
      #808080 40%,
      transparent 80%
    ),
    radial-gradient(
      ellipse farthest-corner at left top,
      #ffffff 0%,
      #f0f0f0 8%,
      #d3d3d3 25%,
      #808080 62.5%,
      #808080 100%
    );
`;

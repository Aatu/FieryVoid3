import * as React from "react";

type Props = {
  color?: string;
  size?: string;
};

const Pivot: React.FC<Props> = ({ color = "#fff", size = "100%" }) => {
  return (
    <svg
      id="pivot"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 511.612 511.612"
    >
      <path
        id="svg-path"
        d="M433.822,126.876l-113.28-113.28c-18.048-18.112-49.632-18.144-67.744,0c-18.752,18.752-18.752,49.312,0,68.064 l29.984,29.952h-18.976c-110.272,0-200,89.728-200,200s89.728,200,200,200h8c8.832,0,16-7.168,16-16v-64c0-8.832-7.168-16-16-16 h-8c-57.344,0-104-46.656-104-104s46.656-104,104-104h21.216l-32.224,32.192c-18.752,18.784-18.752,49.312,0,68.064 c17.984,17.952,50.304,17.536,67.744,0l113.312-113.28c8.864-8.896,13.952-21.152,13.952-33.696 C447.806,148.444,442.974,136.476,433.822,126.876z"
        fill={color}
      />
    </svg>
  );
};

export default Pivot;

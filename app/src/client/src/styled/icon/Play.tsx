import React from "react";

type Props = {
  color?: string;
  size?: string;
};

const Play: React.FC<Props> = ({ color = "#fff", size = "100%" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 373.008 373.008"
    >
      <path
        d="M61.792 2.588A19.258 19.258 0 0171.444 0c3.33 0 6.663.864 9.655 2.588l230.116 167.2a19.327 19.327 0 019.656 16.719 19.293 19.293 0 01-9.656 16.713L81.099 370.427a19.336 19.336 0 01-19.302 0 19.333 19.333 0 01-9.66-16.724V19.305a19.308 19.308 0 019.655-16.717z"
        fill={color}
      ></path>
    </svg>
  );
};

export default Play;

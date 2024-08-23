import React, { useState } from "react";
import styled from "styled-components";
import PlayerSettingsForm from "./PlayerSettingsForm";
import { Clickable, ContainerRoundedRightBottom } from "../../../../styled";
import { ClickableProps } from "../../../../styled/Clickable";

const MainButton = styled(ContainerRoundedRightBottom)<ClickableProps>`
  width: 50px;
  height: 50px;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 46px;
  padding-left: 5px;
  border-right: none;
  border-top: none;

  ${Clickable}
`;

const PlayerSettings: React.FC = (props) => {
  const [open, setOpen] = useState<boolean>(false);

  if (open) {
    return <MainButton onClick={() => setOpen(true)}>⚙</MainButton>;
  }

  return <PlayerSettingsForm close={() => setOpen(false)} {...props} />;
};

export default PlayerSettings;

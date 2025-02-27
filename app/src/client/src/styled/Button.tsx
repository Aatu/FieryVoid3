import styled, { css } from "styled-components";
import React, { MouseEventHandler } from "react";
import { TooltipButton, TooltipButtonProps } from "./Tooltip";
import { X } from "./icon";

const text = css`
  display: inline;
  border: none;
  background-color: transparent;
  color: #deebff;

  &:hover,
  &:active {
    text-shadow: white 0 0 10px, white 0 0 3px;
    opacity: 2;
    color: #deebff;
  }
`;

const greyButton = css`
  background-color: #222;
  padding: 5px 0px;
  color: white;
  text-decoration: none;
  font-family: arial;
  font-size: 12px;
  text-transform: uppercase;
  display: flex;
  border: none;
  margin: 3px 8px 0px 8px;
  flex-grow: 1;
  flex-basis: calc(50% - 16px);

  justify-content: center;

  &:hover,
  &:active {
    background-color: #deebff;
    color: black;
    text-decoration: none;
  }
`;

const iconStyle = css`
  display: flex;
  border: 0;
  padding: 3px;
  font-weight: bold;
  font-size: 16px;
  background-color: transparent;

  &:hover,
  &:active {
    color: #0a3340;
  }
`;

const button = css`
  display: flex;
  text-transform: uppercase;
  color: #0a3340;
  border: 1px solid black;
  background-color: #6792ce;
  max-width: 240px;
  justify-content: center;
  box-shadow: 2px 3px 5px 2px rgba(0, 0, 0, 0.5);
  border-radius: 1px;
  padding: 3px;
  font-weight: bold;
  font-size: 16px;

  &:hover,
  &:active {
    box-shadow: 0px 0px 3px 3px rgba(222, 235, 255, 0.5);
    color: #0a3340;
    background-color: #deebff;
  }
`;

const IconContainer = styled.div`
  width: 25px;
  height: 25px;
`;

type ButtonContainerProps = {
  icon?: unknown;
  $buttonstyle?: string;
};

const ButtonContainer = styled.button<ButtonContainerProps>`
  display: flex;
  cursor: pointer;
  position: relative;
  margin: 3px 5px;

  ${(props) => {
    if (props.icon) {
      return iconStyle;
    }
    switch (props.$buttonstyle) {
      case "text":
        return text;
      case "button-grey":
        return greyButton;
      default:
        return button;
    }
  }}
`;

export type ButtonProps = {
  IconComponent?: React.FC<{ color?: string }>;
  buttonstyle?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = ({
  IconComponent,
  buttonstyle,
  onClick,
  children,
  className,
}) => (
  <ButtonContainer
    className={className}
    icon={IconComponent || undefined}
    $buttonstyle={buttonstyle}
    onClick={onClick}
  >
    {IconComponent && (
      <IconContainer>
        <IconComponent color="#deebff" />
      </IconContainer>
    )}
    {children}
  </ButtonContainer>
);

const CloseButtonContainer = styled(TooltipButton)`
  height: 10px;
  width: 10px;
  padding: 0;
  margin-left: 5px;

  & svg {
    width: 100%;
    height: 100%;
  }
`;

export const CloseButton: React.FC<TooltipButtonProps> = (props) => {
  return (
    <CloseButtonContainer {...props}>
      <X />
    </CloseButtonContainer>
  );
};

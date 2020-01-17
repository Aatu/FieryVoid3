import styled, { css } from "styled-components";
import React from "react";

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
  flex-grow: 1;
  flex-basis: 100%;
  border: none;
  margin: 0;

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

const ButtonContainer = styled.button`
  display: flex;
  cursor: pointer;
  position: relative;
  margin: 3px 5px;

  ${props => {
    if (props.icon) {
      return iconStyle;
    }
    switch (props.buttonStyle) {
      case "text":
        return text;
      case "button-grey":
        return greyButton;
      default:
        return button;
    }
  }}
`;

const Button = props => (
  <ButtonContainer {...props}>
    {props.icon && (
      <IconContainer>
        <props.icon color="#deebff" />
      </IconContainer>
    )}
    {props.children}
  </ButtonContainer>
);

export { Button };

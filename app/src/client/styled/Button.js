import styled, { css } from "styled-components";

const text = css`
  display: inline;
  border: none;
  background-color: transparent;

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
  width: 240px;
  color: white;
  text-decoration: none;
  font-family: arial;
  font-size: 12px;
  text-transform: uppercase;
  display: flex;
  border: none;
  margin: 0 10px;

  justify-content: center;

  &:hover,
  &:active {
    background-color: #deebff;
    color: black;
    text-decoration: none;
  }
`;

const button = css`
  display: flex;
  text-transform: uppercase;
  color: #deebff;
  border: 1px solid #496791;
  background-color: #6792ce;
  max-width: 240px;
  justify-content: center;
  box-shadow: 2px 3px 5px 2px rgba(0, 0, 0, 0.5);
  border-radius: 5px;
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

const Button = styled.button`
  cursor: pointer;

  ${props => {
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

export { Button };

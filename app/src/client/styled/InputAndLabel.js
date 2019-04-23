import * as React from "react";
import styled from "styled-components";
import { Section } from ".";
import { Error } from "./Error";

class InputAndLabel extends React.Component {
  render() {
    const {
      id,
      label,
      type,
      value,
      placeholder,
      onKeyDown,
      onChange,
      error,
      ...rest
    } = this.props;

    return (
      <Container>
        <Section>
          {label && <Label htmlFor={id}>{label}</Label>}
          <Input
            id={id}
            type={type || "text"}
            value={value}
            placeholder={placeholder}
            onKeyDown={onKeyDown}
            onChange={onChange}
            tabIndex="0"
            {...rest}
          />
        </Section>
        <Error>{error}</Error>
      </Container>
    );
  }
}

const Container = styled.div`
  display: flex;
  padding: 10px;
  flex-direction: column;
  flex-grow: 1;
  max-width: calc(50% - 20px);
`;

const Label = styled.span`
  display: flex;
  width: calc(50% - 10px);
  max-width: 300px;
  color: #deebff;
  font-family: arial;
  font-size: 14px;
  align-items: center;
`;

const Input = styled.input`
  width: calc(50% - 10px);
  color: #0a3340;
  background-color: white;
  padding: 3px 6px;
  font-size: 14px;
  border: 1px solid #04161c;
  border-radius: 3px;
`;

export { InputAndLabel };

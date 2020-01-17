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
  flex-direction: column;
  flex-grow: 1;
  flex-basis: 100%;
  margin: 5px 0 5px 0;

  margin-left: 10px;
  margin-right: 10px;

  &:last-child {
    margin-right: 0px;
  }

  &:first-child {
    margin-left: 0px;
  }
`;

const Label = styled.span`
  display: flex;
  flex-grow: 1;
  flex-basis: 100%;
  max-width: 300px;
  color: #deebff;
  align-items: center;
  margin-right: 10px;
`;

const Input = styled.input`
  flex-grow: 1;
  flex-basis: 100%;
  color: #0a3340;
  background-color: white;
  padding: 3px 6px;
  border: 1px solid #04161c;
  border-radius: 3px;
`;

export { InputAndLabel };

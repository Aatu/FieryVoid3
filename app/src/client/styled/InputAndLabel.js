import * as React from "react";
import styled from "styled-components";
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
        <SubContainer>
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
        </SubContainer>
        <Error>{error}</Error>
      </Container>
    );
  }
}

const Container = styled.div`
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  flex-grow: 1;
  margin: 5px 0px;
`;

const SubContainer = styled.div`
  position: relative;
  display: flex;
  flex: 1 1 100%;
  margin: 0;
  padding: 0;
  flex-wrap: wrap;
  align-items: center;
`;

const Label = styled.div`
  display: flex;
  max-width: 300px;
  color: #deebff;
  align-items: center;
  padding: 4px 10px 4px 0;
`;

const Input = styled.input`
  display: flex;
  color: #0a3340;
  background-color: white;
  padding: 3px 6px;
  border: 1px solid #04161c;
  border-radius: 3px;
  width: calc(70% - 12px);
  height: 16px;

  min-width: 150px;
  max-width: 100%;
  flex-grow: 1;
`;

export { InputAndLabel };

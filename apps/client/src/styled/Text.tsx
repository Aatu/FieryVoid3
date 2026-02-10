import styled from "styled-components";
import { lightBlue } from "./Colors";

const Paragraph = styled.p`
  font-family: arial;
  font-size: 12px;
  color: #deebff;
  padding: 10px;
`;

const Label = styled.span`
  font-family: arial;
  font-size: 12px;
  color: white;
`;

const Value = styled.span`
  color: ${lightBlue};
  padding: 0;
  margin: 0;
  padding-left: 5px;
`;

export { Paragraph, Label, Value };

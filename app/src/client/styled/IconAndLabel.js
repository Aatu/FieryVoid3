import styled from "styled-components";

const IconAndLabel = styled.div`
  position: relative;
  box-sizing: border-box;
  width: 30px;
  height: 30px;

  background-color: "transparent";
  background-image: ${props => `url(${props.background})`};
  background-size: cover;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  font-family: arial;
  font-size: 10px;
`;

export default IconAndLabel;

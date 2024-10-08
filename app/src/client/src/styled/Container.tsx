import styled, { css } from "styled-components";
import { darkBlue } from "./Colors";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #496791;
  color: #deebff;
  background-color: #0a3340;
  font-family: arial;
  margin-bottom: 10px;

  :last-child {
    margin-bottom: 0;
  }
`;

const Backdrop = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 99999;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ContainerRoundedRightBottom = styled(Container)`
  border-radius: 0px 0px 30px 0px;
  box-shadow: 5px 5px 10px black;
`;

const ContainerRounded = styled(Container)`
  border-radius: 0px 0px 30px 30px;
  box-shadow: 5px 5px 10px black;
`;

const ContainerRoundedRightSide = styled(Container)`
  border-radius: 30px 0px 0px 30px;
  box-shadow: 5px 5px 10px black;
`;

const defaultPadding = css`
  padding: 10px;
`;

const defaultWidth = css`
  width: 500px;
`;

const DarkContainer = styled(Container)`
  ${defaultPadding};
  background-color: ${darkBlue};
`;

const Section = styled.div`
  display: flex;
  margin: 0;
  padding: 0;
  flex-wrap: wrap;
`;

const SectionRight = styled(Section)`
  flex-grow: 1;
  justify-content: flex-end;
`;

const Cell50 = styled.div`
  display: flex;
  margin: 0;
  flex-grow: 1;
  flex-basis: calc(50% - 16px);
`;

export {
  Cell50,
  Container,
  ContainerRoundedRightBottom,
  Backdrop,
  ContainerRounded,
  ContainerRoundedRightSide,
  defaultPadding,
  DarkContainer,
  Section,
  SectionRight,
  defaultWidth,
};

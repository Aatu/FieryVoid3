import styled, { css } from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #496791;
  color: #deebff;
  background-color: #0a3340;
  font-family: arial;
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
  border-radius: 0px 0px 0px 30px;
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

const PanelContainer = styled(Container)`
  ${defaultPadding}
  ${defaultWidth}
  border-radius: 5px;
  margin: 30px auto;
`;

const Section = styled.div`
  display: flex;
  margin: 0;
  padding: 0;
`;

export {
  Container,
  ContainerRoundedRightBottom,
  Backdrop,
  ContainerRounded,
  ContainerRoundedRightSide,
  defaultPadding,
  PanelContainer,
  Section
};

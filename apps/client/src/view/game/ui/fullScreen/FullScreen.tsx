import * as React from "react";
import styled from "styled-components";
import { Clickable, ContainerRounded } from "../../../../styled";
import { ClickableProps } from "../../../../styled/Clickable";

const MainButton = styled(ContainerRounded)<ClickableProps>`
  width: 50px;
  height: 50px;
  position: fixed;
  right: 60px;
  top: 0;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  border-top: none;
  ${Clickable}
`;

const FullScreen: React.FC = () => {
  const fullScreen = React.useCallback(() => {
    /*
        if (! document.fullscreenElement ) {
            var doc = window.document;
            var docEl = doc.documentElement;
        
            var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
            requestFullScreen.call(docEl);
        }
        */

    const doc = window.document;
    const docEl = doc.documentElement;

    const requestFullScreen =
      docEl.requestFullscreen ||
      // @ts-expect-error ignore
      docEl.mozRequestFullScreen ||
      // @ts-expect-error ignore
      docEl.webkitRequestFullScreen ||
      // @ts-expect-error ignore
      docEl.msRequestFullscreen;

    const cancelFullScreen =
      doc.exitFullscreen ||
      // @ts-expect-error ignore
      doc.mozCancelFullScreen ||
      // @ts-expect-error ignore
      doc.webkitExitFullscreen ||
      // @ts-expect-error ignore
      doc.msExitFullscreen;

    if (
      !doc.fullscreenElement &&
      // @ts-expect-error ignore
      !doc.mozFullScreenElement &&
      // @ts-expect-error ignore
      !doc.webkitFullscreenElement &&
      // @ts-expect-error ignore
      !doc.msFullscreenElement
    ) {
      requestFullScreen.call(docEl);
    } else {
      cancelFullScreen.call(doc);
    }
  }, []);

  return <MainButton onClick={fullScreen}>FS</MainButton>;
};

export default FullScreen;

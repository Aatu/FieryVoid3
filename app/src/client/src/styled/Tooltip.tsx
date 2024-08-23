import React, { ReactNode } from "react";
import styled, { css } from "styled-components";
import { colors } from "./index";
import { tooltipButtonColor } from "./Colors";
import {
  SystemMessage,
  SystemMessageValue,
} from "@fieryvoid3/model/src/unit/system/strategy/types/SystemHandlersTypes";

const TooltipContainer = styled.div`
  display: flex;
  flex-direction: column;
  opacity: 0.95;
  text-align: center;
  font-family: arial;
  font-size: 12px;
  color: white;
  background-color: black;
  border-radius: 7px;
  padding: 3px 8px 8px 8px;
  border: 1px solid #121212;
  filter: brightness(1);
  cursor: initial;
`;

const Tooltip = styled(TooltipContainer)`
  z-index: 7001;
  position: absolute;
`;

type RelativeTooltipContainerProps = {
  position: Record<string, string | number>;
};

const RelativeTooltipContainer = styled(Tooltip)<RelativeTooltipContainerProps>`
  position: absolute;
  z-index: 20000;
  ${(props) =>
    Object.keys(props.position).reduce((style, key) => {
      return style + "\n" + key + ":" + props.position[key] + "px;";
    }, "")}
  text-align: left;
  filter: brightness(1);
`;

const TooltipValue = styled.div`
  color: ${colors.lightBlue};
`;

type RelativeTooltipProps = {
  children: React.ReactNode;
  element: HTMLElement;
};

export const RelativeTooltip: React.FC<RelativeTooltipProps> = ({
  children,
  element,
  ...rest
}) => {
  const getPosition = (element: HTMLElement) => {
    const boundingBox = element.getBoundingClientRect();

    const position: Record<string, number | string> = {};

    if (boundingBox.top > window.innerHeight / 2) {
      position.bottom = 32;
    } else {
      position.top = 32;
    }

    if (boundingBox.left > window.innerWidth / 2) {
      position.right = 0;
    } else {
      position.left = 0;
    }

    return position;
  };

  return (
    <RelativeTooltipContainer position={getPosition(element)} {...rest}>
      {children}
    </RelativeTooltipContainer>
  );
};

const TooltipHeader = styled.div`
  display: flex;
  justify-content: space-between;
  text-transform: uppercase;
  border-bottom: 1px solid #aaaaaa;
  width: calc(100% - 16px);
  margin: 5px 8px;
  font-weight: bold;
  font-size: 12px;
`;

const TooltipSubHeader = styled.div`
  display: flex;
  border-bottom: 1px solid #aaaaaa;
  width: calc(100% - 16px);
  margin: 5px 8px;
  font-weight: bold;
  font-size: 12px;
  color: white;
`;

const TooltipValueHeader = styled.div`
  padding-right: 5px;
  color: white;
`;

type TooltipEntryProps = {
  noMargin?: boolean;
  important?: boolean;
  space?: boolean;
  clickable?: boolean;
};

const TooltipEntry = styled.div<TooltipEntryProps>`
  display: flex;
  box-sizing: border-box;
  margin: 2px 8px;

  ${(props) => props.noMargin && "margin: 0;"}
  font-weight: ${(props) => (props.important ? "bold" : "inherit")};
  font-size: ${(props) => (props.important ? "14px" : "11px")};
  ${(props) => props.space && "margin-top: 14px"};
  text-align: left;
  color: #5e85bc;
  font-family: arial;

  ${(props) =>
    props.clickable &&
    css`
      cursor: pointer;
      color: white;
      background-color: ${tooltipButtonColor};
      border: 1px solid black;
    `}

  &:hover {
    ${(props) =>
      props.clickable &&
      css`
        border: 1px solid white;
      `}
  }
`;

const CenteredTooltipEntry = styled(TooltipEntry)`
  justify-content: center;
  ${TooltipValueHeader} {
    padding-right: 0;
  }
`;

const InlineTooltipEntry = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const TooltipMenu = styled.div`
  margin: 0 8px;
  display: flex;
`;

const selectedTooltipButton = css`
  filter: brightness(5) grayscale(100%);
  opacity: 1;
`;

const disabledTooltipButton = css`
  filter: brightness(0.25) grayscale(100%);
`;

const hoverTooltipButton = css`
  opacity: 1;
  filter: brightness(5) grayscale(100%);
`;

export type TooltipButtonProps = {
  img?: string;
  selected?: boolean;
  disabled?: boolean;
};

const TooltipButton = styled.button<TooltipButtonProps>`
  border: none;
  width: 40px;
  height: 40px;
  background-color: transparent;
  margin: 0;
  cursor: pointer;
  ${(props) => props.img && `background-image: url(${props.img});`}
  background-size: cover;
  opacity: 0.5;
  filter: brightness(3) grayscale(100%);

  ${(props) => props.selected && !props.disabled && selectedTooltipButton}

  ${(props) => props.disabled && disabledTooltipButton}

  &:hover {
    ${(props) => !props.disabled && hoverTooltipButton}
  }

  &:focus {
    outline: 0;
  }

  svg #svg-path {
    fill: white;
    ${(props) => props.disabled && "fill:#ff0000;"}
  }
`;

const sortEntries = (entries: SystemMessage[]) =>
  entries.sort((a, b) => {
    const aSort = a.sort ?? 0;
    const bSort = b.sort ?? 0;

    if (!a.sort && b.sort) {
      return 1;
    }

    if (a.sort && !b.sort) {
      return -1;
    }

    if (aSort > bSort) {
      return 1;
    }

    if (aSort < bSort) {
      return -1;
    }

    return 0;
  });

export type TooltipComponentRenderer = (
  component: string,
  props: Record<string, unknown>,
  key?: string
) => ReactNode;

type TooltipBuilderEntryProps = {
  value?: SystemMessageValue;
  header?: string;
  component?: string;
  props?: Record<string, unknown>;
  componentRenderer?: TooltipComponentRenderer;
  noMargin?: boolean;
  subKey?: string;
  index?: number;
};

const TooltipBuilderEntry: React.FC<TooltipBuilderEntryProps> = ({
  value,
  header,
  component,
  props,
  componentRenderer,
  noMargin = false,
  subKey = "",
  index,
}) => {
  const isValue = (value?: SystemMessageValue) =>
    value !== undefined && value !== null;

  if (value && typeof value === "string") {
    value = (value as string).replace(/<br>/gm, "\n");
  }

  if (component && componentRenderer) {
    const objectProps = typeof props === "object" ? props : {};

    return (
      <>{componentRenderer(component, objectProps, subKey + "-" + index)}</>
    );
  }

  return (
    <TooltipEntry noMargin={subKey !== "" || noMargin}>
      {header && <TooltipValueHeader>{header}: </TooltipValueHeader>}
      {isValue(value) && Array.isArray(value) && (
        <InlineTooltipEntry>
          <TooltipBuilder
            entries={value}
            componentRenderer={componentRenderer}
            subKey={subKey + "-" + index}
            noMargin={noMargin}
          />
        </InlineTooltipEntry>
      )}
      {isValue(value) && !Array.isArray(value) && (
        <TooltipValue>{value}</TooltipValue>
      )}
    </TooltipEntry>
  );
};

type TooltipBuilderProps = {
  entries: SystemMessage[];
  componentRenderer?: TooltipComponentRenderer;
  subKey?: string;
  noMargin?: boolean;
};

const TooltipBuilder: React.FC<TooltipBuilderProps> = ({
  entries,
  componentRenderer,
  subKey,
  noMargin,
}) => {
  return (
    <>
      {sortEntries(entries).map(
        ({ value, header, component, props }, index) => {
          return (
            <TooltipBuilderEntry
              key={`shiptoolitip-${index}-${subKey}`}
              value={value}
              header={header}
              component={component}
              props={props as Record<string, unknown>}
              componentRenderer={componentRenderer || undefined}
              noMargin={noMargin}
              subKey={subKey}
              index={index}
            />
          );
        }
      )}
    </>
  );
};

/*
const buildTooltipEntries = (
  entries: SystemMessage[],
  ComponentWrapper: React.FC<
    { component: string } & Record<string, unknown>
  > | null = null,
  subKey = "",
  noMargin = false
) => {
  return entries
    .sort((a, b) => {
      const aSort = a.sort ?? 0;
      const bSort = b.sort ?? 0;

      if (!a.sort && b.sort) {
        return 1;
      }

      if (a.sort && !b.sort) {
        return -1;
      }

      if (aSort > bSort) {
        return 1;
      }

      if (aSort < bSort) {
        return -1;
      }

      return 0;
    })
    .map(({ value, header, component, props }, index) => {
      const isValue = (value: SystemMessageValue) =>
        value !== undefined && value !== null;

      if (value && typeof value === "string") {
        value = (value as string).replace(/<br>/gm, "\n");
      }

      if (component && ComponentWrapper) {
        const objectProps = typeof props === "object" ? props : {};

        return (
          <ComponentWrapper
            component={component}
            key={`shiptoolitip-${index}-${subKey}`}
            {...objectProps}
          />
        );
      }

      return (
        <TooltipEntry
          noMargin={subKey !== "" || noMargin}
          key={`shiptoolitip-${index}-${subKey}`}
        >
          {header && <TooltipValueHeader>{header}: </TooltipValueHeader>}
          {isValue(value) && Array.isArray(value) && (
            <InlineTooltipEntry>
              {buildTooltipEntries(
                value,
                ComponentWrapper,
                subKey + "-" + index
              )}
            </InlineTooltipEntry>
          )}
          {isValue(value) && !Array.isArray(value) && (
            <TooltipValue>{value}</TooltipValue>
          )}
        </TooltipEntry>
      );
    });
};
*/

type SystemTooltipProps = {
  right?: boolean;
  tab?: boolean;
};

const SystemTooltip = styled(Tooltip)<SystemTooltipProps>`
  top: 0px;

  ${(props) => (props.right ? "right: 340px;" : "left: 340px;")}

  width: 202px;

  ${(props) => props.tab && "width: 302px;"}
  transition: width 0.25s;
  transition-timing-function: ease-in-out;
`;

const RelativeOrStaticTooltip: React.FC<{
  relative?: boolean;
  children?: ReactNode;
  element?: HTMLElement;
  right?: boolean;
}> = ({ relative, children, element, ...rest }) => {
  if (relative && element) {
    return (
      <RelativeTooltip element={element} {...rest}>
        {children}
      </RelativeTooltip>
    );
  }

  return <SystemTooltip {...rest}>{children}</SystemTooltip>;
};

export {
  TooltipBuilder,
  TooltipContainer,
  Tooltip,
  TooltipHeader,
  TooltipEntry,
  TooltipMenu,
  TooltipButton,
  TooltipSubHeader,
  TooltipValue,
  TooltipValueHeader,
  InlineTooltipEntry,
  CenteredTooltipEntry,
  RelativeOrStaticTooltip,
};

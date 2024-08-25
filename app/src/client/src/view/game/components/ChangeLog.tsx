import React from "react";
import styled from "styled-components";
import data from "../../../../changeLog.json";
import {
  TooltipHeader,
  TooltipEntry,
  TooltipValueHeader,
  TooltipValue,
} from "../../../styled";

const Version = styled.div`
  margin-bottom: 8px;
`;

const HeaderEntry = styled(TooltipEntry)`
  ${TooltipValueHeader} {
    margin-left: 8px;
  }

  ${TooltipValueHeader}:first-of-type {
    margin-left: 0px;
  }
`;

const List = styled.ul`
  li {
    text-align: initial;
    font-size: 11px;
  }
`;

export const ChangeLog: React.FC<{ full?: boolean }> = ({ full = false }) => {
  return (
    <>
      <TooltipHeader>{full ? "Change Log" : "Latest changes"} </TooltipHeader>
      {data.map(({ version, released, entries }) => {
        return (
          <Version key={version}>
            <HeaderEntry>
              <TooltipValueHeader>Version </TooltipValueHeader>
              <TooltipValue>{version}</TooltipValue>

              <TooltipValueHeader>Released </TooltipValueHeader>
              <TooltipValue>{released}</TooltipValue>
            </HeaderEntry>
            <List>
              {entries.map((entry, i) => {
                return <li key={`changeLog-${version}-${i}`}>{entry}</li>;
              })}
            </List>
          </Version>
        );
      })}
    </>
  );
};

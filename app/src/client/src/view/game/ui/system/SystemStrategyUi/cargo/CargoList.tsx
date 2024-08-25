import React from "react";
import styled from "styled-components";
import { TooltipSubHeader } from "../../../../../../styled";
import CargoItem from "./CargoItem";
import { CargoEntry } from "@fieryvoid3/model/src/cargo/CargoService";

const CargoListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export type CargoListProps = {
  list: CargoEntry[];
};

const CargoList: React.FC<CargoListProps> = ({ list }) => {
  return (
    <>
      <TooltipSubHeader>Current cargo</TooltipSubHeader>
      <CargoListContainer>
        {list.map(({ object, amount }, i) => (
          <CargoItem key={`cargo-item-${i}`} cargo={object} amount={amount} />
        ))}
      </CargoListContainer>
    </>
  );
};

export default CargoList;

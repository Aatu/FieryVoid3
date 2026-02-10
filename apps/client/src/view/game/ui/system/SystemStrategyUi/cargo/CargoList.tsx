import React from "react";
import styled from "styled-components";
import { TooltipSubHeader } from "../../../../../../styled";
import CargoItem from "./CargoItem";
import CargoEntity from "@fieryvoid3/model/src/cargo/CargoEntity";

const CargoListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export type CargoListProps = {
  list: {object: CargoEntity; amount: number}[];
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

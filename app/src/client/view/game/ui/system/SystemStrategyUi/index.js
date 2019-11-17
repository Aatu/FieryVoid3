import React from "react";
import CargoList from "./cargo/CargoList";

class SystemStrategyUi extends React.Component {
  render() {
    const { uiState, system } = this.props;

    return (
      <>
        {system
          .callHandler("getUiComponents", null, [])
          .map(({ name, props }, i) => {
            switch (name) {
              case "CargoList":
                return (
                  <CargoList key={`cargo-item-${name}-index-${i}`} {...props} />
                );
            }
          })}
      </>
    );
  }
}

export default SystemStrategyUi;

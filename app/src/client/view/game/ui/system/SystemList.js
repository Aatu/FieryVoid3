import * as React from "react";
import SystemIcon from "./SystemIcon";

class SystemList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { ship, uiState, systems, ...rest } = this.props;

    if (!ship) {
      return null;
    }

    return systems.map(system => (
      <SystemIcon
        uiState={uiState}
        key={`system-list-${system.id}`}
        system={system}
        ship={ship}
        {...rest}
      />
    ));
  }
}

export default SystemList;

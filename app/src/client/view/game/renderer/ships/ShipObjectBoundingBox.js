import {
  FrontSection,
  PrimarySection,
  AftSection,
  StarboardFrontSection,
  PortFrontSection,
  StarboardAftSection,
  PortAftSection,
} from "../../../../../model/unit/system/systemSection/index.mjs";
import Vector from "../../../../../model/utils/Vector.mjs";

class ShipObjectBoundingBox {
  constructor(ship) {
    this.ship = ship;
  }

  init(dimensions) {
    this.dimensions = dimensions;
  }

  getAmountOfVerticalSections() {
    let amount = 1;

    if (this.ship.systems.sections.hasFrontSectionWithStructure()) {
      amount++;
    }

    if (this.ship.systems.sections.hasAftSectionWithStructure()) {
      amount++;
    }

    return amount;
  }

  getAmountOfHorizontalSections(section) {
    let amount = 1;

    if (section instanceof FrontSection) {
      if (this.ship.systems.sections.hasStarboardFrontSectionWithStructure()) {
        amount++;
      }

      if (this.ship.systems.sections.hasPortFrontSectionWithStructure()) {
        amount++;
      }

      return amount;
    } else if (section instanceof PrimarySection) {
      return 1;
    } else if (section instanceof AftSection) {
      if (this.ship.systems.sections.hasStarboardAftSectionWithStructure()) {
        amount++;
      }

      if (this.ship.systems.sections.hasPortAftSectionWithStructure()) {
        amount++;
      }

      return amount;
    } else if (section instanceof PortFrontSection) {
      if (this.ship.systems.sections.hasStarboardFrontSectionWithStructure()) {
        amount++;
      }

      if (this.ship.systems.sections.hasFrontSectionWithStructure()) {
        amount++;
      }

      return amount;
    } else if (section instanceof StarboardFrontSection) {
      if (this.ship.systems.sections.hasPortFrontSectionWithStructure()) {
        amount++;
      }

      if (this.ship.systems.sections.hasFrontSectionWithStructure()) {
        amount++;
      }

      return amount;
    } else if (section instanceof PortAftSection) {
      if (this.ship.systems.sections.hasStarboardAftSectionWithStructure()) {
        amount++;
      }

      if (this.ship.systems.sections.hasAftSectionWithStructure()) {
        amount++;
      }

      return amount;
    } else if (section instanceof StarboardAftSection) {
      if (this.ship.systems.sections.hasPortAftSectionWithStructure()) {
        amount++;
      }

      if (this.ship.systems.sections.hasAftSectionWithStructure()) {
        amount++;
      }

      return amount;
    }
  }

  getBoundsForSection(section) {
    const { start: startX, end: endX } = this.getX(section);
    const { start: startY, end: endY } = this.getY(section);
    return {
      start: new Vector(startX, startY, -this.dimensions.z / 2),
      end: new Vector(endX, endY, this.dimensions.z / 2),
    };
  }

  getY(section) {
    const horizontal = this.getAmountOfHorizontalSections(section);
    if (section instanceof FrontSection || section instanceof AftSection) {
      return {
        start: -this.dimensions.y / horizontal / 2,
        end: this.dimensions.y / horizontal / 2,
      };
    } else if (
      section instanceof StarboardFrontSection ||
      section instanceof StarboardAftSection
    ) {
      return {
        start: -this.dimensions.y / 2, // -50
        end: -this.dimensions.y / 2 + this.dimensions.y / horizontal, // -50 + (100, 50, 33) = 50, 0, -17
      };
    } else if (
      section instanceof PortFrontSection ||
      section instanceof PortAftSection
    ) {
      return {
        start: this.dimensions.y / 2 - this.dimensions.y / horizontal, // 50 - (100, 50, 33) = -50, 0, 17
        end: this.dimensions.y / 2, // 50
      };
    } else if (section instanceof PrimarySection) {
      return {
        start: -this.dimensions.y / 2,
        end: this.dimensions.y / 2,
      };
    }
  }

  getX(section) {
    const vertical = this.getAmountOfVerticalSections();
    if (
      section instanceof FrontSection ||
      section instanceof StarboardFrontSection ||
      section instanceof PortFrontSection
    ) {
      return {
        start: this.dimensions.x / 2 - this.dimensions.x / vertical, //50 - (100, 50, 33) = -50, 0, 17,
        end: this.dimensions.x / 2, // 50
      };
    } else if (section instanceof PrimarySection) {
      return {
        start: -this.dimensions.x / vertical / 2,
        end: this.dimensions.x / vertical / 2,
      };
    } else if (section instanceof AftSection) {
      return {
        start: -this.dimensions.x / 2, // -50
        end: -this.dimensions.x / 2 + this.dimensions.x / vertical, // -50 + (100, 50, 33) = 50, 0, -33
      };
    }
  }
}

export default ShipObjectBoundingBox;

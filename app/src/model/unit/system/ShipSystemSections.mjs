import {
  PrimarySection,
  FrontSection,
  AftSection,
  StarboardSection,
  PortSection,
  PortFrontSection,
  PortAftSection,
  StarboardFrontSection,
  StarboardAftSection
} from "./systemSection";

class ShipSystemSections {
  constructor() {
    this.sections = [
      new PrimarySection(),
      new FrontSection(),
      new AftSection(),
      new StarboardSection(),
      new PortSection(),
      new PortFrontSection(),
      new PortAftSection(),
      new StarboardFrontSection(),
      new StarboardAftSection()
    ];
  }

  getPrimarySection() {
    return this.getSection(PrimarySection);
  }

  getFrontSection() {
    return this.getSection(FrontSection);
  }

  getAftSection() {
    return this.getSection(AftSection);
  }

  getStarboardSection() {
    return this.getSection(StarboardSection);
  }

  getStarboardFrontSection() {
    return this.getSection(StarboardFrontSection);
  }

  getStarboardAftSection() {
    return this.getSection(StarboardAftSection);
  }

  getPortSection() {
    return this.getSection(PortSection);
  }

  getPortFrontSection() {
    return this.getSection(PortFrontSection);
  }

  getPortAftSection() {
    return this.getSection(PortAftSection);
  }

  getSection(location) {
    return this.sections.find(section => section instanceof location);
  }
}

export default ShipSystemSections;

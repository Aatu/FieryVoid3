import TorpedoFlight from "../unit/TorpedoFlight.mjs";

class GameTorpedos {
  constructor() {
    this.flights = [];
  }

  addTorpedoFlights(flights) {
    flights = [].concat(flights);

    this.flights = [...this.flights, ...flights];
  }

  getTorpedoFlights() {
    return [...this.flights];
  }

  serialize() {
    return {
      flights: this.flights.map(flight => flight.serialize())
    };
  }

  deserialize(data = { flights: [] }) {
    this.flights = data.flights.map(flight =>
      new TorpedoFlight().deserialize(flight)
    );

    return this;
  }
}

export default GameTorpedos;

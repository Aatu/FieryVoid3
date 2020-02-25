import TorpedoFlight from "../unit/TorpedoFlight.mjs";

class GameTorpedos {
  constructor() {
    this.flights = [];
  }

  getTorpedoFlightById(id) {
    return this.flights.find(flight => flight.id === id);
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

  removeTorpedos() {
    this.flights = [];
  }

  advanceTurn() {}
}

export default GameTorpedos;

import TorpedoFlight from "../unit/TorpedoFlight";
class GameTorpedos {
    flights;
    constructor() {
        this.flights = [];
    }
    getTorpedoFlightById(id) {
        return this.flights.find((flight) => flight.id === id);
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
            flights: this.flights.map((flight) => flight.serialize()),
        };
    }
    deserialize(data = { flights: [] }) {
        this.flights = data.flights.map((flight) => TorpedoFlight.fromData(flight));
        return this;
    }
    advanceTurn() {
        this.flights = this.flights.filter((flight) => !flight.isDone());
    }
}
export default GameTorpedos;

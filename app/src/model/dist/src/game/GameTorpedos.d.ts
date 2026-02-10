import TorpedoFlight, { SerializedTorpedoFlight } from "../unit/TorpedoFlight";
export type SerializedGameTorpedos = {
    flights: SerializedTorpedoFlight[];
};
declare class GameTorpedos {
    flights: TorpedoFlight[];
    constructor();
    getTorpedoFlightById(id: string): TorpedoFlight | undefined;
    addTorpedoFlights(flights: TorpedoFlight | TorpedoFlight[]): void;
    getTorpedoFlights(): TorpedoFlight[];
    serialize(): SerializedGameTorpedos;
    deserialize(data?: SerializedGameTorpedos): this;
    advanceTurn(): void;
}
export default GameTorpedos;

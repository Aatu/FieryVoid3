import Flight from "./Flight.mjs";

/*
TorpedoFlight is a flight that is composed of torpedoes.

Torpedoes are automatically controlled flights that have a set target.
They will try to enter in the same hex as the target and if succesfull will detonate in fire resolution

Torpedo flight will have a total amount of thrust as well as how much they produce per turn.
If they run out of total thrust produced, they will self destruct.

Missed torpedos will keep chasing the target

Torpedos will impact from random direction
*/
class TorpedoFlight extends Flight {}

export default TorpedoFlight;

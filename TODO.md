TODO:

NOTE: Remeber that receiving system data might have to happen in certain order
BUG: When boosting 4 turn weapons to load 1.3 turn, floating point errors end up to 3.9999 something in 3 turns, not full 4. Actually seems to load correctly in 3 turns, but will show that it requires 4. Atleast on the second turn of loading.
BUG: Radiators do not count in damage when showing radiation power
IDEA: Boosting fusion thrusters will boost heat transfer instead of thrust production. This will result in ships being faster when they have radiators open.
Doing that with radiators closed will just fill the heat sinks
IDEA: do not allow thrusting to same direction with thrusters facing different directions. (After pivoting) That is somewhat silly
BUG: Effects to show destroyed structures not showing after NEW turn replay
BUG: MSV torpedoes do not seem to do any damage
TODO: What happens if ship boosts thruster but end up with invalid power and has to revert moves. Invalid movement is automatically reverted until valid?

TODO:

NOTE: Remeber that receiving system data might have to happen in certain order
BUG: When boosting 4 turn weapons to load 1.3 turn, floating point errors end up to 3.9999 something in 3 turns, not full 4. Actually seems to load correctly in 3 turns, but will show that it requires 4. Atleast on the second turn of loading.
IDEA: do not allow thrusting to same direction with thrusters facing different directions. (After pivoting) That is somewhat silly
BUG: Effects to show destroyed structures not showing after NEW turn replay
TODO: What happens if ship boosts thruster but end up with invalid power and has to revert moves. Invalid movement is automatically reverted until valid?
TODO: display out of ammo warning on system
BUG: Boosting hybrid fusion thrusters in fusion mode seems to ignore boost on server. Or possibly just show the heat prediction very wrong on the client
TODO: Torpedo defense, ignore torpedos or set priority
TODO: Torpedo defense, using EMP torpedos
TODO: Check that friendly ships can intercept
TODO: Use heat prediction instead of fixed overheat when selecting interceptor!

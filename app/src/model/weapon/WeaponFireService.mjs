class WeaponFireService {
  /*
    TODO:

    Weapon firing sequence
        - weapon fires as many times as it has shots assigned
        - first, check if electronic warfare systems acquire a lock. 
            * This is checked per shot, because state of the lock might rapidly change
            * What does this mean? should this work just like old instead?
            * Weapon does not fire if no lock aquired?
            * Affected by range?
                - close up small locks are enough?
                - effectiveness of DEW drop with range? Linear for simplicity?
            * Can aquire a solid lock, no penalties
            * Can aquire a poor lock, some penalties to hit? This might for example mean that the ship
                only aquires the lock for a small while and have to make a hasty shot.
            * Can fail to aquire a lock => weapon does not waste fire
        - calculate the hit change using targets to hit profile, weapons range strategy (affected by evasion)
        - RNG if hit actually lands
        - Apply damage, criticals and heat according to weapon damage strategy
    */
}

export default WeaponFireService;

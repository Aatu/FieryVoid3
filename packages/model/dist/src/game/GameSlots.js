import GameSlot from "./GameSlot";
class GameSlots {
    gameData;
    slots;
    constructor(gameData) {
        this.gameData = gameData;
        this.slots = [];
    }
    getTeamForShip(ship) {
        const slot = this.slots.find((slot) => slot.includesShip(ship));
        return slot?.team;
    }
    getSlotsByTeams() {
        const teams = [];
        this.slots.forEach((slot) => {
            let team = teams.find((t) => t.team === slot.team);
            if (!team) {
                team = {
                    team: slot.team,
                    slots: [slot],
                };
                teams.push(team);
            }
            else {
                team.slots.push(slot);
            }
        });
        return teams;
    }
    isShipInUsersTeam(user, ship) {
        const userSlot = this.slots.find((s) => s.userId === user.id);
        if (!userSlot) {
            return false;
        }
        return this.getSlotByShip(ship)?.team === userSlot.team;
    }
    isUsersTeam(user, team) {
        const userSlot = this.slots.find((s) => s.userId === user.id);
        if (!userSlot) {
            return false;
        }
        return team === userSlot.team;
    }
    isUsersTeamSlot(slot, user) {
        const userSlot = this.slots.find((s) => s.userId === user.id);
        if (!userSlot) {
            return false;
        }
        return slot.team === userSlot.team;
    }
    removeSlot(slot) {
        this.slots = this.slots.filter((s) => s.id !== slot.id);
    }
    getUsersSlots(user) {
        return this.slots.filter((slot) => slot.isUsers(user || null));
    }
    getSlotByShip(ship) {
        const slot = this.slots.find((slot) => slot.includesShip(ship));
        if (!slot) {
            throw new Error("ship has no slot");
        }
        return slot;
    }
    getSlotById(id) {
        return this.slots.find((slot) => slot.id === id);
    }
    setSlots(slots) {
        slots.forEach(this.addSlot.bind(this));
    }
    getSlots() {
        return this.slots;
    }
    addSlot(slot) {
        this.slots.push(slot);
        return slot;
    }
    serialize() {
        return this.slots.map((slot) => slot.serialize());
    }
    deserialize(data = []) {
        this.slots = data
            ? data.map((slotData) => new GameSlot(slotData, this.gameData))
            : [];
        return this;
    }
}
export default GameSlots;

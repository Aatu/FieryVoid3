export class CombatLogCargoTransfer {
    notes = [];
    addNote(note) {
        this.notes.push(note);
    }
    getNotes() {
        return this.notes;
    }
    replayOrder = 60;
    serialize() {
        return {
            logEntryClass: this.constructor.name,
            notes: this.notes,
        };
    }
    deserialize(unknownData) {
        const data = unknownData;
        this.notes = data.notes;
        return this;
    }
}

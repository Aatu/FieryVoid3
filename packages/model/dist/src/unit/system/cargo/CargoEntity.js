class CargoEntity {
    getCargoClassName() {
        return this.constructor.name;
    }
    getSpaceRequired() {
        return 0.1;
    }
    getCargoInfo() {
        return [];
    }
    getDisplayName() {
        return "";
    }
    getShortDisplayName() {
        return "";
    }
    getBackgroundImage() {
        return "";
    }
    isInstanceOf(other) {
        if (!other) {
            return false;
        }
        return this instanceof other.constructor;
    }
    equals(other) {
        if (!other) {
            return false;
        }
        return this.constructor.name === other.constructor.name;
    }
}
export default CargoEntity;

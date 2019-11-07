class FireOrderResult {
  constructor(data) {
    this.resolved = false;
    this.details = [];

    this.deserialize(data);
  }

  serialize() {
    return {
      resolved: this.resolved,
      details: this.details
    };
  }

  deserialize(data = {}) {
    this.resolved = data.resolved || false;
    this.details = data.details || [];
  }

  setDetails(details) {
    this.details.push(details);
  }

  setResolved() {
    this.resolved = true;
  }

  getHitResolution() {
    return this.details.find(detail => detail.type === "checkFireOrderHits");
  }
}

export default FireOrderResult;

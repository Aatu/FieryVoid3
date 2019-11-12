import FireOrderDamageResult from "./FireOrderDamageResult.mjs";
import FireOrderHitResult from "./FireOrderHitResult.mjs";

class FireOrderResult {
  constructor(data) {
    this.resolved = false;
    this.details = [];

    this.deserialize(data);
  }

  serialize() {
    return {
      resolved: this.resolved,
      details: this.details.map(detail => detail.serialize())
    };
  }

  deserialize(data = {}) {
    this.resolved = data.resolved || false;
    this.details = data.details
      ? data.details.map(detailData => {
          switch (detailData.name) {
            case "FireOrderDamageResult":
              return new FireOrderDamageResult().deserialize(detailData);
            case "FireOrderHitResult":
              return new FireOrderHitResult().deserialize(detailData);
            default:
              throw new Error(
                `Unrecognized FireOrderResult "${detailData.name}"`
              );
          }
        })
      : [];
  }

  setDetails(details) {
    this.details.push(details);
    return this;
  }

  setResolved() {
    this.resolved = true;
  }

  getHitResolution() {
    return this.details.find(detail => detail instanceof FireOrderHitResult);
  }

  getDamageResolution() {
    return this.details.find(detail => detail instanceof FireOrderDamageResult);
  }
}

export default FireOrderResult;

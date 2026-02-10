import PhaseDirector from "./PhaseDirector";
import { PhaseEventPayload } from "./phaseStrategy/PhaseStrategy";

type PhaseEvent = { name: string; payload?: PhaseEventPayload };

export class PhaseEvents {
  private events: PhaseEvent[] = [];
  private phaseDirector: PhaseDirector;

  constructor(phaseDirector: PhaseDirector) {
    this.phaseDirector = phaseDirector;
  }

  public push(event: PhaseEvent) {
    if (this.isDuplicate(event)) {
      return;
    }

    this.events.push(event);
  }

  public sendEvents() {
    const strategy = this.phaseDirector.getPhaseStrategy();

    if (!strategy || strategy.inactive) {
      return;
    }

    const iconContainer = this.phaseDirector.getShipIconContainer();

    const toSend = [...this.events];
    this.clear();

    toSend.forEach((event) => {
      strategy.onEvent(event.name, event.payload);
      iconContainer?.onEvent(event.name, event.payload);
    });
  }

  public clear() {
    this.events = [];
  }

  private isDuplicate(event: PhaseEvent) {
    if (event.payload) {
      return false;
    }

    return this.events.some((e) => e.name === event.name);
  }
}

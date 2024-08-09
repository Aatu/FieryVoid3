export interface IPhaseDirector {
  relayEvent(event: string, ...args: any[]): void;
}

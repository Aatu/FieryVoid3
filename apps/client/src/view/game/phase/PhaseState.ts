class PhaseState {
  private state: Record<string, unknown> = {};

  set(key: string, payload: unknown) {
    this.state[key] = payload;
  }

  get(key: string) {
    return this.state[key];
  }
}

export default PhaseState;

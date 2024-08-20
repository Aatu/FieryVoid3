type KeyBoardHotkey = {
  keyCode: number;
  shiftKey: boolean;
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
};

export type GameSettingsType = {
  ShowAllEW: KeyBoardHotkey;
  ShowFriendlyEW: KeyBoardHotkey;
  ShowEnemyEW: KeyBoardHotkey;
  ZoomLevelToStrategic: number;
};

const isHotkey = (value: unknown): value is KeyBoardHotkey => {
  if (typeof value !== "object") {
    return false;
  }

  const obj = value as KeyBoardHotkey;

  if (typeof obj.keyCode !== "number") {
    return false;
  }

  if (typeof obj.shiftKey !== "boolean") {
    return false;
  }

  if (typeof obj.altKey !== "boolean") {
    return false;
  }

  if (typeof obj.ctrlKey !== "boolean") {
    return false;
  }

  if (typeof obj.metaKey !== "boolean") {
    return false;
  }

  return true;
};

class GameSettings {
  private settings!: GameSettingsType;

  constructor(settings: Partial<GameSettingsType> = {}) {
    this.populate(settings);
  }

  populate(settings: Partial<GameSettingsType> = {}) {
    this.settings = {
      ShowAllEW: settings.ShowAllEW || {
        keyCode: 87,
        shiftKey: false,
        altKey: false,
        ctrlKey: false,
        metaKey: false,
      },
      ShowFriendlyEW: settings.ShowFriendlyEW || {
        keyCode: 88,
        shiftKey: false,
        altKey: false,
        ctrlKey: false,
        metaKey: false,
      },
      ShowEnemyEW: settings.ShowEnemyEW || {
        keyCode: 89,
        shiftKey: false,
        altKey: false,
        ctrlKey: false,
        metaKey: false,
      },
      ZoomLevelToStrategic: 0.2,
    };
  }

  set(key: string, value: unknown) {
    if (this.settings[key as keyof GameSettingsType] === undefined) {
      throw new Error("Unrecognized settings key '" + key + "'");
    }

    console.log("setting key", key, "to", value, typeof value);

    // @ts-expect-error bah
    this.settings[key as keyof GameSettingsType] = value;
  }

  save() {
    localStorage.setItem("settings", JSON.stringify(this.settings));
  }

  matchEvent(event: KeyboardEvent) {
    return Object.keys(this.settings).find((action) => {
      const def = this.settings[action as keyof GameSettingsType];

      if (!def || !isHotkey(def)) {
        return false;
      }

      return (
        def.keyCode === event.keyCode &&
        def.shiftKey === event.shiftKey &&
        def.altKey === event.altKey &&
        def.ctrlKey === event.ctrlKey &&
        def.metaKey === event.metaKey
      );
    });
  }

  load() {
    const settings = localStorage.getItem("settings") || "{}";
    this.populate(JSON.parse(settings));
    return this;
  }
}

export default GameSettings;

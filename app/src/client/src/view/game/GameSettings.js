class GameSettings {
  constructor(settings) {
    this.populate(settings);
  }

  populate(settings = {}) {
    this.settings = {
      ShowAllEW: settings.ShowAllEW || {
        keyCode: 87,
        shiftKey: false,
        altKey: false,
        ctrlKey: false,
        metaKey: false
      },
      ShowFriendlyEW: settings.ShowFriendlyEW || {
        keyCode: 88,
        shiftKey: false,
        altKey: false,
        ctrlKey: false,
        metaKey: false
      },
      ShowEnemyEW: settings.ShowEnemyEW || {
        keyCode: 89,
        shiftKey: false,
        altKey: false,
        ctrlKey: false,
        metaKey: false
      },
      ZoomLevelToStrategic: 0.2
    };
  }

  set(key, value) {
    if (this.settings[key] === undefined) {
      throw new Error("Unrecognized settings key '" + key + "'");
    }

    console.log("setting key", key, "to", value, typeof value);
    this.settings[key] = value;
  }

  save() {
    localStorage.setItem("settings", JSON.stringify(this.settings));
  }

  matchEvent = function(event) {
    return Object.keys(this.settings).find(function(action) {
      var def = this.settings[action];
      if (!def || !def.keyCode) {
        return false;
      }

      return (
        def.keyCode === event.keyCode &&
        def.shiftKey === event.shiftKey &&
        def.altKey === event.altKey &&
        def.ctrlKey === event.ctrlKey &&
        def.metaKey === event.metaKey
      );
    }, this);
  };

  load() {
    var settings = localStorage.getItem("settings") || "{}";
    this.populate(JSON.parse(settings));
    return this;
  }
}

export default GameSettings;

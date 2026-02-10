export var GAME_MESSAGE;
(function (GAME_MESSAGE) {
    GAME_MESSAGE["TAKE_SLOT"] = "takeSlot";
    GAME_MESSAGE["LEAVE_SLOT"] = "leaveSlot";
    GAME_MESSAGE["BUY_SHIPS"] = "buyShips";
    GAME_MESSAGE["COMMIT_TURN"] = "commitTurn";
    GAME_MESSAGE["COMMIT_DEPLOYMENT"] = "commitDeployment";
    GAME_MESSAGE["REQUEST_REPLAY"] = "requestReplay";
    GAME_MESSAGE["REPLAY"] = "replay";
    GAME_MESSAGE["GAMEDATA"] = "gameData";
    GAME_MESSAGE["TURN_CHANGED"] = "turnChanged";
})(GAME_MESSAGE || (GAME_MESSAGE = {}));

import UiStrategy from "./UiStrategy";

class ShowDeploymentAreas extends UiStrategy {
  update(gameData) {
    super.update(gameData);
    console.log("update");
  }
}

export default ShowDeploymentAreas;

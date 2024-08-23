import Animation from "../../animation/Animation";
import { RenderPayload } from "../../phase/phaseStrategy/PhaseStrategy";
import UiStrategy from "./UiStrategy";

class AnimationUiStrategy extends UiStrategy {
  protected animations: Animation[];

  constructor() {
    super();
    this.animations = [];
  }

  deactivate() {
    this.removeAllAnimations();
    super.deactivate();
  }

  render(payload: RenderPayload) {
    this.animations.forEach((animation) => animation.render(payload));
  }

  removeAllAnimations() {
    this.animations.forEach((animation) => animation.deactivate());
    this.animations = [];
  }

  removeAnimation(toRemove: Animation) {
    this.animations = this.animations.filter(function (animation) {
      return animation !== animation;
    });

    toRemove.deactivate();
  }
}

export default AnimationUiStrategy;

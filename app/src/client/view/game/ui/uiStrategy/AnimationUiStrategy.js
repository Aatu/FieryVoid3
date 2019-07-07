import UiStrategy from "./UiStrategy";

class AnimationUiStrategy extends UiStrategy {
  constructor() {
    super();
    this.animations = [];
  }

  deactivate() {
    this.removeAllAnimations();
    super.deactivate();
  }

  render(payload) {
    this.animations.forEach(animation => animation.render(payload));
  }

  removeAllAnimations() {
    this.animations.forEach(animation => animation.deactivate());
    this.animations = [];
  }

  removeAnimation(toRemove) {
    this.animations = this.animations.filter(function(animation) {
      return animation !== animation;
    });

    toRemove.deactivate();
  }
}

export default AnimationUiStrategy;

import UiStrategy from "./UiStrategy";

class AnimationUiStrategy extends UiStrategy {
  constructor() {
    super();
    this.lastAnimationTime = 0;
    this.totalAnimationTime = 0;
    this.currentDeltaTime = 0;
    this.animations = [];
    this.paused = true;
    this.goingBack = false;
  }

  stop() {
    this.lastAnimationTime = 0;
    this.totalAnimationTime = 0;
    this.currentDeltaTime = 0;
    this.pause();
  }

  back() {
    this.goingBack = true;
    this.paused = false;
  }

  play() {
    this.paused = false;
    this.goingBack = false;
  }

  pause() {
    this.paused = true;
    this.goingBack = false;
  }

  isPaused() {
    return this.paused;
  }

  deactivate() {
    return this;
  }

  goToTime(time) {
    this.totalAnimationTime = time;
    return this;
  }

  render(scene, zoom) {
    this.updateDeltaTime.call(this, this.paused);
    this.updateTotalAnimationTime.call(this, this.paused);
    this.animations.forEach(function(animation) {
      animation.render(
        new Date().getTime(),
        this.totalAnimationTime,
        this.lastAnimationTime,
        this.currentDeltaTime,
        zoom,
        this.goingBack,
        this.paused
      );
    }, this);
  }

  positionAndFaceAllIcons() {
    this.shipIconContainer.positionAndFaceAllIcons();
  }

  positionAndFaceIcon(icon) {
    icon.positionAndFaceIcon();
  }

  /*
    AnimationStrategy.prototype.initializeAnimations = function() {
        this.animations.forEach(function (animation) {
            animation.initialize();
        })
    };
    */

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

  shipMovementChanged() {}

  updateTotalAnimationTime(paused) {
    if (paused) {
      return;
    }

    if (this.goingBack) {
      this.totalAnimationTime -= this.currentDeltaTime;
    } else {
      this.totalAnimationTime += this.currentDeltaTime;
    }
  }

  updateDeltaTime(paused) {
    var now = new Date().getTime();

    if (!this.lastAnimationTime) {
      this.lastAnimationTime = now;
      this.currentDeltaTime = 0;
    }

    if (!paused) {
      this.currentDeltaTime = now - this.lastAnimationTime;
    }

    this.lastAnimationTime = now;
  }
}

export default AnimationUiStrategy;

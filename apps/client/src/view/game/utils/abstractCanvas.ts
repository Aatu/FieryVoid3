const create = (width: number, height: number, debug?: boolean) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.style.zIndex = "1000";
  canvas.style.position = "absolute";
  canvas.style.top = "3px";
  canvas.style.left = "3px";
  canvas.style.border = "1px solid red";

  if (debug) {
    document.body.appendChild(canvas);
  }

  return canvas;
};

export default {
  create,
};

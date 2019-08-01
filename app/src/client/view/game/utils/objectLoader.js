import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const loader = new GLTFLoader();

const entities = [];

export const cloneObject = (source, cloneMaterial = true) => {
  const sourceLookup = new Map();
  const cloneLookup = new Map();

  const clone = source.scene.clone();
  const animations = source.animations;

  parallelTraverse(source.scene, clone, function(sourceNode, clonedNode) {
    sourceLookup.set(clonedNode, sourceNode);
    cloneLookup.set(sourceNode, clonedNode);
  });

  clone.traverse(function(node) {
    if (!node.isSkinnedMesh) return;

    const clonedMesh = node;
    const sourceMesh = sourceLookup.get(node);
    const sourceBones = sourceMesh.skeleton.bones;

    clonedMesh.skeleton = sourceMesh.skeleton.clone();
    clonedMesh.bindMatrix.copy(sourceMesh.bindMatrix);

    clonedMesh.skeleton.bones = sourceBones.map(function(bone) {
      return cloneLookup.get(bone);
    });

    clonedMesh.bind(clonedMesh.skeleton, clonedMesh.bindMatrix);
  });

  if (cloneMaterial) {
    clone.traverse(node => {
      if (node.isMesh) {
        node.material = node.material.clone();
      }
    });
  }

  return { scene: clone, animations };
};

const parallelTraverse = (a, b, callback) => {
  callback(a, b);

  for (var i = 0; i < a.children.length; i++) {
    parallelTraverse(a.children[i], b.children[i], callback);
  }
};

export const loadObject = async url => {
  const cached = entities.find(entity => entity.url === url);

  if (cached) {
    const object = await cached.value;
    return cloneObject(object);
  }

  const entity = {
    url: url,
    value: new Promise((resolve, reject) => {
      loader.load(url, object => {
        resolve(object);
      });
    })
  };

  entities.push(entity);

  const object = await entity.value;
  return cloneObject(object);
};

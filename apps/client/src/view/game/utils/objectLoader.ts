import { AnimationClip, Mesh, Object3D } from "three";
import { GLTF, GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";

const loader = new GLTFLoader();
export type LoadedObject = {
  animations: AnimationClip[];
  object: Object3D;
};

const entities: {
  url: string;
  value: Promise<GLTF>;
}[] = [];
export interface IClonable {
  scene: Object3D;
  animations: AnimationClip[];
}

export const cloneObject = (
  source: IClonable /*cloneMaterial = true*/
): LoadedObject => {
  //const sourceLookup = new Map();
  //const cloneLookup = new Map();

  //const clone = source.scene.clone();

  const clone = SkeletonUtils.clone(source.scene);

  /*
  const clone = new Object3D();

  source.scene.children.forEach((child) => {
    clone.add(child.clone());
  });
*/
  const animations = source.animations;
  /*
  parallelTraverse(source.scene, clone, function (sourceNode, clonedNode) {
    sourceLookup.set(clonedNode, sourceNode);
    cloneLookup.set(sourceNode, clonedNode);
  });

  clone.traverse(function (node) {
    if (!node.isSkinnedMesh) return;

    const clonedMesh = node;
    const sourceMesh = sourceLookup.get(node);
    const sourceBones = sourceMesh.skeleton.bones;

    clonedMesh.skeleton = sourceMesh.skeleton.clone();
    clonedMesh.bindMatrix.copy(sourceMesh.bindMatrix);

    clonedMesh.skeleton.bones = sourceBones.map(function (bone) {
      return cloneLookup.get(bone);
    });

    clonedMesh.bind(clonedMesh.skeleton, clonedMesh.bindMatrix);
  });

  if (cloneMaterial) {
    clone.traverse((node) => {
      if (node.isMesh) {
        node.material = node.material.clone();
      }
    });
  }
    */

  return { animations, object: clone };
};

/*
const parallelTraverse = (a, b, callback) => {
  callback(a, b);

  for (let i = 0; i < a.children.length; i++) {
    parallelTraverse(a.children[i], b.children[i], callback);
  }
};
*/

export const loadObject = async (
  url: string,
  debug: boolean = false
): Promise<LoadedObject> => {
  const cached = entities.find((entity) => entity.url === url);

  if (cached) {
    const object = await cached.value;

    if (debug) {
      console.log("cached object", object);
    }
    return cloneObject(object);
  }

  const entity = {
    url: url,
    value: new Promise<GLTF>((resolve, reject) => {
      try {
        loader.load(
          url,
          (object) => {
            resolve(object);
          },
          () => {},
          (error) => {
            console.log("error loading asset", url, error);
          }
        );
      } catch (e) {
        console.log("error loading asset", e);
        reject(new Error(`Unable to load asset ${url}`));
      }
    }),
  };

  entities.push(entity);

  const object = await entity.value;

  if (debug) {
    console.log("loaded object", object);
  }
  return cloneObject(object);
};

export const isMesh = (object: Object3D): object is Mesh => {
  return (object as Mesh).isMesh;
};

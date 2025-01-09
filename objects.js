import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

const gltfLoader = new GLTFLoader();
const fbxLoader = new FBXLoader();
const mtlloader = new MTLLoader();
const objloader = new OBJLoader();

function addInteraction(object, key, objects) {
    if (object instanceof THREE.Object3D) {
        object.addEventListener('click', () => {
            objects[key].clicked = !objects[key].clicked;
            console.log(`${key} clicked:`, objects[key].clicked);
        });

        object.addEventListener('mouseover', () => {
            document.body.style.cursor = 'pointer';
        });

        object.addEventListener('mouseout', () => {
            document.body.style.cursor = 'default';
        });
    } 
    else {
        console.error(`The object for ${key} is not a valid THREE.Object3D.`);
    }
}

export async function loadObjects(scene, objects, interactionManager) {
    const fountain = await loadGLBModel('fountain.glb');
    castShadow(fountain);
    fountain.position.set(-1.7, 0, 0.35);
    fountain.scale.set(0.01, 0.01, 0.01);
    scene.add(fountain);

    fountain.interactive = true; // Enable interaction
    interactionManager.add(fountain); // Add to the interaction manager

    objects['fountain'] = { object: fountain, clicked: false };

    addInteraction(fountain, 'fountain', objects);

    return objects;
}

function loadGLBModel(fileName) {
    return new Promise((resolve, reject) => {
        gltfLoader.load(
            `public/models/${fileName}`,
            (gltf) => {
                const model = gltf.scene || gltf;
                resolve(model);
            },
            undefined,
            (error) => reject(error)
        );
    });
}

function loadFBXModel(fileName) {
    return new Promise((resolve, reject) => {
        fbxLoader.load(
            `public/models/${fileName}`,
            (object) => {
                const model = object.scene || object;
                resolve(model);
            },
            undefined,
            (error) => reject(error)
        );
    });
}

function loadOBJModel(fileName) {
    return new Promise((resolve, reject) => {
        mtlloader.load(
            `public/models/${fileName}.mtl`,
            (materials) => {
                materials.preload();
                objloader.setMaterials(materials);
                objloader.load(
                    `public/models/${fileName}.obj`,
                    (object) => {
                        resolve(object);
                    },
                    undefined,
                    (error) => reject(error)
                );
            },
            undefined,
            (error) => reject(error)
        );
    });
}

export function castShadow(object) {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
}

export function moveObject(objects, keys) {
    const moveDistance = 0.1;

    for (const key in objects) {
        const obj = objects[key];
        if (obj.clicked && obj.object instanceof THREE.Object3D) {
            if (keys.Up) {
                obj.object.position.z -= moveDistance;
            }
            if (keys.Down) {
                obj.object.position.z += moveDistance;
            }
            if (keys.Left) {
                obj.object.position.x -= moveDistance;
            }
            if (keys.Right) {
                obj.object.position.x += moveDistance;
            }
        }
    }
}

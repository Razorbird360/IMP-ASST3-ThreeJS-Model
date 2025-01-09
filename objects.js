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
    fountain.interactive = true;
    interactionManager.add(fountain);
    objects['fountain'] = { object: fountain, clicked: false };
    addInteraction(fountain, 'fountain', objects);

    loadTrees(scene, interactionManager, objects);

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

            if (keys.Space) {
                obj.object.position.y += moveDistance;
            }
            if (keys.Shift) {
                obj.object.position.y -= moveDistance;
            }
        }
    }
}

export async function loadGrass(scene) {
    const gltf = await gltfLoader.loadAsync(
    `public/models/grass.glb`
    );
    const grassModel = gltf.scene;
    grassModel.scale.set(0.02, 0.02, 0.02);
    const grassCount = 200;
    const groundSize = 100;
    for (let i = 0; i < grassCount; i++) {
    const clone = grassModel.clone();
    const x = Math.random() * groundSize - groundSize / 2;
    const z = Math.random() * groundSize - groundSize / 2;
    if (Math.abs(x + 23) < 5 && Math.abs(z) < 5) continue;
    clone.position.set(x, 0.1, z);
    clone.rotation.y = Math.random() * Math.PI * 2;
    scene.add(clone);
    }
}
  
export async function loadTrees(scene, interactionManager, objects) {
    const st = await gltfLoader.loadAsync(
        `public/models/smallTree.glb`
    );
    const mt = await gltfLoader.loadAsync(
        `public/models/mediumTree.glb`
    );
    const bt = await gltfLoader.loadAsync(
        `public/models/bigTree.glb`
    );


    let tree1 = createTree(-17, 0, -17, 'l', scene, st, mt, bt);
    scene.add(tree1);
    tree1.interactive = true;
    interactionManager.add(tree1);
    objects['tree1'] = { object: tree1, clicked: false };
    addInteraction(tree1, 'tree1', objects);
    
    let tree2 = createTree(-19, 0, -19, 'm', scene, st, mt, bt);
    scene.add(tree2);
    tree2.interactive = true;
    interactionManager.add(tree2);
    objects['tree2'] = { object: tree2, clicked: false };
    addInteraction(tree2, 'tree2', objects);
    
    let tree3 = createTree(-17, 0, -6, 's', scene, st, mt, bt);
    scene.add(tree3);
    tree3.interactive = true;
    interactionManager.add(tree3);
    objects['tree3'] = { object: tree3, clicked: false };
    addInteraction(tree3, 'tree3', objects);
    
    let tree4 = createTree(16, 0, -10, 's', scene, st, mt, bt);
    scene.add(tree4);
    tree4.interactive = true;
    interactionManager.add(tree4);
    objects['tree4'] = { object: tree4, clicked: false };
    addInteraction(tree4, 'tree4', objects);
    
    let tree5 = createTree(19, 0, 10, 'l', scene, st, mt, bt);
    scene.add(tree5);
    tree5.interactive = true;
    interactionManager.add(tree5);
    objects['tree5'] = { object: tree5, clicked: false };
    addInteraction(tree5, 'tree5', objects);
    
    let tree6 = createTree(-12, 0, 17, 'm', scene, st, mt, bt);
    scene.add(tree6);
    tree6.interactive = true;
    interactionManager.add(tree6);
    objects['tree6'] = { object: tree6, clicked: false };
    addInteraction(tree6, 'tree6', objects);
    
    let tree7 = createTree(10, 0, -20, 's', scene, st, mt, bt);
    scene.add(tree7);
    tree7.interactive = true;
    interactionManager.add(tree7);
    objects['tree7'] = { object: tree7, clicked: false };
    addInteraction(tree7, 'tree7', objects);
    
    let tree8 = createTree(20, 0, 20, 'l', scene, st, mt, bt);
    scene.add(tree8);
    tree8.interactive = true;
    interactionManager.add(tree8);
    objects['tree8'] = { object: tree8, clicked: false };
    addInteraction(tree8, 'tree8', objects);
    
    let tree9 = createTree(14, 0, 22, 'm', scene, st, mt, bt);
    scene.add(tree9);
    tree9.interactive = true;
    interactionManager.add(tree9);
    objects['tree9'] = { object: tree9, clicked: false };
    addInteraction(tree9, 'tree9', objects);
    
    let tree10 = createTree(1, 0, 16, 's', scene, st, mt, bt);
    scene.add(tree10);
    tree10.interactive = true;
    interactionManager.add(tree10);
    objects['tree10'] = { object: tree10, clicked: false };
    addInteraction(tree10, 'tree10', objects);
    
    let tree11 = createTree(25, 0, 0, 'l', scene, st, mt, bt);
    scene.add(tree11);
    tree11.interactive = true;
    interactionManager.add(tree11);
    objects['tree11'] = { object: tree11, clicked: false };
    addInteraction(tree11, 'tree11', objects);
    
    let tree12 = createTree(27, 0, 7, 'm', scene, st, mt, bt);
    scene.add(tree12);
    tree12.interactive = true;
    interactionManager.add(tree12);
    objects['tree12'] = { object: tree12, clicked: false };
    addInteraction(tree12, 'tree12', objects);
    
    let tree13 = createTree(22, 0, -9, 'l', scene, st, mt, bt);
    scene.add(tree13);
    tree13.interactive = true;
    interactionManager.add(tree13);
    objects['tree13'] = { object: tree13, clicked: false };
    addInteraction(tree13, 'tree13', objects);
    
    let tree14 = createTree(-22, 0, 10, 's', scene, st, mt, bt);
    scene.add(tree14);
    tree14.interactive = true;
    interactionManager.add(tree14);
    objects['tree14'] = { object: tree14, clicked: false };
    addInteraction(tree14, 'tree14', objects);
    
    let tree15 = createTree(1, 0, -20, 'm', scene, st, mt, bt);
    scene.add(tree15);
    tree15.interactive = true;
    interactionManager.add(tree15);
    objects['tree15'] = { object: tree15, clicked: false };
    addInteraction(tree15, 'tree15', objects);
    
    let tree16 = createTree(-5, 0, 19, 'l', scene, st, mt, bt);
    scene.add(tree16);
    tree16.interactive = true;
    interactionManager.add(tree16);
    objects['tree16'] = { object: tree16, clicked: false };
    addInteraction(tree16, 'tree16', objects);
    
    let tree17 = createTree(-35, 0, 3, 's', scene, st, mt, bt);
    scene.add(tree17);
    tree17.interactive = true;
    interactionManager.add(tree17);
    objects['tree17'] = { object: tree17, clicked: false };
    addInteraction(tree17, 'tree17', objects);
    
    let tree18 = createTree(-30, 0, -8, 'm', scene, st, mt, bt);
    scene.add(tree18);
    tree18.interactive = true;
    interactionManager.add(tree18);
    objects['tree18'] = { object: tree18, clicked: false };
    addInteraction(tree18, 'tree18', objects);
    
    let tree19 = createTree(-32, 0, 18, 'l', scene, st, mt, bt);
    scene.add(tree19);
    tree19.interactive = true;
    interactionManager.add(tree19);
    objects['tree19'] = { object: tree19, clicked: false };
    addInteraction(tree19, 'tree19', objects);
    
    
}

function createTree(x, y, z, size, scene, st, mt, bt) {
    let tree = null;
    switch (size) {
        case 's':
            tree = st.scene.clone();
            break;
        case 'm':
            tree = mt.scene.clone();
            break;
        case 'l':
            tree = bt.scene.clone();
            break;
    }
    tree.scale.set(0.5, 0.5, 0.5);
    tree.position.set(x, y, z);
    castShadow(tree);
    return tree;
}

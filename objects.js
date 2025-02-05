import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { BASE_PATH } from './utils.js';

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
        console.log(`The object for ${key} is not a valid THREE.Object3D.`);
    }
}

export async function loadObjects(scene, objects, interactionManager) {

    const fountain = await loadGLBModel('fountain.glb');
    castShadow(fountain);
    fountain.position.set(0, 0, 0);
    fountain.scale.set(0.01, 0.01, 0.01);
    scene.add(fountain);
    fountain.interactive = true;
    interactionManager.add(fountain);
    objects['fountain'] = { object: fountain, clicked: false };
    addInteraction(fountain, 'fountain', objects);

    loadTrees(scene, interactionManager, objects);

    const slide = await loadGLBModel('playground/slide.glb');
    castShadow(slide);
    slide.position.set(10, 0, 4);
    scene.add(slide);
    slide.interactive = true;
    interactionManager.add(slide);
    objects['slide'] = { object: slide, clicked: false };
    addInteraction(slide, 'slide', objects);
    
    const monkeyBars = await loadGLBModel('playground/monkeyBars.glb');
    castShadow(monkeyBars);
    monkeyBars.position.set(15, 0, 4);
    monkeyBars.rotation.y = Math.PI / 2;
    monkeyBars.scale.set(2, 2, 2);
    scene.add(monkeyBars);
    monkeyBars.interactive = true;
    interactionManager.add(monkeyBars);
    objects['monkeyBars'] = { object: monkeyBars, clicked: false };
    addInteraction(monkeyBars, 'monkeyBars', objects);

    const sandbox = await loadGLBModel('playground/sandbox.glb');
    castShadow(sandbox);
    sandbox.position.set(11, 0, -6);
    sandbox.scale.set(2.5, 2.5, 2.5);
    scene.add(sandbox);
    sandbox.interactive = true;
    interactionManager.add(sandbox);
    objects['sandbox'] = { object: sandbox, clicked: false };
    addInteraction(sandbox, 'sandbox', objects);
    
    const seesaw = await loadGLBModel('playground/seesaw.glb');
    castShadow(seesaw);
    seesaw.position.set(16, 0, -6);
    seesaw.rotation.y = Math.PI / 2;
    seesaw.scale.set(0.7, 0.7, 0.7);
    scene.add(seesaw);
    seesaw.interactive = true;
    interactionManager.add(seesaw);
    objects['seesaw'] = { object: seesaw, clicked: false };
    addInteraction(seesaw, 'seesaw', objects);


    const picnicTable = await loadGLBModel('picnicTable.glb');
    castShadow(picnicTable);
    picnicTable.position.set(-12, 0, 3);
    picnicTable.scale.set(1.1, 1.1, 1.1);
    scene.add(picnicTable);
    picnicTable.interactive = true;
    interactionManager.add(picnicTable);
    objects['picnicTable'] = { object: picnicTable, clicked: false };
    addInteraction(picnicTable, 'picnicTable', objects);


    const umbrellaTable = await loadGLBModel('beach_table.glb');
    castShadow(umbrellaTable);
    umbrellaTable.position.set(-12, 0, -4);
    umbrellaTable.scale.set(0.27, 0.27, 0.27);
    scene.add(umbrellaTable);
    umbrellaTable.interactive = true;
    interactionManager.add(umbrellaTable);
    objects['umbrellaTable'] = { object: umbrellaTable, clicked: false };
    addInteraction(umbrellaTable, 'umbrellaTable', objects);


    loadLamps(scene, interactionManager, objects);

    addRoad(scene, interactionManager, objects);

    addPath(scene, interactionManager, objects);

    return objects;
}
    
function loadGLBModel(fileName) {
    return new Promise((resolve, reject) => {
        gltfLoader.load(
            `${BASE_PATH}models/${fileName}`,
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
            `${BASE_PATH}models/${fileName}`,
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
            `${BASE_PATH}models/${fileName}.mtl`,
            (materials) => {
                materials.preload();
                objloader.setMaterials(materials);
                objloader.load(
                    `/models/${fileName}.obj`,
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
    try {
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
    } catch (error) {
        console.log('shadow error for:', object);
    }
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
            if (keys.r) {
                setToFalse(objects);
                keys.r = false;
            }
            if (keys.n) {
                resetY(objects);
                keys.n = false;
            }
            if (keys.q) {
                obj.object.rotation.y += 0.04;
            }
            if (keys.e) {
                obj.object.rotation.y -= 0.04;
            }
        }
    }
}


function resetY(objects) {
    for (const key in objects) {
        if (objects.hasOwnProperty(key)) {
            if (objects[key].hasOwnProperty('clicked') && objects[key].clicked === true) {
                if (objects[key].object && objects[key].object.position) {
                    objects[key].object.position.y = 0;
                } else {
                    console.warn(`Position is undefined for object ${key}`);
                }
            }
        }
    }
}



function setToFalse(objects) {
    for (const key in objects) {
        if (objects.hasOwnProperty(key)) {
            if (objects[key].hasOwnProperty('clicked') && objects[key].clicked === true) {
                objects[key].clicked = false;
            }
        }
    }
}



export async function loadGrass(scene) {
    const gltf = await gltfLoader.loadAsync(
    `${BASE_PATH}models/grass.glb`
    );
    const grassModel = gltf.scene;
    grassModel.scale.set(0.02, 0.02, 0.02);
    const grassCount = 200;
    const xLength = 76;
    const yLength = 96;
    for (let i = 0; i < grassCount; i++) {
        const clone = grassModel.clone();
        const x = Math.random() * xLength - xLength / 2;
        const z = Math.random() * yLength - yLength / 2;
        if (Math.abs(x + 23) < 5 && Math.abs(z) < 5) continue;
        clone.position.set(x+12, 0.1, z);
        clone.rotation.y = Math.random() * Math.PI * 2;
        scene.add(clone);
    }
}



async function loadLamps(scene, interactionManager, objects) {
    const lampPost = await loadGLBModel('lampPost.glb');
    castShadow(lampPost);
    lampPost.position.set(-10, 0, -10);
    lampPost.scale.set(0.006, 0.006, 0.006);
    scene.add(lampPost);

    const light1 = addLight(-10, 0, -10);
    scene.add(light1);

    lampPost.interactive = true;
    interactionManager.add(lampPost);
    objects['lampPost'] = { object: lampPost, light: light1, clicked: false };
    addInteraction(lampPost, 'lampPost', objects);



    const lampPost2 = await loadGLBModel('lampPost.glb');
    castShadow(lampPost2);
    lampPost2.position.set(15, 0, 10);
    lampPost2.scale.set(0.006, 0.006, 0.006);
    scene.add(lampPost2);

    const light2 = addLight(15, 0, 10);
    scene.add(light2);

    lampPost2.interactive = true;
    interactionManager.add(lampPost2);
    objects['lampPost2'] = { object: lampPost2, light: light2, clicked: false };
    addInteraction(lampPost2, 'lampPost2', objects);



    const lampPost3 = await loadGLBModel('lampPost.glb');
    castShadow(lampPost3);
    lampPost3.position.set(-30, 0, -20);
    lampPost3.scale.set(0.006, 0.006, 0.006);
    scene.add(lampPost3);

    const light3 = addLight(-30, 0, -20);
    scene.add(light3);

    lampPost3.interactive = true;
    interactionManager.add(lampPost3);
    objects['lampPost3'] = { object: lampPost3, light: light3, clicked: false };
    addInteraction(lampPost3, 'lampPost3', objects);



    const lampPost4 = await loadGLBModel('lampPost.glb');
    castShadow(lampPost4);
    lampPost4.position.set(-30, 0, 20);
    lampPost4.scale.set(0.006, 0.006, 0.006);
    scene.add(lampPost4);

    const light4 = addLight(-30, 0, 20);
    scene.add(light4);

    lampPost4.interactive = true;
    interactionManager.add(lampPost4);
    objects['lampPost4'] = { object: lampPost4, light: light4, clicked: false };
    addInteraction(lampPost4, 'lampPost4', objects);
}


function addLight(x, y, z) {
    const pointlight = new THREE.PointLight(0xffffff, 55, 100);
    pointlight.position.set(x, y, z);
    castShadow(pointlight);
    return pointlight;
}

export function updateLightPosition(objects) {
    for (const key in objects) {
        const lampData = objects[key];
        if (lampData.object && lampData.light) {
            const lampPost = lampData.object;
            const light = lampData.light;

            light.position.set(
                lampPost.position.x,
                lampPost.position.y + 5.2,
                lampPost.position.z
            );
        }
    }
}


async function loadTrees(scene, interactionManager, objects) {
    const st = await gltfLoader.loadAsync(
        `${BASE_PATH}models/trees/smallTree.glb`
    );
    const mt = await gltfLoader.loadAsync(
        `${BASE_PATH}models/trees/mediumTree.glb`
    );
    const bt = await gltfLoader.loadAsync(
        `${BASE_PATH}models/trees/bigTree.glb`
    );


    let tree1 = createTree(-17, 0, -17, 'l', scene, st, mt, bt);
    scene.add(tree1);
    tree1.interactive = true;
    interactionManager.add(tree1);
    objects['tree1'] = { object: tree1, clicked: false };
    addInteraction(tree1, 'tree1', objects);
    
    let tree2 = createTree(-7, 0, -10, 'm', scene, st, mt, bt);
    // scene.add(tree2);
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
    
    let tree4 = createTree(3, 0, -10, 's', scene, st, mt, bt);
    scene.add(tree4);
    tree4.interactive = true;
    interactionManager.add(tree4);
    objects['tree4'] = { object: tree4, clicked: false };
    addInteraction(tree4, 'tree4', objects);
    
    let tree5 = createTree(12, 0, 10, 'l', scene, st, mt, bt);
    scene.add(tree5);
    tree5.interactive = true;
    interactionManager.add(tree5);
    objects['tree5'] = { object: tree5, clicked: false };
    addInteraction(tree5, 'tree5', objects);
    
    let tree6 = createTree(-12, 0, 17, 'm', scene, st, mt, bt);
    // scene.add(tree6);
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
    // scene.add(tree9);
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
    // scene.add(tree12);
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
    
    let tree14 = createTree(-22, 0, 12, 's', scene, st, mt, bt);
    scene.add(tree14);
    tree14.interactive = true;
    interactionManager.add(tree14);
    objects['tree14'] = { object: tree14, clicked: false };
    addInteraction(tree14, 'tree14', objects);
    
    let tree15 = createTree(1, 0, -20, 'm', scene, st, mt, bt);
    // scene.add(tree15);
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
    
    let tree17 = createTree(-25, 0, 3, 's', scene, st, mt, bt);
    scene.add(tree17);
    tree17.interactive = true;
    interactionManager.add(tree17);
    objects['tree17'] = { object: tree17, clicked: false };
    addInteraction(tree17, 'tree17', objects);
    
    let tree18 = createTree(-26, 0, -8, 'm', scene, st, mt, bt);
    // scene.add(tree18);
    tree18.interactive = true;
    interactionManager.add(tree18);
    objects['tree18'] = { object: tree18, clicked: false };
    addInteraction(tree18, 'tree18', objects);
    
    let tree19 = createTree(-20, 0, 20, 'l', scene, st, mt, bt);
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

async function addRoad(scene, interactionManager, objects) {
    const road1 = await loadGLBModel('road.glb');
    castShadow(road1);
    road1.interactive = true;
    interactionManager.add(road1);
    road1.position.set(-37.4, -0.2, 38.7);
    road1.scale.set(0.015, 0.015, 0.015);
    scene.add(road1);


    const road2 = await loadGLBModel('road.glb');
    castShadow(road2);
    road2.interactive = true;
    interactionManager.add(road2);
    road2.position.set(-37.4, -0.2, 20);
    road2.scale.set(0.015, 0.015, 0.015);
    scene.add(road2);

    const road3 = await loadGLBModel('road.glb');
    castShadow(road3);
    road3.interactive = true;
    interactionManager.add(road3);
    road3.position.set(-37.4, -0.2, 1);
    road3.scale.set(0.015, 0.015, 0.015);
    scene.add(road3);

    const road4 = await loadGLBModel('road.glb');
    castShadow(road4);
    road4.interactive = true;
    interactionManager.add(road4);
    road4.position.set(-37.4, -0.2, -19);
    road4.scale.set(0.015, 0.015, 0.015);
    scene.add(road4);

    const road5 = await loadGLBModel('road.glb');
    castShadow(road5);
    road5.interactive = true;
    interactionManager.add(road5);
    road5.position.set(-37.4, -0.2, -38.7);
    road5.scale.set(0.015, 0.015, 0.015);
    scene.add(road5);

}


function createPath(x, y, z, type, scene, sp, s3, s2, s7b, s7s, interactionManager) {
    let path = null;
    switch (type) {
        case 'sp':
            path = sp.scene.clone();
            break;
        case 's3':
            path = s3.scene.clone();
            break;
        case 's2':
            path = s2.scene.clone();
            break;
        case 's7b':
            path = s7b.scene.clone();
            break;
        case 's7s':
            path = s7s.scene.clone();
            break;
    }
    path.scale.set(1, 1, 1);
    path.position.set(x, y, z);
    castShadow(path);
    path.interactive = true;
    interactionManager.add(path);
    return path;
}

async function addPath(scene, interactionManager, objects) {
    const sp = await gltfLoader.loadAsync(
        `${BASE_PATH}models/pathway/stonePath.glb`
    );
    const s3 = await gltfLoader.loadAsync(
        `${BASE_PATH}models/pathway/stone3.glb`
    );
    const s2 = await gltfLoader.loadAsync(
        `${BASE_PATH}models/pathway/stone2.glb`
    );
    const s7b = await gltfLoader.loadAsync(
        `${BASE_PATH}models/pathway/stone7big.glb`
    );
    const s7s = await gltfLoader.loadAsync(
        `${BASE_PATH}models/pathway/stone7small.glb`
    );

    let path1 = createPath(-25, 0, 7.5, 'sp', scene, sp, s3, s2, s7b, s7s, interactionManager);
    path1.rotation.y = Math.PI / 2;
    scene.add(path1);
    objects['path1'] = { object: path1, clicked: false };
    addInteraction(path1, 'path1', objects);

    let path2 = createPath(-16.5, 0, 7.5, 'sp', scene, sp, s3, s2, s7b, s7s, interactionManager);
    path2.rotation.y = Math.PI / 2;
    scene.add(path2);
    objects['path2'] = { object: path2, clicked: false };
    addInteraction(path2, 'path2', objects);

    let path3 = createPath(-8, 0, 7.5, 'sp', scene, sp, s3, s2, s7b, s7s, interactionManager);
    path3.rotation.y = Math.PI / 2;
    scene.add(path3);
    objects['path3'] = { object: path3, clicked: false };
    addInteraction(path3, 'path3', objects);

    let path4 = createPath(-8, 0, 2.5, 'sp', scene, sp, s3, s2, s7b, s7s, interactionManager);
    scene.add(path4);
    objects['path4'] = { object: path4, clicked: false };
    addInteraction(path4, 'path4', objects);

    let path5 = createPath(-8, 0, -2.5, 's7b', scene, sp, s3, s2, s7b, s7s, interactionManager);
    scene.add(path5);
    objects['path5'] = { object: path5, clicked: false };
    addInteraction(path5, 'path5', objects);

    let path6 = createPath(-8, 0, -4, 's7b', scene, sp, s3, s2, s7b, s7s, interactionManager);
    scene.add(path6);
    objects['path6'] = { object: path6, clicked: false };
    addInteraction(path6, 'path6', objects);

    let path7 = createPath(-8, 0, -5.5, 's7b', scene, sp, s3, s2, s7b, s7s, interactionManager);
    scene.add(path7);
    objects['path7'] = { object: path7, clicked: false };
    addInteraction(path7, 'path7', objects);

    let path8 = createPath(-8, 0, -7, 's7b', scene, sp, s3, s2, s7b, s7s, interactionManager);
    scene.add(path8);
    objects['path8'] = { object: path8, clicked: false };
    addInteraction(path8, 'path8', objects);

    let path9 = createPath(-3, 0, -7, 'sp', scene, sp, s3, s2, s7b, s7s, interactionManager);
    path9.rotation.y = Math.PI / 2;
    scene.add(path9);
    objects['path9'] = { object: path9, clicked: false };
    addInteraction(path9, 'path9', objects);

    let path10 = createPath(2, 0, -7, 's7b', scene, sp, s3, s2, s7b, s7s, interactionManager);
    scene.add(path10);
    objects['path10'] = { object: path10, clicked: false };
    addInteraction(path10, 'path10', objects);

    let path11 = createPath(3.5, 0, -7, 's7b', scene, sp, s3, s2, s7b, s7s, interactionManager);
    scene.add(path11);
    objects['path11'] = { object: path11, clicked: false };
    addInteraction(path11, 'path11', objects);

    let path12 = createPath(5, 0, -7, 's7b', scene, sp, s3, s2, s7b, s7s, interactionManager);
    scene.add(path12);
    objects['path12'] = { object: path12, clicked: false };
    addInteraction(path12, 'path12', objects);

    let path13 = createPath(6.5, 0, -3.5, 'sp', scene, sp, s3, s2, s7b, s7s, interactionManager);
    scene.add(path13);
    objects['path13'] = { object: path13, clicked: false };
    addInteraction(path13, 'path13', objects);

    let path14 = createPath(6.5, 0, 4, 'sp', scene, sp, s3, s2, s7b, s7s, interactionManager);
    scene.add(path14);
    objects['path14'] = { object: path14, clicked: false };
    addInteraction(path14, 'path14', objects);

    let path15 = createPath(4.75, 0, 7.5, 's7b', scene, sp, s3, s2, s7b, s7s, interactionManager);
    scene.add(path15);
    objects['path15'] = { object: path15, clicked: false };
    addInteraction(path15, 'path15', objects);

    let path16 = createPath(3.2, 0, 7.5, 's7b', scene, sp, s3, s2, s7b, s7s, interactionManager);
    scene.add(path16);
    objects['path16'] = { object: path16, clicked: false };
    addInteraction(path16, 'path16', objects);

    let path17 = createPath(1.7, 0, 7.5, 's7b', scene, sp, s3, s2, s7b, s7s, interactionManager);
    scene.add(path17);
    objects['path17'] = { object: path17, clicked: false };
    addInteraction(path17, 'path17', objects);

    let path18 = createPath(0.1, 0, 7.5, 's7b', scene, sp, s3, s2, s7b, s7s, interactionManager);
    scene.add(path18);
    objects['path18'] = { object: path18, clicked: false };
    addInteraction(path18, 'path18', objects);

    let path19 = createPath(-1.3, 0, 7.5, 's7b', scene, sp, s3, s2, s7b, s7s, interactionManager);
    scene.add(path19);
    objects['path19'] = { object: path19, clicked: false };
    addInteraction(path19, 'path19', objects);

    let path20 = createPath(-2.9, 0, 7.5, 's7b', scene, sp, s3, s2, s7b, s7s, interactionManager);
    scene.add(path20);
    objects['path20'] = { object: path20, clicked: false };
    addInteraction(path20, 'path20', objects);

}
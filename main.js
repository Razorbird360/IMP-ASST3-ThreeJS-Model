import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { loadGrass, loadObjects, moveObject, updateLightPosition } from './objects.js';
import { resize } from './camera.js';
import { InteractionManager } from 'three.interactive';
import { updateLights, createLights } from './lights.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x808080);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#canvas'),
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 6, 7);

const controls = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(7);
scene.add(axesHelper);

window.addEventListener('resize', () => resize(renderer, camera));

// Create a canvas for the gradient texture
const groundTexture = document.createElement("canvas");
groundTexture.width = 1024;
groundTexture.height = 1024;
const ctx = groundTexture.getContext("2d");

const gradient = ctx.createRadialGradient(
  groundTexture.width / 2,
  groundTexture.height / 2,
  0,
  groundTexture.width / 2,
  groundTexture.height / 2,
  groundTexture.width / 2
);
gradient.addColorStop(0, "#5AC45A");
gradient.addColorStop(0.3, "#228B22");

ctx.fillStyle = gradient;
ctx.fillRect(0, 0, groundTexture.width, groundTexture.height);
const texture = new THREE.CanvasTexture(groundTexture);
const planeGeometry = new THREE.PlaneGeometry(100, 100);
const planeMaterial = new THREE.MeshStandardMaterial({
  map: texture,
  side: THREE.DoubleSide,
});
const ground = new THREE.Mesh(planeGeometry, planeMaterial);
ground.receiveShadow = true;
scene.add(ground);

// Rotate ground to be flat
ground.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);

const lights = createLights(scene, renderer);



let objects = {};
let selectedObject = null;

const keys = {
  Up: false,
  Down: false,
  Left: false,
  Right: false,
  Shift: false,
  Space: false,
  l: 1
};

window.addEventListener('keydown', (event) => {
  updateKeys(event, true);
});

window.addEventListener('keyup', (event) => {
  if (event.key === 'l') {
    return;
  }
  updateKeys(event, false);
});

function updateKeys(event, isPressed) {
  const toggleKey = (key) => {
    if (keys.hasOwnProperty(key)) {
      keys[key] = isPressed;
    }
  };

  if (event.key === 'ArrowUp') {
    toggleKey('Up');
    toggleKey('w');
  } else if (event.key === 'ArrowDown') {
    toggleKey('Down');
    toggleKey('s');
  } else if (event.key === 'ArrowLeft') {
    toggleKey('Left');
    toggleKey('a');
  } else if (event.key === 'ArrowRight') {
    toggleKey('Right');
    toggleKey('d');
  } else if (event.key === 'w') {
    toggleKey('Up');
    toggleKey('w');
  } else if (event.key === 's') {
    toggleKey('Down');
    toggleKey('s');
  } else if (event.key === 'a') {
    toggleKey('Left');
    toggleKey('a');
  } else if (event.key === 'd') {
    toggleKey('Right');
    toggleKey('d');
  } else if (event.key === ' ') {
    toggleKey('Space');
  } else if (event.key === 'Shift') {
    toggleKey('Shift');
  } else if (event.key === 'l') {
    if (keys.l === 1) {
      keys.l = 2;
    } else if (keys.l === 2) {
      keys.l = 3;
    } else if (keys.l === 3) {
      keys.l = 4;
    } else if (keys.l === 4) {
      keys.l = 1;
    }
  }
}



loadGrass(scene);



const interactionManager = new InteractionManager(renderer, camera, renderer.domElement);
async function init() {
  objects = await loadObjects(scene, objects, interactionManager);
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);

    if (interactionManager) {
      interactionManager.update();
    }
    moveObject(objects, keys);
    updateLightPosition(objects);
    
    console.log(keys.l);

    updateLights(scene, lights, keys);
  }
  animate();
}
init();









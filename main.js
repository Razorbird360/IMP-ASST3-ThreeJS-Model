import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { loadGrass, loadObjects, moveObject } from './objects.js';
import { resize } from './camera.js';
import { InteractionManager } from 'three.interactive';

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

const axesHelper = new THREE.AxesHelper(5);
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

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(100, 100, 70);
directionalLight.target.position.set(0, 0, 0);
directionalLight.castShadow = true;

directionalLight.shadow.mapSize.width = 1024; 
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.1; 
directionalLight.shadow.camera.far = 200;
directionalLight.shadow.camera.left = -50; 
directionalLight.shadow.camera.right = 50;
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.bottom = -50;

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

scene.add(directionalLight);



let objects = {};
let selectedObject = null;

const keys = {
  Up: false,
  Down: false,
  Left: false,
  Right: false,
  Shift: false,
  Space: false
};

window.addEventListener('keydown', (event) => {
    updateKeys(event, true);
});

window.addEventListener('keyup', (event) => {
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
  }
  animate();
}
init();
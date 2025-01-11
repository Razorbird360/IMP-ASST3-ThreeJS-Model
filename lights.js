import * as THREE from 'three';
import { castShadow } from './objects';

export function updateLights(scene, lights, keys) {
    if (keys.l === 1) {
        lights.directionalLight.position.set(100, 100, 60);
        lights.directionalLight.intensity = 2;
        lights.ambientLight.intensity = 1;
    }
    else if (keys.l === 2) {
        lights.directionalLight.position.set(-100, 100, 60);
        lights.directionalLight.intensity = 2;

    }
    else if (keys.l === 3) {
        lights.directionalLight.position.set(0, 100, 0);
        lights.directionalLight.intensity = 2;
    }
    else if (keys.l === 4) {
        lights.directionalLight.position.set(-60, 100, -100);
        lights.directionalLight.intensity = 2;
    }
    else if (keys.l === 5) {
        lights.directionalLight.position.set(60, 100, -100);
        lights.directionalLight.intensity = 2;
    }
    else if (keys.l === 6) {
        lights.directionalLight.intensity = 0.15;
        lights.ambientLight.intensity = 0.08;
    }
    else if (keys.l === 7) {
        lights.directionalLight.intensity = 0;
        lights.ambientLight.intensity = 0.05;
    }

}

export function createLights(scene, renderer) {
    const lights = {};
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    lights.ambientLight = ambientLight;
    castShadow(lights.ambientLight);
    
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(100, 100, 60);
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
    lights.directionalLight = directionalLight;
    castShadow(lights.directionalLight);
    
    scene.add(directionalLight);
    return lights;
}


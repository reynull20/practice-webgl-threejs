import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'

// Import all texture
import starTex from '../img/stars.jpg'
import earthTex from '../img/earth.jpg'
import jupiterTex from '../img/jupiter.jpg'
import marsTex from '../img/mars.jpg'
import mercuryTex from '../img/mercury.jpg'
import neptuneTex from '../img/neptune.jpg'
import plutoTex from '../img/pluto.jpg'
import saturnTex from '../img/saturn.jpg'
import saturnRingTex from '../img/saturn ring.png'
import sunTex from '../img/sun.jpg'
import uranusTex from '../img/uranus.jpg'
import uranusRingTex from '../img/uranus ring.png'
import venusTex from '../img/venus.jpg'

// Load GLB object (3d object made from software like Blender)
const monkeyUrl = new URL('../assets/monkey.glb', import.meta.url);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth,window.innerHeight);
// set render shadow true
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

// Axis Helper. Will show on canvas
const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

// move the camera from its default position (0,0,0)
camera.position.set(-10,10,10);
orbit.update();

// grid helper
const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

// Add ambient light
const ambientLight = new THREE.AmbientLight(
    color = 0x333333
)
scene.add(ambientLight);

// Add background texture
const skybox = new THREE.CubeTextureLoader();
scene.background = skybox.load([
    starTex,
    starTex,
    starTex,
    starTex,
    starTex,
    starTex
])

const textureLoader = new THREE.TextureLoader();

const rayCaster = new THREE.Raycaster();

function animate(time) {
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
});

const mousePosition = new THREE.Vector2();
window.addEventListener('mousemove', (e) => {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = - (e.clientY / window.innerHeight) * 2 + 1;
})
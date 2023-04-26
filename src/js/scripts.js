import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

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
camera.position.set(-10,30,30);
orbit.update();

// add Object
const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({color: 0x00FF00});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

// Create plane
const planeGeometry = new THREE.PlaneGeometry(30,30);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    side: THREE.DoubleSide
});;
const plane = new THREE.Mesh(planeGeometry,planeMaterial);
scene.add(plane);

// rotate the plane
plane.rotation.x = Math.PI * -90 / 180;
plane.receiveShadow = true;

// grid helper
const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

// add sphere
const sphereGeometry = new THREE.SphereGeometry(4, 40, 40);
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xffea00,
    wireframe: false
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// transform the sphere
sphere.position.set(-10,10,0);

// enable sphere to cast shadow
sphere.castShadow = true;

// // add ambient light
// const ambientlight = new THREE.AmbientLight(0x333333);
// scene.add(ambientlight);

// const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
// scene.add(directionalLight);
// directionalLight.position.set(-30,50,0);
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.bottom = -12;

// // directional light helper
// const dirlightHelper = new THREE.DirectionalLightHelper(directionalLight,5);
// scene.add(dirlightHelper);

// // setting for shadow camera of directional light
// // directional light use orthographic camear
// const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(dLightShadowHelper);

// Add Spotlight
const spotlight = new THREE.SpotLight(0xFFFFFF);
scene.add(spotlight);
spotlight.position.set(-50, 50, 0);
spotlight.castShadow = true;
spotlight.angle = 0.3;

// add spotlight helper
const spotlightHelper = new THREE.SpotLightHelper(spotlight);
scene.add(spotlightHelper);

// Immediate GUI for debugging
const gui = new dat.GUI();
const options = {
    sphereColor: '#ffea00',
    wireframe: false,
    speed: 0.01,
    angle: 0.2,
    penumbra: 0,
    intensity: 1
};

// Populate the IMGUI
// Sphere Color
gui.addColor(options, 'sphereColor').onChange((e) => {
    sphere.material.color.set(e);
})
// Sphere Wireframe switch
gui.add(options,'wireframe').onChange((e) => {
    sphere.material.wireframe = e;
})
// Sphere bouncing speed
gui.add(options, 'speed', 0, 0.1);
// Spotlight Angle
gui.add(options, 'angle', 0, 1);
// Spotlight Penumbra
gui.add(options, 'penumbra', 0, 1);
// Spotlight Intensity
gui.add(options, 'intensity',0, 1);

// Animate box object
let step = 0;
function animate(time) {
    box.rotation.x = time / 1000;
    box.rotation.y = time / 1000;

    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step));

    spotlight.angle = options.angle;
    spotlight.penumbra = options.penumbra;
    spotlight.intensity = options.intensity;
    spotlightHelper.update();

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

renderer.render(scene,camera)
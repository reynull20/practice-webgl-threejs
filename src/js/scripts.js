import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

import nebula from '../img/nebula.jpg'
import stars from '../img/stars.jpg'

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

// add Fog
// Alt 1
// scene.fog = new THREE.Fog(0xFFFFFF,0,200);
// ALt 2
scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01)

// Change Renderer background (Unity Equeal : Skybox)
// renderer.setClearColor(0xFF00FF);

// Load Texture
// 2D Texture
const textureLoader = new THREE.TextureLoader();
// scene.background = textureLoader.load(stars);
// Cube Texture
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    stars,
    stars,
    stars,
    stars,
    stars,
    stars
])

const box2Geometry = new THREE.BoxGeometry(4,4,4);
const box2Material = new THREE.MeshBasicMaterial({
    map: textureLoader.load(nebula)
});
const box2MultiMaterial = [
    new THREE.MeshBasicMaterial
]
const box2 = new THREE.Mesh(box2Geometry,box2Material);
scene.add(box2);
box2.position.set(10,10,5);
// box2.material.map = textureLoader.load(nebula)

const plane2Geometry = new THREE.PlaneGeometry(10,10,10,10);
const plane2Material = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    wireframe: true
})
const plane2 = new THREE.Mesh(plane2Geometry, plane2Material);
scene.add(plane2)
plane2.position.set(10,10,15)

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

const mousePosition = new THREE.Vector2();
window.addEventListener('mousemove', (e) => {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = - (e.clientY / window.innerHeight) * 2 + 1;
})

const rayCaster = new THREE.Raycaster();

const sphereId = sphere.id;
box2.name = 'THe Box'

function animate(time) {
    box.rotation.x = time / 1000;
    box.rotation.y = time / 1000;

    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step));

    spotlight.angle = options.angle;
    spotlight.penumbra = options.penumbra;
    spotlight.intensity = options.intensity;
    spotlightHelper.update();

    rayCaster.setFromCamera(mousePosition, camera);
    const intersects = rayCaster.intersectObjects(scene.children);

    for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.id === sphereId) {
            intersects[i].object.material.color.set(0xFF0000);
        }

        if (intersects[i].object.name === 'THe Box') {
            intersects[i].object.rotation.x = time / 1000;
            intersects[i].object.rotation.y = time / 1000;
        }
    }

    // plane2.geometry.attributes.position.array[0] = 10 * Math.random();
    // plane2.geometry.attributes.position.array[1] = 10 * Math.random();
    // plane2.geometry.attributes.position.array[2] = 10 * Math.random();
    // const lastpointZ = plane2.geometry.attributes.position.array.length - 1;
    // plane2.geometry.attributes.position.array[lastpointZ] = 10 * Math.random();
    // plane2.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

renderer.render(scene,camera)
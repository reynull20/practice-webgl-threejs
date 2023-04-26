import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth,window.innerHeight);

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
const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    side: THREE.DoubleSide
});;
const plane = new THREE.Mesh(planeGeometry,planeMaterial);
scene.add(plane);

// rotate the plane
plane.rotation.x = Math.PI * -90 / 180;

// grid helper
const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

// add sphere
const sphereGeometry = new THREE.SphereGeometry(4, 40, 40);
const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0xffea00,
    wireframe: false
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// transform the sphere
sphere.position.set(-10,10,0);

// Immediate GUI for debugging
const gui = new dat.GUI();
const options = {
    sphereColor: '#ffea00',
    wireframe: false,
    speed: 0.01
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

// Animate box object
let step = 0;
function animate(time) {
    box.rotation.x = time / 1000;
    box.rotation.y = time / 1000;

    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step));

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

renderer.render(scene,camera)
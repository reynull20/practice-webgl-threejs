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

// move the camera from its default position (0,0,0)
camera.position.set(-100,250,250);
orbit.update();

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

// Create Texture loader
const textureLoader = new THREE.TextureLoader();

// Add pointlight
 const pointlight = new THREE.PointLight(0xFFFFFF,2,300)
scene.add(pointlight);

// Add sun
const sunGeo = new THREE.SphereGeometry(16,20,20);
const sunMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load(sunTex)
})
const sun = new THREE.Mesh(sunGeo, sunMat);

// Add Saturn Ring
const saturnRingGeo = new THREE.RingGeometry(10,20,30)
const saturnRingMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load(saturnRingTex),
    side: THREE.DoubleSide
})
const saturnRing = new THREE.Mesh(saturnRingGeo,saturnRingMat);
const saturnRingObj = new THREE.Object3D().add(saturnRing)
saturnRing.position.set(130,0,0)
saturnRing.rotateX(0.5 * Math.PI)

// Add object to scene
scene.add(sun);

// Add objects
const mercury = createPlanets(3.2,mercuryTex,28)
const saturn = createPlanets(10, saturnTex, 130);
saturn.obj.add(saturnRing)

function animate(time) {
    // Sun rotation
    sun.rotateY(0.0004);
    mercury.mesh.rotateY(0.001);
    mercury.obj.rotateY(0.01);
    // venus.applyQuaternion(
    //     new THREE.Quaternion().setFromAxisAngle(
    //         new THREE.Vector3(0,1,0),
    //         0.0007 * Math.PI / 2
    //     )
    // )
    saturn.mesh.rotateY(0.0038)
    saturn.obj.rotateY(0.001)

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

function createPlanets(size, texture, position) {
    const planetGeo = new THREE.SphereGeometry(size,20,20)
    const planetMat = new THREE.MeshBasicMaterial({
        map: textureLoader.load(texture)
    })
    const planet = new THREE.Mesh(planetGeo,planetMat)
    const planetObj = new THREE.Object3D().add(planet)
    scene.add(planetObj)
    planet.position.x = position;

    return {mesh: planet, obj: planetObj}
}
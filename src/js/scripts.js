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

// Add object to scene
scene.add(sun);

// Add objects
const mercury = createPlanets(3.2,mercuryTex,28)
const venus = createPlanets(5.8, venusTex, 44)
const earth = createPlanets(6, earthTex, 62);
const mars = createPlanets(4, marsTex, 78);
const jupiter = createPlanets(12, jupiterTex, 100);
const saturn = createPlanets(10, saturnTex, 135,{
    innerRadius: 10,
    outerRadius: 20,
    texture: saturnRingTex
});
const uranus = createPlanets(7,uranusTex,181,{
    innerRadius: 7,
    outerRadius: 20,
    texture: uranusRingTex
}) 
const neptune = createPlanets(7, neptuneTex, 230);
const pluto = createPlanets(2.8, plutoTex, 246);  

function animate(time) {
    // Sun rotation
    sun.rotateY(0.0004);

    // Planet rotation
    mercury.mesh.rotateY(0.0004);
    venus.mesh.rotateY(0.0002);
    earth.mesh.rotateY(0.002);
    mars.mesh.rotateY(0.0018);
    jupiter.mesh.rotateY(0.004);
    saturn.mesh.rotateY(0.0038);
    uranus.mesh.rotateY(0.003);
    neptune.mesh.rotateY(0.0032);
    pluto.mesh.rotateY(0.0008);

    // planet Revolution
    mercury.obj.rotateY(0.004);
    venus.obj.rotateY(0.0015);
    earth.obj.rotateY(0.001);
    mars.obj.rotateY(0.0008);
    jupiter.obj.rotateY(0.0002);
    saturn.obj.rotateY(0.00009);
    uranus.obj.rotateY(0.00004);
    neptune.obj.rotateY(0.00001);
    pluto.obj.rotateY(0.000007);

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

/**
 * 
 * @param {Number} size Size of the planet 
 * @param {Texture} texture Texture of the planet
 * @param {Number} position Offset of the planet in x axis
 * @param {Ring} ring Custom ring object
 * @returns 
 */
function createPlanets(size, texture, position, ring) {
    const planetGeo = new THREE.SphereGeometry(size,20,20)
    const planetMat = new THREE.MeshBasicMaterial({
        map: textureLoader.load(texture)
    })
    const planet = new THREE.Mesh(planetGeo,planetMat)
    const planetObj = new THREE.Object3D().add(planet)
    
    // Add Ring if exist
    if (ring) {
        const ringGeo = new THREE.RingGeometry(
            ring.innerRadius,
            ring.outerRadius,
            32
        )
        const ringMat = new THREE.MeshBasicMaterial({
            map: textureLoader.load(ring.texture),
            side: THREE.DoubleSide
        })
        const ringMesh = new THREE.Mesh(ringGeo,ringMat);
        planetObj.add(ringMesh)
        ringMesh.position.set(position,0,0)
        ringMesh.rotateX(0.5 * Math.PI)
    }
    
    scene.add(planetObj)
    planet.position.x = position;

    return {mesh: planet, obj: planetObj}
}
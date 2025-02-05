import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';


const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

//creating scene
const scene = new THREE.Scene();


//init camera
const camera = new THREE.PerspectiveCamera(
    45, //field of view= basically ranges between 40-80
    window.innerWidth / window.innerHeight, //aspect ratio
    0.1, //near view
    1000 //far view
)

//orbit with camera and renderer elements
const orbit = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(2); //lengths of the axis

//add axes to the scene
scene.add(axesHelper);


//camera will point to the 0,0 axes
//so we have to move the camera to see the axes
camera.position.set(-10, 30, 30);

//==============IMPORTANT======================
//update orbits everytime we change the position of the camera
orbit.update();

//==============IMPORTANT======================



//adding a box inside axis
const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);


//adding plane material
const planeGeometry = new THREE.PlaneGeometry(30,30);
const planeMaterials = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    side: THREE.DoubleSide //prevent disappearence from other side
});
const plane = new THREE.Mesh(planeGeometry, planeMaterials);
scene.add(plane);


//adding a sphere element
const sphereGeometry = new THREE.SphereGeometry(4, 50, 50); //radius of the sphere
const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x0000FF,
    wireframe: true //lines of the edge of the sphere
})

// const sphereMaterial = new THREE.MeshStandardMaterial({
//     color: 0x0000FF,
//     wireframe: true //lines of the edge of the sphere
// })

// const sphereMaterial = new THREE.MeshLambertMaterial({
//     color: 0x0000FF,
//     wireframe: true //lines of the edge of the sphere
// })
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

//change the position of the sphere
sphere.position.set(-10, 10, 0);



//add grid helper
const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);


//to match plane with grid
plane.rotation.x = -0.5 * Math.PI;


function Animate(time) {
    box.rotation.x = time / 1000;
    box.rotation.y = time / 1000;


    //link the scene with camera
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(Animate);





//==============NOTES================
// The creation of an element of threejs have 3 phases:
//     1. Creation of the geometry or the skeleton of the 3d shape
    // 2. Creation of the materials (basically skin, color of the element)
    // 3. Cover the geometry with the material

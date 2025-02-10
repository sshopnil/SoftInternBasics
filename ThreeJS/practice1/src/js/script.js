import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import neebula from '../img/nebula.jpg';
import stars from '../img/stars.jpg';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


const monkeyUrl = new URL('../assets/monkey.glb', import.meta.url);
const headURL = new URL('../assets/liutenant_head/lieutenantHead.gltf', import.meta.url);

const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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
const planeMaterials = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    side: THREE.DoubleSide //prevent disappearence from other side
});

const plane = new THREE.Mesh(planeGeometry, planeMaterials);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;
scene.add(plane);



//add grid helper
const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

//adding a sphere element
const sphereGeometry = new THREE.SphereGeometry(4, 50, 50); //radius of the sphere
// const sphereMaterial = new THREE.MeshBasicMaterial({
//     color: '#c3c3c3',
//     wireframe: true //lines of the edge of the sphere
// })

const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0x0000FF,
    wireframe: false //lines of the edge of the sphere
})

// const sphereMaterial = new THREE.MeshLambertMaterial({
//     color: 0x0000FF,
//     wireframe: true //lines of the edge of the sphere
// })
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

//change the position of the sphere
sphere.position.set(-10, 10, 0);
sphere.castShadow = true;


//ambient light
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// //directional light
// const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
// scene.add(directionalLight);
// directionalLight.position.set(-30, 50, 0);
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.bottom = -15; //fix the position of shadow

// //directional light helper
// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight);
// scene.add(dLightHelper);

// const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(dLightShadowHelper);

//spot-light
const spotLight = new THREE.SpotLight( 0xffffff );
spotLight.position.set( -100, 100, 0 );
spotLight.decay = 0; //to get non physical lights
spotLight.angle=0.2;
// spotLight.map = new THREE.TextureLoader().load( url );

spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;


scene.add( spotLight );

const sLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(sLightHelper);



//to match plane with grid
plane.rotation.x = -0.5 * Math.PI;

//fog
scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01); //fade when zoomed out
// renderer.setClearColor(0xFFEA00);//change background color

//texture
const textureLoader = new THREE.TextureLoader();
// scene.background = textureLoader.load(stars);
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    stars,
    stars,
    stars,
    stars,
    stars,
    stars
])

//nebula object
const nebula_sphere_geo = new THREE.SphereGeometry(5);
const nebula_sphere_material = new THREE.MeshBasicMaterial({
    map: textureLoader.load(neebula)
});
const nebula_sphere = new THREE.Mesh(nebula_sphere_geo, nebula_sphere_material);
scene.add(nebula_sphere);
nebula_sphere.position.set(-10, 15, 10);
nebula_sphere.castShadow = true;


const liutenant_head_loader = new GLTFLoader();
liutenant_head_loader.load(headURL.href, (gltf)=>{
    const model = gltf.scene;
    scene.add(model);
    model.position.set(10, 15, 10);
}, undefined, (error) => {
    console.error('Error loading model:', error);
})

const monkeyLoader = new GLTFLoader();
monkeyLoader.load(monkeyUrl.href, (gltf)=>{
    const model = gltf.scene;
    scene.add(model);
    model.position.set(-5, 10, -12);

    model.castShadow = true;
    // Apply a material to the monkey model
    model.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
                color: 0xff6600, // Orange color
                metalness: 0.5,
                roughness: 0.5
            });
            child.castShadow = true;
        }
    });

    function animateModel() {
        requestAnimationFrame(animateModel);
        model.rotation.y += 0.01; // Rotating around the Y-axis
    }

    animateModel();
})


const gui = new dat.GUI();

const options = {
    sphereColor: '#ffea00',
    wireframe: false,
    speed: 0.01,
    angle: 0.2,
    penumbra: 0,
    intensity: 1,
    ambient: 10,
}

gui.addColor(options, 'sphereColor').onChange((e)=>{
    sphere.material.color.set(e);
});


gui.add(options, 'wireframe').onChange((e)=>{
    sphere.material.wireframe = e;
})

gui.add(options, 'speed', 0, 0.1);
gui.add(options, 'angle', 0, 0.1);
gui.add(options, 'penumbra', 0, 1);
gui.add(options, 'intensity', 0, 1);
gui.add(options, 'ambient', 0, 10);


let step = 0;
let speed = 0.01;

const mousePosition = new THREE.Vector2();

window.addEventListener('mousemove', (e)=>{
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

const raycaster = new THREE.Raycaster();

const nebula_sphere_id = nebula_sphere.id;


function Animate(time) {
    box.rotation.x = time / 1000;
    box.rotation.y = time / 1000;
    
//animate the ball bounce
    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step));
    
    ambientLight.intensity = options.ambient;

    spotLight.angle = options.angle;
    spotLight.penumbra = options.penumbra;
    spotLight.intensity = options.intensity;
    sLightHelper.update();


    raycaster.setFromCamera(mousePosition, camera);
    const intersectObjects = raycaster.intersectObjects(scene.children);


    // console.log(intersectObjects);

    for (let i = 0; i < intersectObjects.length; i++){
        if(intersectObjects[i].object.id === nebula_sphere_id){
            intersectObjects[i].object.rotation.y = time/1000;
        }
    }

    //link the scene with camera
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(Animate);

window.addEventListener('resize', ()=>{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})



//==============NOTES================
// The creation of an element of threejs have 3 phases:
//     1. Creation of the geometry or the skeleton of the 3d shape
    // 2. Creation of the materials (basically skin, color of the element)
    // 3. Cover the geometry with the material

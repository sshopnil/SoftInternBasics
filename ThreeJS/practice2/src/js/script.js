import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';

const hdrTextureURL = new URL('../assets/MR_INT-004_BigWindowTree_Thea.hdr', import.meta.url);

const renderer = new THREE.WebGLRenderer({antialias: true});

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

const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 0, 7);
orbit.update();

const axesHelper = new THREE.AxesHelper(4); //lengths of the axis

//add axes to the scene
// scene.add(axesHelper);

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.8;

const loader = new RGBELoader();
loader.load(hdrTextureURL, (texture)=>{
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;

    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(1, 50, 50),
        new THREE.MeshStandardMaterial({
            roughness: 0,
            metalness: 0.5,
            color: 0xFFEA00
        })
    )
    scene.add(sphere);
    sphere.position.set(-30, -10, 30);
});





function animate(){
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', ()=>{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})
"use client";

import { useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader';
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min";
import Stats from "three/examples/jsm/libs/stats.module";
import { useScene } from "./Scene";

const FaceMorph = () => {
    const sceneData = useScene();
    const facecapUrl = new URL("../../models/facecap.glb", import.meta.url);

    useEffect(() => {
        if (!sceneData) return;

        const { scene, renderer, camera } = sceneData;
        let mixer;
        const clock = new THREE.Clock();
        const stats = new Stats();
        document.body.appendChild(stats.dom);

        // Set up camera position
        camera.position.set(-1.8, 0.8, 3);

        // Set up environment
        const environment = new RoomEnvironment();
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        scene.background = new THREE.Color(0x666666);
        scene.environment = pmremGenerator.fromScene(environment).texture;

        // Load model
        const loader = new GLTFLoader();
        loader.setKTX2Loader(new KTX2Loader().setTranscoderPath("jsm/libs/basis/")).detectSupport(renderer);
        loader.setMeshoptDecoder(MeshoptDecoder);

        loader.load(facecapUrl.href, (gltf) => {
            const mesh = gltf.scene.children[0];
            scene.add(mesh);

            mixer = new THREE.AnimationMixer(mesh);
            mixer.clipAction(gltf.animations[0]).play();

            // Morph Targets GUI
            const head = mesh.getObjectByName("mesh_2");
            if (head) {
                const influences = head.morphTargetInfluences;
                const gui = new GUI();
                gui.close();

                for (const [key, value] of Object.entries(head.morphTargetDictionary)) {
                    gui.add(influences, value, 0, 1, 0.01)
                        .name(key.replace("blendShape1.", ""))
                        .listen();
                }
            }
        });

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.minDistance = 2.5;
        controls.maxDistance = 5;
        controls.minAzimuthAngle = -Math.PI / 2;
        controls.maxAzimuthAngle = Math.PI / 2;
        controls.maxPolarAngle = Math.PI / 1.8;
        controls.target.set(0, 0.15, -0.2);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            if (mixer) mixer.update(clock.getDelta());
            renderer.render(scene, camera);
            controls.update();
            stats.update();
        };
        animate();

        return () => {
            if (mixer) mixer.stopAllAction();
            document.body.removeChild(stats.dom);
        };
    }, [sceneData]);

    return null;
};

export default FaceMorph;
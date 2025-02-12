"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { useScene } from "./Scene";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js"; // Ensure this import is correct

const VoxelSceneWithAnimation = () => {
  const statsRef = useRef(null);
  const controlsRef = useRef(null);
  const sceneData = useScene();  // Use the custom hook to get scene, camera, and renderer

  useEffect(() => {
    if (!sceneData) return;

    const { scene, camera, renderer } = sceneData;
    if (!scene || !camera || !renderer) return;

    const clock = new THREE.Clock();

    // Use RoomEnvironment or default environment if unavailable
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    let environment;
    
    try {
      environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture; // Try using RoomEnvironment
    } catch (error) {
      console.error("RoomEnvironment not available, using default scene environment");
      environment = pmremGenerator.fromScene(new THREE.HemisphereLight(0xeeeeff, 0x777788, 1), 0.04).texture;
    }

    scene.environment = environment;

    // Setup OrbitControls
    controlsRef.current = new OrbitControls(camera, renderer.domElement);
    controlsRef.current.target.set(0, 0.5, 0);
    controlsRef.current.update();
    controlsRef.current.enablePan = false;
    controlsRef.current.enableDamping = true;

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("../../libs/jsm/decoder/draco/gltf/");

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    let mixer;

    // Load the model and start animation
    const tokyo = new URL("../../models/LittlestTokyo.glb", import.meta.url);

    loader.load(
      tokyo.href,
      function (gltf) {
        const model = gltf.scene;
        model.position.set(1, 1, 0);
        model.scale.set(0.01, 0.01, 0.01);
        scene.add(model);

        mixer = new THREE.AnimationMixer(model);
        mixer.clipAction(gltf.animations[0]).play();

        renderer.setAnimationLoop(animate);
      },
      undefined,
      function (e) {
        console.error(e);
      }
    );

    // Setup stats
    statsRef.current = new Stats();
    document.body.appendChild(statsRef.current.dom);

    // Handle window resizing
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Animation loop
    const animate = () => {
      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);
      controlsRef.current.update();
      statsRef.current.update();
      renderer.render(scene, camera);
    };

    // Cleanup on unmount
    return () => {
      // Remove everything from the scene
      scene.clear();

      // Remove stats
      if (statsRef.current) {
        document.body.removeChild(statsRef.current.dom);
      }

      // Remove OrbitControls and other event listeners
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }

      // Remove window resize listener
      window.removeEventListener("resize", handleResize);
    };
  }, [sceneData]);

  return <div id="container" style={{ width: "100%", height: "100vh" }} />;
};

export default VoxelSceneWithAnimation;

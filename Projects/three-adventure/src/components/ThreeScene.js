"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import CoffeeModel from "./CoffeeModel"; // Import CoffeeModel component
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import GryffendoreModel from "./GryffindoreModel";


const ThreeScene = () => {
    const mountRef = useRef(null);
    const [scene, setScene] = useState(null);
    const [camera, setCamera] = useState(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // Initialize renderer
        let renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        mountRef.current.appendChild(renderer.domElement);

        // Create scene
        const newScene = new THREE.Scene();
        newScene.background = new THREE.Color(0xeeeeee);

        // Camera setup
        const newCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
        newCamera.position.set(0, -1500, 2500);
        setCamera(newCamera); // Update state

        // Controls
        let controls = new OrbitControls(newCamera, renderer.domElement);
        controls.enableDamping = true;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 5);
        newScene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
        directionalLight.position.set(0, 500, 500);
        directionalLight.castShadow = true;
        newScene.add(directionalLight);

        setScene(newScene); // Update state after scene is initialized

        // Load 3D Text
        

        // Create Button (A Simple 3D Plane)
        const buttonGeometry = new THREE.PlaneGeometry(100, 50); // Rectangle button
        const buttonMaterial = new THREE.MeshBasicMaterial({ color: "grey", side: THREE.DoubleSide });

        const buttonMesh = new THREE.Mesh(buttonGeometry, buttonMaterial);
        buttonMesh.position.set(0, -550, 50); // Position it under coffee cup
        buttonMesh.name = "button"; // Set name to identify it later

        // buttonRef.current = buttonMesh;
        newScene.add(buttonMesh);
        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(newScene, newCamera);
        };
        animate();

        // // Cleanup
        // return () => {
        //     mountRef.current.removeChild(renderer.domElement);
        //     renderer.dispose();
        // };
        window.addEventListener('resize', ()=>{
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        })
    }, []);

    return (
        <div ref={mountRef} className="three-container">
            {scene && camera && <><CoffeeModel scene={scene} camera={camera} /></>}
            {scene && camera && <GryffendoreModel scene={scene} camera={camera}/>}
        </div>
    );
};

export default ThreeScene;

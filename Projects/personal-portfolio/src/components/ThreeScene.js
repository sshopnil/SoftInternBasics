"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


const ThreeScene = () => {
    const mountRef = useRef(null); // Reference for the container

    useEffect(() => {
        // Initialize renderer
        let renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;

        // Append renderer to the mount div
        mountRef.current.appendChild(renderer.domElement);

        // Create scene
        let scene = new THREE.Scene();
        scene.background = new THREE.Color(0x949494);

        // Camera setup
        let camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.set(0, 100, 200);


        // controls
        let controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = true;
        controls.minDistance = 100;
        controls.maxDistance = 500;
        controls.maxPolarAngle = Math.PI / 1.5;
        controls.target.set(0, 100, 0);


        // Lighting
        let light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(100, 100, 100);
        scene.add(light);

        // Ground
        let groundMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(600, 600),
            new THREE.MeshPhongMaterial({ color: 0xffffff, depthWrite: true })
        );
        groundMesh.rotation.x = -Math.PI / 2;
        scene.add(groundMesh);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        // Handle cleanup
        return () => {
            mountRef.current.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);



    return <div ref={mountRef} className="three-container" />;
};

export default ThreeScene;

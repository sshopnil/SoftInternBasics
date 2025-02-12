"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Creating Context
const SceneContext = createContext(null);

// Scene Component
export const Scene = ({ children }) => {
    const mountRef = useRef(null);
    const [sceneData, setSceneData] = useState(null);

    useEffect(() => {
        // Create Scene, Camera, Renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        const renderer = new THREE.WebGLRenderer({ antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        // Set Initial Camera Position
        camera.position.z = 5;

        scene.background = new THREE.Color(0xE0E0E0);

        // Controls
        let controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 5);
        scene.add(ambientLight);

        // Animation Loop
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Store Scene and Camera in Context
        setSceneData({ scene, camera, renderer});

        // Cleanup
        return () => {
            mountRef.current.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <SceneContext.Provider value={sceneData}>
            <div ref={mountRef} className="three-container">
                {sceneData && children}
            </div>
        </SceneContext.Provider>
    );
};

// Hook to Use Scene Context
export const useScene = () => {
    return useContext(SceneContext);
};

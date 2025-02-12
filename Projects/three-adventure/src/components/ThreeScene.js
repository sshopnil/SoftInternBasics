"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import CoffeeModel from "./CoffeeModel"; // Import CoffeeModel component
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';


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
        const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
        newScene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
        directionalLight.position.set(0, 500, 500);
        directionalLight.castShadow = true;
        newScene.add(directionalLight);

        setScene(newScene); // Update state after scene is initialized

        // Load 3D Text
        const loader = new FontLoader();
        loader.load('fonts/helvetiker_regular.typeface.json', function (font) {

            const color = new THREE.Color('#128cff');

            const matDark = new THREE.MeshBasicMaterial({
                color: color,
                side: THREE.DoubleSide
            });

            const matLite = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.4,
                side: THREE.DoubleSide
            });

            const message = ' Three.js\nExperience';

            const shapes = font.generateShapes(message, 100);

            const geometry = new THREE.ShapeGeometry(shapes);

            geometry.computeBoundingBox();

            const xMid = - 0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);

            geometry.translate(xMid, 0, 0);

            // make shape ( N.B. edge view not visible )

            const text = new THREE.Mesh(geometry, matLite);
            text.position.z = - 150;
            newScene.add(text);

            // make line shape ( N.B. edge view remains visible )

            const holeShapes = [];

            for (let i = 0; i < shapes.length; i++) {

                const shape = shapes[i];

                if (shape.holes && shape.holes.length > 0) {

                    for (let j = 0; j < shape.holes.length; j++) {

                        const hole = shape.holes[j];
                        holeShapes.push(hole);

                    }

                }

            }

            shapes.push.apply(shapes, holeShapes);

            const style = SVGLoader.getStrokeStyle(5, color.getStyle());

            const strokeText = new THREE.Group();

            for (let i = 0; i < shapes.length; i++) {

                const shape = shapes[i];

                const points = shape.getPoints();

                const geometry = SVGLoader.pointsToStroke(points, style);

                geometry.translate(xMid, 0, 0);

                const strokeMesh = new THREE.Mesh(geometry, matDark);
                strokeText.add(strokeMesh);

            }

            newScene.add(strokeText);

        }); //end load function

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(newScene, newCamera);
        };
        animate();

        // Cleanup
        return () => {
            mountRef.current.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);

    return (
        <div ref={mountRef} className="three-container">
            {scene && camera && <CoffeeModel scene={scene} camera={camera} />}
        </div>
    );
};

export default ThreeScene;

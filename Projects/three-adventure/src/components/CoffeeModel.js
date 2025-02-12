"use client";

import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useRouter } from 'next/navigation';
import Link from "next/link";

const CoffeeModel = ({ scene, camera }) => {
    const router = useRouter();
    const [showText, setShowText] = useState(false);
    const coffeeURL = new URL("../../models/coffee_cup.glb", import.meta.url);
    const mousePosition = new THREE.Vector2();


    


    const raycaster = new THREE.Raycaster();
    const coffeeRef = useRef(null); // Store reference to coffee model

    useEffect(() => {
        if (!scene || !camera) return;

        const loader = new GLTFLoader();
        loader.load(
            coffeeURL.href,
            (gltf) => {
                // Remove the old coffee model if it exists
                if (coffeeRef.current) {
                    scene.remove(coffeeRef.current);
                    coffeeRef.current.traverse((node) => {
                        if (node.isMesh) {
                            node.geometry.dispose();
                            node.material.dispose();
                        }
                    });
                    coffeeRef.current = null;
                }

                // Load new model
                const model = gltf.scene;
                model.scale.set(30, 30, 30);
                model.position.set(0, -500, 50);

                model.traverse((node) => {
                    if (node.isMesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                    }
                });

                coffeeRef.current = model;
                scene.add(model);
            },
            undefined,
            (error) => console.error("Error loading model:", error)
        );
        window.addEventListener('mousemove', (e)=>{
            mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
            mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        // return () => {
        //     window.removeEventListener("mousemove", handleMouseMove);
        // };
    }, [scene, camera]);

    useEffect(() => {
        if (!scene || !camera) return;

        const animate = (time) => {
            if (coffeeRef.current) {
                raycaster.setFromCamera(mousePosition, camera);
                const intersects = raycaster.intersectObject(coffeeRef.current, true);

                const isHovering = intersects.length > 0;
                setShowText(isHovering);
                document.body.style.cursor = isHovering ? "pointer" : "default";

                // Rotate the model if hovered
                if (isHovering) {
                    coffeeRef.current.rotation.y = time / 1000;
                }
            }

            requestAnimationFrame(animate);
        };

        animate(0);
    }, [scene, camera]);
};

export default CoffeeModel;

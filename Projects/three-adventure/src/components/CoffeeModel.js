"use client";

import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import Link from "next/link";  // Import Link from Next.js

const CoffeeModel = ({ scene, camera }) => {
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
                model.scale.set(40, 40, 40);
                model.position.set(0, -600, 50);

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

        const handleMouseMove = (e) => {
            mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
            mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
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

    return (
        <>
            {showText && (
                <Link
                    href="/buy-coffee" 
                >
                    <div
                        style={{
                            position: "absolute",
                            top: "95%", // Move text lower
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            color: "black",
                            fontSize: "20px",
                            background: "rgba(255, 255, 255, 0.9)",
                            padding: "12px 15px",
                            borderRadius: "12px",
                            fontWeight: "bold",
                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            cursor: "pointer"
                        }}
                    >
                        Buy Me a Coffee ☕
                    </div>
                </Link>
            )}
        </>
    );
};

export default CoffeeModel;

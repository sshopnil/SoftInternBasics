"use client";

import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useRouter } from 'next/navigation';
import Link from "next/link";

const GryffendoreModel = ({ scene, camera }) => {
    const router = useRouter();
    const [showText, setShowText] = useState(false);
    const gryffen = new URL("../../models/gryffindor_common_room.glb", import.meta.url);
    const mousePosition = new THREE.Vector2();


    


    const raycaster = new THREE.Raycaster();
    const gryffenRef = useRef(null); // Store reference to coffee model

    useEffect(() => {
        if (!scene || !camera) return;

        const loader = new GLTFLoader();
        loader.load(
            gryffen.href,
            (gltf) => {
                // Remove the old coffee model if it exists
                if (gryffenRef.current) {
                    scene.remove(gryffenRef.current);
                    gryffenRef.current.traverse((node) => {
                        if (node.isMesh) {
                            node.geometry.dispose();
                            node.material.dispose();
                        }
                    });
                    gryffenRef.current = null;
                }

                // Load new model
                const model = gltf.scene;
                model.scale.set(1000, 1000, 1000);
                model.position.set(500, -500, 50);

                model.traverse((node) => {
                    if (node.isMesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                    }
                });

                gryffenRef.current = model;
                scene.add(model);
            },
            undefined,
            (error) => console.error("Error loading model:", error)
        );

        window.addEventListener('mousemove', (e)=>{
            mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
            mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });
    }, [scene, camera]);

    useEffect(() => {
        if (!scene || !camera) return;
        

        const animate = (time) => {
            if (gryffenRef.current) {
                raycaster.setFromCamera(mousePosition, camera);
                const intersects = raycaster.intersectObject(gryffenRef.current, true);

                const isHovering = intersects.length > 0;
                // setShowText(isHovering);
                console.log(intersects);
                document.body.style.cursor = isHovering ? "pointer" : "default";

                // Rotate the model if hovered
                if (isHovering) {
                    gryffenRef.current.rotation.y = time / 1000;
                }
            }

            requestAnimationFrame(animate);
        };

        animate(0);
    }, [scene, camera]);
};

export default GryffendoreModel;

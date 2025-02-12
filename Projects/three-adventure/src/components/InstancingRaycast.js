"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { useScene } from "./Scene";

const InstancingRaycast = () => {
    const sceneData = useScene();
    const statsRef = useRef(null);
    const controlsRef = useRef(null);

    useEffect(() => {
        if (!sceneData) return;

        const { scene, camera, renderer } = sceneData;
        if (!scene || !camera || !renderer) return;

        const amount = 10;
        const count = Math.pow(amount, 3);
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2(1, 1);
        const color = new THREE.Color();
        const white = new THREE.Color().setHex(0xffffff);

        camera.position.set(10, 20, 20)

        // Setup lights
        const light = new THREE.HemisphereLight(0xffffff, 0x888888, 3);
        light.position.set(0, 1, 0);
        scene.add(light);

        // Create instanced mesh
        const geometry = new THREE.IcosahedronGeometry(0.5, 3);
        const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const mesh = new THREE.InstancedMesh(geometry, material, count);

        let i = 0;
        const offset = (amount - 1) / 2;
        const matrix = new THREE.Matrix4();

        for (let x = 0; x < amount; x++) {
            for (let y = 0; y < amount; y++) {
                for (let z = 0; z < amount; z++) {
                    matrix.setPosition(offset - x, offset - y, offset - z);
                    mesh.setMatrixAt(i, matrix);
                    mesh.setColorAt(i, color);
                    i++;
                }
            }
        }

        scene.add(mesh);

        // GUI
        const gui = new GUI();
        gui.add(mesh, "count", 0, count);

        // Orbit Controls
        controlsRef.current = new OrbitControls(camera, renderer.domElement);
        controlsRef.current.enableDamping = true;
        controlsRef.current.enableZoom = false;
        controlsRef.current.enablePan = false;

        // Stats
        statsRef.current = new Stats();
        document.body.appendChild(statsRef.current.dom);

        // Mouse move event
        const onMouseMove = (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };
        document.addEventListener("mousemove", onMouseMove);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            controlsRef.current.update();

            raycaster.setFromCamera(mouse, camera);
            const intersection = raycaster.intersectObject(mesh);

            if (intersection.length > 0) {
                const instanceId = intersection[0].instanceId;
                mesh.getColorAt(instanceId, color);

                if (color.equals(white)) {
                    mesh.setColorAt(instanceId, color.setHex(Math.random() * 0xffffff));
                    mesh.instanceColor.needsUpdate = true;
                }
            }

            renderer.render(scene, camera);
            statsRef.current.update();
        };
        animate();

        // Cleanup
        return () => {
            scene.remove(mesh);
            gui.destroy();
            document.removeEventListener("mousemove", onMouseMove);
            if (statsRef.current) {
                document.body.removeChild(statsRef.current.dom);
            }
        };
    }, [sceneData]);

    return null;
};

export default InstancingRaycast;

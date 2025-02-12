"use client";
import { useEffect } from "react";
import * as THREE from "three";
import { useScene } from "./Scene";

const MeshComponent = () => {
  const sceneData = useScene();

  useEffect(() => {
    if (!sceneData) return;

    const { scene } = sceneData;
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);

    scene.add(cube);

    // Rotate the cube in the animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
    };
    animate();

    return () => {
      scene.remove(cube);
    };
  }, [sceneData]);

  return null;
};

export default MeshComponent;

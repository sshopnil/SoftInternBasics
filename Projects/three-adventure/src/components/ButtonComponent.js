"use client";
import { useScene } from "./Scene";
import * as THREE from "three";

const ButtonComponent = () => {
  const sceneData = useScene();

  const changeColor = () => {
    if (!sceneData) return;

    const { scene } = sceneData;
    const cube = scene.children.find((obj) => obj instanceof THREE.Mesh);
    
    if (cube) {
      cube.material.color.set(new THREE.Color(Math.random(), Math.random(), Math.random()));
    }
  };

  return <button onClick={changeColor} className="absolute top-5 left-5 bg-white p-2">Change Color</button>;
};

export default ButtonComponent;

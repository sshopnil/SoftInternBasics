"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useScene } from "./Scene";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";

const TextComponent = () => {
  const sceneData = useScene();
  const textRef = useRef(null);

  useEffect(() => {
    if (!sceneData) return;
    const { scene } = sceneData;
    const loader = new FontLoader();

    loader.load("fonts/helvetiker_regular.typeface.json", (font) => {
      const color = new THREE.Color("#128cff");

      const matDark = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide,
      });

      const matLite = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
      });

      const message = " Three.js\nExperience";
      const shapes = font.generateShapes(message, 24);
      const geometry = new THREE.ShapeGeometry(shapes);
      geometry.computeBoundingBox();
      const xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
      geometry.translate(xMid, 0, 0);

      // Create text mesh
      const textMesh = new THREE.Mesh(geometry, matLite);
      textMesh.position.z = -15;

      textRef.current = textMesh;
      scene.add(textMesh);
    });

    // ** Proper cleanup function **
    return () => {
      if (textRef.current) {
        scene.remove(textRef.current);
      }
    };
  }, [sceneData]);

  return null;
};

export default TextComponent;

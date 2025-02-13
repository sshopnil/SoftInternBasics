"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useScene } from "./Scene";

const VoxelPainter = () => {
  const sceneData = useScene();
  const statsRef = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    if (!sceneData) return;

    const { scene, camera, renderer } = sceneData;
    if (!scene || !camera || !renderer) return;

    camera.position.set(100, 100, 100);

    let plane, rollOverMesh, raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
    let cubeGeo = new THREE.BoxGeometry(50, 50, 50);
    let cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xfeb74c });
    const objects = [];
    let isShiftDown = false;

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 0.75, 0.5).normalize();
    scene.add(directionalLight);

    // Roll-over helper
    const rollOverGeo = new THREE.BoxGeometry(50, 50, 50);
    const rollOverMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      opacity: 0.5,
      transparent: true,
    });
    rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
    scene.add(rollOverMesh);

    // Grid
    const gridHelper = new THREE.GridHelper(1000, 20);
    scene.add(gridHelper);

    // Plane
    const geometry = new THREE.PlaneGeometry(1000, 1000);
    geometry.rotateX(-Math.PI / 2);
    plane = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({ visible: false })
    );
    scene.add(plane);
    objects.push(plane);

    // Event listeners
    const onPointerMove = (event) => {
      pointer.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(objects, false);
      if (intersects.length > 0) {
        const intersect = intersects[0];
        rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
        rollOverMesh.position
          .divideScalar(50)
          .floor()
          .multiplyScalar(50)
          .addScalar(25);
        render();
      }
    };

    const onPointerDown = (event) => {
      pointer.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(objects, false);

      if (intersects.length > 0) {
        const intersect = intersects[0];

        if (isShiftDown) {
          if (intersect.object !== plane) {
            scene.remove(intersect.object);
            objects.splice(objects.indexOf(intersect.object), 1);
          }
        } else {
          const voxel = new THREE.Mesh(cubeGeo, cubeMaterial);
          voxel.position.copy(intersect.point).add(intersect.face.normal);
          voxel.position
            .divideScalar(50)
            .floor()
            .multiplyScalar(50)
            .addScalar(25);
          scene.add(voxel);
          objects.push(voxel);
        }
        render();
      }
    };

    const onDocumentKeyDown = (event) => {
      if (event.key === "shift") isShiftDown = true;
    };

    const onDocumentKeyUp = (event) => {
      if (event.key === "shift") isShiftDown = false;
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      render();
    };

    const render = () => {
      renderer.render(scene, camera);
    };

    // Event listeners
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onDocumentKeyDown);
    document.addEventListener("keyup", onDocumentKeyUp);
    window.addEventListener("resize", onWindowResize);

    // Cleanup
    return () => {
      scene.remove(...objects);
      scene.remove(rollOverMesh);
      scene.remove(gridHelper);
      scene.remove(directionalLight);

      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onDocumentKeyDown);
      document.removeEventListener("keyup", onDocumentKeyUp);
      window.removeEventListener("resize", onWindowResize);
    };
  }, [sceneData]);

  return null;
};

export default VoxelPainter;

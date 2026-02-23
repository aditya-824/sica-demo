import * as THREE from 'three';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { IGESLoader } from "three-iges-loader";

// GLTF file

// const scene = new THREE.Scene();
// scene.background = new THREE.Color(0xffffff); // Set background to white
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setAnimationLoop(animate);
// document.body.appendChild(renderer.domElement);

// const loader = new GLTFLoader();

// loader.load('smeb_driveunit/smeb_driveunit.gltf', function (gltf) {
//     const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
//     gltf.scene.traverse(function (child) {
//         if (child.isMesh) {
//             child.material = material;
//         }
//         var mroot = gltf.scene;
//         var bbox = new THREE.Box3().setFromObject(mroot);
//         var cent = bbox.getCenter(new THREE.Vector3());
//         var size = bbox.getSize(new THREE.Vector3());

//         //Rescale the object to normalized space
//         var maxAxis = Math.max(size.x, size.y, size.z);
//         mroot.scale.multiplyScalar(1.0 / maxAxis);
//         bbox.setFromObject(mroot);
//         bbox.getCenter(cent);
//         bbox.getSize(size);
//         //Reposition to 0,halfY,0
//         mroot.position.copy(cent).multiplyScalar(-1);
//         mroot.position.y -= (size.y * 0.5);

//     });
//     scene.add(gltf.scene);
// }, undefined, function (error) {
//     console.error(error);
// });

// // const geometry = new THREE.BoxGeometry(1, 1, 1);
// // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// // const cube = new THREE.Mesh(geometry, material);
// // scene.add(cube);

// camera.position.z = 5;

// function animate(time) {

//     // cube.rotation.x = time / 2000;
//     // cube.rotation.y = time / 1000;

//     renderer.render(scene, camera);

// }

// IGES file

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff); // Set background to white
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const loader = new IGESLoader();


// IMPORTANT: Serve this project via a local server (not file://) for loading to work.
// Example: npx serve . or python -m http.server
const iges_file_path = "/smeb_driveunit.igs";

// loader.load('smeb_driveunit/smeb_driveunit.gltf', function (iges) {
//     const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
//     iges.scene.traverse(function (child) {
//         if (child.isMesh) {
//             child.material = material;
//         }
//         var mroot = iges.scene;
//         var bbox = new THREE.Box3().setFromObject(mroot);
//         var cent = bbox.getCenter(new THREE.Vector3());
//         var size = bbox.getSize(new THREE.Vector3());

//         //Rescale the object to normalized space
//         var maxAxis = Math.max(size.x, size.y, size.z);
//         mroot.scale.multiplyScalar(1.0 / maxAxis);
//         bbox.setFromObject(mroot);
//         bbox.getCenter(cent);
//         bbox.getSize(size);
//         //Reposition to 0,halfY,0
//         mroot.position.copy(cent).multiplyScalar(-1);
//         mroot.position.y -= (size.y * 0.5);

//     });
//     scene.add(iges.scene);
// }, undefined, function (error) {
//     console.error(error);
// });


loader.load(
    iges_file_path,
    function (iges) {
        // Center and scale the IGES model
        var bbox = new THREE.Box3().setFromObject(iges);
        var cent = bbox.getCenter(new THREE.Vector3());
        var size = bbox.getSize(new THREE.Vector3());
        var maxAxis = Math.max(size.x, size.y, size.z);
        iges.scale.multiplyScalar(1.0 / maxAxis);
        // Increase the scale by a factor (e.g., 2.0)
        const scaleFactor = 10.0;
        iges.scale.multiplyScalar(scaleFactor);
        bbox.setFromObject(iges);
        bbox.getCenter(cent);
        bbox.getSize(size);
        iges.position.copy(cent).multiplyScalar(-1);
        iges.position.y -= (size.y * 0.5);
        scene.add(iges);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (error) {
        console.log("Error: " + error);
    }
);

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

camera.position.z = 5;

function animate(time) {

    // cube.rotation.x = time / 2000;
    // cube.rotation.y = time / 1000;

    renderer.render(scene, camera);

}
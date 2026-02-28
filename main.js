import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MapControls } from 'three/examples/jsm/controls/MapControls.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';

let scene, camera, renderer;
let mapControls, dragControls;
let objects = [];

init();
animate();

function init() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // Lighting: Directional light at top right (white)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5); // Top right
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    // Ambient light (white)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 0, 5);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    // Controls
    initMapControls();

    // Drag Controls
    initDragControls();

    // Handle resize
    window.addEventListener('resize', onWindowResize);

    // Render main menu in #categories
    renderMainMenu();
}

function renderMainMenu() {
    const categoriesDiv = document.getElementById('categories');
    if (categoriesDiv) {
        categoriesDiv.innerHTML = `
          <img src="/icons/flexible-conveyor-icon.jpg" alt="Flexible Conveyor" class="category-icon" id="flexible-conveyor-icon">
          <p>Flexible Conveyor</p>
        `;
        // Attach event listener for flexible conveyor icon
        const flexibleConveyorBtn = document.getElementById('flexible-conveyor-icon');
        if (flexibleConveyorBtn) {
            flexibleConveyorBtn.addEventListener('click', flexibleConveyorMenu);
        }
    }
}

function loadSmebDriveUnit() {
    const loader = new GLTFLoader();
    loader.load(
        'smeb_driveunit.gltf',
        function (gltf) {
            const material = new THREE.MeshStandardMaterial({ color: 0x175b74 });
            gltf.scene.traverse(function (child) {
                if (child.isMesh) {
                    child.material = material;
                    child.castShadow = true;
                    child.receiveShadow = true;
                    objects.push(child);
                }
            });

            // Normalize and center model
            normalizeModel(gltf.scene);
            scene.add(gltf.scene);
        },
        undefined,
        function (error) {
            console.error(error);
        }
    );
}

function loadSmej315IdlerUnit() {
    const loader = new GLTFLoader();
    loader.load(
        'smej_315_idlerunit.gltf',
        function (gltf) {
            const material = new THREE.MeshStandardMaterial({ color: 0x175b74 });
            gltf.scene.traverse(function (child) {
                if (child.isMesh) {
                    child.material = material;
                    child.castShadow = true;
                    child.receiveShadow = true;
                    objects.push(child);
                }
            });

            // Normalize and center model
            normalizeModel(gltf.scene);
            scene.add(gltf.scene);
        },
        undefined,
        function (error) {
            console.error(error);
        }
    );
}

function normalizeModel(model) {
    const bbox = new THREE.Box3().setFromObject(model);
    const cent = bbox.getCenter(new THREE.Vector3());
    const size = bbox.getSize(new THREE.Vector3());
    const maxAxis = Math.max(size.x, size.y, size.z);
    model.scale.multiplyScalar(1.0 / maxAxis);
    bbox.setFromObject(model);
    bbox.getCenter(cent);
    bbox.getSize(size);
    model.position.copy(cent).multiplyScalar(-1);
    model.position.y -= (size.y * 0.5);
    // Rotate 90 degrees upwards (around X axis)
    model.rotation.x = Math.PI / 2;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    if (mapControls) mapControls.update();
    renderer.render(scene, camera);
}

function initDragControls() {
    dragControls = new DragControls(objects, camera, renderer.domElement);
    dragControls.transformGroup = true;
    dragControls.addEventListener('dragstart', function (event) {
        mapControls.enabled = false;
    });
    dragControls.addEventListener('dragend', function (event) {
        mapControls.enabled = true;
    });
}

function initMapControls() {
    mapControls = new MapControls(camera, renderer.domElement);
    mapControls.enableDamping = true;
    mapControls.dampingFactor = 0.05;
    mapControls.screenSpacePanning = false;
    mapControls.minDistance = 1;
    mapControls.maxDistance = 100;
    mapControls.maxPolarAngle = Math.PI / 2;
}

function flexibleConveyorMenu() {
    // Replace #categories content with the provided HTML
    const categoriesDiv = document.getElementById('categories');
    if (categoriesDiv) {
        categoriesDiv.innerHTML = `
          <div class="categories">
            <div class="category-container" id="smeb-drive-unit">
              <img src="/icons/conveyor-guides-icon.jpg" alt="SMEB Drive Unit" class="category-icon">
              <p>SMEB Drive Unit</p>
            </div>
            <div class="category-container" id="smej-315-idler-unit">
              <img src="/icons/wl-series-icon.jpg" alt="SMEJ 315 Idler Unit" class="category-icon">
              <p>SMEJ 315 Idler Unit</p>
            </div>
          </div>
          <button class="back-button" id="back-to-main-menu">Back</button>
        `;
        // Re-attach event listeners for new buttons
        const driveUnitBtn = document.getElementById('smeb-drive-unit');
        if (driveUnitBtn) {
            driveUnitBtn.addEventListener('click', loadSmebDriveUnit);
        }
        const idlerUnitBtn = document.getElementById('smej-315-idler-unit');
        if (idlerUnitBtn) {
            idlerUnitBtn.addEventListener('click', loadSmej315IdlerUnit);
        }
        // Add back button functionality
        const backBtn = document.getElementById('back-to-main-menu');
        if (backBtn) {
            backBtn.addEventListener('click', mainMenu);
        }
    }
}

function mainMenu() {
    const categoriesDiv = document.getElementById('categories');
    if (categoriesDiv) {
        categoriesDiv.innerHTML = `
        <div class="category-container" id="flexible-conveyor">
            <img src="/icons/flexible-conveyor-icon.jpg" alt="Flexible Conveyor" class="category-icon" id="flexible-conveyor-icon">
            <p>Flexible Conveyor</p>
        </div>
        `;
        // Re-attach event listener for flexible conveyor icon
        const flexibleConveyorBtn = document.getElementById('flexible-conveyor-icon');
        if (flexibleConveyorBtn) {
            flexibleConveyorBtn.addEventListener('click', flexibleConveyorMenu);
        }
    }
}
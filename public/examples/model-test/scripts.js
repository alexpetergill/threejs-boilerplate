import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.126/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.126/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.126.0/examples/jsm/loaders/OBJLoader.js';

let camera, light, controls, scene, renderer;

init();
animate();

function init() {
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x000000);
	renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.shadowMap.enabled = true;
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(5, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(10, 5, 80);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 100;
  controls.maxDistance = 500;
  controls.maxPolarAngle = Math.PI / 2;

  var textureLoader = new THREE.TextureLoader();
  var floorTexture = textureLoader.load('5_dark+parquet+flooring+texture-seamless.jpg');
  floorTexture.wrapS = THREE.RepeatWrapping;
  floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(1,1);

  var planeGeometry = new THREE.PlaneGeometry(20, 20);
  var planeMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, map:floorTexture});
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.x = 0;
  plane.position.y = 0;
  plane.position.z = 0;
  scene.add(plane);

  var textureLoader = new THREE.TextureLoader();
  var texture = textureLoader.load('Lakerem.jpg');
  var boxGeometry = new THREE.BoxGeometry(8, 4, 0);
  var material1 = new THREE.MeshPhongMaterial({color: 0xffffff, map: texture});
  var mesh = new THREE.Mesh(boxGeometry, material1);
  mesh.position.set(0, 3, -7.4);
  scene.add(mesh);

  var wallGeometry = new THREE.BoxGeometry(12, 6, 1);
  var wallMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, transparent:true, opacity:1});
  var wall = new THREE.Mesh(wallGeometry, wallMaterial);
  wall.position.y = 3;
  wall.position.z = -8;
  wall.castShadow = true;
  wall.receiveShadow = true;
  scene.add(wall)
  var wall1 = wall.clone();
  scene.add(wall1)
  wall1.rotation.y = 0.5 * Math.PI;
  wall1.position.x = -6.5;
  wall1.position.z = -2.5;

  let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
  hemiLight.position.set(0, 50, 0);
  scene.add(hemiLight);

  let d = 8.25;
  let dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
  dirLight.position.set(-8, 12, 8);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 1500;
  dirLight.shadow.camera.left = d * -1;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = d * -1;
  scene.add(dirLight);

  const pointLightHelper = new THREE.PointLightHelper(dirLight);
  scene.add(pointLightHelper);

  const loader = new OBJLoader();
  loader.load('meet-bob.obj', function (object) {
    object.traverse(function (obj) {
      if (obj.isMesh) {
        obj.material.color.set(0xFFFFFF);
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
    object.scale.set(2, 2, 2);
    object.rotation.set(0, 3, 0);
		scene.add(object);
  }, function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  }, function (err) {
    console.error('An error happened');
  });

  window.addEventListener('resize', onWindowResize);

  const helper = new THREE.GridHelper(100, 10);
  helper.material.transparent = true;
  scene.add(helper);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  render();
}

function render() {
  renderer.render(scene, camera);
}

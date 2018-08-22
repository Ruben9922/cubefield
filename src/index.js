import * as THREE from 'three';
import * as CANNON from 'cannon';

let world, body, shape, timeStep = 1 / 60,
  camera, scene, renderer, geometry, material, mesh;

initThree();
initCannon();
animate();

function initCannon() {
  world = new CANNON.World();
  world.gravity.set(0, 0, 0);
  world.broadphase = new CANNON.NaiveBroadphase();
  world.solver.iterations = 10;

  shape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
  body = new CANNON.Body({
    mass: 1
  });
  body.addShape(shape);
  body.angularVelocity.set(0, 10, 0);
  body.angularDamping = 0.5;
  world.addBody(body);
}

function initThree() {
  // Scene
  scene = new THREE.Scene();

  // Renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100);
  camera.position.set(0, 0, 5);

  // Lights
  let light1 = new THREE.AmbientLight(0xFFFFFF, 0.1);
  scene.add(light1);

  // Objects
  geometry = new THREE.BoxGeometry(2, 2, 2);
  material = new THREE.MeshLambertMaterial({color: 0xff0000});
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  document.body.appendChild(renderer.domElement);
}

function animate() {
  requestAnimationFrame(animate);
  update();
  render();
}

function update() {
  // Step the physics world
  world.step(timeStep);

  // Copy coordinates from Cannon.js to Three.js
  mesh.position.copy(body.position);
  mesh.quaternion.copy(body.quaternion);
}

function render() {
  renderer.render(scene, camera);
}

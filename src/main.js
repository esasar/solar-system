import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

const planetsData = [
  { name: 'mercury', radius: 0.5, distance: 0.39, yearLength: 88 },
  { name: 'venus', radius: 1, distance: 0.72, yearLength: 225 },
  { name: 'earth', radius: 1, distance: 1, yearLength: 365 },
  { name: 'mars', radius: 0.5, distance: 1.52, yearLength: 687 },
  { name: 'jupiter', radius: 0.5, distance: 5.2, yearLength: 4333 },
  { name: 'saturn', radius: 0.5, distance: 9.58, yearLength: 10759 },
  { name: 'uranus', radius: 0.5, distance: 19.22, yearLength: 30687 },
  { name: 'neptune', radius: 0.5, distance: 30.05, yearLength: 60190 }
];

const planets = [];
planetsData.forEach((body) => {
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(body.radius, 32, 32),
    new THREE.MeshStandardMaterial({ 
      map: new THREE.TextureLoader().load(`/solar-system/assets/${body.name}_texture.jpg`) 
    })
  );
  
  body.mesh = sphere;
  scene.add(sphere);
  planets.push(body);
});

const sun = new THREE.Mesh(
  new THREE.SphereGeometry(5, 32, 32),
  new THREE.MeshBasicMaterial({ 
    map: new THREE.TextureLoader().load('/solar-system/assets/sun_texture.jpg') 
  })
);

scene.add(sun);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0, 0, 0);
pointLight.intensity = 10000;
scene.add(pointLight);

const controls = new OrbitControls(camera, renderer.domElement);

const scalingFactor = 50;
let time = 0;

const angularVelocity = (daysInYear) => {
  return (2 * Math.PI) / daysInYear;
};

const animate = () => {
  requestAnimationFrame(animate);
  time += 0.01;

  planets.forEach((planet) => {
    if (planet.name === 'sun') return;
    
    const omega = angularVelocity(planet.yearLength);

    planet.mesh.position.x = scalingFactor * planet.distance * Math.sin(omega * time);
    planet.mesh.position.z = scalingFactor * planet.distance * Math.cos(omega * time);
  });

  controls.update();
  renderer.render(scene, camera);
};

animate();

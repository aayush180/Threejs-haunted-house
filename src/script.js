import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//Fog
const fog=new THREE.Fog('#262837',1,15);
scene.fog=fog;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
//Door Textures/////////////////////////////////////////////
const alphaTexture=textureLoader.load('textures/door/alpha.jpg');
const ambientOcclusionTexture = textureLoader.load('textures/door/ambientOcclusion.jpg');
const colorTexture = textureLoader.load('textures/door/color.jpg');
const heightTexture = textureLoader.load('textures/door/height.jpg');
const metalnessTexture = textureLoader.load('textures/door/metalness.jpg');
const normalTexture = textureLoader.load('textures/door/normal.jpg');
const roughnessTexture = textureLoader.load('textures/door/roughness.jpg');

//Walls Textures////////////////////////////////////////////////////////////////
const wallColorTexture=textureLoader.load('textures/bricks/color.jpg')
const wallAmbientOcclusionTexture=textureLoader.load('textures/bricks/ambientOcclusion.jpg');
const wallNormalTextures=textureLoader.load('textures/bricks/normal.jpg');
const wallRoughnessTextures=textureLoader.load('textures/bricks/roughness.jpg');


//Grass Textures////////////////////////////////////////////////////////
const grassColorTexture=textureLoader.load('textures/grass/color.jpg');
const grassAmbientOcclusionTexture=textureLoader.load('textures/grass/ambientOcclusion.jpg');
const grassNormalTextures=textureLoader.load('textures/grass/normal.jpg');
const grassRoughnessTextures=textureLoader.load('textures/grass/roughness.jpg');

//For Small Size Grass we use repeat///////////////////////////////////////////////////////////////////
grassColorTexture.repeat.set(8,8);
grassAmbientOcclusionTexture.repeat.set(8,8);
grassNormalTextures.repeat.set(8,8);
grassRoughnessTextures.repeat.set(8,8);

//Also We have to use wraps and wrapt for proper textures//////////////////////////////////////
grassColorTexture.wrapS=THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS=THREE.RepeatWrapping
grassNormalTextures.wrapS=THREE.RepeatWrapping
grassRoughnessTextures.wrapS=THREE.RepeatWrapping

//And for wrapt///////////////////////////////////////////////////////
grassColorTexture.wrapT=THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT=THREE.RepeatWrapping
grassNormalTextures.wrapT=THREE.RepeatWrapping
grassRoughnessTextures.wrapT=THREE.RepeatWrapping
///// in above we reduce the size of grass textures 

/**
 * House
 * 
*/

const house = new THREE.Group();
scene.add(house)

//Walls////////////////////////////////////////////////
const walls=new THREE.Mesh(
    new THREE.BoxBufferGeometry(4,2.5,4),
    new THREE.MeshStandardMaterial({
        map:wallColorTexture,
        aoMap:wallAmbientOcclusionTexture,
        normalMap:wallNormalTextures,
        roughnessMap:wallRoughnessTextures
    })
)
walls.castShadow = true;
walls.receiveShadow = true;
walls.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array,2)
)
walls.position.y=1.25
house.add(walls)

//Roof///////////////////////////////////////////
const roof=new THREE.Mesh(
    new THREE.ConeBufferGeometry(3.5,1,4),
    new THREE.MeshStandardMaterial({color:0XB35F45})
)
roof.position.y=3;
roof.rotation.y=Math.PI/4;
house.add(roof);

//Door///////////////////////////////////////////
const door=new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2.2,2.2,100,100),
    new THREE.MeshStandardMaterial({
        map:colorTexture,
        alphaMap:alphaTexture,
        transparent:true,
        aoMap:ambientOcclusionTexture,
        displacementMap:heightTexture,
        displacementScale:0.1,
        normalMap:normalTexture,
        metalnessMap:metalnessTexture,
        roughnessMap:roughnessTexture,
        wireframe:false
    })
)
door.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array,2) 
)
door.position.z=2+0.01;
door.position.y=1;
house.add(door);

//Bushes///////////////////////////////////////////////////////////
const bushGeometry=new THREE.SphereBufferGeometry(1,16,16);
const bushMaterial=new THREE.MeshStandardMaterial({color:'green'});

const bush1=new THREE.Mesh(bushGeometry,bushMaterial);
bush1.castShadow = true;
bush1.scale.set(0.5,0.5,0.5);
bush1.position.set(0.8,0.2,2.2);


const bush2=new THREE.Mesh(bushGeometry,bushMaterial);
bush2.castShadow = true;
bush2.scale.set(0.25,0.25,0.25);
bush2.position.set(1.5,0.1,2.1);

const bush3=new THREE.Mesh(bushGeometry,bushMaterial);
bush3.castShadow = true;
bush3.scale.set(0.4,0.4,0.4);
bush3.position.set(-0.8,0.2,2.2);

const bush4=new THREE.Mesh(bushGeometry,bushMaterial);
bush4.castShadow = true;
bush4.scale.set(0.15,0.15,0.15);
bush4.position.set(-1,0.05,2.6)


house.add(bush1,bush2,bush3,bush4)

//Graves///////////////////////////////////////////////////////
const graves=new THREE.Group();
scene.add(graves);

const graveGeometry=new THREE.BoxBufferGeometry(0.6,0.8,0.2);
const graveMaterial=new THREE.MeshStandardMaterial({color:'grey'});

for(let i=0;i<55;i++){

    const angle=Math.random()*Math.PI *2
    const radius=3+Math.random()*6;
    const x=Math.sin(angle)*radius
    const y=Math.cos(angle)*radius;

    const grave=new THREE.Mesh(graveGeometry,graveMaterial);
    grave.castShadow=true;
    grave.rotation.y=(Math.random()-0.5)*0.4;
    grave.rotation.z=(Math.random()-0.5)*0.4;
    grave.position.set(x,0.3,y);
    graves.add(grave)
}




// Floor//////////////////////////////////////////////////////////
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map:grassColorTexture,
        normalMap:grassNormalTextures,
        aoMap:grassAmbientOcclusionTexture,
        roughnessMap:grassRoughnessTextures
    })
)
floor.receiveShadow = true;
floor.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array,2)
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
ambientLight.castShadow = true;
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.castShadow = true;
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

//Door Light
const doorLight = new THREE.PointLight('#ff7d46',1,7);
doorLight.shadow.mapSize.height=256;
doorLight.shadow.mapSize.width=256;
doorLight.shadow.camera.far=7;
doorLight.castShadow = true;
doorLight.position.set(0,2.2,2.7);
house.add(doorLight);

//Ghost Lights
const ghost1=new THREE.PointLight('#ff00ff',2,3);
ghost1.shadow.mapSize.height=256;
ghost1.shadow.mapSize.width=256;
ghost1.shadow.camera.far=7;
ghost1.castShadow = true;
const ghost2=new THREE.PointLight('#0000ff',2,3);
ghost2.shadow.mapSize.height=256;
ghost2.shadow.mapSize.width=256;
ghost2.shadow.camera.far=7;
ghost2.castShadow = true;
const ghost3=new THREE.PointLight('#ffff00',2,3);
ghost3.shadow.mapSize.height=256;
ghost3.shadow.mapSize.width=256;
ghost3.shadow.camera.far=7;
ghost3.castShadow = true;
scene.add(ghost1,ghost2,ghost3)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.shadowMap.enabled=true;
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //Ghosts
    const ghost1Angle=elapsedTime*0.5;
    ghost1.position.x=Math.cos(ghost1Angle)*4;
    ghost1.position.z=Math.sin(ghost1Angle)*4;
    ghost1.position.y=Math.sin(elapsedTime*3);

    //Ghost2
    const ghost2Angle=-elapsedTime*0.25;
    ghost2.position.x=Math.cos(ghost2Angle)*5
    ghost2.position.z=Math.sin(ghost2Angle)*5
    ghost2.position.y=Math.sin(elapsedTime*4)+Math.sin(elapsedTime+2.5);

    //Ghost3
    const ghost3Angle=-elapsedTime*0.18;
    ghost3.position.x=Math.cos(ghost3Angle)*(7+Math.sin(elapsedTime*0.32));
    ghost3.position.z=Math.sin(ghost3Angle)*(7+Math.sin(elapsedTime*0.5));
    ghost3.position.y=Math.sin(elapsedTime*5)+(Math.sin(elapsedTime*2));

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
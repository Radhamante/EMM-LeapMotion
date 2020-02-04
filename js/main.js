import * as THREE from 'three'
import * as Pizzicato from 'Pizzicato'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { gsap } from "gsap"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Disque from '../assets/6.jpg'


const textureLoader = new THREE.TextureLoader()
const disqueTexture = textureLoader.load(Disque)

function getCoords(leapPoint, frame, canvas) {
    const iBox = frame.interactionBox;
    const normalizedPoint = iBox.normalizePoint(leapPoint, true);

    return {
        x : normalizedPoint[0] * canvas.width,
        z : (normalizedPoint[2]) * canvas.height
    };
}

/**
 * Scene
 */
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {}
sizes.width = window.innerWidth
sizes.height = window.innerHeight

window.addEventListener('resize', () =>
{
    // Save sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
})

/**
 * camera
 */
const camera = new THREE.PerspectiveCamera(80, sizes.width / sizes.height, 0.1, 10000)
camera.position.y = 250
camera.position.z = 100
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer()
renderer.setClearColor(0xccccFF, 1)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
document.body.appendChild(renderer.domElement)

//////////////////////////////////////////////////////////////////////////

/**
 * Orbit controls
 */
const controls = new OrbitControls(camera, renderer.domElement)

/**
 * controller leap
 */
const controller = new Leap.Controller();
controller.connect();

// Leap.loop().use('boneHand', {
//     targetEl: document.body,
//     arm: true
// });
 

//////////////////////////////////////////////////////////////////////////////
/**
 * GLTFLoader
 */
const gltfLoader = new GLTFLoader()


/**
 * import
 */
const platine = new THREE.Group()
scene.add(platine)
gltfLoader.load(
    'platine.gltf',
    (gltf) => {
        while(gltf.scene.children.length)
        {
            platine.add(gltf.scene.children[0])
        }
    },
    undefined,
    (error) => {
        console.log("error")
        console.log(error)
    }
)

const potarGauche = new THREE.Group()
scene.add(potarGauche)
gltfLoader.load(
    'potar.gltf',
    (gltf) => {
        while(gltf.scene.children.length)
        {
            potarGauche.add(gltf.scene.children[0])
        }
    },
    undefined,
    (error) => {
        console.log("error")
        console.log(error)
    }
)
potarGauche.position.y = 40
potarGauche.position.x = -17
potarGauche.rotation.x = 0.1

const potarDroite = new THREE.Group()
scene.add(potarDroite)
gltfLoader.load(
    'potar.gltf',
    (gltf) => {
        while(gltf.scene.children.length)
        {
            potarDroite.add(gltf.scene.children[0])
        }
    },
    undefined,
    (error) => {
        console.log("error")
        console.log(error)
    }
)
potarDroite.position.y = 40
potarDroite.position.x = 18
potarDroite.rotation.x = 0.1



var circle = new THREE.Mesh(  new THREE.CircleBufferGeometry( 56, 32 ),
new THREE.MeshBasicMaterial( {map: disqueTexture} )
);
scene.add( circle );
circle.rotation.x = -1.45
circle.position.y = 50
circle.position.x = -98
circle.position.z = 10

var circle_2 = new THREE.Mesh(  new THREE.CircleBufferGeometry( 56, 32 ),
new THREE.MeshBasicMaterial( {map: disqueTexture} )
);
scene.add( circle_2 );
circle_2.rotation.x = -1.45
circle_2.position.y = 50
circle_2.position.x = 98
circle_2.position.z = 10
/**
 * light
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff,0.6)
directionalLight.position.y = 200
directionalLight.position.z = 0
scene.add(directionalLight)

const pointLight = new THREE.PointLight(0xffffff, 5, 25)
scene.add(pointLight)



const indexMeshTip = new THREE.Mesh(
    new THREE.SphereBufferGeometry(5),
    new THREE.MeshStandardMaterial({color:0xFF0000})
)
scene.add(indexMeshTip)


/**
 * Loop
 */
let buttonULL = false
let buttonUL = false
let buttonURR = false
let buttonUR = false
let buttonMLL = false
let buttonML = false
let buttonMRR = false
let buttonMR = false
let buttonBLL = false
let buttonBL = false
let buttonBRR = false
let buttonBR = false

let volumeR = 10
let volumeL = 10

let isSwipe = false

let disque_droit_tourne = false
let disque_gauche_tourne = false

const musiqueDroit = document.querySelector("audio")
console.log(musiqueDroit)


controller.on('frame', (frame) => {
    renderer.render(scene, camera)
    if(disque_droit_tourne == true){
        circle_2.rotation.z +=0.2
        musiqueDroit.play()
    }else{
        musiqueDroit.pause()
    }
    if(disque_gauche_tourne == true){
        circle.rotation.z +=0.2
    }
    frame.hands.forEach((hand) => {
        indexMeshTip.position.x = hand.indexFinger.tipPosition[0]*2 + 150
        indexMeshTip.position.y = hand.indexFinger.tipPosition[1]-70
        indexMeshTip.position.z = hand.indexFinger.tipPosition[2]
        if (hand.pinchStrength >= 0.95){
            if (indexMeshTip.position.z <= 65 && indexMeshTip.position.z >= -70) {
                if (indexMeshTip.position.x - potarGauche.position.x >= -20 && indexMeshTip.position.x - potarGauche.position.x <= 10) {
                    gsap.to(potarGauche.position,{duration: 0.2,z:indexMeshTip.position.z})
                }
                if (indexMeshTip.position.x - potarDroite.position.x >= 0 && indexMeshTip.position.x - potarDroite.position.x <= 30) {
                    gsap.to(potarDroite.position,{duration: 0.2,z:indexMeshTip.position.z})
                }
            }
        }
        
        /**
         * buttons collisions
         */
        if(indexMeshTip.position.y <= 55){
            if(indexMeshTip.position.z <= -30 && indexMeshTip.position.z >= -70){
                pointLight.position.z = -50
                if(indexMeshTip.position.x <= 275 && indexMeshTip.position.x >= 240 && buttonURR == false){
                    buttonURR = true
                    pointLight.position.y = 54
                    pointLight.position.x = 255
                    // ton code
                    setTimeout(()=>{buttonURR = false},1000)
                }else if(indexMeshTip.position.x <= 245 && indexMeshTip.position.x >= 180 && buttonUR == false){
                    buttonUR = true
                    pointLight.position.y = 54
                    pointLight.position.x = 203 
                    // ton code
                    setTimeout(()=>{buttonUR = false},1000)
                }else if(indexMeshTip.position.x <= -185 && indexMeshTip.position.x >= -225 && buttonUL== false){
                    buttonUL = true
                    pointLight.position.y = 54
                    pointLight.position.x = -205 
                    // ton code
                    setTimeout(()=>{buttonUL = false},1000)
                }else if(indexMeshTip.position.x <= -235 && indexMeshTip.position.x >= -275 && buttonULL == false){
                    buttonULL = true
                    pointLight.position.y = 54
                    pointLight.position.x = -255 
                    // ton code
                    setTimeout(()=>{buttonULL = false},1000)
                }
            }else if (indexMeshTip.position.z <= 25 && indexMeshTip.position.z >= -15){
                pointLight.position.z = 5
                if(indexMeshTip.position.x <= 275 && indexMeshTip.position.x >= 240 && buttonMRR == false){
                    buttonMRR = true
                    pointLight.position.y = 46
                    pointLight.position.x = 255 
                    // ton code
                    setTimeout(()=>{buttonMRR = false},1000)
                }else if(indexMeshTip.position.x <= 245 && indexMeshTip.position.x >= 180 && buttonMR == false){
                    buttonMR = true
                    pointLight.position.y = 46
                    pointLight.position.x = 203 
                    // ton code
                    setTimeout(()=>{buttonMR = false},1000)
                }else if(indexMeshTip.position.x <= -185 && indexMeshTip.position.x >= -225 && buttonML == false){
                    buttonML = true
                    pointLight.position.y = 46
                    pointLight.position.x = -205 
                    // ton code
                    setTimeout(()=>{buttonML = false},1000)
                }else if(indexMeshTip.position.x <= -235 && indexMeshTip.position.x >= -275 && buttonMLL == false){
                    buttonMLL = true
                    pointLight.position.y = 46
                    pointLight.position.x = -255 
                    // ton code
                    setTimeout(()=>{buttonMLL = false},1000)
                }
            }else if(indexMeshTip.position.z <= 80 && indexMeshTip.position.z >= 40){
                pointLight.position.z = 60
                if(indexMeshTip.position.x <= 275 && indexMeshTip.position.x >= 240 && buttonBRR == false){
                    buttonBRR = true
                    pointLight.position.y = 38
                    pointLight.position.x = 255 
                    // ton code
                    setTimeout(()=>{buttonBRR = false},1000)
                }else if(indexMeshTip.position.x <= 245 && indexMeshTip.position.x >= 180 && buttonBR == false){
                    buttonBR = true
                    pointLight.position.y = 38
                    pointLight.position.x = 203
                    // ton code
                    setTimeout(()=>{buttonBR = false},1000) 
                }else if(indexMeshTip.position.x <= -185 && indexMeshTip.position.x >= -225 && buttonBL == false){
                    buttonBL = true
                    pointLight.position.y = 38
                    pointLight.position.x = -205
                    // ton code
                    setTimeout(()=>{buttonBL = false},1000) 
                }else if(indexMeshTip.position.x <= -235 && indexMeshTip.position.x >= -275 && buttonBLL == false){
                    buttonBLL = true
                    pointLight.position.y = 38
                    pointLight.position.x = -255
                    // ton code
                    setTimeout(()=>{buttonBLL = false},1000) 
                }
            }
        }else{
            buttonULL = false
            buttonUL = false
            buttonURR = false
            buttonUR = false
            buttonMLL = false
            buttonML = false
            buttonMRR = false
            buttonMR = false
            buttonBLL = false
            buttonBL = false
            buttonBRR = false
            buttonBR = false
            pointLight.position.y = 100
        }

        // SWIPE
        
        if (frame.gestures[0] != undefined) {
            if (frame.gestures[0].type == "swipe" && isSwipe == false && indexMeshTip.position.x >= 40){
                isSwipe = true
                disque_droit_tourne = true
                
                

                setTimeout(()=>{isSwipe = false},1000) 
            }
            if(frame.gestures[0].type == "swipe" && isSwipe == false && indexMeshTip.position.x << 40){
                isSwipe = true
                
                disque_gauche_tourne = true

                setTimeout(()=>{isSwipe = false},1000) 
            }
        }
    })
    volumeR = Math.max((125 - potarDroite.position.z - 65) / 130 * 100,0)
    volumeL = Math.max((125 - potarGauche.position.z - 65) / 130 * 100,0)

    if (volumeR == 0){
        disque_droit_tourne = false
    }
    if (volumeL == 0){
        disque_gauche_tourne = false
    }
});




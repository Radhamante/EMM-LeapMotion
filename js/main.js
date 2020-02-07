import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { gsap } from "gsap"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

import Disque from '../assets/6.jpg'
import particulesStarsTextureSource from '../assets/9.png'


const textureLoader = new THREE.TextureLoader()
const disqueTexture = textureLoader.load(Disque)
const particulesStarsTexture = textureLoader.load(particulesStarsTextureSource)



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
renderer.setClearColor(0x000000, 1)
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

const effectComposer = new EffectComposer(renderer)
const renderPass = new RenderPass(scene,camera)
effectComposer.addPass(renderPass)


 
const unrealPass = new UnrealBloomPass(new THREE.Vector2(sizes.width, sizes.height))
unrealPass.strength = 0.2
unrealPass.radius = 0.4
unrealPass.threshold = 0.2
unrealPass.exposure = 1
effectComposer.addPass(unrealPass)


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
const pointLightOnOff = new THREE.PointLight(0xff0000, 5, 25)
scene.add(pointLightOnOff)



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

let on = false 

let isChangeSoundRight = false
let isChangeSoundLeft = false

// console.log(audioRight)

const btnURR = document.querySelector(".btnURR");
const btnURL = document.querySelector(".btnURL");
const btnMRR = document.querySelector(".btnMRR");
const btnMRL = document.querySelector(".btnMRL");
const btnBRR = document.querySelector(".btnBRR");
const btnBRL = document.querySelector(".btnBRL");
const btnULL = document.querySelector(".btnULL");
const btnULR = document.querySelector(".btnULR");
const btnMLR = document.querySelector(".btnMLR");
const btnMLL = document.querySelector(".btnMLL");
const btnBLR = document.querySelector(".btnBLR");
const btnBLL = document.querySelector(".btnBLL");

let reader = new FileReader();

const audioRight = document.querySelector("#audio_choice_right")
const audioLeft = document.querySelector("#audio_choice_left");

let OnOffTimer = false

let nameRight = undefined
let nameLeft = undefined

let realNameRight = ""
let realNameLeft = ""

let NameTmp = []

const fontLoader = new FontLoader()

const textMaterial = new THREE.MeshBasicMaterial({color:0xccccff})

let textRight = new THREE.Mesh()
let textLeft = new THREE.Mesh()


audioFileRight.onchange = function(){
    reader.onload = function(e){
        audioRight.src = this.result;
        audioRight.controls = true;
        audioRight.crossOrigin = "anonymous";
        audioRight.play();
    }
    console.log(reader.readAsDataURL(this.files[0]))
    nameRight = document.getElementById("audioFileRight").files[0].name.replace(".mp3","")
    console.log(nameRight)

    for (let index = 0; index < 9; index++) {
        NameTmp.push(nameRight[index])
    }
    realNameRight = NameTmp.join('')
    NameTmp = []
    // scene.remove(textRight)
    fontLoader.load( '/font.json', function ( font ) {
        const textGeometryRight = new THREE.TextGeometry( realNameRight, {
            font: font,
            size: 14,
            height: 0,
            curveSegments: 12,
            bevelEnabled: false,
            bevelThickness: 2,
            bevelSize: 2,
            bevelOffset: 0.4,
            bevelSegments: 2
        })
        textRight.material = textMaterial
        textRight.geometry = textGeometryRight
        textRight.position.x = 48   
        textRight.position.y = 28
        textRight.position.z = 93 
        textRight.rotation.x = -Math.PI/2

        scene.add(textRight)
    })
}

audioFileLeft.onchange = function(event){
    reader.onload = function(e){
        audioLeft.src = this.result;
        audioLeft.controls = true;
        audioLeft.crossOrigin = "anonymous";
        audioLeft.play();
        // console.log()

    }
    console.log(reader.readAsDataURL(this.files[0]))
    nameLeft = document.getElementById("audioFileLeft").files[0].name.replace(".mp3","")
    console.log(nameLeft)

    for (let index = 0; index < 9; index++) {
        NameTmp.push(nameLeft[index])
    }
    realNameLeft = NameTmp.join('')
    NameTmp = []
    // scene.remove(textLeft)
    fontLoader.load( '/font.json', function ( font ) {
        const textGeometryLeft = new THREE.TextGeometry( realNameLeft, {
            font: font,
            size: 14,
            height: 0,
            curveSegments: 12,
            bevelEnabled: false,
            bevelThickness: 2,
            bevelSize: 2,
            bevelOffset: 0.4,
            bevelSegments: 2
        })
        textLeft.material = textMaterial
        textLeft.geometry = textGeometryLeft
        textLeft.position.x = -128
        textLeft.position.y = 28
        textLeft.position.z = 93 
        textLeft.rotation.x = -Math.PI/2

        scene.add(textLeft)
    })
}

pointLightOnOff.position.z = -70
pointLightOnOff.position.x = -100
pointLightOnOff.position.y = 58

//
const particlesGeometry = new THREE.Geometry()

for (let index = 0; index < 2000; index++) {    
    var u = Math.random();
    var v = Math.random();
    var theta = 2 * Math.PI * u;
    var phi = Math.acos(2 * v - 1);

    const vertice = new THREE.Vector3(
        (400 * Math.sin(phi) * Math.cos(theta)),
        (400 * Math.sin(phi) * Math.sin(theta)),
        (400 * Math.cos(phi))
    )
    particlesGeometry.vertices.push(vertice)

    const color = new THREE.Color()
    const randomlight = Math.random()/2 + 0.5

    color.r = randomlight
    color.g = randomlight
    color.b = randomlight
    particlesGeometry.colors.push(color)

}

const particlesMaterial = new THREE.PointsMaterial({
    alphaMap: particulesStarsTexture,
    transparent : true,
    size : 10,
    vertexColors: true
})

const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)
//

controller.on('frame', (frame) => {
    effectComposer.render(scene, camera)
    if(indexMeshTip.position.y <= 55){
        if(indexMeshTip.position.z <= -65 && indexMeshTip.position.z >= -75){
            if(indexMeshTip.position.x <= -90 && indexMeshTip.position.x >= -110){
                if (OnOffTimer == false) {
                    OnOffTimer = true
                    if(on == true){
                        on = false
                        pointLightOnOff.color.setHex(0xff0000)
                        disque_droit_tourne = false
                        disque_gauche_tourne = false
                        audioLeft.pause()
                        audioLeft.pause()
                    }else {
                        on = true
                        pointLightOnOff.color.setHex(0x00ff00)
                    }
                    setTimeout(()=>{OnOffTimer = false},500) 
                }
            }
        }
    }
    if(disque_droit_tourne == true){
        circle_2.rotation.z +=0.2
        audioRight.play()
    }else{
        audioRight.pause()
    }
    if(disque_gauche_tourne == true){
        circle.rotation.z +=0.2
        audioLeft.play()
    }else{
        audioLeft.pause()
    }



    frame.hands.forEach((hand) => {
        indexMeshTip.position.x = hand.indexFinger.tipPosition[0]*2 + 150
        indexMeshTip.position.y = hand.indexFinger.tipPosition[1]-70
        indexMeshTip.position.z = hand.indexFinger.tipPosition[2]
        // console.log(indexMeshTip.position)
        if (on == true){
            
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
                    if (indexMeshTip.position.z <= 95 && indexMeshTip.position.z >= 75) {
                        if (indexMeshTip.position.x <= 170 && indexMeshTip.position.x >= 150 && isChangeSoundRight == false) {
                            isChangeSoundRight = true
                            
                            audioFileRight.click()

                            setTimeout(()=>{isChangeSoundRight = false},3000)
                        }
                        if (indexMeshTip.position.x <= -140 && indexMeshTip.position.x >= -160 && isChangeSoundLeft == false) {
                            isChangeSoundLeft = true

                            audioFileLeft.click()

                            setTimeout(()=>{isChangeSoundLeft = false},3000)
                        }
                    }
                    if(indexMeshTip.position.z <= -30 && indexMeshTip.position.z >= -70){
                        pointLight.position.z = -50
                        if(indexMeshTip.position.x <= 275 && indexMeshTip.position.x >= 240 && buttonURR == false){
                            buttonURR = true
                            pointLight.position.y = 54
                            pointLight.position.x = 255
                            btnURR.play()
                            setTimeout(()=>{buttonURR = false},1000)
                        }else if(indexMeshTip.position.x <= 245 && indexMeshTip.position.x >= 180 && buttonUR == false){
                            buttonUR = true
                            pointLight.position.y = 54
                            pointLight.position.x = 203 
                            btnURL.play()
                            setTimeout(()=>{buttonUR = false},1000)
                        }else if(indexMeshTip.position.x <= -185 && indexMeshTip.position.x >= -225 && buttonUL== false){
                            buttonUL = true
                            pointLight.position.y = 54
                            pointLight.position.x = -205 
                            btnULR.play()
                            setTimeout(()=>{buttonUL = false},1000)
                        }else if(indexMeshTip.position.x <= -235 && indexMeshTip.position.x >= -275 && buttonULL == false){
                            buttonULL = true
                            pointLight.position.y = 54
                            pointLight.position.x = -255 
                            btnULL.play()
                            setTimeout(()=>{buttonULL = false},1000)
                        }
                    }else if (indexMeshTip.position.z <= 25 && indexMeshTip.position.z >= -15){
                        pointLight.position.z = 5
                        if(indexMeshTip.position.x <= 275 && indexMeshTip.position.x >= 240 && buttonMRR == false){
                            buttonMRR = true
                            pointLight.position.y = 46
                            pointLight.position.x = 255 
                            btnMRR.play()
                            setTimeout(()=>{buttonMRR = false},1000)
                        }else if(indexMeshTip.position.x <= 245 && indexMeshTip.position.x >= 180 && buttonMR == false){
                            buttonMR = true
                            pointLight.position.y = 46
                            pointLight.position.x = 203 
                            btnMRL.play()
                            setTimeout(()=>{buttonMR = false},1000)
                        }else if(indexMeshTip.position.x <= -185 && indexMeshTip.position.x >= -225 && buttonML == false){
                            buttonML = true
                            pointLight.position.y = 46
                            pointLight.position.x = -205 
                            btnMLR.play()
                            setTimeout(()=>{buttonML = false},1000)
                        }else if(indexMeshTip.position.x <= -235 && indexMeshTip.position.x >= -275 && buttonMLL == false){
                            buttonMLL = true
                            pointLight.position.y = 46
                            pointLight.position.x = -255 
                            btnMLL.play()
                            setTimeout(()=>{buttonMLL = false},1000)
                        }
                    }else if(indexMeshTip.position.z <= 80 && indexMeshTip.position.z >= 40){
                        pointLight.position.z = 60
                        if(indexMeshTip.position.x <= 275 && indexMeshTip.position.x >= 240 && buttonBRR == false){
                            buttonBRR = true
                            pointLight.position.y = 38
                            pointLight.position.x = 255 
                            btnBRR.play()
                            setTimeout(()=>{buttonBRR = false},1000)
                        }else if(indexMeshTip.position.x <= 245 && indexMeshTip.position.x >= 180 && buttonBR == false){
                            buttonBR = true
                            pointLight.position.y = 38
                            pointLight.position.x = 203
                            btnBRL.play()
                            setTimeout(()=>{buttonBR = false},1000) 
                        }else if(indexMeshTip.position.x <= -185 && indexMeshTip.position.x >= -225 && buttonBL == false){
                            buttonBL = true
                            pointLight.position.y = 38
                            pointLight.position.x = -205
                            btnBLR.play()
                            setTimeout(()=>{buttonBL = false},1000) 
                        }else if(indexMeshTip.position.x <= -235 && indexMeshTip.position.x >= -275 && buttonBLL == false){
                            buttonBLL = true
                            pointLight.position.y = 38
                            pointLight.position.x = -255
                            btnBLL.play()
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
        }
    })
        volumeR = Math.max((125 - potarDroite.position.z - 65) / 130,0)
        volumeL = Math.max((125 - potarGauche.position.z - 65) / 130,0)
        audioLeft.volume = volumeL
        audioRight.volume = volumeR

        if (volumeR == 0){
            disque_droit_tourne = false
        }
        if (volumeL == 0){
            disque_gauche_tourne = false
        }
    
});




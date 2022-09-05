import * as THREE from '/librairies/threejs/three.module.js';
import { FBXLoader  } from '/librairies/threejs/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader  } from '/librairies/threejs/examples/jsm/loaders/GLTFLoader.js';

const cameraData = {
	"fov" : 90,
	"aspect" : window.innerWidth / window.innerHeight,
	"near" : 0.1,
	"far" : 100,
	"position" : [0, 0.5, 3]
}

const CHARACTER_NUMBER = 6;

const SCALING = 0.2;

const IDLE_ANIMATION = 0;
const WALKING_ANIMATION  = 1;
const RUN_ANIMATION  = 2;
const ATTACK_1_ANIMATION = 3;
const ATTACK_2_ANIMATION = 4;
const HURT_1_ANIMATION = 4;
const HURT_2_ANIMATION = 4;
const FINISHING_ANIMATION = 4;
const DEATH_ANIMATION = 4;

const charactersData = {
  	"Mario" : {
		"fileName" : "Mario",
		"scale" : [SCALING, SCALING, SCALING],
		"position" : [-3, 1.5, -1],
		"textures" : [
			"Mario_body.png",
			"Mario_Brow.png",
			"Mario_eye.png",
		]
	},
	"Link" : {
		"fileName" : "Mario",
		"scale" : [SCALING, SCALING, SCALING],
		"position" : [0, 1.5, -1],
		"textures" : [
			"Mario_body.png",
			"Mario_Brow.png",
			"Mario_eye.png",
		]
	},
	"Pac-Man" : {
		"fileName" : "Mario",
		"scale" : [SCALING, SCALING, SCALING],
		"position" : [3, 1.5, -1],
		"textures" : [
			"Mario_body.png",
			"Mario_Brow.png",
			"Mario_eye.png",
		]
	},
	"Kirby" : {
		"fileName" : "Mario",
		"scale" : [SCALING, SCALING, SCALING],
		"position" : [-3, -1.5, -1],
		"textures" : [
			"Mario_body.png",
			"Mario_Brow.png",
			"Mario_eye.png",
		]
	},
	"Sonic" : {
		"fileName" : "Mario",
		"scale" : [SCALING, SCALING, SCALING],
		"position" : [0, -1.5, -1],
		"textures" : [
			"Mario_body.png",
			"Mario_Brow.png",
			"Mario_eye.png",
		]
	},
	"Mewtwo" : {
		"fileName" : "Mario",
		"scale" : [SCALING, SCALING, SCALING],
		"position" : [3, -1.5, -1],
		"textures" : [
			"Mario_body.png",
			"Mario_Brow.png",
			"Mario_eye.png",
		]
	}
}


function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas});

    const camera = new THREE.PerspectiveCamera(cameraData["fov"], cameraData["aspect"], cameraData["near"], cameraData["far"]);
    camera.position.x = cameraData["position"][0]
	camera.position.y = cameraData["position"][1]
	camera.position.z = cameraData["position"][2]

    const scene = new THREE.Scene();

    let light = new THREE.PointLight();
    light.position.set(0.8, 0, 1.0);
	light.intensity = 3;
    scene.add(light);

    let characterMixers = [];
    let modelsReady = false;
    const animationActions = [];
    let activeAction = [];
    let lastAction = [];

	const textureLoader = new THREE.TextureLoader();
	
	// Loading all resources
	
    const fbxLoader = new FBXLoader();

	let indexCharacter = 0;

	for (let characterName in charactersData){
		console.log("Processing " + characterName);
		const characterValues = charactersData[characterName];

		const path = "/resources/" + charactersData[characterName]["fileName"];

		for (let index in characterValues["textures"]){
			console.log("Loading " + path + "/" + characterValues["textures"][index]);
			const texture = textureLoader.load(path + "/" + characterValues["textures"][index]);
			texture.wrapS = THREE.RepeatWrapping;
			texture.wrapT = THREE.RepeatWrapping;
			texture.magFilter = THREE.NearestFilter;
		}

		fbxLoader.load(
			'/resources/Mario/Walking.fbx',
			(object) => {
				object.traverse( function ( child ) {
					if ( child.isMesh ) {
						child.castShadow = true;
						child.receiveShadow = true;
					}
				} );
				
				console.log("Chracter number : " + indexCharacter + ", scale : " + characterValues["scale"] + ", position : " + characterValues["position"]);

				object.scale.set(characterValues["scale"][0], characterValues["scale"][1], characterValues["scale"][2]);
				object.position.set(characterValues["position"][0], characterValues["position"][1], characterValues["position"][2]);
				
				const animations = object.animations;
				console.log("Number of animations : " + animations.length);
				const currentMixer = new THREE.AnimationMixer(object)

				characterMixers.push(currentMixer);

				const idleAction = currentMixer.clipAction(animations[IDLE_ANIMATION]);
				idleAction.play();
	
				scene.add(object);

				if (indexCharacter == CHARACTER_NUMBER - 1){
					modelsReady = true;
				} else 		
					indexCharacter += 1;
			},
			(xhr) => {
				console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
			},
			(error) => {
				console.log(error);
			}
		);
	}


    function resizeRendererToDisplaySize(renderer) {
     	const canvas = renderer.domElement;
     	const width = canvas.clientWidth;
     	const height = canvas.clientHeight;
     	const needResize = canvas.width !== width || canvas.height !== height;
     	if (needResize) {
     	  renderer.setSize(width, height, false);
     	}
     	return needResize;
    }

    const clock = new THREE.Clock();

    function render(time) {
		const delta = clock.getDelta();

      	if (resizeRendererToDisplaySize(renderer)) {
    		const canvas = renderer.domElement;
    		camera.aspect = canvas.clientWidth / canvas.clientHeight;
    		camera.updateProjectionMatrix();
      	}
    
     	if (modelsReady){
			for (let i = 0; i < CHARACTER_NUMBER; ++i){
				characterMixers[i].update(delta);
			}
		} 
     	else 
        	console.log("Model not ready");

      	renderer.render(scene, camera);

      	requestAnimationFrame(render);
    }

    const setAction = (toAction) => {
        console.log(activeAction);
        if (toAction != activeAction) {
            lastAction = activeAction
            activeAction = toAction
            lastAction.stop()
            //lastAction.fadeOut(1)
            activeAction.reset()
            //activeAction.fadeIn(1)
            activeAction.play()
        }
    }

    requestAnimationFrame(render);
}

main();
import * as THREE from '/librairies/threejs/three.module.js';
import * as CONSTANTS from '/constants.js';
import { FBXLoader  } from '/librairies/threejs/examples/jsm/loaders/FBXLoader.js';

const SINGLE_ANIMATIONS = [
	"Idle", "Walking", "Run",
	"Finishing", "Death"
]

const MULTIPLE_ANIMATIONS = [
	"Attack", "Hurt"
]

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas});

    const camera = new THREE.PerspectiveCamera(
		CONSTANTS.CameraData["fov"], 
		CONSTANTS.CameraData["aspect"], 
		CONSTANTS.CameraData["near"], 
		CONSTANTS.CameraData["far"]);

    camera.position.x = CONSTANTS.CameraData["position"][0];
	camera.position.y = CONSTANTS.CameraData["position"][1]
	camera.position.z = CONSTANTS.CameraData["position"][2]

    const scene = new THREE.Scene();

    let light = new THREE.PointLight();
    light.position.set(0.8, 0, 1.0);
	light.intensity = 3;
    scene.add(light);

    let characterMixers = [];
    const animationActions = [];
    let activeAction = [];
    let lastAction = [];

	let modelsReady = false;

	const textureLoader = new THREE.TextureLoader();
	
	// Loading all resources
	
    const fbxLoader = new FBXLoader();

	for (let characterIndex = 0; characterIndex < CONSTANTS.CharactersNumber; ++characterIndex){
		console.log(CONSTANTS.CharactersData)
		const characterValues = CONSTANTS.CharactersData[characterIndex];

		const path = "/resources/" + characterValues["fileName"];

		for (let index in characterValues["textures"]){
			console.log("Loading " + path + "/" + characterValues["textures"][index]);
			const texture = textureLoader.load(path + "/" + characterValues["textures"][index]);
			texture.wrapS = THREE.RepeatWrapping;
			texture.wrapT = THREE.RepeatWrapping;
			texture.magFilter = THREE.NearestFilter;
		}

		fbxLoader.load(
			'/resources/' + characterValues["fileName"]  + '/Idle.fbx',
			(object) => {
				object.traverse( function ( child ) {
					if ( child.isMesh ) {
						child.castShadow = true;
						child.receiveShadow = true;
					}
				} );
				
				console.log("Character number : " + characterIndex + ", scale : " + characterValues["scale"] 
					+ ", position : " + characterValues["position"]);

				object.scale.set(characterValues["scale"][0], characterValues["scale"][1], characterValues["scale"][2]);
				object.position.set(characterValues["position"][0], characterValues["position"][1], characterValues["position"][2]);

				const currentMixer = new THREE.AnimationMixer(object);

				characterMixers.push(currentMixer);

				const idleAction = currentMixer.clipAction( object.animations[0]);
				idleAction.play();
	
				scene.add(object);

				let animationsName = [...SINGLE_ANIMATIONS];

				for (let index in MULTIPLE_ANIMATIONS){
					for (let i = 0; i < characterValues[MULTIPLE_ANIMATIONS[index] + "Number"]; ++i){
						animationsName.push(MULTIPLE_ANIMATIONS[index] + (i + 1));
					}
				}

				console.log(animationsName);

				for (let index in animationsName){
					let animation = animationsName[index];

					fbxLoader.load(
						'/resources/' + characterValues["fileName"]  + '/' + animation + '.fbx',
						(object) => {
							currentMixer.clipAction(object.animations[0]);
						},
						(xhr) => {
							console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
						},
						(error) => {
							console.log(error);
					});
				}
				

				if (characterIndex == CONSTANTS.CharactersNumber - 1){
					modelsReady = true;
				}
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

    function render() {
		const delta = clock.getDelta();

      	if (resizeRendererToDisplaySize(renderer)) {
    		const canvas = renderer.domElement;
    		camera.aspect = canvas.clientWidth / canvas.clientHeight;
    		camera.updateProjectionMatrix();
      	}
    
     	if (modelsReady){
			for (let i = 0; i < CONSTANTS.CharactersNumber; ++i){
				characterMixers[i].update(delta);
			}
		} 
     	else 
        	console.log("Model not ready");

      	renderer.render(scene, camera);

      	requestAnimationFrame(render);
    }

    const setAction = (index, toAction) => {
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

	function parseKey(key, code){

	}
	
	document.addEventListener('keypress', (event) => {
		parseKey(event.key, event.code);
	  }, false);

    requestAnimationFrame(render);
}

main();
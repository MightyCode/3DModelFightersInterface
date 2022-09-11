import * as THREE from '/librairies/threejs/three.module.js';
import * as CONSTANTS from '/constants.js';
import { FBXLoader  } from '/librairies/threejs/examples/jsm/loaders/FBXLoader.js';
import { CharactersData } from './constants.js';

const SINGLE_ANIMATIONS = [
	"Walking",/*"Run",
	"Finishing", "Death"*/
]

const MULTIPLE_ANIMATIONS = [
	/*"Attack", "Hurt"*/
]

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas});

    /*const camera = new THREE.PerspectiveCamera(
		CONSTANTS.CameraData["fov"], 
		CONSTANTS.CameraData["aspect"], 
		CONSTANTS.CameraData["near"], 
		CONSTANTS.CameraData["far"]);*/

	const camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2,  window.innerHeight / 2,  window.innerHeight / - 2, 1, 1000 );

    camera.position.x = CONSTANTS.CameraData["position"][0];
	camera.position.y = CONSTANTS.CameraData["position"][1];
	camera.position.z = CONSTANTS.CameraData["position"][2];

	camera.rotation.x = CONSTANTS.CameraData["orientation"][0];
	camera.rotation.y = CONSTANTS.CameraData["orientation"][1];
	camera.rotation.z = CONSTANTS.CameraData["orientation"][2];

    const scene = new THREE.Scene();

	let light = new THREE.AmbientLight(0x404040);
	light.intensity = 5;

	scene.add(light);

    let characterMixers = [];
    const animationActions = [];
    let activeAction = [];
    let lastAction = [];

	let modelsReady = false;

	let characterImageIcon = [];

	let charactersLifeText = [];

	let characterCurrentLife = [];
	let characterDamageTaken = [];

	let currentCharacterAttacking = -1;
	let currentAttackedCharacter = -1;

	// Loading all resources

		
	const textureLoader = new THREE.TextureLoader();
    const fbxLoader = new FBXLoader();

	for (let characterIndex = 0; characterIndex < CONSTANTS.CharactersNumber; ++characterIndex){
		const characterValues = CONSTANTS.CharactersData[characterIndex];

		const path = "/resources/" + characterValues["fileName"];

		for (let index in characterValues["textures"]){
			console.log("Loading " + path + "/" + characterValues["textures"][index]);
			const texture = textureLoader.load(path + "/" + characterValues["textures"][index]);
			texture.wrapS = THREE.RepeatWrapping;
			texture.wrapT = THREE.RepeatWrapping;
			texture.magFilter = THREE.NearestFilter;
		}

		
		let text = document.createElement('div');
		text.style.position = 'absolute';
		text.style.width = 400;
		text.style.height = 400;
		text.style.color = "white";
		text.style.fontSize = "40px";
		let textPosition = getPositionForLife(characterValues["position"]);
		text.style.right = textPosition[0]  + 'px';
		text.style.top = textPosition[1]  + 'px';
		text.style.textAlign = "left";
		text.innerHTML = "0 %";

		document.body.appendChild(text);
		
		charactersLifeText.push(text);

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
				object.rotation.set(characterValues["orientation"][0], characterValues["orientation"][1], characterValues["orientation"][2])

				const currentMixer = new THREE.AnimationMixer(object);

				characterMixers.push(currentMixer);

				const idleAction = currentMixer.clipAction(object.animations[0]);
				idleAction.play();
	
				scene.add(object);

				let animationsName = [...SINGLE_ANIMATIONS];

				animationActions.push([]);
				animationActions[characterIndex].push();
				activeAction.push(idleAction);

				for (let index in MULTIPLE_ANIMATIONS){
					for (let i = 0; i < characterValues[MULTIPLE_ANIMATIONS[index] + "Number"]; ++i){
						animationsName.push(MULTIPLE_ANIMATIONS[index] + (i + 1));
					}
				}

				for (let index in animationsName){
					let animation = animationsName[index];

					fbxLoader.load(
						'/resources/' + characterValues["fileName"]  + '/' + animation + '.fbx',
						(object_in) => {
							console.log("Loading " + animation);
							const tempAnimation = currentMixer.clipAction(object_in.animations[0]);

							animationActions[characterIndex].push(tempAnimation);
						},
						(xhr_in) => {
							console.log((xhr_in.loaded / xhr_in.total) * 100 + '% loaded');
						},
						(error_in) => {
							console.log(error_in);
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

		characterImageIcon.push([]);

		var material = new THREE.MeshLambertMaterial({
			map: textureLoader.load('/resources/' + characterValues["fileName"] + "/icon.png"),
			transparent: true
		});
		var geometry = new THREE.PlaneGeometry(characterValues["iconScale"], characterValues["iconScale"]);

		for (let i = 0; i < CONSTANTS.GameData["numberLife"]; ++i){
			var mesh = new THREE.Mesh(geometry, material);

			mesh.position.set(
				characterValues["position"][0] + i * 50 + 60, characterValues["position"][1] * 1.01 - 16, -50);
	
			// add the image to the scene
			scene.add(mesh);
			characterImageIcon[characterIndex].push(mesh);
		}

		characterCurrentLife.push(CONSTANTS.GameData["numberLife"]);
		characterDamageTaken.push(0);
	}

	function getPositionForLife(characterPosition){
		return [window.innerWidth * 0.5 - characterPosition[0] - 20,
				window.innerHeight * 0.5 - characterPosition[1] + 80 ];
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
		const action = animationActions[index][toAction];

        if (action != activeAction[index]) {
            lastAction[index] = activeAction[index];
            activeAction[index] = action;
            lastAction[index].stop();
            //lastAction.fadeOut(1)
            activeAction[index].reset();
            //activeAction.fadeIn(1)
            activeAction[index].play();
        }
    }

	function convertKeyToCharacterNumber(key){
		if (isNaN(key) || isNaN(parseFloat(key)))
			return -1;

		const value = parseInt(key);

		if (value < 0 || value >= CONSTANTS.CharactersNumber)
			return -1;

		return parseInt(key);
	}

	function parseKey(key, code){
		if (code === "Space"){
			currentCharacterAttacking = -1;
			return;
		} 

		const index = convertKeyToCharacterNumber(key);
		if (index == -1)
			return;

		if (currentCharacterAttacking === -1){
			if (characterCurrentLife[index] <= 0)
				return;

			currentCharacterAttacking = index;
			charactersLifeText[index].style.fontWeight = "bold";
		} else {
			if (characterCurrentLife[index] <= 0)
				return;

			characterAttack(currentCharacterAttacking, index);

			charactersLifeText[currentCharacterAttacking].style.fontWeight = "normal";
			currentCharacterAttacking = -1;
		}
	}

	function characterAttack(attacking, attacked){
		if (attacking === attacked)
			return;

		characterDamageTaken[attacked] += CONSTANTS.GameData["damage"] / CONSTANTS.CharactersData[attacking]["coefficient"];
		characterDamageTaken[attacked] = parseFloat(characterDamageTaken[attacked].toFixed(1));

		if (characterDamageTaken[attacked] > 100){
			characterDamageTaken[attacked] = 0;
			characterCurrentLife[attacked] -= 1;
		}

		charactersLifeText[attacked].innerHTML = characterDamageTaken[attacked] + " %";
	}
	
	document.addEventListener('keypress', (event) => {
		parseKey(event.key, event.code);
	}, false);

    requestAnimationFrame(render);
}

main();
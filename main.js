import * as THREE from '/librairies/threejs/three.module.js';
import * as CONSTANTS from '/constants.js';
import { FBXLoader  } from '/librairies/threejs/examples/jsm/loaders/FBXLoader.js';
import * as SHAKING from "/shaking.js"

const HIT_TEXT_COLOR = "Red";

const SINGLE_ANIMATIONS = [
	"Idle", "Walking", "Death", /*"Run",*/
	"Finishing"
]

const MULTIPLE_ANIMATIONS = [
	"Attack", "Hurt"
]

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas, alpha: true });
	
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

	let light = new THREE.AmbientLight(0xf2ecd3);
	light.intensity = 1;
	scene.add(light);
	
	light = new THREE.DirectionalLight(0x404040);
	light.intensity = 5.5;
	light.position.x = 0;
	light.position.y = 500;
	light.position.z = 50;

	scene.add(light);

    let characterMixers = [];
    const animationActions = [];
    let activeAction = [];
    let lastAction = [];

	let characterLifeIcon = [];

	let charactersLifeText = [];

	let characterCurrentLife = [];
	let characterDamageTaken = [];

	let currentCharacterAttacking = -1;
	let currentAttackedCharacter = -1;

	let timeCurrentHitRemaining = 0;
	let timeCurrentHitGoal = 0;

	// Loading all resources
		
	const textureLoader = new THREE.TextureLoader();

	//const background = textureLoader.load("/resources/background.png")

    const fbxLoader = new FBXLoader();

	let animationToLoadRemaining = 0;

	for (let characterIndex = 0; characterIndex < CONSTANTS.CharactersNumber; ++characterIndex){
		characterMixers.push("");
		animationActions.push([]);
		activeAction.push("");
		lastAction.push("");

		const characterValues = CONSTANTS.CharactersData[characterIndex];

		animationToLoadRemaining += SINGLE_ANIMATIONS.length;

		for (let index in MULTIPLE_ANIMATIONS){
			animationToLoadRemaining += characterValues[MULTIPLE_ANIMATIONS[index] + "Number"];
		}
	}

	//console.log("NUmber model to load = " + animationToLoadRemaining);

	let text = document.createElement('div');
	text.style.position = 'absolute';
	text.style.width = 400;
	text.style.height = 400;
	text.style.color = "white";
	text.style.backgroundColor = "#000000bf";
	// bf :-)


	text.style.fontSize = "30px";
	text.style.left = 10 + 'px';
	text.style.bottom = 10 + 'px';

	text.style.textAlign = "left";
	text.style.verticalAlign = "bottom";
	text.innerHTML = "Game made by MightyCode(Bazin Maxence)";
	text.classList.add("not-selectable");

	document.body.appendChild(text);


	for (let characterIndex = 0; characterIndex < CONSTANTS.CharactersNumber; ++characterIndex){
		const characterValues = CONSTANTS.CharactersData[characterIndex];

		const path = "/resources/" + characterValues["fileName"];

		for (let index in characterValues["textures"]){
			//console.log("Loading " + path + "/" + characterValues["textures"][index]);
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
		text.style.fontSize = "50px";
		let textPosition = getPositionForLife(characterValues["position"]);
		text.style.right = textPosition[0]  + 'px';
		text.style.top = textPosition[1]  + 'px';
		text.style.textAlign = "left";
		text.innerHTML = "0 %";
		text.style.textShadow = "2px 2px 4px black" 
		text.classList.add("not-selectable");

		document.body.appendChild(text);
		
		charactersLifeText.push(text);

		fbxLoader.load(
			'/resources/' + characterValues["fileName"]  + '/Idle.fbx',
			(object) => {
				/*object.traverse( function ( child ) {
					if ( child.isMesh ) {
						child.castShadow = true;
						child.receiveShadow = true;
					}
				} );*/
				
				/*console.log("Character number : " + characterIndex + ", scale : " + characterValues["scale"] 
					+ ", position : " + characterValues["position"]);*/

				object.scale.set(characterValues["scale"][0], characterValues["scale"][1], characterValues["scale"][2]);
				object.position.set(characterValues["position"][0], characterValues["position"][1], characterValues["position"][2]);
				object.rotation.set(characterValues["orientation"][0], characterValues["orientation"][1], characterValues["orientation"][2])

				const currentMixer = new THREE.AnimationMixer(object);

				characterMixers[characterIndex] = currentMixer;

				const idleAction = currentMixer.clipAction(object.animations[0]);
				idleAction.timeScale = 0.9 + Math.random() * 0.2;
				idleAction.play();
	
				scene.add(object);

				animationActions[characterIndex] = [idleAction];
				activeAction[characterIndex] = idleAction;
				lastAction[characterIndex] = idleAction;

				
				let animationsName = [...SINGLE_ANIMATIONS];
				animationsName.splice(0, 1);

				for (let index in MULTIPLE_ANIMATIONS){
					for (let i = 0; i < characterValues[MULTIPLE_ANIMATIONS[index] + "Number"]; ++i){
						animationsName.push(MULTIPLE_ANIMATIONS[index] + (i + 1));
					}
				}

				for (let index in animationsName){
					animationActions[characterIndex].push("");
				}

				for (let index in animationsName){
					let animation = animationsName[index];

					fbxLoader.load(
						'/resources/' + characterValues["fileName"]  + '/' + animation + '.fbx',
						(object_in) => {
							//console.log("Loading " + animation + " for " +  characterValues["fileName"] + " remaining " + (animationToLoadRemaining - 1));
							
							const tempAnimation = currentMixer.clipAction(object_in.animations[0]);
							if (animation == "Death"){
								tempAnimation.loop = THREE.LoopOnce;
								tempAnimation.clampWhenFinished = true;
							}
							
							animationActions[characterIndex][animationsName.indexOf(animation) + 1] = tempAnimation;

							--animationToLoadRemaining;
							if (animationToLoadRemaining == 0){
								requestAnimationFrame(render);
							}
						},
						(xhr_in) => {
							//console.log((xhr_in.loaded / xhr_in.total) * 100 + '% loaded');
						},
						(error_in) => {
							//console.log(error_in);
					});
				}

				animationToLoadRemaining -= 1;
				if (animationToLoadRemaining == 0)
					modelsReady = true;
			},
			(xhr) => {
				//console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
			},
			(error) => {
				//console.log(error);
			}
		);

		characterLifeIcon.push([]);

		var material = new THREE.MeshLambertMaterial({
			map: textureLoader.load('/resources/' + characterValues["fileName"] + "/icon.png"),
			transparent: true
		});
		var geometry = new THREE.PlaneGeometry(characterValues["iconScale"], characterValues["iconScale"]);

		for (let i = 0; i < CONSTANTS.GameData["numberLife"]; ++i){
			var mesh = new THREE.Mesh(geometry, material);

			mesh.position.set(
				characterValues["position"][0] + i * (characterValues["iconScale"] * 1.1) - 80, characterValues["position"][1] * 1.01 -50, -50);
	
			// add the image to the scene
			scene.add(mesh);
			characterLifeIcon[characterIndex].push(mesh);
		}

		characterCurrentLife.push(CONSTANTS.GameData["numberLife"]);
		characterDamageTaken.push(0);
	}

	function getPositionForLife(characterPosition){
		return [window.innerWidth * 0.5 - characterPosition[0] - 40,
				window.innerHeight * 0.5 - characterPosition[1] + 100];
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
    

		// Hit animation
		if (currentAttackedCharacter != -1){
			timeCurrentHitRemaining += delta;
			
			if (timeCurrentHitRemaining >= activeAction[currentCharacterAttacking].getClip().duration 
				&& (activeAction[currentCharacterAttacking] != animationActions[currentCharacterAttacking][getAnimationIndex(currentCharacterAttacking, "Finishing")]
					|| activeAction[currentCharacterAttacking] != animationActions[currentCharacterAttacking][getAnimationIndex(currentCharacterAttacking, "Attack")])){
				setAction(currentCharacterAttacking, getAnimationIndex(currentCharacterAttacking, "Idle"));
			} 

			if (timeCurrentHitRemaining >= timeCurrentHitGoal){
				currentAttackedCharacter = -1;
				currentCharacterAttacking = -1;
			} else if (timeCurrentHitRemaining >= 0.3 && charactersLifeText[currentAttackedCharacter].style.color != "white") {
				charactersLifeText[currentAttackedCharacter].style.color = "white";
			} else if (timeCurrentHitRemaining >= activeAction[currentAttackedCharacter].getClip().duration 
				&& activeAction[currentAttackedCharacter] != animationActions[currentAttackedCharacter][getAnimationIndex(currentAttackedCharacter, "Finishing")]
				&& activeAction[currentAttackedCharacter] != animationActions[currentAttackedCharacter][getAnimationIndex(currentAttackedCharacter, "Death")]){
				//console.log(getAnimationIndex(currentAttackedCharacter, "Run") + " " + getAnimationIndex(currentAttackedCharacter, "Idle"));
				setAction(currentAttackedCharacter, getAnimationIndex(currentAttackedCharacter, "Idle"));
			}
		}

		for (let i = 0; i < CONSTANTS.CharactersNumber; ++i){
			characterMixers[i].update(delta);
		}

      	renderer.render(scene, camera);

      	requestAnimationFrame(render);
    }

    const setAction = (index, toAction) => {
		const action = animationActions[index][toAction];

        if (action != activeAction[index]) {
            lastAction[index] = activeAction[index];
            activeAction[index] = action;
            activeAction[index].reset();
            activeAction[index].play();

			lastAction[index].crossFadeTo(activeAction[index], 0.25, true);
        }
    }

	function getRandomInt(max) {
		return Math.floor(Math.random() * max);
	  }

	function getAnimationIndex(character, type){
		if (SINGLE_ANIMATIONS.includes(type))
			return SINGLE_ANIMATIONS.indexOf(type);
		else if (MULTIPLE_ANIMATIONS.includes(type)){
			let startIndex = 0;

			for (let i = 0; i < MULTIPLE_ANIMATIONS.indexOf(type); ++i){
				startIndex += CONSTANTS.CharactersData[character][MULTIPLE_ANIMATIONS[i] + "Number"]
			}

			//console.log(SINGLE_ANIMATIONS.length + startIndex + getRandomInt(CONSTANTS.CharactersData[character][type + "Number"]));
			
			return SINGLE_ANIMATIONS.length + startIndex + getRandomInt(CONSTANTS.CharactersData[character][type + "Number"]);
		}
			
		return 0;
	}

	function characterAttack(attacking, attacked){
		if (attacking === attacked)
			return;

		characterDamageTaken[attacked] += CONSTANTS.GameData["damage"] / CONSTANTS.CharactersData[attacking]["coefficient"];
		characterDamageTaken[attacked] = parseFloat(characterDamageTaken[attacked].toFixed(1));

		let death = false;

		if (characterDamageTaken[attacked] >= 100){
			characterDamageTaken[attacked] = 0;
			characterCurrentLife[attacked] -= 1;

			scene.remove(characterLifeIcon[attacked][characterCurrentLife[attacked]]);
			characterLifeIcon[attacked].splice(-1);
			
			if (characterCurrentLife[attacked] == 0){
				death = true;
			} 
		}

		if (death){
			setAction(attacked, getAnimationIndex(attacked, "Death"));
			setAction(attacking, getAnimationIndex(attacking, "Finishing"));
			activeAction[attacked].loop = THREE.LoopOnce;

		} else {
			setAction(attacked, getAnimationIndex(attacked, "Hurt"));
			setAction(attacking, getAnimationIndex(attacking, "Attack"));
		}

		timeCurrentHitGoal = Math.max(activeAction[currentCharacterAttacking].getClip().duration, activeAction[currentAttackedCharacter].getClip().duration) + 0.1;

		charactersLifeText[attacked].innerHTML = characterDamageTaken[attacked] + " %";
		charactersLifeText[attacked].style.color = HIT_TEXT_COLOR;

		SHAKING.Shaking(charactersLifeText[attacked]);
		
		timeCurrentHitRemaining = 0;
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
			setAction(currentCharacterAttacking, getAnimationIndex(currentCharacterAttacking, "Idle"));

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

			setAction(currentCharacterAttacking, getAnimationIndex(currentCharacterAttacking, "Walking"));

		} else if (currentAttackedCharacter === -1){
			if (characterCurrentLife[index] <= 0)
				return;

			currentAttackedCharacter = index;
			characterAttack(currentCharacterAttacking, index);

			charactersLifeText[currentCharacterAttacking].style.fontWeight = "normal";
		}
	}

	document.addEventListener('keypress', (event) => {
		parseKey(event.key, event.code);
	}, false);
}

main();
const CameraData = {
	"fov" : 90,
	"aspect" : window.innerWidth / window.innerHeight,
	"near" : 0.1,
	"far" : 100,
	"position" : [0, 100, 0],
	"orientation" : [-0.2, 0, 0]
}

const MODEL_SCALING = 35; 

const SCALING = [200, 150, 200];

const GameData = {
	"fonts" : "helvetiker_regular.typeface.json",
	"damage" : 5,
	"numberLife" : 3
}

const CharactersData = [
  	{
		"filliere" : "matmeca",
		"fileName" : "Mario",
		"scale" : [MODEL_SCALING, MODEL_SCALING, MODEL_SCALING],
		"position" : [-3 * SCALING[0], 1.5 * SCALING[1], -1 * SCALING[2]],
		"orientation" : [0, 0, 0],
		"AttackNumber" : 2,
		"HurtNumber" : 2,
		"coeficient" : 2.4,
		"iconScale" : 0.3
	}, {
		"filliere" : "elec",
		"fileName" : "Mario",
		"scale" : [MODEL_SCALING, MODEL_SCALING, MODEL_SCALING],
		"position" : [0 * SCALING[0], 1.5 * SCALING[1], -1 * SCALING[2]],
		"orientation" : [0, 0, 0],
		"AttackNumber" : 2,
		"HurtNumber" : 2,
		"coeficient" : 2.4,
		"iconScale" : 0.3
	}, {
		"filliere" : "info",
		"fileName" : "Mario",
		"scale" : [MODEL_SCALING, MODEL_SCALING, MODEL_SCALING],
		"position" : [3 * SCALING[0], 1.5 * SCALING[1], -1 * SCALING[2]],
		"orientation" : [0, 0, 0],
		"AttackNumber" : 2,
		"HurtNumber" : 2,
		"coeficient" : 2.4,
		"iconScale" : 0.3
	}, {
		"filliere" : "telecom",
		"fileName" : "Mario",
		"scale" : [MODEL_SCALING, MODEL_SCALING, MODEL_SCALING],
		"position" : [-3 * SCALING[0], -1.5 * SCALING[1], -1 * SCALING[2]],
		"orientation" : [0, 0, 0],
		"AttackNumber" : 2,
		"HurtNumber" : 2,
		"coeficient" : 1.4,
		"iconScale" : 0.3
	}, {
		"filliere" : "rsi",
		"fileName" : "Mario",
		"scale" : [MODEL_SCALING, MODEL_SCALING, MODEL_SCALING],
		"position" : [0 * SCALING[0], -1.5 * SCALING[1], -1 * SCALING[2]],
		"orientation" : [0, 0, 0],
		"AttackNumber" : 2,
		"HurtNumber" : 2,
		"coeficient" : 0.8,
		"iconScale" : 0.3
	}, {
		"filliere" : "see",
		"fileName" : "Mario",
		"scale" : [MODEL_SCALING, MODEL_SCALING, MODEL_SCALING],
		"position" : [3 * SCALING[0], -1.5 * SCALING[1], -1 * SCALING[2]],
		"orientation" : [0, -0, 0],
		"AttackNumber" : 2,
		"HurtNumber" : 2,
		"coeficient" : 0.8,
		"iconScale" : 0.3
	}
];


const CharactersNumber = CharactersData.length;
export { CameraData, CharactersNumber, CharactersData, GameData };
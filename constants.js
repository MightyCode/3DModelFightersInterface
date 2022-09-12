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
	"damage" : 50,
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
		"coefficient" : 2.4,
		"iconScale" : 40
	}, {
		"filliere" : "elec",
		"fileName" : "Mario",
		"scale" : [MODEL_SCALING, MODEL_SCALING, MODEL_SCALING],
		"position" : [0 * SCALING[0], 1.5 * SCALING[1], -1 * SCALING[2]],
		"orientation" : [0, 0, 0],
		"AttackNumber" : 2,
		"HurtNumber" : 2,
		"coefficient" : 2.4,
		"iconScale" : 40
	}, {
		"filliere" : "info",
		"fileName" : "Mario",
		"scale" : [MODEL_SCALING, MODEL_SCALING, MODEL_SCALING],
		"position" : [3 * SCALING[0], 1.5 * SCALING[1], -1 * SCALING[2]],
		"orientation" : [0, 0, 0],
		"AttackNumber" : 2,
		"HurtNumber" : 2,
		"coefficient" : 2.4,
		"iconScale" : 40
	}, {
		"filliere" : "telecom",
		"fileName" : "Mario",
		"scale" : [MODEL_SCALING, MODEL_SCALING, MODEL_SCALING],
		"position" : [-3 * SCALING[0], -1.5 * SCALING[1], -1 * SCALING[2]],
		"orientation" : [0, 0, 0],
		"AttackNumber" : 2,
		"HurtNumber" : 2,
		"coefficient" : 1.4,
		"iconScale" : 40
	}, {
		"filliere" : "rsi",
		"fileName" : "Mario",
		"scale" : [MODEL_SCALING, MODEL_SCALING, MODEL_SCALING],
		"position" : [0 * SCALING[0], -1.5 * SCALING[1], -1 * SCALING[2]],
		"orientation" : [0, 0, 0],
		"AttackNumber" : 2,
		"HurtNumber" : 2,
		"coefficient" : 0.8,
		"iconScale" : 40
	}, {
		"filliere" : "see",
		"fileName" : "Mario",
		"scale" : [MODEL_SCALING, MODEL_SCALING, MODEL_SCALING],
		"position" : [3 * SCALING[0], -1.5 * SCALING[1], -1 * SCALING[2]],
		"orientation" : [0, -0, 0],
		"AttackNumber" : 2,
		"HurtNumber" : 2,
		"coefficient" : 0.8,
		"iconScale" : 40
	}
];


const CharactersNumber = CharactersData.length;
export { CameraData, CharactersNumber, CharactersData, GameData };
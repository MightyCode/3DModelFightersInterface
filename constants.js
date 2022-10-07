const CameraData = {
	"fov" : 90,
	"aspect" : 1080 / 1920,
	"near" : 0.1,
	"far" : 100,
	"position" : [0, 150, 0],
	"orientation" : [-0.2, 0, 0]
}

const MODEL_SCALING = 20; 

const SCALING = [200, -20, 300];

const GameData = {
	"fonts" : "helvetiker_regular.typeface.json",
	"damage" : 1,
	"numberLife" : 3
}

const CharactersData = [
  	{
		"filliere" : "matmeca",
		"fileName" : "Mario",
		"scale" : [MODEL_SCALING, MODEL_SCALING, MODEL_SCALING],
		"position" : [-3 * SCALING[0],  SCALING[1], -2 * SCALING[2]],
		"orientation" : [0, 0, 0],
		"AttackNumber" : 2,
		"HurtNumber" : 2,
		"coefficient" : 2.4,
		"iconScale" : 60,
	}, {
		"filliere" : "elec",
		"fileName" : "Mewtwo",
		"scale" : [MODEL_SCALING * 0.5, MODEL_SCALING * 0.5, MODEL_SCALING * 0.5],
		"position" : [-1.8 * SCALING[0], SCALING[1], -2 * SCALING[2]],
		"orientation" : [0, 0, 0],
		"AttackNumber" : 2,
		"HurtNumber" : 2,
		"coefficient" : 2.4,
		"iconScale" : 60
	}, {
		"filliere" : "info",
		"fileName" : "Link",
		"scale" : [MODEL_SCALING * 0.5, MODEL_SCALING * 0.5, MODEL_SCALING * 0.5],
		"position" : [-0.6 * SCALING[0],  SCALING[1], -2 * SCALING[2]],
		"orientation" : [0, 0, 0],
		"AttackNumber" : 2,
		"HurtNumber" : 2,
		"coefficient" : 2.4,
		"iconScale" : 60
	}, {
		"filliere" : "telecom",
		"fileName" : "Pac-man",
		"scale" : [MODEL_SCALING * 0.5, MODEL_SCALING * 0.5, MODEL_SCALING * 0.5],
		"position" : [0.6 * SCALING[0], SCALING[1], -2 * SCALING[2]],
		"orientation" : [0, 0, 0],
		"AttackNumber" : 2,
		"HurtNumber" : 2,
		"coefficient" : 1.4,
		"iconScale" : 60
	}, {
		"filliere" : "rsi",
		"fileName" : "Sonic",
		"scale" : [MODEL_SCALING * 0.66, MODEL_SCALING * 0.66, MODEL_SCALING * 0.66],
		"position" : [1.8 * SCALING[0],  SCALING[1], -2 * SCALING[2]],
		"orientation" : [0, 0, 0],
		"AttackNumber" : 2,
		"HurtNumber" : 2,
		"coefficient" : 0.8,
		"iconScale" : 60
	}, {
		"filliere" : "see",
		"fileName" : "Kirby",
		"scale" : [MODEL_SCALING * 0.5, MODEL_SCALING * 0.5, MODEL_SCALING * 0.5],
		"position" : [3 * SCALING[0],  SCALING[1], -2 * SCALING[2]],
		"orientation" : [0, -0, 0],
		"AttackNumber" : 2,
		"HurtNumber" : 2,
		"coefficient" : 0.8,
		"iconScale" : 60
	}
];


const CharactersNumber = CharactersData.length;
export { CameraData, CharactersNumber, CharactersData, GameData };
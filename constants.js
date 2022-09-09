const CameraData = {
	"fov" : 90,
	"aspect" : window.innerWidth / window.innerHeight,
	"near" : 0.1,
	"far" : 100,
	"position" : [0, 0.5, 3]
}

const SCALING = 0.2;

const CharactersData = [
  	{
		"fileName" : "Mario",
		"scale" : [SCALING, SCALING, SCALING],
		"position" : [-3, 1.5, -1],
		"AttackNumber" : 2,
		"HurtNumber" : 2
	}, {
		"fileName" : "Mario",
		"scale" : [SCALING, SCALING, SCALING],
		"position" : [0, 1.5, -1],
		"AttackNumber" : 2,
		"HurtNumber" : 2
	}, {
		"fileName" : "Mario",
		"scale" : [SCALING, SCALING, SCALING],
		"position" : [3, 1.5, -1],
		"AttackNumber" : 2,
		"HurtNumber" : 2
	}, {
		"fileName" : "Mario",
		"scale" : [SCALING, SCALING, SCALING],
		"position" : [-3, -1.5, -1],
		"AttackNumber" : 2,
		"HurtNumber" : 2
	}, {
		"fileName" : "Mario",
		"scale" : [SCALING, SCALING, SCALING],
		"position" : [0, -1.5, -1],
		"AttackNumber" : 2,
		"HurtNumber" : 2
	}, {
		"fileName" : "Mario",
		"scale" : [SCALING, SCALING, SCALING],
		"position" : [3, -1.5, -1],
		"AttackNumber" : 2,
		"HurtNumber" : 2
	}
];


const CharactersNumber = CharactersData.length;
export { CameraData, CharactersNumber, CharactersData };
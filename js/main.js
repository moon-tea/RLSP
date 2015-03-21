

var keyBindings = {
	up: ['UP_ARROW', 'K', 'W'],
	down: ['DOWN_ARROW', 'J', 'S'],
	left: ['LEFT_ARROW', 'H', 'A'],
	right: ['RIGHT_ARROW', 'L', 'D'],
	close: ['C'],
	open: ['O'],
	unlock: ['U'],
	lock: ['L'],
	prev_target: ['COMMA'],
	next_target: ['PERIOD'],
	select: ['ENTER'],
	melee_attack: ['E'],
	ranged_attack: ['F'],
	wait: ['SPACE'],
	grab: ['G'],
	cance: ['ESC']
};
var controlsEL = document.getElementById('controls');
var mapContainerEl = document.getElementById('map-container');
var consoleContainerEl = document.getElementById('console-container');
var consoleDirectionsEl = document.getElementById('console-directions');
var controlsHtml = '';
 controlsHtml += '<div class="tr"><div class="td">Action</div> <div class="td">Keys</div></div>';
for(var action in keyBindings){
	controlsHtml += '<div class="tr">';
	controlsHtml += '<div class="td">' + action + '</div>';

	var val = keyBindings[action];
	controlsHtml += '<div class="td">';
	controlsHtml += val.join(', ');
	controlsHtml += '</div>';
	controlsHtml += '</div>';
}

	controlsEL.innerHTML = controlsHtml;

var mapData = [
    '################################################################################',
    '#..#º≡==#~#º≡==#~#º≡==#~#º≡==#~#º≡==#~#....#........#h................#........#',
    '#..#......#......#......#......#......#....#.hhhhhh.#.......2.........+......#5#',
    '#..###║║#####║║#####║║#####║║#####║║###....#.TTTTTT.#.................#+########',
    '#.ï║..................................║....#.hhhhhh.#.................+z...SSSU#',
    '#..║..................................║....#........#.................#z.......#',
    '#..###║║#####║║#####║║#####║║#####║║###....#.hhhhhh.#...hh............+..TTTT..#',
    '#..#......#......#......#......#......#....#.TTTTTT.#..hTTh...........#z.Tha...#',
    '#..#º≡==#~#º≡==#~#º≡==#~#º≡==#~#º≡==#~#....#.hhhhhh.#...hh......h.....##########',
    '#######################################....#........#.................#.......4#',
    '......................................#....#.hhhhhh.#...hh............#........#',
    '......................................#....#.TTTTTT.#..hTTh...........+...hh...#',
    '......................................#....+.hhhhhh.#...hh.........h..#...TT...#',
    '......................................#....+........#.b...............#..hTTh..#',
    '......................................#....#........#...hh.....------.#...TT...#',
    '......................................##++#####++####..hTTh....------.#..hTTh..#',
    '......................................#.............#...hh............#...TT...#',
    '......................................#.............+..........------.#..hTTh..#',
    '......................................#.............+..........------.#...TTm..#',
    '......................................#.............#.................+...hh...#',
    '......................................###############.................#........#',
	'....................................................#.................#.TTTTTTT#',
	'....................................................###+##########+#############',
	'....................................................#...zzzzzzz......3#........#',
	'....................................................#..z..............#........#',
	'....................................................#...z......zzzzzz.#........#',
	'....................................................#.................#........#',
	'....................................................#...zzzzzzz.......#........#',
	'....................................................##############+#############',
	'....................................................#...........#...#.#........#',
	'....................................................#...........#...#.#........#',
	'....................................................#...........##.##.#........#',
	'....................................................#.................#........#',
	'....................................................#.................#........#',
	'....................................................############################',
];

var mapCharToType = {
	'#': 'wall',
	'.': 'floor',
	// '+': 'door',
	'x': 'exit'
};

var entityCharToType = {
	'z': 'zombie',
	'ï': 'informer'
};

var furnitureCharToType = {
	h: 'chair',
	T: 'table',
	S: 'shelves',
	U: 'trashcan',
	'-': 'box',
	'+': 'door',
	'║': 'barred_door',
    'º': 'toilet'
};

var itemsCharToType = {
	'2': 'umbrella',
	'3': 'folding_chair',
	'4': 'meat_tenderizer',
	'5': 'pointy_stick',
	m: 'medkit',
	b: 'bandage',
	a: 'asprin',
};

var playerStartX = 23;
var playerStartY = 7;
var rendererWidth = 40;
var rendererHeight = 22;

RL.ValidTargets.prototype.typeSortPriority = [RL.Entity, RL.Furniture, RL.Item];

// create the game instance
var game = new RL.Game();

game.map.loadTilesFromArrayString(mapData, mapCharToType, 'floor');

game.setMapSize(game.map.width, game.map.height);

game.entityManager.loadFromArrayString(mapData, entityCharToType);
game.itemManager.loadFromArrayString(mapData, itemsCharToType);
game.furnitureManager.loadFromArrayString(mapData, furnitureCharToType);

// add input keybindings
game.input.addBindings(keyBindings);



// set player starting position
game.player.x = playerStartX;
game.player.y = playerStartY;

game.renderer.resize(rendererWidth, rendererHeight);

game.renderer.layers = [
	new RL.RendererLayer(game, 'map',	   {draw: false,   mergeWithPrevLayer: false}),

	new RL.RendererLayer(game, 'furniture', {draw: false,   mergeWithPrevLayer: true}),
	new RL.RendererLayer(game, 'item',	  {draw: false,   mergeWithPrevLayer: true}),
	new RL.RendererLayer(game, 'entity',	{draw: false,   mergeWithPrevLayer: true}),
	new RL.RendererLayer(game, 'damage',	{draw: false,   mergeWithPrevLayer: true}),

	new RL.RendererLayer(game, 'lighting',  {draw: true,	mergeWithPrevLayer: false}),
	new RL.RendererLayer(game, 'fov',	   {draw: true,	mergeWithPrevLayer: false}),
];

mapContainerEl.appendChild(game.renderer.canvas);
consoleContainerEl.appendChild(game.console.el);
game.console.directionsEl = document.getElementById('console-directions');

var statElements = {
	hpEl: document.getElementById('stat-hp'),
	hpMaxEl: document.getElementById('stat-hp-max'),
	meleeWeaponNameEl: document.getElementById('stat-melee-weapon-name'),
	meleeWeaponStatsEl: document.getElementById('stat-melee-weapon-stats'),
	rangedWeaponNameEl: document.getElementById('stat-ranged-weapon-name'),
	rangedWeaponStatsEl: document.getElementById('stat-ranged-weapon-stats'),
};
RL.Util.merge(game.player, statElements);

game.player.renderHtml();

game.furnitureManager.add(25, 7, 'chest');
game.furnitureManager.add(25, 7, 'crate');

game.map.each(function(val, x, y){
	if((x+1) % 5 === 0 && (y+1) % 5 === 0){
		var tile = game.map.get(x, y);
		if(tile.type !== 'wall'){
			game.lighting.set(x, y, 100, 100, 100);
		}
	}
});


game.start();



(function(root) {
	'use strict';

	/**
	* Represents an chat that the player can have.
	* @class Chat
	* @constructor
	* @param {Object} game - Game instance this obj is attached to.
	* @param {String} type - Type of chat. When created this object is merged with the value of Chat.Types[type].
	*/
	var Chat = function Chat(game, type) {
		this.game = game;
		this.type = type;

		var typeData = Chat.Types[type];
		RL.Util.merge(this, typeData);
	};

	var Answer = function Answer(game, type) {
		this.game = game;
		this.type = type;

		var typeData = Answer.Types[type];
		RL.Util.merge(this, typeData);
	};

	Chat.prototype = {
		constructor: Chat,

		/**
		* Game instance this obj is attached to.
		* @property game
		* @type Game
		*/
		game: null,

		/**
		* The type of entity this is.
		* When created this object is merged with the value of Chat.Types[type].
		* @property type
		* @type Object
		*/
		type: null,

		/**
		* Display name for this chat.
		* @property name
		* @type {String}
		*/
		name: null,

		/**
		* Display description for this chat.
		* @property description
		* @type {String}
		*/
		description: null,

		/**
		* Display text for this chat.
		* @property text
		* @type {String}
		*/
		text: null,

		/**
		* The color of the character displayed when rendering this in the console
		* @property color
		* @type String|bool
		*/
		color: null,

		/**
		* The color of the string displayed when rendering this in the console
		* @property description_color
		* @type String|bool
		*/
		description_color: null,

		/**
		* The answers possible for this chat
		* @property answers
		* @type Array
		*/
		answers: [],

		/**
		* The background color the character displayed when rendering this description
		* @property bgColor
		* @type String|bool
		*/
		bgColor: false,
		charStrokeColor: '#000',
		consoleColor: RL.Util.COLORS.blue_alt,

		/**
		 * Checks if this chat can be attached to an entity.
		 * @method canAttachTo
		 * @param {Entity} entity
		 * @return {Bool}
		 */
/*		canAttachTo: function(entity){

		},
*/
		/**
		 * Resolves the effects of attaching this chat to an entity.
		 * @method attachTo
		 * @param {Entity} entity
		 */
/*		attachTo: function(entity){
			this.game.console.logPickUp(entity, this);
		},
*/
		getConsoleName: function(){
			return {
				name: this.name,
				color: this.consoleColor
			};
		},
	};

	Answer.prototype = {
		constructor: Answer,

		/**
		* Game instance this obj is attached to.
		* @property game
		* @type Game
		*/
		game: null,

		/**
		* The type of entity this is.
		* When created this object is merged with the value of Chat.Types[type].
		* @property type
		* @type Object
		*/
		type: null,

		/**
		* Display description for this chat.
		* @property description
		* @type {String}
		*/
		description: null,

		/**
		* Display text for this chat.
		* @property text
		* @type {String}
		*/
		text: null,

		/**
		* The color of the character displayed when rendering this in the console
		* @property color
		* @type String|bool
		*/
		color: null,

		/**
		* The color of the string displayed when rendering this in the console
		* @property description_color
		* @type String|bool
		*/
		description_color: null,

		/**
        * The jump to the next chat, or false if the chat is over
        * @property jump
        * @type String|Bool
        */
        jump: null,

        /**
		* The action to commit after this answer
		* @property action
		* @type Function
		*/
		action: null,

		/**
		* The background color the character displayed when rendering this description
		* @property bgColor
		* @type String|bool
		*/
		bgColor: false,
		charStrokeColor: '#000',
		consoleColor: RL.Util.COLORS.blue_alt,
		
		getConsoleName: function(){
			return {
				name: this.name,
				color: this.consoleColor
			};
		},
	};

	var Defaults = {
        defaultChat: {

        },
		intimitdate: {
			description_color: 'red',
			getConsoleName: function(){
				return {
					name: this.name + '[Intimidate]',
					color: this.consoleColor
				};
			}
		},
        defaultAnswer: {

        },
	};

	var makeIntimidateAnswer = function(obj){
        return RL.Util.merge(obj, Defaults.intimidate);
    };

    var makeDefaultChat = function(obj){
		return RL.Util.merge(obj, Defaults.defaultChat);
	};

    var makeDefaultAnswer = function(obj){
        return RL.Util.merge(obj, Defaults.defaultAnswer);
    };
	
	Chat.Types = {
    two_prisoners: {
        jump: 'welcome',
    	welcome: makeDefaultChat({
    		name: 'welcome',
    		description: 'Two inmates are standing over the dead body of a guard, picking through',
    		text: 'Hey you! Come any closer and I blow your head off!',
    		description_color: '#ccc',
    		color: 'red',
    		answers: [ 
    			makeDefaultAnswer({
    				text: '[attack]',
    				color: 'red',
    				action: function() {
    					player.rangedAttack(npc);
    					game.Faction.setFactionReaction(player.faction, npc.faction);
    					this.jump = 'hostile';
    				},
    			}),
    			makeDefaultAnswer({
    				text: 'Easy, I’m not looking for a fight.',
    				color: '#fff',
    				jump: 'non_hostile',
    			}),
    			makeDefaultAnswer({
    				text: 'Put that down before you hurt yourself.',
    				description: 'Intimidate:',
    				color: 'dark_red',
    				description_color: 'dark_red',
    				action: function() {
    					if(player.Intimidate(npc)) {
    						game.Faction.setFactionReaction(player.faction, npc);
    						npc.mood + 1;
    						//this.jump = 'intimidated;';
    					} else { 
    						game.Faction.setFactionReaction(player.faction, npc);
    						this.jump = 'hostile';
    					}
    				},
    			}),
    		],
    	}),
    	hostile: makeDefaultChat({
    		name: 'hostile',
    		description: 'Inmate with gun:',
    		text: 'That’s it, you asked for it!',
    		description_color: '#ccc',
    		color: 'red',
    		end_chat: true,
    	}),
    	non_hostile: makeDefaultChat({
    		name: 'non-hostile',
    		description: 'The other inmate, heavily tattooed, cracks his knuckles. Inmate with t',
    		text: 'Then get out of here before he turns you into a crater.',
    		description_color: '#ccc',
    		color: 'red',
    		answers: [ 
    			makeDefaultAnswer({
    				text: '[attack]',
    				color: 'red',
    				action: function() {
    					player.rangedAttack(npc);
    					//game.Faction.setFactionReaction(player.faction, npc.faction);
    					this.jump = 'hostile';
    				},
    			}),
    			makeDefaultAnswer({
    				text: 'Alright, I’m leaving now.',
    				color: '#fff',
    				//jump: 'end',
    			}),
    			makeDefaultAnswer({
    				text: 'Put that down before you hurt yourself.',
    				description: 'Persuade:',
    				color: 'dark_green',
    				description_color: 'dark_green',
    				action: function() {
    					if(player.Persuade(npc)) {
    						game.Faction.setFactionReaction(player.faction, npc);
    						npc.mood + 1;
    						//this.jump = 'join-text';
    					} else {
    						//this.jump = 'not-interested';
    					}
    				},
    			}),
    		],
    	}),
    },
};


	root.RL.Chat = Chat;

}(this));

if(Jukebox === undefined) var Jukebox = {};
Jukebox.name = 'Jukebox';
Jukebox.version = '1.0';
Jukebox.GameVersion = '2.042';


//***********************************
//    API calls
//***********************************

Jukebox.init = function(){
	Jukebox.CreateUpgrades();
	
	Jukebox.reset();
	
	Game.customStatsMenu.push(function(){
		CCSE.AppendStatsVersionNumber(Jukebox.name, Jukebox.version);
	});
	
	Game.registerHook('reset', Jukebox.reset);
	Game.registerHook('check', Jukebox.check);
	Music.addTrack('forever',this.dir+'/clickforever.mp3');
	if (Game.prefs.popups) Game.Popup(Jukebox.name + ' loaded!');
	else Game.Notify(Jukebox.name + ' loaded!', '', '', 1, 1);
	Jukebox.isLoaded = 1;
}

//Jukebox.save = function(){
//	let str = Jukebox.DecidedSong;
//	
//	return str;
//}

Jukebox.load = function(str){
	console.log(str);
	var spl = str.split(',');
	
	Jukebox.DecidedSong = parseInt(spl[0]||0);
	
	Game.Upgrades["Song selector"]//.priceLumps = Jukebox.calcCost();
}

Jukebox.reset = function(hard){
	Jukebox.DecidedSong = 0;
	
	Game.Upgrades["Song selector"]//.priceLumps = Jukebox.calcCost();
}

Jukebox.check = function(){
	if (Game.Has('Jukebox')) Game.Unlock('Song selector');
}


//***********************************
//    Mod functions
//***********************************

//Jukebox.InjectIntoGoldenCookie = function(){
//	Game.customShimmerTypes['golden'].customListPush.push(function(me, list){
//		if(Jukebox.DecidedSong && !me.force && !Game.shimmerTypes['golden'].chain){
//			me.force = Jukebox.AllSongs[Jukebox.DecidedSong].effect;
//			me.wrath = 0;
//			Jukebox.DecidedSong = 0;
//			
//			Jukebox.hideSelectorBox();
//		}
//	});
//}

Jukebox.AllSongs = [
	{name:'Automatic',               icon:[ 0, 7]},
	{name:'C418 - Hover',            icon:[26, 17]},
	{name:'C418 - Click',            icon:[10, 0]},
	{name:'C418 - Grandmapacolypse', icon:[15, 5]},
	{name:'C418 - Ascend',           icon:[21, 6]},
	{name:'C418 - Click Forever',    icon:[25, 7],   prereq:'Hot new single'}
];

Jukebox.CreateUpgrades = function(){
	if(!loc) var loc = (str)=>str;
	var order = Game.Upgrades["Background selector"].order + 1 / 1000;
	
	var upgrade = CCSE.NewUpgrade('Song selector', 'Lets you pick which song to play.', 0, [0, 0, CCSE.GetModPath(this.name)+'/icon.png']);
	upgrade.pool = 'toggle';
	upgrade.order = order;
	//upgrade.priceLumps = Jukebox.calcCost();
	
	upgrade.descFunc = function(){
		var choice = Jukebox.AllSongs[Jukebox.DecidedSong];
		return '<div style="text-align:center;">' + 
			   loc("Current :") + ' ' + CCSE.MenuHelper.TinyIcon(choice.icon) + ' <b>' + choice.name + '</b>' + 
			   '</div><div class="line"></div>' + 
			   (this.ddesc?this.ddesc:this.desc)
	};
	
	upgrade.choicesFunction = function(){
		var choices = [];
		
		for (var i = 0; i < Jukebox.AllSongs.length; i++){
			var temp = Jukebox.AllSongs[i];
			
			if(!temp.prereq || Game.Has(temp.prereq)){
				choices[i] = {name:temp.name, icon:temp.icon};
				//Music.loopTrack(choices[i].name);
				var neg = Jukebox.AllSongs[i].negative?true:false;
				
				if(i == Jukebox.DecidedSong){
					choices[i].selected = choices[i];
				//	if(i) choices[i].name = 'Destiny Decided: ' + choices[i].name;
				//} else {
				//	if(Jukebox.DecidedSong) choices[i] = 0;
				//	else{
				//		choices[i].selected = 0;
				//		choices[i].name += ' - ' + (neg?'gains ':'costs ') + '<span class="price lump' + ((neg||this.priceLumps<=Game.lumps) ? '' : ' disabled') + '">' + Beautify(Math.round((neg?1:this.priceLumps))) + '</span>';
				//	}
				}
				
			} else {
				choices[i] = 0;
			}
		}
		
		return choices;
	}
	
	upgrade.choicesPick = function(id){
		// Don't do things for Undecided of if already decided
		//console.log(id);
		Jukebox.DecidedSong = id
		Jukebox.hideSelectorBox();
		if(id == 0) { // it works shut up
			Music.cue('play')
		} else if(id == 1) { 
			Music.loopTrack('preclick');
		} else if(id == 2) {
			Music.loopTrack('click');
		} else if(id == 3) {
			Music.loopTrack('grandmapocalypse');
		} else if(id == 4) {
			Music.loopTrack('ascend');
		} else if(id == 5) {
			Music.loopTrack('forever');
		}
	//	if(id > 0 && !Jukebox.DecidedSong){
	//		var choice = Jukebox.AllSongs[id];
			
	//		if(choice.negative){
	//			Game.gainLumps(1);
	//			Jukebox.DecidedSong = id;
				
	//			Game.Win('Tradeoff');
				
	//			Jukebox.hideSelectorBox();
	//		} else {
	//			Game.spendLump(Jukebox.calcCost(), 'decide your destiny will be a' + (choice.an?'n':'') + ' ' + choice.name, function(){
	//				Jukebox.DecidedSong = id;
	//				Jukebox.timesDecided++;
	//				upgrade.priceLumps = Jukebox.calcCost();
	//				
	//				Game.Win('Decisive');
	//				if(Jukebox.timesDecided >= 10) Game.Win('Control freak');
	//				if(choice.name == 'Blab') Game.Win('Whimsical');
	//				
	//				Jukebox.hideSelectorBox();
	//			})();
	//		}
	//	}
	}
	
	
	CCSE.NewHeavenlyUpgrade('Jukebox', loc("Unlocks the <b>Song selector</b>, letting you select the game's music."), 999, [0, 0, CCSE.GetModPath(this.name)+'/icon.png'], 316, 281, ['Basic wallpaper assortment']);
	CCSE.NewHeavenlyUpgrade('Hot new single', loc("Adds the album-exclusive song <b>Click Forever</b> to the track list."), 9999, [25,7], 478, 202, ['Jukebox']);
	
	
	Game.upgradesToRebuild = 1;
}

//Jukebox.CreateAchievements = function(){
//	if(!loc) var loc = (str)=>str;
//	var order = Game.Achievements['Thick-skinned'].order + 1 / 1000;
//	var last;
//	
//	last = CCSE.NewAchievement('Decisive', 'Decided destiny <b>1 time</b>.', [22,11]); last.order = order; order += 0.001;
//	last = CCSE.NewAchievement('Control freak', 'Decided destiny <b>10 times</b> in one ascension.', [22,11]); last.order = order; order += 0.001;
//		last.pool = 'shadow';
//	last = CCSE.NewAchievement('Tradeoff', 'Accepted a negative fate for material gain.', [15, 5]); last.order = order; order += 0.001;
//	last = CCSE.NewAchievement('Whimsical', 'Decided your destiny would be a <b>Blab</b>.', [29, 8]); last.order = order; order += 0.001;
//	
//}

Jukebox.isNegative = function(){
	return Jukebox.AllSongs[Jukebox.DecidedSong].negative == 1;
}

//Jukebox.calcCost = function(){
//	return Math.pow(2, Jukebox.timesDecided);
//}

Jukebox.hideSelectorBox = function(){
	if(Game.choiceSelectorOn == Game.Upgrades["Song selector"].id) Game.Upgrades["Song selector"].buy();
}

//Jukebox.debugSpawn = function(){
//	Game.shimmerTypes["golden"].time = 100000;
//}


//***********************************
//    Finalize
//***********************************

Jukebox.launch = function(){
	if(CCSE.ConfirmGameVersion(Jukebox.name, Jukebox.version, Jukebox.GameVersion)) Game.registerMod(Jukebox.name, Jukebox);
}

if(!Jukebox.isLoaded){
	if(CCSE && CCSE.isLoaded){
		Jukebox.launch();
	}
	else{
		if(!CCSE) var CCSE = {};
		if(!CCSE.postLoadHooks) CCSE.postLoadHooks = [];
		CCSE.postLoadHooks.push(Jukebox.launch);
	}
}
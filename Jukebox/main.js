if(Jukebox === undefined) var Jukebox = {};
Jukebox.name = 'Jukebox';
Jukebox.version = '1.1';
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

Jukebox.load = function(str){
	console.log(str);
	var spl = str.split(',');
	Jukebox.DecidedSong = parseInt(spl[0]||0);
}

Jukebox.reset = function(hard){
	Jukebox.DecidedSong = 0;
}

Jukebox.check = function(){
	if (Game.Has('Jukebox')) Game.Unlock('Song selector');
}


//***********************************
//    Mod functions
//***********************************

Jukebox.AllSongs = [
	{name:'Automatic',               icon:[ 0, 7]},
	{name:'C418 - hover',            icon:[26, 17]},
	{name:'C418 - click',            icon:[10, 0]},
	{name:'C418 - grandmapacolypse', icon:[15, 5]},
	{name:'C418 - ascend',           icon:[21, 6]},
	{name:'C418 - click forever',    icon:[25, 7],prereq:'Hot new single'}
];

Jukebox.CreateUpgrades = function(){
	if(!loc) var loc = (str)=>str;
	var order = Game.Upgrades["Background selector"].order + 1 / 1000;
	
	var upgrade = CCSE.NewUpgrade('Song selector', 'Lets you pick which song to play.', 0, [0, 0, CCSE.GetModPath(this.name)+'/icon.png']);
	upgrade.pool = 'toggle';
	upgrade.order = order;
	
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
				var neg = Jukebox.AllSongs[i].negative?true:false;
				
				if(i == Jukebox.DecidedSong){
					choices[i].selected = choices[i];
				}
			} else {
				choices[i] = 0;
			}
		}
		return choices;
	}
	
	upgrade.choicesPick = function(id){
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
	}
	
	
	CCSE.NewHeavenlyUpgrade('Jukebox', loc("Unlocks the <b>Song selector</b>, letting you select the game's music."), 999, [0, 0, CCSE.GetModPath(this.name)+'/icon.png'], 316, 281, ['Basic wallpaper assortment']);
	CCSE.NewHeavenlyUpgrade('Hot new single', loc("Adds the album-exclusive song <b>Click Forever</b> to the track list."), 9999, [25,7], 478, 202, ['Jukebox']);
	
	
	Game.upgradesToRebuild = 1;
}

Jukebox.isNegative = function(){
	return Jukebox.AllSongs[Jukebox.DecidedSong].negative == 1;
}

Jukebox.hideSelectorBox = function(){
	if(Game.choiceSelectorOn == Game.Upgrades["Song selector"].id) Game.Upgrades["Song selector"].buy();
}


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
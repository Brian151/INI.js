//INI.JS
//by ETXAlienRobot201
//Copyright (C) Crystalien Redux Project 2015 - 2016


var counter=0;

function INI(name,notStrict){
    this.sections = new Array();
	this.name = name; //only useful if INI object is stored in an array
	this.strict = false;
	if (!notStrict){
		this.strict = true;
	}
	
	this.createSection = function(index){
		var tempS = [];
		this.sections.push(tempS);
		tempS.push("main"); //default section header
		tempS.push([]); //key
		tempS.push([]); //value
	}
	
	this.findValue = function(section,key,flagDupe){
		var out = "data_missing";
		if (flagDupe) {
			out = false;
		}
		for (var i=0; i < this.sections.length; i++){
			if(this.sections[i][0] == section){
				for (var i2=0; i2 < this.sections[i][1].length; i2++){
					if (this.sections[i][1][i2] == key){
						out = this.sections[i][2][i2];
						if (flagDupe) {
							out = true;
						}
						break;
					}
				}
			}
		}
		return out;
	}
	
	this.getSection = function(section,flagDupe) {
		var out = ["data_missing",[],[]];
		if (flagDupe) {
			out = false;
		}
		for (var i=0; i < this.sections.length; i++){
			if(this.sections[i][0] == section){
				out = this.sections[i];
				if (flagDupe) {
					out = true;
				}
				break;
			}
		}
		return out;
	}
	
	this.toString = function(){
	var out = "";
		for (var i=0; i < this.sections.length; i++){
			out += "\n\n[" + this.sections[i][0] + "]";
			for (var i2=0; i2 < this.sections[i][1].length; i2++){
				out+= "\n" + this.sections[i][1][i2] + "=" + this.sections[i][2][i2];
			}
		}
	return out;
	}
	
	//strict mode methods merged into the data-reading methods
	
	//INI-writing methods:
	
	//add section <name>
	this.addSection = function(name){
		if(name){
			var failed = false;
			if(this.strict){
				failed = this.getSection(name,true);
			}
			if(!failed){
			this.createSection(this.sections.length);
			this.sections[this.sections.length-1][0] = name;
			} else {
				console.log("DUPLICATE SECTION FOUND!");
			}
		}
	}
	
	//add key <keyName> to section <secName> , and set its value to <value>
	this.addKey =  function(secName,keyName,keyValue){
		for (var i=0; i < this.sections.length; i++){
			if (this.sections[i][0] == secName) {
				var failed = false;
				if (this.strict) {
					failed = this.findValue(secName,keyName,true);
				}
				if (!failed) {
					this.sections[i][1].push(keyName);
					this.sections[i][2].push(keyValue);
				} else {
					console.log("DUPLICATE KEY FOUND!");
				}
			}
		}
	}
	
	//rename section <secName> to <secName2>
	this.reNameSection = function(secName,secName2) {
		var failed = false;
		if (this.strict){
			failed = this.getSection(secName2,true);
		}
		if (!failed){
			for (var i=0; i < this.sections.length; i++){
				if (this.sections[i][0] == secName) {
					this.sections[i][0] = secName2;
				}
			}
		}
	}
	
	//rename key <keyName> to <keyName2> ,within section <secName>
	this.reNameKey = function(secName,keyName,keyName2){
		for (var i=0; i < this.sections.length; i++) {
			var failed = false;
			if (this.sections[i][0] == secName){ 
				if (this.strict){
					failed = this.findValue(secName,keyName2,true);
				}
				if (!failed){
					for (var i2=0; i2 < this.sections[i][1].length; i2++) {
						if (this.sections[i][1][i2] == keyName) {
							this.sections[i][1][i2] = keyName2;
						}
					}
				}
			}
		}
	}
	
	//change the value of key <keyName> to <value> , within section <secName>
	this.changeKeyValue = function(secName,keyName,value){
		for (var i=0; i < this.sections.length; i++) {
			if(this.sections[i][0] == secName){
					for (var i2=0; i2 < this.sections[i][1].length; i2++) {
						if (this.sections[i][1][i2] == keyName) {
							this.sections[i][2][i2] = value;
					}
				}
			}
		}
	}
	
	//remove section <secName> from INI
	this.removeSection = function(secName) {
		for (var i=0; i < this.sections.length; i++) {
			if (this.sections[i][0] == secName) {
				this.sections.splice(i,1);
			}
		}
	}
	
	//remove key <key> from section <secName>
	this.removeKey = function(secName,keyName){
		for (var i=0; i < this.sections.length; i++) {
			if (this.sections[i][0] == secName) {
				for (var i2=0; i2 < this.sections[i][1].length; i2++) {
					if (this.sections[i][1][i2] == keyName) {
						this.sections[i][1].splice(i2,1);
						this.sections[i][2].splice(i2,1);
					}
				}
			}
		}
	}
	
}

function parseINI(src,name,disableStrict){
	/*deals with carriage return line feed new lines, 
	which otherwise could compromise the INI object's data
	*/
	var carRet=src.indexOf("\r");
	if(carRet >= 0){
	var parsing=src.split("\r\n");
	}else{
    var parsing=src.split("\n");
	}
    if (!name){
     name="INI_"+counter;
     counter++;
    }
    var output = new INI(name);
    var sC = 0;
	var kC = 0;
	output.createSection(sC);
	if (!disableStrict){
	var sectionNames = new Array();
	var keyNames = new Array();
	output.strict=true;
	}

    for (var i=0; i < parsing.length; i++){
     var checkSection=parsing[i].indexOf("[");
	 var checkKey=parsing[i].indexOf("=");
	 var lineType="ignored";
	 if ((checkSection >= 0) && (checkKey == -1)){
		lineType="section";
	 } else if (checkKey >= 0){
		lineType="key";
	 }
        if (lineType == "section") {
		var sec=parsing[i].split("");
		//section syntax validator + cleaner
		var sec2 = "";
		var lbC = 0; //bracket counters
		var rbC = 0;
		for (var i2=0; i2 < sec.length; i2++){
			if (sec[i2] == "["){
			lbC++;
			} else if (sec[i2] == "]"){
			rbC++;
			} else {
			sec2 += sec[i2];
			}
		}
		if ((lbC >= 2)||(rbC >= 2)){
			var bracketTotal = "left brackets: "+lbC+" , right brackets: "+rbC;
			alert("extra brackets detected in section declaration: "+parsing[i]+". \nThese have been removed \n"+bracketTotal);
		}
		parsing[i]=sec2;
		if (!disableStrict){
		var match=false;
			for (var i2=0; i2 < sectionNames.length; i2++){
				if(sectionNames[i2] == parsing[i]){
				match=true;
				}
			}
			if (!match){
			sectionNames.push(parsing[i]);
			}
		}
		if (match){
		alert("found duplicate section: " + parsing[i] + ", skipping");
		continue;
		}
		if (output.sections[sC][0] == "main"){
         output.sections[sC][0] = parsing[i]; //section header
		 } else {
		 sC++;
		 kC=0;
		 output.createSection(sC);
		 output.sections[sC][0] = parsing[i];
		 keyNames=0;
		 keyNames=new Array();
		 }
        }
	
	if (lineType == "key"){
	var data=parsing[i].split("=");
	var key=data[0].split("");
	//key syntax validator
	var key2="";
	var lbC=0; //bracket counters
	var rbC=0;
	for (var i2=0; i2 < key.length; i2++){
		if (key[i2]=="["){
		lbC++;
		} else if (key[i2]=="]"){
		rbC++;
		} else {
		key2+=key[i2];
		}
	}
	if ((lbC >= 1)||(rbC >= 1)){
		var bracketTotal = "left brackets: "+lbC+" , right brackets: "+rbC;
		alert("brackets detected in key: "+data[0]+". \nThese have been removed \n"+bracketTotal);
	}
	data[0]=key2;
	if (!disableStrict){
		var match=false;
			for (var i2=0; i2 < keyNames.length; i2++){
				if(sectionNames[i2]==data[0]){
				match=true;
				}
			}
			if (!match){
			keyNames.push(parsing[i]);
			} 
		}
		if (match){
		alert("found duplicate key: "+data[0]+", skipping");
		continue;
		}
	output.sections[sC][1][kC] = data[0];
	output.sections[sC][2][kC] = data[1];
	kC++;
	}
	
	if(lineType == "ignored"){
		continue;
	}
	
    }
	return output;
}

function INIManager(){
	this.INILib=new Array();
	
	this.registerINI = function(txt,id,notStrict){
		var temp = parseINI(txt,id,notStrict);
		this.INILib.push(temp);
	}
	
	this.getIndexOfINI = function(INIsearch){
		var out = -1;
		for (var i; i < this.INILib.length; i++){
			if (this.INILib[i].name == INIsearch){
				out=i;
			}
		}
		return out;
	}
	
	this.checkoutINI = function(ININame){
	var exists = false;
	var out;
		for (i=0; i < this.INILib.length; i++){
			if (this.INILib[i].name == ININame) {
				exists = true;
				out = this.INILib[i];
			} else {
			continue;
			}
		}
		if (!exists){
			alert("ERROR! INI: "+ININame+" does not exist!");
			return "failed!";
		} else {
			return out;
		}
	}

}

var test = "[[[la]\nfalala=lalalalalalalalala\n[da]\n[kitty]\n]feline[=cat\n[la]\npussy=also means cat\n[DELETE ME]\n[cool games]\ngame1=MineCraft\ngame2=Halo 4\ngame3=Arcuz\ngame4=Epic Battle Fantasy 4\ngame5=Fatcat"
var INIStore = new INIManager();
INIStore.registerINI(test,"myINI");
var test2 = INIStore.checkoutINI("myINI");
var test1 = "";
var INI_S = test2.toString();
test1 += "ORIGINAL:\n" + INI_S + "\n\n";
INIStore.INILib[0].addSection("I am a new section");
INIStore.INILib[0].addSection("I am a new section"); //cause duplicate section error!
INIStore.INILib[0].addKey("I am a new section","New Key","a new key is added!");
INIStore.INILib[0].addKey("I am a new section","New Key","a new key is added!"); //dupe key error!
INIStore.INILib[0].reNameSection("I am a new section","New section re-named");
INIStore.INILib[0].reNameKey("New section re-named","New Key","re-named new key");
INIStore.INILib[0].changeKeyValue("la","falala","Deck the halls with bows of holly, fa-la-la-la-la-la-la-la-la!");
INIStore.INILib[0].removeSection("DELETE ME");
INIStore.INILib[0].removeKey("cool games","game2");
var test3 = INIStore.checkoutINI("myINI");
var INI_S_2 = test3.toString();
test1 += "MODIFIED:\n" + INI_S_2;
alert(test1);

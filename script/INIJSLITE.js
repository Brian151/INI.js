//INI.JS LITE
//by ETXAlienRobot201
//Copyright (C) Crystalien Redux Project 2015
//*lite simply means reduced functions, there's no "premium" version of this lib
//lite is merely stripped down to a point parsing is all it can do, 
//since some implementations may have no use for writing INI data, or cannot for security reasons

var counter=0;

function INI(name,notStrict){
    this.sections=new Array();
	this.name=name; //only useful if INI object is stored in an array
	this.strict=false;
	if (!notStrict){
		this.strict=true;
	}
	
	this.createSection = function(index){
		this.sections[index]=new Array();
		this.sections[index][0]="main"; //default section header
		this.sections[index][1]=new Array(); //key
		this.sections[index][2]=new Array(); //value
	}
	
	this.findValue = function(section,key,index){
	var out="data_missing";
	if (!index){
		for (var i=0; i < this.sections.length; i++){
			if(this.sections[i][0]==section){
				for (var i2=0; i2 < this.sections[i][1].length; i2++){
					if (this.sections[i][1][i2]==key){
						out=this.sections[i][2][i2];
						break;
					} else {
					continue;
					}
				}
			} else {
			continue;
			}
		}
	}
	
	if(index){
	alert("work in progress!!!");
		for (var i=0; i2 < this.sections[index][1].length; i++){
		break;
		}
	}
	
	return out;
	}
	
	this.toString = function(){
	var out="";
		for (var i=0; i < this.sections.length; i++){
			out+="\n\n["+this.sections[i][0]+"]";
			for (var i2=0; i2 < this.sections[i][1].length; i2++){
				out+="\n"+this.sections[i][1][i2]+"="+this.sections[i][2][i2];
			}
		}
	return out;
	}
	
	/* strict mode methods still WIP
	this.findDuplicateSections = function(secName){
		var out=false;
		for(var i=0 in this.sections){
			if(this.sections[i][0]==secName){
				out=true;
				break;
			}
		}
		return out;
	}
	
	this.findDuplicateKeys = function(secName,keyName){
		
	}
	*/
	
	//stripped INI-writing methods out
	
	//finds section by searching for matching key value pair
	//assumes no duplicate key/value pairs exist!
	this.lookupSectionByKeyValuePair =function(key,value){
	var out = "@INI-404";
	for (i=0; i <this.sections.length; i++)
		for (i2=0; i2 < this.sections[i].length; i2++){
			if ((this.sections[i][1][i2]==key)&&(this.sections[i][2][i2]==value)){
				out=this.sections[i][0];
				break;
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
    var sC=0;
	var kC=0;
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
	 if ((checkSection >=0)&&(checkKey==-1)){
		lineType="section";
	 } else if (checkKey >= 0){
		lineType="key";
	 }
        if (lineType == "section") {
		var sec=parsing[i].split("");
		//section syntax validator + cleaner
		var sec2="";
		var lbC=0; //bracket counters
		var rbC=0;
		for (var i2=0; i2 < sec.length; i2++){
			if(sec[i2]==" "){
			sec2+="_";
			} else if (sec[i2]=="["){
			lbC++;
			} else if (sec[i2]=="]"){
			rbC++;
			} else {
			sec2+=sec[i2];
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
				if(sectionNames[i2]==parsing[i]){
				match=true;
				}
			}
			if (!match){
			sectionNames.push(parsing[i]);
			}
		}
		if (match){
		alert("found duplicate section: "+parsing[i]+", skipping");
		continue;
		}
		if (output.sections[sC][0]=="main"){
         output.sections[sC][0]=parsing[i]; //section header
		 } else {
		 sC++;
		 kC=0;
		 output.createSection(sC);
		 output.sections[sC][0]=parsing[i];
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
		if(key[i2]==" "){
		key2+="_";
		} else if (key[i2]=="["){
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
	output.sections[sC][1][kC]=data[0];
	output.sections[sC][2][kC]=data[1];
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

var test = "[[[la]\nfalala=lalalalalalalalala\n[da]\n[dy]\n]feline[=cat\n[la]\npussy=also means cat"
var hello = parseINI(test);
x=hello.toString();
alert(x);
var INIStore = new INIManager();
INIStore.registerINI(test,"myINI");
var test2 = INIStore.checkoutINI("myINI");
alert(test2);
var test3 = INIStore.checkoutINI("INIno.404");
alert(test3);
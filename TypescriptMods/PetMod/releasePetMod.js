var modBreeding;
(function (modBreeding) {
    modBreeding.audio = new Audio('https://dl.dropboxusercontent.com/s/t3xqbmi7jw5vy8v/glass_ping-Go445-1207030150.mp3');
    modBreeding.audio.volume = 0.2;
    (function () {
        //load css
        //create dom etc
        //Loads external CSS file. This code will be removed if CSS will be added to mods css file.
        var link = document.createElement("link");
        link.href = "https://dl.dropboxusercontent.com/s/awmvc1k6pg5izzy/stylesheet.css";
        link.type = "text/css";
        link.rel = "stylesheet";
        $("head").appendChild(link);
        //Creates a holder in which breeding nests are housed.    
        var body = document.getElementsByTagName("body")[0];
        createElem("div", body, {
            id: "petHelperHolder",
            innerHTML: "<div class='petMenu'><button class='close' onclick=' getElem(&#39;petHelperHolder&#39;).style.display = &#39;none&#39; '>Close</button> <button class='close'>Options</button></div>"
        });
        //Create a menu entry to open breeder
        var f = document.createElement("span");
        f.className = "wide_link";
        f.id = "breeding_link";
        f.style.cssFloat = "left";
        f.onclick = function () {
            getElem("petHelperHolder").style.display = "block";
            modBreeding.updateHolderWithNests();
        };
        f.innerHTML = "Breeding Menu";
        var md = getElem("mods_link");
        getElem("settings").insertBefore(f, md);
        //Creates templeate which takes pairs as input
        breeding_pair_template = Handlebars.compile("\
		<div class='petMenu'><button class='close' onclick='getElem(&#39;petHelperHolder&#39;).style.display = &#39;none&#39;'>Close</button> <button class='close'>Options</button></div> \
		  {{#each breedingPair}}\
		   <div id='petPair{{@index}}' class='pair' style='display:block'>\
			 <div id='pet{{@index}}_0' class='pet' onclick='modBreeding.openNest({{@index}}, 0);' >\
					<div id='pet{{@index}}_0_petPic' class='petPic'> </div>\
					<div class='barHolder'>\
						<div id='pet{{@index}}_0_hunger' class='hunger'></div>\
						<div id='pet{{@index}}_0_happiness' class='happiness'></div>\
						<div id='pet{{@index}}_0_update' class='barTextHolder'>Hunger\
							<br/>Happiness</div>\
					</div>\
					<button id='pet{{@index}}_0_breed' class='breed' onclick = 'modBreeding.breed({{@index}}, 0)'>Breed</button>\
				   <button id='pet{{@index}}_0_feed' class='feed' onclick = 'modBreeding.feedPet({{@index}}, 0)'>Feed</button>\
				</div>\
				<div id='pet{{@index}}_1' class='pet'>\
				  <div id='pet{{@index}}_1_petPic' class='petPic' onclick='modBreeding.openNest({{@index}}, 1);'></div>\
					<div class='barHolder'>\
						<div id='pet{{@index}}_1_hunger' class='hunger'></div>\
						<div id='pet{{@index}}_1_happiness' class='happiness'></div>\
						<div id='pet{{@index}}_1_update' class='barTextHolder'>Hunger\
							<br/>Happiness</div>\
					</div>\
					<button id='pet{{@index}}_1_breed' class='breed' onclick = 'modBreeding.breed({{@index}}, 1)'>Breed</button>\
				   <button id='pet{{@index}}_1_feed' class='feed' onclick = 'modBreeding.feedPet({{@index}}, 1)'>Feed</button>\
				</div>\
			</div>\
		 {{/each}}\
	");
    })();
    var nests = [];
    var nestPairs = [];
    //Search map for nests
    function findNests() {
        nests = [];
        for (var i in on_map[300]) {
            if (on_map[300][i] !== undefined) {
                for (var j in on_map[300][i]) {
                    if (on_map[300][i][j] !== undefined && on_map[300][i][j].params !== undefined && on_map[300][i][j].b_i == 479) {
                        nests.push(on_map[300][i][j]);
                    }
                }
            }
        }
        return this;
    }
    ;
    //create nest pair
    function createPairs() {
        nestPairs = [];
        var tempPetPairs = [];
        //loop goes through each nests and finds a pair nest
        for (var nest in nests) {
            if (nests[nest].params.other_nest !== undefined) {
                var other_nest_x = nests[nest].params.other_nest.i + 10;
                var other_nest_y = nests[nest].params.other_nest.j + 10;
                for (var z = nest; z < nests.length; z++) {
                    tempPetPairs = [];
                    //pair nests are pushed together as a Pair array ( tempPetPairs[] ) and then into array storing all arrays ( petPairs[] ).
                    if (other_nest_x == nests[z].i && other_nest_y == nests[z].j) {
                        tempPetPairs.push(nests[nest]);
                        tempPetPairs.push(nests[z]);
                        nestPairs.push(tempPetPairs);
                    }
                }
            }
        }
        //Ensure there are no duplicates
        //DOESNT SEEM TO BE NECCESSARY?????
        /*
        for (var pairIndex1 = 0; pairIndex1 < nestPairs.length; pairIndex1++) {
            var temp1 = nestPairs[pairIndex1][0];
            var temp2 = nestPairs[pairIndex1][1];
            for (var pairIndex = 0; pairIndex < nestPairs.length; pairIndex++) {
                if (temp1 == nestPairs[pairIndex][1] && temp2 == nestPairs[pairIndex][0]) {
                    nestPairs.splice(pairIndex, 1);
                }
            }
        }
        */
        return this;
    }
    ;
    modBreeding.updateHolderWithNests = function () {
        findNests();
        createPairs();
        getElem("petHelperHolder").innerHTML = breeding_pair_template({ breedingPair: nestPairs });
    };
    modBreeding.updateHolderWithNests();
    var wait = false;
    var update = setInterval(function () {
        //Update hapiness & hunger bars
        for (var i in nestPairs) {
            if (modBreeding.getHunger(i, 0) !== undefined) {
                if (wait = false && modBreeding.getHunger(i, 0) >= 80 && modBreeding.getHunger(i, 0) !== 100 || modBreeding.getHunger(i, 1) >= 80 && modBreeding.getHunger(i, 1) != 100) {
                    modBreeding.audio.play();
                    wait = true;
                }
                else {
                    wait = false;
                }
                getElem('pet' + i + '_1_hunger').style.width = modBreeding.getHunger(i, 1) + "%";
                getElem('pet' + i + '_0_hunger').style.width = modBreeding.getHunger(i, 0) + "%";
                getElem('pet' + i + '_1_happiness').style.width = getHappiness(i, 1) + "%";
                getElem('pet' + i + '_0_happiness').style.width = getHappiness(i, 0) + "%";
                getElem('pet' + i + '_0_update').innerHTML = "Hunger " + modBreeding.getHunger(i, 0) + "%" + "<br/>Happiness" + getHappiness(i, 0) + "%";
                getElem('pet' + i + '_1_update').innerHTML = "Hunger " + modBreeding.getHunger(i, 1) + "%" + "<br/>Happiness" + getHappiness(i, 1) + "%";
                if (nestPairs[i][0].params.pet_id !== undefined) {
                    getElem('pet' + i + '_0_petPic').style.background = "url(" + IMAGE_SHEET[pets[nestPairs[i][0].params.pet_id].img.sheet].url + ")";
                    getElem('pet' + i + '_0_petPic').style.backgroundPosition = -(pets[nestPairs[i][0].params.pet_id].img.x * 32) + "px " + -(pets[nestPairs[i][0].params.pet_id].img.y * 32) + "px";
                }
                if (nestPairs[i][1].params.pet_id !== undefined) {
                    getElem('pet' + i + '_1_petPic').style.background = "url(" + IMAGE_SHEET[pets[nestPairs[i][1].params.pet_id].img.sheet].url + ")";
                    getElem('pet' + i + '_1_petPic').style.backgroundPosition = -(pets[nestPairs[i][1].params.pet_id].img.x * 32) + "px " + -(pets[nestPairs[i][1].params.pet_id].img.y * 32) + "px";
                }
            }
        }
    }, 1000);
    var getHappiness = function (y, z) {
        return Breeding.get_pet_happiness(nestPairs[y][z], nestPairs[y][z]);
    };
    modBreeding.getHunger = function (y, z) {
        return Breeding.get_pet_hunger(nestPairs[y][z], nestPairs[y][z]);
    };
    modBreeding.openNest = function (y, z) {
        pet_nest = nestPairs[y][z];
        Breeding.open_nest();
    };
    modBreeding.feedPet = function (y, z) {
        pet_nest = nestPairs[y][z];
        Breeding.feed_pet(players[0], pet_nest, pets[pet_nest.params.pet_id]);
    };
    modBreeding.breed = function (y, z) {
        pet_nest = nestPairs[y][z];
        Breeding.breed();
    };
})(modBreeding || (modBreeding = {}));
//# sourceMappingURL=releasePetMod.js.map
//Test
var modBreeding;
(function (modBreeding) {
    var audio;
    audio = new Audio('https://dl.dropboxusercontent.com/s/t3xqbmi7jw5vy8v/glass_ping-Go445-1207030150.mp3');
    audio.volume = 0.2;
    (function () {
        var nests = [];
        modBreeding.nestPairs = [];
        var nestClick = 0;
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
            return this;
        }
        ;
        function hotkey() {
            function nestKey(e) {
                addClass(document.getElementById('pet_nest_form'), 'hidden');
                var a = Math.floor(nestClick / 10);
                var b = Math.floor(nestClick % 10);
                console.log(a, b);
                try {
                    modBreeding.openNest(a, b);
                    if (nestClick !== 0 && nestClick % 2 !== 0) {
                        nestClick += 9;
                    }
                    else if (true) {
                        nestClick += 1;
                    }
                    console.log(nestClick);
                    console.log(e);
                }
                catch (e) {
                    nestClick = 0;
                }
            }
            ;
            document.addEventListener("keydown", function (b) {
                //223 UK, 220 others
                if (b.keyCode === 220)
                    (nestKey(b));
            });
        }
        hotkey();
        function updateImages(i) {
        }
    });
    var BreedingMod;
    (function (BreedingMod) {
        var Pet = (function () {
            function Pet(properties) {
                this.image = {};
                this.image = properties;
            }
            Pet.prototype.getHappiness = function () {
                return Breeding.get_pet_happiness(modBreeding.nestPairs[y][z], modBreeding.nestPairs[y][z]);
            };
            return Pet;
        }());
        BreedingMod.Pet = Pet;
        var getHappiness = function (y, z) {
        };
        var getHunger = function (y, z) {
            return Breeding.get_pet_hunger(modBreeding.nestPairs[y][z], modBreeding.nestPairs[y][z]);
        };
        var openNest = function (y, z) {
            nestClick = y * 10 + z;
            pet_nest = modBreeding.nestPairs[y][z];
            Breeding.open_nest();
        };
        var feedPet = function (y, z) {
            pet_nest = modBreeding.nestPairs[y][z];
            Breeding.feed_pet(players[0], pet_nest, pets[pet_nest.params.pet_id]);
        };
        var breed = function (y, z) {
            pet_nest = modBreeding.nestPairs[y][z];
            Breeding.breed();
        };
    })(BreedingMod || (BreedingMod = {}));
    ;
})(modBreeding || (modBreeding = {}));
//# sourceMappingURL=BreedingHelperRedesign.js.map
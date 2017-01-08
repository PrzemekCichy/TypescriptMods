declare var createElem, wrapper, getElem, breeding_pair_template, Handlebars, pet_nest, Breeding, pets, on_map, IMAGE_SHEET, players, $;
//Test
module modBreeding {

    var audio;
    audio = new Audio('https://dl.dropboxusercontent.com/s/t3xqbmi7jw5vy8v/glass_ping-Go445-1207030150.mp3');
    audio.volume = 0.2;

    (function () {
    var nests = [];
    export var nestPairs = [];

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
    };


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
    };

    function hotkey() {
        function nestKey(e) {
            addClass(document.getElementById('pet_nest_form'), 'hidden');
            var a = Math.floor(nestClick / 10);
            var b = Math.floor(nestClick % 10);

            console.log(a, b);
            try {
                openNest(a, b);
                if (nestClick !== 0 && nestClick % 2 !== 0) {
                    nestClick += 9;
                } else if (true) {
                    nestClick += 1;
                }
                console.log(nestClick);
                console.log(e);

            } catch (e) {
                nestClick = 0;
            }

        };
        document.addEventListener("keydown", function (b) {
            //223 UK, 220 others
            if (b.keyCode === 220) (nestKey(b));
        });
    }
    hotkey();

    function updateImages(i) {
    }





}

declare interface CreateElement {
    id: string;
    class: string;
    tag: string;
    styles: {

    };
}


module BreedingMod {

    export class Pet {

        private image = {};
        private 

        public constructor(properties: any[]) {
            this.image = properties;
        }

        getHappiness() {
            return Breeding.get_pet_happiness(nestPairs[y][z], nestPairs[y][z]);
        }
    }


    var getHappiness = function (y, z) {

    }

    var getHunger = function (y, z) {
        return Breeding.get_pet_hunger(nestPairs[y][z], nestPairs[y][z]);
    }
    var openNest = function (y, z) {
        nestClick = y * 10 + z;
        pet_nest = nestPairs[y][z];
        Breeding.open_nest();
    }

    var feedPet = function (y, z) {
        pet_nest = nestPairs[y][z];
        Breeding.feed_pet(players[0], pet_nest, pets[pet_nest.params.pet_id]);
    };

    var breed = function (y, z) {
        pet_nest = nestPairs[y][z];
        Breeding.breed()
    }
};
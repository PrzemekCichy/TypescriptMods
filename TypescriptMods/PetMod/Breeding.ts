﻿declare var addClass;
interface Pet {

}
interface PetPair {
    pet1: Pet,
    pet2: Pet
}

var current_map = 300;
var on_map: any = [];

module BreedingMod {

    export class Controller {
        static $inject = ['$scope', '$element'];
        private element: ng.IAugmentedJQuery;
        private scope: ng.IAugmentedJQuery;
        private nests: any[] = ["Empty"];
        private nestPair: any[];
        private selectedNest = 0;

        constructor() {
            this.initializeDom();
            this.removeOldListeners();
            this.findNests();
            this.createPairs();
            this.insertPetHTML();
            this.addListeners();
            this.setUpInterval();
            this.initializeListeners();
        };

        private findNests() {
            var tempNests = [];
            for (var x in on_map[300]) {
                if (on_map[300][x] != undefined) {
                    for (var j in on_map[300][x]) {
                        if (on_map[300][x][j] != undefined && on_map[300][x][j].params != undefined && on_map[300][x][j].b_i == 479) {
                            tempNests.push({
                                "x": on_map[300][x][j].i,
                                "y": on_map[300][x][j].j
                            });
                        }
                    }
                }
            }
            if (JSON.stringify(tempNests) === JSON.stringify(this.nests)) {
                return;
            }
            this.nests = tempNests;
        };

        public createPairs() {
            this.nestPair = [];
            var tempPetPair = [];
            //loop goes through each nests and finds a pair nest
            for (var nest in this.nests) {
                var currentlySelected = on_map[300][this.nests[nest].x][this.nests[nest].y];
                if (currentlySelected.params.other_nest == undefined) {
                    return;
                }
                var other_nest_x = currentlySelected.params.other_nest.i + 10;
                var other_nest_y = currentlySelected.params.other_nest.j + 10;

                for (var z:number = nest; z < this.nests.length; z++) {
                    tempPetPair = [];
                    //pair nests are pushed together as a Pair array ( tempPetPair[] ) and then into array storing all arrays ( nestPair[] ).
                    if (other_nest_x == this.nests[z].x && other_nest_y == this.nests[z].y) {
                        tempPetPair.push(on_map[300][this.nests[nest].x][this.nests[nest].y]);
                        tempPetPair.push(on_map[300][this.nests[z].x][this.nests[z].y]);
                        this.nestPair.push(tempPetPair);
                    }
                }


            }
            console.log(this);
        };

        private initializeDom() {
            var link = document.createElement("link");
            link.href = "https://dl.dropboxusercontent.com/s/6hn85tw23v73zb1/breeding_mod.css";
            link.type = "text/css";
            link.rel = "stylesheet";
            $("head").appendChild(link);

            var str =
                "<div id='breeding_pets'>\
                    <div class='breeding_menu'>\
                        <div id='breeding_menu_close' class='breeding_menu_options'>\
                            Close\
                        </div>\
                        <div id= 'breeding_menu_refresh' class='breeding_menu_options'>\
                            Refresh\
                        </div>\
                        <div class='breeding_menu_options breeding_header'>\
                            Breeding Helper Mod v0.8.0\
                        </div>\
                    </div>\
                </div>";

            document.getElementsByTagName("body")[0].insertAdjacentHTML('beforeend', str);
        }

        private openNest(elem) {
            if (current_map !== 300) {
                return;
            }
            console.log(this);
            var i = elem.toElement.id.match(/\d+/)[0];
            this.selectedNest = i;
            pet_nest = on_map[300][this.nests[i].x][this.nests[i].y];
            Breeding.open_nest();
        }

        private nextNest() {
            console.log("Hotkey");
            if (current_map !== 300) {
                return;
            }
            pet_nest = on_map[300][this.nests[this.selectedNest].x][this.nests[this.selectedNest].y];
            Breeding.open_nest();
            this.selectedNest++;
            if (this.selectedNest == this.nests.length) {
                this.selectedNest = 0;
            }
        }
        private update;

        private setUpInterval() {
            var wait = false;
            var audio;
            audio = new Audio('https://dl.dropboxusercontent.com/s/t3xqbmi7jw5vy8v/glass_ping-Go445-1207030150.mp3');
            audio.volume = 0.2;
            this.update = setInterval(() => {
                var nestId = 0;
                this.nests.forEach((nest) => {
                    if (wait == false && Breeding.get_pet_hunger(on_map[300][nest.x][nest.y], on_map[300][nest.x][nest.y]) >= 75 && Breeding.get_pet_hunger(on_map[300][nest.x][nest.y], on_map[300][nest.x][nest.y]) !== 100) {
                        audio.play();
                        wait = true;
                    }
                    var $happiness = document.getElementById("pet_" + nestId + "_happiness");
                    var $hunger = document.getElementById("pet_" + nestId + "_hunger");
                    if (on_map[300][nest.x][nest.y].params.pet_id != null) {
                        $happiness.style.width = Breeding.get_pet_happiness(on_map[300][nest.x][nest.y], on_map[300][nest.x][nest.y]) + "%";
                        $happiness.innerHTML = Breeding.get_pet_happiness(on_map[300][nest.x][nest.y], on_map[300][nest.x][nest.y]) + "%";
                        $hunger.style.width = Breeding.get_pet_hunger(on_map[300][nest.x][nest.y], on_map[300][nest.x][nest.y]) + "%";
                        $hunger.innerHTML = Breeding.get_pet_hunger(on_map[300][nest.x][nest.y], on_map[300][nest.x][nest.y]) + "%";

                    } else {
                        $happiness.style.width = "0%";
                        $happiness.innerHTML = "Add";
                        $hunger.style.width = "0%";
                        $hunger.innerHTML = "Pet";
                    }
                    nestId++;

                });
                wait = false;
            }, 1000);
        }

        private insertPetHTML() {
            var nestId = 0;
            var petId = 0;
            var $holder = document.getElementById("breeding_pets");

            this.nestPair.forEach((nests) => {
                $holder.insertAdjacentHTML('beforeend', "<div id='breeding_nest_" + nestId + "' class='breeding_nests'></div>");
                var $nest = document.getElementById("breeding_nest_" + nestId);

                nests.forEach((nest) => {
                    //if (on_map[300][nest.i][nest.j].params.pet_id != null) {
                        $nest.insertAdjacentHTML('beforeend', this.constructPetHTML(petId));
                    //} else {
                    //    $nest.insertAdjacentHTML('beforeend', this.constructEmptyPetHTML(petId));
                    //}
                    petId++;
                });

                nestId++;
            })
        }


        private constructEmptyPetHTML(nestId: number): string {
            return "<div id='breeding_pet_" + nestId + "' class='breeding_pair'>\
                <div id='pet_"+ nestId + "_pic' class='breeding_pic breeding_empty_pic'></div>\
                <div class='breeding_progress_bar breeding_empty'>Add pet.</div>\
            </div>";
        }

        private constructPetHTML(nestId: number): string {
            return "<div id= 'breeding_pet_" + nestId + "' class='breeding_pair'>\
                    <div id='pet_"+ nestId + "_pic' class='breeding_pic'></div>\
                    <div class='breeding_bars_container'>\
                        <div class='breeding_progress_bar'>\
                            <div id= 'pet_"+ nestId + "_happiness' class='breeding_bar_happiness'></div>\
                        </div>\
                        <div class='breeding_progress_bar' >\
                            <div id='pet_"+ nestId + "_hunger'  class='breeding_bar_hunger'></div>\
                        </div>\
                    </div>\
                </div>";
        }

        private addListeners() {
            for (var i in this.nests) {
                console.log("Added", i);
                document.getElementById("breeding_pet_" + i).addEventListener("click", this.openNest.bind(this), false);
            };
        }

        private removeOldListeners() {
            if (this.nests != null) {
                for (var i in this.nests) {
                    console.log("removed", i);
                    var $elem = document.getElementById("breeding_pet_" + i);
                    if ($elem != null) {
                        $elem.removeEventListener("click", this.openNest.bind(this), false);
                    }
                };
            }
        }

        private initializeListeners() {
            document.addEventListener("keydown", (b) => {
                //223 UK, 220 others
                if (b.keyCode === 220) (this.nextNest());
            });
            //Add refresh listener
            
            //Add close/ Open listeners
        }
    }
}

var AppTest: any = new
    BreedingMod.Controller();


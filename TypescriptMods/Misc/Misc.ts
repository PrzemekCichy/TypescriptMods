﻿//Swap items from inventory with pet inventory
declare var Pet;
function swap() {
    var swapNo = 0;
    function itterate(i) {
        if (i < players[0].temp.inventory.length) {
            //set i to first non-equipped item
            if (players[0].temp.inventory[i].selected == true) {
                i++;
                console.log("SELECTED", i, swapNo);
            } else if (swapNo < players[0].pet.chest.length) {
                //swap  with first item in pet, max 16 times
                Pet.menu_add(i);
                Pet.menu_remove(0);
                swapNo++;
                console.log("swap", i, swapNo);
            } else {
                console.log("break", i, swapNo);
                i = players[0].temp.inventory.length;
            }
            var delay = Math.floor(Math.random() * (200 - 100 + 1)) + 100;
            setTimeout(function () {
                itterate(i);
            },delay);
            console.log("itteration", i, swapNo, delay);
        }
    };
    itterate(0);
}
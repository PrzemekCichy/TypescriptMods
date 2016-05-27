function swap() {
    var swapNo = 0;
    function itterate(i) {
        if (i < players[0].temp.inventory.length) {
            //set i to first non-equipped item
            if (players[0].temp.inventory[i].selected == true) {
                i++;
                console.log("SELECTED", i, swapNo);
            }
            else if (swapNo < players[0].pet.chest.length) {
                //swap  with first item in pet, max 16 times
                Pet.menu_remove(0);
                setTimeout(function () {
                    Pet.menu_add(i);
                }, 130);
                swapNo++;
                console.log("swap", i, swapNo);
            }
            else {
                console.log("break", i, swapNo);
                i = players[0].temp.inventory.length;
            }
            var delay = Math.floor(Math.random() * (320 - 220 + 1)) + 220;
            setTimeout(function () {
                itterate(i);
            }, delay);
            console.log("itteration", i, swapNo, delay);
        }
    }
    ;
    document.addEventListener("keydown", function (b) {
        //Key codes differ on different keyboards, although most keys are similar.
        // Number "2" is code 50, change it to whichever key you wish
        if (b.keyCode === 50) {
            swapNo = 0, itterate(0);
        }
        ;
    });
}
swap();
//# sourceMappingURL=Misc.js.map
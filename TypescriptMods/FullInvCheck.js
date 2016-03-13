(function () {

    //Create audio file
    var audio = new Audio('https://dl.dropboxusercontent.com/s/t3xqbmi7jw5vy8v/glass_ping-Go445-1207030150.mp3');
    audio.volume = 0.2;
    var wait = false;

    //Check for full Inv every 1.5 seconds
    setInterval(function () {
        if (Mods.Miscmd.invSoundEnabled) {
            if (Inventory.is_full(players[0]) && wait === false) {
                audio.play();
                wait = true;
            } else if (Inventory.is_full(players[0]) === false) {
                wait = false;
            }
        }
    }, 1500);

    //Save user option to LocalStorage
    localStorage["invsound"] = localStorage["invsound"] || JSON.stringify(1);
    Mods.Miscmd.invSoundEnabled = JSON.parse(localStorage["invsound"]);
    Mods.Miscmd.invSoundEnabled -= 1;

    //Create entry in Audio Menu
    createElem("div", options_audio, {
        innerHTML: "<span class='wide_link pointer settings' id='InvSound' onclick='toggleInvSound()'>Full Inventory Sound(On)</s>"
    });

    //Toggle switch change state
    var s = getElem("InvSound");
    var toggleInvSound = function () {        
        switch (!Mods.Miscmd.invSoundEnabled) {
            case false:
                s.innerHTML = "Full Inventory Sound(Off)";
                Mods.Miscmd.invSoundEnabled = false;
                break;
            default:
                s.innerHTML = "Full Inventory Sound(On)";
                Mods.Miscmd.invSoundEnabled = true;
                break;
        }
        localStorage["invsound"] = JSON.stringify(Mods.Miscmd.invSoundEnabled);
    }
    toggleInvSound();

})();


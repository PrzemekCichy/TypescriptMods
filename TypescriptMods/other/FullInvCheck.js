///////////////////--------------bosstimer
(function () {
    var a = function () {
        socket.on("message", function (data) {
            if (typeof data === "object" && data.action) {
                if (data.action == "monster_invisible" && objects_data[data.target_id].name.match(/BOSS/g)) {
                    addChatText((objects_data[data.target_id].name + " spawns in " + Math.round(data.duration / 10 / 60) / 100 + " minutes"), false, COLOR.RED);
                }
            }
        });//socket end
    }
    a();
    var switchWorldBugFixOld = switchWorldBugFix;
    switchWorldBugFix = function () {
        switchWorldBugFixOld();
        a();
    }
})();



///////////////////--------------audio
(function () {

    //Create audio file
    var audio = new Audio('https://dl.dropboxusercontent.com/s/t3xqbmi7jw5vy8v/glass_ping-Go445-1207030150.mp3');
    audio.volume = 0.6;
    var wait = false;

    //Check for full Inv every 1.5 seconds
    setInterval(function () {
        if (Mods.Miscmd.invSoundEnabled) {
            if (Inventory.is_full(players[0]) && wait === false) {
                audio.play();
                spawnNotification("Inventory Full", "http://hydra-media.cursecdn.com/evoland.gamepedia.com/thumb/9/99/Inventory1.png/100px-Inventory1.png", "InventoryFull");
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


    Notification.requestPermission();

    function spawnNotification(Body, Icon, Title) {
        var options = {
            body: Body,
            icon: Icon

        }
        var n = new Notification(Title, options);
        n.onclick = function () {
            window.focus();
        };
    }
})();



//////////////------------------Log chat
(function () {
    var date;

    var messageSocket = function () {
        (socket.on("message", function (a) {
            if (typeof a === "object" && a.action == "message") {
                date = new Date(timestamp());
                if (a.data.type == "chat") {
                    console.log("(" + date.toLocaleTimeString() + ") [" + a.data.message.lang + "] <" + a.data.message.user + ">:\t" + a.data.message.text + "\n");
                } else if (a.data.type == "whisper") {
                    console.log("(" + date.toLocaleTimeString() + ") <" + a.data.name + "> to <" + a.data.to + ">:" + a.data.message + " \n");
                }
            } else if (a.action === "join") {
                date = new Date(timestamp());
                console.log(a.name + " has joined World " + a.world + " at " + date.toLocaleTimeString());
            } else if (a.action === "leave") {
                date = new Date(timestamp());
                console.log(a.name + " left at " + date.toLocaleTimeString());
            }
        }));
    }
    messageSocket();

    var switchWorldBugFixOld = switchWorldBugFix;
    switchWorldBugFix = function () {
        switchWorldBugFixOld();
        messageSocket();
    }
})()
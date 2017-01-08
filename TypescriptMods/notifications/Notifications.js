var notifications;
(function (notifications) {
    //Enable for enabling.disabling different features
    var Enable = (function () {
        //Empty constructor by default all true
        function Enable(_sound, _notifications, _logMessages, _inventoryNotifications, _bossRespawn, _autoEscape, _soundHP, _escapeHP) {
            if (_sound === void 0) { _sound = true; }
            if (_notifications === void 0) { _notifications = true; }
            if (_logMessages === void 0) { _logMessages = true; }
            if (_inventoryNotifications === void 0) { _inventoryNotifications = true; }
            if (_bossRespawn === void 0) { _bossRespawn = true; }
            if (_autoEscape === void 0) { _autoEscape = true; }
            if (_soundHP === void 0) { _soundHP = 70; }
            if (_escapeHP === void 0) { _escapeHP = 40; }
            this.sound = _sound;
            this.notifications = _notifications;
            this.logMessages = _logMessages;
            this.inventoryNotifications = _inventoryNotifications;
            this.bossRespawn = _bossRespawn;
            this.autoEscape = _autoEscape;
            this.soundHP = _soundHP;
            this.escapeHP = _escapeHP;
        }
        return Enable;
    }());
    notifications.Enable = Enable;
    //Modify this for according to personal preferences
    notifications.enable = new Enable(true, true, true, true, true, true, 70, 40);
    //Socket
    (function () {
        var socketAction = function () {
            socket.on("message", function (data) {
                selectAction(data);
            }); //socket end
        };
        socketAction();
        var switchWorldBugFixOld = switchWorldBugFix;
        switchWorldBugFix = function () {
            switchWorldBugFixOld();
            socketAction();
        };
    })();
    //Interval for dirty-checking
    (function () {
        var inventoryWait = false;
        setInterval(function () {
            if (notifications.enable.inventoryNotifications) {
                if (39 <= players[0].temp.inventory.length && inventoryWait === false) {
                    spawnNotification("Inventory Full", "http://hydra-media.cursecdn.com/evoland.gamepedia.com/thumb/9/99/Inventory1.png/100px-Inventory1.png", "InventoryFull");
                    inventoryWait = true;
                }
                else if (39 > players[0].temp.inventory.length) {
                    inventoryWait = false;
                }
            }
            if (captcha) {
                audio.play();
            }
        }, 1000);
    })();
    //Find event to notify
    function selectAction(data) {
        if (typeof data === "object" && data.action) {
            //boss
            if (notifications.enable.bossRespawn) {
                if (data.action == "monster_invisible" && objects_data[data.target_id].name.match(/BOSS/g)) {
                    addChatText((objects_data[data.target_id].name + " spawns in " + Math.round(data.duration / 10 / 60) / 100 + " minutes"), false, COLOR.RED);
                }
            }
            //chat
            if (notifications.enable.logMessages) {
                var date;
                if (data.action == "message") {
                    date = new Date(timestamp());
                    if (data.data.type == "chat") {
                        console.log("(" + date.toLocaleTimeString() + ") [" + data.data.message.lang + "] <" + data.data.message.user + ">:\t" + data.data.message.text + "\n");
                    }
                    else if (data.data.type == "whisper") {
                        console.log("(" + date.toLocaleTimeString() + ") <" + data.data.name + "> to <" + data.data.to + ">:" + data.data.message + " \n");
                    }
                }
                else if (data.action === "join") {
                    date = new Date(timestamp());
                    console.log(data.name + " has joined World " + data.world + " at " + date.toLocaleTimeString());
                }
                else if (data.action === "leave") {
                    date = new Date(timestamp());
                    console.log(data.name + " left at " + date.toLocaleTimeString());
                }
            }
            //While in fight, If below escape Hp player will run away from fight
            if (data.action === "hit" && players[0].name === data.target.name) {
                if (notifications.enable.autoEscape &&
                    skills[0].health.current <= notifications.enable.escapeHP) {
                    if (players[0].temp.busy && inAFight && 500 < timestamp() - lastRunAwayAttempt) {
                        Socket.send("run_from_fight", {});
                        lastRunAwayAttempt = timestamp();
                    }
                }
                else if (notifications.enable.sound && skills[0].health.current <= (notifications.enable.soundHP))
                    audio.play();
                ;
            }
            //egg
            if (data.action == "message" && data.data.type !== "chat") {
                var _message = data.data.message;
                if (_message.match(/Scavenger hunt/g)) {
                    spawnNotification(data.data.message, "http://images.all-free-download.com/images/graphiclarge/easter_eggs_clip_art_11010.jpg", "Scavenger Hunt!");
                }
            }
        }
    }
    //Notifications
    Notification.requestPermission();
    function spawnNotification(Body, Icon, Title) {
        var options = {
            body: Body,
            icon: Icon
        };
        if (notifications.enable.sound && Mods.Miscmd.invSoundEnabled) {
            audio.play();
        }
        if (notifications.enable.notifications) {
            var n = new Notification(Title, options);
            n.onclick = function () {
                window.focus();
            };
        }
    }
    //audio
    var audio;
    (function () {
        audio = new Audio('https://dl.dropboxusercontent.com/s/t3xqbmi7jw5vy8v/glass_ping-Go445-1207030150.mp3');
        audio.volume = 0.4;
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
        };
        toggleInvSound();
    })();
})(notifications || (notifications = {}));
//# sourceMappingURL=Notifications.js.map
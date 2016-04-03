declare var createElem, wrapper, getElem, boss_template, Handlebars, pet_nest, Breeding, pets, on_map, IMAGE_SHEET, players, $, angular, online_players;

declare var socket, switchWorldBugFix, objects_data, Socket, npc_base, ServerList;

module timersMod {
    var key = 121531415, channel = "FWB";
    var world = getWorld();
    export var Boss = {};
    var bossID = "", enumBoss = {};
    var date = new Date(), hours = (date.getUTCHours()), minutes = (date.getUTCMinutes()), seconds = (date.getUTCSeconds());
    var audio = new Audio('https://dl.dropboxusercontent.com/s/t3xqbmi7jw5vy8v/glass_ping-Go445-1207030150.mp3');
    audio.volume = 0.2;

    export var emitEnabled = true;

    //Initialize DOM
    (function () {
        var found = 0;
        //Create 2d boss aray and populate with temp data
        for (var i in npc_base) {
            if (npc_base[i].name.match(/BOSS/g)) {
                bossID = npc_base[i].name;
                enumBoss[npc_base[i].name] = found++;
                Boss[bossID] = {};
                for (var x in ServerList.downloaded) {
                    Boss[bossID][x] = "?";
                }
            }
        }
        enumBoss = Object.keys(Boss);
        console.log(enumBoss);
        //load css
        //create dom etc
        //Loads external CSS file. This code will be removed if CSS will be added to mods css file.
        var link = document.createElement("link");
        link.href = "https://dl.dropboxusercontent.com/s/p2ln91cyebni42b/timerCss.css";
        link.type = "text/css";
        link.rel = "stylesheet";
        $("head").appendChild(link);

        //Creates a holder in which breeding nests are housed.    
        var body = document.getElementsByTagName("body")[0];
        createElem("div", body, {
            id: "timersHolder",
            innerHTML: "\
            <div id='timersHolder'>\
                <div class='timersMenu'>\
                    <button class='close'>Close </button>\
                    <button class='close' > Options </button>\
                </div>\
            <div id='timersContent'>\
            </div>\
        </div>\
        "
        });

        //Create a menu entry to open breeder
        var f = document.createElement("span");
        f.className = "wide_link";
        f.id = "boss_link";
        f.style.cssFloat = "left";
        f.onclick = function () {
            getElem("timersHolder").style.display = "block";
        };
        f.innerHTML = "Boss Timers";
        var md = getElem("mods_link");
        getElem("settings").insertBefore(f, md);

        boss_template = Handlebars.compile("\
            {{#each Boss}}\
                <div class='boss'>\
                    <div>\
                        <div class='bossPic'></div>\
                         {{#each this}}\
                        <div class='world'>{{this}}</div>\
                        {{/each}}\
                    </div>\
                </div>\
            {{/each}}\
	");
    })();

    //Select appropriate action based on socket messages
    function action(data) {
        if (data.action == "monster_invisible" && objects_data[data.target_id].name.match(/Chicken/g)) {
            //UPDATE BOSS HOLDER
            updateBossTimer(data);
        } else if (data.action && data.action === "message" && data.data.message.lang === "FWB"/* && players[0].name !== data.data.message.user */) {
            console.log("Message to decrypt received");
            onBossTimers(data.data.message.text);
        }
    }

    //Sets up Boss message listeners
    function initializeSocket() {
        var socketAction = function () {
            socket.on("message", function (data) {
               action(data);
            });//socket end
        }
        socketAction();

        var switchWorldBugFixOld = switchWorldBugFix;
        switchWorldBugFix = function () {
            switchWorldBugFixOld();
            socketAction();
            world = getWorld()
        }
    };
    initializeSocket();

    //Get boss data and Send
    function emitBossTimers(bossToUpdate, BossToUpdateWorld) {
        var message = bossToUpdate + "@" + BossToUpdateWorld + "@" + JSON.stringify(
            Boss[ enumBoss[bossToUpdate] ][ BossToUpdateWorld] );
        //sends encrypted chat line with boss timers
        sendMessage(message);
    };

    //Decrypt and load data
    function onBossTimers(message) {
        var splitMessage = recode(message).split("@");
        Boss[ enumBoss[splitMessage[0]] ][ splitMessage[1] ] = splitMessage[2];
        console.log(Boss[enumBoss[splitMessage[0]]][splitMessage[1]]);
    }

    //encrypt/decrypt message char
    function recode(message) {
        var i, out = '';
        for (i = 0; i < message.length; i += 1) {
            out += String.fromCharCode(message.charCodeAt(i) ^ key);
        }
        return out;
    }

    //Encrypt and send message to chat
    function sendMessage(message) {
        Socket.send('message', {
            data: recode(message),
            lang: channel
        });
    }


    function updateBossTimer(data) {
        //Update boss array for specific world
        //Decide if message should be emmited
        if (Boss[objects_data[data.target_id].name][world] === NaN) {
            emitBossTimers(enumBoss[objects_data[data.target_id].name], 0);

        }
        Boss[objects_data[data.target_id].name][world] = data.duration;
        console.log(data);
    }


    //Find players current world
    function getWorld() {
        return online_players[players[0].name] - 1;
    }

    //RerenderData
    var wait = false;
    var update = function () {

        var a = setInterval(function () {
            //Keep track of timers
            //Decrease timer values
            for (var i in enumBoss) {
                for (var y in Boss[enumBoss[i]]) {
                    if (typeof Boss[enumBoss[i]][y] === "number")
                        Boss[enumBoss[i]][y] -= 1000;
                }
            }
        }, 1000);
    }
    function test() {
        console.log(Boss);
        var data = Boss;
        console.log(data);
        var a = JSON.stringify(data);
        console.log(a);
        var b = recode(a);
        console.log(b);
        var c = recode(b);
        console.log(c);
        var message = 0 + "@" + 0 + "@" + 235988;
        onBossTimers(recode(message));
        console.log(Boss);
        emitBossTimers(0, 0);
        
    }

    //test();

    getElem("timersContent").innerHTML = boss_template({ Boss: Boss });
}

declare var createElem, wrapper, getElem, timers_template, Handlebars, pet_nest, Breeding, pets, on_map, IMAGE_SHEET, players, $;

declare var socket, switchWorldBugFix, objects_data, Socket;

module modBreeding {

    var key = "BunnyLeila";
    var channel = "FWB"

    export var audio = new Audio('https://dl.dropboxusercontent.com/s/t3xqbmi7jw5vy8v/glass_ping-Go445-1207030150.mp3');
    audio.volume = 0.2;

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
            id: "timersHolder",
            innerHTML: "<div class='petMenu'><button class='close' onclick=' getElem(&#39;timersHolder&#39;).style.display = &#39;none&#39; '>Close</button> <button class='close'>Options</button></div>"
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

        //Creates templeate which takes pairs as input
        timers_template = Handlebars.compile("\
		  {{#each Boss}}\
		   <div id='petPair{{@index}}</div>\
		 {{/each}}\
	");
    })();

    //Sets up message listeners
    function initializeSocket() {
        var socketAction = function () {
            socket.on("message", function (data) {
                if (data.action == "monster_invisible" && objects_data[data.target_id].name.match(/BOSS/g)) {
                    //UPDATE BOSS HOLDER
                }
            });//socket end
        }

        socketAction();
        var switchWorldBugFixOld = switchWorldBugFix;
        switchWorldBugFix = function () {
            switchWorldBugFixOld();
            socketAction();
        }
    };
    initializeSocket();

    //Send chat info
    function emitBossTimers() {
        //sends encrypted chat line with boss timers
    };

    //encode char
    function recode (str, key) {
        var i, out = '';
        for (i = 0; i < str.length; i += 1) {
            out += String.fromCharCode(str.charCodeAt(i) ^ key);
        }
        return out;
    }

    function encode() {
        // keyboard listener: encrypt messages starting with "/g " and send them to LR channel
        var chatLine = "  Damn it";
        var key = 420123;
        var encodedLine;
        if (true /*/^\/g /.test(chatLine)*/) {
            encodedLine = recode(chatLine.substring(3), key);
            Socket.send('message', {
                data: encodedLine,
                lang: channel
            });

        }
    }

    function listenForTimers() {
        //Scans chat line for boss timer
    }

    var wait = false;

    var update = setInterval(function () {
        //Keep track of timers
        //Update times
    }, 1000);



}
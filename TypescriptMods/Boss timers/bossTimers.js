//load angular
var fileref = document.createElement('script');
fileref.setAttribute("type", "text/javascript");
fileref.setAttribute("src", "https://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular.min.js");
document.getElementsByTagName("head")[0].appendChild(fileref);
var timersMod;
(function (timersMod) {
    var key = 121531415, channel = "FWB";
    timersMod.world = getWorld();
    timersMod.Boss = {}, timersMod.enumBoss = [], timersMod.BossToNumber = {};
    var bossID = "";
    var audio = new Audio('https://dl.dropboxusercontent.com/s/t3xqbmi7jw5vy8v/glass_ping-Go445-1207030150.mp3');
    audio.volume = 0.2;
    timersMod.bossFoundId = [];
    timersMod.emitEnabled = true;
    //Initialize DOM
    (function () {
        var found = 0;
        //Create 2d boss aray and populate with temp data
        for (var i in npc_base) {
            if (npc_base[i].name.match(/BOSS/g)) {
                timersMod.bossFoundId.push(i);
                bossID = npc_base[i].name;
                timersMod.BossToNumber[npc_base[i].name] = found++;
                timersMod.Boss[bossID] = {};
                for (var x in ServerList.downloaded) {
                    timersMod.Boss[bossID][x] = "?";
                }
                timersMod.Boss[bossID]["ID"] = i;
            }
        }
        //bossFoundId.sort();
        timersMod.enumBoss = Object.keys(timersMod.Boss);
        timersMod.enumBoss.sort();
        // console.log(enumBoss);
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
                    <button class='close' onclick=' getElem(&#39;timersHolder&#39;).style.display = &#39;none&#39; '>Close </button>\
                    <button class='close' > Options </button>\
                </div>\
            <div id='timersContent'  ng-controller='BossTimerController'>\
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
        boss_template = "\
            <div ng-repeat='(key,val) in Bosses'>\
                <div timer-draggable class='boss' >\
                    <div class='bossPic' id='bossPic{{$index}}' ng-style='getBackgroundStyle($index);'></div>\
                    <div ng-repeat='world in val'>\
                        <div class='world'>{{world | timer}}</div>\
                    </div>\
                </div>\
            </div>\
	";
        getElem("timersContent").innerHTML = boss_template;
    })();
    // PreCond : data send is valid
    // PostCond: Selects actuon to carry out based on data properties
    function action(data) {
        if (data.action == "monster_invisible" && objects_data[data.target_id].name.match(/BOSS/g)) {
            //UPDATE BOSS HOLDER
            //console.log(data);
            updateBossTimer(data);
        }
        else if (data.action == "monster_visible" && objects_data[data.target_id].name.match(/BOSS/g)) {
            //UPDATE BOSS HOLDER
            //console.log(data);
            updateBossTimer(data);
        }
        else if (data.action && data.action === "message" && data.data.message.lang === "FWB" && players[0].name !== data.data.message.user) {
            //console.log("Message to decrypt received");
            console.log(data);
            onBossTimers(data.data.message.text, data.data.message.user);
        }
    }
    //Sets up Boss message listeners
    // PreCond : table is not full
    // PostCond: Pass data to action()
    function initializeSocket() {
        var socketAction = function () {
            socket.on("message", function (a) {
                action(a);
            }); //socket end
        };
        socketAction();
        var switchWorldBugFixOld = switchWorldBugFix;
        switchWorldBugFix = function () {
            switchWorldBugFixOld();
            socketAction();
        };
    }
    ;
    initializeSocket();
    //Get boss data and Send
    // PreCond : BossToUpdate && BossToUpdateWorld are valid numbers
    // PostCond: Constructs message to send and calls SendMessage()
    function emitBossTimers(bossToUpdate, BossToUpdateWorld) {
        var message = bossToUpdate + "@" + BossToUpdateWorld + "@" + JSON.stringify(timersMod.Boss[timersMod.enumBoss[bossToUpdate]][BossToUpdateWorld]);
        //sends encrypted chat line with boss timers
        sendMessage(message);
    }
    ;
    // PreCond: message is a valid string in formaat 1@1@201010
    //Or is join message
    // PostCond: Updates Boss timer
    function onBossTimers(message, user) {
        var splitMessage = recode(message).split("@");
        if (splitMessage.length < 2) {
            onJoin(user);
        }
        timersMod.Boss[timersMod.enumBoss[splitMessage[0]]][splitMessage[1]] = parseInt(splitMessage[2]);
        //console.log(Boss[enumBoss[splitMessage[0]]][splitMessage[1]]);
    }
    // PostCond: Returns recoded message encrypted/decrypted
    //Look at more advanced encryption?
    function recode(message) {
        var i, out = '';
        for (i = 0; i < message.length; i += 1) {
            out += String.fromCharCode(message.charCodeAt(i) ^ key);
        }
        //console.log(out);
        return out;
    }
    // PreCond: message must not be already encrypted
    // PostCond: Sends encrypted message to server at specified channel
    function sendMessage(message) {
        console.log("sent message" + message);
        Socket.send('message', {
            data: recode(message),
            lang: channel
        });
    }
    // PostCond: Sends encrypted message to server at specified channel
    function updateBossTimer(data) {
        timersMod.world = getWorld();
        // PreCond: Boss is alive
        if (timersMod.world != -1 && typeof timersMod.Boss[objects_data[data.target_id].name][timersMod.world] !== "number" || data.duration && timersMod.Boss[objects_data[data.target_id].name][timersMod.world] < 0) {
            // PreCond: Boss is alive
            // PostCond: Sets data.duration to -10, indicating boss is alive
            if (typeof data.duration == "undefined") {
                data.duration = -10;
            }
            //Update Boss info and Emmit data.duration. -ve is Alive, +ve is Dead
            timersMod.Boss[objects_data[data.target_id].name][timersMod.world] = parseInt(data.duration);
            if (timersMod.emitEnabled) {
                emitBossTimers(timersMod.BossToNumber[objects_data[data.target_id].name], timersMod.world);
            }
        }
    }
    //Find players current world
    //Post Cond: Returns 0-6 indicating current world, -1 means world is undefined.
    function getWorld() {
        if (online_players[players[0].name] !== "undefined")
            return online_players[players[0].name] - 1;
        else
            return -1;
    }
    timersMod.playersList = [];
    //Post Cond: Emmits message notifying other users
    function emmitJoin() {
        sendMessage("#");
    }
    emmitJoin();
    //Precond: data object contains username
    //Post Cond: Adds new player to list
    function onJoin(data) {
        timersMod.playersList.push(data.data.message.user);
    }
    function test() {
        console.log(timersMod.Boss);
        var data = timersMod.Boss;
        console.log(data);
        var a = JSON.stringify(data);
        console.log(a);
        var b = recode(a);
        console.log(b);
        var c = recode(b);
        console.log(c);
        var message = 0 + "@" + 0 + "@" + 235988;
        // onBossTimers(recode(message));
        console.log(timersMod.Boss);
        emitBossTimers(0, 0);
    }
    var RPGApp;
    setTimeout(function () {
        //do this after view has loaded :)
        RPGApp = angular.module('App', [])
            .controller('BossTimerController', ["$scope", function ($scope, $routeParams) {
                $scope.Bosses = timersMod.Boss;
                //$scope.Bosses["[BOSS] Acid Dragon Lord"][0] = 0;
                //$scope.Bosses["[BOSS] Acid Dragon Lord"][1] = 0;
                //Post Cond: Updates View with Boss pictures
                $scope.getBackgroundStyle = function (i) {
                    try {
                        var boss = timersMod.Boss[timersMod.enumBoss[i]]["ID"];
                        var url = 'url(' + IMAGE_SHEET[npc_base[boss].img.sheet].url + ')';
                        //console.log("Pics");
                        return {
                            'background-image': url,
                            'background-position': -(npc_base[boss].img.x * IMAGE_SHEET[npc_base[boss].img.sheet].tile_height) + "px " + -(npc_base[boss].img.y * IMAGE_SHEET[npc_base[boss].img.sheet].tile_width) + "px"
                        };
                    }
                    catch (e) {
                    }
                };
                //setInterval(() => $scope.Bosses["[BOSS] Acid Dragon Lord"][0] = new Date().toUTCString(), 500);
                var update = function () {
                    var a = setInterval(function () {
                        //Keep track of timers
                        //Decrease timer values
                        for (var i in timersMod.enumBoss) {
                            for (var y in timersMod.Boss[timersMod.enumBoss[i]]) {
                                if (typeof timersMod.Boss[timersMod.enumBoss[i]][y] === "number")
                                    timersMod.Boss[timersMod.enumBoss[i]][y] -= 1000;
                            }
                        }
                        $scope.$apply();
                        //console.log($scope.Bosses);
                    }, 1000);
                };
                update();
            }])
            .filter('timer', function () {
                return function (input) {
                    if (typeof input === "number") {
                        var minutes = Math.floor(input / 60000);
                        var seconds = ((input % 60000) / 1000).toFixed(0);
                        if (input > 0) {
                            return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
                        }
                        else {
                            return "Up" + -minutes + ":" + (-seconds < 10 ? '0' : '') + -seconds;
                        }
                    }
                    return input;
                };
            })
    .directive('timerDraggable', ['$document', function ($document) {
        //Taken from https://docs.angularjs.org/guide/directive
        return {
            link: function (scope, element, attr) {
                var startX = 0, startY = 0, x = 0, y = 0;
                element.on('mousedown', function (event) {
                    // Prevent default dragging of selected content
                    event.preventDefault();
                    startX = event.pageX - x;
                    startY = event.pageY - y;
                    $document.on('mousemove', mousemove);
                    $document.on('mouseup', mouseup);
                });
                function mousemove(event) {
                    y = event.pageY - startY;
                    x = event.pageX - startX;
                    element.css({
                        top: y + 'px',
                        left: x + 'px'
                    });
                }
                function mouseup() {
                    $document.off('mousemove', mousemove);
                    $document.off('mouseup', mouseup);
                }
            }
        };
    }]);
        //updatePics();
        angular.bootstrap(document, ['App']);
    }, 1500);
})(timersMod || (timersMod = {}));
//# sourceMappingURL=bossTimers.js.map
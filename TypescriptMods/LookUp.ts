
(function () { 

var stopExe = undefined;
if (typeof (Mods) === "undefined") {
    stopExe = true;
    addChatText("Please Enable Mods before loading Macro", false, COLOR.RED);
}

var Macro = stopExe || (function () {
    var debug = false, bossInitialize = true, running = true,
        soundNotifications = true, counter = 0, log = true, autoSkill = false,
        delay = 3137, busy = false, wait = false, chatText = "", selectedSkill = "",
        //Escape hp is HP level at which you disengage at once if in combat.
        //StopHp is a point to which engine will attempt to heal.
        escapeHp = 40, stopHp = 90;
    var skillsTypes = [
        "Fighting",
        "Breeding",
        "Farming",
        "Cooking",
        "Gathering",
        "Smelting",
        "Forging",
        "Potions",
        "Buying"
    ];

    var actionList = {
        'Action List Not Loaded': [],
    }, actionNames, selectedAction = "";

    //Sound object. audio.play() to play the sound.
    var audio = new Audio('https://s3.amazonaws.com/mibbit/sounds/join.mp3');
    audio.volume = 0.2;

    (function () {

        //Using handlebars to make a templeate, which is later attached to body.
        Macro_template = Handlebars.compile("\
				<div id='macroMenu'>\
				<button id='close' class='close'>Close</button>\
				<button id='skillStatus' class='macroButton'>Action {{running}}</button>\
				<select id = 'actionsOption'>\
					{{#each actionList}}\
						<option value='{{@key}}'>{{@key}}</option>\
					{{/each}}\
				</select>\
				<button id='soundNotifications' class='macroButton'>Sound Notifications {{soundNotifications}}</button>\
				<button id='debug' class='macroButton'>Debug</button>\
				<button id='log' class='macroButton'>Log Chat Messages {{log}}</button>\
				<button id='bossNotifications' class='macroButton'>Boss Time Left Notifications {{bossInitialize}}</button>\
				<button id='autoSkill' class='macroButton'>AutoSkill {{autoSkill}}</button>\
				<input id='mobToFight' value='inputForParameters'/>\
				<select id = 'autoSkillOption'>\
					{{#each skills}}\
						<option value='{{this}}'>{{this}}</option>\
					{{/each}}\
				</select>\
				<input id='findPeople' value='findPeople'/>\
				<div id='macroNotifications'>\
					{{#each messages}}\
							<option value='{{this}}'>{{this}}</option>\
					{{/each}}\
				</div>\
			");

        //Loads external CSS file.
        var link = document.createElement("link");
        link.href = "https://dl.dropboxusercontent.com/s/g3whgvpq4i47ghz/petMod.css";
        link.type = "text/css";
        link.rel = "stylesheet";
        $("head").appendChild(link);

        //Creates a holder for macro manu is .
        var $macro = createElem("div", $("body"), {
            id: "Macro",
        });

        var $macroLink = createElem("span", $("body"), {
            id: "macroLink",
            className: "wide_link",
            style: {
                cssFloat: "left"
            },
            innerHTML: "Macro Menu",
        });

        $("#settings").insertBefore($macroLink, $("#game_options"));

        //Create a menu entry to open Macro Menu
        $macroLink.addEventListener("click", function (e) {
            getElem("Macro").style.display = "block";
        });



    })();



    //Renders templeate
    function render() {
        $("#Macro").innerHTML = Macro_template({
            skills: skillsTypes,
            actionList: actionList,
            running: running,
            log: log,
            autoSkill: autoSkill,
            bossInitialize: bossInitialize
        });
    };
    render();

    (function () {
        var replaceText = function (tag, text, presentState) {
            switch (presentState) {
                case false:
                    tag.innerHTML = text + "(On)";
                    debug && console.log(text + "On");
                    break;
                case true:
                    tag.innerHTML = text + "(Off)";
                    debug && console.log(text + "Off");
                    break;
            }
        }
        var $autoSkillOption = $("#autoSkillOption");
        $autoSkillOption.addEventListener("click", function () {
            selectedSkill = autoSkillOption.value;
            console.log(selectedSkill);
        });

        $("#macroMenu").addEventListener("click", function (e) {
            // List item found!	Output the ID!
            var tag = e.target, tagID = tag.id.replace("post-")

            switch (tagID) {
                case ("skillStatus"):
                    replaceText(tag, "Action ", running);
                    running = !running;
                    break;

                case ("initializeAction"):
                    Macro.initializeAction();
                    break;

                case ("autoSkill"):
                    replaceText(tag, "AutoSkill ", autoSkill);
                    autoSkill = !autoSkill;
                    break;

                case ("soundNotifications"):
                    replaceText(tag, "Sound Notifications ", soundNotifications);
                    soundNotifications = !soundNotifications;
                    break;

                case ("debug"):
                    replaceText(tag, "Debug ", debug);
                    debug = !debug;
                    break;

                case ("log"):
                    replaceText(tag, "Log Chat Messages ", log);
                    log = !log;
                    break;

                case ("bossNotifications"):
                    replaceText(tag, "Boss Time Left Notifications ", bossInitialize);
                    bossInitialize = !bossInitialize;
                    break;

                case ("close"):
                    $('#Macro').style.display = 'none'
                    break;
            }
        })
    })();


    (function () {
        var a = function () {
            socket.on("message", function (data) {
                if (bossInitialize && typeof data === "object" && data.action) {
                    if (data.action == "monster_invisible" && objects_data[data.target_id].name.match(/BOSS/g)) {
                        console.log(objects_data[data.target_id].name + " spawns in " + Math.round(data.duration / 10 / 60) / 100 + " minutes");
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

    (function () {
        var date;

        var messageSocket = function () {
            (socket.on("message", function (a) {
                if (log && typeof a === "object" && a.action == "message") {
                    date = new Date(timestamp());
                    if (a.data.type == "chat") {
                        console.log("(" + date.toLocaleTimeString() + ") [" + a.data.message.lang + "] <" + a.data.message.user + ">:\t" + a.data.message.text + "\n");
                    } else if (a.data.type == "whisper") {
                        console.log("(" + date.toLocaleTimeString() + ") <" + a.data.name + "> to <" + a.data.to + ">:" + a.data.message + " \n");
                    }
                } else if (log && a.action === "join") {
                    date = new Date(timestamp());
                    console.log(a.name + " has joined World " + a.world + " at " + date.toLocaleTimeString());
                } else if (log && a.action === "leave") {
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
    })();


    //used to find selected people joining
    (function () {
        var inputArray = [];
        var $display = createElem("div", $("#player_healthbar"), {
            id: "displayPeople",
            style: {
                marginTop: "50px"
            },
        });

        var $findPeopleInput = $("#findPeople");
        $findPeopleInput.addEventListener("blur", updatePeople);

        function updatePeople() {
            inputArray = $findPeopleInput.value.split(", ");
        }

        var findPeople = function () {
            (socket.on("message", function (data) {
                if (data.action === "join") {
                    if (inputArray.indexOf(data.name) > -1) {
                        var date = new Date(timestamp());
                        $display.innerHTML = (data.name + " World:" + data.world + " " + date.toLocaleTimeString());
                    }
                }
            }));
        };
        findPeople();
        var switchWorldBugFixOld = switchWorldBugFix;
        switchWorldBugFix = function () {
            switchWorldBugFixOld();
            findPeople();
        }
    })();


    var pickAction = function (i) {
        if (!busy) {
            busy = true;
            if (Array.isArray(selectedAction[i])) {
                moveTo(i);
                debug && console.log("MoveTo");
            } else if (typeof selectedAction[i] == "object") {
                if (!isNaN(selectedAction[i].buyNumber)) {
                    buy(i);
                    debug && console.log("Buy");

                } else if (!isNaN(selectedAction[i].equipID)) {
                    equip(i);
                    debug && console.log("Equip");

                } else if (!isNaN(selectedAction[i].withdrawNumber)) {
                    withdraw(i);
                    debug && console.log("Withdraw");

                } else if (selectedAction[i].j !== "undefined"
                    && selectedAction[i].i !== "undefined") {
                    actionAt(selectedAction[i].i, selectedAction[i].j);
                    debug && console.log("ActionAt");
                }
            }
            else if (typeof selectedAction[i] === "string") {
                if (selectedAction[i] == "depositAll") {
                    deposit();
                    debug && console.log("Deposit");

                } if (selectedAction[i] == "load") {
                    load();
                    debug && console.log("Load Pet");

                } if (selectedAction[i] == "unload") {
                    unload();
                    debug && console.log("Unload Pet");

                } else if (selectedAction[i] == "wait") {
                    wait = true;
                    var random = Math.random();
                    var delay = 0;
                    if (random < 0.3) delay = Math.floor(Math.random() * (10000 - 1000)) + 1000;
                    else delay = Math.floor(Math.random() * (300 - 100)) + 100;
                    setTimeout(function () { wait = false; busy = false; }, delay);
                    debug && console.log("Wait " + delay + "ms");

                }
            }
            debug && console.log("pickAction");
        }
    };


    var callOutActions = (function () {
        //This interval calls next action as well as increase the counter
        //(counter is current action executed)
        var _timestamp = timestamp();
        var skilling = function () {
            (socket.on("message", function (data) {

                if (data.action === "use_skill") {
                    _timestamp = timestamp();
                    busy = true;
                    debug && console.log("use_skill" + busy);
                }

                //While in fight, If below escape Hp player will run away from fight
                if (data.action === "hit") {
                    if (skills[0].health.current <= (escapeHp) && inAFight) {
                        Socket.send("run_from_fight", {});
                        debug && console.log("Hp below " + escapeHp);
                    }
                    _timestamp = timestamp() - 1900;
                }
            }));
        }
        skilling();

        var switchWorldBugFixOld = switchWorldBugFix;
        switchWorldBugFix = function () {
            switchWorldBugFixOld();
            skilling();
        }

        setInterval((function () {

            if ((timestamp() - _timestamp) > 2500) {
                busy = false;
                debug && console.log("use_skill_timstamp_check " + busy);
            };

            if (running && !busy && !movementInProgress(players[0])) {
                //If actions list reaches the end, resets the counter
                if ((skills[0].health.current <= stopHp) && inAFight === !1) {
                    debug && console.log("Hp below " + stopHp);
                    eat();
                } else if (!inAFight && counter >= selectedAction.length) {
                    counter = 0;
                    debug && console.log("Counter set to " + counter);

                } else if (!movementInProgress(players[0])
                    && !players[0].temp.busy
                    && !inAFight
                    && !wait
                    && !busy
                ) {
                    pickAction(counter);
                    //Prevents increase of counter if the object you are performing action is a mob.
                    if (selectedAction[counter].type = OBJECT_TYPE.ENEMY
                        && selectedAction[counter].i != undefined
                        && selectedAction[counter].j
                        && on_map[current_map][selectedAction[counter].i][selectedAction[counter].j] != false
                        && selected_object.b_t == "4"
                    ) {
                        debug && console.log("Mob not killed yet.");

                    } else {
                        counter++;
                    }
                }
            }
            //Captcha notification
            if (captcha && soundNotifications) audio.play();
            //debug && console.log("callOutActions" + "Delay: " + delay);
        }), 333)

    })();


    function buyAll() {
        var buyLoop = function (i) {
            setTimeout(function () {
                Shop.buy(selected_shop);
                if (--i) buyLoop(shop_content[selected_shop].count);
            }, 120)
        };
    }

    function deposit() {
        Chest.deposit_all();
    }

    function loadPet() {
        Mods.Petinv.load();
    }

    function unloadPet() {
        Mods.Petinv.unload();
        setTimeout(function () { busy = false; }, 250);
    }

    //This is method executes coordinates defined in arrays
    //WARNING BUGGY
    function moveTo(i) {
        var p = selectedAction[i];
        i = 0;
        //Interval lasts until there are no more actions to follow
        var a = setInterval(function () {
            if (running) {
                if (i < p.length) {
                    if (players[0].path.length === 0) {
                        players[0].path = findPathFromTo(players[0], p[i], players[0]);
                    }
                    if (players[0].i === p[i].i && players[0].j === p[i].j) {
                        i++;
                    }
                } else {
                    setTimeout(function () { busy = false; }, 200);
                    clearInterval(a);
                }
            }
        }, 1500);
    }

    //Used to perform actions on on_map objects.
    function actionAt(x, y) {
        //If which prevents walking towards location which is unavalible eg. Mob has been killed.
        if (on_map[current_map][x][y] !== false) {
            selected_object = obj_g(on_map[current_map][x][y]);
            ActionMenu.act(0);
        } else {
            setTimeout(function () { busy = false; }, 300)
        }
    }

    //Looks through inventory and equips an item with passed ID
    function equip(ID) {
        for (var i = 0; i < players[0].temp.inventory.length; i++) {
            if (players[0].temp.inventory[i].id == ID && !players[0].temp.inventory[i].selected) {
                InvMenu.use(i);
                debug && console.log("Item equipped. Eq slot:" + i);
                break;

            }
        }
        setTimeout(function () { busy = false; }, 190);
    }

    //Buys items from npc. You need to pass item id and withdraw number,
    function buy(i) {
        var id = selectedAction[i].buyId;
        var number = selectedAction[i].buyNumber;
        this.debug && console.log("Buy no:" + number + ". Buy id:" + id);
        for (var i = 0; i < shop_content.length; i++) {
            if (shop_content[i].id == id) {
                selected_shop = i;
                buyLoop(shop_content[i].count);
                debug && console.log("Selected shop:" + selected_shop);
            }
            var buyLoop = function (i) {
                setTimeout(function () {
                    Shop.buy(selected_shop);
                    if (--i) buyLoop(i);
                }, 160)
            };
        }
        if (Inventory.is_full(players[0])) busy = false;
    }

    //Withdraws items. You need to pass item id and withdraw number,
    function withdraw(i) {
        var id = selectedAction[i].withdrawId;
        var number = selectedAction[i].withdrawNumber;
        this.debug && console.log("Withdraw no:" + number + ". Withdraw id:" + id);
        for (var i = 0; i < chests[0].length; i++) {
            if (chests[0][i].id == id) {
                selected_chest = i;
                Chest.withdraw(number);
                debug && console.log("Selected chest:" + selected_chest);
            }
        }
        setTimeout(function () { busy = false; }, 300);
    }

    function eat() {
        loopFood:
        for (var i = 0; i < players[0].temp.inventory.length; i++) {
            if (typeof item_base[players[0].temp.inventory[i].id].params.heal !== "undefined") {
                //this.debug && console.log("Break out of loop at iteration: " + i);
                if ((skills[0].health.current + item_base[players[0].temp.inventory[i].id].params.heal) < skills[0].health.level) {
                    setTimeout(function () { InvMenu.use(i); }, 175);
                    break loopFood;
                    debug && console.log(" eaten");
                } else {
                    busy = false;
                    break loopFood;
                }
            } else {
                debug && console.log("Food not found");
                busy = true;
            }
        }
    }
    return {
        autoSkilling: function () {
            return autoSkilling;
        },

        populateActions: function (actionPass) {
            actionNames = "";
            actionList = actionPass;
            for (var key in action) {
                actionNames += key + "\n";
            }
            render();
        },
        actions: function () {
            return actionList;
        }
    }

})();

if (!stopExe) addChatText("Macro Loaded", false, COLOR.GREEN);
if (typeof (action) !== "undefined") { addChatText("Action list initialized succesfully", false, COLOR.GREEN); Macro.populateActions(action); }
})()
//Old working version 

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
        escapeHp = 10, stopHp = 10;
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
    if (typeof action == undefined) {
        var action;
    }
    var actionList = {
        'Sand': [
            { i: 73, j: 41 },
            { equipId: 187 },
            { i: 73, j: 44 },
            "destroy"
        ]
    }, actionNames, selectedAction = "";

    //Sound object. audio.play() to play the sound.
    var audio = new Audio('https://s3.amazonaws.com/mibbit/sounds/join.mp3');
    audio.volume = 0.2;

    (function () {
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

        //Using handlebars to make a templeate, which is later attached to body.
        Macro_template = Handlebars.compile("\
    <div id='macroMenu'>\
    <button id='close' class='close'>Close</button>\
    <button id='skillStatus' class='macroButton'>Action (On)</button>\
    <select id = 'actionsOption'>\
    {{#each actionList}}\
    <option value='{{@key}}'>{{@key}}</option>\
    {{/each}}\
    </select>\
    <button id='soundNotifications' class='macroButton'>Sound Notifications (On)</button>\
    <button id='debug' class='macroButton'>Debug (Off)</button>\
    <button id='log' class='macroButton'>Log Chat Messages (On)</button>\
    <button id='bossNotifications' class='macroButton'>Boss Time Left Notifications (On))</button>\
    <button id='autoSkill' class='macroButton'>AutoSkill (Off)</button>\
    <input id='mobToFight' value='inputForParameters'/>\
    <select id = 'autoSkillOption'>\
    {{#each skills}}\
    <option value='{{this}}'>{{this}}</option>\
    {{/each}}\
    </select>\
    <input id='findPeople' value='findPeople'/>\
    <div id='macroNotifications'>{{messages}}</div>\
    ");


    })();

    function render() {
        $("#Macro").innerHTML = Macro_template({
            skills: skillsTypes,
            actionList: actionList,
        });
    };

    render();

    (function () {
        var tag;
        var replaceText = function (text, presentState) {
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

        $("#macroMenu").addEventListener("click", function (e) {
            // List item found!  Output the ID!
            tag = e.target, tagID = tag.id.replace("post-");
            console.log(e.target)

            switch (tagID) {
                case ("skillStatus"):
                    replaceText("Action ", running);
                    running = !running;
                    break;

                case ("initializeAction"):
                    Macro.initializeAction();
                    break;

                case ("autoSkill"):
                    replaceText("AutoSkill ", autoSkill);
                    autoSkill = !autoSkill;
                    break;

                case ("soundNotifications"):
                    replaceText(tag, "Sound Notifications ", soundNotifications);
                    soundNotifications = !soundNotifications;
                    break;

                case ("debug"):
                    replaceText("Debug ", debug);
                    debug = !debug;
                    break;

                case ("log"):
                    replaceText("Log Chat Messages ", log);
                    log = !log;
                    break;

                case ("bossNotifications"):
                    replaceText("Boss Time Left Notifications ", bossInitialize);
                    bossInitialize = !bossInitialize;
                    break;

                case ("close"):
                    $('#Macro').style.display = 'none'
                    break;
            }

        });


        var $autoSkillOption = $("#autoSkillOption");
        $autoSkillOption.addEventListener("click", function () {
            selectedSkill = autoSkillOption.value;
            console.log(selectedSkill);
        });
        var $actionsOption = $("#actionsOption");
        $actionsOption.addEventListener("click", function () {
            selectedAction = actionList[actionsOption.value];
            console.log(selectedAction);
        });

    })();


    (function () {
        var a = function () {
            socket.on("message", function (data) {
                if (bossInitialize && typeof data === "object" && data.action) {
                    if (data.action == "monster_invisible" && objects_data[data.target_id].name.match(/BOSS/g)) {
                        Macro_template({ messages: (objects_data[data.target_id].name + " spawns in " + Math.round(data.duration / 10 / 60) / 100 + " minutes"), })
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
    //This is the 'brain'. It decides what to do with passed argument and which method to call.
    //It does not decide when to call it.
    var pickAction = function (i) {
        if (!busy) {
            busy = true;
            if (Array.isArray(selectedAction[i])) {
                Macro.moveTo(i);
                debug && console.log("MoveTO");
            } else if (typeof selectedAction[i] == "object") {
                if (!isNaN(selectedAction[i].buyNumber)) {
                    Macro.buy(i);
                    debug && console.log("Buy");

                } else if (!isNaN(selectedAction[i].equipId)) {
                    Macro.equip(selectedAction[i].equipId);
                    debug && console.log("Equip");

                } else if (!isNaN(selectedAction[i].withdrawQuantity)) {
                    Macro.withdraw(i);
                    debug && console.log("Withdraw");

                } else if (selectedAction[i].j !== "undefined"
                    && selectedAction[i].i !== "undefined") {
                    Macro.actionAt(selectedAction[i].i, selectedAction[i].j);
                    debug && console.log("ActionAt");
                }
            }
            else if (typeof selectedAction[i] === "string") {
                if (selectedAction[i] == "depositAll") {
                    Macro.deposit();
                    debug && console.log("Deposit");

                } else if (selectedAction[i] == "load") {
                    Macro.load();
                    debug && console.log("Load Pet");

                } else if (selectedAction[i] == "unload") {
                    Macro.unload();
                    debug && console.log("Unload Pet");

                } else if (selectedAction[i] == "destroy") {
                    Macro.destroy();
                    debug && console.log("Destroy :D");

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

            if ((timestamp() - _timestamp) > 2700) {
                busy = false;
                debug && console.log("use_skill_timstamp_check " + busy);
            };

            if (running && !busy && !movementInProgress(players[0])) {

                //If actions list reaches the end, resets the counter
                if (skills[0].health.current <= (stopHp) && inAFight === !1) {
                    debug && console.log("Hp below " + stopHp);
                    Macro.eat();
                } else if (!inAFight && autoSkill && !busy) {
                    autoSkilling.search();

                } else if (counter >= selectedAction.length) {
                    counter = 0;
                    debug && console.log("Counter: below " + counter);

                } else if (!movementInProgress(players[0])
                    && !players[0].temp.busy
                    && !inAFight
                    && !wait
                ) {
                    if (!busy) {
                        pickAction(counter);
                    };

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
        }), 1633)

    })();

    var autoSkilling = (function () {
        var a = players[0].temp.inventory
        var b;
        $autoSkillingInput = $("#mobToFight");
        $autoSkillingInput.addEventListener("blur", updateSkills);
        var inputArray = [];

        function updateSkills() {
            inputArray = $autoSkillingInput.value.split(", ");
        }
        updateSkills();

        var onMap = function () {
            busy = true;
            var myX = players[0].i, myY = players[0].j;
            var objectFound;

            var lookUp = function (x, y) {
                //console.log("LookUp")
                if (on_map[current_map][x] !== undefined
                    && on_map[current_map][x][y] !== undefined
                    && on_map[current_map][x][y] !== false
                    && on_map[current_map][x][y].id !== undefined
                ) {

                    objectFound = on_map[current_map][x][y];
                    if (selectedSkill === "Fighting" && objectFound.id !== "undefined"
                        && objects_data[objectFound.id].temp !== "undefined"
                        && (inputArray.indexOf("inputForParameters") > -1 || inputArray.indexOf(objects_data[objectFound.id].name) > -1)
                        && findPathFromTo(players['0'], { i: x, j: y }, players['0']).length > -1 && objects_data[objectFound.id].temp.busy == false) {

                        console.log(objects_data[objectFound.id]);
                        Macro.actionAt(x, y);
                        return true
                    } else if ((selectedSkill === ("cooking"))) {
                        var campfire = false;
                        var chest = false;

                        if (objects_data[objectFound.id].name === "Campfire") {
                            campfire = true;
                            console.log(objects_data[objectFound.id]);
                        } else if (objects_data[objectFound.id].name === "Chest") {
                            console.log(objects_data[objectFound.id]);
                            chest = true;
                        }

                        if (sand && furnace) {
                            return true
                        };

                    } else if ((selectedSkill === ("Forging")) && objects_data[objectFound.id].name) {
                        var furnace = false;
                        var sand = false;

                        if (!furnace && objects_data[objectFound.id].name === "Furnace") {
                            console.log(objects_data[objectFound.id]);
                        }

                        //Macro.actionAt(x, y);
                        if (sand && furnace) {
                            return true
                        };
                    }
                }
            }

            var search = (function () {

                //console.log(selectedSkill)
                loop1:
                for (var i = 0; i < 14; i++) {
                    var offset = 1 * i;

                    for (var c = 0; c < 3 + 2 * i; c++) {
                        if (lookUp((myX - offset), (myY - offset + c))) {
                            break loop1;
                        } else if (lookUp((myX + offset), (myY - offset + c))) {
                            break loop1;
                        } else if (lookUp((myX - offset + c), (myY - offset))) {
                            break loop1;
                        } else if (lookUp((myX - offset + c), (myY + offset))) {
                            break loop1;
                        };


                    }
                }
                busy = false;
            })();

        }

        var equipment = [];
        var items = [];

        var lookUpItems = function () {
            for (var i = 0; i < a.length; i++) {
                b = item_base[a[i].id];
                items.push(b);
                b.params.wearable && equipment.push(b);
            }
        };
        lookUpItems();


        return {
            items: function () {
                return items
            },
            search: function () {
                return onMap();
            },
            equipment: function () {
                return equipment
            }

        }
    })();

    return {
        autoSkilling: function () {
            return autoSkilling;
        },

        logMessages: (function () {
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
        })(),

        populateActions: function (actionPass) {
            actionNames = "";
            actionList = actionPass;
            for (var key in action) {
                actionNames += key + "\n";
            }
        },
        actions: function () {
            return actionList;
        },

        buyAll: function () {
            var buyLoop = function (i) {
                setTimeout(function () {
                    Shop.buy(selected_shop);
                    if (--i) buyLoop(shop_content[selected_shop].count);
                }, 120)
            };
            busy = false;
        },

        deposit: function () {
            Chest.deposit_all();
            setTimeout(function () { busy = false; }, 250);
        },

        loadPet: function () {
            Mods.Petinv.load();
            setTimeout(function () { busy = false; }, 150);
        },

        unloadPet: function () {
            Mods.Petinv.unload();
            setTimeout(function () { busy = false; }, 250);
        },

        //This is method executes coordinates defined in arrays
        //WARNING BUGGY
        moveTo: function (i) {
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
                        setTimeout(function () {
                            busy = false;
                        }, 200);
                        clearInterval(a);
                    }
                }
            }, 1500);
        },

        //Used to perform actions on on_map objects.
        actionAt: function (x, y) {
            //If which prevents walking towards location which is unavalible eg. Mob has been killed.
            if (on_map[current_map][x][y] !== false) {
                selected_object = obj_g(on_map[current_map][x][y]);
                ActionMenu.act(0);
            } else {
                setTimeout(function () { busy = false; }, 600)
            }
        },

        //Looks through inventory and equips an item with passed ID
        equip: function (ID) {
            setTimeout(function () {
                for (var i = 0; i < players[0].temp.inventory.length; i++) {
                    if (players[0].temp.inventory[i].id == ID && !players[0].temp.inventory[i].selected) {
                        InvMenu.use(i);
                        debug && console.log("Item equipped. Eq slot:" + i);
                        break;
                    }
                }
                setTimeout(function () { busy = false; }, 490);
            }, 200)
        },

        //Buys items from npc. You need to pass item id and withdraw number,
        buy: function (i) {
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
        },

        //Withdraws items. You need to pass item id and withdraw number,
        withdraw: function (i) {
            var id = selectedAction[i].withdrawId;
            var number = selectedAction[i].withdrawQuantity;
            this.debug && console.log("Withdraw no:" + number + ". Withdraw id:" + id);
            for (var i = 0; i < chests[0].length; i++) {
                if (chests[0][i].id == id) {
                    selected_chest = i;
                    Chest.withdraw(number);
                    debug && console.log("Selected chest:" + selected_chest);
                }
            }
            setTimeout(function () { busy = false; }, 300);
        },
        //Withdraws items. You need to pass item id and withdraw number,
        destroy: function () {
            var Loop = function (i) {
                if (typeof players[0].temp.inventory[i] !== "undefined" && item_base[players[0].temp.inventory[i].id].name.match(/Empty/g)) {
                    Socket.send("inventory_destroy", { item_id: players[0].temp.inventory[i].id, all: !0 });
                    console.log("SOCKET");
                    setTimeout(function () { Loop(i); }, 600)
                }
                else if (--i) Loop(i);
            }
            Loop(players[0].temp.inventory.length);
        },

        eat: function () {
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
    }

})();

if (!stopExe) addChatText("Macro Loaded", false, COLOR.GREEN);
if (typeof (action) !== "undefined") { addChatText("Action list initialized succesfully", false, COLOR.GREEN); Macro.populateActions(action); }
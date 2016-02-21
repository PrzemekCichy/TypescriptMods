//Ambient Declarations
declare var shop_content, item_base, skills;
declare var Shop, findPathFromTo, obj_g, ActionMenu, InvMenu, selected_chest, chest_page, chests;
declare var selected_shop;
declare var Chest, selected_object;
declare var Mods;
declare var events;

var debug = true;
var busy = false;
var running = true;
var wait = false;
module PickAction {
    //Buys items from npc. You can pass item id and quantity
    //Default values will be selected shop, and maximum quantity
    function buy(id = shop_content[selected_shop].id,
        quantity = shop_content[selected_shop].count) {

        //Used to randomize click delay
        var randomClickDelay = function () {
            //Formula is: Math.floor(Math.random()*(max-min+1)+min);
            return Math.floor(Math.random() * (190 - 150 + 1) + 150);
        }

        //Buys item from shop selected number of times
        var buyLoop = function (i) {
            setTimeout(function () {
                Shop.buy(selected_shop);
                if (--i) buyLoop(i);
            }, randomClickDelay())
        };

        //Searches the shop for id
        var search = function () {
            for (var i = 0; i < shop_content.length; i++) {
                if (shop_content[i].id == id) {
                    selected_shop = i;
                    quantity = shop_content[selected_shop].count;
                    buyLoop(quantity);
                    debug && console.log("Item found in shop position: " + selected_shop);
                    break;
                } else {
                    this.debug && console.log("Item with id: " + id + " was not found.");
                }
            }
        }

        if (shop_content[selected_shop].id === id) {
            buyLoop(quantity);
            this.debug && console.log("Buy no:" + quantity + ". Buy id:" + id);
        } else {
            search();
            this.debug && console.log("Buy no:" + quantity + ". Buy id:" + id);
        }

        setTimeout(function () {
            busy = false;
        }, 2000);
    }

    function depositAll() {
        Chest.deposit_all();
        setTimeout(function () {
            busy = false;
        }, 250);
    }

    function loadPet () {
        Mods.Petinv.load();
        setTimeout(function () { busy = false; }, 350);
    }

    function unloadPet() {
        Mods.Petinv.unload();
        setTimeout(function () { busy = false; }, 450);
    }

    //This is method executes coordinates defined in arrays
    function moveTo(passArray) {
        var i = 0;
        //Interval lasts until there are no more actions to follow
        var a = setInterval(function () {
            if (running) {
                if (i < passArray.length) {
                    if (players[0].path.length === 0) {
                        players[0].path = findPathFromTo(players[0], passArray[i], players[0]);
                    }
                    if (players[0].i === passArray[i].i && players[0].j === passArray[i].j) {
                        i++;
                    }
                } else {//No more actions to follow, clear interval
                    setTimeout(function () {
                        busy = false;
                    }, 200);
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
            setTimeout(function () {
                busy = false;
            }, 300)
        }
    }

    //Looks through inventory and equips an item with passed ID
    function equip(passId) {
        setTimeout(function () {
            //for loop which searches invventory for food
            for (var i = 0; i < players[0].temp.inventory.length; i++) {
                if (players[0].temp.inventory[i].id == passId && !players[0].temp.inventory[i].selected) {
                    InvMenu.use(i);
                    debug && console.log("Item equipped. Eq slot:" + i);
                    break;
                }
            }
            setTimeout(function () { busy = false; }, 490);
        }, 200)
    }

    //Withdraws items. You need to pass item id and withdraw number,
    function withdraw(item = selected_chest, quantity = 40) {
        chest_page = 1; //sets chest page to 1 to avoid some conflicts if chest was on different page

        //Searches items in chest for item matching the passed id.
        for (var i = 0; i < chests[0].length; i++) {
            if (chests[0][i].id == item) {
                selected_chest = i;
                Chest.withdraw(quantity);
                debug && console.log("Selected chest:" + selected_chest);
            }
        }

        setTimeout(function () {
            busy = false;
        }, 300);

    }

    function eat() {
        loopFood:
        for (var i = 0; i < players[0].temp.inventory.length; i++) {
            if (typeof item_base[players[0].temp.inventory[i].id].params.heal !== "undefined") {
                //this.debug && console.log("Break out of loop at iteration: " + i);
                if ((skills[0].health.current + item_base[players[0].temp.inventory[i].id].params.heal) < skills[0].health.level) {
                    setTimeout(function () {
                        InvMenu.use(i);
                    }, 175);
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


    (function () {
        events.on("pickAction", pickAction);
        
        var pickAction = function (action) {
            if (!busy) {
                busy = true;
                if (typeof action == "object") {
                    if (!isNaN(action.buyId || action.buyQuantity)) {
                        buy(action.buyId, action.buyQuantity);
                        debug && console.log("Buy");

                    } else if (!isNaN(action.equipId)) {
                        equip(action.equipId);
                        debug && console.log("Equip");

                    } else if (!isNaN(action.withdrawId)) {
                        withdraw(action.withdrawId, action.withdrawQuantity);
                        debug && console.log("Withdraw");

                    } else if (action.j !== "undefined"
                        && action.i !== "undefined") {
                        actionAt(action.i, action.j);
                        debug && console.log("ActionAt");
                    }

                } else if (Array.isArray(action)) {
                    moveTo(action);
                    debug && console.log("MoveTo");
                } else if (typeof action === "string") {
                    if (action == "depositAll") {
                        depositAll();
                        debug && console.log("Deposit");                    
                    } else if (action == "wait") {
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

    })();
}
Player.Mods = Player.Mods || {};
var Mods = Player.Mods;
Mods.version = "4.0.1";
Mods.versionDate = "2016-04-27";
Mods.modOptions = Mods.modOptions || {};
Mods.Load = {};
Mods.time = timestamp();
var disable_options = !0
  , Load = Mods.Load
  , modOptions = Mods.modOptions
  , switchWorldBugFix = function() {}
;
String.prototype.toHHMMSS = function(b) {
    var e = parseInt(this, 10);
    b = Math.floor(e / 3600);
    var f = Math.floor((e - 3600 * b) / 60)
      , e = e - 3600 * b - 60 * f
      , g = "";
    0 != b && (g = b + ":");
    if (0 != f || "" !== g)
        f = 10 > f && "" !== g ? "0" + f : String(f),
        g += f + ":";
    return g = "" === g ? e + "s" : g + (10 > e ? "0" + e : String(e))
}
;
function getElem(b, e) {
    if ("string" !== typeof b)
        return null ;
    var f = document.getElementById(b);
    if (null === f)
        return null ;
    if ("undefined" === typeof e)
        return f;
    for (var g in e)
        if ("id" == g || "className" == g || "cssFloat" == g || "innerHTML" == g)
            f[g] = e[g];
        else if ("string" === typeof e[g] && f.setAttribute(g, e[g]),
        "function" === typeof e[g] && (f[g] = e[g]),
        "number" === typeof e[g] && (f[g] = "" + e[g]),
        "object" === typeof e[g])
            for (var k in e[g])
                "style" == g && (f.style[k] = e[g][k]),
                "setAttributes" == g && f.setAttribute(k, "javascript: " + e[g][k]),
                "setFunctions" == g && (f[k] = e[g][k]);
    return f
}
function createElem(b, e, f) {
    if ("undefined" === typeof b || "undefined" === e)
        return Mods.consoleLog("createElem error: no type or attachTo"),
        null ;
    b = document.createElement(b);
    if ("undefined" != typeof f)
        for (var g in f)
            if ("id" == g || "className" == g || "cssFloat" == g || "innerHTML" == g)
                b[g] = f[g];
            else if ("string" === typeof f[g] && b.setAttribute(g, f[g]),
            "function" === typeof f[g] && (b[g] = f[g]),
            "number" === typeof f[g] && (b[g] = "" + f[g]),
            "object" === typeof f[g])
                for (var k in f[g])
                    "style" == g && (b.style[k] = f[g][k]),
                    "setAttributes" == g && b.setAttribute(k, "" + f[g][k]),
                    "setFunctions" == g && (b[k] = f[g][k]);
    if ("string" === typeof e)
        getElem(e).appendChild(b);
    else if ("object" === typeof e)
        e.appendChild(b);
    else
        return null ;
    return b
}
function getAbsoluteHeight(b) {
    b = "string" === typeof b ? document.querySelector(b) : b;
    var e = window.getComputedStyle(b)
      , e = parseFloat(e.marginTop) + parseFloat(e.marginBottom);
    return Math.ceil(b.offsetHeight + e)
}
function preventDefault(b) {
    b = b || window.event;
    b.preventDefault && b.preventDefault();
    b.returnValue = !1
}
function formatLargeNumber(b, e) {
    if (null === b)
        return null ;
    if (0 === b)
        return "0";
    e = !e || 0 > e ? 0 : e;
    var f = b.toPrecision(2).split("e")
      , f = 1 === f.length ? 0 : Math.floor(Math.min(f[1].slice(1), 14) / 3)
      , g = 1 > f ? b.toFixed(0 + e) : (b / Math.pow(10, 3 * f)).toFixed(1 + e);
    return (0 > g ? g : Math.abs(g)) + ["", "K", "M", "B", "T"][f]
}
function scaleSize(b, e, f, g) {
    var k = g / f;
    f >= b && 1 >= k ? (f = b,
    g = f * k) : g >= e && (g = e,
    f = g / k);
    return [f, g]
}
function addEvent(b, e, f) {
    b.addEventListener ? (b.addEventListener(e, f, !1),
    EventCache.add(b, e, f)) : b.attachEvent ? (b["e" + e + f] = f,
    b[e + f] = function() {
        b["e" + e + f](window.event)
    }
    ,
    b.attachEvent("on" + e, b[e + f]),
    EventCache.add(b, e, f)) : b["on" + e] = b["e" + e + f]
}
var EventCache = function() {
    var b = [];
    return {
        listEvents: b,
        add: function(e, f, g) {
            b.push(arguments)
        },
        flush: function() {
            var e, f;
            for (e = b.length - 1; 0 <= e; --e)
                f = b[e],
                f[0].removeEventListener && f[0].removeEventListener(f[1], f[2], f[3]),
                "on" != f[1].substring(0, 2) && (f[1] = "on" + f[1]),
                f[0].detachEvent && f[0].detachEvent(f[1], f[2]),
                f[0][f[1]] = null
        }
    }
}();
Player.is_mod_dev = function(b) {
    return /^(rstudios|dendrek|witwiz)$/.test(b)
}
;
Player.is_mod_dev(players[0].name) && (disable_options = !1);
Mods.initialize = function() {
    Mods.modOptionsTypes = {
        text: {
            type: "text",
            createElement: "span",
            closeElement: "span",
            opt_span: "all",
            style: {
                "": ""
            }
        },
        checkbox: {
            createElement: "input type='checkbox'",
            style: {
                width: ".8em",
                height: ".8em",
                margin: "0px",
                "margin-right": "6px"
            }
        },
        radio: {
            type: "radio",
            createElement: "input type='radio'",
            style: {
                width: ".8em",
                height: ".8em",
                margin: "0px",
                "margin-right": "6px"
            }
        },
        button: {
            type: "button",
            createElement: "button",
            closeElement: "button",
            className: "market_select pointer",
            opt_span: "all",
            style: {
                margin: "0px",
                "font-size": "1em"
            }
        },
        block_color: {
            createElement: "div",
            closeElement: "div",
            opt_span: "all",
            style: {
                border: "1px solid #666666",
                width: "100px",
                height: "20px"
            }
        }
    };
    Mods.modOptionsVersion = function() {
        var b = {
            expmonitor: {
                id: "expmonitor",
                name: "x2 Experience Monitor",
                shortname: "x2 Experience Monitor",
                description1: "Shows a timer during x2 events.",
                description2: "This mod shows a visibe timer whenever a x2 event is started.",
                load: !1,
                loaded: !1,
                newmod: !1,
                updated: !1,
                time: 0
            },
            fullscreen: {
                id: "fullscreen",
                name: "FullScreen Mode",
                shortname: "FullScreen Mode",
                description1: "Enable full-screen mode.",
                description2: "This mod allows to display the game on the whole screen. It is only suggested on PC (no mobile devices). WARNING: on slow devices, it may affect game performance. After loading the mod, enable full screen mode in the options menu.",
                load: !1,
                loaded: !1,
                newmod: !1,
                updated: !1,
                time: 0
            },
            autocast: {
                id: "autocast",
                name: "Auto Cast",
                shortname: "Auto Cast",
                description1: "Enable auto-casting equipped magic.",
                description2: "This mod enables auto-casting magic (which becomes automatic when engaging in combat). It is disabled by default, to turn it on enable Autocast in game options.",
                load: !1,
                loaded: !1,
                newmod: !1,
                updated: !1,
                time: 0
            },
            newmap: {
                id: "newmap",
                name: "Enhanced Map",
                shortname: "Enhanced Map",
                description1: "Enhances game map with several added details.",
                description2: "Map now shows current position and details, including travel signs, mobs, bosses, resource spots and POI. In dungeons, fellow players are shown in the full map. Mimimap shows bigger dots, yellow-colored for friends.",
                load: !1,
                loaded: !1,
                newmod: !1,
                updated: !1,
                time: 0
            },
            newmarket: {
                id: "newmarket",
                name: "Enhanced Market",
                shortname: "Enhanced Market",
                description1: "Adds various helpers for market interface.",
                description2: "Allows resubmit or edit of market offers, display target player for transactions, highlights offers directed to the player and other market improvements. Adds Trade channel.",
                load: !1,
                loaded: !1,
                newmod: !1,
                updated: !1,
                time: 0
            },
            tabs: {
                id: "tabs",
                name: "Tabbed Chat",
                shortname: "Tabbed Chat",
                description1: "Adds tabs to the chat interface.",
                description2: "Every chat tab can have different filters and subscribed channels. Filters are now applied only on active chat. Subscribed channels can be filtered from tabs via right-click menu. Tabs can also be renamed/deleted via context menu.",
                requires: "Chatmd",
                load: !1,
                loaded: !1,
                newmod: !1,
                updated: !1,
                time: 0
            },
            kbind: {
                id: "kbind",
                name: "Keybinding Extensions",
                shortname: "Keybinding Extensions",
                description1: "Adds an iterface to manage custom keybindings for various actions.",
                description2: "From the game menu, a new 'keybindings' item allows access to mod customization.",
                load: !1,
                loaded: !1,
                newmod: !1,
                updated: !1,
                time: 0
            },
            gearmd: {
                id: "gearmd",
                name: "Gear Screen Mod",
                shortname: "Gear Mod",
                description1: "Enable a gear menu, to show what you have equipped.",
                description2: "From your Inventory, click (Show Equipment) to access a gear screen, where you can easily see what you have equipped and what you're missing. This screen can be moved! And click 'Equipped' to switch it to 'Vanity Set.' Using the in-game wiki search under Items, then use (Try On) to equip items to your Vanity Set!",
                load: !1,
                loaded: !1,
                newmod: !1,
                updated: !1,
                time: 0
            }
        };
        b.expbar = {
            id: "expbar",
            name: "Experience Bar",
            shortname: "Experience Bar",
            description1: "Shows an experience bar for your chosen active skill.",
            description2: "Open your skill's menu and click any skill to have the experience bar show that skill.",
            load: !1,
            loaded: !1,
            newmod: !1,
            updated: !1,
            time: 0,
            options: {
                0: {
                    id: "attached",
                    name: "Lock exp bar above the health bar.",
                    description: "If you move the health bar, the exp bar will move with it.",
                    type: Mods.modOptionsTypes.checkbox,
                    onclick: "javascript: Mods.modOptions_options(&apos;expbar&apos;,&apos;attached&apos;);"
                },
                1: {
                    id: "toggle",
                    name: "Allow exp bar to be toggled on/off.",
                    description: "If on, clicking the exp bar will cause it to hide. Click a skill to un-hide it.",
                    type: Mods.modOptionsTypes.checkbox,
                    onclick: "javascript: Mods.modOptions_options(&apos;expbar&apos;,&apos;toggle&apos;);"
                },
                2: {
                    id: "color",
                    name: "Change the color of the exp bar.",
                    type: Mods.modOptionsTypes.text,
                    options: {
                        0: {
                            id: "color",
                            type: Mods.modOptionsTypes.radio,
                            value: "0",
                            background: "",
                            onclick: "javascript: Mods.modOptions_options(&apos;expbar&apos;,&apos;color&apos;);"
                        },
                        1: {
                            id: "color",
                            type: Mods.modOptionsTypes.radio,
                            value: "1",
                            background: "",
                            onclick: "javascript: Mods.modOptions_options(&apos;expbar&apos;,&apos;color&apos;);"
                        },
                        2: {
                            id: "color",
                            type: Mods.modOptionsTypes.radio,
                            value: "2",
                            background: "",
                            onclick: "javascript: Mods.modOptions_options(&apos;expbar&apos;,&apos;color&apos;);"
                        },
                        3: {
                            id: "color",
                            type: Mods.modOptionsTypes.radio,
                            value: "3",
                            background: "",
                            onclick: "javascript: Mods.modOptions_options(&apos;expbar&apos;,&apos;color&apos;);"
                        },
                        4: {
                            id: "color",
                            type: Mods.modOptionsTypes.radio,
                            value: "4",
                            background: "",
                            onclick: "javascript: Mods.modOptions_options(&apos;expbar&apos;,&apos;color&apos;);"
                        },
                        5: {
                            id: "color",
                            type: Mods.modOptionsTypes.radio,
                            value: "5",
                            background: "",
                            onclick: "javascript: Mods.modOptions_options(&apos;expbar&apos;,&apos;color&apos;);"
                        }
                    }
                }
            }
        };
        b.petinv = {
            id: "petinv",
            name: "Pet Inventory",
            shortname: "Pet Inventory",
            description1: "Attaches the pet inventory to the main one.",
            description2: "You will see the pet's inventory beneath your main inventory. You will also be able to transfer items between the two inventories very easily. By default, left-clicking items will send them from your inventory to your pet's and shift+clicking will cause you to use/equip items. Additional features include: (unload) and (load) to unload/load all pet-inventory items quickly.",
            load: !1,
            loaded: !1,
            newmod: !1,
            updated: !1,
            time: 0,
            options: {
                0: {
                    id: "shiftclick",
                    name: "Allow shift+click to send items to pet chest.",
                    description: "If toggled on, shift+click sends items from your inventory to the pet chest, while left-click uses/equips items. If toggled off, shift+click uses/equips items, while left-click sends items from your inventory to the pet chest.",
                    type: Mods.modOptionsTypes.checkbox,
                    onclick: "javascript: Mods.modOptions_options(&apos;petinv&apos;,&apos;shiftclick&apos;);"
                },
                1: {
                    id: "petexp",
                    name: "Hide the pet's exp/evolution on the pet chest.",
                    type: Mods.modOptionsTypes.checkbox,
                    onclick: "javascript: Mods.modOptions_options(&apos;petinv&apos;,&apos;petexp&apos;);"
                },
                2: {
                    id: "pettext",
                    name: "Hide text/information above pet inventory.",
                    description: "If toggled off, the 'Pet/'s chest title, as well as the greyed text and checkbox will be hidden.",
                    type: Mods.modOptionsTypes.checkbox,
                    onclick: "javascript: Mods.modOptions_options(&apos;petinv&apos;,&apos;pettext&apos;);",
                    options: {
                        0: {
                            id: "0",
                            name: "Hide 'Pet/'s chest'.",
                            type: Mods.modOptionsTypes.checkbox,
                            onclick: "javascript: Mods.modOptions_options(&apos;petinv&apos;,&apos;pettext&apos;,&apos;0&apos;);"
                        },
                        1: {
                            id: "1",
                            name: "Hide grey text for (click to close) and shift+click.",
                            type: Mods.modOptionsTypes.checkbox,
                            onclick: "javascript: Mods.modOptions_options(&apos;petinv&apos;,&apos;pettext&apos;,&apos;1&apos;);"
                        },
                        2: {
                            id: "2",
                            name: "Hide shift+click checkbox.",
                            type: Mods.modOptionsTypes.checkbox,
                            onclick: "javascript: Mods.modOptions_options(&apos;petinv&apos;,&apos;pettext&apos;,&apos;2&apos;);"
                        }
                    }
                }
            }
        };
        b.mosmob = {
            id: "mosmob",
            name: "Mouseover Stats",
            shortname: "Mouseover Stats",
            description1: "When you mouseover a mob, an item, or an object, you'll be able to see its stats.",
            description2: "The stats shown are 'A' for accuracy, 'S' for strength, 'D' for defence, and 'Hp' for health. Objects show a description or required levels. A game options allows to tweak panel appearance.",
            load: !1,
            loaded: !1,
            newmod: !1,
            updated: !1,
            time: 0,
            options: {
                0: {
                    id: "appearance",
                    name: "Choose how the mob's stats appear.",
                    description: "When you mouseover a mob, you will see its stats: accuracy, strength, defense and health. You can decide here how those values are shown.",
                    type: Mods.modOptionsTypes.text,
                    options: {
                        0: {
                            id: "appearance",
                            name: "(A0, S0, D0, H5)",
                            type: Mods.modOptionsTypes.radio,
                            value: "0",
                            onclick: "javascript: Mods.modOptions_options(&apos;mosmob&apos;,&apos;appearance&apos;);"
                        },
                        1: {
                            id: "appearance",
                            name: "(Acc0, Str0, Def0, Hp5)",
                            type: Mods.modOptionsTypes.radio,
                            value: "1",
                            onclick: "javascript: Mods.modOptions_options(&apos;mosmob&apos;,&apos;appearance&apos;);"
                        },
                        2: {
                            id: "appearance",
                            name: "(0 / 0 / 0 | 5)",
                            type: Mods.modOptionsTypes.radio,
                            value: "2",
                            onclick: "javascript: Mods.modOptions_options(&apos;mosmob&apos;,&apos;appearance&apos;);"
                        }
                    }
                },
                1: {
                    id: "twolines",
                    name: "Show the mob's stats below the mob's name.",
                    description: "When toggled on, you'll see two lines of text: 1) level and name, 2) stats. When toggled off, the name and stats all appear on one line.",
                    type: Mods.modOptionsTypes.checkbox,
                    onclick: "javascript: Mods.modOptions_options(&apos;mosmob&apos;,&apos;twolines&apos;);"
                },
                2: {
                    id: "color",
                    name: "Set color of mob's stats based on difficulty.",
                    description: "When toggled on, the mob's stats will be compared to your own. If it's stronger, the stat will be red, if much weaker, the stat will be green. Stats within your combat range will be yellow.",
                    type: Mods.modOptionsTypes.checkbox,
                    onclick: "javascript: Mods.modOptions_options(&apos;mosmob&apos;,&apos;color&apos;);"
                }
            }
        };
        b.health = {
            id: "health",
            name: "Updated Health Bar",
            shortname: "Health Bar",
            description1: "Will now display health values for you and your target.",
            description2: "You'll see current health values on your and your target's health bars that adjust as you take/deal damage or heal.",
            load: !1,
            loaded: !1,
            newmod: !1,
            updated: !1,
            time: 0,
            options: {
                0: {
                    id: "capitalize",
                    name: "Capitalize your name.",
                    description: "The game's default is to show your name in lower case. Choose this option to have your name shown in proper case.",
                    type: Mods.modOptionsTypes.checkbox,
                    onclick: "javascript: Mods.modOptions_options(&apos;health&apos;,&apos;capitalize&apos;);"
                },
                1: {
                    id: "appearance",
                    name: "Choose how the name/health/level appear.",
                    type: Mods.modOptionsTypes.text,
                    options: {
                        0: {
                            id: "appearance",
                            name: "L1 White Rat (5)",
                            description: "The mob's level will be shown in front of its name, and its current health will be shown in parenthesis.",
                            type: Mods.modOptionsTypes.radio,
                            value: "0",
                            onclick: "javascript: Mods.modOptions_options(&apos;health&apos;,&apos;appearance&apos;);"
                        },
                        1: {
                            id: "appearance",
                            name: "White Rat (5/5)",
                            description: "The mob's level is hidden. Its current and max health are shown in parenthesis as ([current]/[max]).",
                            type: Mods.modOptionsTypes.radio,
                            value: "1",
                            onclick: "javascript: Mods.modOptions_options(&apos;health&apos;,&apos;appearance&apos;);"
                        },
                        2: {
                            id: "appearance",
                            name: "White Rat (5/5 100%)",
                            description: "The mob's level is hidden. Its current, max and percent health are shown in parenthesis as ([current]/[max] [percent]%).",
                            type: Mods.modOptionsTypes.radio,
                            value: "2",
                            onclick: "javascript: Mods.modOptions_options(&apos;health&apos;,&apos;appearance&apos;);"
                        }
                    }
                }
            }
        };
        b.forgem = {
            id: "forgem",
            name: "Forging Interface",
            shortname: "Forge Interface",
            description1: "The forging UI is greatly improved to be easier to use.",
            description2: "You can now learn recipes (by using them once) and then will be able to quickly place/remove mats with a button click.",
            load: !1,
            loaded: !1,
            newmod: !1,
            updated: !1,
            time: 0,
            options: {
                0: {
                    id: "reset",
                    name: "Forget All Recipes",
                    description: "This will delete your entire recipes list, causing you to start with zero recipes known. (You can always relearn any recipe by creating that item again.)",
                    type: Mods.modOptionsTypes.button,
                    onclick: "javascript: Mods.modOptions_options(&apos;forgem&apos;,&apos;reset',true);"
                }
            }
        };
        b.chestm = {
            id: "chestm",
            name: "Chest Interface",
            shortname: "Chest Interface",
            description1: "New options for sorting, withdrawing and depositing.",
            description2: "You have several options for how to sort items, including 'inventory first'; you can also use withdraw 'All' to fill your inventory quickly, or deposit 'All+' to deposit all unequipped items at once. (If you Ctrl+click an item in your inventory, All+ will also ignore that item; this is useful for items that you cannot equip.)",
            load: !1,
            loaded: !1,
            newmod: !1,
            updated: !1,
            time: 0,
            options: {
                0: {
                    id: "sortinv",
                    name: "When sorting the chest, sort inventory items to the top.",
                    type: Mods.modOptionsTypes.checkbox,
                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;sortinv&apos;);",
                    options: {
                        0: {
                            id: "0",
                            name: "Choose highlight color.",
                            type: Mods.modOptionsTypes.text,
                            description: "Inventory items in your chest will have the border color you choose.",
                            options: {
                                0: {
                                    id: "chestm_sortinv_color",
                                    name: "No highlight color",
                                    type: Mods.modOptionsTypes.radio,
                                    value: "0",
                                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;sortinv&apos;,&apos;color&apos;);"
                                },
                                1: {
                                    id: "chestm_sortinv_color",
                                    type: Mods.modOptionsTypes.radio,
                                    value: "1",
                                    border: "#FFFFFF",
                                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;sortinv&apos;,&apos;color&apos;);"
                                },
                                2: {
                                    id: "chestm_sortinv_color",
                                    type: Mods.modOptionsTypes.radio,
                                    value: "2",
                                    border: "#00FF00",
                                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;sortinv&apos;,&apos;color&apos;);"
                                },
                                3: {
                                    id: "chestm_sortinv_color",
                                    type: Mods.modOptionsTypes.radio,
                                    value: "3",
                                    border: "#FF00FF",
                                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;sortinv&apos;,&apos;color&apos;);"
                                },
                                4: {
                                    id: "chestm_sortinv_color",
                                    type: Mods.modOptionsTypes.radio,
                                    value: "4",
                                    border: "#FFFF00",
                                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;sortinv&apos;,&apos;color&apos;);"
                                }
                            }
                        }
                    }
                },
                1: {
                    id: "sortfav",
                    name: "When sorting the chest, sort favorited items to the top.",
                    type: Mods.modOptionsTypes.checkbox,
                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;sortfav&apos;);",
                    options: {
                        0: {
                            id: "0",
                            name: "Choose highlight color.",
                            type: Mods.modOptionsTypes.text,
                            description: "Favorited items in your chest will have the border color you choose.",
                            options: {
                                0: {
                                    id: "chestm_sortfav_color",
                                    name: "No highlight color",
                                    type: Mods.modOptionsTypes.radio,
                                    value: "0",
                                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;sortfav&apos;,&apos;color&apos;);"
                                },
                                1: {
                                    id: "chestm_sortfav_color",
                                    type: Mods.modOptionsTypes.radio,
                                    value: "1",
                                    border: "#FFFFFF",
                                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;sortfav&apos;,&apos;color&apos;);"
                                },
                                2: {
                                    id: "chestm_sortfav_color",
                                    type: Mods.modOptionsTypes.radio,
                                    value: "2",
                                    border: "#00FF00",
                                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;sortfav&apos;,&apos;color&apos;);"
                                },
                                3: {
                                    id: "chestm_sortfav_color",
                                    type: Mods.modOptionsTypes.radio,
                                    value: "3",
                                    border: "#FF00FF",
                                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;sortfav&apos;,&apos;color&apos;);"
                                },
                                4: {
                                    id: "chestm_sortfav_color",
                                    type: Mods.modOptionsTypes.radio,
                                    value: "4",
                                    border: "#FFFF00",
                                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;sortfav&apos;,&apos;color&apos;);"
                                }
                            }
                        }
                    }
                },
                2: {
                    id: "hidecheckbox",
                    name: "Hide additional sorting option checkboxes.",
                    type: Mods.modOptionsTypes.checkbox,
                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;hidecheckbox&apos;);"
                },
                3: {
                    id: "gearsort",
                    name: "Choose how gear is sub-sorted.",
                    description: "Gear is already sorted by chategory (armor vs weapon vs jewelry). But can be further sub-sorted based on one of the following parameters.",
                    type: Mods.modOptionsTypes.text,
                    options: {
                        0: {
                            id: "gearsort",
                            name: "Sort by minimum level requirement.",
                            type: Mods.modOptionsTypes.radio,
                            value: "0",
                            onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;gearsort&apos;);"
                        },
                        1: {
                            id: "gearsort",
                            name: "Sort by armor type.",
                            type: Mods.modOptionsTypes.radio,
                            value: "1",
                            onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;gearsort&apos;);"
                        },
                        2: {
                            id: "gearsort",
                            name: "Sort by primary stat bonus.",
                            type: Mods.modOptionsTypes.radio,
                            value: "2",
                            onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;gearsort&apos;);"
                        }
                    }
                },
                4: {
                    id: "allplus",
                    name: "Hide the All+ deposit option.",
                    type: Mods.modOptionsTypes.checkbox,
                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;allplus&apos;);"
                }
            }
        };
        b.rclick = {
            id: "rclick",
            name: "Right-Click Menu Extensions",
            shortname: "RightClick Menu Extensions",
            description1: "Right-clicking on mobs: 'Drops', 'Combat Analysis' and wiki access.",
            description2: "These are new menu options when you right click on mobs. Item Drops shows all items the mob is able to drop (and accurate drop rates); Combat Analysis shows the expected amount of damage that you and the mob will do. Right click on items/mobs allows wiki search. On a player, allows whispering. On inventory items allow to destroy all similar items and to search wiki. Additionally, this mod will show gathering success rates when used on mining nodes, trees, and fishing spots.",
            load: !1,
            loaded: !1,
            newmod: !1,
            updated: !1,
            time: 0,
            options: {
                0: {
                    id: "dropitem",
                    name: "Choose what the item 'Drops' option shows.",
                    type: Mods.modOptionsTypes.text,
                    options: {
                        0: {
                            id: "0",
                            name: "Show 'Wiki' drop rates.",
                            description: "The drop rates shown on the wiki are not accurate because they are not adjusted to the accurate in-game values. By default, this mod shows the adjusted drop rates. However, turning this option on will show the un-adjusted (aka 'wiki') rates.",
                            type: Mods.modOptionsTypes.checkbox,
                            onclick: "javascript: Mods.modOptions_options(&apos;rclick&apos;,&apos;dropitem&apos;,&apos;0&apos;);"
                        }
                    }
                },
                1: {
                    id: "combat",
                    name: "Choose what the 'Combat Analysis' option shows.",
                    type: Mods.modOptionsTypes.text,
                    options: {
                        0: {
                            id: "0",
                            name: "Average damage",
                            description: "This shows the actual average damage (over a large number of fights) that can be expected with your current gear. It takes into account that damage can never be less than 0. For example, a mob that normally hits you for 0, will sometimes hit you for more than 0. So its average damage has to be greater than 0.",
                            type: Mods.modOptionsTypes.checkbox,
                            onclick: "javascript: Mods.modOptions_options(&apos;rclick&apos;,&apos;combat&apos;,&apos;0&apos;);"
                        },
                        1: {
                            id: "1",
                            name: "Chance to hit for zero",
                            description: "A 'miss' is a hit of zero (when you or the enemy take 0 damage). The higher this rate is, the more likely a miss will occur.",
                            type: Mods.modOptionsTypes.checkbox,
                            onclick: "javascript: Mods.modOptions_options(&apos;rclick&apos;,&apos;combat&apos;,&apos;1&apos;);"
                        },
                        2: {
                            id: "2",
                            name: "Max damage",
                            description: "Max damage is the highest possible melee hit that you or your enemy can do. You should avoid fighting a mob whose max hit is greater than your current health.",
                            type: Mods.modOptionsTypes.checkbox,
                            onclick: "javascript: Mods.modOptions_options(&apos;rclick&apos;,&apos;combat&apos;,&apos;2&apos;);"
                        },
                        3: {
                            id: "3",
                            name: "Ave. hits to kill",
                            description: "Assuming you and the enemy start at full health, this is approximately how many hits it will normally take for one of you to kill the other.",
                            type: Mods.modOptionsTypes.checkbox,
                            onclick: "javascript: Mods.modOptions_options(&apos;rclick&apos;,&apos;combat&apos;,&apos;3&apos;);"
                        },
                        4: {
                            id: "4",
                            name: "Ave. time to kill",
                            description: "Assuming you and the enemy start at full health, this is approximately how many seconds it will normally take for one of you to kill the other.",
                            type: Mods.modOptionsTypes.checkbox,
                            onclick: "javascript: Mods.modOptions_options(&apos;rclick&apos;,&apos;combat&apos;,&apos;4&apos;);"
                        }
                    }
                }
            }
        };
        b.magicm = {
            id: "magicm",
            name: "Magic Damage Interface",
            shortname: "Magic Interface",
            description1: "Magic damage done now appears over the enemy.",
            description2: "When you cast spells, you will see the amount of damage they do appear over the enemy's head. Additionally, new keybinds are available for magic spells: 7 8 9 0 as well as the number pad 1 2 3 4.",
            load: !1,
            loaded: !1,
            newmod: !1,
            updated: !1,
            time: 0
        };
        b.wikimd = {
            id: "wikimd",
            name: "In-Game Wiki",
            shortname: "In-Game Wiki",
            description1: "An in-game wiki will now be available in this menu.",
            description2: "You can use the wiki to browse the game's database for items/monsters/vendors to see information like stats, drops, vendor availability/prices, and craft recipes. There are plenty of options for searching the wiki (such as by name, by min-skill requirement, by type, etc) to make navigating it and finding what you're looking for easier. On crafting recipes, you can look at crafting formula or learn the formula for later use in the Forge Mod.",
            load: !1,
            loaded: !1,
            newmod: !1,
            updated: !1,
            time: 0
        };
        b.miscmd = {
            id: "miscmd",
            name: "Miscellaneous Improvements",
            shortname: "Miscellaneous",
            description1: "Various improvements of the game's UI.",
            description2: "These are 'small' mods that didn't require individual load options. Included at the moment: 1) Indicators for items that will be saved upon death, 2) Toolbar at the top showing various useful information.",
            load: !1,
            loaded: !1,
            newmod: !1,
            updated: !1,
            time: 0
        };
        b.chatmd = {
            id: "chatmd",
            name: "Chat Extensions",
            shortname: "Chat Extensions",
            description1: "Adds chat filters and commands.",
            description2: "A new chat filter (found in the Filters menu) has been added that blocks 'spam' messages, including: 'I think I'm missing something.' 'Cannot do that yet.' 'You are under attack!' 'You feel a bit better.' and 'It's a [object name]'; in addition, when you do /online, your friends will be yellow colored, and mods/admins as well with green/orange colors. Another option allows to enable links in chat. The mod also adds newbie tips, shown every 10 minutes (can be disabled from game options). Also, you can right-click a player's name in chat window to ignore, add/remove as friend. Also chat commands (ping, played, wiki...) are added.",
            load: !1,
            loaded: !1,
            newmod: !1,
            updated: !1,
            time: 0
        };
        b.farming = {
            id: "farming",
            name: "Farming Improvements",
            shortname: "Farming Mod",
            description1: "Adds the ability to 'queue' farming actions.",
            description2: "Queued farming actions (seeding, harvesting and raking) will occur automatically once you are no longer busy with the previous action. You can queue one plot at a time, or the entire farm, if you like. Additional keybinds include: Ctrl (to queue actions) and Space (to toggle between Active and Paused). Also, the Island Deed now sends you on a path straight to the sign for a quick exist.",
            load: !1,
            loaded: !1,
            newmod: !1,
            updated: !1,
            time: 0
        };
        if (Mods.modOptions != b)
            for (var e in b) {
                null == Mods.modOptions[e] && (Mods.modOptions[e] = b[e],
                Mods.modOptions[e].newmod = !0);
                for (var f in b[e])
                    null == Mods.modOptions[e][f] && (Mods.modOptions[e][f] = b[e][f],
                    Mods.modOptions[e].updated = !0),
                    Mods.modOptions[e][f] != b[e][f] && "boolean" != typeof b[e][f] && (Mods.modOptions[e][f] = b[e][f],
                    Mods.modOptions[e][f].updated = !0)
            }
    }
    ;
    Mods.modOptionsVersion();
    Mods.modOptionsLoad = function() {
        var b = {}, e = {}, f = {}, g = {}, k;
        for (k in Mods.modOptions)
            b[Mods.modOptions[k].id] = Mods.modOptions[k].load,
            f[Mods.modOptions[k].id] = Mods.modOptions[k].newmod;
        localStorage.modOptionsLoad = localStorage.modOptionsLoad || JSON.stringify(b);
        localStorage.modOptionsNewmod = localStorage.modOptionsNewmod || JSON.stringify(f);
        var e = JSON.parse(localStorage.modOptionsLoad), g = JSON.parse(localStorage.modOptionsNewmod), m;
        for (m in b)
            Mods.modOptions[m].load = "boolean" == typeof e[m] ? e[m] : b[m],
            Mods.modOptions[m].newmod = "boolean" == typeof g[m] ? g[m] : f[m]
    }
    ;
    Mods.modOptionsLoad();
    Mods.loadModsSelectAll = function(b) {
        for (var e in Mods.modOptions)
            getElem("checkbox_" + Mods.modOptions[e].id).checked = b
    }
    ;
    Mods.loadSelectedMods = function(b) {
        if ("undefined" != typeof b && void 0 != Mods.modOptions[b]) {
            if (!Mods.modOptions[b].loaded) {
                Mods.failedLoad(b);
                Timers.set("failed_load_mods", function() {
                    Mods.failedLoad(!0)
                }, 1500);
                Mods.loadMod(b);
                Mods.modOptions[b].loaded = !0;
                var e = capitaliseFirstLetter(b);
                Mods.loadedMods.push(e)
            }
            Mods.modOptions[b].newmod = !1;
            Mods.modOptions[b].updated = !1;
            for (e = getElem("row_" + b); e.firstChild; )
                e.removeChild(e.firstChild);
            createElem("td", e, {
                style: "padding-top: 8px; padding-bottom: 0px; font-weight: bold;",
                innerHTML: Mods.modOptions[b].name + "<span style='color:#FFFFFF; font-weight:normal;'>" + (Mods.modOptions[b].loaded ? " (loaded)" : "") + (Mods.modOptions[b].newmod ? " ** New **" : Mods.modOptions[b].updated ? " ** Updated **" : "") + "</span>",
                setAttributes: {
                    colSpan: "3"
                }
            });
            getElem("mods_menu_newmods").style.display = "none";
            getElem("mods_menu_updated").style.display = "none";
            var f = JSON.parse(localStorage.modOptionsLoad)
              , g = JSON.parse(localStorage.modOptionsNewmod);
            f[b] = !0;
            g[b] = !1
        } else {
            var f = {}, g = {}, k;
            for (k in Mods.modOptions) {
                !getElem("checkbox_" + Mods.modOptions[k].id).checked || Mods.isLoaded(capitaliseFirstLetter(k)) || Mods.modOptions[k].requires && !Mods.isLoaded(Mods.modOptions[k].requires) || (Mods.failedLoad(k),
                Timers.set("failed_load_mods", function() {
                    Mods.failedLoad(!0)
                }, 1500),
                Mods.loadMod(Mods.modOptions[k].id),
                Mods.modOptions[k].loaded = !0,
                e = capitaliseFirstLetter(k),
                Mods.loadedMods.push(e));
                f[Mods.modOptions[k].id] = getElem("checkbox_" + Mods.modOptions[k].id).checked;
                Mods.modOptions[k].newmod = !1;
                g[Mods.modOptions[k].id] = !1;
                Mods.modOptions[k].updated = !1;
                for (e = getElem("row_" + Mods.modOptions[k].id); e.firstChild; )
                    e.removeChild(e.firstChild);
                createElem("td", e, {
                    style: "padding-top: 8px; padding-bottom: 0px; font-weight: bold;",
                    innerHTML: Mods.modOptions[k].name + "<span style='color:#FFFFFF; font-weight:normal;'>" + (Mods.modOptions[k].loaded ? " (loaded)" : "") + (Mods.modOptions[k].newmod ? " ** New **" : Mods.modOptions[k].updated ? " ** Updated **" : "") + "</span>",
                    setAttributes: {
                        colSpan: "3"
                    }
                })
            }
            getElem("mods_menu_newmods").style.display = "none";
            getElem("mods_menu_updated").style.display = "none"
        }
        localStorage.modOptionsLoad = JSON.stringify(f);
        localStorage.modOptionsNewmod = JSON.stringify(g)
    }
    ;
    Mods.loadMod = function(b) {
        Mods.modOptions[b].loaded || (Load[b](),
        Mods.modOptions[b].loaded = !0,
        Mods.modOptionsOptionsDisplay(b))
    }
    ;
    Mods.loadModMenu_options = function() {
        getElem("mod_load_options").style.display = "none";
        getElem("mod_load_mods_options").style.display = "none";
        getElem("mod_options_options").style.display = "block";
        getElem("mod_options_mods_options").style.display = "block";
        Mods.modOptionsOptionsDisplay("expbar")
    }
    ;
    Mods.loadModMenu_load = function() {
        getElem("mod_load_options").style.display = "block";
        getElem("mod_load_mods_options").style.display = "block";
        getElem("mod_options_options").style.display = "none";
        getElem("mod_options_mods_options").style.display = "none"
    }
    ;
    Mods.modOptionsOptionsDisplay = function(b) {
        for (var e in Mods.modOptions)
            getElem("mod_options_options_" + Mods.modOptions[e].id).style.display = "none";
        getElem("mod_options_options_" + b).style.display = "block";
        Mods.modOptions[b].loaded ? (getElem("mod_options_options_" + b + "_loaded").style.display = "block",
        getElem("mod_options_options_" + b + "_notloaded").style.display = "none") : (getElem("mod_options_options_" + b + "_loaded").style.display = "none",
        getElem("mod_options_options_" + b + "_notloaded").style.display = "block")
    }
    ;
    Mods.loadNewMods = function() {
        var b = getElem("checkbox_enable_newmods").checked;
        if (b)
            for (var e in Mods.modOptions)
                Mods.modOptions[e].newmod && (getElem("checkbox_" + Mods.modOptions[e].id).checked = !0);
        localStorage.loadNewMods = JSON.stringify(b)
    }
    ;
    Mods.loadModOptions = function() {
        createElem("div", wrapper, {
            id: "mods_form",
            className: "menu scrolling_allowed",
            onmousedown: function(b) {
                b = b || window.event;
                this.coordinates = {
                    dx: (parseInt(this.style.left) || 0) - b.clientX,
                    dy: (parseInt(this.style.top) || 0) - b.clientY
                };
                this.canMove = !0
            },
            onmousemove: function(b) {
                b = b || window.event;
                this.canMove && "mods_wiki_name" != b.target.id && "mods_wiki_level_low" != b.target.id && "mods_wiki_level_high" != b.target.id && (this.style.left = Math.min(window.innerWidth - 200, Math.max(-200, b.clientX + this.coordinates.dx)) + "px",
                this.style.top = Math.min(window.innerHeight - 170, Math.max(-170, b.clientY + this.coordinates.dy)) + "px")
            },
            onmouseup: function(b) {
                this.canMove = !1
            },
            style: "z-index: 99999; position: absolute; left: 100px; top: 75px; width: 400px; overflowY: auto;",
            innerHTML: "<span id='mods_form_top' class='common_border_bottom' style='margin-bottom:4px;'><span style='float:left; font-weight: bold; color:#FFFF00; margin-bottom:3px;'>Mods Info</span><span id='mods_menu_load' class='common_link' onclick='javascript:Mods.loadModMenu_load();' style='float:left; margin:0px; margin-left:42px;'>Load Mods</span><span id='mods_menu_options' class='common_link' onclick='javascript:Mods.loadModMenu_options(); 'style='float:left; margin:0px; margin-left:46px;'>Mod Options</span><span id = 'mod_options_close' class='common_link' style='margin: 0px; margin-bottom: 2px;' onclick='javascript:addClass(getElem(&apos;mods_form&apos;),&apos;hidden&apos;);'>Close</span></span>"
        });
        createElem("div", "mods_form", {
            id: "mod_load_mods_options",
            className: "common_border_bottom",
            style: "width: 100%; min-height: 24px; margin-bottom: 5px; font-size: .8em; display: block",
            innerHTML: "<button id='mods_menu_load_all' class='market_select pointer' onclick='javascript:Mods.loadModsSelectAll(true);' style='float:left; margin:0px; margin-left:5px;'>Select All</button><button id='mods_menu_load_none' class='market_select pointer' onclick='javascript:Mods.loadModsSelectAll(false);' style='float:left; margin:0px; margin-left:6px;'>Select None</button><button id ='mods_menu_load_selected' class='market_select pointer' style='margin: 0px; margin-bottom: 2px;' onclick='javascript:Mods.loadSelectedMods();'>Load Selected</button>"
        });
        createElem("div", "mods_form", {
            id: "mod_load_options",
            className: "scrolling_allowed",
            style: "display: block; height: 250px; overflow-x: hidden;",
            innerHTML: "<span style='color:yellow; font-size:.8em; font-weight:bold; padding-left:4px;'>Mod Pack version " + Mods.version + " (created by Dendrek &amp; WitWiz -  Maintained by RStudios) </span><table id='mod_options_table' cellspacing='0' style='font-size: 0.8em; width:100%; margin-top:5px;'><tr id='mods_menu_newmods' style='color:#00FF00; font-weight:bold; display:none;'><td colspan='3'>** New Mod(s) Available! **<span style='color:#FFFFFF; float:right; font-weight:normal; margin-top:2px;'>Always enable new mods</span><input type='checkbox' id='checkbox_enable_newmods' style='width:.8em; height:.8em; float:right;' onclick='javascript:Mods.loadNewMods();'></td></tr><tr id='mods_menu_updated' style='color:#00FF00; font-weight:bold; display:none;'><td colspan='3'>** Mod(s) Updated! ** &nbsp;&nbsp;&nbsp;<span style='font-weight:normal; color:#FFFFFF; float:right;'>(reload your browser to enable the updates)</span></td></tr></table>"
        });
        createElem("div", "mods_form", {
            id: "mod_options_options",
            className: "common_border_right",
            style: "width: 26%; height: 0px; padding-bottom: 4px; font-size: .8em; float: left; display: none; border-top: 1px solid #666666; border-right: 1px solid #666666; border-bottom: 1px solid #666666; overflow-x: hidden;"
        });
        createElem("div", "mods_form", {
            id: "mod_options_mods_options",
            className: "scrolling_allowed",
            style: "width: 72.4%; min-height: 100%; margin-left: 1%; display: none; float: left; border-top: 1px solid #666666; border-left: 1px solid #666666; border-bottom: 1px solid #666666"
        });
        createElem("span", "mod_options_options", {
            id: "mod_options_name_title",
            style: "size: .8em; display: inline-block; float: left; clear: left; margin: 0px; margin-bottom: 14px; width: 98px; padding-top: 10px; padding-left: 6px; font-weight: bold; color: yellow",
            innerHTML: "Mod Options"
        });
        var b = !0, e = "", f;
        for (f in Mods.modOptions) {
            Mods.modOptions[f].newmod && (getElem("mods_menu_newmods").style.display = "");
            Mods.modOptions[f].updated && !Mods.modOptions[f].newmod && (getElem("mods_menu_updated").style.display = "");
            e = (b = !1,
            "");
            createElem("tr", "mod_options_table", {
                id: "row_" + Mods.modOptions[f].id,
                style: "font-size: 1em; color: #FF0; background-color: " + e
            });
            createElem("td", "row_" + Mods.modOptions[f].id, {
                colSpan: "3",
                style: "font-weight: bold; padding: 6px 6px 0px 6px; border-top: 1px solid #666;",
                innerHTML: Mods.modOptions[f].name + "<span style='color:#FFFFFF; font-weight:normal;'>" + (Mods.modOptions[f].loaded ? " (loaded)" : "") + (Mods.modOptions[f].newmod ? " ** New **" : Mods.modOptions[f].updated ? " ** Updated **" : "") + "</span>"
            });
            var g = "getElem(&apos;r2_td1_" + Mods.modOptions[f].id + "&apos;).style.paddingBottom"
              , k = "getElem(&apos;r2_td2_" + Mods.modOptions[f].id + "&apos;).style.paddingBottom"
              , m = "getElem(&apos;row3_" + Mods.modOptions[f].id + "&apos;).style.display";
            createElem("tr", "mod_options_table", {
                id: "row2_" + Mods.modOptions[f].id,
                style: "font-size: 1em; color: #FFF; font-weight: normal; background-color: " + e
            });
            createElem("td", "row2_" + Mods.modOptions[f].id, {
                id: "r2_td1_" + Mods.modOptions[f].id,
                style: "width: 15px; padding: 0px 0px 6px 6px;",
                innerHTML: "<input id='checkbox_" + Mods.modOptions[f].id + "' type='checkbox' style='width:.8em; height:.8em; margin-right:6px;'>"
            });
            createElem("td", "row2_" + Mods.modOptions[f].id, {
                id: "r2_td2_" + Mods.modOptions[f].id,
                colSpan: "2",
                style: "padding: 0px 0px 6px 6px;",
                innerHTML: Mods.modOptions[f].description1 + "<span class='common_link' onclick='javascript: ( " + m + " == &apos;none&apos; ) ? ( " + m + " = &apos;&apos;, " + g + " = " + k + " = &apos;0px&apos; ) : ( " + m + " = &apos;none&apos;, " + g + " = " + k + " = &apos;6px&apos; );' style='float:right; margin:0px;'>(more info)</span>"
            });
            createElem("tr", "mod_options_table", {
                id: "row3_" + Mods.modOptions[f].id,
                style: "color: #FFF; background-color: " + e + "; display: none;"
            });
            createElem("td", "row3_" + Mods.modOptions[f].id);
            createElem("td", "row3_" + Mods.modOptions[f].id, {
                colSpan: "2",
                style: "padding: 0px 0px 6px 0px;",
                innerHTML: Mods.modOptions[f].description2
            });
            createElem("span", "mod_options_options", {
                id: "mod_options_name_" + Mods.modOptions[f].id,
                className: "common_link",
                style: "size: .8em; display: inline-block; float: left; clear: left; margin: 0px; padding: 8px 0px 10px 6px; width: 90%; border-top: 1px solid #666;",
                innerHTML: Mods.modOptions[f].shortname,
                onclick: function() {
                    Mods.modOptionsOptionsDisplay(Mods.modOptions[f].id)
                }
            });
            createElem("div", "mod_options_mods_options", {
                id: "mod_options_options_" + Mods.modOptions[f].id,
                style: "padding-top: 10px; padding-left: 5%; width: 95%; height: 95%; font-size: .8em; display: none;",
                innerHTML: "<span style='color:yellow; font-weight:bold; float:left;'>" + Mods.modOptions[f].name + " Options</span><span id='mod_options_options_" + Mods.modOptions[f].id + "_notloaded' style='margin-top:41px; width:100%; float:left; clear:left;'><span style='float:left; margin-bottom:4px; text-align:center; width:91%; '>The " + Mods.modOptions[f].name.toLowerCase() + " mod is not loaded...</span><button id='mod_options_options_load_" + Mods.modOptions[f].id + "' class='market_select pointer' type='button' style='font-size:1.25em; margin:0px; width:80px; left:45%; margin-left:-40px; float:left; clear:left; display:block; position:relative;' onclick='javascript:Mods.loadSelectedMods(&apos;" + f + "&apos;);'>Load Mod</button></span><span id='mod_options_options_" + Mods.modOptions[f].id + "_loaded' style='margin-top:6px; margin-bottom:6px; width:100%; float:left; clear:left; display:none;'><table id='mod_options_options_" + Mods.modOptions[f].id + "_table' style='font-size: 0.8em; width:100%;'><tr><td style='width:17px;'></td><td style='width:17px;'></td><td style='width:17px;'></td><td></td></table></span>"
            });
            b = !b;
            getElem("checkbox_enable_newmods").checked && Mods.modOptions[f].newmod && (Mods.modOptions[f].load = !0);
            getElem("checkbox_" + Mods.modOptions[f].id).checked = Mods.modOptions[f].load
        }
        b = !1;
        for (f in Mods.modOptions)
            b && (getElem("mod_options_options_" + Mods.modOptions[f].id).style.display = "none"),
            "block" == getElem("mod_options_options_" + Mods.modOptions[f].id).style.display && (b = !0);
        b || (getElem("mod_options_options_expbar").style.display = "block");
        Mods.modOptions.wikimd.loaded && (getElem("mods_form_top").innerHTML = "<span style='float:left; font-weight: bold; color:#FFFF00; margin-bottom:3px;'>Mods Info</span><span id='mods_menu_load' class='common_link' onclick='javascript:Mods.loadModMenu_load();' style='float:left; margin:0px; margin-left: 42px;'>Load</span><span id='mods_menu_options' class='common_link' onclick='javascript:Mods.loadModMenu_options(); ' style='float:left; margin:0px; margin-left: 45px;'>Options</span><span id='mods_menu_load' class='common_link' onclick='javascript:Mods.loadModMenu_wiki();' style='float:left; margin:0px; margin-left: 41px;'>Wiki</span><span id='mod_options_close' class='common_link' style='margin: 0px; margin-bottom: 2px;' onclick='javascript:addClass(getElem(&apos;mods_form&apos;),&apos;hidden&apos;);'>Close</span>",
        getElem("mods_form").style.width = "464px",
        getElem("mods_form").style.marginLeft = "-225px",
        Mods.Wikimd.loadDivs(),
        Mods.loadModMenu_options = function() {
            getElem("mod_load_options").style.display = "none";
            getElem("mod_load_mods_options").style.display = "none";
            getElem("mod_options_options").style.display = "block";
            getElem("mod_options_mods_options").style.display = "block";
            getElem("mod_wiki_options").style.display = "none";
            getElem("mod_wiki_mods_options").style.display = "none";
            Mods.modOptionsOptionsDisplay("expbar")
        }
        ,
        Mods.loadModMenu_load = function() {
            getElem("mod_load_options").style.display = "block";
            getElem("mod_load_mods_options").style.display = "block";
            getElem("mod_options_options").style.display = "none";
            getElem("mod_options_mods_options").style.display = "none";
            getElem("mod_wiki_options").style.display = "none";
            getElem("mod_wiki_mods_options").style.display = "none"
        }
        ,
        Mods.loadModMenu_wiki = function() {
            getElem("mod_load_options").style.display = "none";
            getElem("mod_load_mods_options").style.display = "none";
            getElem("mod_options_options").style.display = "none";
            getElem("mod_options_mods_options").style.display = "none";
            getElem("mod_wiki_options").style.display = "block";
            getElem("mod_wiki_mods_options").style.display = "block"
        }
        );
        disable_options && (getElem("mods_menu_options").className = "",
        getElem("mods_menu_options").onclick = function() {}
        ,
        getElem("mods_menu_options").style.fontWeight = "bold",
        getElem("mods_menu_options").style.color = "#999999")
    }
    ;
    Mods.initializeOptionsMenu = function() {
        var b = "", e = Mods.modOptions, f = "", g = 0, k;
        for (k in e)
            if (void 0 != e[k].options) {
                var m = e[k].options, n;
                for (n in m)
                    if (void 0 != m[n].id && (b = k + "_" + m[n].id,
                    f = m[n],
                    g = 0,
                    Mods.populateOptionsMenu(b, f, g, e[k].id),
                    void 0 != m[n].options)) {
                        var p = m[n].options, r;
                        for (r in p)
                            if (void 0 != p[r].id && (b = k + "_" + n + "_" + p[r].id,
                            f = p[r],
                            g = 1,
                            Mods.populateOptionsMenu(b, f, g, e[k].id),
                            void 0 != p[r].options)) {
                                var t = p[r].options, q;
                                for (q in t)
                                    void 0 != t[q].id && (b = k + "_" + n + "_" + r + "_" + t[q].id,
                                    f = t[q],
                                    g = 2,
                                    Mods.populateOptionsMenu(b, f, g, e[k].id))
                            }
                    }
            } else
                b = k + "_0options",
                f = null ,
                g = 0,
                Mods.populateOptionsMenu(b, f, g, e[k].id)
    }
    ;
    Mods.populateOptionsMenu = function(b, e, f, g) {
        if (null != e) {
            var k = e.type
              , m = "mod_options_options_row_" + b
              , n = "id='mod_options_options_" + b + "' "
              , p = "<" + k.createElement + (void 0 != e.value ? " value='" + e.value + "' " : " ")
              , r = void 0 != k["class"] ? "class='" + k["class"] + "' " : ""
              , t = "style='' "
              , q = void 0 != e.onclick ? "onclick='" + e.onclick + "'>" : "'>"
              , u = void 0 != k.closeElement ? "</" + k.closeElement + "></td>" : "</td>"
              , x = ""
              , y = ""
              , A = "";
            b = "mod_options_options_row2_" + b + (void 0 != e.value ? "_" + e.value : "");
            var B = "", v = 0, F = 0, E;
            for (E in k.style)
                t = t.slice(0, -2) + E + ":" + k.style[E] + ";' ";
            "all" == k.opt_span ? v = 4 - f : (v = 1,
            F = 4 - (f + v));
            void 0 != e.description && (A = "<span class='common_link' onclick='javascript:getElem(&apos;" + b + "&apos;).style.display = getElem(&apos;" + b + "&apos;).style.display == &apos;none&apos;? &apos;&apos;:&apos;none&apos;' style='float:right; margin:0px;'>(more info)</span></td>",
            B = "<td colspan='" + f + "'></td><td colspan='" + (4 - f) + "'><span>" + e.description + "</span></td>");
            "text" == k.type ? x = e.name + A : "button" == k.type ? (x = e.name,
            y = A + "</td>",
            u = void 0 != k.closeElement ? "</" + k.closeElement + ">" : "") : y = void 0 != e.border ? "<div style='height:10px; width:40px; margin-top:1px; border:1px solid " + e.border + ";'></div>" : void 0 != e.background ? "<div style='height:11px; width:40px; margin-top:1px; background:" + e.border + ";'></div>" : "<td colspan='" + F + "'><span>" + e.name + "</span>" + A;
            f = 0 < f ? "<td colspan='" + f + "'><td colspan='" + v + "'>" : "<td colspan='" + v + "'>"
        } else
            m = "mod_options_options_row_" + b,
            n = "mod_options_options_" + b,
            p = "<span ",
            r = "",
            t = "style='' ",
            q = ">",
            u = "</span></td>",
            x = "This mod does not have any options that can be changed.",
            y = "",
            b = "mod_options_options_row2_" + b,
            B = "",
            f = "<td colspan='4'>";
        e = document.createElement("tr");
        e.id = m;
        e.innerHTML = f + p + n + r + t + q + x + u + y;
        e.style.marginTop = "12px";
        getElem("mod_options_options_" + g + "_table").appendChild(e);
        f = document.createElement("tr");
        f.id = b;
        f.innerHTML = B;
        f.style.display = "none";
        getElem("mod_options_options_" + g + "_table").appendChild(f);
        f = document.createElement("tr");
        f.innerHTML = "&nbsp;";
        f.style.fontSize = ".3em";
        getElem("mod_options_options_" + g + "_table").appendChild(f)
    }
    ;
    Mods.loadOptionsMenu = function(b) {
        var e = !0;
        void 0 != Mods.modOptions[b] && (e = !1);
        for (var f in Mods.modOptions) {
            var g = Mods.modOptions[f];
            if ((!e && f == b || e) && void 0 != g.options && g.loaded) {
                var g = g.options, k = JSON.parse(localStorage[f + "_options"]), m;
                for (m in g)
                    if ("radio" == g[m].type.type ? (getElem("mod_options_options_" + f + "_" + g[m].id).value = k[f][g[m].id] || 0,
                    Mods.modOptions_options(f, g[m].id)) : "checkbox" == g[m].type.type && (getElem("mod_options_options_" + f + "_" + g[m].id).checked = k[f][g[m].id] || !1,
                    Mods.modOptions_options(f, g[m].id)),
                    void 0 != g.options) {
                        var n = g.options, p;
                        for (p in n)
                            "radio" == n[p].type.type ? (getElem("mod_options_options_" + f + "_" + m + "_" + n[p].id).value = k[f][m][n[p].id] || 0,
                            Mods.modOptions_options(f, g[m].id, n[p].id)) : "checkbox" == n[p].type.type && (getElem("mod_options_options_" + f + "_" + m + "_" + n[p].id).checked = k[f][m][n[p].id] || !1,
                            Mods.modOptions_options(f, g[m].id, n[p].id))
                    }
            }
        }
    }
    ;
    Mods.modOptions_options = function(b, e, f) {}
    ;
    Load.variables();
    Load.functions();
    Mods.worldChangeUpdate()
}
;
Mods.isLoaded = function(b) {
    return -1 != Mods.loadedMods.indexOf(b) && "undefined" == typeof Mods.failedToLoad[b.toLowerCase()] ? !0 : !1
}
;
Load.functions = function() {
    Mods.consoleLog = function(b) {
        iOS || Android || console.log(b)
    }
    ;
    Mods.failedLoad = function(b) {
        if (!0 === b) {
            b = !0;
            var e = "", f;
            for (f in Mods.failedToLoad)
                modOptions[f] && (b = !1,
                e += modOptions[f].name + ", ");
            e = b ? "Mods loaded and ready: RPG MO Mods Pack version " + Mods.version : "Mod failed to load: " + e.slice(0, -2) + ". Please inform the mod developers (RStudios, Dendrek or WitWiz). Try reloading the game and do not load this mod until this issue can be fixed.";
            quiet_mod_load || addChatText(e, void 0, COLOR.TEAL)
        } else
            Mods.failedToLoad[b] = 1
    }
    ;
    Mods.timestamp = function(b) {
        delete Mods.failedToLoad[b];
        Mods.consoleLog(b + " loaded (" + Math.round((timestamp() - modOptions[b].time) / 10) / 100 + "s)")
    }
    ;
    Mods.findWithAttr = function(b, e, f) {
        for (var g in b)
            if (b[g][e] == f)
                return g
    }
    ;
    ChatSystem.toggle = function() {
        var b;
        Mods.isLoaded("Wikimd") && (b = Mods.Wikimd.chatSystemToggle());
        b || captcha || (Mods.chatSystemToggle(),
        Mods.isLoaded("Tabs") && (b = GAME_STATE == GAME_STATES.CHAT ? getAbsoluteHeight(my_text) : 0,
        Mods.Tabs.resize(b)))
    }
    ;
    Chat.set_hidden = function() {
        if (-1 != loadedMods.indexOf("Chatmd") && 0 == Mods.Chatmd.set_hidden() || 0 == Mods.set_hidden())
            return !1;
        -1 != loadedMods.indexOf("Tabs") && (getElem("tabs").style.visibility = "hidden",
        getElem("chat_resize").style.visibility = "hidden")
    }
    ;
    Mods.cleanText = function(b, e, f) {
        e ? b = b.replace(/['"]/g, "*") : f ? b.replace(/'/g, "\\'").replace(/"/g, '\\"') : b = b.replace(/'/g, "&apos;").replace(/"/g, "&quot;");
        return b
    }
    ;
    Mods.timeConvert = function(b, e, f) {
        var g, k, m;
        k = {
            year: 31536E3,
            day: 86400,
            hour: 3600,
            minute: 60,
            second: 1
        };
        b = (0 < b ? b : 0) - (0 < e ? e : 0);
        m = "";
        b = 1E3 === f || .001 === f ? b / 1E3 : 60 === f || 3600 === f ? b * f : b;
        for (g in k)
            1 <= b / k[g] && (e = Math.floor(b / k[g]),
            b -= e * k[g],
            m += e + " " + g + sOrNoS(e) + ", ");
        return m = m.slice(0, -2)
    }
    ;
    Mods.UpdateBase = Mods.UpdateBase || updateBase;
    updateBase = function() {
        Mods.UpdateBase()
    }
    ;
    Mods.refreshHUD = Mods.refreshHUD || refreshHUD;
    refreshHUD = function() {
        Mods.refreshHUD();
        for (var b in loadedMods) {
            var e = loadedMods[b];
            "undefined" != typeof Mods[e] && "undefined" != typeof Mods[e].refreshHUD && Mods[e].refreshHUD()
        }
    }
    ;
    Mods.CustomMenu = Mods.CustomMenu || ActionMenu.custom_create;
    ActionMenu.custom_create = function(b, e) {
        Mods.CustomMenu(b, e);
        var f = getElem("action_menu");
        f.offsetTop + f.offsetHeight > window.innerHeight && (f.style.top = window.innerHeight - f.offsetHeight + "px")
    }
    ;
    inventoryClick = function(b) {
        Mods.oldInventoryClick(b);
        Mods.isLoaded("Gearmd") && Mods.Gearmd.inventoryClick();
        Mods.isLoaded("Miscmd") && Mods.Miscmd.inventoryClick()
    }
    ;
    setCanvasSize = function(b) {
        Mods.oldCanvasSize(b);
        Mods.setCanvasSize()
    }
    ;
    Mods.setCanvasSize = function() {
        for (var b = 0; 3 > b; b++)
            Mods.fontSize[b] = Math.min(1, Math.round((1 + .4 * (b - 1)) * current_ratio_y * 10) / 10) + "em";
        for (var e in loadedMods)
            b = loadedMods[e],
            "undefined" != typeof Mods[b] && "undefined" != typeof Mods[b].setCanvasSize && Mods[b].setCanvasSize();
        getElem("object_selector_info", {
            style: {
                left: Math.ceil(320 * current_ratio_x) + "px",
                width: "20%",
                height: "auto",
                textAlign: "center"
            }
        });
        getElem("market_offer_popup") && hasClass(getElem("market"), "hidden") && Mods.Newmarket.hidedetails();
        Mods.isLoaded("Tabs") && Mods.Tabs.resize()
    }
    ;
    Music.play = function(b, e) {
        for (var f in loadedMods) {
            var g = loadedMods[f];
            if ("undefined" != typeof Mods[g] && "undefined" != typeof Mods[g].onMapChange)
                Mods[g].onMapChange(players[0].map)
        }
        Mods.oldMusic.play(b, e)
    }
    ;
    Inventory.equip = function(b, e, f) {
        if (!Mods.inventoryEquip(b, e, f))
            return Mods.oldInventoryEquip(b, e, f)
    }
    ;
    Mods.inventoryEquip = function(b, e, f) {
        var g = !1, k;
        for (k in loadedMods) {
            var m = loadedMods[k];
            "undefined" != typeof Mods[m] && "undefined" != typeof Mods[m].inventoryEquip && (g = !0 === Mods[m].inventoryEquip(b, e, f) || !0 === g ? !0 : !1)
        }
        return g
    }
    ;
    document.addEventListener("keyup", function(b) {
        Mods.eventListener("keyup", b.keyCode, keyMap.action(b))
    });
    document.addEventListener("keydown", function(b) {
        Mods.eventListener("keydown", b.keyCode, keyMap.action(b))
    });
    Mods.currentSocket = function(b) {
        "object" === typeof b && b.action && Mods.socketOn(b.action, b.data, b)
    }
    ;
    Mods.socketOn = function(b, e, f) {
        for (var g in loadedMods)
            void 0 !== Mods[loadedMods[g]].socketOn && -1 !== Mods[loadedMods[g]].socketOn.actions.indexOf(b) && Mods[loadedMods[g]].socketOn.fn(b, e, f)
    }
    ;
    socket.on("message", Mods.currentSocket);
    Mods.worldChangeUpdate = function() {
        Mods.currentWorldID = 0;
        for (var b in ServerList.downloaded)
            if (ServerList.downloaded[b].url == ServerList.last_connected) {
                Mods.currentWorldID = ServerList.downloaded[b].world;
                break
            }
        if (0 < Mods.currentWorldID)
            for (var e in loadedMods)
                if (b = loadedMods[e],
                "undefined" != typeof Mods[b] && "undefined" != typeof Mods[b].onWorldChange)
                    Mods[b].onWorldChange()
    }
    ;
    switchWorldBugFix = function() {
        socket.removeListener("message", Mods.currentSocket);
        socket.on("message", Mods.currentSocket);
        Mods.worldChangeUpdate()
    }
    ;
    Mods.eventListener = function(b, e, f) {
        for (var g in loadedMods)
            void 0 === Mods[loadedMods[g]].eventListener || !Mods[loadedMods[g]].eventListener.keys[b] || !0 !== Mods[loadedMods[g]].eventListener.keys[b][0] && -1 === Mods[loadedMods[g]].eventListener.keys[b].indexOf(e) && -1 == Mods[loadedMods[g]].eventListener.keys[b].indexOf(f) || Mods[loadedMods[g]].eventListener.fn(b, e, f)
    }
}
;
Load.variables = function() {
    Mods.loadedMods = Mods.loadedMods || [];
    loadedMods = Mods.loadedMods;
    localStorage.enableNewMods = localStorage.enableNewMods || "false";
    Mods.disableInvClick = !1;
    KEY_ACTION.CTRL = 145;
    keyMap.keys[1][17] = KEY_ACTION.CTRL;
    keyMap.keys[1][91] = KEY_ACTION.CTRL;
    Mods.oldCanvasSize = Mods.oldCanvasSize || setCanvasSize;
    Mods.oldInventoryEquip = Mods.oldInventoryEquip || Inventory.equip;
    Mods.failedToLoad = Mods.failedToLoad || {};
    Mods.set_hidden = Mods.set_hidden || Chat.set_hidden;
    Mods.fontSize = Mods.fontSize || {
        0: .7,
        1: 1,
        2: 1.3
    };
    Mods.marketReplace = {
        " Of": ":",
        "'": "`",
        Necklace: "Neck.",
        Medallion: "Medal.",
        "Platinum ": "Plat. ",
        "Pet ": "",
        " Scroll": "",
        "Enchanted ": "Ench. ",
        Platemail: "Plate.",
        Helmet: "Helm.",
        "Superior ": "Sup. ",
        " Permission": "",
        Defense: "Def.",
        Accuracy: "Acc.",
        Strength: "Str.",
        Farming: "Farm.",
        Woodcutting: "WC.",
        Jewelry: "Jewel.",
        Cooking: "Cook.",
        Carpentry: "Carp.",
        Alchemy: "Alch.",
        "Fishing ": "Fish. ",
        " Fishing": " Fish.",
        "Medium ": "Med. ",
        Teleport: "Tele."
    };
    Mods.oldInventoryClick = inventoryClick;
    Mods.chatSystemToggle = Mods.chatSystemToggle || ChatSystem.toggle;
    getElem("inventory").style.zIndex = "199";
    Mods.oldMusic = Mods.oldMusic || {};
    Mods.oldMusic.play = Mods.oldMusic.play || Music.play;
    Mods.currentWorldID = Mods.currentWorldID || 0;
    Mods.Health = Mods.Health || {};
    Mods.Health.old_inAFight = Mods.Health.old_inAFight || BigMenu.in_a_fight;
    Mods.Rclick = Mods.Rclick || {};
    Mods.Rclick.oldActionMenu = Mods.Rclick.oldActionMenu || ActionMenu.create;
    Mods.Rclick.oldInvMenu = Mods.Rclick.oldInvMenu || InvMenu.create;
    localStorage.infopanelmode = localStorage.infopanelmode || 0;
    Mods.Mosmob = Mods.Mosmob || {};
    Mods.regular_onmousemove = Mods.regular_onmousemove || regular_onmousemove;
    Mods.Tabs = Mods.Tabs || {};
    Mods.Newmarket = Mods.Newmarket || {};
    Mods.Newmarket.submitHolder = Mods.Newmarket.submitHolder || {};
    Mods.Newmarket.submitSorted = Mods.Newmarket.submitSorted || [];
    Mods.Newmarket.submitQueued = Mods.Newmarket.submitQueued || !1;
    Mods.Newmap = Mods.Newmap || {};
    Mods.Kbind = Mods.Kbind || {};
    Mods.Tabs.oldremove_channel = Mods.Tabs.oldremove_channel || Contacts.remove_channel;
    Mods.Tabs.oldadd_channel = Mods.Tabs.oldadd_channel || Contacts.add_channel;
    Mods.Tabs.wwMaxTabs = 8;
    Mods.Tabs.wwCurrentTabs = Mods.Tabs.wwCurrentTabs || [];
    Mods.Tabs.wwTabContent = Mods.Tabs.wwTabContent || [];
    Mods.Tabs.chat_size_percent = .3;
    Mods.Tabs.chat_resize_timestamp = timestamp();
    localStorage.chestInv_color = localStorage.chestInv_color || JSON.stringify("#C000FF");
    localStorage.chestFav_color = localStorage.chestFav_color || JSON.stringify("#FF8000");
    localStorage.chest_colCheck = localStorage.chest_colCheck || "true";
    localStorage.chest_colCheckF = localStorage.chest_colCheckF || "true";
    localStorage.sortFav_check = localStorage.sortFav_check || "false";
    localStorage.sortInv_check = localStorage.sortInv_check || "false";
    localStorage.chestArmorPriority = localStorage.chestArmorPriority || "false";
    localStorage.chestCraftPriority = localStorage.chestCraftPriority || "false";
    localStorage.chestPricePriority = localStorage.chestPricePriority || "false";
    localStorage.chestPlayerPriorities && "{object Object}" == localStorage.chestPlayerPriorities && delete localStorage.chestPlayerPriorities;
    localStorage.chestPlayerPriorities = localStorage.chestPlayerPriorities || JSON.stringify({});
    localStorage.avoidAll = localStorage.avoidAll || JSON.stringify({});
    Mods.Chestm = Mods.Chestm || {};
    Mods.Chestm.chest_item_id = Mods.Chestm.chest_item_id || 0;
    Mods.Chestm.tempChest = Mods.Chestm.tempChest || {};
    Mods.Chestm.inv_select_color = JSON.parse(localStorage.chestInv_color);
    Mods.Chestm.fav_select_color = JSON.parse(localStorage.chestFav_color);
    Mods.Chestm.chest_colCheck = JSON.parse(localStorage.chest_colCheck);
    Mods.Chestm.chest_colCheckF = JSON.parse(localStorage.chest_colCheckF);
    Mods.Chestm.chest_sort_hidden = !0;
    Mods.Chestm.sortFav_check = JSON.parse(localStorage.sortFav_check);
    Mods.Chestm.sortInv_check = JSON.parse(localStorage.sortInv_check);
    Mods.Chestm.armorPriority = JSON.parse(localStorage.chestArmorPriority);
    Mods.Chestm.craftPriority = JSON.parse(localStorage.chestCraftPriority);
    Mods.Chestm.pricePriority = JSON.parse(localStorage.chestPricePriority);
    Mods.Chestm.playerPriorities = JSON.parse(localStorage.chestPlayerPriorities);
    Mods.Chestm.currentChestPage = 1;
    Mods.Chestm.chestArmorPriorities = {
        5: 0,
        0: 1,
        9: 2,
        2: 3,
        1: 4,
        7: 5,
        6: 6,
        3: 7,
        8: 8,
        4: 9
    };
    Mods.Chestm.chestCraftPriorities = {
        3: 0,
        8: 1,
        4: 2,
        7: 3,
        5: 4,
        0: 5,
        9: 6,
        2: 7,
        1: 8,
        6: 9
    };
    Mods.Chestm.materialsPriorities = {
        Jewel: 0,
        Cut: 1,
        Uncut: 2,
        ore: 3,
        Chunk: 3,
        Sand: 3,
        Clay: 3,
        Copper: 3,
        Zinc: 3,
        Coal: 3,
        Bar: 4,
        Mould: 4,
        Log: 5,
        Wood: 5,
        Vial: 6,
        Raw: 7,
        Feather: 8,
        Egg: 9,
        Scale: 10,
        Eye: 11,
        Soil: 12,
        Leaf: 12,
        Seed: 12,
        Grass: 12,
        Hay: 12,
        Wheat: 12,
        Enchant: 13,
        Teleport: 14
    };
    Mods.Chestm.ctrlPressed = !1;
    Mods.Chestm.avoidAll = Mods.Chestm.avoidAll || JSON.parse(localStorage.avoidAll);
    localStorage.RECIPE_LIST = localStorage.RECIPE_LIST || JSON.stringify([]);
    localStorage.RECIPE_U_LIST = localStorage.RECIPE_U_LIST || JSON.stringify({});
    Mods.Forgem = Mods.Forgem || {};
    Mods.Forgem.toForgeItem = Mods.Forgem.toForgeItem || -1;
    Mods.Forgem.FORGE_MATERIALS_LIST = Mods.Forgem.FORGE_MATERIALS_LIST || [];
    Mods.Forgem.FORGE_MAT_LIST = Mods.Forgem.FORGE_MAT_LIST || {};
    Mods.Forgem.RECIPE_LIST = JSON.parse(localStorage.RECIPE_LIST) || [];
    Mods.Forgem.RECIPE_U_LIST = JSON.parse(localStorage.RECIPE_U_LIST) || {};
    Mods.Forgem.oldDrop = Mods.Forgem.oldDrop || Forge.drop;
    Mods.Forgem.oldSelect = Mods.Forgem.oldSelect || Forge.select;
    Mods.Forgem.oldOpen = Mods.Forgem.oldOpen || Forge.forge_open;
    localStorage.expSkillSet = localStorage.expSkillSet || "health";
    Mods.Expbar = Mods.Expbar || {};
    Mods.Expbar.set_skill = localStorage.expSkillSet;
    localStorage.autocastenabled = localStorage.autocastenabled || JSON.stringify(1);
    getElem("options_form");
    Mods.Autocast = Mods.Autocast || {};
    Mods.Autocast.lastFullCast = timestamp();
    Mods.Autocast.enabled = JSON.parse(localStorage.autocastenabled);
    --Mods.Autocast.enabled;
    Mods.Kbind = Mods.Kbind || {};
    Mods.showBag = void 0 == Mods.showBag ? !1 : Mods.showBag;
    Mods.Kbind.lastfoodeaten = timestamp();
    Mods.Expmonitor = Mods.Expmonitor || {};
    Mods.Expmonitor.XPEventSeconds = Mods.Expmonitor.XPEventSeconds || 0;
    Mods.Expmonitor.LastLogin = Mods.Expmonitor.LastLogin || timestamp();
    Mods.Expmonitor.LastXpRequest = Mods.Expmonitor.LastXpRequest || timestamp();
    localStorage.announceBlock = localStorage.announceBlock || JSON.stringify([]);
    localStorage.tradechatmode = localStorage.tradechatmode || 0;
    localStorage.marketpopup = localStorage.marketpopup || !1;
    Mods.Newmarket.times = Mods.Newmarket.times || JSON.parse(localStorage.announceBlock);
    Mods.Newmarket.announceList = Mods.Newmarket.announceList || {};
    Mods.Newmarket.announces = Mods.Newmarket.announces || {
        messages: [],
        count: 0
    };
    Mods.Newmarket.states = Mods.Newmarket.states || {};
    Mods.Newmarket.submitHolder = [];
    Mods.Newmarket.tradechatmode = JSON.parse(localStorage.tradechatmode);
    --Mods.Newmarket.tradechatmode;
    Mods.Newmarket.infopannelmode = JSON.parse(localStorage.infopanelmode);
    --Mods.Newmarket.infopannelmode;
    Mods.Newmarket.popup = JSON.parse(localStorage.marketpopup);
    Mods.Newmarket.old_client_update_new_offer_item_change = Mods.Newmarket.old_client_update_new_offer_item_change || Market.client_update_new_offer_item_change;
    localStorage.fullscreenenabled = localStorage.fullscreenenabled ? localStorage.fullscreenenabled : JSON.stringify(1);
    Mods.Fullscreen = Mods.Fullscreen || {};
    Mods.Fullscreen.iMapBegin = Mods.Fullscreen.iMapBegin || iMapBegin;
    Mods.Fullscreen.jMapBegin = Mods.Fullscreen.jMapBegin || jMapBegin;
    Mods.Fullscreen.iMapTo = Mods.Fullscreen.iMapTo || iMapTo;
    Mods.Fullscreen.jMapTo = Mods.Fullscreen.jMapTo || jMapTo;
    Mods.Fullscreen.astarsearchOld = Mods.Fullscreen.astarsearchOld || astar.search;
    Mods.Fullscreen.enabled = JSON.parse(localStorage.fullscreenenabled);
    --Mods.Fullscreen.enabled;
    localStorage.enableShiftClick = localStorage.enableShiftClick || !1;
    Mods.Petinv = Mods.Petinv || {};
    Mods.Petinv.enableShiftClick_check = JSON.parse(localStorage.enableShiftClick);
    Mods.Petinv.invSendItem = !1;
    Mods.Petinv.petInv_toggle = players[0].pet.enabled ? !0 : !1;
    Mods.Magicm = Mods.Magicm || {};
    Mods.Magicm.enemy = Mods.Magicm.enemy || {};
    Mods.Magicm.magic_damage_timers = Mods.Magicm.magic_damage_timers || {
        0: 0,
        1: 0,
        2: 0,
        3: 0
    };
    Mods.Wikimd = Mods.Wikimd || {};
    Mods.Wikimd.newWikiLoad = Mods.Wikimd.newWikiLoad || {};
    Mods.Wikimd.oldWikiLoad = Mods.Wikimd.oldWikiLoad || {};
    Mods.Wikimd.item_formulas = Mods.Wikimd.item_formulas || {};
    Mods.Wikimd.item_slots = {
        0: "Helm",
        1: "Cape",
        2: "Chest",
        3: "R.Hand",
        4: "L.Hand",
        5: "Glove",
        6: "Boots",
        7: "Neck",
        8: "Ring",
        9: "none",
        10: "Magic",
        11: "Pants"
    };
    Mods.Wikimd.oldSortList = Mods.Wikimd.oldSortList || [];
    Mods.Wikimd.oldSortValue = Mods.Wikimd.oldSortValue || "";
    Mods.Wikimd.newSortValue = Mods.Wikimd.newSortValue || "";
    Mods.Wikimd.oldSort = Mods.Wikimd.oldSort || {};
    Mods.Wikimd.oldSort = {
        item: Mods.Wikimd.oldSort.item || "name",
        monster: Mods.Wikimd.oldSort.monster || "name",
        vendor: Mods.Wikimd.oldSort.vendor || "name",
        craft: Mods.Wikimd.oldSort.craft || "name",
        pet: Mods.Wikimd.oldSort.pet || "name",
        spell: Mods.Wikimd.oldSort.spell || "name",
        enchant: Mods.Wikimd.oldSort.enchant || "name"
    };
    Mods.Wikimd.formulas = Mods.Wikimd.formulas || {};
    Mods.Wikimd.span = {
        item: {
            wiki_r1_c0: {
                c: 2,
                r: 2
            },
            wiki_r1_c3: {
                c: 2
            }
        },
        monster: {
            wiki_r2_c1: {
                c: 5
            }
        },
        vendor: {
            wiki_r1_c0: {
                c: 2
            },
            wiki_r1_c1: {
                c: 5
            }
        },
        craft: {
            wiki_r1_c0: {
                c: 2
            },
            wiki_r2_c0: {
                c: 2
            },
            wiki_r2_c1: {
                c: 5
            }
        },
        pet: {
            wiki_r2_c1: {
                c: 5
            }
        },
        spell: {
            wiki_r1_c0: {
                r: 2
            }
        },
        enchant: {
            wiki_r2_c2: {
                c: 5
            }
        }
    };
    Mods.Wikimd.mouse = {
        x: 0,
        y: 0
    };
    Mods.Wikimd.pet_family = Mods.Wikimd.pet_family || {};
    Mods.Wikimd.family = Mods.Wikimd.family || {};
    LazyLoad.css(cdn_url + "mod.css?v=" + mod_version, function() {
        Mods.consoleLog("CSS Loaded")
    });
    localStorage.activeQuest = localStorage.activeQuest || JSON.stringify(!1);
    localStorage.penalty_bonus = localStorage.penalty_bonus || JSON.stringify("health");
    localStorage.audioVolume = localStorage.audioVolume || "50";
    Mods.Miscmd = Mods.Miscmd || {};
    Mods.Miscmd.ideath = Mods.Miscmd.ideath || {};
    Mods.Miscmd.ideath.inventory = [];
    Mods.Miscmd.ideath.bgColor = "#3A6";
    Mods.Miscmd.ideath.brColor = "inherit";
    Mods.Miscmd.toolbar = Mods.Miscmd.toolbar || {};
    Mods.Miscmd.toolbar.oldDrawMap = Mods.Miscmd.toolbar.oldDrawMap || drawMap;
    Mods.Miscmd.toolbar.xpmessage = ["Current experience rate is 2x"];
    Mods.Miscmd.toolbar.ids = {
        playerLocation: "td_location",
        playerStats: "td_stats",
        questData: "td_quests",
        currentTime: "td_time",
        invSlots: "td_inventory",
        dpsinfo: "td_dpsinfo",
        currentWorld: "td_current_world"
    };
    Mods.Miscmd.toolbar.oldInventoryAdd = Mods.Miscmd.toolbar.oldInventoryAdd || Inventory.add;
    Mods.Miscmd.toolbar.oldInventoryRemove = Mods.Miscmd.toolbar.oldInventoryRemove || Inventory.remove;
    Mods.Miscmd.toolbar.activeQuest = Mods.Miscmd.toolbar.activeQuest || JSON.parse(localStorage.activeQuest);
    Mods.Miscmd.toolbar.oldQuestsShowActive = Mods.Miscmd.toolbar.oldQuestsShowActive || Quests.show_active;
    Mods.Miscmd.penalty = Mods.Miscmd.penalty || JSON.parse(localStorage.penalty_bonus);
    Mods.Miscmd.oldPenaltyBonus = Mods.Miscmd.oldPenaltyBonus || penalty_bonus;
    Mods.Miscmd.potions = Mods.Miscmd.potions || {};
    Mods.Miscmd.adps = [];
    Mods.Miscmd.maxtime = 18E4;
    Mods.Miscmd.avgdps = 0;
    Mods.Miscmd.maxdps = 0;
    Mods.Miscmd.avgexp = 0;
    Mods.Miscmd.dpsmode = !1;
    Mods.Miscmd.lastSkill = {};
    Mods.Miscmd.changeVolume = Mods.Miscmd.changeVolume || {};
    localStorage.colorChannel = localStorage.colorChannel || JSON.stringify(!1);
    localStorage.highlightFriends = localStorage.highlightFriends || JSON.stringify(!0);
    localStorage.timer = localStorage.timer && "object" == typeof JSON.parse(localStorage.timer) && localStorage.timer || JSON.stringify({
        start: {},
        set: {}
    });
    localStorage.tipsenabled = localStorage.tipsenabled ? localStorage.tipsenabled : JSON.stringify(0);
    localStorage.enableallchatts = localStorage.enableallchatts ? localStorage.enableallchatts : JSON.stringify(0);
    Mods.Chatmd = Mods.Chatmd || {};
    Mods.Chatmd.addChatText = Mods.Chatmd.addChatText || addChatText;
    Mods.Chatmd.colors = {
        EN: "#FFFFFF",
        ST: "#D4D4D4",
        18: "#99FFC6",
        $$: "#F2A2F2",
        "{M}": "#EAE330",
        "default": "#FFDFC0",
        none: "#DDDD69"
    };
    Mods.Chatmd.runTimer = Mods.Chatmd.runTimer || JSON.parse(localStorage.timer);
    Mods.Chatmd.ModCh = Mods.Chatmd.ModCh || {};
    Mods.Chatmd.ModCh.delay = Mods.Chatmd.ModCh.delay || !1;
    Mods.Chatmd.ModCh.channel = "{M}";
    Mods.Chatmd.ModCh.regular_onclick = Mods.Chatmd.ModCh.regular_onclick || regular_onclick;
    chat_filters.mod = !1;
    Mods.Chatmd.afkHolder = Mods.Chatmd.afkHolder || {};
    Mods.Chatmd.afkMessage = Mods.Chatmd.afkMessage || "";
    Mods.Chatmd.whispNames = Mods.Chatmd.whispNames || [];
    Mods.Chatmd.cycleWhisper = Mods.Chatmd.cycleWhisper || !0;
    Mods.Chatmd.oldDrawObject = Mods.Chatmd.oldDrawObject || drawObject;
    Mods.Chatmd.mooDelay = Mods.Chatmd.mooDelay || {};
    Mods.Chatmd.blockCommand = !1;
    Mods.Chatmd.enableallchatts = JSON.parse(localStorage.enableallchatts);
    --Mods.Chatmd.enableallchatts;
    Mods.Chatmd.tipsenabled = JSON.parse(localStorage.tipsenabled);
    --Mods.Chatmd.tipsenabled;
    Mods.Chatmd.old_has_client_command = Mods.Chatmd.old_has_client_command || Chat.has_client_command;
    Mods.Chatmd.old_execute_client_command = Mods.Chatmd.old_execute_client_command || Chat.execute_client_command;
    Mods.Tabs.set_visible = Mods.Tabs.set_visible || Chat.set_visible;
    Mods.Tabs.chatMovement = Mods.Tabs.chatMovement || -1;
    Mods = Mods || {};
    Mods.Farming = Mods.Farming || {};
    Mods.Farming.queue = Mods.Farming.queue || {};
    Mods.Farming.sortedQueue = Mods.Farming.sortedQueue || [];
    Mods.Farming.ctrlPressed = Mods.Farming.ctrlPressed || !1;
    Mods.Farming.queueHidden = Mods.Farming.queueHidden || !1;
    Mods.Farming.queuePaused = Mods.Farming.queuePaused || !1;
    Mods.Farming.wateringCanDisabled = Mods.Farming.wateringCanDisabled || !1;
    Mods.Farming.oldDefault = Mods.Farming.oldDefault || {
        rake: DEFAULT_FUNCTIONS.rake,
        seed: DEFAULT_FUNCTIONS.seed,
        harvest: DEFAULT_FUNCTIONS.harvest,
        get_watering_can_id: Inventory.get_watering_can_id
    };
    Mods.Farming.oldInventoryEquip = Mods.Farming.oldInventoryEquip || Inventory.equip;
    Mods.Farming.oldMoveInPath = Mods.Farming.oldMoveInPath || moveInPath;
    localStorage.farming_options = localStorage.farming_options || JSON.stringify({});
    Mods.Farming.options = Mods.Farming.options || JSON.parse(localStorage.farming_options);
    Mods.Farming.farming_queue_template = Handlebars.compile("<span style='width: 100%; display: block; float: left; color: #FF0; font-weight: bold; border-bottom: 1px solid #DDD; padding-bottom: 5px; margin-bottom: 2px;'>Farming Queue <span class='common_link' style='margin: 0; font-weight: normal; float: right;' onclick='Mods.Farming.queueOptions(true);'>(options)</span></span><span id='mods_farming_queue' style='width: 100%; float: left; display: block; margin-bottom: 2px; padding-bottom: 2px; overflow-y: hidden;'><span style='width: 100%; float: left; display: inline-block; font-weight: bold; color: #999;'><span style='float: left;'>Action:&nbsp;&nbsp;Object</span><span style='float: right;'>Coords</span></span></span><span style='width: 100%; float: left; display: inline-block; border-bottom: 1px solid #DDD; margin-bottom: 2px; padding-bottom: 4px;'><span style='float: left;'>Queued:&nbsp;<span id='mods_farming_total'>0</span></span><span class='common_link' style='margin: 0; float: right; display: block; font-weight: normal;' onclick='Mods.Farming.cancelQueue()'>(clear)</span></span><span style='color: #FF0;'>Action: <span id='mods_farming_action' style='color: #FFF; font-weight: normal;'>Active</span></span><span id='farming_queue_button' class='common_link' style='margin: 0; float: right; display: block; font-weight: normal;' onclick='Mods.Farming.pauseQueue(this)'>(queue)</span>");
    Mods.Farming.farming_queue_action_template = Handlebars.compile("<span id='mods_farming_{{slot}}' style='width: 100%; float: left; display: inline-block; font-weight: normal;'><span>{{action}}:&nbsp;&nbsp;{{object}}</span><span style='float: right;'>({{i}}, {{j}})</span></span>");
    Mods.Farming.farming_queue_option_template = Handlebars.compile("<span style='color: #FF0; font-weight: bold; width: 100%; float: left; margin-bottom: 2px; padding-bottom: 5px; border-bottom: 1px solid #DDD;'>Farming Options</span><table style='color: #DDD;'><tr><td colspan='2'><div id='mods_farming_opt_hide' class='common_link' style='margin: 4px;' onclick='Mods.Farming.hideQueue()'>Hide queued window</div></td></tr><tr><td><input type='checkbox' id='mods_farming_opt_equipped' style='width: .8em; height: .8em;'></td><td><div style='margin: 3px;'>Meet requirements to queue action</div></td></tr><tr><td><input type='checkbox' id='mods_farming_opt_stop' style='width: .8em; height: .8em;'></td><td><div style='margin: 3px;'>Stop movement while queuing</div></td></tr><tr><td><input type='checkbox' id='mods_farming_opt_save' style='width: .8em; height: .8em;'></td><td><div style='margin: 3px;'>Save queue when leaving island</div></td></tr><tr><td colspan='2'><div style='margin: 3px;'>Ctrl: Toggle Queuing</div></td></tr><tr><td colspan='2'><div style='margin: 3px;'>Space: Toggle Active/Paused</div></td></tr></table>");
    Mods.Miscmd.default_open_nest = Mods.Miscmd.default_open_nest || Breeding.open_nest
}
;
Load.rclick = function() {
    modOptions.rclick.time = timestamp();
    ActionMenu.mobDrops = function(b, e) {
        var f = "";
        if (e == BASE_TYPE.OBJECT) {
            var g = object_base[b].name;
            addChatText(g + " drops:", void 0, COLOR.ORANGE);
            for (var k in object_base[b].params.results) {
                var m = {}, n, p, r = 0;
                n = 0;
                p = object_base[b].params.results[k].returns;
                for (var t in p) {
                    var g = object_base[b].params.results[k].skill
                      , g = skills[0][g].current > skills[0][g].level ? skills[0][g].current : skills[0][g].level
                      , q = p[t].chance || g >= p[t].level && void 0 != p[t].max_chance && Math.min(p[t].base_chance + (g - p[t].level) / 100, p[t].max_chance) || Math.min(g >= p[t].level && p[t].base_chance + (g - p[t].level) / 100, 1) || 0;
                    m[item_base[p[t].id].name] = {
                        percent: q * (1 - n),
                        xp: "undefined" == typeof p[t].xp ? "" : "(" + p[t].xp + "xp) "
                    };
                    "undefined" != typeof p[t].xp && (r += p[t].xp * q * (1 - n));
                    n += m[item_base[p[t].id].name].percent
                }
                n = 0;
                for (t in m)
                    f = f + t + " " + Math.round(1E4 * m[t].percent) / 100 + "% " + m[t].xp + "- ",
                    n += m[t].percent;
                f = 0 < Math.round(1E4 * (1 - n)) / 100 ? f + "No loot " + Math.round(1E4 * (1 - n)) / 100 + "%" : f.slice(0, -3);
                0 < r && (r = Math.round(100 * r) / 100,
                f = f + "; avg: " + r + "xp");
                f += ". ";
                addChatText(f, void 0, COLOR.WHITE);
                f = ""
            }
        } else if (e == BASE_TYPE.NPC) {
            if (npc_base[b].type == OBJECT_TYPE.SHOP) {
                m = {};
                g = npc_base[b].name;
                for (r in npc_base[b].temp.content)
                    k = npc_base[b].temp.content[r],
                    0 < k.count && (m[item_base[k.id].name] = {
                        stock: k.count
                    });
                for (t in m)
                    f = f + t + " (" + m[t].stock + ") - ";
                f = "" === f ? "Nothing." : f.slice(0, -3) + ".";
                addChatText(g + " sells:", void 0, COLOR.ORANGE)
            } else {
                m = {};
                n = r = 0;
                p = npc_base[b].params.drops;
                g = npc_base[b].name;
                for (t in p)
                    q = p[t].chance || skills[0][object_base[b].params.results[0].skill].level >= p[t].level && void 0 != p[t].max_chance && Math.min(p[t].base_chance + (skills[0][object_base[b].params.results[0].skill].level - p[t].level) / 100, p[t].max_chance) || Math.min(skills[0][object_base[b].params.results[0].skill].level >= p[t].level && p[t].base_chance + (skills[0][object_base[b].params.results[0].skill].level - p[t].level) / 100, 1) || 0,
                    m[item_base[p[t].id].name] = {
                        percent: q * (1 - n),
                        xp: "undefined" == typeof p[t].xp ? "" : "(" + p[t].xp + "xp) "
                    },
                    "undefined" != typeof p[t].xp && (r += p[t].xp * q * (1 - n)),
                    n += m[item_base[p[t].id].name].percent;
                n = 0;
                for (t in m)
                    f = f + t + " " + Math.round(1E4 * m[t].percent) / 100 + "% " + m[t].xp + "- ",
                    n += m[t].percent;
                f = 0 < Math.round(1E4 * (1 - n)) / 100 ? f + "No loot " + Math.round(1E4 * (1 - n)) / 100 + "%" : f.slice(0, -3);
                addChatText(g + " drops:", void 0, COLOR.ORANGE);
                0 < r && (r = Math.round(100 * r) / 100,
                f = f + "; avg: " + r + "xp");
                f += ". "
            }
            addChatText(f, void 0, COLOR.WHITE)
        }
    }
    ;
    ActionMenu.combatCheck = function(b) {
        for (var e = 0, f = 0, g = 0, k = e = 0, m = 0, n = 0, p = 0, r = 0, t = 0, q = 0, u = 0, x = 0, y = 0; 2 > y; y++)
            0 == y && (k = players[0].temp.total_strength,
            m = npc_base[b].temp.total_defense,
            n = players[0].temp.total_accuracy),
            1 == y && (k = npc_base[b].temp.total_strength,
            m = players[0].temp.total_defense,
            n = npc_base[b].temp.total_accuracy),
            f = Math.ceil(k / 5),
            e = Math.max(Math.ceil(m - n), 0),
            0 == e ? (g = .5 * f + 1,
            e = 0) : 1 < (e - 1) / f ? (g = (Math.pow(f, 2) + 3 * f + 3) / (6 * e),
            e = 1 - (f + 2) / (2 * e)) : (g = .5 * f + 1 - .5 * e - Math.pow(1 - e, 3) / (6 * f * e),
            e = (Math.pow(e, 2) - 2 * e + 1) / (2 * e * f)),
            0 == y && (p = g,
            r = e,
            t = f + 1),
            1 == y && (q = g,
            u = e,
            x = f + 1);
        var f = players[0].params.magic_slots
          , k = g = 0
          , m = 1 - players[0].params.cooldown
          , A = 1 - (npc_base[b].temp.magic_block || 0) / 100;
        if (0 < f)
            for (var B = "", n = 0; n < f; n++)
                if (n < players[0].params.magics.length)
                    var y = players[0].params.magics[n].id
                      , e = Math.min(1, (players[0].temp.magic / 1.2 + skills[0].magic.current + Magic[y].params.penetration) / npc_base[b].temp.total_defense)
                      , v = A * Math.round((.5 / 1.333 + .25) * Magic[y].params.basic_damage * e) / (Magic[y].params.cooldown * m / 1E3)
                      , F = Math.ceil(3 / (Magic[y].params.cooldown * m / 1E3))
                      , F = A * F * Math.round((1 / 1.333 + .25) * Magic[y].params.basic_damage * e)
                      , B = B + Magic[y].name + " (" + Math.round(100 * e) / 100 + "): " + Math.round(100 * v) / 100 + "/s; "
                      , g = g + v
                      , k = k + F;
        var A = npc_base[b].temp.magics && npc_base[b].temp.magics.length || 0
          , E = m = 0
          , w = 1 - (npc_base[b].temp.cooldown || 0)
          , D = 1 - (players[0].temp.magic_block || 0) / 100;
        if (0 < A)
            for (var G = "Enemy magic: ", n = 0; n < A; n++)
                n < A && (y = npc_base[b].temp.magics[n].id,
                e = Math.min(1, (npc_base[b].temp.magic / 1.2 + Magic[y].params.penetration) / players[0].temp.total_defense),
                v = 1 / Math.ceil(Magic[y].params.cooldown * w / 1E3 / 3),
                v = D * Math.round((.5 / 1.333 + .25) * Magic[y].params.basic_damage * e * v / 3 * 100) / 100,
                F = Math.min(1, Math.ceil(3 / (Magic[y].params.cooldown * w / 1E3))),
                F = D * F * Math.round((1 / 1.333 + .25) * Magic[y].params.basic_damage * e),
                G = G + Magic[y].name + " (" + Math.round(100 * e) / 100 + "): " + Math.round(100 * v) / 100 + "/s; ",
                m += v,
                E += F);
        u = "ENEMY: average damage = " + Math.round(100 * q) / 100 + " + " + Math.round(300 * m) / 100 + "M = " + Math.round(100 * (q + 3 * m)) / 100 + ", chance to hit = " + Math.round(1E4 * (1 - u)) / 100 + "%, max damage: " + x + " + " + E + "M = " + (x + E);
        r = "YOU: average damage = " + Math.round(100 * p) / 100 + " + " + Math.round(300 * g) / 100 + "M = " + Math.round(100 * (p + 3 * g)) / 100 + ", chance to hit = " + Math.round(1E4 * (1 - r)) / 100 + "%, max damage: " + t + " + " + k + "M = " + (t + k);
        addChatText("Combat Analysis: " + npc_base[b].name, void 0, COLOR.ORANGE);
        addChatText(u, void 0, COLOR.WHITE);
        addChatText(r, void 0, COLOR.WHITE);
        0 < f && (addChatText(B, void 0, COLOR.TEAL),
        addChatText("Total magic damage: " + Math.round(100 * g) / 100 + "/s", void 0, COLOR.TEAL));
        0 < A && (addChatText(G, void 0, COLOR.TEAL),
        addChatText("Total magic damage from enemy: " + Math.round(100 * m) / 100 + "/s", void 0, COLOR.TEAL));
        b = Math.ceil(npc_base[b].temp.health / (p + 3 * g));
        q = (b - 1) * (q + 3 * m);
        p = 3 * b;
        p = Math.floor(p / 60) + ":" + (10 > parseInt(p % 60, 10) ? "0" : "") + parseInt(p % 60, 10);
        q = "Average per fight: hits: " + Math.round(100 * b) / 100 + ", damage received: " + Math.round(100 * q) / 100 + ", time to kill: " + p;
        addChatText(q, void 0, COLOR.WHITE)
    }
    ;
    Contacts.add_channel = function(b) {
        if (Contacts.can_join_channel(b)) {
            if (-1 < loadedMods.indexOf("Tabs"))
                for (var e = 0; e < Mods.Tabs.wwCurrentTabs.length; e++)
                    Mods.Tabs.wwCurrentTabs[e].channels[b] = !0;
            Mods.Tabs.oldadd_channel(b)
        }
    }
    ;
    Contacts.remove_channel = function(b) {
        if (-1 < loadedMods.indexOf("Tabs"))
            for (var e = 0; e < Mods.Tabs.wwCurrentTabs.length; e++)
                delete Mods.Tabs.wwCurrentTabs[e].channels[b];
        Mods.Tabs.oldremove_channel(b)
    }
    ;
    InvMenu.create = function(b) {
        Mods.Rclick.oldInvMenu(b);
        b = players[0].temp.inventory[b];
        "undefined" != typeof b && (b = item_base[b.id],
        d = getElem("action_menu"),
        -1 < loadedMods.indexOf("Kbind") && (d.innerHTML += "<span class='line' onclick='Mods.destroyallitems(" + b.b_i + ")'>Destroy All<span class='item'>" + Mods.cleanText(b.name) + "</span></span>"),
        -1 < loadedMods.indexOf("Wikimd") && -1 < loadedMods.indexOf("Chatmd") && (b = b.name.replace(/'/g, "\\&apos;"),
        d.innerHTML += "<span class='line' onclick='Mods.Chatmd.chatCommands(&apos;/wiki item name " + b + "&apos;);addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)'>Check Wiki<span class='item'>ITEM</span></span><span class='line' onclick='Mods.Chatmd.chatCommands(&apos;/wiki craft item " + b + "&apos;);addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)'>Check Wiki<span class='item'>CRAFT</span></span><span class='line' onclick='Mods.Chatmd.chatCommands(&apos;/wiki npc item " + b + "&apos;);addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)'>Check Wiki<span class='item'>NPC</span></span>"))
    }
    ;
    Mods.destroyallitems = function(b) {
        InvMenu.hide();
        "undefined" != typeof b && Popup.prompt("Do you want to destroy all " + item_base[b].name + "?", function() {
            Socket.send("inventory_destroy", {
                item_id: b,
                all: !0
            })
        })
    }
    ;
    getElem("action_menu").style.zIndex = "999999999";
    ActionMenu.create = function(b, e, f) {
        Mods.Rclick.oldActionMenu(b, e, f);
        if (!f) {
            f = getElem("action_menu");
            addClass(f, "hidden");
            f.style.top = b.clientY + 10 + "px";
            f.style.left = b.clientX + "px";
            var g = b = "";
            e = "";
            for (var k in players)
                if ("0" != k && players[k].i == selected_object.i && players[k].j == selected_object.j && players[k].b_t == BASE_TYPE.PLAYER) {
                    e = "<span class='line' onclick=\"ChatSystem.whisper('" + players[k].name.sanitize() + "');addClass(getElem(&apos;action_menu&apos;), ";
                    e += "&apos;hidden&apos;)\">Whisper <span class='item'>" + players[k].name.sanitize() + "</span></span>";
                    break
                }
            if (1 == selected_object.b_t && void 0 != selected_object.params.results || 4 == selected_object.b_t)
                b = "<span class='line' onclick='ActionMenu.mobDrops(" + selected_object.b_i + "," + selected_object.b_t + ");addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)' style='margin-left:-5px;'><span class='item'>" + selected_object.name + "</span>Drops</span>" + ("4" == selected_object.b_t ? "<span class='line' onclick='ActionMenu.combatCheck(" + selected_object.b_i + ");addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)'>Combat Analysis</span>" : ""),
                modOptions.chatmd.loaded && (selected_object.type == OBJECT_TYPE.SHOP ? (k = selected_object.name.replace(/'/g, "*"),
                g = "<span class='line' onclick='Mods.Chatmd.chatCommands(&apos;/wiki npc name " + k + "&apos;);addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)'>Check Wiki<span class='item'>NPC</span></span>") : selected_object.type == OBJECT_TYPE.ENEMY && (k = selected_object.name.replace(/'/g, "*"),
                g = "<span class='line' onclick='Mods.Chatmd.chatCommands(&apos;/wiki mob name " + k.replace("[BOSS]", "") + "&apos;);addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)'>Check Wiki<span class='item'>MOB</span></span>"));
            k = ActionMenu.action(selected_object, 0) + ActionMenu.action(selected_object, 1) + b + g + e + ActionMenu.action(selected_object, 2);
            f.innerHTML = k;
            0 < f.innerHTML.length && removeClass(f, "hidden")
        }
    }
    ;
    Mods.timestamp("rclick")
}
;
Load.chestm = function() {
    modOptions.chestm.time = timestamp();
    Chest.open = function(b, e, f) {
        chest_content = b;
        chests[0] = b;
        for (var g in Mods.Chestm.tempChest)
            delete Mods.Chestm.tempChest[g];
        for (b = 0; b < chests[0].length; b++)
            Mods.Chestm.tempChest[chest_content[b].id] = b;
        e && Chest.change_page(chest_page);
        f && Carpentry.init(f);
        Chest.sort_player_modChest()
    }
    ;
    BigMenu.update_chest = function(b) {
        -1 < navigator.userAgent.search("Chrome") && (Mods.Chestm.inv_select_color = getElem("chest_invColor").value,
        Mods.Chestm.fav_select_color = getElem("chest_favColor").value);
        Mods.Chestm.chest_colCheck = getElem("chest_colCheck").checked;
        Mods.Chestm.chest_colCheckF = getElem("chest_colCheckF").checked;
        chest_content = b;
        getElem("chest_coins_amount").innerHTML = thousandSeperate(players[0].temp.coins);
        for (var e = chest_page - 1, f = 60 * e, g = Math.min(b.length, 60 * e + 60); f < 60 * e + 60; f++) {
            var k = getElem("chest_" + (f - 60 * e)), m, n, p;
            if (f < g) {
                n = item_base[b[f].id];
                m = b[f].id;
                k.style.background = Items.get_background(n.b_i);
                k = k.childNodes[0];
                n = b[f].count;
                p = Inventory.get_item_count(players[0], b[f].id);
                l = "";
                o = 0;
                for (h = 6 - n.toString().length - p.toString().length; o < h; o++)
                    l += "&nbsp;";
                k.innerHTML = n + l + p
            } else
                m = -1;
            k = getElem("chest_" + (f - 60 * e));
            0 < Inventory.get_item_count(players[0], m) && Mods.Chestm.chest_colCheck ? k.style.borderColor = Mods.Chestm.inv_select_color : k.style.borderColor = Mods.Chestm.chest_colCheckF && Mods.Chestm.playerPriorities[m] ? Mods.Chestm.fav_select_color : "";
            localStorage.chestInv_color = JSON.stringify(Mods.Chestm.inv_select_color);
            localStorage.chestFav_color = JSON.stringify(Mods.Chestm.fav_select_color);
            localStorage.chest_colCheck = JSON.stringify(Mods.Chestm.chest_colCheck);
            localStorage.chest_colCheckF = JSON.stringify(Mods.Chestm.chest_colCheckF)
        }
        BigMenu.update_chest_selection();
        Chest.button_enable_check()
    }
    ;
    Chest.mouseoverColor = function(b, e) {
        var f = b.id
          , f = parseInt(f.replace("chest_", "")) + 60 * (parseInt(chest_page) - 1)
          , f = chests[0][f] && chests[0][f].id || !1;
        "" != b.style.borderColor && 1 == e && (b.style.borderColor = "#1DEDFF");
        "" != b.style.borderColor && 0 == e && (b.style.borderColor = 0 < Inventory.get_item_count(players[0], f) && Mods.Chestm.chest_colCheck && Mods.Chestm.inv_select_color || Mods.Chestm.chest_colCheckF && Mods.Chestm.playerPriorities[f] && Mods.Chestm.fav_select_color || "")
    }
    ;
    Chest.button_enable_check = function() {
        var b = chest_page - 1
          , e = parseInt(selected_chest) + 60 * b;
        if ("undefined" != typeof chest_content[e]) {
            var f = chest_content[e].id
              , g = getElem("chest_withdraw_item_1")
              , b = getElem("chest_withdraw_item_8")
              , k = getElem("chest_withdraw_item_19")
              , m = getElem("chest_withdraw_item_all")
              , n = getElem("chest_deposit_item_1")
              , p = getElem("chest_deposit_item_all")
              , r = getElem("chest_deposit_item_pet")
              , t = getElem("chest_destroy_item");
            0 == chest_content[e].count ? (g.className = "",
            b.className = "",
            k.className = "",
            m.className = "",
            t.className = "",
            g.onclick = function() {}
            ,
            b.onclick = function() {}
            ,
            k.onclick = function() {}
            ,
            m.onclick = function() {}
            ,
            t.onclick = function() {}
            ) : (g.className = "link",
            b.className = "link",
            k.className = "link",
            m.className = "link",
            t.className = "link",
            g.onclick = function() {
                Chest.withdraw(1)
            }
            ,
            b.onclick = function() {
                Chest.withdraw(8)
            }
            ,
            k.onclick = function() {
                Chest.withdraw(19)
            }
            ,
            m.onclick = function() {
                Chest.withdraw(99)
            }
            ,
            t.onclick = function() {
                Chest.destroy()
            }
            );
            0 == Inventory.get_item_count(players[0], f) ? (n.className = "",
            p.className = "",
            n.onclick = function() {}
            ,
            p.onclick = function() {}
            ) : (n.className = "link",
            p.className = "link",
            n.onclick = function() {
                Chest.deposit(1)
            }
            ,
            p.onclick = function() {
                Chest.deposit(99)
            }
            );
            b = !1;
            for (e = 0; e < players[0].temp.inventory.length; e++)
                if (!players[0].temp.inventory[e].selected) {
                    b = !0;
                    break
                }
            b ? (r.className = "link",
            r.onclick = function() {
                Chest.deposit_all()
            }
            ) : (r.className = "",
            r.onclick = function() {}
            )
        }
    }
    ;
    Chest.sort_player_modChest = function() {
        Mods.Chestm.armorPriority = "0" == getElem("chest_sort_category").value ? !0 : !1;
        Mods.Chestm.craftPriority = "1" == getElem("chest_sort_category").value ? !0 : !1;
        Mods.Chestm.pricePriority = "2" == getElem("chest_sort_category").value ? !0 : !1;
        chests[0].sort(function(b, e) {
            Mods.Chestm.sortFav_check = getElem("chest_favCheck").checked;
            Mods.Chestm.sortInv_check = getElem("chest_invCheck").checked;
            var f = item_base[b.id].params.price
              , g = item_base[e.id].params.price
              , k = item_base[b.id].params
              , m = item_base[e.id].params
              , n = item_base[b.id].name
              , p = item_base[e.id].name
              , r = Mods.Chestm.playerPriorities
              , k = (m.min_defense || m.min_accuracy || m.min_health || m.min_forging || m.min_jewelry || m.min_cooking || m.min_carpentry || m.min_fishing || m.min_alchemy || m.min_magic || m.min_archery || 0) - (k.min_defense || k.min_accuracy || k.min_health || k.min_forging || k.min_jewelry || k.min_cooking || k.min_carpentry || k.min_fishing || k.min_alchemy || k.min_magic || k.min_archery || 0)
              , m = item_base[b.id].b_t
              , t = item_base[e.id].b_t;
            1 == Mods.Chestm.armorPriority ? (m = Mods.Chestm.chestArmorPriorities[m],
            t = Mods.Chestm.chestArmorPriorities[t]) : 1 == Mods.Chestm.craftPriority ? (m = Mods.Chestm.chestCraftPriorities[m],
            t = Mods.Chestm.chestCraftPriorities[t]) : 1 == Mods.Chestm.pricePriority && (m = -item_base[b.id].params.price,
            t = -item_base[e.id].params.price);
            if (1 == Mods.Chestm.sortFav_check && "undefined" != typeof r[b.id] && "undefined" == typeof r[e.id])
                return -1;
            if (1 == Mods.Chestm.sortFav_check && "undefined" == typeof r[b.id] && "undefined" != typeof r[e.id])
                return 1;
            if (1 == Mods.Chestm.sortInv_check && 0 < Inventory.get_item_count(players[0], b.id) && 0 == Inventory.get_item_count(players[0], e.id))
                return -1;
            if (1 == Mods.Chestm.sortInv_check && 0 == Inventory.get_item_count(players[0], b.id) && 0 < Inventory.get_item_count(players[0], e.id))
                return 1;
            if (m == t) {
                if (3 == item_base[b.id].b_t && !Mods.Chestm.pricePriority) {
                    var r = item_base[b.id].name, m = item_base[e.id].name, q = t = -1, u;
                    for (u in Mods.Chestm.materialsPriorities)
                        -1 < r.search(u) && (t = Mods.Chestm.materialsPriorities[u]),
                        -1 < m.search(u) && (q = Mods.Chestm.materialsPriorities[u]);
                    if (-1 != t && -1 == q)
                        return -1;
                    if (-1 == t && -1 != q)
                        return 1;
                    if (t < q)
                        return -1;
                    if (t > q)
                        return 1
                }
                return 0 < k ? 1 : 0 > k || f > g ? -1 : f < g ? 1 : n > p ? -1 : n < p ? 1 : 0
            }
            return m < t ? -1 : m > t ? 1 : n > p ? -1 : n < p ? 1 : 0
        });
        BigMenu.update_chest(chests[0], Mods.Chestm.currentChestPage);
        localStorage.sortFav_check = Mods.Chestm.sortFav_check;
        localStorage.sortInv_check = Mods.Chestm.sortInv_check;
        localStorage.chestArmorPriority = Mods.Chestm.armorPriority;
        localStorage.chestCraftPriority = Mods.Chestm.craftPriority;
        localStorage.chestPricePriority = Mods.Chestm.pricePriority
    }
    ;
    Chest.deposit = function(b) {
        var e = chest_page - 1
          , e = parseInt(selected_chest) + 60 * e
          , f = chests[0][e].id
          , e = Mods.Chestm.tempChest[f];
        Mods.Chestm.chest_item_id = f;
        Socket.send("chest_deposit", {
            item_id: f,
            item_slot: e,
            target_id: chest_npc.id,
            target_i: chest_npc.i,
            target_j: chest_npc.j,
            amount: b
        })
    }
    ;
    Chest.destroy = function() {
        var b = chest_page - 1
          , b = parseInt(selected_chest) + 60 * b
          , e = chests[0][b].id
          , b = Mods.Chestm.tempChest[e];
        Mods.Chestm.chest_item_id = e;
        Popup.prompt("Do you want to destroy " + item_base[Mods.Chestm.chest_item_id].name + "?", function() {
            Socket.send("chest_destroy", {
                item_id: e,
                item_slot: b,
                target_id: chest_npc.id
            })
        })
    }
    ;
    Chest.withdraw = function(b) {
        var e = chest_page - 1
          , e = parseInt(selected_chest) + 60 * e;
        b > chest_content[e].count && (b = chest_content[e].count);
        var f = chests[0][e].id
          , e = Mods.Chestm.tempChest[f];
        Mods.Chestm.chest_item_id = f;
        Socket.send("chest_withdraw", {
            item_id: f,
            item_slot: e,
            target_id: chest_npc.id,
            target_i: chest_npc.i,
            target_j: chest_npc.j,
            amount: b
        })
    }
    ;
    Chest.withdrawfavs = function(b) {}
    ;
    Chest.deposit_all = function() {
        var b = players[0].temp.inventory
          , e = Inventory.get_item_counts(players[0]);
        if (Timers.running("deposit_all"))
            return !1;
        Timers.set("deposit_all", null_function, 1E3);
        var f = 0, g = 0, k;
        for (k in e) {
            var f = Inventory.get_item_count(players[0], k), m;
            for (m in b)
                parseInt(b[m].id) == k && b[m].selected && --f;
            0 == f || Mods.Chestm.avoidAll[k] || (function(b, e, f) {
                setTimeout(function() {
                    Socket.send("chest_deposit", {
                        item_id: e,
                        item_slot: Mods.Chestm.tempChest[e],
                        target_id: chest_npc.id,
                        target_i: chest_npc.i,
                        target_j: chest_npc.j,
                        amount: f
                    })
                }, 75 * b)
            }(g, k, f),
            g += 1)
        }
    }
    ;
    Mods.Chestm.eventListener = {
        keys: {
            keydown: [KEY_ACTION.CTRL],
            keyup: [KEY_ACTION.CTRL]
        },
        fn: function(b, e, f) {
            "keydown" == b && f === KEY_ACTION.CTRL && (Mods.Chestm.ctrlPressed = !0,
            Mods.disableInvClick = !0,
            Mods.Chestm.showAvoidAll(!0),
            Timers.set("clear_ctrl_chest", function() {
                Mods.Chestm.eventListener.fn("keyup", !1, KEY_ACTION.CTRL)
            }, 1E3));
            "keyup" == b && f === KEY_ACTION.CTRL && (Mods.Chestm.ctrlPressed = !1,
            Mods.disableInvClick = !1,
            Mods.Chestm.showAvoidAll(!1))
        }
    };
    Mods.Chestm.showAvoidAll = function(b) {
        b = b || !1;
        for (var e = 0; 40 > e; e++) {
            var f = getElem("inv_" + e)
              , g = players[0].temp.inventory[e] && players[0].temp.inventory[e].id || !1
              , k = f.style.borderColor || "#FFFFFF"
              , m = "#FFFFFF" != f.style.borderColor && "rgb(255, 255, 255)" != f.style.borderColor ? f.style.borderColor : "";
            f.style.borderColor = g && b && Mods.Chestm.avoidAll[g] ? k : m
        }
    }
    ;
    (function() {
        for (var b = 0; 10 > b; b++)
            if ("undefined" != typeof getElem("chest").childNodes[1].childNodes[0])
                getElem("chest").childNodes[1].removeChild(getElem("chest").childNodes[1].childNodes[0]);
            else
                break;
        createElem("span", getElem("chest").childNodes[1], {
            id: "chest_chest",
            style: "float: left; font-weight: bold;",
            innerHTML: "Chest"
        });
        createElem("span", getElem("chest").childNodes[1], {
            id: "chest_sort",
            className: "link",
            style: "float: left; font-weight: bold; margin: 0px; margin-left: 10px;",
            innerHTML: "Sort"
        });
        createElem("span", getElem("chest").childNodes[1], {
            id: "chest_market",
            className: "link",
            style: "margin-right: 72px; margin-top: 5px;",
            innerHTML: "Market",
            onclick: function() {
                Market.open()
            }
        });
        createElem("span", getElem("chest").childNodes[1], {
            id: "chest_close",
            className: "link",
            style: "margin: 0px; padding: 0px; float: right;",
            innerHTML: "Close",
            onclick: function() {
                addClass(getElem("chest"), "hidden")
            }
        });
        for (b = 0; 5 > b; b++)
            createElem("span", getElem("chest").childNodes[1], {
                id: "chest_page_" + (5 - b),
                className: "chest_pages link",
                style: "margin: 0px; padding-right: 9px; float: right;",
                onclick: function() {
                    for (var b = 0; 5 > b; b++)
                        getElem("chest_page_" + (b + 1)).style.color = "";
                    b = parseInt(this.id.replace("chest_page_", ""));
                    getElem("chest_page_" + b).style.color = "orange";
                    Chest.change_page(b)
                },
                innerHTML: 5 - b
            });
        getElem("chest_withdraw").style.display = "none";
        getElem("chest_withdraw_8").style.display = "none";
        getElem("chest_destroy").style.display = "none";
        getElem("chest_deposit").style.display = "none";
        getElem("chest_deposit_all").style.display = "none";
        getElem("chest_item_name").style.display = "none";
        createElem("span", "chest", {
            id: "chest_sort_holder",
            style: "width: 359px; min-height: 22px; display: none; margin-bottom: 3px; margin-top: 3px; padding-bottom: 4px; color: #FFF; border-bottom: 1px solid #666;"
        });
        createElem("span", "chest", {
            id: "chest_btn_holder",
            style: "font-weight: bold; color: #555;"
        });
        createElem("select", "chest_sort_holder", {
            id: "chest_sort_category",
            className: "market_select",
            style: "width: 144px; float: left; margin: 1px 12px 3px 5px;",
            onchange: function() {
                Chest.sort_player_modChest()
            },
            innerHTML: "<option value='-1'>-- Sort Inventory --</option><option value='0'>Sort: Equipment</option><option value='1'>Sort: Materials</option><option value='2'>Sort: Vendor Price</option>"
        });
        createElem("div", "chest_sort_holder", {
            id: "chest_divInv",
            style: "display: inline-block; float: left;"
        });
        createElem("input", "chest_divInv", {
            id: "chest_invCheck",
            type: "checkbox",
            style: "float: left; margin: 1px 7px 0px 0px; width: 0.7em; height: 0.7em;",
            onchange: function() {
                Chest.sort_player_modChest()
            }
        });
        createElem("span", "chest_divInv", {
            id: "chest_invCheck_name",
            style: "float: left; font-size: 0.7em; margin-top: -1px;",
            innerHTML: "Inventory Items"
        });
        createElem("input", "chest_divInv", {
            id: "chest_colCheck",
            type: "checkbox",
            style: "float: left; clear: left; margin: 1px 7px 0px 0px; width: 0.7em; height: 0.7em;",
            onchange: function() {
                BigMenu.update_chest(chest_content)
            }
        });
        createElem("span", "chest_divInv", {
            id: "chest_colCheck_name",
            style: "float: left; font-size: 0.7em;",
            innerHTML: "Highlight"
        });
        createElem("div", "chest_sort_holder", {
            id: "chest_divFav",
            style: "display: inline-block; float: left;"
        });
        createElem("input", "chest_divFav", {
            id: "chest_favCheck",
            type: "checkbox",
            style: "float: left; margin: 1px 7px 0px 14px; width: 0.7em; height: 0.7em;",
            onchange: function() {
                Chest.sort_player_modChest()
            }
        });
        createElem("span", "chest_divFav", {
            id: "chest_favCheck_name",
            style: "float: left; font-size: 0.7em; margin-top: -1px;",
            innerHTML: "Favorited Items"
        });
        createElem("input", "chest_divFav", {
            id: "chest_colCheckF",
            type: "checkbox",
            style: "float: left; clear: left; margin: 1px 7px 0px 14px; width: 0.7em; height: 0.7em;",
            onchange: function() {
                BigMenu.update_chest(chest_content)
            }
        });
        createElem("span", "chest_divFav", {
            id: "chest_colCheck_nameF",
            style: "float: left; font-size: 0.7em;",
            innerHTML: "Highlight"
        });
        -1 < navigator.userAgent.search("Chrome") && (createElem("input", "chest_divInv", {
            id: "chest_invColor",
            type: "color",
            style: "float: left; margin: -2px 0px 0px 3px; width: .95em; height: 1.25em; border: none; background: none; background-color: transparent;",
            onchange: function() {
                BigMenu.update_chest(chest_content)
            }
        }),
        createElem("input", "chest_divFav", {
            id: "chest_favColor",
            type: "color",
            style: "float: left; margin: -2px 0px 0px 3px; width: .95em; height: 1.25em; border: none; background: none; background-color: transparent;",
            onchange: function() {
                BigMenu.update_chest(chest_content)
            }
        }));
        createElem("span", "chest_btn_holder", {
            id: "chest_withdraw_item",
            style: "float: left; color: #FF0; font-weight: normal; margin: 5px 6px;",
            innerHTML: "Withdraw"
        });
        createElem("span", "chest_btn_holder", {
            id: "chest_withdraw_item_1",
            className: "link",
            style: "float: left; margin: 3px;",
            innerHTML: "1",
            onclick: function() {
                Chest.withdraw(1)
            }
        });
        createElem("span", "chest_btn_holder", {
            id: "chest_withdraw_item_8",
            className: "link",
            style: "float: left; margin: 3px;",
            innerHTML: "8",
            onclick: function() {
                Chest.withdraw(8)
            }
        });
        createElem("span", "chest_btn_holder", {
            id: "chest_withdraw_item_19",
            className: "link",
            style: "float: left; margin: 3px;",
            innerHTML: "19",
            onclick: function() {
                Chest.withdraw(19)
            }
        });
        createElem("span", "chest_btn_holder", {
            id: "chest_withdraw_item_all",
            className: "link",
            style: "float: left; margin: 4px 6px;",
            innerHTML: "All",
            onclick: function() {
                Chest.withdraw(99)
            }
        });
        createElem("span", "chest_btn_holder", {
            id: "chest_deposit_item",
            style: "float: right; color: #FF0; font-weight: normal; margin: 5px 6px;",
            innerHTML: "Deposit"
        });
        createElem("span", "chest_btn_holder", {
            id: "chest_deposit_item_1",
            className: "link",
            style: "float: right; margin: 4px 6px;",
            innerHTML: "1",
            onclick: function() {
                Chest.deposit(1)
            }
        });
        createElem("span", "chest_btn_holder", {
            id: "chest_deposit_item_all",
            className: "link",
            style: "float: right; margin: 4px 6px;",
            innerHTML: "All",
            onclick: function() {
                Chest.deposit(99)
            }
        });
        createElem("span", "chest_btn_holder", {
            id: "chest_deposit_item_pet",
            className: "link",
            style: "float: right; margin: 4px 5px;",
            innerHTML: "All+",
            onclick: function() {
                Chest.deposit_all()
            }
        });
        createElem("span", "chest_btn_holder", {
            id: "chest_destroy_item",
            className: "link",
            style: "float: left; margin: 4px 0px 0px 20px;",
            innerHTML: "Destroy",
            onclick: function() {
                Chest.destroy();
                Chest.sort_player_modChest()
            }
        });
        for (b = 0; 60 > b; b++)
            getElem("chest_" + b).onmouseover = new Function("Chest.mouseoverColor(this,true);"),
            getElem("chest_" + b).onmouseout = new Function("Chest.mouseoverColor(this,false);"),
            getElem("chest_" + b).onclick = function() {}
            ;
        getElem("chest_colCheck").checked = Mods.Chestm.chest_colCheck;
        getElem("chest_colCheckF").checked = Mods.Chestm.chest_colCheckF;
        -1 < navigator.userAgent.search("Chrome") && (getElem("chest_invColor").value = Mods.Chestm.inv_select_color,
        getElem("chest_favColor").value = Mods.Chestm.fav_select_color);
        getElem("chest_sort").onclick = function() {
            Mods.Chestm.chest_sort_hidden = !Mods.Chestm.chest_sort_hidden;
            Mods.Chestm.chest_sort_hidden ? (getElem("chest_sort_holder").style.display = "none",
            getElem("chest_sort").innerHTML = "Sort") : (getElem("chest_sort_holder").style.display = "inline-block",
            getElem("chest_sort").innerHTML = "Sort (hide)")
        }
        ;
        getElem("chest_invCheck").checked = Mods.Chestm.sortInv_check;
        getElem("chest_favCheck").checked = Mods.Chestm.sortFav_check;
        getElem("chest_sort_category").value = Mods.Chestm.armorPriority ? 0 : Mods.Chestm.craftPriority ? 1 : Mods.Chestm.pricePriority ? 2 : -1;
        getElem("chest").onclick = function(b) {
            var f = b.target;
            b = f.id;
            var g = /chest_[0-9]/.test(b);
            g || (f = f.parentNode,
            f = f.id,
            /chest_[0-9]/.test(f) && (b = f,
            g = !0));
            g && (b = b.replace("chest_", ""));
            f = Mods.Chestm.ctrlPressed;
            g && (f ? (b = parseInt(b) + 60 * (parseInt(chest_page) - 1),
            (b = chests[0][b] && chests[0][b].id || !1) && (Mods.Chestm.playerPriorities[b] ? delete Mods.Chestm.playerPriorities[b] : Mods.Chestm.playerPriorities[b] = !0)) : (selected_chest = b,
            Chest.button_enable_check()));
            localStorage.chestPlayerPriorities = JSON.stringify(Mods.Chestm.playerPriorities);
            Chest.sort_player_modChest()
        }
        ;
        getElem("inventory").onclick = function(b) {
            var f = b.target;
            b = f.id;
            var g = /inv_[0-9]/.test(b);
            g && (b = b.replace("inv_", ""));
            var k = Mods.Chestm.ctrlPressed;
            g && k && (g = players[0].temp.inventory[b] && players[0].temp.inventory[b].id || !1) && (Mods.Chestm.avoidAll[g] ? delete Mods.Chestm.avoidAll[g] : Mods.Chestm.avoidAll[g] = !0,
            f.style.borderColor = (Mods.Chestm.avoidAll[g] || !1) && "#00FF00" || "#FF0000",
            Timers.set("slot_border_" + b, function() {
                f.style.borderColor = "";
                Mods.Chestm.ctrlPressed && Mods.Chestm.showAvoidAll(!0)
            }, 1E3),
            Mods.Chestm.showAvoidAll(!0));
            localStorage.avoidAll = JSON.stringify(Mods.Chestm.avoidAll)
        }
    })();
    Mods.timestamp("chestm")
}
;
Load.forgem = function() {
    modOptions.forgem.time = timestamp();
    Mods.Forgem.forgeMatList = function() {
        var b = []
          , e = FORGE_FORMULAS[Mods.Forgem.toForgeItem];
        Mods.Forgem.FORGE_MATERIALS_LIST.splice(0, Mods.Forgem.FORGE_MATERIALS_LIST.length);
        if (void 0 != e.item_id && "-1" != Mods.Forgem.toForgeItem)
            for (var f = 0; f < e.pattern.length; f++)
                for (var g = 0; g < e.pattern[f].length; g++) {
                    b.push(e.pattern[f][g]);
                    Mods.Forgem.countUnique(b, Mods.Forgem.FORGE_MATERIALS_LIST);
                    for (var k in Mods.Forgem.FORGE_MAT_LIST)
                        delete Mods.Forgem.FORGE_MAT_LIST[k];
                    for (var m = 0; m < Mods.Forgem.FORGE_MATERIALS_LIST.length; m++)
                        Mods.Forgem.FORGE_MAT_LIST[Mods.Forgem.FORGE_MATERIALS_LIST[m]] = FORGE_FORMULAS[Mods.Forgem.toForgeItem].materials[Mods.Forgem.FORGE_MATERIALS_LIST[m]]
                }
        else
            for (k in Mods.Forgem.FORGE_MAT_LIST)
                delete Mods.Forgem.FORGE_MAT_LIST[k]
    }
    ;
    Mods.Forgem.countUnique = function(b, e) {
        e.splice(0, e.length);
        for (var f = {}, g = 0; g < b.length; g++)
            f.hasOwnProperty(b[g]) || "-1" == b[g] || (e.push(b[g]),
            f[b[g]] = 1)
    }
    ;
    Mods.Forgem.forgeButtonShow = function() {
        var b = getElem("forge_btnSelect")
          , e = !0;
        Mods.Forgem.toForgeItem = getElem("forge_search").value;
        if (-1 != Mods.Forgem.toForgeItem && void 0 != FORGE_FORMULAS[Mods.Forgem.toForgeItem].item_id) {
            Mods.Forgem.forgeMatList();
            for (var f in Mods.Forgem.FORGE_MAT_LIST)
                e = void 0 != Mods.Forgem.FORGE_MAT_LIST[f] && Inventory.get_item_count(players[0], f) >= Mods.Forgem.FORGE_MAT_LIST[f] && 1 == e ? !0 : !1
        } else
            e = !1;
        b.style.display = e ? "block" : "none";
        e = !1;
        b = getElem("forge_btnRemove");
        for (f = 0; 4 > f; f++)
            for (var g = 0; 4 > g; g++)
                if ("" != getElem("forg_slot_" + f + "_" + g).style.background || e)
                    e = !0;
        b.style.display = e ? "block" : "none";
        b = parseInt(getElem("forge_search").value);
        getElem("forge_btnForget").style.display = "number" == typeof b && -1 != b ? "block" : "none"
    }
    ;
    Mods.Forgem.place_mats = function(b) {
        var e = FORGE_FORMULAS[Mods.Forgem.toForgeItem];
        Mods.Forgem.remove_mats();
        if (b)
            for (b = 0; b < e.pattern.length; b++)
                for (var f = 0; f < e.pattern[b].length; f++)
                    for (var g = 0; g < players[0].temp.inventory.length; g++)
                        if (players[0].temp.inventory[g].id == e.pattern[b][f]) {
                            var k = getElem("forg_inv_" + g);
                            k.srcElement = k;
                            k.preventDefault = function() {}
                            ;
                            Forge.select(k, !1);
                            Forge.switcher(forge_selected, getElem("forg_slot_" + b + "_" + f), !0)
                        }
        Mods.Forgem.forgeButtonShow()
    }
    ;
    Mods.Forgem.remove_mats = function() {
        for (var b = 0; 4 > b; b++)
            for (var e = 0; 4 > e; e++)
                for (var f = 0; 40 > f; f++)
                    if ("" != getElem("forg_slot_" + b + "_" + e).style.background && "" == getElem("forg_inv_" + f).style.background) {
                        var g = getElem("forg_slot_" + b + "_" + e);
                        g.srcElement = g;
                        g.preventDefault = function() {}
                        ;
                        Forge.select(g, !1);
                        Forge.switcher(forge_selected, getElem("forg_inv_" + f), !0)
                    }
        Mods.Forgem.forgeButtonShow()
    }
    ;
    Mods.Forgem.forget_recipe = function() {
        var b = parseInt(getElem("forge_search").value);
        getElem("forge_search").value = "-1";
        delete Mods.Forgem.RECIPE_U_LIST[b];
        for (var e = 0; e < Mods.Forgem.RECIPE_LIST.length; e++)
            Mods.Forgem.RECIPE_LIST[e] == b && Mods.Forgem.RECIPE_LIST.splice(e, 1);
        addChatText("You have forgotten an old recipe... (" + item_base[FORGE_FORMULAS[b].item_id].name + ")", null , COLOR.ORANGE);
        localStorage.RECIPE_LIST = JSON.stringify(Mods.Forgem.RECIPE_LIST);
        localStorage.RECIPE_U_LIST = JSON.stringify(Mods.Forgem.RECIPE_U_LIST);
        getElem("forge_search").removeChild(getElem("forge_options_" + b));
        0 == Mods.Forgem.RECIPE_LIST.length && (getElem("forge_recipe_select").innerHTML = "No Recipes Known");
        Mods.Forgem.forgeButtonShow()
    }
    ;
    Mods.Forgem.newRecipe = function(b) {
        b = "number" == typeof b ? b : parseInt(forge_formula);
        if ("number" == typeof b && (getElem("forge_recipe_select").innerHTML = "-- Select Recipe --",
        !Mods.Forgem.RECIPE_U_LIST.hasOwnProperty(b) || 0 == Mods.Forgem.RECIPE_LIST.length)) {
            Mods.Forgem.RECIPE_LIST.push(b);
            Mods.Forgem.RECIPE_U_LIST[b] = 1;
            localStorage.RECIPE_LIST = JSON.stringify(Mods.Forgem.RECIPE_LIST);
            localStorage.RECIPE_U_LIST = JSON.stringify(Mods.Forgem.RECIPE_U_LIST);
            addChatText("You have discovered a new recipe! (" + item_base[FORGE_FORMULAS[b].item_id].name + ")", null , COLOR.ORANGE);
            var e = document.createElement("option");
            e.id = "forge_options_" + b;
            e.value = b;
            e.innerHTML = item_base[FORGE_FORMULAS[b].item_id].name;
            getElem("forge_search").appendChild(e)
        }
        Mods.Forgem.forgeButtonShow()
    }
    ;
    Forge.drop = function(b, e) {
        Mods.Forgem.oldDrop(b, e);
        Mods.Forgem.forgeButtonShow()
    }
    ;
    Forge.select = function(b, e) {
        Mods.Forgem.oldSelect(b, e);
        Mods.Forgem.forgeButtonShow()
    }
    ;
    Forge.forge_open = function() {
        Mods.Forgem.oldOpen();
        Mods.Forgem.forgeButtonShow()
    }
    ;
    (function() {
        getElem("forging_menu").style.minHeight = "204px";
        getElem("forging_components").style.bottom = "17px";
        createElem("select", "forging_menu", {
            id: "forge_search",
            className: "market_select",
            style: "width: 142px; position: absolute; top: 25px; left: 3px; display: inline-block;",
            onchange: "Mods.Forgem.forgeButtonShow();"
        });
        createElem("option", "forge_search", {
            id: "forge_recipe_select",
            value: "-1",
            innerHTML: "-- Select Recipe --"
        });
        for (var b = 0; b < Mods.Forgem.RECIPE_LIST.length; b++)
            FORGE_FORMULAS[Mods.Forgem.RECIPE_LIST[b]] ? createElem("option", "forge_search", {
                id: "forge_options_" + Mods.Forgem.RECIPE_LIST[b],
                value: Mods.Forgem.RECIPE_LIST[b],
                innerHTML: item_base[FORGE_FORMULAS[Mods.Forgem.RECIPE_LIST[b]].item_id].name
            }) : (delete Mods.Forgem.RECIPE_U_LIST[Mods.Forgem.RECIPE_LIST[b]],
            Mods.Forgem.RECIPE_LIST.splice(b, 1),
            localStorage.RECIPE_LIST = JSON.stringify(Mods.Forgem.RECIPE_LIST),
            localStorage.RECIPE_U_LIST = JSON.stringify(Mods.Forgem.RECIPE_U_LIST));
        createElem("div", "forging_menu", {
            id: "forge_btn_container",
            style: "display: inline-block; position: absolute; width: 60px; height: 50px; top: 25px; left: 150px;"
        });
        createElem("button", "forge_btn_container", {
            id: "forge_btnRemove",
            className: "market_select pointer",
            style: "position: absolute; top: 23px; font-weight: bold; min-width: 55px; display: none;",
            innerHTML: "Clear",
            onclick: function() {
                Mods.Forgem.remove_mats()
            }
        });
        createElem("button", "forge_btn_container", {
            id: "forge_btnSelect",
            className: "market_select pointer",
            style: "position: absolute; top: 145px; font-weight: bold; min-width: 55px; display: none;",
            innerHTML: "Select",
            onclick: function() {
                Mods.Forgem.place_mats(!0)
            }
        });
        createElem("button", "forge_btn_container", {
            id: "forge_btnForget",
            className: "market_select pointer",
            style: "position: absolute; top: 0px; font-weight: bold; min-width: 55px; display: none;",
            innerHTML: "Forget",
            onclick: function() {
                Mods.Forgem.forget_recipe(!0)
            }
        });
        0 == Mods.Forgem.RECIPE_LIST.length && (getElem("forge_recipe_select").innerHTML = "No Recipes Known");
        Mods.Forgem.oldAttempt = Forge.attempt;
        Forge.attempt = function() {
            Mods.Forgem.oldAttempt();
            Mods.Forgem.newRecipe()
        }
    })();
    Mods.timestamp("forgem")
}
;
Load.health = function() {
    modOptions.health.time = timestamp();
    BigMenu.in_a_fight = function(b, e) {
        var f = -1 != loadedMods.indexOf("Chatmd") && "" != Mods.Chatmd.afkMessage ? "<span class='pointer' title='" + Mods.Chatmd.afkMessage + "' style='color: #F00;' onclick='javascript:Mods.Chatmd.chatCommands(&apos;/afk&apos;)'>*</span>" : "";
        Mods.Health.old_inAFight(b, e);
        "undefined" !== typeof b && (skills[0].health.current = b.temp.health,
        getElem("player_health_name").innerHTML = f + capitaliseFirstLetter(b.name) + " (" + b.temp.health + "/" + skills[0].health.level + ")");
        "undefined" != typeof e && (getElem("enemy_health_name").innerHTML = e.name + " (" + e.temp.health + ")")
    }
    ;
    Player.update_healthbar = function() {
        var b = -1 != loadedMods.indexOf("Chatmd") && "" != Mods.Chatmd.afkMessage ? "<span class='pointer' title='" + Mods.Chatmd.afkMessage + "' style='color: #F00;' onclick='javascript:Mods.Chatmd.chatCommands(&apos;/afk&apos;)'>*</span>" : "";
        players[0].temp.healthbar && removeClass(getElem("player_healthbar"), "hidden");
        getElem("player_health_name").innerHTML = b + capitaliseFirstLetter(players[0].name) + " (" + skills[0].health.current + "/" + skills[0].health.level + ")";
        -1 == players[0].temp.target_id && (getElem("player_health").style.width = Math.round(skills[0].health.current / skills[0].health.level * 100) + "%")
    }
    ;
    Player.update_healthbar();
    Mods.timestamp("health")
}
;
Load.mosmob = function() {
    modOptions.mosmob.time = timestamp();
    regular_onmousemove = function(b) {
        Mods.regular_onmousemove(b);
        2 == socket_status && (b = translateMousePositionToScreenPosition(b.clientX, b.clientY),
        100 > b.x && 100 > b.y || minimap) && (getElem("object_selector_info").style.display = "block")
    }
    ;
    updateMouseSelector = function(b) {
        if (hasClass(getElem("mods_tooltip_holder"), "hidden")) {
            var e = getElem("object_selector_info");
            e.style.pointerEvents = "none";
            if (!mouse_over_magic && !mouse_over_quiver) {
                b.clientX = b.clientX || b.pageX || b.touches && b.touches[0].pageX;
                b.clientY = b.clientY || b.pageY || b.touches && b.touches[0].pageY;
                Math.round(Math.min(window.innerWidth, width * max_scale));
                Math.round(Math.min(window.innerWidth / k, height * max_scale));
                var f = Math.min(16, Math.round(16 * current_ratio_y))
                  , g = translateMousePosition(b.clientX, b.clientY);
                b = "";
                var k = "#FFFF00";
                if (g && map_visible(g.i, g.j) && on_map[current_map] && on_map[current_map][g.i] && on_map[current_map][g.i]) {
                    var m;
                    (m = obj_g(on_map[current_map][g.i][g.j])) || (m = player_map[g.i] && player_map[g.i][g.j] ? player_map[g.i][g.j][0] : !1);
                    if (m && m.name && "Name" != m.name) {
                        b = m.name;
                        m.b_t == BASE_TYPE.PLAYER && (k = "#FFFFFF",
                        b = capitaliseFirstLetter(b) + " (" + FIGHT.calculate_monster_level(m) + ")");
                        m.b_t == BASE_TYPE.PET && (b = pets[m.id].name + "<br/><span style='font-size:" + .7 * f + "px'>" + capitaliseFirstLetter(b) + "</span>");
                        if (m.b_t == BASE_TYPE.NPC)
                            if (m.type == OBJECT_TYPE.SHOP)
                                b += " (NPC)";
                            else {
                                editor_enabled && (b = b + " (ID:" + m.b_i + ")");
                                b = b + " (" + FIGHT.calculate_monster_level(m) + ")<br/><span style='font-size:" + .7 * f + "px'>(" + npc_base[m.b_i].temp.total_accuracy + "A, " + npc_base[m.b_i].temp.total_strength + "S, " + npc_base[m.b_i].temp.total_defense + "D, " + (npc_base[m.b_i].temp.magic ? npc_base[m.b_i].temp.magic + "M, " : "") + npc_base[m.b_i].params.health + "Hp)</span>";
                                var n = "undefined" != typeof npc_base[m.b_i].temp.melee_block ? npc_base[m.b_i].temp.melee_block : !1
                                  , p = "undefined" != typeof npc_base[m.b_i].temp.magic_block ? npc_base[m.b_i].temp.magic_block : !1
                                  , r = "undefined" != typeof npc_base[m.b_i].temp.archery_block ? npc_base[m.b_i].temp.archery_block : !1;
                                if (n || p || r) {
                                    var t = "";
                                    n && (t += "Melee Block:" + n + " ");
                                    p && (t += "Magic Block:" + p + " ");
                                    r && (t += "Archery Block:" + r + " ");
                                    b = b + "<br/><span style='font-size:" + .7 * f + "px'>" + t + "</span>"
                                }
                                0 == Mods.Newmarket.infopannelmode && (b += m.params.aggressive ? "<br/><span style='color:#FF0000;font-size:" + .7 * f + "px'>Aggressive</span>" : "<br/><span style='color:#FFFFFF;font-size:" + .7 * f + "px'>Passive</span>")
                            }
                        m.params.desc && 0 == Mods.Newmarket.infopannelmode && (b = b + "<br/><span style='font-size:" + .7 * f + "px'><i>" + m.params.desc + "</i></span>");
                        editor_enabled && (b += "<br/>(i: " + g.i + ", j:" + g.j + ")",
                        m.blocking && (b += "(B)"))
                    }
                }
                editor_enabled && (m = g.i - dx,
                g = g.j - dy,
                10 < g && 11 > m && 1 < m && (g = m - 2 + 9 * (16 - g) + editor_page * editor_page_size,
                g < BASE_TYPE[tileset].length && 0 <= g && g < (editor_page + 1) * editor_page_size && (b = BASE_TYPE[tileset][g].name,
                BASE_TYPE[tileset][g].blocking && (b += "(B)"))));
                e.innerHTML = b;
                e.style.color = k
            }
            "" == b ? e.style.display = "none" : (2 == Mods.Newmarket.infopannelmode ? (e.style.border = "none",
            e.style.backgroundColor = "") : (e.className = "menu",
            e.style.borderRadius = "14px",
            e.style.padding = "7px",
            e.style.border = "2px #666 solid",
            e.style.MozBorderRadius = "10px"),
            e.style.display = "block")
        }
    }
    ;
    InfoPaneltoggle = function() {
        var b = getElem("settings_infopanel");
        switch (Mods.Newmarket.infopannelmode) {
        case 0:
            b.innerHTML = "Info Panel: no inspect";
            Mods.Newmarket.infopannelmode = 1;
            break;
        case 1:
            b.innerHTML = "Info Panel: transparent";
            Mods.Newmarket.infopannelmode = 2;
            break;
        default:
            b.innerHTML = "Info Panel: full",
            Mods.Newmarket.infopannelmode = 0
        }
        localStorage.infopanelmode = JSON.stringify(Mods.Newmarket.infopannelmode)
    }
    ;
    Mods.Mosmob.createDiv = function() {
        if (null != getElem("mods_tooltip_holder"))
            return !1;
        createElem("div", wrapper, {
            id: "mods_tooltip_holder",
            className: "menu hidden",
            style: "position: absolute; left: 50%; margin-left: -122px; top: 3.4%; font-size: 0.7em; padding: 7px; border: 2px solid #666; border-radius: 14px; z-index: 100; max-width: 230px;"
        });
        Mods.Mosmob.holder_html_template = Handlebars.compile("<div id='mods_tooltip_name' style='position: relative; width: 100%; float: left; text-align: center;'>&nbsp;</div><div id='mods_tooltip_content' style='position: relative; width: 100%; float: left; clear: left; padding: 3px 6px 1px 0px;'>&nbsp;</div>");
        getElem("mods_tooltip_holder").innerHTML = Mods.Mosmob.holder_html_template()
    }
    ;
    Mods.Mosmob.gatherParams = function(b) {
        var e = {}
          , f = item_base[b];
        if (void 0 == f || void 0 == f.params)
            return !1;
        var g = f.params, k;
        e.name = f.name;
        e.owned = "";
        var f = 0 + Inventory.get_item_count(players[0], b), m;
        for (m in players[0].pet.chest)
            players[0].pet.chest[m] == b && (f += 1);
        for (m in chests[0])
            if (chests[0][m].id == b) {
                0 < chests[0][m].count && (f += chests[0][m].count);
                break
            }
        e.owned += "<span style='color: #FFF'>" + thousandSeperate(f) + "</span>";
        g.min_magic && (g.magic_slots || 10 == g.slot || g.cooldown) ? (f = 10 == g.slot ? Magic[g.magic].params : !1,
        e.spell = 0 == f ? !1 : f.basic_damage + " <span style='color: #AAA;'>Dmg</span>, " + f.cooldown / 1E3 + "s <span style='color: #AAA;'>CD</span>, " + f.xp + " <span style='color: #AAA;'>Exp/Cast</span><br>" + f.penetration + " <span style='color: #AAA;'>Spell Pen</span>, " + f.uses + " <span style='color: #AAA;'>Uses/Scroll</span>") : e.spell = !1;
        f = {
            Good: {
                1: 2500,
                2: 8E4
            },
            Great: {
                1: 8E3,
                2: 17E4
            },
            Best: {
                1: 34999,
                2: 45E4
            },
            Legendary: {
                1: 15E4,
                2: 15E5
            },
            Rare: {
                1: 0,
                2: 1
            }
        };
        e.price = void 0 == g.price ? "span style='color: #F00;'>0</span>" : "<span style='color: #FFF;'>" + thousandSeperate(g.price) + "</span> <span style='color: #AAA'>coins</span>";
        e.obtained = "";
        if (modOptions.wikimd.loaded) {
            e.obtained = "";
            var n = Mods.Wikimd.item_formulas[b];
            if (n.craft && n.craft.source) {
                var p = []
                  , r = "";
                for (m in n.craft.source) {
                    var t = n.craft.source[m].skill || n.craft.source[m].patterns[0].skill || !1;
                    t && -1 == p.indexOf(t) && (p.push(t),
                    r += 0 < r.length ? ", " + capitaliseFirstLetter(t) : capitaliseFirstLetter(t))
                }
                0 < r.length && (e.obtained += "<span style='text-align: center'>Craft <span style='color: #AAA;'>(" + r + ")</span>,&nbsp;</span>")
            }
            n.enchant && n.enchant.from_enchant && (e.obtained += "<span style='text-align: center'>Craft <span style='color: #AAA;'>(Enchant)</span>,&nbsp;</span>");
            n.drop && n.drop.sources && (e.obtained += "<span style='text-align: center'>Drop,&nbsp;</span>");
            if (n.sold && n.sold.sources) {
                e.obtained += "<span style='text-align: center'>";
                p = !1;
                for (k in n.sold.sources)
                    if (n.sold.sources[k].spawn) {
                        p = !0;
                        break
                    }
                e.obtained = p ? e.obtained + "Buy from " : e.obtained + "Sale to ";
                e.obtained += "<span style='color: #AAA;'>(NPC)</span>,&nbsp;</span>"
            }
        }
        if (void 0 == g.no_present) {
            k = "";
            for (var q in f)
                g.price >= f[q][1] && g.price <= f[q][2] && (k += q + ", ");
            k = k.slice(0, -2);
            0 != k.length && (e.obtained += "<span style='text-align: center'>Present <span style='color: #AAA;'>(" + k + ")</span>,&nbsp;</span>")
        }
        g = !1;
        for (m in ItemPacks)
            if (!g && ItemPacks[m].items)
                for (var u in ItemPacks[m].items) {
                    if (ItemPacks[m].items[u].id == b) {
                        e.obtained += "<span style='text-align: center'>MOS,&nbsp;</span>";
                        g = !0;
                        break
                    }
                }
            else
                break;
        0 < e.obtained.length ? (e.obtained = "<span style='text-align: center;'>Obtained: <span style='color: #FFF'><span style='width: 60%;'>" + e.obtained.slice(0, -14),
        e.obtained += "</span></span></span>") : e.obtained = !1;
        return e
    }
    ;
    Mods.Mosmob.compileInfo = function(b) {
        b = Mods.Mosmob.gatherParams(b);
        if (0 == b)
            return !1;
        var e = "<div style='color: #FF0; padding: 0px 10px 2px 10px; text-align: center;'>Owned: " + b.owned + "<span style='color: #AAA'>,</span> Value: " + b.price + "<br>"
          , e = e + (b.obtained ? b.obtained + "<br>" : "")
          , e = e + (b.spell ? "Spell Info: <span style='color: #FFF;'>" + b.spell + "</span><br>" : "")
          , e = e + (b.enchant ? "Enchant Info: <span style='color: #FFF;'>" + b.enchant + "</span>" : "");
        return e + "</div>"
    }
    ;
    Mods.Mosmob.updateTooltip = function(b) {
        !1 !== b && -1 < b ? (removeClass(getElem("mods_tooltip_holder"), "hidden"),
        getElem("mods_tooltip_name").innerHTML = "<div style='width: 100%; text-align: center; padding-bottom: 4px; padding-top: 1px;'><span style='color: #FF0; font-weight: bold; padding-bottom: 3px; padding-left: 3px; font-size: 1.2em;'>" + Mods.cleanText(item_base[b].name) + "</span><br><span style='color: #FF0; padding: 1px 3px 3px 3px; font-style: italic; text-align: center'>" + Items.info(b) + "</span>",
        getElem("mods_tooltip_content").innerHTML = Mods.Mosmob.compileInfo(b),
        getElem("object_selector_info").style.display = "none") : addClass(getElem("mods_tooltip_holder"), "hidden")
    }
    ;
    Mods.Mosmob.findID = function(b) {
        b = b.target || b.srcElement;
        var e = b.id
          , f = /(chest_|cabinet_chest_|shop_|forg_slot_|inv_|pet_inv_|pet_chest_|wiki_row\d_col\d_div_)(\d{1,3})(_(\d{1,2}))?/.exec(e)
          , g = b.item_id || b.getAttribute("item_id");
        b = !1;
        if ("forge_result" == e)
            if ("undefined" != typeof forge_formula)
                g = -1,
                b = FORGE_FORMULAS[forge_formula],
                b = void 0 != b ? b.item_id : !1;
            else {
                Mods.Mosmob.updateTooltip(!1);
                return
            }
        else if (!(f || -1 < g && null != g)) {
            Mods.Mosmob.updateTooltip(!1);
            return
        }
        if (f)
            if ("chest_" == f[1])
                b = parseInt(f[2]),
                b += 60 * (chest_page - 1),
                b = chests[0][b],
                b = void 0 != b ? b.id : !1;
            else if ("cabinet_chest_" == f[1])
                b = parseInt(f[2]),
                e = on_map[current_map][last_cabinet.i][last_cabinet.j].params.items,
                b = void 0 != e ? e[b] : !1;
            else if ("shop_" == f[1])
                b = parseInt(f[2]),
                b = shop_npc.temp.content[b],
                b = void 0 != b ? b.id : !1;
            else if ("forg_slot_" == f[1])
                b = parseInt(f[2]),
                e = parseInt(f[4]),
                b = forge_components[b][e],
                b = void 0 != b ? b.id : !1;
            else if ("inv_" == f[1])
                b = parseInt(f[2]),
                b = players[0].temp.inventory[b],
                b = void 0 != b ? b.id : !1;
            else {
                if ("pet_inv_" == f[1] || "pet_chest_" == f[1])
                    b = parseInt(f[2]),
                    b = players[0].pet.chest[b],
                    b = parseInt(b)
            }
        else
            -1 < g && (b = g);
        -1 < b ? Mods.Mosmob.updateTooltip(b) : Mods.Mosmob.updateTooltip(!1)
    }
    ;
    getElem("wrapper").onmousemove = regular_onmousemove;
    createElem("div", "options_game", {
        innerHTML: "<span class='wide_link pointer' id='settings_infopanel' onclick='InfoPaneltoggle();'>Info Panel: full</span>"
    });
    Mods.Mosmob.createDiv();
    InfoPaneltoggle();
    document.body.onmouseover = Mods.Mosmob.findID;
    Mods.timestamp("mosmob")
}
;
Load.expbar = function() {
    modOptions.expbar.time = timestamp();
    Mods.Expbar.updateExpInfo = function() {
        var b = Math.round(Level.xp_for_level(skills[0][Mods.Expbar.set_skill].level + 1) - skills[0][Mods.Expbar.set_skill].xp)
          , e = Math.round(Level.xp_for_level(skills[0][Mods.Expbar.set_skill].level + 1) - Level.xp_for_level(skills[0][Mods.Expbar.set_skill].level))
          , b = e - b
          , f = (Math.floor(b / e * 1E4) / 100).toFixed(2)
          , g = Mods.fontSize[0]
          , k = getElem("player_healthbar").style.left
          , m = getElem("player_healthbar").style.width;
        localStorage.expSkillSet = Mods.Expbar.set_skill;
        getElem("player_xp_name").innerHTML = skills[0][Mods.Expbar.set_skill].level + " " + capitaliseFirstLetter(Mods.Expbar.set_skill) + ": " + b + " / " + e + " (" + f + "%)";
        getElem("player_xp_bar_front").style.width = f + "%";
        getElem("player_xp_name").style.fontSize = g;
        getElem("player_xp_bar").style.left = k;
        getElem("player_xp_bar").style.width = m
    }
    ;
    Mods.Expbar.socketOn = {
        actions: ["skills"],
        fn: function() {
            Mods.Expbar.updateExpInfo()
        }
    };
    Mods.Expbar.setCanvasSize = function() {
        getElem("magic_slots").style.top = Math.ceil(127 * current_ratio_y) + "px";
        Mods.Expbar.updateExpInfo()
    }
    ;
    (function() {
        createElem("div", wrapper, {
            id: "player_xp_bar",
            className: "xp_bar",
            style: "position: absolute; top: 0%; left: 0%; width: 100%; height: 2.8%; z-index: 9999;",
            title: "Go to the Skills menu and click a skill to set this bar's watched skill.",
            innerHTML: '<div id="player_xp_bar_back" class="xp_bar_back" style="position: absolute; width: 100.3%; height: 100%; background: #000; top: 0%; left: 0%; opacity: 0.4;"></div><div id="player_xp_bar_front" class="xp_bar_front" style="position: absolute; width: 20%; height: 100%; top: 0%; left: 0.3%; background: -moz-linear-gradient(top,  rgb(0, 184, 192) 0%,rgb(2, 49, 71) 50%,rgb(0, 46, 60) 51%,rgb(0, 21, 44) 100%); background: -webkit-linear-gradient(top,  rgb(0, 184, 192) 0%,rgb(2, 49, 71) 50%,rgb(0, 46, 60) 51%,rgb(0, 21, 44) 100%); background: -o-linear-gradient(top,  rgb(0, 184, 192) 0%,rgb(2, 49, 71) 50%,rgb(0, 46, 60) 51%,rgb(0, 21, 44) 100%); background: -ms-linear-gradient(top,  rgb(0, 184, 192) 0%,rgb(2, 49, 71) 50%,rgb(0, 46, 60) 51%,rgb(0, 21, 44) 100%); background: linear-gradient(top,  rgb(0, 184, 192) 0%,rgb(2, 49, 71) 50%,rgb(0, 46, 60) 51%,rgb(0, 21, 44) 100%); filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=\'#bfd255\', endColorstr=\'#9ecb2d\',GradientType=0 )">    <div id="player_xp_name" class="xp_name" style="font-size: .8em; padding-top: 1px; color: #FFF; position: absolute; hight: inherit; top: inherit; left: 5px; white-space: nowrap;">40 Strength: 20,000 / 100,000 (20%)    </div></div>'
        });
        for (var b in skills[0])
            getElem("skill_" + b).parentElement.onclick = new Function("Mods.Expbar.set_skill = '" + b + "';Mods.Expbar.updateExpInfo();");
        Mods.Expbar.updateExpInfo();
        getElem("magic_slots").style.right = "";
        getElem("magic_slots").style.left = "2px";
        setCanvasSize()
    })();
    Mods.timestamp("expbar")
}
;
Load.fullscreen = function() {
    modOptions.fullscreen.time = timestamp();
    Mods.Fullscreen.toggle = function() {
        var b = getElem("settings_fullscreen")
          , e = getElem("settings_game_grid");
        switch (Mods.Fullscreen.enabled) {
        case 0:
            b.innerHTML = "Fullscreen Mode (off)";
            Mods.Fullscreen.enabled = 1;
            e.onclick = function() {
                toggleGridSize()
            }
            ;
            e.style.color = "";
            fullscreen_mode = !1;
            c.base.width = width;
            map_increase = 4;
            break;
        default:
            b.innerHTML = "Fullscreen Mode (on)<br/><span style='color:red;font-size:10px;'>WARNING: May impact game performance.</span>",
            Mods.Fullscreen.enabled = 0,
            e.onclick = "",
            e.style.color = "#AAA",
            map_increase = 6,
            experimental_fullscreen && (large_offscreen_canvas_width = width + 2 * tile_width,
            c.base.width = large_offscreen_canvas_width,
            renderGround(),
            fullscreen_mode = !0)
        }
        localStorage.fullscreenenabled = JSON.stringify(Mods.Fullscreen.enabled);
        resetMapShift();
        drawMap();
        setCanvasSize(!0)
    }
    ;
    iMapBegin = function() {
        return 0 == Mods.Fullscreen.enabled ? -6 : Mods.Fullscreen.iMapBegin()
    }
    ;
    jMapBegin = function() {
        return 0 == Mods.Fullscreen.enabled ? -9 : Mods.Fullscreen.jMapBegin()
    }
    ;
    iMapTo = function() {
        return 0 == Mods.Fullscreen.enabled ? minimap ? 99 : 24 : Mods.Fullscreen.iMapTo()
    }
    ;
    jMapTo = function() {
        return 0 == Mods.Fullscreen.enabled ? minimap ? 99 : 21 : Mods.Fullscreen.jMapTo()
    }
    ;
    astar.search = function(b, e, f, g, k) {
        return 0 == Mods.Fullscreen.enabled ? Mods.Fullscreen.astarsearchNew(b, e, f, g, k) : Mods.Fullscreen.astarsearchOld(b, e, f, g, k)
    }
    ;
    Mods.Fullscreen.astarsearchNew = function(b, e, f, g, k) {
        var m;
        m = 6 == map_increase ? 15 : 5 + map_increase / 2;
        astar.init(b, e, m + 1);
        k = k || astar.manhattan;
        g = !!g;
        var n = astar.heap();
        for (n.push(e); 0 < n.size(); ) {
            var p = n.pop();
            if (p === f) {
                b = p;
                for (e = []; b.parent; )
                    e.push(b),
                    b = b.parent;
                return e.reverse()
            }
            p.closed = !0;
            for (var r = astar.neighbors(b, p, g, e, m), t = 0, q = r.length; t < q; t++) {
                var u = r[t];
                if (!u.closed && !u.isWall()) {
                    var x = p.g + u.cost
                      , y = u.visited;
                    if (!y || x < u.g)
                        u.visited = !0,
                        u.parent = p,
                        u.h = u.h || k(u.pos, f.pos),
                        u.g = x,
                        u.f = u.g + u.h,
                        y ? n.rescoreElement(u) : n.push(u)
                }
            }
        }
        return []
    }
    ;
    createElem("div", "options_video", {
        innerHTML: "<span class='wide_link pointer' id='settings_fullscreen' onclick='Mods.Fullscreen.toggle();'>Fullscreen Mode (off)</span>"
    });
    getElem("my_text").style.zIndex = "90";
    Mods.Fullscreen.toggle();
    Mods.timestamp("fullscreen")
}
;
Load.autocast = function() {
    modOptions.autocast.time = timestamp();
    Mods.Autocast.toggle = function() {
        var b = getElem("settings_autocast");
        switch (Mods.Autocast.enabled) {
        case 0:
            b.innerHTML = "Autocast (off)";
            Mods.Autocast.enabled = 1;
            break;
        default:
            b.innerHTML = "Autocast (on)",
            Mods.Autocast.enabled = 0
        }
        localStorage.autocastenabled = JSON.stringify(Mods.Autocast.enabled)
    }
    ;
    Mods.Autocast.socketOn = {
        actions: ["attack"],
        fn: function(b, e, f) {
            0 == Mods.Autocast.enabled && 0 < players[0].params.magic_slots && "attack" === b && ("0" != f.defender && "0" != f.attacker || setTimeout(function() {
                Mods.Autocast.TryCast()
            }, 175))
        }
    };
    Mods.Autocast.TryCast = function() {
        if (inAFight && 0 == Mods.Autocast.enabled) {
            for (var b = 0; b < players[0].params.magic_slots; b++)
                players[0].params.magics[b] && players[0].params.magics[b].ready && Player.client_use_magic(b);
            Mods.Autocast.lastFullCast = timestamp();
            setTimeout(function() {
                Mods.Autocast.TryCast()
            }, 190)
        }
    }
    ;
    createElem("div", "options_game", {
        innerHTML: "<span class='wide_link pointer' id='settings_autocast' onclick='Mods.Autocast.toggle();'>Autocast (off)</span>"
    });
    Mods.Autocast.toggle();
    Mods.timestamp("autocast")
}
;
Load.expmonitor = function() {
    modOptions.expmonitor.time = timestamp();
    Mods.Expmonitor.socketOn = {
        actions: ["message", "login"],
        fn: function(b, e, f) {
            if ("message" == b && e.message && e.color === COLOR.TEAL && "whisper" != e.type) {
                var g = -1
                  , k = timestamp()
                  , m = ["Current experience rate is 1x", "Event not running or time unknown", "Current experience rate is 2x", "Time left: "];
                for (i in m)
                    if (0 === e.message.indexOf(m[i])) {
                        g = Number(i);
                        break
                    }
                switch (g) {
                case 0:
                case 1:
                    Mods.Expmonitor.XPEventSeconds = 0;
                    break;
                case 2:
                    5E3 < k - Mods.Expmonitor.LastLogin && 5E3 < k - Mods.Expmonitor.LastXpRequest ? (Mods.Expmonitor.XPEventSeconds = Mods.Expmonitor.XPEventSeconds < k ? k : Mods.Expmonitor.XPEventSeconds,
                    Mods.Expmonitor.XPEventSeconds += 18E5) : (Mods.Expmonitor.LastXpRequest = timestamp(),
                    Socket.send("message", {
                        data: "/xp"
                    }));
                    break;
                case 3:
                    e = e.message.match(/Time left: (\d+\.\d+)\s*minute/);
                    0 < e.length && 60 < Math.abs(60 * e[1] - Mods.Expmonitor.XPEventSeconds) && (Mods.Expmonitor.XPEventSeconds = k + 1E3 * Math.round(60 * e[1]));
                    break;
                default:
                    return
                }
                Mods.Expmonitor.XPEventSeconds > k && "hidden" === getElem("xp_timer_holder").style.visibility && (getElem("xp_timer").innerHTML = "Calculating",
                getElem("xp_timer_holder").style.visibility = "visible",
                Mods.Expmonitor.Timer())
            }
            "login" == b && "ok" == f.status && (Mods.Expmonitor.LastLogin = timestamp())
        }
    };
    Mods.Expmonitor.Timer = function() {
        var b = Math.round((Mods.Expmonitor.XPEventSeconds - timestamp()) / 1E3);
        0 < b ? (getElem("xp_timer").innerHTML = String(b).toHHMMSS(),
        Timers.set("check_2x", function() {
            Mods.Expmonitor.Timer()
        }, 1E3)) : getElem("xp_timer_holder").style.visibility = "hidden"
    }
    ;
    Mods.Expmonitor.refreshHUD = function() {
        Mods.Expmonitor.setCanvasSize()
    }
    ;
    Mods.Expmonitor.setCanvasSize = function() {
        var b = 3
          , e = bigIcons ? 64 : 32;
        (16 * current_ratio_y).toFixed(2);
        var b = b + (players[0].pet.enabled ? 1 : 0)
          , b = b + (300 == players[0].map || 16 == players[0].map ? 1 : 0)
          , f = getElem("xp_timer_holder");
        f.style.right = Math.round((e * b + 4) * current_ratio_x) + "px";
        f.style.top = 23 * current_ratio_y + "px"
    }
    ;
    "Name" != players[0].name && (Mods.Expmonitor.LastXpRequest = timestamp(),
    Socket.send("message", {
        data: "/xp",
        lang: getElem("current_channel").value
    }));
    showCaptchaBonus = function() {
        document.getElementById("captcha_bonus_assign").style.display = "block";
        document.getElementById("penalty_points_bonus").innerHTML = -players[0].params.penalty;
        removeClass(document.getElementById("penalty_points_bonus"), "green");
        removeClass(document.getElementById("penalty_points_bonus"), "red");
        removeClass(document.getElementById("penalty_points_bonus"), "orange");
        addClass(document.getElementById("captcha_red"), "hidden");
        addClass(document.getElementById("captcha_green"), "hidden");
        if (0 < players[0].params.penalty)
            addClass(document.getElementById("penalty_points_bonus"), "red"),
            removeClass(document.getElementById("captcha_red"), "hidden"),
            document.getElementById("penalty_bonus_points").value = 0;
        else {
            5 == -players[0].params.penalty ? addClass(document.getElementById("penalty_points_bonus"), "orange") : addClass(document.getElementById("penalty_points_bonus"), "green");
            removeClass(document.getElementById("captcha_green"), "hidden");
            document.getElementById("captcha_green").innerHTML = "* Assign points to get experience";
            var b = 0;
            "undefined" !== typeof Mods && "undefined" !== typeof Mods.Expmonitor && "undefined" !== typeof Mods.Expmonitor.XPEventSeconds && 0 < Mods.Expmonitor.XPEventSeconds ? b = -players[0].params.penalty : 0 < -players[0].params.penalty && (b = 1);
            document.getElementById("penalty_bonus_points").value = b
        }
    }
    ;
    createElem("div", wrapper, {
        id: "xp_timer_holder",
        style: "visibility: hidden;",
        innerHTML: ""
    });
    createElem("div", xp_timer_holder, {
        id: "xp_label",
        innerHTML: "<span>2x</span><span style='font-size: 0.7em;'>exp</span>"
    });
    createElem("div", xp_timer_holder, {
        id: "xp_timer",
        innerHTML: ""
    });
    Mods.timestamp("expmonitor")
}
;
Load.kbind = function() {
    modOptions.kbind.time = timestamp();
    Mods.Kbind.Init = function() {
        for (var b = Mods.Kbind.AKbind, e = 0; e < b.length; e++)
            getElem("kbinding_" + e).checked ? (b[e].value = getElem("kbind_" + e).value,
            b[e].enabled = !0) : (b[e].value = 0,
            b[e].enabled = !1);
        localStorage.AKbind = JSON.stringify(b)
    }
    ;
    Mods.Kbind.CastAll = function() {
        if (inAFight && 150 < timestamp() - Mods.Autocast.lastFullCast && GAME_STATE != GAME_STATES.CHAT) {
            for (var b = 0; b < players[0].params.magic_slots; b++)
                players[0].params.magics[b] && players[0].params.magics[b].ready && Player.client_use_magic(b);
            Mods.Autocast.lastFullCast = timestamp()
        }
    }
    ;
    Mods.blockKbind = !1;
    Mods.Kbind.Process = function(b, e) {
        var f = Mods.Kbind.AKbind
          , g = document.activeElement && ("number" == document.activeElement.type || "text" == document.activeElement.type);
        if (GAME_STATE != GAME_STATES.CHAT && !g && hasClass(getElem("market"), "hidden") && !captcha && !Mods.blockKbind) {
            f[0].enabled && e == f[0].value && !players[0].temp.busy && Chest.deposit_all();
            f[1].enabled && e == f[1].value && !players[0].temp.busy && Mods.Petinv.unload();
            if (f[2].enabled && e == f[2].value && inAFight && 150 < timestamp() - Mods.Autocast.lastFullCast) {
                for (g = 0; g < players[0].params.magic_slots; g++)
                    players[0].params.magics[g].ready && Player.client_use_magic(g);
                Mods.Autocast.lastFullCast = timestamp()
            }
            f[3].enabled && e == f[3].value && inAFight && 150 < timestamp() - lastRunAwayAttempt && Socket.send("run_from_fight", {});
            lastRunAwayAttempt = timestamp();
            f[4].enabled && e == f[4].value && !players[0].temp.busy && Mods.Kbind.DestroyResource();
            f[5].enabled && e == f[5].value && !players[0].temp.busy && Mods.Petinv.load();
            f[6].enabled && e == f[6].value && !players[0].temp.busy && Mods.Kbind.eatfood();
            f[7].enabled && e == f[7].value && (getElem("inventory").style.zIndex = "199",
            Mods.showBag = !Mods.showBag.valueOf(),
            Mods.showBag ? getElem("inventory").style.display = "block" : getElem("inventory").style.display = "");
            if (f[8].enabled && e == f[8].value && (f = getElem("chest"),
            !hasClass(f, "hidden"))) {
                f = 60 * (parseInt(chest_page) - 1) + parseInt(selected_chest);
                f = item_base[chests[0][f].id];
                g = f.params;
                b = f.b_t;
                var k = !1;
                (g.min_cooking || g.min_forging || g.min_jewelry || g.min_alchemy || g.min_farming || -1 < f.name.indexOf("Enchant Scroll") || 1 < g.min_magic && 5 != b && 0 != b && -1 == f.name.indexOf("Teleport") || 1 == b) && 4 != b && 14 != g.slot && (k = !0);
                k && Chest.withdraw(99);
                !k && Chest.withdraw(1)
            }
        }
    }
    ;
    Mods.Kbind.eatfood = function() {
        if (GAME_STATE != GAME_STATES.CHAT && skills[0].health.level > skills[0].health.current && 250 < timestamp() - Mods.Kbind.lastfoodeaten) {
            for (var b = !1, e = 0; e < players[0].temp.inventory.length; e++)
                if ("undefined" != typeof item_base[players[0].temp.inventory[e].id].params.heal) {
                    b = left_click_cancel ? !0 : !1;
                    left_click_cancel = !1;
                    inventoryClick(e) && (Mods.Kbind.lastfoodeaten = timestamp());
                    left_click_cancel = b;
                    b = !0;
                    break
                }
            b || addChatText("You have no food in inventory!", void 0, COLOR.WHITE)
        }
    }
    ;
    Mods.Kbind.ResourceList = {
        ores: [30, 31, 32, 33, 184, 185, 186, 373, 383, 484, 657, 1447, 1887],
        logs: [29, 296, 313, 314, 594, 595, 597, 2129, 2130]
    };
    Mods.Kbind.DestroyResource = function(b) {
        if (GAME_STATE != GAME_STATES.CHAT && (b = b || !1,
        0 != b.length))
            if (b) {
                var e = b.shift();
                Popup.prompt("Do you want to destroy all " + e + " in your bag?", function() {
                    Mods.Kbind.destroyCycle(e);
                    Mods.Kbind.DestroyResource(b)
                }, function() {
                    Mods.Kbind.DestroyResource(b)
                })
            } else {
                var f = []
                  , g = players[0].temp.inventory;
                for (i in g) {
                    var k = parseInt(g[i].id);
                    for (z in Mods.Kbind.ResourceList) {
                        if (-1 != f.indexOf(z))
                            break;
                        if (-1 != Mods.Kbind.ResourceList[z].indexOf(k)) {
                            f.push(z);
                            break
                        }
                    }
                }
                0 < f.length && Mods.Kbind.DestroyResource(f)
            }
    }
    ;
    Mods.Kbind.destroyCycle = function(b) {
        if ("undefined" != typeof b) {
            var e = players[0].temp.inventory;
            for (i in e) {
                var f = parseInt(e[i].id);
                Mods.Kbind.ResourceList[b] && -1 != Mods.Kbind.ResourceList[b].indexOf(f) && Mods.Kbind.destroyItem(f, 50 + 50 * i)
            }
        }
    }
    ;
    Mods.Kbind.destroyItem = function(b, e) {
        "undefined" != typeof b && Timers.set("destroy_cycle_" + b, function() {
            Socket.send("inventory_destroy", {
                item_id: b,
                all: !0
            })
        }, e || 50)
    }
    ;
    Mods.Kbind.eventListener = {
        keys: {
            keyup: [!0]
        },
        fn: function(b, e) {
            Mods.Kbind.Process(b, e)
        }
    };
    (function() {
        Mods.Kbind.AKbind = [{
            value: 0,
            enabled: !1
        }, {
            value: 0,
            enabled: !1
        }, {
            value: 0,
            enabled: !1
        }, {
            value: 0,
            enabled: !1
        }, {
            value: 0,
            enabled: !1
        }, {
            value: 0,
            enabled: !1
        }, {
            value: 0,
            enabled: !1
        }, {
            value: 66,
            enabled: !0
        }, {
            value: 0,
            enabled: !1
        }];
        keylist = {
            0: "<option value=0>(none)</option><option value=8>[BackSpace]</option><option value=9>[Tab]</option><option value=13>[Enter]</option><option value=27>[Esc]</option><option value=33>[PgUp]</option><option value=34>[PgDwn]</option><option value=35>[End]</option><option value=36>[Home]</option><option value=45>[Ins]</option><option value=46>[Delete]</option><option value=66>B</option><option value=67>C</option><option value=69>E</option><option value=70>F</option><option value=71>G</option><option value=72>H</option><option value=73>I</option><option value=74>J</option><option value=75>K</option><option value=76>L</option><option value=77>M</option><option value=78>N</option><option value=79>O</option><option value=80>P</option><option value=81>Q</option><option value=82>R</option><option value=84>T</option><option value=85>U</option><option value=86>V</option><option value=88>X</option><option value=89>Y</option><option value=90>Z</option><option value=96>[Numpad0]</option><option value=97>[Numpad1]</option><option value=98>[Numpad2]</option><option value=99>[Numpad3]</option><option value=100>[Numpad4]</option><option value=101>[Numpad5]</option><option value=102>[Numpad6]</option><option value=103>[Numpad7]</option><option value=104>[Numpad8]</option><option value=105>[Numpad9]</option>"
        };
        createElem("div", wrapper, {
            id: "keybinding_form",
            className: "menu",
            style: "position: absolute; display: none; z-index: 300; width: 330px; height: 245px; top: 50%; left: 50%; margin-left: -115px; margin-top: -122px;",
            innerHTML: "<span class='common_border_bottom'><span style='float:left; font-weight: bold;color:#FFFF00;'>Keybindings</span><span class='common_link' style='margin:0px;margin-bottom:2px;' onclick='javascript:Mods.Kbind.Init();getElem(\"keybinding_form\").style.display=\"none\";'>Close</span></span><div style='padding-top: 8px;'><table width='100%'><tr><td><input type='checkbox' id='kbinding_0' onclick='void(0);'></td><td><select id='kbind_0' class='market_select'>" + keylist[0] + "</select></td><td>Deposit All+ in chest</td></tr><tr><td><input type='checkbox' id='kbinding_1' onclick='void(0);'></td><td><select id='kbind_1' class='market_select'>" + keylist[0] + "</select></td><td>Unload pet inventory</td></tr><tr><td><input type='checkbox' id='kbinding_5' onclick='void(0);'></td><td><select id='kbind_5' class='market_select'>" + keylist[0] + "</select></td><td>Load pet inventory</td></tr><tr><td><input type='checkbox' id='kbinding_2' onclick='void(0);'></td><td><select id='kbind_2' class='market_select'>" + keylist[0] + "</select></td><td>Cast all magic.</td></tr><tr><td><input type='checkbox' id='kbinding_3' onclick='void(0);'></td><td><select id='kbind_3' class='market_select'>" + keylist[0] + "</select></td><td>Run from fight</td></tr><tr><td><input type='checkbox' id='kbinding_4' onclick='void(0);'></td><td><select id='kbind_4' class='market_select'>" + keylist[0] + "</select></td><td>Destroy all ores/logs in bag</td></tr><tr><td><input type='checkbox' id='kbinding_6' onclick='void(0);'></td><td><select id='kbind_6' class='market_select'>" + keylist[0] + "</select></td><td>Eat food in inventory</td></tr><tr><td><input type='checkbox' id='kbinding_7' onclick='void(0);'></td><td><select id='kbind_7' class='market_select'>" + keylist[0] + "</select></td><td>Toggle inventory</td></tr><tr><td><input type='checkbox' id='kbinding_8' onclick='void(0);'></td><td><select id='kbind_8' class='market_select'>" + keylist[0] + "</select></td><td>Withdraw 1 or All</td></tr></table></div>"
        });
        var b = Mods.Kbind.AKbind;
        localStorage.AKbind = localStorage.AKbind || JSON.stringify(b);
        for (var e = JSON.parse(localStorage.AKbind), f = 0; f < b.length; f++)
            e[f] = void 0 != e[f] ? e[f] : b[f];
        b = Mods.Kbind.AKbind = e;
        localStorage.AKbind = JSON.stringify(b);
        for (e = 0; e < b.length; e++)
            getElem("kbinding_" + e).checked = b[e].enabled,
            getElem("kbind_" + e).value = b[e].value;
        b = document.createElement("span");
        b.className = "wide_link";
        b.id = "keybinding_link";
        b.style.cssFloat = "left";
        b.onclick = function() {
            getElem("keybinding_form").style.display = "block"
        }
        ;
        b.innerHTML = "Keybindings";
        e = getElem("mods_link");
        getElem("settings").insertBefore(b, e);
        Mods.Kbind.Init();
        CompiledTemplate.magic_slots = Handlebars.compile("{{#each this.magics}}<div class='magic_outer pointer' style='{{magic_image this.id}};'><div class='magic_inner' id='magic_slot_{{this.i}}' onclick='Player.client_use_magic({{this.i}})' onmouseover='mouseOverMagic({{this.i}})' onmouseout='mouseOutMagic({{this.i}})'>{{this.count}}</div></div>{{/each}}<div class='magic_outer'><div class='magic_inner pointer' style='font-size:10px;text-align: center;background-color: rgba(0, 0, 0, 0.8);font-family:initial;' id='magic_slot_all' onclick='Mods.Kbind.CastAll()'>Cast All</div></div>")
    })();
    Mods.timestamp("kbind")
}
;
Load.petinv = function() {
    modOptions.petinv.time = timestamp();
    Mods.Petinv.invHeight = function() {
        var b = getElem("inventory");
        if (players[0].pet.enabled)
            var e = pets[players[0].pet.id].params.inventory_slots;
        var f = getElem("inv_pet_settings")
          , g = getElem("pet_inv_expand")
          , k = getElem("pet_inv_unload")
          , m = getElem("pet_inv_load");
        if (!players[0].pet.enabled)
            for (b.style.paddingBottom = "2px",
            addClass(f, "hidden"),
            addClass(g, "hidden"),
            addClass(k, "hidden"),
            addClass(m, "hidden"),
            getElem("inv_pet_chest").style.borderTop = "",
            getElem("shift_click").style.display = "none",
            getElem("inv_checkbox").style.display = "none",
            b = 0; 16 > b; b++)
                getElem("inv_pet_chest_" + b).style.display = "none";
        else if (players[0].pet.enabled && Mods.Petinv.petInv_toggle)
            getElem("shift_click").style.display = "block",
            getElem("inv_checkbox").style.display = "block",
            g.innerHTML = "Pet's chest <span style='color:grey;font-size:80%;vertical-align:middle;'>(click to close)</span><br>",
            getElem("inv_pet_chest").style.borderTop = "1px solid #666666",
            Mods.Petinv.init_menuInv(),
            9 > e && players[0].pet.enabled && Mods.Petinv.petInv_toggle ? (b.style.paddingBottom = "76px",
            f.style.top = "258px",
            removeClass(f, "hidden"),
            removeClass(g, "hidden"),
            removeClass(m, "hidden"),
            removeClass(k, "hidden")) : 8 < e && players[0].pet.enabled && Mods.Petinv.petInv_toggle && (b.style.paddingBottom = "114px",
            f.style.top = "297px",
            removeClass(f, "hidden"),
            removeClass(g, "hidden"),
            removeClass(m, "hidden"),
            removeClass(k, "hidden"));
        else if (players[0].pet.enabled && !Mods.Petinv.petInv_toggle) {
            getElem("shift_click").style.display = "none";
            getElem("inv_checkbox").style.display = "none";
            b.style.paddingBottom = "23px";
            addClass(f, "hidden");
            removeClass(g, "hidden");
            removeClass(k, "hidden");
            removeClass(m, "hidden");
            getElem("inv_pet_chest").style.borderTop = "1px solid #666666";
            for (b = 0; 16 > b; b++)
                getElem("inv_pet_chest_" + b).style.display = "none";
            g.innerHTML = "Pet's chest <span style='color:grey;font-size:80%;vertical-align:middle;'>(click to expand)</span><br>"
        }
    }
    ;
    Mods.Petinv.spawnInvPetChest = function() {
        for (a = 0; 16 > a; a++)
            createElem("div", "inv_pet_chest", {
                id: "inv_pet_chest_" + a,
                className: "inv_item",
                innerHTML: "&nbsp;"
            })
    }
    ;
    Mods.Petinv.init_menuInv = function() {
        for (var b = 0; 16 > b; b++)
            players[0].pet.enabled ? getElem("inv_pet_chest_" + b).style.display = pets[players[0].pet.id].params.inventory_slots > b ? "inline-block" : "none" : getElem("inv_pet_chest_" + b).style.display = "none";
        if (players[0].pet.enabled) {
            for (b = 0; b < pets[players[0].pet.id].params.inventory_slots; b++) {
                var e = getElem("inv_pet_chest_" + b);
                removeClass(e, "selected");
                if ("undefined" != typeof players[0].pet.chest[b]) {
                    var f = item_base[players[0].pet.chest[b]];
                    e.style.background = Items.get_background(f.b_i)
                } else
                    e.style.background = ""
            }
            b = pets[players[0].pet.id];
            b = b.params.xp_required ? "Pet experience " + Math.round(players[0].pet.xp) + " / " + b.params.xp_required + " (" + Math.round(players[0].pet.xp / b.params.xp_required * 100) + "%)" : b.params.requires_stone ? "Pet needs Stone of Evolution to evolve." : "Pet has reached its maximum level.";
            getElem("inv_pet_settings").innerHTML = b
        }
        for (b = 0; 40 > b; b++)
            e = getElem("inv_" + b),
            "undefined" != typeof players[0].temp.inventory[b] ? (f = item_base[players[0].temp.inventory[b].id],
            e.style.background = Items.get_background(f.b_i)) : e.style.background = ""
    }
    ;
    Mods.Petinv.invSendItemCheck = function(b) {
        enableShiftClick = getElem("shift_click").checked;
        return 0 == Mods.Petinv.petInv_toggle || 0 == players[0].pet.enabled ? !1 : 1 == b && 1 == enableShiftClick || 0 == b && 0 == enableShiftClick ? !0 : !1
    }
    ;
    Mods.Petinv.createFunc = function(b) {
        return function(e) {
            Mods.disableInvClick || (Mods.Petinv.invSendItemCheck(e.shiftKey) ? Pet.menu_add(b) : (inventoryClick(b),
            left_click_cancel = !0))
        }
    }
    ;
    Mods.Petinv.socketOn = {
        actions: ["my_pet_data", "skills"],
        fn: function(b, e) {
            if ("my_pet_data" == b || "skills" == b)
                Mods.Petinv.init_menuInv(),
                Mods.Petinv.invHeight()
        }
    };
    Mods.Petinv.unload = function(b) {
        Pet.menu_unload()
    }
    ;
    Mods.Petinv.load = function(b) {
        Pet.menu_load()
    }
    ;
    (function() {
        getElem("inventory").style.paddingBottom = "114px";
        createElem("div", "inventory", {
            id: "inv_pet_chest",
            style: "border-top: 1px solid #666; position: absolute; top: 203px; padding-top: 2px; width: 288px; margin-bottom: 17px; color #FF0; display: block;"
        });
        createElem("div", "inventory", {
            id: "inv_pet_settings",
            style: "position: absolute; top: 297px; text-size: 80%;",
            innerHTML: "Pet has reached its maximum level."
        });
        createElem("div", "inv_pet_chest", {
            id: "pet_inv_expand",
            style: "height: 17px; width: 265px; top: 0px; vertical-align: middle;",
            innerHTML: "Pet's chest <span style='color:grey;font-size:80%;vertical-align:middle;'>(click to close)</span><br>"
        });
        createElem("input", "inv_pet_chest", {
            id: "shift_click",
            type: "checkbox",
            style: "position: absolute; right: 0px; top: 0px;"
        });
        createElem("div", "inv_pet_chest", {
            id: "inv_checkbox",
            title: "When set to (send items), hold Shift and click items in your inventory to send them to your pet chest.\nRegular click uses/equips the items. Toggle to (use items) to reverse this functionality.",
            style: "position: absolute; right: 21px; top: 4px; font-size: .8em; color: grey;",
            innerHTML: "use items = shift+click"
        });
        createElem("span", "inventory", {
            id: "pet_inv_load",
            className: "common_link",
            style: "color: #999; font-size: .8em; font-weight: normal; margin: 0px; padding: 0px 5px 2px 0px; position: absolute; bottom: 0%; right: 42px;",
            innerHTML: "(load)",
            onclick: "Mods.Petinv.load()"
        });
        createElem("span", "inventory", {
            id: "pet_inv_unload",
            className: "common_link",
            style: "color: #999; font-size: .8em; font-weight: normal; margin: 0px; padding: 0px 5px 2px 0px; position: absolute; bottom: 0%; right: 0%;",
            innerHTML: "(unload)",
            onclick: "Mods.Petinv.unload()"
        });
        Mods.Petinv.spawnInvPetChest();
        getElem("shift_click").checked = Mods.Petinv.enableShiftClick_check;
        for (a = 0; 40 > a; a++)
            getElem("inv_" + a).onclick = Mods.Petinv.createFunc(a);
        for (a = 0; 16 > a; a++)
            getElem("inv_pet_chest_" + a).onclick = function(b) {
                return function() {
                    Pet.menu_remove(b)
                }
            }(a);
        getElem("pet_inv_expand").onclick = new Function("Mods.Petinv.petInv_toggle = !Mods.Petinv.petInv_toggle;Mods.Petinv.invHeight();");
        Mods.Petinv.invHeight();
        Mods.Petinv.init_menuInv();
        Mods.Petinv.enableShiftClick_check ? (getElem("inv_checkbox").innerHTML = "send items = shift+click",
        getElem("shift_click").checked = !0) : (getElem("inv_checkbox").innerHTML = "use items = shift+click",
        getElem("shift_click").checked = !1);
        getElem("shift_click").onclick = function() {
            Mods.Petinv.enableShiftClick_check = !Mods.Petinv.enableShiftClick_check;
            (localStorage.enableShiftClick = Mods.Petinv.enableShiftClick_check) ? getElem("inv_checkbox").innerHTML = "send items = shift+click" : getElem("inv_checkbox").innerHTML = "use items = shift+click"
        }
    })();
    Mods.timestamp("petinv")
}
;
Load.magicm = function() {
    modOptions.magicm.time = timestamp();
    Mods.Magicm.socketOn = {
        actions: ["message"],
        fn: function(b, e, f) {
            e.color == COLOR.GREEN && -1 < e.message.search("magic damage") && (b = e.message.substr(1, e.message.search(" magic") - 1),
            /locked/.test(b) || Mods.Magicm.show_magic_damage(b))
        }
    };
    Mods.Magicm.show_magic_damage = function(b) {
        var e = getElem("enemy_hit").cloneNode(!0)
          , f = Mods.Magicm.enemy
          , g = Mods.Magicm.magic_damage_timers
          , k = 0 == g[0] ? 0 : 0 == g[1] ? 1 : 0 == g[2] ? 2 : 0 == g[3] ? 3 : g[0] <= g[1] ? 0 : g[1] <= g[2] ? 1 : g[2] <= g[3] ? 2 : 3
          , m = 0 == k || 2 == k ? (k / 2 * -1 - .5) * half_tile_width_round : k / 2 * half_tile_width_round
          , n = -2 * half_tile_height_round
          , p = players[0].temp.target_id
          , p = objects_data[p] || players[p];
        f != p && (f = Mods.Magicm.magic_damage_timers,
        f[0] = f[1] = f[2] = f[3] = 0,
        f = Mods.Magicm.enemy = p);
        f && (p = translateTileToCoordinates(f.i, f.j),
        translateTileToCoordinates(dx, dy),
        e.id = "magic_" + k + f.id + (new Date).getTime(),
        removeClass(e, "hidden"),
        e.innerHTML = getElem("enemy_hit").innerHTML,
        e.childNodes[1].innerHTML = b,
        wrapper.appendChild(e),
        e.style.left = (p.x + 16 + players[0].mx + m) * current_ratio_x + "px",
        e.style.top = (p.y - 40 + players[0].my + n) * current_ratio_y + "px",
        addClass(e, "opacity_100"),
        g[k] = 100,
        setTimeout(function() {
            decreaseOpacity(e, 150, 10);
            Mods.Magicm.decreaseMagic(k, 150, 10)
        }, 150))
    }
    ;
    Mods.Magicm.decreaseMagic = function(b, e, f) {
        0 < Mods.Magicm.magic_damage_timers[b] && (Mods.Magicm.magic_damage_timers[b] = Math.max(Mods.Magicm.magic_damage_timers[b] - f, 0),
        setTimeout(function() {
            Mods.Magicm.decreaseMagic(b, e, f)
        }, e))
    }
    ;
    Mods.timestamp("magicm")
}
;
Load.wikimd = function() {
    modOptions.wikimd.time = timestamp();
    Mods.Wikimd.populate_item_formulas = function() {
        var b = [];
        Mods.Wikimd.item_formulas = {};
        for (var e in item_base) {
            var f = item_base[e]
              , g = f.b_i
              , k = ITEM_CATEGORY[f.b_t]
              , m = f.name
              , n = f.params
              , p = f.temp
              , r = f.img
              , t = Mods.Wikimd.item_slots[n.slot] || "none"
              , q = thousandSeperate(n.price)
              , u = "none"
              , x = "none"
              , f = n.enchant_id
              , y = 10 == n.slot ? Magic[n.magic].params : !1
              , A = n.farming_id || !1;
            "L.Hand" == t && 3 == n.disable_slot && (t = "2 Hands");
            for (var B in skills[0])
                "undefined" != typeof n["min_" + B] && (u = capitaliseFirstLetter(B),
                x = item_base[e].params["min_" + B]);
            "undefined" != typeof n.heal && (u = "Food",
            x = n.heal);
            Mods.Wikimd.item_formulas[g] = Mods.Wikimd.item_formulas[g] || {};
            Mods.Wikimd.item_formulas[g].id = g;
            Mods.Wikimd.item_formulas[g].type = k;
            Mods.Wikimd.item_formulas[g].name = m;
            Mods.Wikimd.item_formulas[g].params = n;
            Mods.Wikimd.item_formulas[g].temp = p;
            Mods.Wikimd.item_formulas[g].img = r;
            Mods.Wikimd.item_formulas[g].skill = u;
            Mods.Wikimd.item_formulas[g].level = x;
            Mods.Wikimd.item_formulas[g].slot = t;
            Mods.Wikimd.item_formulas[g].price = q;
            f && (Mods.Wikimd.item_formulas[g].enchant = Mods.Wikimd.item_formulas[g].enchant || {},
            Mods.Wikimd.item_formulas[g].enchant.to_enchant = f,
            u = n.min_accuracy ? Forge.enchantingChancesWeapon : n.min_defense ? Forge.enchantingChancesArmor : Forge.enchantingChancesJewelry,
            Mods.Wikimd.item_formulas[g].enchant.low = Math.min(1, (n.enchant_bonus || 0) + (u[176] && u[176](x) || u[64] && u[64](x) || u[1125] && u[1125](x) || 0)),
            Mods.Wikimd.item_formulas[g].enchant.med = Math.min(1, (n.enchant_bonus || 0) + (u[177] && u[177](x) || u[173] && u[173](x) || u[1126] && u[1126](x) || 0)),
            Mods.Wikimd.item_formulas[g].enchant.high = Math.min(1, (n.enchant_bonus || 0) + (u[178] && u[178](x) || u[174] && u[174](x) || u[1127] && u[1127](x) || 0)),
            Mods.Wikimd.item_formulas[g].enchant.sup = Math.min(1, (n.enchant_bonus || 0) + (u[179] && u[179](x) || u[175] && u[175](x) || u[1128] && u[1128](x) || 0)),
            Mods.Wikimd.item_formulas[f] = Mods.Wikimd.item_formulas[f] || {},
            Mods.Wikimd.item_formulas[f].enchant = Mods.Wikimd.item_formulas[f].enchant || {},
            Mods.Wikimd.item_formulas[f].enchant.from_enchant = g);
            y && (Mods.Wikimd.item_formulas[g].magic = y,
            Mods.Wikimd.item_formulas[g].magic.min_level = x);
            A && b.push(g)
        }
        for (e in object_base)
            if (u = object_base[e],
            k = {},
            k.name = u.name,
            k.id = u.b_i,
            k.img = u.img,
            "undefined" != typeof u.params.results)
                for (B in n = u.params.results,
                n) {
                    var u = n[B].skill, p = n[B].returns, m = n[B].requires || [], y = n[B].requires_one_from || [], v;
                    for (v in p)
                        if (f = p[v],
                        g = f.id,
                        x = f.level,
                        A = f.base_chance || null ,
                        t = f.max_chance || null ,
                        r = f.xp || null ,
                        f = f.consumes || null ,
                        "health" != u) {
                            Mods.Wikimd.item_formulas[g].craft = Mods.Wikimd.item_formulas[g].craft || {};
                            Mods.Wikimd.item_formulas[g].craft.source = Mods.Wikimd.item_formulas[g].craft.source || {};
                            for (var F in Mods.Wikimd.item_formulas[g].craft.source)
                                if (Mods.Wikimd.item_formulas[g].craft.source[F].name == k.name) {
                                    k.id = Mods.Wikimd.item_formulas[g].craft.source[F].id;
                                    break
                                }
                            "undefined" == typeof Mods.Wikimd.item_formulas[g].craft.source[k.id] && (Mods.Wikimd.item_formulas[g].craft.source[k.id] = {},
                            Mods.Wikimd.item_formulas[g].craft.source[k.id].object = k,
                            Mods.Wikimd.item_formulas[g].craft.source[k.id].name = k.name);
                            Mods.Wikimd.item_formulas[g].craft.source[k.id].patterns = Mods.Wikimd.item_formulas[g].craft.source[k.id].patterns || {};
                            var q = !0, E = 0, w;
                            for (w in Mods.Wikimd.item_formulas[g].craft.source[k.id].patterns) {
                                var D = Mods.Wikimd.item_formulas[g].craft.source[k.id].patterns[w];
                                if (D.skill == u && D.xp == r && D.base_chance == A && D.max_chance == t) {
                                    var q = !1, G;
                                    for (G in D.requires) {
                                        for (var C in m)
                                            G == C && D.requires[G] != m[C] && (q = !0);
                                        if (q)
                                            break
                                    }
                                    for (G in D.requires_one_from) {
                                        for (C in y)
                                            D.requires_one_from[G] != y[C] && (q = !0);
                                        if (q)
                                            break
                                    }
                                }
                                q && E++
                            }
                            q && (Mods.Wikimd.item_formulas[g].craft.source[k.id].patterns[E] = {
                                consumes: f,
                                requires: m,
                                requires_one_from: y,
                                base_chance: A,
                                max_chance: t,
                                skill: u,
                                xp: r,
                                level: x
                            })
                        }
                }
        for (E in FORGE_FORMULAS) {
            f = FORGE_FORMULAS[E];
            g = f.item_id;
            u = object_base[36];
            k = {};
            k.name = u.name;
            k.id = u.b_i;
            k.type = u.type;
            k.img = u.img;
            k.b_t = u.b_t;
            u = "forging";
            f.fletching_level && (u = "fletching");
            x = f.level || f.fletching_level;
            v = f.chance;
            F = f.pattern || null ;
            r = f.xp;
            m = f.materials;
            f = {};
            for (e in m)
                f[e] = m[e];
            delete f[36];
            m[36] = 1;
            Mods.Wikimd.item_formulas[g].craft = Mods.Wikimd.item_formulas[g].craft || {};
            Mods.Wikimd.item_formulas[g].craft.source = Mods.Wikimd.item_formulas[g].craft.source || {};
            Mods.Wikimd.item_formulas[g].craft.source[k.id] = Mods.Wikimd.item_formulas[g].craft.source[k.id] || {};
            Mods.Wikimd.item_formulas[g].craft.source[k.id].object = k;
            Mods.Wikimd.item_formulas[g].craft.source[k.id].skill = u;
            Mods.Wikimd.item_formulas[g].craft.source[k.id].level = x;
            Mods.Wikimd.item_formulas[g].craft.source[k.id].xp = r;
            Mods.Wikimd.item_formulas[g].craft.source[k.id].patterns = Mods.Wikimd.item_formulas[g].craft.source[k.id].patterns || {};
            Mods.Wikimd.item_formulas[g].craft.source[k.id].patterns[E] = {
                pattern: F,
                requires: m,
                chance: v,
                consumes: f
            }
        }
        for (E in CARPENTRY_FORMULAS) {
            F = CARPENTRY_FORMULAS[E];
            k = {
                name: "House"
            };
            k.type = E;
            v = 1;
            var u = "Carpentry", H;
            for (H in F) {
                f = F[H];
                g = f.item_id;
                x = f.level;
                f = f.consumes;
                r = 0;
                for (e in f)
                    "length" != e && (r += CARPENTRY_MATERIAL_XP[f[e].id] * f[e].count);
                m = f;
                Mods.Wikimd.item_formulas[g].craft = Mods.Wikimd.item_formulas[g].craft || {};
                Mods.Wikimd.item_formulas[g].craft.source = Mods.Wikimd.item_formulas[g].craft.source || {};
                Mods.Wikimd.item_formulas[g].craft.source.Carpentry = Mods.Wikimd.item_formulas[g].craft.source.Carpentry || {};
                Mods.Wikimd.item_formulas[g].craft.source.Carpentry.object = k;
                Mods.Wikimd.item_formulas[g].craft.source.Carpentry.skill = u;
                Mods.Wikimd.item_formulas[g].craft.source.Carpentry.level = x;
                Mods.Wikimd.item_formulas[g].craft.source.Carpentry.xp = r;
                Mods.Wikimd.item_formulas[g].craft.source.Carpentry.patterns = Mods.Wikimd.item_formulas[g].craft.source.Carpentry.patterns || {};
                Mods.Wikimd.item_formulas[g].craft.source.Carpentry.patterns[H] = {
                    requires: m,
                    chance: v,
                    consumes: f
                }
            }
        }
        for (E in b)
            g = item_base[b[E]],
            H = object_base[g.params.farming_id],
            x = g.params.min_farming,
            g = H.params.results[0].returns[0].id,
            Mods.Wikimd.item_formulas[g].craft.source[H.b_i] && Mods.Wikimd.item_formulas[g].craft.source[H.b_i].patterns && (F = Mods.Wikimd.item_formulas[g].craft.source[H.b_i].patterns[0],
            F.level = x,
            F.consumes = [{
                id: b[E],
                count: 1
            }]);
        for (E in FLETCHING_FORMULAS) {
            f = FLETCHING_FORMULAS[E];
            g = f.item_id;
            u = object_base[398];
            k = {};
            k.name = u.name;
            k.id = u.b_i;
            k.type = u.type;
            k.img = u.img;
            k.b_t = u.b_t;
            u = "fletching";
            x = f.level;
            v = f.chance;
            F = f.pattern || null ;
            r = f.xp;
            f = {};
            for (e in F)
                f[F[e]] = 1;
            Mods.Wikimd.item_formulas[g].craft = Mods.Wikimd.item_formulas[g].craft || {};
            Mods.Wikimd.item_formulas[g].craft.source = Mods.Wikimd.item_formulas[g].craft.source || {};
            Mods.Wikimd.item_formulas[g].craft.source[k.id] = Mods.Wikimd.item_formulas[g].craft.source[k.id] || {};
            Mods.Wikimd.item_formulas[g].craft.source[k.id].object = k;
            Mods.Wikimd.item_formulas[g].craft.source[k.id].skill = u;
            Mods.Wikimd.item_formulas[g].craft.source[k.id].level = x;
            Mods.Wikimd.item_formulas[g].craft.source[k.id].xp = r;
            Mods.Wikimd.item_formulas[g].craft.source[k.id].patterns = Mods.Wikimd.item_formulas[g].craft.source[k.id].patterns || {};
            Mods.Wikimd.item_formulas[g].craft.source[k.id].patterns[E] = {
                pattern: F,
                chance: v,
                consumes: f
            }
        }
        for (e in npc_base) {
            u = npc_base[e];
            if ("undefined" != typeof u.params.drops)
                for (B in E = u.params.drops,
                E)
                    f = E[B],
                    g = f.id,
                    m = u.name,
                    b = u.b_i,
                    k = u.b_t,
                    r = u.img,
                    v = f.chance,
                    x = u.level,
                    Mods.Wikimd.item_formulas[g].drop = Mods.Wikimd.item_formulas[g].drop || {},
                    Mods.Wikimd.item_formulas[g].drop.sources = Mods.Wikimd.item_formulas[g].drop.sources || {},
                    Mods.Wikimd.item_formulas[g].drop.sources[e] = {
                        name: m,
                        id: b,
                        level: x,
                        type: k,
                        chance: v,
                        img: r
                    };
            if ("undefined" != typeof u.temp.content)
                for (B in x = u.temp.content,
                x)
                    f = x[B],
                    g = f.id,
                    m = u.name,
                    b = u.b_i,
                    k = u.b_t,
                    r = u.img,
                    E = f.count || 0,
                    H = f.spawn || !1,
                    Mods.Wikimd.item_formulas[g].sold = Mods.Wikimd.item_formulas[g].sold || {},
                    Mods.Wikimd.item_formulas[g].sold.sources = Mods.Wikimd.item_formulas[g].sold.sources || {},
                    Mods.Wikimd.item_formulas[g].sold.sources[e] = {
                        name: m,
                        id: b,
                        count: E,
                        type: k,
                        spawn: H,
                        img: r
                    }
        }
        Mods.Wikimd.populate_formulas()
    }
    ;
    Mods.Wikimd.populate_formulas = function() {
        var b = Mods.Wikimd.item_formulas, e = Mods.Wikimd.formulas = {}, f = 0, g, k, m, n, p, r;
        for (r in b)
            if ("undefined" != typeof b[r].craft && "undefined" != typeof b[r].craft.source)
                for (var t in b[r].craft.source) {
                    var q = b[r].craft.source[t].patterns, u;
                    for (u in q) {
                        e[f] = {};
                        e[f].id = b[r].id;
                        e[f].img = b[r].img;
                        e[f].name = b[r].name;
                        e[f].object = b[r].craft.source[t].object;
                        e[f].pattern = q[u];
                        e[f].level = q[u].level || b[r].craft.source[t].level;
                        e[f].skill = q[u].skill || b[r].craft.source[t].skill;
                        e[f].xp = q[u].xp || b[r].craft.source[t].xp;
                        g = {};
                        k = e[f].pattern.requires;
                        m = {};
                        n = e[f].pattern.consumes;
                        for (p in n)
                            "object" == typeof n[p] ? m[n[p].id] = n[p].count : m[p] = n[p];
                        for (p in k)
                            "object" == typeof k[p] ? "undefined" != typeof k[p].id && "undefined" != typeof k[p].count ? g[k[p].id] = k[p].count : g[k[p]] = 1 : "Anvil" != e[f].object.name ? g[k[p]] = 1 : g[p] = k[p];
                        n = k = 0;
                        for (p in g)
                            "length" != p && (k += parseInt(g[p]));
                        for (p in m)
                            "length" != p && (n += parseInt(m[p]));
                        delete e[f].pattern.consumes;
                        delete e[f].pattern.requires;
                        e[f].pattern.requires = g;
                        e[f].pattern.consumes = m;
                        e[f].pattern.requires.length = k;
                        e[f].pattern.consumes.length = n;
                        f++
                    }
                }
    }
    ;
    Mods.Wikimd.populate_pets = function() {
        for (var b = Mods.Wikimd.pet_family = {}, e = 0, f = pets.length, e = 0; 2 > e; e++)
            for (var g in pets) {
                var k = f - g
                  , m = pets[k].params.item_id
                  , n = pets[k].params.level;
                b[m] = b[m] || {};
                b[m][n] = m;
                k = pets[k].params.next_pet_item_id;
                void 0 != k && (b[m][n + 1] = k);
                for (var p in b[m])
                    for (var r in b[m])
                        b[b[m][p]] = b[b[m][p]] || {},
                        b[b[m][p]][r] = b[m][r];
                if (1 == e)
                    for (p in Mods.Wikimd.formulas)
                        if (Mods.Wikimd.formulas[p].id == m && "Big Treasure Chest" != Mods.Wikimd.formulas[p].object.name) {
                            b[m] = Mods.Wikimd.formulas[p];
                            break
                        }
            }
    }
    ;
    Mods.Wikimd.populate_family = function() {
        var b = Mods.Wikimd.pet_family, e = Mods.Wikimd.family = {}, f;
        for (f in b) {
            var g = void 0 != b[f][1] ? b[f][1] : void 0 != b[f][2] ? b[f][2] : void 0 != b[f][3] ? b[f][3] : void 0 != b[f][4] ? b[f][4] : b[f][5];
            "number" == typeof g && 0 < g && (g = pets[item_base[g].params.pet].name,
            g = g.replace(/ ?(Baby|\[|\]|Ancient|Legendary|Rare|Common) ?/gi, ""),
            e[f] = g)
        }
    }
    ;
    Mods.Wikimd.loadDivs = function() {
        createElem("div", "mods_form", {
            id: "mod_wiki_mods_options",
            className: "common_border_bottom scrolling_allowed",
            style: "width: 100%; height: 24px; margin-bottom: 5px; font-size: .8em; display: none;",
            innerHTML: "<select     id='mods_wiki_type'                  class='market_select scrolling_allowed'             style='float:left;     margin:0px;                         width:70px;'></select><select     id='mods_wiki_type_item'             class='market_select scrolling_allowed'             style='float:left;     margin:0px;     margin-left:6px;     width:70px;         display:none;                        '></select><select     id='mods_wiki_type_monster'          class='market_select scrolling_allowed'             style='float:left;     margin:0px;     margin-left:6px;     width:70px;         display:none;                        '></select><select     id='mods_wiki_type_vendor'           class='market_select scrolling_allowed'             style='float:left;     margin:0px;     margin-left:6px;     width:70px;         display:none;                        '></select><select     id='mods_wiki_type_craft'            class='market_select scrolling_allowed'             style='float:left;     margin:0px;     margin-left:6px;     width:70px;         display:none;                        '></select><select     id='mods_wiki_type_enchant'          class='market_select scrolling_allowed'             style='float:left;     margin:0px;     margin-left:6px;     width:70px;         display:none;                        '></select><select     id='mods_wiki_type_pet'              class='market_select scrolling_allowed'             style='float:left;     margin:0px;     margin-left:6px;     width:70px;         display:none;                        '></select><select     id='mods_wiki_type_spell'            class='market_select scrolling_allowed'             style='float:left;     margin:0px;     margin-left:6px;     width:70px;         display:none;                        '></select><select     id='mods_wiki_type_item_type'        class='market_select scrolling_allowed'             style='float:left;     margin:0px;     margin-left:6px;     width:80px;         display:none;                        '></select><select     id='mods_wiki_type_item_skill'       class='market_select scrolling_allowed'             style='float:left;     margin:0px;     margin-left:6px;     width:80px;         display:none;                        '></select><select     id='mods_wiki_type_craft_skill'      class='market_select scrolling_allowed'             style='float:left;     margin:0px;     margin-left:6px;     width:80px;         display:none;                        '></select><select     id='mods_wiki_type_craft_source'     class='market_select scrolling_allowed'             style='float:left;     margin:0px;     margin-left:6px;     width:80px;         display:none;                        '></select><input      id='mods_wiki_name' type='text'      class='market_select scrolling_allowed'             style='float:left;                     margin-left:6px;     width:200px;        display:none;     height:16px;       '></input><button     id='mods_wiki_load'                  class='market_select pointer scrolling_allowed'     style='                margin:0px;                                                                margin-bottom:2px; '>Go!</button>"
        });
        createElem("span", "mod_wiki_mods_options", {
            id: "mods_wiki_range_separate",
            className: "scrolling_allowed",
            style: "float: left; margin-left: 6px; height: 20px; display: none; border-left: 1px solid #FFF;",
            onclick: "javascript:Mods.Wikimd.loadWikiType(false);",
            innerHTML: "<select id='mods_wiki_range' class='market_select scrolling_allowed' style='float:left; margin-left:6px; width:70px; display:none; margin-top:0px;'></input>"
        });
        createElem("span", "mod_wiki_mods_options", {
            id: "mods_wiki_level",
            className: "scrolling_allowed",
            style: "float: left; margin-left: 6px; display: none;",
            onclick: "javascript:Mods.Wikimd.loadWikiType(false);",
            innerHTML: "<input type='text' id='mods_wiki_level_low' class='market_select scrolling_allowed' style='width: 25px; margin-right: 5px; height:16px; float:left;'><span class='scrolling_allowed' style='float:left; margin-top:3px;'>to</span><input type='text' id='mods_wiki_level_high' class='market_select scrolling_allowed' style='width: 25px;margin-left: 5px; height:16px; float:left;'>"
        });
        for (var b = "", e = 0; 300 > e; e++)
            for (var f = 0; 3 > f; f++)
                if (0 == f)
                    b += "<tr class='scrolling_allowed wiki_f2 hidden' id='wiki_row" + f + "_" + e + "'><td colspan='7'>&nbsp;</td></tr>";
                else {
                    for (var g = "<tr class='scrolling_allowed hidden' id='wiki_row" + f + "_" + e + "'>", k = e, m = f, n = "", p = 0; 6 > p; p++) {
                        var r = "<td class='scrolling_allowed' id='wiki_row" + m + "_col" + p + "_" + k + "'>"
                          , t = (0 == k ? "<div style='padding-top: 3px' " : "<span ") + "class='scrolling_allowed' id='wiki_row"
                          , q = "<div class='scrolling_allowed' id='wiki_row" + m + "_col" + p + "_div_" + k + "'>";
                        0 == p && (q += "<div class='scrolling_allowed' id='wiki_row" + m + "_col" + p + "_img_" + k + "'>&nbsp;</div>");
                        q += t + m + "_col" + p + "_text_" + k + (0 == k ? "'>&nbsp;</div>" : "'>&nbsp;</span>");
                        q += "</div>";
                        n += r + q + "</td>"
                    }
                    b += g + n + "</tr>"
                }
        createElem("div", "mods_form", {
            id: "mod_wiki_options",
            className: "scrolling_allowed",
            style: "display: block; height: 250px; overflow-x: hidden;",
            innerHTML: "<span class='scrolling_allowed' id='mod_wiki_search'>" + ("<table id='mod_wiki_search_items_table' class='scrolling_allowed' cellspacing='0' cellpadding='0' style='font-size: 0.8em; width:100%; margin-top:5px; padding-right:1px;'>" + b + "</table>") + "</span>"
        });
        createElem("div", wrapper, {
            id: "wiki_recipe_form",
            className: "menu",
            style: "position: relative; left: 50%; top: 30%; z-index: 99999999; width: 145px; height: 163px; display: none;"
        });
        createElem("span", "wiki_recipe_form", {
            id: "wiki_recipe_top",
            innerHTML: "<span class='pointer' style='font-weight: bold; color: #FFFFFF; float: right;' onclick='javascript: getElem(&apos;wiki_recipe_form&apos;).style.display = &apos;none&apos;'>Close</span>"
        });
        createElem("div", "wiki_recipe_form", {
            id: "wiki_recipe_holder",
            style: "position: relative; display: inline-block; float: left;"
        });
        for (e = 0; 4 > e; e++)
            for (f = 0; 4 > f; f++)
                createElem("div", "wiki_recipe_holder", {
                    id: "wiki_formula_" + e + "_" + f,
                    className: "inv_item",
                    style: "display: inline-block; width: 32px; height: 32px; border: 1px solid #999; margin: 1px; float: left;",
                    innerHTML: "&nbsp;"
                });
        getElem("mods_wiki_type").innerHTML = "<option value='-1'>Select</option>          <option value='item'>ITEM</option>                <option value='monster'>MOB</option>              <option value='vendor'>NPC</option>                  <option value='craft'>CRAFT</option>                <option value='enchant'>ENCHANT</option>          <option value='spell'>SPELL</option>             <option value='pet'>PET</option>";
        getElem("mods_wiki_type_item").innerHTML = "<option value='all'>All</option>            <option value='skill'>Skill</option>              <option value='type'>Type</option>                <option value='name'>Name</option>";
        getElem("mods_wiki_type_item_type").innerHTML = "<option value='-1'>Select</option>          <option value='weapons'>Weapon</option>           <option value='r.hand armors'>Shield</option>     <option value='chest'>Chest</option>                 <option value='helm'>Helm</helm>                    <option value='pants'>Pants</option>              <option value='glove'>Gloves</option>            <option value='boots'>Boots</option>                    <option value='cape'>Cape</option>               <option value='jewelry'>Jewelry</option>        <option value='magic'>Magic</option>            <option value='materials'>Material</option>         <option value='tools'>Tool</option>                  <option value='foods'>Food</option>             <option value='pets'>Pets</option>";
        getElem("mods_wiki_type_item_skill").innerHTML = "<option value='-1'>Select</option>          <option value='accuracy'>Accuracy</option>        <option value='strength'>Strength</option>        <option value='defense'>Defense</option>             <option value='health'>Health</option>              <option value='magic'>Magic</option>              <option value='alchemy'>Alchemy</option>         <option value='woodcutting'>Woodcut</option>            <option value='farming'>Farming</option>         <option value='fishing'>Fishing</option>        <option value='cooking'>Cooking</option>        <option value='jewelry'>Jewelry</option>            <option value='carpentry'>Carpentry</option>         <option value='forging'>Forging</option>        <option value='mining'>Mining</option>     <option value='archery'>Archery</option>";
        getElem("mods_wiki_type_monster").innerHTML = "<option value='all'>All</option>            <option value='name'>Name</option>                <option value='item'>Item</option>";
        getElem("mods_wiki_type_vendor").innerHTML = "<option value='all'>All</option>            <option value='name'>Name</option>                <option value='item'>Item</option>";
        getElem("mods_wiki_type_craft").innerHTML = "<option value='all'>All</option>            <option value='skill'>Skill</option>              <option value='source'>Source</option>            <option value='item'>Item</option>";
        getElem("mods_wiki_type_craft_skill").innerHTML = "<option value='-1'>Select</option>          <option value='alchemy'>Alchemy</option>          <option value='woodcutting'>Woodcut</option>      <option value='farming'>Farming</option>             <option value='fishing'>Fishing</option>            <option value='cooking'>Cooking</option>          <option value='jewelry'>Jewelry</option>         \t\t <option value='carpentry'>Carpentry</option>            <option value='forging'>Forging</option>         <option value='mining'>Mining</option>          <option value='magic'>Magic</option>      <option value='fletching'>Fletching</option>";
        getElem("mods_wiki_type_craft_source").innerHTML = "<option value='-1'>Select</option>          <option value='furnace'>Furnace</option>          <option value='anvil'>Anvil</option>              <option value='campfire'>Campfire</option>           <option value='carpentry'>Carpentry</option>       <option value='kettle'>Kettle</option>             <option value='fletching table'>Fletching</option>     <option value='other'>Other</option>";
        getElem("mods_wiki_type_pet").innerHTML = "<option value='all'>All</option>            <option value='name'>Name</option>                <option value='family'>Family</option";
        getElem("mods_wiki_type_enchant").innerHTML = "<option value='all'>All</option>            <option value='item'>Item</option>";
        getElem("mods_wiki_type_spell").innerHTML = "<option value='all'>All</option>            <option value='name'>Name</option>";
        var e = {
            type: 0,
            type_item: 1,
            type_monster: 1,
            type_vendor: 1,
            type_craft: 1,
            type_pet: 1,
            type_spell: 1,
            type_enchant: 1,
            type_item_type: 2,
            type_item_skill: 2,
            type_craft_skill: 2,
            type_craft_source: 2
        }, f = ["onchange"], u;
        for (u in e)
            for (var x in f)
                getElem("mods_wiki_" + u).setAttribute(f[x], "javascript: Mods.Wikimd.loadWikiType(" + e[u] + ");");
        getElem("mods_wiki_name").setAttribute("onclick", "javascript:Mods.Wikimd.loadWikiType(false);");
        getElem("mods_wiki_load").setAttribute("onclick", "javascript:Mods.Wikimd.populateWiki(true);");
        getElem("mods_wiki_name").setAttribute("onfocus", "javascript: Mods.blockKbind = true;");
        getElem("mods_wiki_name").setAttribute("onblur", "javascript: Mods.blockKbind = false");
        getElem("mods_wiki_level_low").setAttribute("onfocus", "javascript: Mods.blockKbind = true;");
        getElem("mods_wiki_level_low").setAttribute("onblur", "javascript: Mods.blockKbind = false");
        getElem("mods_wiki_level_high").setAttribute("onfocus", "javascript: Mods.blockKbind = true;");
        getElem("mods_wiki_level_high").setAttribute("onblur", "javascript: Mods.blockKbind = false");
        getElem("mod_wiki_options").style.display = "none";
        getElem("mod_load_options").style.display = "none";
        getElem("mod_load_options").style.display = "block"
    }
    ;
    Mods.Wikimd.chatSystemToggle = function() {
        return Mods.blockKbind ? (Mods.Wikimd.populateWiki(!0),
        !0) : !1
    }
    ;
    Mods.Wikimd.nameMenu = function(b, e) {
        if ("string" === typeof b && "number" === typeof e && ("item" == b || "craft" == b || "pet" == b || "spell" == b || "enchant" == b ? item_base : "monster" == b && npc_base)) {
            var f = getElem("action_menu");
            addClass(f, "hidden");
            var g = Mods.Wikimd.mouse;
            f.style.top = g.y + 10 + "px";
            f.style.left = g.x + "px";
            if ("item" != b && "craft" != b && "pet" != b && "spell" != b && "enchant" != b || !modOptions.chatmd.loaded)
                "monster" == b && modOptions.rclick.loaded && (k = npc_base[e].name,
                f.innerHTML = "<div style='padding-left: 3px;'><span class='line' onclick='ActionMenu.mobDrops(" + e + ",4);addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)' style='margin-left:-5px;'><span class='item'>" + k + "</span>Drops</span><span class='line' onclick='ActionMenu.combatCheck(" + e + ");addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;);'>Combat Analysis</span><span class='line' onclick='addClass(getElem(&apos;action_menu&apos;),&apos;hidden&apos;)'>Close</span></div>");
            else {
                var k = item_base[e].name.replace(/'/g, "*"), g = "<span class='line' onclick='" + ("Mods.Chatmd.chatCommands(&apos;/wiki item name " + k + "&apos;);addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)") + "' style='margin-left:-5px;'>Check Wiki<span class='item'>ITEM</span></span>", m;
                m = "<span class='line' onclick='" + ("Mods.Chatmd.chatCommands(&apos;/wiki mob item " + k + "&apos;);addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)") + "' style='margin-left:-5px;'>Check Wiki<span class='item'>MOB</span></span>";
                var n;
                n = "<span class='line' onclick='" + ("Mods.Chatmd.chatCommands(&apos;/wiki npc item " + k + "&apos;);addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)") + "' style='margin-left:-5px;'>Check Wiki<span class='item'>NPC</span></span>";
                var p;
                p = "<span class='line' onclick='" + ("Mods.Chatmd.chatCommands(&apos;/wiki craft item " + k + "&apos;);addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)") + "' style='margin-left:-5px;'>Check Wiki<span class='item'>CRAFT</span></span>";
                var r;
                r = "<span class='line' onclick='" + ("Mods.Chatmd.chatCommands(&apos;/wiki enchant item " + k + "&apos;);addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)") + "' style='margin-left:-5px;'>Check Wiki<span class='item'>ENCHANT</span></span>";
                var t;
                t = -1 < item_base[e].params.pet ? "<span class='line' onclick='" + ("Mods.Chatmd.chatCommands(&apos;/wiki pet name " + k + "&apos;);addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)") + "' style='margin-left:-5px;'>Check Wiki<span class='item'>PET</span></span>" : "";
                k = 10 == item_base[e].params.slot ? "<span class='line' onclick='" + ("Mods.Chatmd.chatCommands(&apos;/wiki spell name " + k + "&apos;);addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)") + "' style='margin-left:-5px;'>Check Wiki<span class='item'>SPELL</span></span>" : "";
                f.innerHTML = ("<div style='padding-left: 8px;'>" + g + m + n + p + r + t + k + "<span class='line' onclick='addClass(getElem(&apos;action_menu&apos;),&apos;hidden&apos;)' style='margin-left:-5px;'>Close</span></div>").replace(/\*/g, "\\&apos;")
            }
            0 < f.innerHTML.length && removeClass(f, "hidden")
        }
    }
    ;
    Mods.Wikimd.populateWiki = function(b, e) {
        var f, g, k, m, n, p, r, t, q, u, x, y, A, B, v, F, E, w, D, G;
        f = Mods.Wikimd.oldSortValue;
        1 == b ? (Mods.Wikimd.newSortValue = Mods.Wikimd.currentSort(),
        b = Mods.Wikimd.populateWikiList()) : b = b || Mods.Wikimd.populateWikiList();
        -1 != loadedMods.indexOf("Chatmd") && (k = getElem("mods_wiki_load"),
        k.innerHTML = "Back!",
        k.setAttribute("onclick", "javascript:Mods.Chatmd.chatCommands('/wiki " + f.replace(/'/g, "\\'") + "')"));
        f = getElem("mods_wiki_type").value;
        e = e || Mods.Wikimd.sortWiki(b, f, Mods.Wikimd.oldSort[f]);
        k = !1;
        for (g in b) {
            k = !0;
            break
        }
        for (n = 0; 300 > n; n++)
            for (g = 0; 3 > g; g++)
                addClass(getElem("wiki_row" + g + "_" + n), "hidden");
        if (k)
            for (k = {
                item: {
                    1: {
                        className: ["scrolling_allowed wiki_row1", "scrolling_allowed wiki_a1"],
                        0: {
                            className: ["scrolling_allowed wiki_p35"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_h35 wiki_base1"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "item", "name")
                                }
                                ]
                            },
                            img: {
                                className: ["scrolling_allowed hidden", "scrolling_allowed wiki_img"]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_name"],
                                innerHTML: ["Item Name"],
                                style: [{
                                    marginTop: "-8px"
                                }]
                            }
                        },
                        1: {
                            className: ["scrolling_allowed wiki_p13"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "item", "level")
                                }
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["Level"]
                            }
                        },
                        2: {
                            className: ["scrolling_allowed wiki_p13"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "item", "skill")
                                }
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["Skill"]
                            }
                        },
                        3: {
                            className: ["scrolling_allowed wiki_p26"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "item", "price")
                                }
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["Price"]
                            }
                        },
                        4: {
                            className: ["scrolling_allowed wiki_p13"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bL"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "item", "slot")
                                }
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["Slot"]
                            }
                        }
                    },
                    2: {
                        className: ["scrolling_allowed wiki_row2", "scrolling_allowed wiki_a2"],
                        0: {
                            className: ["scrolling_allowed hidden"]
                        },
                        1: {
                            className: ["scrolling_allowed wiki_p13"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bT wiki_bR", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bT wiki_bR"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "item", "power")
                                }
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["Power"]
                            }
                        },
                        2: {
                            className: ["scrolling_allowed wiki_p13"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "item", "aim")
                                }
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["Aim"]
                            }
                        },
                        3: {
                            className: ["scrolling_allowed wiki_p13"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "item", "armor")
                                }
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["Armor"]
                            }
                        },
                        4: {
                            className: ["scrolling_allowed wiki_p13"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "item", "magic")
                                }
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["Magic"]
                            }
                        },
                        5: {
                            className: ["scrolling_allowed wiki_p13"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bT wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bT wiki_bL"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "item", "speed")
                                }
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["Speed"]
                            }
                        }
                    }
                },
                monster: {
                    1: {
                        className: ["scrolling_allowed wiki_row2", "scrolling_allowed wiki_a2"],
                        0: {
                            className: ["scrolling_allowed wiki_p35"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "moster", "respawn")
                                }
                                ]
                            },
                            img: {
                                className: ["scrolling_allowed hidden"]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["Respawn Time"]
                            }
                        },
                        1: {
                            className: ["scrolling_allowed wiki_p13"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_mL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_mL"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "monster", "level")
                                }
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["Level"]
                            }
                        },
                        2: {
                            className: ["scrolling_allowed wiki_p13"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "monster", "health")
                                }
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["Health"]
                            }
                        },
                        3: {
                            className: ["scrolling_allowed wiki_p13"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "monster", "accuracy")
                                }
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["ACC"]
                            }
                        },
                        4: {
                            className: ["scrolling_allowed wiki_p13"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "monster", "strength")
                                }
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["STR"]
                            }
                        },
                        5: {
                            className: ["scrolling_allowed wiki_p13"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bL"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "monster", "defense")
                                }
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["DEF"]
                            }
                        }
                    },
                    2: {
                        className: ["scrolling_allowed wiki_row1", "scrolling_allowed wiki_a1"],
                        0: {
                            className: ["scrolling_allowed wiki_p35"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_h17 wiki_base1 wiki_bT", "scrolling_allowed market_select pointer wiki_h35 wiki_base1 wiki_bT"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "monster", "name")
                                }
                                ]
                            },
                            img: {
                                className: ["scrolling_allowed hidden", "scrolling_allowed wiki_img"]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_name"],
                                innerHTML: ["Monster Name"],
                                style: [{
                                    marginTop: "-8px"
                                }]
                            }
                        },
                        1: {
                            className: ["scrolling_allowed wiki_p65"],
                            div: {
                                className: ["scrolling_allowed market_select wiki_h17 wiki_base1 wiki_h17 wiki_bT wiki_bL", "scrolling_allowed market_select wiki_base2 wiki_pad2 wiki_bT wiki_bL wiki_mR wiki_mL"],
                                onclick: [function() {}
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameImg", "scrolling_allowed"],
                                innerHTML: ["Item Drops"]
                            }
                        }
                    }
                },
                vendor: {
                    1: {
                        className: ["scrolling_allowed wiki_row1", "scrolling_allowed wiki_a1"],
                        0: {
                            className: ["scrolling_allowed wiki_p35"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_h35 wiki_base1", "scrolling_allowed market_select pointer wiki_base1 wiki_pad2"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "vendor", "name")
                                }
                                ]
                            },
                            img: {
                                className: ["scrolling_allowed hidden", "scrolling_allowed wiki_img"]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_name"],
                                innerHTML: ["Vendor Name"],
                                style: [{
                                    marginTop: "-8px"
                                }]
                            }
                        },
                        1: {
                            className: ["scrolling_allowed wiki_p65"],
                            div: {
                                className: ["scrolling_allowed market_select wiki_h35 wiki_base1 wiki_bL", "scrolling_allowed market_select wiki_base1 wiki_pad2 wiki_bL"],
                                onclick: [function() {}
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameImg", "scrolling_allowed"],
                                innerHTML: ["Buys / Sells"]
                            }
                        }
                    }
                },
                craft: {
                    1: {
                        className: ["scrolling_allowed wiki_row2", "scrolling_allowed wiki_a2"],
                        0: {
                            className: ["scrolling_allowed wiki_p35"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "craft", "location")
                                }
                                ]
                            },
                            img: {
                                className: ["scrolling_allowed hidden"]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["Craft Location"]
                            }
                        },
                        1: {
                            className: ["scrolling_allowed wiki_p13"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_mL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_mL"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "craft", "level")
                                }
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["Level"]
                            }
                        },
                        2: {
                            className: ["scrolling_allowed wiki_p13"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "craft", "skill")
                                }
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["Skill"]
                            }
                        },
                        3: {
                            className: ["scrolling_allowed wiki_p13"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "craft", "base_chance")
                                }
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["Min%"]
                            }
                        },
                        4: {
                            className: ["scrolling_allowed wiki_p13"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "craft", "max_chance")
                                }
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["Max%"]
                            }
                        },
                        5: {
                            className: ["scrolling_allowed wiki_p13"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bL"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "craft", "xp")
                                }
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["Exp"]
                            }
                        }
                    },
                    2: {
                        className: ["scrolling_allowed wiki_row1", "scrolling_allowed wiki_a1"],
                        0: {
                            className: ["scrolling_allowed wiki_p35"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_h17 wiki_base1 wiki_bT", "scrolling_allowed market_select pointer wiki_h35 wiki_base1 wiki_bT"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "craft", "name")
                                }
                                ]
                            },
                            img: {
                                className: ["scrolling_allowed hidden", "scrolling_allowed wiki_img"]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_name"],
                                innerHTML: ["Craft Name"],
                                style: [{
                                    marginTop: "-8px"
                                }]
                            }
                        },
                        1: {
                            className: ["scrolling_allowed wiki_p65"],
                            div: {
                                className: ["scrolling_allowed market_select wiki_h35 wiki_base1 wiki_h17 wiki_bT wiki_bL", "scrolling_allowed market_select wiki_base1 wiki_h35 wiki_bT wiki_bL"],
                                onclick: [function() {}
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameImg", "scrolling_allowed"],
                                innerHTML: ["Required Materials"]
                            }
                        }
                    }
                },
                pet: {
                    1: {
                        className: ["scrolling_allowed wiki_row2", "scrolling_allowed wiki_a2"],
                        0: {
                            className: ["scrolling_allowed wiki_p35"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR", "scrolling_allowed market_select pointer wiki_h17 wiki_base1"],
                                onclick: [function() {}
                                ]
                            },
                            img: {
                                className: ["scrolling_allowed hidden", "scrolling_allowed wiki_img"]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText", "scrolling_allowed wiki_nameText"],
                                innerHTML: ["<span style='font-weight: normal color: #999 font-size: 1.05em'>Req to level: &nbsp;</span><span onclick='Mods.Wikimd.sortWiki(null, &apos;pet&apos;, &apos;stones&apos;)'>SoE</span>&nbsp; | &nbsp;<span onclick='Mods.Wikimd.sortWiki(null, &apos;pet&apos;, &apos;xp_required&apos;)'>Exp</span>"]
                            }
                        },
                        1: {
                            className: ["scrolling_allowed wiki_p13"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_mL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_mL"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "pet", "aim")
                                }
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["Aim"]
                            }
                        },
                        2: {
                            className: ["scrolling_allowed wiki_p13"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "pet", "power")
                                }
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["Power"]
                            }
                        },
                        3: {
                            className: ["scrolling_allowed wiki_p13"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "pet", "armor")
                                }
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["Armor"]
                            }
                        },
                        4: {
                            className: ["scrolling_allowed wiki_p13"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "pet", "magic")
                                }
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["Magic"]
                            }
                        },
                        5: {
                            className: ["scrolling_allowed wiki_p13"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bL"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "pet", "speed")
                                }
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["Speed"]
                            }
                        }
                    },
                    2: {
                        className: ["scrolling_allowed wiki_row1", "scrolling_allowed wiki_a1"],
                        0: {
                            className: ["scrolling_allowed wiki_p35"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_h17 wiki_base1 wiki_bT", "scrolling_allowed market_select pointer wiki_h35 wiki_base1 wiki_bT"],
                                onclick: [function() {}
                                ]
                            },
                            img: {
                                className: ["scrolling_allowed hidden", "scrolling_allowed wiki_img"]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText", "scrolling_allowed wiki_name"],
                                innerHTML: ["<span class='pointer' onclick='Mods.Wikimd.sortWiki(null, &apos;pet&apos;, &apos;name&apos;)'>Name</span>&nbsp; | &nbsp;<span class='pointer'  onclick='Mods.Wikimd.sortWiki(null, &apos;pet&apos;, &apos;family&apos;)'>Family</span>&nbsp; | &nbsp;<span class='pointer'  onclick='Mods.Wikimd.sortWiki(null, &apos;pet&apos;, &apos;inventory_slots&apos;)'>Slots</span>"],
                                style: [{
                                    marginTop: "-8px"
                                }]
                            }
                        },
                        1: {
                            className: ["scrolling_allowed wiki_p65"],
                            div: {
                                className: ["scrolling_allowed market_select wiki_h35 wiki_base1 wiki_h17 wiki_bT wiki_bL", "scrolling_allowed market_select wiki_base2 wiki_pad2 wiki_bT wiki_bL wiki_mR wiki_mL"],
                                onclick: [function() {}
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameImg", "scrolling_allowed"],
                                innerHTML: ["Evolution Chain"]
                            }
                        }
                    }
                },
                spell: {
                    1: {
                        className: ["scrolling_allowed wiki_row1", "scrolling_allowed wiki_a1"],
                        0: {
                            className: ["scrolling_allowed wiki_p35"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_h35 wiki_base1"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "spell", "name")
                                }
                                ]
                            },
                            img: {
                                className: ["scrolling_allowed hidden", "scrolling_allowed wiki_img"]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_name"],
                                innerHTML: ["Spell Name"],
                                style: [{
                                    marginTop: "-8px"
                                }]
                            }
                        },
                        1: {
                            className: ["scrolling_allowed wiki_p13"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "spell", "level")
                                }
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["Level"]
                            }
                        },
                        2: {
                            className: ["scrolling_allowed wiki_p13"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "spell", "cooldown")
                                }
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["CD"]
                            }
                        },
                        3: {
                            className: ["scrolling_allowed wiki_p13"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "spell", "price")
                                }
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["Price"]
                            }
                        },
                        4: {
                            className: ["scrolling_allowed wiki_p13"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "spell", "casts")
                                }
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["Casts"]
                            }
                        },
                        5: {
                            className: ["scrolling_allowed wiki_p13"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bL"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "spell", "cost_s")
                                }
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["Cost/S"]
                            }
                        }
                    },
                    2: {
                        className: ["scrolling_allowed wiki_row2", "scrolling_allowed wiki_a2"],
                        0: {
                            className: ["scrolling_allowed hidden"]
                        },
                        1: {
                            className: ["scrolling_allowed wiki_p13"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bT wiki_bR", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bT wiki_bR"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "spell", "damage")
                                }
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["Dmg"]
                            }
                        },
                        2: {
                            className: ["scrolling_allowed wiki_p13"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "spell", "exp")
                                }
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["Exp"]
                            }
                        },
                        3: {
                            className: ["scrolling_allowed wiki_p13"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "spell", "penetration")
                                }
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["Pen"]
                            }
                        },
                        4: {
                            className: ["scrolling_allowed wiki_p13"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "item", "dmg_s")
                                }
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["Dmg/S"]
                            }
                        },
                        5: {
                            className: ["scrolling_allowed wiki_p13"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bT wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bT wiki_bL"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "item", "exp_s")
                                }
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["Exp/S"]
                            }
                        }
                    }
                },
                enchant: {
                    1: {
                        className: ["scrolling_allowed wiki_row2", "scrolling_allowed wiki_a2"],
                        0: {
                            className: ["scrolling_allowed wiki_p35"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "enchant", "enchant")
                                }
                                ]
                            },
                            img: {
                                className: ["scrolling_allowed hidden"]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["Enchanted Item"]
                            }
                        },
                        1: {
                            className: ["scrolling_allowed hidden"]
                        },
                        2: {
                            className: ["scrolling_allowed wiki_p13"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_mL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_mL"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "enchant", "low")
                                }
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["Low %"]
                            }
                        },
                        3: {
                            className: ["scrolling_allowed wiki_p13"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "enchant", "med")
                                }
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["Med %"]
                            }
                        },
                        4: {
                            className: ["scrolling_allowed wiki_p13"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "enchant", "high")
                                }
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["High %"]
                            }
                        },
                        5: {
                            className: ["scrolling_allowed wiki_p13"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bL"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "enchant", "sup")
                                }
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                innerHTML: ["Sup %"]
                            }
                        }
                    },
                    2: {
                        className: ["scrolling_allowed wiki_row1", "scrolling_allowed wiki_a1"],
                        0: {
                            className: ["scrolling_allowed wiki_p35"],
                            div: {
                                className: ["scrolling_allowed market_select pointer wiki_h17 wiki_base1 wiki_bT", "scrolling_allowed market_select pointer wiki_h35 wiki_base1 wiki_bT"],
                                onclick: [function() {
                                    Mods.Wikimd.sortWiki(null , "enchant", "name")
                                }
                                ]
                            },
                            img: {
                                className: ["scrolling_allowed hidden", "scrolling_allowed wiki_img"]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_name"],
                                innerHTML: ["Item Name"],
                                style: [{
                                    marginTop: "-8px"
                                }]
                            }
                        },
                        1: {
                            className: ["scrolling_allowed hidden"]
                        },
                        2: {
                            className: ["scrolling_allowed wiki_p65"],
                            div: {
                                className: ["scrolling_allowed market_select wiki_h17 wiki_base1 wiki_h17 wiki_bT wiki_bL", "scrolling_allowed market_select wiki_base2 wiki_pad2 wiki_bT wiki_bL wiki_mR wiki_mL"],
                                onclick: [function() {}
                                ]
                            },
                            text: {
                                className: ["scrolling_allowed wiki_base1 wiki_nameImg", "scrolling_allowed"],
                                innerHTML: ["Enchant Chain"]
                            }
                        }
                    }
                }
            },
            m = 0; 300 > m; m++) {
                var C = function(b) {
                    return "<div style='padding-top: 3px'>" + b + "</div>"
                }
                ;
                g = m - 1;
                removeClass(getElem("wiki_row0_" + m), "hidden");
                if (!e || m > e.length)
                    break;
                if (0 < m) {
                    if (void 0 == e[g])
                        break;
                    E = Mods.Wikimd.tableData(g, b, e);
                    if (!E)
                        break;
                    q = E.item;
                    y = E.drops;
                    u = E.img;
                    items = E.items;
                    A = E.images;
                    v = E.max_chance;
                    B = E.min_chance;
                    F = E.n_onclick;
                    x = E.mins;
                    G = E.magic;
                    E = q.object && "Anvil" == q.object.name ? Mods.findWithAttr(FORGE_FORMULAS, "item_id", Mods.Wikimd.formulas[e[g]].id) : 0
                }
                for (r = 1; 3 > r; r++)
                    if (t = getElem("wiki_row" + r + "_" + m),
                    void 0 == k[f][r])
                        t.className = "scrolling_allowed hidden";
                    else
                        for (t.className = 0 == m ? k[f][r].className[0] : k[f][r].className[1],
                        t = 0; 6 > t; t++)
                            if (n = getElem("wiki_row" + r + "_col" + t + "_" + m),
                            void 0 == k[f][r][t])
                                n.className = "scrolling_allowed hidden";
                            else
                                for (p in n.className = k[f][r][t].className,
                                n = getElem("wiki_row" + r + "_col" + t + "_div_" + m),
                                w = getElem("wiki_row" + r + "_col" + t + "_img_" + m),
                                D = getElem("wiki_row" + r + "_col" + t + "_text_" + m),
                                n = {
                                    div: n,
                                    img: w,
                                    text: D
                                },
                                n)
                                    null != n[p] && void 0 != k[f][r][t][p] && (0 == m ? (n[p].className = k[f][r][t][p].className[0],
                                    k[f][r][t][p].innerHTML && (n[p].innerHTML = k[f][r][t][p].innerHTML[0]),
                                    k[f][r][t][p].onclick && (n[p].onclick = k[f][r][t][p].onclick[0]),
                                    k[f][r][t][p].style && (n[p].style.marginTop = k[f][r][t][p].style[0].marginTop)) : (w = void 0 != k[f][r][t][p].className[1] ? k[f][r][t][p].className[1] : k[f][r][t][p].className[0],
                                    n[p].className = w));
                0 < m && ("monster" != f && (r = getElem("wiki_row2_col0_img_" + m),
                t = getElem("wiki_row2_col0_text_" + m),
                r.style.top = null ,
                r.style.left = null ,
                r.style.width = null ,
                r.style.height = null ,
                r.style.marginLeft = null ,
                r.style.marginTop = null ,
                t.style.width = null ,
                t.style.textAlign = null ,
                t.style.top = null ,
                t.style.left = null ),
                "item" == f ? (getElem("wiki_row1_col0_" + m).setAttribute("oncontextmenu", "Mods.Wikimd.nameMenu('item'," + q.id + ")"),
                getElem("wiki_row1_col0_div_" + m).style.height = "",
                getElem("wiki_row1_col0_img_" + m).style.background = Items.get_background(q.id),
                getElem("wiki_row1_col0_img_" + m).item_id = q.id,
                getElem("wiki_row1_col0_text_" + m).innerHTML = C(q.name) + (!Mods.isLoaded("Gearmd") || 0 != item_base[q.id].b_t && 2 != item_base[q.id].b_t && 5 != item_base[q.id].b_t && 7 != item_base[q.id].b_t ? "" : "<span style='position: absolute; bottom: -10px; right: 0px; font-size: 10px; color: #999;' onclick='javascript: Mods.Gearmd.changeTryOn(true, " + q.id + ");';>(Try On)</span>"),
                getElem("wiki_row1_col0_text_" + m).style.marginTop = 18 > q.name.length ? "-8px" : "-15px",
                getElem("wiki_row1_col1_div_" + m).style.height = "",
                getElem("wiki_row1_col1_text_" + m).innerHTML = C(q.level),
                getElem("wiki_row1_col2_text_" + m).innerHTML = C(q.skill),
                getElem("wiki_row1_col3_text_" + m).innerHTML = C(q.price + " coins"),
                getElem("wiki_row1_col4_text_" + m).innerHTML = C(q.slot),
                getElem("wiki_row2_col1_div_" + m).style.height = "",
                getElem("wiki_row2_col1_text_" + m).innerHTML = C(q.params.power || "-"),
                getElem("wiki_row2_col2_div_" + m).style.height = "",
                getElem("wiki_row2_col2_text_" + m).innerHTML = C(q.params.aim || "-"),
                getElem("wiki_row2_col3_text_" + m).innerHTML = C(q.params.armor || "-"),
                getElem("wiki_row2_col4_text_" + m).innerHTML = C(q.params.magic || "-"),
                getElem("wiki_row2_col5_text_" + m).innerHTML = C(q.params.speed || "-")) : "monster" == f ? (getElem("wiki_row1_col0_" + m).setAttribute("oncontextmenu", ""),
                getElem("wiki_row1_col0_div_" + m).style.height = "",
                getElem("wiki_row1_col0_text_" + m).style.marginTop = "",
                getElem("wiki_row1_col0_text_" + m).innerHTML = C("Respawn: " + x + " Minute" + (1 < x ? "s" : "")),
                getElem("wiki_row1_col1_div_" + m).style.height = "",
                getElem("wiki_row1_col1_text_" + m).innerHTML = C(FIGHT.calculate_monster_level(q)),
                getElem("wiki_row1_col2_text_" + m).innerHTML = C(q.params.health),
                getElem("wiki_row1_col3_text_" + m).innerHTML = C(q.temp.total_accuracy),
                getElem("wiki_row1_col4_text_" + m).innerHTML = C(q.temp.total_strength),
                getElem("wiki_row1_col5_text_" + m).innerHTML = C(q.temp.total_defense),
                getElem("wiki_row2_col0_" + m).setAttribute("oncontextmenu", "Mods.Wikimd.nameMenu('monster'," + q.b_i + ")"),
                getElem("wiki_row2_col0_div_" + m).style.height = 22 > y.length ? "109px" : 36 * (Math.ceil(y.length / 7) - 3) + 109 + "px",
                r = getElem("wiki_row2_col0_img_" + m),
                g = [54, 64],
                u ? (g = scaleSize(64, 64, u.tile_width, u.tile_height),
                r.style.background = 'url("' + u.url + '") no-repeat scroll ' + -q.img.x * u.tile_width + "px " + -q.img.y * u.tile_height + "px transparent") : r.style.background = 'url("' + getBodyImgNoHalo(q.img.hash).toDataURL("image/png") + '") no-repeat scroll transparent',
                r.item_id = !1,
                r.style.top = "60px",
                r.style.left = "50%",
                r.style.width = g[0] + "px",
                r.style.height = g[1] + "px",
                r.style.marginLeft = -Math.ceil(g[0] / 2) + "px",
                r.style.marginTop = -Math.ceil(g[1] / 2) + "px",
                t = getElem("wiki_row2_col0_text_" + m),
                t.innerHTML = C(q.name),
                t.style.marginTop = "10px",
                t.style.width = "100%",
                t.style.textAlign = "center",
                t.style.top = "0",
                t.style.left = "0",
                getElem("wiki_row2_col1_div_" + m).style.height = 22 > y.length ? "108px" : 36 * (Math.ceil(y.length / 7) - 3) + 108 + "px",
                getElem("wiki_row2_col1_text_" + m).innerHTML = A) : "vendor" == f ? (getElem("wiki_row1_col0_" + m).setAttribute("oncontextmenu", ""),
                getElem("wiki_row1_col0_div_" + m).style.height = 8 > y.length ? "36px" : 15 > y.length ? "72px" : 36 * (Math.ceil(y.length / 7) - 2) + 72 + "px",
                u ? getElem("wiki_row1_col0_img_" + m).style.background = 'url("' + u.url + '") no-repeat scroll ' + -q.img.x * u.tile_width + "px " + -q.img.y * u.tile_height + "px transparent" : getElem("wiki_row1_col0_img_" + m).style.background = 'url("' + getBodyImgNoHalo(q.img.hash).toDataURL("image/png") + '") no-repeat scroll -12px -10px transparent',
                getElem("wiki_row1_col0_img_" + m).item_id = !1,
                getElem("wiki_row1_col0_text_" + m).innerHTML = C(q.name),
                getElem("wiki_row1_col0_text_" + m).style.marginTop = 18 > q.name.length ? "-8px" : "-15px",
                getElem("wiki_row1_col1_div_" + m).style.height = 8 > y.length ? "36px" : 15 > y.length ? "72px" : 36 * (Math.ceil(y.length / 7) - 2) + 72 + "px",
                getElem("wiki_row1_col1_text_" + m).innerHTML = A) : "craft" == f ? (getElem("wiki_row1_col0_" + m).setAttribute("oncontextmenu", ""),
                getElem("wiki_row1_col0_div_" + m).style.height = "",
                getElem("wiki_row1_col0_text_" + m).style.marginTop = "",
                getElem("wiki_row1_col0_text_" + m).innerHTML = C(q.object.name),
                getElem("wiki_row1_col1_div_" + m).style.height = "",
                getElem("wiki_row1_col1_text_" + m).innerHTML = C(q.level),
                getElem("wiki_row1_col2_text_" + m).innerHTML = C(capitaliseFirstLetter(q.skill.slice(0, 7))),
                getElem("wiki_row1_col3_text_" + m).innerHTML = C(B),
                getElem("wiki_row1_col4_text_" + m).innerHTML = C(v),
                getElem("wiki_row1_col5_text_" + m).innerHTML = C(q.xp || "-"),
                getElem("wiki_row2_col0_" + m).setAttribute("oncontextmenu", "Mods.Wikimd.nameMenu('item'," + q.id + ")"),
                getElem("wiki_row2_col0_div_" + m).setAttribute("onclick", F),
                getElem("wiki_row2_col0_div_" + m).style.height = 8 > items ? "36px" : 15 > items ? "72px" : 36 * (Math.ceil(items / 7) - 2) + 72 + "px",
                getElem("wiki_row2_col0_img_" + m).style.background = Items.get_background(q.id),
                getElem("wiki_row2_col0_img_" + m).item_id = q.id,
                getElem("wiki_row2_col0_text_" + m).innerHTML = C(q.name + ("Anvil" == q.object.name ? "<br/><span class='common_link' style='font-size:.8em;color:#999999;'>(Formula)</span>" + (-1 < loadedMods.indexOf("Forgem") ? "<span class='common_link' style='font-size:.8em;color:#999999;' onclick='Mods.Forgem.newRecipe(" + E + ");event.stopPropagation();'>(Learn)</span>" : "") : "")),
                getElem("wiki_row2_col0_text_" + m).style.marginTop = 18 > q.name.length ? "-8px" : "-15px",
                getElem("wiki_row2_col1_div_" + m).style.height = 8 > items ? "36px" : 15 > items ? "72px" : 36 * (Math.ceil(items / 7) - 2) + 72 + "px",
                getElem("wiki_row2_col1_text_" + m).innerHTML = A) : "pet" == f ? (getElem("wiki_row1_col0_" + m).setAttribute("oncontextmenu", ""),
                getElem("wiki_row1_col0_div_" + m).style.height = "",
                getElem("wiki_row1_col0_img_" + m).style.background = "",
                getElem("wiki_row1_col0_img_" + m).item_id = !1,
                getElem("wiki_row1_col0_text_" + m).innerHTML = C(0 < pets[q.params.pet].params.stones ? "Stones of Evolution: " + pets[q.params.pet].params.stones : 0 < pets[q.params.pet].params.xp_required ? "Exp: " + thousandSeperate(parseInt(pets[q.params.pet].params.xp_required)) : "Cannot be leveled"),
                getElem("wiki_row1_col0_text_" + m).style.marginTop = "",
                getElem("wiki_row1_col1_div_" + m).style.height = "",
                getElem("wiki_row1_col1_text_" + m).innerHTML = C(q.params.aim ? q.params.aim : "-"),
                getElem("wiki_row1_col2_text_" + m).innerHTML = C(q.params.power ? q.params.power : "-"),
                getElem("wiki_row1_col3_text_" + m).innerHTML = C(q.params.armor ? q.params.armor : "-"),
                getElem("wiki_row1_col4_text_" + m).innerHTML = C(q.params.magic ? q.params.magic : "-"),
                getElem("wiki_row1_col5_text_" + m).innerHTML = C(q.params.speed ? q.params.speed : "-"),
                getElem("wiki_row2_col0_" + m).setAttribute("oncontextmenu", "Mods.Wikimd.nameMenu('" + f + "'," + item_base[e[g]].b_i + ")"),
                getElem("wiki_row2_col0_div_" + m).style.height = 6 > y.length ? "38px" : 11 > y.length ? "73px" : 36 * (Math.ceil(y.length / 5) - 2) + 73 + "px",
                getElem("wiki_row2_col0_img_" + m).style.background = Items.get_background(q.b_i),
                getElem("wiki_row2_col0_img_" + m).item_id = q.b_i,
                g = pets[q.params.pet].name.replace(/\[(Ancient|Legendary|Rare|Common)\]/gi, function(b, e) {
                    return "[<span style='color: " + {
                        Ancient: COLOR.RED,
                        Legendary: COLOR.ORANGE,
                        Rare: COLOR.YELLOW,
                        Common: COLOR.GREEN
                    }[e] + ";;'>" + e.slice(0, 1) + "</span>]"
                }),
                getElem("wiki_row2_col0_text_" + m).innerHTML = C(g + "<span style='color:#999; font-size:.9em'><br>(" + (void 0 != Mods.Wikimd.family[q.b_i] ? Mods.Wikimd.family[q.b_i] : "Crafted") + ")</span><span style='position: absolute; right: 0px; bottom: 0px; font-size: .8em; color: #CCC'>" + pets[q.params.pet].params.inventory_slots + " slots</span>"),
                getElem("wiki_row2_col0_text_" + m).style.marginTop = 20 > pets[q.params.pet].name.length ? "-12px" : "-17px",
                getElem("wiki_row2_col1_div_" + m).style.height = 6 > y.length ? "36px" : 11 > y.length ? "71px" : 36 * (Math.ceil(y.length / 5) - 2) + 71 + "px",
                getElem("wiki_row2_col1_text_" + m).innerHTML = A) : "spell" == f ? (getElem("wiki_row1_col0_" + m).setAttribute("oncontextmenu", "Mods.Wikimd.nameMenu('item'," + q.id + ")"),
                getElem("wiki_row1_col0_div_" + m).style.height = "",
                getElem("wiki_row1_col0_img_" + m).style.background = Items.get_background(q.id),
                getElem("wiki_row1_col0_img_" + m).item_id = q.id,
                getElem("wiki_row1_col0_text_" + m).innerHTML = C(q.name),
                getElem("wiki_row1_col0_text_" + m).style.marginTop = 18 > q.name.length ? "-8px" : "-15px",
                getElem("wiki_row1_col1_div_" + m).style.height = "",
                getElem("wiki_row1_col1_text_" + m).innerHTML = C(G.min_level),
                getElem("wiki_row1_col2_text_" + m).innerHTML = C(Math.round(G.cooldown / 100) / 10 + " <span style='color: #8CD'>secs</span>"),
                getElem("wiki_row1_col3_text_" + m).innerHTML = C(thousandSeperate(q.params.price)),
                getElem("wiki_row1_col4_text_" + m).innerHTML = C(G.uses),
                getElem("wiki_row1_col5_text_" + m).innerHTML = C(Math.round(q.params.price / (G.cooldown / 1E3 * G.uses) * 10) / 10 + " <span style='color: #8CD'>cps</span>"),
                getElem("wiki_row2_col1_div_" + m).style.height = "",
                getElem("wiki_row2_col1_text_" + m).innerHTML = C(G.basic_damage + " <span style='color: #DD8'>dmg</span>"),
                getElem("wiki_row2_col2_div_" + m).style.height = "",
                getElem("wiki_row2_col2_text_" + m).innerHTML = C(G.xp + " <span style='color: #DD8'>exp</span>"),
                getElem("wiki_row2_col3_text_" + m).innerHTML = C(G.penetration),
                getElem("wiki_row2_col4_text_" + m).innerHTML = C(Math.round(G.basic_damage / (G.cooldown / 1E3) * 10) / 10 + " <span style='color: #DD8'>dps</span>"),
                getElem("wiki_row2_col5_text_" + m).innerHTML = C(Math.round(G.xp / (G.cooldown / 1E3) * 10) / 10 + " <span style='color: #DD8'>eps</span>")) : "enchant" == f && (getElem("wiki_row1_col0_" + m).setAttribute("oncontextmenu", ""),
                getElem("wiki_row1_col0_div_" + m).style.height = "",
                getElem("wiki_row1_col0_text_" + m).style.marginTop = "",
                getElem("wiki_row1_col0_text_" + m).innerHTML = C(item_base[q.enchant.to_enchant].name.replace("Enchanted", "Ench").replace("Necklace", "Neck")),
                getElem("wiki_row1_col2_text_" + m).innerHTML = C(Math.round(100 * q.enchant.low) + "%"),
                getElem("wiki_row1_col3_text_" + m).innerHTML = C(Math.round(100 * q.enchant.med) + "%"),
                getElem("wiki_row1_col4_text_" + m).innerHTML = C(Math.round(100 * q.enchant.high) + "%"),
                getElem("wiki_row1_col5_text_" + m).innerHTML = C(Math.round(100 * q.enchant.sup) + "%"),
                getElem("wiki_row2_col0_" + m).setAttribute("oncontextmenu", "Mods.Wikimd.nameMenu('item'," + q.id + ")"),
                getElem("wiki_row2_col0_div_" + m).style.height = "38px",
                getElem("wiki_row2_col0_img_" + m).style.background = Items.get_background(q.id),
                getElem("wiki_row2_col0_img_" + m).item_id = q.id,
                getElem("wiki_row2_col0_text_" + m).innerHTML = C(q.name),
                getElem("wiki_row2_col0_text_" + m).style.marginTop = 25 > q.name.length ? "-8px" : "-15px",
                getElem("wiki_row2_col2_div_" + m).style.height = "36px",
                getElem("wiki_row2_col2_text_" + m).innerHTML = A));
                Mods.Wikimd.setSpan(f, m)
            }
    }
    ;
    Mods.Wikimd.tableData = function(b, e, f) {
        var g, k, m, n, p, r, t, q, u, x, y, A, B, v;
        A = getElem("mods_wiki_type").value;
        g = e[f[b]];
        if (!g)
            return !1;
        k = IMAGE_SHEET[g.img.sheet];
        r = p = n = "";
        m = {};
        e = 0;
        n_onclick = x = y = "";
        t = 0;
        v = {};
        if ("monster" == A) {
            m = g.params.drops;
            for (q in m)
                A = item_base[m[q].id],
                n = n + "<a title='" + Mods.cleanText(A.name) + "(" + 100 * m[q].chance + "%)'><div item_id='" + A.b_i + "' style='" + Items.get_background_image(A.b_i).replace(/\"/g, "&apos;") + " width:32px; height:32px; margin:2px; margin-left: 4px; display:inline-block; float:left;' oncontextmenu='Mods.Wikimd.nameMenu(&apos;item&apos;," + A.b_i + ")'>&nbsp;</div></a>";
            t = Math.round((g.params.health + 60) / 60)
        } else if ("vendor" == A) {
            m = g.temp.content;
            for (q in m)
                A = item_base[m[q].id],
                m[q].spawn ? p = p + "<a title='" + Mods.cleanText(A.name) + " (buys & sells) value " + thousandSeperate(A.params.price) + "'><div item_id='" + A.b_i + "' style='" + Items.get_background_image(A.b_i).replace(/\"/g, "&apos;") + " background-color: #666666; width:32px; height:32px; margin:2px; margin-left: 4px; display:inline-block; float:left;' oncontextmenu='Mods.Wikimd.nameMenu(&apos;item&apos;," + A.b_i + ")'>&nbsp;</div></a>" : r = r + "<a title='" + Mods.cleanText(A.name) + " (buys) value " + thousandSeperate(A.params.price) + "'><div item_id='" + A.b_i + "' style='" + Items.get_background_image(A.b_i).replace(/\"/g, "&apos;") + " width:32px; height:32px; margin:2px; margin-left: 4px; display:inline-block; float:left;' oncontextmenu='Mods.Wikimd.nameMenu(&apos;item&apos;," + A.b_i + ")'>&nbsp;</div></a>";
            n = p + r
        } else if ("craft" == A) {
            B = g.pattern.requires;
            requires_one_from = g.pattern.requires_one_from || [];
            e = 0;
            tooMany = function(b) {
                return 1 < Math.max(B[b] || 0, g.pattern.consumes[b] || 0) && !0 || !1
            }
            ;
            for (q in requires_one_from)
                "undefined" != typeof item_base[requires_one_from[q]] && (A = item_base[requires_one_from[q]],
                p = p + "<a title='" + Mods.cleanText(A.name) + "'><div item_id='" + A.b_i + "' style='" + Items.get_background_image(A.b_i).replace(/\"/g, "&apos;") + " background-color: #666666; width:32px; height:32px; margin:2px; margin-left: 4px; display:inline-block; float:left;' oncontextmenu='Mods.Wikimd.nameMenu(&apos;item&apos;," + A.b_i + ")'>&nbsp;</div></a>");
            for (q in B)
                if ("length" != q && "undefined" != typeof item_base[q])
                    for (u = 0; u < Math.max(B[q], g.pattern.consumes[q] || 0); u++)
                        A = item_base[q],
                        "undefined" == typeof g.pattern.consumes[q] ? (p = p + "<a title='" + Mods.cleanText(A.name) + " (not consumed) x" + Math.max(B[q], g.pattern.consumes[q] || 0) + "'><div item_id='" + A.b_i + "' style='" + Items.get_background_image(A.b_i).replace(/\"/g, "&apos;") + " background-color: #666666; width:32px; height:32px; margin:2px; margin-left: 4px; display:inline-block; float:left;' oncontextmenu='Mods.Wikimd.nameMenu(&apos;item&apos;," + A.b_i + ")'>&nbsp;</div></a>",
                        tooMany(q) && (u = Math.max(B[q], g.pattern.consumes[q] || 0)) && (p += "<div style='width:32px; height:20px; margin:2px; margin-left: 4px; margin-top: 14px; display:inline-block; float:left; text-align: center;'> x" + u + "</div>")) : (r = r + "<a title='" + Mods.cleanText(A.name) + " (consumed) x" + Math.max(B[q], g.pattern.consumes[q] || 0) + "'><div item_id='" + A.b_i + "' style='" + Items.get_background_image(A.b_i).replace(/\"/g, "&apos;") + " width:32px; height:32px; margin:2px; margin-left: 4px; display:inline-block; float:left;' oncontextmenu='Mods.Wikimd.nameMenu(&apos;item&apos;," + A.b_i + ")'>&nbsp;</div></a>",
                        tooMany(q) && (u = Math.max(B[q], g.pattern.consumes[q] || 0)) && (r += "<div style='width:32px; height:20px; margin:2px; margin-left: 4px; margin-top: 14px; display:inline-block; float:left; text-align: center;'> x" + u + "</div>"));
            for (q in g.pattern.consumes)
                if ("length" != q && "undefined" != typeof item_base[q] && "undefined" == typeof B[q])
                    for (u = 0; u < g.pattern.consumes[q]; u++)
                        A = item_base[q],
                        r = r + "<a title='" + Mods.cleanText(A.name) + " (consumed) x" + g.pattern.consumes[q] + "'><div item_id='" + A.b_i + "' style='" + Items.get_background_image(A.b_i).replace(/\"/g, "&apos;") + " width:32px; height:32px; margin:2px; margin-left: 4px; display:inline-block; float:left;' oncontextmenu='Mods.Wikimd.nameMenu(&apos;item&apos;," + A.b_i + ")'>&nbsp;</div></a>",
                        tooMany(q) && (u = g.pattern.consumes[q]) && (r += "<div item_id='" + A.b_i + "' style='width:32px; height:20px; margin:2px; margin-left: 4px; margin-top: 14px; display:inline-block; float:left; text-align: center;'> x" + u + "</div>");
            for (q in B)
                "length" != q && (u = Math.max(B[q], g.pattern.consumes[q] || 0),
                e += 1 >= u && u || 2);
            for (q in g.pattern.consumes)
                "undefined" == typeof B[q] && "length" != q && (u = parseInt(g.pattern.consumes[q]),
                e += 1 >= u && u || 2);
            n = p + r;
            x = g.pattern.base_chance || g.pattern.chance || "-";
            x = "number" == typeof x ? Math.round(1E4 * x) / 100 + "%" : x;
            y = g.pattern.max_chance || g.pattern.chance || 1;
            y = "number" == typeof y ? Math.round(1E4 * y) / 100 + "%" : y;
            n_onclick = "";
            "Anvil" == g.object.name && (n_onclick = "Mods.Wikimd.showFormula('" + f[b] + "');")
        } else if ("pet" == A)
            for (q in m = Mods.Wikimd.pet_family[g.b_i],
            m.length = 0,
            m) {
                if ("number" == typeof parseInt(q) && "undefined" != typeof item_base[m[q]] && void 0 != item_base[m[q]].params.pet)
                    if (void 0 == Mods.Wikimd.pet_family[g.b_i].id)
                        A = item_base[m[q]],
                        m.length += 1,
                        "" != n && (n += "<span style='font-size: .8em; height: 32px; width: 10px; margin: 2px; display:inline-block; float:left; position: relative; color: #999;'><span style='position: absolute; width: 100%; top: 40%; right: 10%;'>&gt;</span></span>"),
                        n = A.b_i == g.b_i ? n + ("<a title='" + Mods.cleanText(A.name) + "'><div item_id='" + A.b_i + "' style='" + Items.get_background_image(A.b_i).replace("transparent", "#666").replace(/\"/g, "&apos;") + " width:32px; height:32px; margin:2px; margin-left: 4px; display:inline-block; float:left;' oncontextmenu='Mods.Wikimd.nameMenu(&apos;item&apos;," + A.b_i + ")'>&nbsp;</div></a>") : n + ("<a title='" + Mods.cleanText(A.name) + "'><div item_id='" + A.b_i + "' style='" + Items.get_background_image(A.b_i).replace(/\"/g, "&apos;") + " width:32px; height:32px; margin:2px; margin-left: 4px; display:inline-block; float:left;' oncontextmenu='Mods.Wikimd.nameMenu(&apos;item&apos;," + A.b_i + ")'>&nbsp;</div></a>");
                    else {
                        A = Mods.Wikimd.pet_family[g.b_i].pattern;
                        f = A.consumes;
                        B = A.requires;
                        for (u in B)
                            if ("number" == typeof parseInt(u) && void 0 != item_base[u] && void 0 != item_base[u].img && void 0 == f[u])
                                for (b = 0; b < B[u]; b++)
                                    A = item_base[u],
                                    m.length += 1,
                                    "" != n && (n += "<span style='font-size: .8em; height: 32px; width: 10px; margin: 2px; display:inline-block; float:left; position: relative; color: #999;'><span style='position: absolute; width: 100%; top: 40%; right: 10%;'>+</span></span>"),
                                    n += "<a title='" + Mods.cleanText(A.name) + "'><div item_id='" + A.b_i + "' style='" + Items.get_background_image(A.b_i).replace("transparent", "#666").replace(/\"/g, "&apos;") + " width:32px; height:32px; margin:2px; margin-left: 4px; display:inline-block; float:left;' oncontextmenu='Mods.Wikimd.nameMenu(&apos;item&apos;," + A.b_i + ")'>&nbsp;</div></a>";
                        for (u in f)
                            if ("number" == typeof parseInt(u) && void 0 != item_base[u] && void 0 != item_base[u].img)
                                for (b = 0; b < f[u]; b++)
                                    A = item_base[u],
                                    m.length += 1,
                                    "" != n && (n += "<span style='font-size: .8em; height: 32px; width: 10px; margin: 2px; display:inline-block; float:left; position: relative; color: #999;'><span style='position: absolute; width: 100%; top: 40%; right: 10%;'>+</span></span>"),
                                    n += "<a title='" + Mods.cleanText(A.name) + "'><div item_id='" + A.b_i + "' style='" + Items.get_background_image(A.b_i).replace(/\"/g, "&apos;") + " width:32px; height:32px; margin:2px; margin-left: 4px; display:inline-block; float:left;' oncontextmenu='Mods.Wikimd.nameMenu(&apos;item&apos;," + A.b_i + ")'>&nbsp;</div></a>";
                        A = item_base[g.b_i];
                        m.length += 1;
                        n += "<span style='font-size: .8em; height: 32px; width: 10px; margin: 2px; display:inline-block; float:left; position: relative; color: #999;'><span style='position: absolute; width: 100%; top: 40%; right: 10%;'>=</span></span>";
                        n += "<a title='" + Mods.cleanText(A.name) + "'><div item_id='" + A.b_i + "' style='" + Items.get_background_image(A.b_i).replace("transparent", "#666").replace(/\"/g, "&apos;") + " width:32px; height:32px; margin:2px; margin-left: 4px; display:inline-block; float:left;' oncontextmenu='Mods.Wikimd.nameMenu(&apos;item&apos;," + A.b_i + ")'>&nbsp;</div></a>"
                    }
            }
        else if ("enchant" == A)
            for (m = [g.enchant.from_enchant, g.id, g.enchant.to_enchant],
            b = 0; 3 > b; b++)
                m[b] && (A = item_base[m[b]],
                q = m[b] == g.id ? "#666" : "transparent",
                "" != n && (n += "<span style='font-size: .8em; height: 32px; width: 10px; margin: 2px; display:inline-block; float:left; position: relative; color: #999;'><span style='position: absolute; width: 100%; top: 40%; right: 10%;'>&gt;</span></span>"),
                n += "<a title='" + Mods.cleanText(A.name) + "'><div item_id='" + A.b_i + "' style='" + Items.get_background_image(A.b_i).replace("transparent", q).replace(/\"/g, "&apos;") + " width:32px; height:32px; margin:2px; margin-left: 4px; display:inline-block; float:left;' oncontextmenu='Mods.Wikimd.nameMenu(&apos;item&apos;," + A.b_i + ")'>&nbsp;</div></a>");
        else
            "spell" == A && (v = g.magic);
        return {
            item: g,
            img: k,
            drops: m,
            items: e,
            images: n,
            max_chance: y,
            min_chance: x,
            n_onclick: n_onclick,
            mins: t,
            magic: v
        }
    }
    ;
    Mods.Wikimd.showFormula = function(b) {
        if ("undefined" != typeof b) {
            b = Mods.Wikimd.formulas[b].pattern.pattern;
            getElem("wiki_recipe_form").style.display = "block";
            for (var e = 0; 4 > e; e++)
                for (var f = 0; 4 > f; f++) {
                    var g = getElem("wiki_formula_" + e + "_" + f);
                    g.style.background = "";
                    "undefined" != typeof b[e] && "undefined" != typeof b[e][f] && "undefined" != typeof item_base[b[e][f]] && (g.style.background = Items.get_background(item_base[b[e][f]].b_i))
                }
        }
    }
    ;
    Mods.Wikimd.setSpan = function(b, e) {
        for (var f = Mods.Wikimd.span, g, k, m, n = 1; 3 > n; n++)
            for (var p = 0; 6 > p; p++)
                g = getElem("wiki_row" + n + "_col" + p + "_" + e),
                void 0 != f[b] && (k = f[b]["wiki_r" + n + "_c" + p],
                "undefined" != typeof k ? (m = k.c || "",
                k = k.r || "") : k = m = "",
                g.setAttribute("colspan", m),
                g.setAttribute("rowspan", k))
    }
    ;
    Mods.Wikimd.sortWiki = function(b, e, f) {
        if ("undefined" != typeof e && "undefined" != typeof f) {
            var g = !1;
            if ("object" != typeof b || null == b)
                g = !0;
            var k = !1;
            Mods.Wikimd.oldSortValue != Mods.Wikimd.newSortValue || Mods.Wikimd.sortReverse ? Mods.Wikimd.oldSortValue != Mods.Wikimd.newSortValue && (Mods.Wikimd.sortReverse = !1) : k = !0;
            Mods.Wikimd.oldSortValue = Mods.Wikimd.newSortValue;
            b = null == b ? Mods.Wikimd.newWikiLoad : b;
            e = getElem("mods_wiki_type").value;
            f = f || Mods.Wikimd.oldSort[e];
            if ("object" == typeof b) {
                var m = function(e) {
                    e.sort(function(e, g) {
                        var k, m, n, p, r, q, u;
                        k = getElem("mods_wiki_type").value;
                        u = function(b) {
                            return "damage" == b ? "basic_damage" : "exp" == b ? "xp" : "casts" == b ? "uses" : b
                        }
                        ;
                        "item" == k ? q = function(e, f) {
                            return -1 < e && b[e] ? "name" == f || "level" == f || "skill" == f || "slot" == f ? b[e][f] : b[e].params[f] || 0 : 0
                        }
                        : "monster" == k ? q = function(e, f) {
                            return -1 < e && b[e] ? "name" == f ? b[e][f] : "level" == f ? FIGHT.calculate_monster_level(b[e]) : "health" == f || "respawn" == f ? b[e].temp.health : b[e].temp["total_" + f] : 0
                        }
                        : "craft" == k ? q = function(e, f) {
                            return -1 < e && b[e] ? "base_chance" == f || "max_chance" == f ? b[e].pattern[f] || b[e].pattern.chance || 1 : "location" == f ? b[e].object.name || 0 : "xp" == f ? parseInt(b[e].xp) || 0 : "level" == f ? parseInt(b[e].level) || 0 : b[e][f] : 0
                        }
                        : "pet" == k ? q = function(e, f) {
                            return -1 < e && b[e] ? "name" == f ? pets[b[e].params.pet][f] : "xp_required" == f || "stones" == f || "inventory_slots" == f ? pets[b[e].params.pet].params[f] : "family" == f ? Mods.Wikimd.family[e] : b[e].params[f] : 0
                        }
                        : "spell" == k ? q = function(e, f) {
                            if (!(-1 < e && b[e]))
                                return 0;
                            var g = u(f)
                              , k = b[e].magic;
                            return "dmg_s" == g ? Math.round(k.basic_damage / (k.cooldown / 1E3) * 100) / 100 : "cost_s" == g ? Math.round(b[e].params.price / (k.uses * k.cooldown / 1E3) * 100) / 100 : "exp_s" == g ? Math.round(k.xp / (k.cooldown / 1E3) * 100) / 100 : "level" == g ? k.min_level : "name" == g ? b[e].name : k[g]
                        }
                        : "enchant" == k && (q = function(e, f) {
                            return -1 < e && b[e] ? "name" == f ? b[e].name : "enchant" == f ? item_base[b[e].enchant.to_enchant].name : b[e].enchant[f] : 0
                        }
                        );
                        if ("vendor" == k)
                            return b[g][f] > b[e][f] && !t || b[g][f] < b[e][f] && t ? 1 : -1;
                        k = q(e, f);
                        m = q(e, vold);
                        n = q(e, last);
                        p = q(g, f);
                        r = q(g, vold);
                        q = q(g, last);
                        return k > p ? -1 : k < p ? 1 : m > r ? -1 : m < r ? 1 : n > q ? -1 : n < q ? 1 : 0
                    })
                }
                , n = [], p;
                for (p in b)
                    n.push(p);
                var r = Mods.Wikimd.oldSort || {}
                  , t = !1;
                "item" == e ? (vold = "undefined" != typeof r.item ? r.item : "name" != f ? "name" : "level",
                last = "name" != f && "name" != vold ? "name" : "level" != f && "level" != vold ? "level" : "price") : "monster" == e ? (vold = r.monster ? r.monster : "name" != f ? "name" : "level",
                last = "name" != f && "name" != vold ? "name" : "health") : "craft" == e ? (vold = "xp" != f ? "xp" : "level",
                last = "xp" != f && "xp" != vold ? "xp" : "level" != f && "level" != vold ? "level" : "name") : "pet" == e ? (vold = r.pet ? r.pet : "family" != f ? "family" : "inventory_slots",
                last = "family" != f && "family" != vold ? "family" : "inventory_slots" != f && "inventory_slots" != vold ? "inventory_slots" : "name") : "enchant" == e ? (vold = r.enchant ? r.enchant : "low" != f ? "low" : "name",
                last = "low" != f && "low" != vold ? "low" : "name" != f && "name" != vold ? "name" : "enchant") : "spell" == e && (vold = r.spell ? r.spell : "level" != f ? "level" : "name",
                last = "level" != f && "level" != vold ? "level" : "name" != f && "name" != vold ? "name" : "exp");
                r[e] == f && k && (t = !0) && (Mods.Wikimd.sortReverse = !0) || (r[e] = f) && (Mods.Wikimd.sortReverse = !1);
                if ("vendor" == e)
                    m(n);
                else {
                    k = [];
                    r = [];
                    for (p in n) {
                        var q, u;
                        q = function(b) {
                            return "damage" == b ? "basic_damage" : "exp" == b ? "xp" : "casts" == b ? "uses" : b
                        }
                        ;
                        "item" == e ? u = function(e, f) {
                            return -1 < e && b[e] ? "name" == f || "level" == f || "skill" == f || "slot" == f ? b[e][f] : b[e].params[f] || 0 : 0
                        }
                        : "monster" == e ? u = function(e, f) {
                            return -1 < e && b[e] ? "name" == f ? b[e][f] : "level" == f ? FIGHT.calculate_monster_level(b[e]) : "health" == f || "respawn" == f ? b[e].temp.health : b[e].temp["total_" + f] : 0
                        }
                        : "craft" == e ? u = function(e, f) {
                            return -1 < e && b[e] ? "base_chance" == f || "max_chance" == f ? b[e].pattern[f] || b[e].pattern.chance || 1 : "location" == f ? b[e].object.name || 0 : "xp" == f ? parseInt(b[e].xp) || 0 : "level" == f ? parseInt(b[e].level) || 0 : b[e][f] : 0
                        }
                        : "pet" == e ? u = function(e, f) {
                            return -1 < e && b[e] ? "name" == f ? pets[b[e].params.pet][f] : "xp_required" == f || "stones" == f || "inventory_slots" == f ? pets[b[e].params.pet].params[f] : "family" == f ? Mods.Wikimd.family[e] : b[e].params[f] : 0
                        }
                        : "spell" == e ? u = function(e, f) {
                            if (!(-1 < e && b[e]))
                                return 0;
                            var g = q(f)
                              , k = b[e].magic;
                            return "dmg_s" == g ? Math.round(k.basic_damage / (k.cooldown / 1E3) * 100) / 100 : "cost_s" == g ? Math.round(b[e].params.price / (k.uses * k.cooldown / 1E3) * 100) / 100 : "exp_s" == g ? Math.round(k.xp / (k.cooldown / 1E3) * 100) / 100 : "level" == g ? k.min_level : "name" == g ? b[e].name : k[g]
                        }
                        : "enchant" == e && (u = function(e, f) {
                            return -1 < e && b[e] ? "name" == f ? b[e].name : "enchant" == f ? item_base[b[e].enchant.to_enchant].name : b[e].enchant[f] : 0
                        }
                        );
                        0 < u(n[p], f) || "family" == f && "string" == typeof u(n[p], f) ? k.push(n[p]) : r.push(n[p])
                    }
                    0 < k.length && m(k);
                    0 < r.length && m(r);
                    t && (k.reverse(),
                    0 == k.length && r.reverse());
                    for (var x in r)
                        k.push(r[x]);
                    n = k
                }
            }
            Mods.Wikimd.oldSortList = n;
            if (g)
                Mods.Wikimd.populateWiki(b, n);
            else
                return n
        }
    }
    ;
    Mods.Wikimd.populateWikiList = function() {
        var b = getElem("mods_wiki_type"), e = getElem("mods_wiki_type_item"), f = getElem("mods_wiki_type_item_type"), g = getElem("mods_wiki_type_item_skill"), k = getElem("mods_wiki_type_monster"), m = getElem("mods_wiki_type_vendor"), n = getElem("mods_wiki_type_craft"), p = getElem("mods_wiki_type_pet"), r = getElem("mods_wiki_type_spell"), t = getElem("mods_wiki_type_enchant"), q = getElem("mods_wiki_type_craft_skill"), u = getElem("mods_wiki_type_craft_source"), x = getElem("mods_wiki_name"), y = getElem("mods_wiki_range"), A = parseInt(getElem("mods_wiki_level_low").value), B = parseInt(getElem("mods_wiki_level_high").value), v = {}, F = Mods.Wikimd.item_formulas, E = Mods.Wikimd.formulas, w;
        if ("undefined" != typeof b.value)
            if ("item" == b.value) {
                for (w in F)
                    v[w] = F[w];
                if ("name" == e.value) {
                    if ("undefined" != typeof x.value)
                        for (w in v)
                            y = v[w].name.toLowerCase(),
                            k = x.value.toLowerCase(),
                            0 > y.indexOf(k) && delete v[w]
                } else {
                    if ("skill" == e.value)
                        if ("-1" != g.value)
                            for (w in v)
                                v[w].skill.toLowerCase() != g.value && delete v[w];
                        else
                            return !1;
                    else if ("type" == e.value)
                        if ("-1" != f.value)
                            for (w in k = f.value,
                            v) {
                                var x = v[w].slot || "none"
                                  , x = x.toLowerCase()
                                  , D = v[w].type || "none"
                                  , D = D.toLowerCase()
                                  , m = v[w].skill || "none"
                                  , m = m.toLowerCase();
                                -1 < k.indexOf(x) && -1 < k.search(D) || x == k || m == k || D == k || delete v[w]
                            }
                        else
                            return !1;
                    if (-1 != y.value)
                        for (w in v)
                            m = "",
                            m = "level" == y.value ? v[w].level : v[w].params[y.value] || null ,
                            null == m && delete v[w],
                            "number" == typeof A && "undefined" != typeof v[w] && (!(m < A) && -1 < m || delete v[w]),
                            "number" == typeof B && "undefined" != typeof v[w] && (!(m > B) && -1 < m || delete v[w])
                }
            } else if ("monster" == b.value || "vendor" == b.value) {
                for (w in npc_base)
                    v[w] = npc_base[w];
                if ("monster" == b.value)
                    for (w in v)
                        if (3 != v[w].type)
                            delete v[w];
                        else if ("name" == k.value)
                            "undefined" != typeof x.value && (b = x.value.toLowerCase(),
                            e = v[w].name.toLowerCase(),
                            -1 == e.indexOf(b) && delete v[w]);
                        else if ("item" == k.value) {
                            r = !1;
                            for (D in v[w].params.drops)
                                "number" == typeof parseInt(D) && (t = v[w].params.drops,
                                b = x.value.toLowerCase(),
                                t = item_base[t[D].id].name,
                                t = t.toLowerCase(),
                                -1 < t.indexOf(b) && (r = !0));
                            r || delete v[w]
                        } else
                            -1 != y.value && "undefined" != typeof v[w] && (m = "level" == y.value ? FIGHT.calculate_monster_level(v[w]) : "health" == y.value ? v[w].temp.health : v[w].temp["total_" + y.value] || null ,
                            null == m && delete v[w],
                            "number" == typeof A && "undefined" != typeof v[w] && (!(m < A) && -1 < m || delete v[w]),
                            "number" == typeof B && "undefined" != typeof v[w] && (!(m > B) && -1 < m || delete v[w]));
                else if ("vendor" == b.value)
                    for (w in v)
                        if (4 != v[w].type)
                            delete v[w];
                        else if ("name" == m.value) {
                            if ("undefined" != typeof x.value)
                                for (w in v)
                                    b = x.value.toLowerCase(),
                                    e = v[w].name.toLowerCase(),
                                    -1 == e.indexOf(b) && delete v[w]
                        } else {
                            if ("item" == m.value) {
                                r = !1;
                                for (D in v[w].temp.content)
                                    "number" == typeof parseInt(D) && (t = v[w].temp.content,
                                    b = x.value.toLowerCase(),
                                    t = item_base[t[D].id].name,
                                    t = t.toLowerCase(),
                                    -1 != t.indexOf(b) && (r = !0));
                                r || delete v[w]
                            }
                        }
                else
                    return !1
            } else if ("craft" == b.value) {
                for (w in E)
                    v[w] = E[w];
                if ("item" == n.value) {
                    if ("undefined" != typeof x.value)
                        for (w in v) {
                            r = !1;
                            b = x.value.toLowerCase();
                            e = v[w].name;
                            e = e.toLowerCase();
                            -1 != e.indexOf(b) && (r = !0);
                            if (!r)
                                for (D in v[w].pattern.requires)
                                    if ("undefined" != typeof item_base[D].name && (t = item_base[D].name,
                                    t = t.toLowerCase(),
                                    -1 != t.indexOf(b))) {
                                        r = !0;
                                        break
                                    }
                            if (!r)
                                for (D in v[w].pattern.requires_one_from)
                                    if (y = v[w].pattern.requires_one_from[D],
                                    "undefined" != typeof item_base[y].name && (t = item_base[y].name,
                                    t = t.toLowerCase(),
                                    -1 != t.indexOf(b))) {
                                        r = !0;
                                        break
                                    }
                            if (!r)
                                for (D in v[w].pattern.consumes)
                                    if ("undefined" != typeof item_base[D].name && (t = item_base[D].name,
                                    t = t.toLowerCase(),
                                    -1 != t.indexOf(b))) {
                                        r = !0;
                                        break
                                    }
                            r || delete v[w]
                        }
                } else {
                    if ("skill" == n.value)
                        if (-1 != q.value)
                            for (w in v)
                                v[w].skill.toLowerCase() != q.value && delete v[w];
                        else
                            return !1;
                    if ("source" == n.value)
                        if (-1 != u.value)
                            for (w in v)
                                v[w].object.name.toLowerCase() != u.value && delete v[w];
                        else
                            return !1;
                    if (-1 != y.value)
                        for (w in v)
                            m = "base_chance" == y.value || "max_chance" == y.value ? "max_chance" == y.value && null == v[w].pattern.max_chance ? 100 * v[w].pattern.base_chance || null : 100 * v[w].pattern[y.value] || 100 * v[w].pattern.chance || null : "undefined" != typeof v[w][y.value] ? parseInt(v[w][y.value]) : null ,
                            null == m && delete v[w],
                            "number" == typeof A && "undefined" != typeof v[w] && (!(m < A) && -1 < m || delete v[w]),
                            "number" == typeof B && "undefined" != typeof v[w] && (!(m > B) && -1 < m || delete v[w])
                }
            } else if ("pet" == b.value) {
                for (w in Mods.Wikimd.pet_family)
                    v[w] = item_base[w];
                for (w in v)
                    "name" == p.value && ("undefined" != typeof x.value ? (b = x.value.toLowerCase(),
                    e = v[w].name.toLowerCase(),
                    -1 == e.indexOf(b) && delete v[w]) : "family" == p.value ? "undefined" != typeof x.value && (b = x.value.toLowerCase(),
                    e = Mods.Wikimd.family[w],
                    void 0 != e ? (e = e.toLowerCase(),
                    -1 == e.indexOf(b) && delete v[w]) : delete v[w]) : -1 != y.value && "undefined" != typeof v[w] && (m = -1 == y.value ? null : "aim" == y.value || "armor" == y.value || "power" == y.value || "magic" == y.value || "speed" == y.value ? item_base[v[w].b_i].params[y.value] : pets[v[w].params.pet].params[y.value],
                    null == m && delete v[w],
                    "number" == typeof A && "undefined" != typeof v[w] && (!(m < A) && -1 < m || delete v[w]),
                    "number" == typeof B && "undefined" != typeof v[w] && (!(m > B) && -1 < m || delete v[w])))
            } else if ("spell" == b.value) {
                for (w in F)
                    F[w].magic && (v[w] = F[w]);
                for (w in v)
                    "name" == r.value ? "undefined" != typeof x.value && (b = x.value.toLowerCase(),
                    e = v[w].name.toLowerCase(),
                    -1 == e.indexOf(b) && delete v[w]) : -1 != y.value && "undefined" != typeof v[w] && (D = v[w].magic,
                    k = "damage" == y.value ? "basic_damage" : "exp" == y.value ? "xp" : "casts" == y.value ? "uses" : y.value,
                    m = "dmg_s" == y.value ? Math.round(D.basic_damage / (D.cooldown / 1E3) * 10) / 10 : "cost_s" == y.value ? Math.round(v[w].params.price / (D.uses * D.cooldown)) : "exp_s" == y.value ? Math.round(D.xp / D.uses) : null ,
                    m = -1 == y.value ? null : null != m ? m : "price" == y.value ? v[w].params.price : D[k],
                    null == m && delete v[w],
                    "number" == typeof A && "undefined" != typeof v[w] && (!(m < A) && -1 < m || delete v[w]),
                    "number" == typeof B && "undefined" != typeof v[w] && (!(m > B) && -1 < m || delete v[w]))
            } else if ("enchant" == b.value) {
                for (w in F)
                    F[w].enchant && F[w].enchant.to_enchant && (v[w] = F[w]);
                for (w in v)
                    "item" == t.value ? "undefined" != typeof x.value && (b = x.value.toLowerCase(),
                    e = v[w].name.toLowerCase(),
                    k = (k = v[w].enchant.from_enchant) ? item_base[k].name.toLowerCase() : null ,
                    D = (D = v[w].enchant.to_enchant) ? item_base[D].name.toLowerCase() : null ,
                    -1 == e.indexOf(b) && (k && -1 == k.indexOf(b) || !k) && (D && -1 == D.indexOf(b) || !k) && delete v[w]) : -1 != y.value && "undefined" != typeof v[w] && (m = -1 == y.value ? null : v[w].enchant[y.value] || null ,
                    null == m && delete v[w],
                    "number" == typeof A && "undefined" != typeof v[w] && (!(m < A) && -1 < m || delete v[w]),
                    "number" == typeof B && "undefined" != typeof v[w] && (!(m > B) && -1 < m || delete v[w]))
            } else
                return !1;
        else
            return !1;
        return Mods.Wikimd.newWikiLoad = v
    }
    ;
    Mods.Wikimd.currentSort = function() {
        var b = getElem("mods_wiki_type")
          , e = getElem("mods_wiki_type_item")
          , f = getElem("mods_wiki_type_item_type")
          , g = getElem("mods_wiki_type_item_skill")
          , k = getElem("mods_wiki_type_monster")
          , m = getElem("mods_wiki_type_vendor")
          , n = getElem("mods_wiki_type_craft")
          , p = getElem("mods_wiki_type_spell")
          , r = getElem("mods_wiki_type_enchant")
          , t = getElem("mods_wiki_type_craft_skill")
          , q = getElem("mods_wiki_type_craft_source")
          , u = getElem("mods_wiki_type_pet")
          , x = getElem("mods_wiki_name")
          , y = getElem("mods_wiki_range")
          , A = parseInt(getElem("mods_wiki_level_low").value)
          , B = parseInt(getElem("mods_wiki_level_high").value)
          , v = ""
          , v = "monster" == b.value ? "mob " : "vendor" == b.value ? "npc " : b.value + " "
          , v = v + (("item" == b.value && e.value || "monster" == b.value && k.value || "vendor" == b.value && m.value || "craft" == b.value && n.value || "pet" == b.value && u.value || "spell" == b.value && p.value || "enchant" == b.value && r.value) + " " || "")
          , v = v + (("item" == b.value && "name" == e.value || "monster" == b.value && "all" != k.value || "vendor" == b.value && "all" != m.value || "craft" == b.value && "item" == n.value || "pet" == b.value && ("name" == u.value || "family" == u.value) || "spell" == b.value && "name" == p.value || "enchant" == b.value && "item" == r.value) && (x.value || "") || "")
          , v = v + ("item" == b.value && ("type" == e.value && f.value + " " || "skill" == e.value && g.value + " ") || "")
          , v = v + ("craft" == b.value && ("skill" == n.value && t.value + " " || "source" == n.value && q.value + " ") || "");
        return v += ("item" == b.value && "name" != e.value || "monster" == b.value && "all" == k.value || "craft" == b.value && "item" != n.value || "pet" == b.value && "all" == u.value || "spell" == b.value && "all" == p.value || "enchant" == b.value && "all" == r.value) && y.value + " (" + (A || "") + "," + (B || "") + ")" || ""
    }
    ;
    Mods.Wikimd.loadWikiType = function(b, e) {
        if (-1 != loadedMods.indexOf("Chatmd")) {
            var f = getElem("mods_wiki_load");
            f.innerHTML = "Go!";
            f.setAttribute("onclick", "javascript:Mods.Wikimd.populateWiki(true);")
        }
        if (!1 !== b) {
            var g = getElem("mods_wiki_type")
              , k = getElem("mods_wiki_type_item");
            getElem("mods_wiki_type_item_type");
            getElem("mods_wiki_type_item_skill");
            var m = getElem("mods_wiki_type_monster")
              , n = getElem("mods_wiki_type_vendor")
              , p = getElem("mods_wiki_type_craft");
            getElem("mods_wiki_type_craft_skill");
            getElem("mods_wiki_type_craft_source");
            var r = getElem("mods_wiki_type_pet")
              , t = getElem("mods_wiki_type_spell")
              , q = getElem("mods_wiki_type_enchant")
              , u = getElem("mods_wiki_name")
              , f = getElem("mods_wiki_range");
            getElem("mods_wiki_level");
            var x = getElem("mods_wiki_level_low")
              , y = getElem("mods_wiki_level_high")
              , g = g.value
              , k = k.value
              , m = m.value
              , n = n.value
              , p = p.value
              , r = r.value
              , t = t.value
              , q = q.value;
            u.value = null ;
            x.value = null ;
            y.value = null ;
            var A, B, v, F, E, w, D, G, C, H, K, J, I;
            0 == b ? (B = v = D = G = "none",
            A = "item" == g && "block" || "none",
            F = "monster" == g && "block" || "none",
            E = "vendor" == g && "block" || "none",
            w = "craft" == g && "block" || "none",
            C = "pet" == g && "block" || "none",
            H = "spell" == g && "block" || "none",
            K = "enchant" == g && "block" || "none",
            I = ("item" == g && "name" != k || "monster" == g && "all" == m || "craft" == g && "item" != p || "pet" == g && "all" == r || "spell" == g && "all" == t || "enchant" == g && "all" == q) && "block" || "none",
            J = ("item" == g && "name" == k || "monster" == g && "all" != m || "vendor" == g && "all" != n || "craft" == g && "item" == p || "pet" == g && "all" != r || "spell" == g && "name" == t || "enchant" == g && "item" == q) && "block" || "none") : 1 == b ? (B = "item" == g && "type" == k && "block" || "none",
            v = "item" == g && "skill" == k && "block" || "none",
            D = "craft" == g && "skill" == p && "block" || "none",
            G = "craft" == g && "source" == p && "block" || "none",
            I = ("item" == g && "name" != k || "monster" == g && "all" == m || "craft" == g && "item" != p || "pet" == g && "all" == r || "spell" == g && "all" == t || "enchant" == g && "all" == q) && "block" || "none",
            J = ("item" == g && "name" == k || "monster" == g && "all" != m || "vendor" == g && "all" != n || "craft" == g && "item" == p || "pet" == g && "all" != r || "spell" == g && "name" == t || "enchant" == g && "item" == q) && "block" || "none") : 2 == b && (I = "block");
            u = "monster" != g ? "item" != g ? "" : "<option value='level'>Range</option>            <option value='level'>Level</option>        <option value='price'>Price</option>             <option value='power'>Power</option>              <option value='aim'>Aim</option>             <option value='armor'>Armor</option>        <option value='magic'>Magic</option>        <option value='speed'>Speed</option>" : "<option value='level'>Range</option>            <option value='level'>Level</option>        <option value='health'>Health</option>           <option value='accuracy'>ACC</option>             <option value='strength'>STR</option>        <option value='defense'>DEF</option>";
            u = "craft" != g ? u : "<option value='level'>Range</option>            <option value='level'>Level</option>        <option value='base_chance'>Min%</option>        <option value='max_chance'>Max%</option>          <option value='xp'>Exp</option>";
            u = "pet" != g ? u : "<option value='sones'>Range</option>            <option value='stones'>Req SoE</option>     <option value='xp_required'>Req Exp</option>     <option value='inventory_slots'>Slots</option>    <option value='aim'>Aim</option>             <option value='power'>Power</option>        <option value='armor'>Armor</option>        <option value='magic'>Magic</option>                  <option value='speed'>Speed</option>";
            u = "spell" != g ? u : "<option value='level'>Range</option>            <option value='level'>Level</option>        <option value='damage'>Damage</option>           <option value='exp'>Exp</option>                  <option value='cooldown'>Cooldown</option>   <option value='price'>Price</option>        <option value='casts'>Casts</option>        <option value='penetration'>Spell Pen</option>        <option value='dmg_s'>Dmg/S</option>        <option value='cost_s'>Cost/S</option>       <option value='exp_s'>Exp/S</option>";
            u = "enchant" != g ? u : "<option value='low'>Range</option>            <option value='low'>Low %</option>          <option value='med'>Med %</option>               <option value='high'>High %</option>              <option value='sup'>Sup %</option>";
            "block" == I && (f.innerHTML = u);
            getElem("mods_wiki_type_item").style.display = A;
            getElem("mods_wiki_type_item_type").style.display = B;
            getElem("mods_wiki_type_item_skill").style.display = v;
            getElem("mods_wiki_type_monster").style.display = F;
            getElem("mods_wiki_type_vendor").style.display = E;
            getElem("mods_wiki_type_craft").style.display = w;
            getElem("mods_wiki_type_craft_skill").style.display = D;
            getElem("mods_wiki_type_craft_source").style.display = G;
            getElem("mods_wiki_type_pet").style.display = C;
            getElem("mods_wiki_type_spell").style.display = H;
            getElem("mods_wiki_type_enchant").style.display = K;
            getElem("mods_wiki_name").style.display = J;
            getElem("mods_wiki_range").style.display = I;
            getElem("mods_wiki_level").style.display = I;
            getElem("mods_wiki_range_separate").style.display = I
        }
    }
    ;
    Mods.loadModMenu_options = function() {
        getElem("mod_load_options").style.display = "none";
        getElem("mod_load_mods_options").style.display = "none";
        getElem("mod_options_options").style.display = "block";
        getElem("mod_options_mods_options").style.display = "block";
        getElem("mod_wiki_options").style.display = "none";
        getElem("mod_wiki_mods_options").style.display = "none";
        Mods.modOptionsOptionsDisplay("expbar")
    }
    ;
    Mods.loadModMenu_load = function() {
        getElem("mod_load_options").style.display = "block";
        getElem("mod_load_mods_options").style.display = "block";
        getElem("mod_options_options").style.display = "none";
        getElem("mod_options_mods_options").style.display = "none";
        getElem("mod_wiki_options").style.display = "none";
        getElem("mod_wiki_mods_options").style.display = "none"
    }
    ;
    Mods.loadModMenu_wiki = function() {
        getElem("mod_load_options").style.display = "none";
        getElem("mod_load_mods_options").style.display = "none";
        getElem("mod_options_options").style.display = "none";
        getElem("mod_options_mods_options").style.display = "none";
        getElem("mod_wiki_options").style.display = "block";
        getElem("mod_wiki_mods_options").style.display = "block"
    }
    ;
    (function() {
        getElem("mods_form_top").innerHTML = "<span style='float:left; font-weight: bold; color:#FFFF00; margin-bottom:3px;'>Mods Info</span><span id='mods_menu_load' class='common_link' onclick='javascript:Mods.loadModMenu_load();' style='float:left; margin:0px; margin-left: 42px;'>Load</span><span id='mods_menu_options' class='common_link' onclick='javascript:Mods.loadModMenu_options(); ' style='float:left; margin:0px; margin-left: 45px;'>Options</span><span id='mods_menu_load' class='common_link' onclick='javascript:Mods.loadModMenu_wiki();' style='float:left; margin:0px; margin-left: 41px;'>Wiki</span><span id='mod_options_close' class='common_link' style='margin: 0px; margin-bottom: 2px;' onclick='javascript:addClass(getElem(&apos;mods_form&apos;),&apos;hidden&apos;);'>Close</span>";
        getElem("mods_form", {
            style: {
                width: "464px"
            }
        });
        Mods.Wikimd.loadDivs();
        Mods.elemClass("scrolling_allowed", "mod_wiki_mods_options");
        Mods.elemClass("scrolling_allowed", "mod_wiki_options");
        disable_options && getElem("mods_menu_options", {
            className: "",
            onclick: "",
            style: {
                fontWeight: "bold",
                color: "#999"
            }
        });
        getElem("mod_wiki_search").onmouseover = function(b) {
            Mods.Wikimd.mouse.x = b.clientX;
            Mods.Wikimd.mouse.y = b.clientY
        }
        ;
        Mods.Wikimd.populate_item_formulas();
        Mods.Wikimd.populate_pets();
        Mods.Wikimd.populate_family()
    })();
    Mods.timestamp("wikimd")
}
;
Load.miscmd = function() {
    modOptions.miscmd.time = timestamp();
    penalty_bonus = function() {
        Mods.Miscmd.penalty = getElem("penalty_bonus_skill").value;
        localStorage.penalty_bonus = JSON.stringify(Mods.Miscmd.penalty);
        Mods.Miscmd.oldPenaltyBonus()
    }
    ;
    Mods.Miscmd.ideath.sort_values = function() {
        for (var b = {}, e = [], f = 2, g, k = 0; k < players[0].temp.inventory.length; k++) {
            var m = players[0].temp.inventory[k].id
              , n = item_base[m].params.price;
            855 != m ? (b[m] = n,
            e.push(parseInt(m))) : players[0].temp.inventory[k].selected && (f = 7)
        }
        players[0].temp.created_at < timestamp() - 72E5 || (f = 40);
        if (players[0].pet.enabled) {
            g = players[0].pet.id;
            g = pets[g].params.item_id;
            for (k = 0; k < e.length; k++)
                e[k] == g && e.splice(k, 1);
            delete b[g]
        }
        0 < e.length && e.sort(function(e, f) {
            return b[e] > b[f] ? -1 : b[e] < b[f] ? 1 : item_base[e].name > item_base[f].name ? -1 : 1
        });
        e.splice(f, 40);
        e.push(g);
        return e
    }
    ;
    Mods.Miscmd.ideath.safe_items = function() {
        var b = Mods.Miscmd.ideath.bgColor
          , e = Mods.Miscmd.ideath.brColor
          , f = Mods.Miscmd.ideath.sort_values();
        for (a = 0; 40 > a; a++) {
            var g = getElem("inv_" + a);
            g.innerHTML = "&nbsp;";
            if ("undefined" != typeof players[0].temp.inventory[a]) {
                var k = players[0].temp.inventory[a], m;
                for (m in f)
                    k.id == f[m] && (g.innerHTML = "<div class='pointer' title='You keep this item if you die.' style='position: absolute; top: 0%; left: 0%; margin-left: -1px; margin-top: -1px; width: 13%; height: 13%; background-color: " + b + "; border: 1px solid; border-color: " + e + "; opacity: .8;'>&nbsp;</div>",
                    f.splice(m, 1))
            }
        }
    }
    ;
    oldBigMenuShow = BigMenu.show;
    BigMenu.show = function(b) {
        Mods.showInv = 2 === b ? !0 : !1;
        oldBigMenuShow(b)
    }
    ;
    Mods.Miscmd.invClick = function() {
        Mods.showInv && (Mods.showBag = !Mods.showBag,
        Mods.showBag ? getElem("inventory").style.display = "block" : getElem("inventory").style.display = "")
    }
    ;
    Mods.Miscmd.toolbar.loadDivs = function() {
        createElem("div", wrapper, {
            id: "toolbar_main_holder",
            style: "position: absolute; display: block; height: 2.8%; right: 0%; top: 0%; width: 70.5%; font-size: 0.7em; color: #FFF; z-index: 999; background-color: rgba(0, 0, 0, 0.4);",
            innerHTML: "<span id='toolbar_holder' style='position: relative; display: inline-block; float: right; padding-top: 1px; height: 100%; width: 99%;'></span>"
        });
        var b = "td_time td_stats td_quests td_inventory_old td_location td_dpsinfo td_current_world".split(" "), e;
        for (e in b)
            createElem("span", "toolbar_holder", {
                id: b[e],
                className: "toolbar_item"
            });
        createElem("div", wrapper, {
            id: "td_inventory",
            style: "position: absolute; text-shadow: -1px -1px #333; border: 1px solid #000; border-radius: 4px; font-weight: normal; z-index: 999999; opacity: .8; background-color: rgba(20, 20, 20, 0.7); pointer-events: none; text-align: center; color: white; font-family: ariel;"
        });
        createElem("div", wrapper, {
            id: "td_inv_click",
            onclick: Mods.Miscmd.invClick,
            style: "position: absolute; z-index: 999999; opacity: .8; text-align: center; color: white; font-family: ariel;"
        });
        touch_initialized && (getElem("td_inv_click").style.display = "none");
        getElem("td_stats").setAttribute("title", "These are total adjusted values from your stats and gear.\nA = Accuracy, S = Strength, D = Defense, M = Magic");
        getElem("td_inv_click").setAttribute("title", "These numbers are [open inventory spaces]/[open pet inv spaces] (if you have a pet).\n**Click this icon to toggle your inventory open/closed**")
    }
    ;
    Mods.Miscmd.toolbar.playerLocation = function() {
        return "<span style='color: #BBB;'>" + map_names[players[0].map] + "</span> (" + players[0].i + ", " + players[0].j + ")"
    }
    ;
    Mods.Miscmd.toolbar.dpsinfo = function() {
        var b;
        Mods.Miscmd.dpsmode ? b = "<span onclick='javascript:Mods.Miscmd.switchdpsmode();' class='pointer'><span style='color: #BBB;'>DPS:</span> " + Math.round(100 * Mods.Miscmd.avgdps) / 100 + " (" + Math.round(100 * Mods.Miscmd.maxdps) / 100 + ")</span>" : (b = 1E4 < Mods.Miscmd.avgexp ? Math.round(Mods.Miscmd.avgexp / 10) / 100 + "k" : Math.round(Mods.Miscmd.avgexp),
        b = "<span onclick='javascript:Mods.Miscmd.switchdpsmode();' onMouseOver='Mods.Miscmd.ShowExpPopup(this);' onMouseOut='Mods.Miscmd.HideExpPopup();' class='pointer'><span style='color: #BBB;'>Exp/h:</span> " + b + "</span>");
        return b
    }
    ;
    Mods.Miscmd.ShowExpPopup = function(b) {
        if (0 == Mods.Miscmd.dpsmode) {
            b = getElem("ww_xp_popup");
            b || (createElem("div", wrapper, {
                id: "ww_xp_popup",
                className: "xptable menu",
                style: "z-index: 101; visibility: hidden; position: absolute; opacity: 1; padding: 0px;"
            }),
            b = getElem("ww_xp_popup"));
            getElem("td_dpsinfo");
            b.style.left = getElem("td_dpsinfo").getBoundingClientRect().left + "px";
            b.style.top = getElem("td_dpsinfo").getBoundingClientRect().bottom + "px";
            var e = "<table><thead><tr><th>Skill</th><th>Exp/h</th><th>Level in</th></tr></thead><tbody>", f = {}, g;
            for (g in Mods.Miscmd.adps)
                f[Mods.Miscmd.adps[g].skill] ? (f[Mods.Miscmd.adps[g].skill].xp += Mods.Miscmd.adps[g].xpdelta,
                f[Mods.Miscmd.adps[g].skill].mintime > Mods.Miscmd.adps[g].time && (f[Mods.Miscmd.adps[g].skill].mintime = Mods.Miscmd.adps[g].time),
                f[Mods.Miscmd.adps[g].skill].maxtime < Mods.Miscmd.adps[g].time && (f[Mods.Miscmd.adps[g].skill].maxtime = Mods.Miscmd.adps[g].time)) : (f[Mods.Miscmd.adps[g].skill] = {},
                f[Mods.Miscmd.adps[g].skill].mintime = f[Mods.Miscmd.adps[g].skill].maxtime = Mods.Miscmd.adps[g].time,
                f[Mods.Miscmd.adps[g].skill].xp = Mods.Miscmd.adps[g].xpdelta);
            g = !0;
            for (var k in f) {
                var m = 3600 * f[k].xp / ((f[k].maxtime - f[k].mintime) / 1E3);
                if (isFinite(m) && NaN != m) {
                    var n = Level.xp_for_level(skills[0][k].level + 1) - skills[0][k].xp
                      , p = Math.round((skills[0][k].xp - Level.xp_for_level(skills[0][k].level)) / (Level.xp_for_level(skills[0][k].level + 1) - Level.xp_for_level(skills[0][k].level)) * 100)
                      , r = Math.floor(n / (m / 3600))
                      , n = parseInt(r / 3600)
                      , t = parseInt(r / 60) % 60
                      , r = r % 60
                      , n = (10 > n ? "0" + n : n) + ":" + (10 > t ? "0" + t : t) + ":" + (10 > r ? "0" + r : r)
                      , m = 1E4 < m ? Math.round(m / 10) / 100 + "k" : Math.round(m)
                      , e = 1 == g ? e + "<tr>" : e + "<tr class='alt'>"
                      , e = e + ("<td>" + k + " (" + p + "%)</td><td>" + m + "</td><td>" + n + "</td></tr>");
                    g = 1 == g ? !1 : !0
                }
            }
            b.innerHTML = e + "</tbody></table>";
            b.style.visibility = ""
        }
    }
    ;
    Mods.Miscmd.HideExpPopup = function() {
        getElem("ww_xp_popup").style.visibility = "hidden"
    }
    ;
    Mods.Miscmd.switchdpsmode = function() {
        Mods.Miscmd.dpsmode ? (Mods.Miscmd.avgexp = 0,
        Mods.Miscmd.adps = [],
        Mods.Miscmd.maxtime = 18E4,
        Mods.Miscmd.dpsmode = !1) : (Mods.Miscmd.maxdps = 0,
        Mods.Miscmd.avgdps = 0,
        Mods.Miscmd.adps = [],
        Mods.Miscmd.maxtime = 6E4,
        getElem("ww_xp_popup").style.visibility = "hidden",
        Mods.Miscmd.dpsmode = !0);
        Mods.Miscmd.toolbar.updateToolbar("dpsinfo")
    }
    ;
    Mods.Miscmd.toolbar.playerStats = function() {
        for (var b = !1, e = 0; e < players[0].params.magic_slots; e++)
            if (players[0].params.magics[e])
                var f = Magic[players[0].params.magics[e].id].params.penetration
                  , b = b || f
                  , b = Math.min(b, f);
        return "<span style='color: #BBB;'>Stats:</span> " + Math.floor(players[0].temp.total_accuracy) + "A / " + Math.floor(players[0].temp.total_strength) + "S / " + Math.floor(players[0].temp.total_defense) + "D / " + Math.floor(players[0].temp.magic / 1.2 + skills[0].magic.level + (b || 0)) + "M"
    }
    ;
    Mods.Miscmd.toolbar.questData = function(b) {
        var e = getElem("quests_form_content").childNodes[0].childNodes[0];
        "undefined" == typeof e && (Quests.show_active(),
        e = getElem("quests_form_content").childNodes[0].childNodes[0]);
        for (var f in e.childNodes)
            if ("undefined" != typeof e.childNodes[f].title && /Location/.test(e.childNodes[f].title)) {
                var g = e.childNodes[f];
                if (null == g.onclick)
                    for (var k in quests)
                        -1 != g.innerHTML.search(quests[k].name) && g.setAttribute("onclick", 'Mods.Miscmd.toolbar.questData("' + k + '"); Mods.Miscmd.toolbar.updateToolbar("questData")')
            }
        b = b || Mods.Miscmd.toolbar.activeQuest || !1;
        if (!b || !player_quests[b] || player_quests[b].progress == quests[b].amount)
            for (k = 0; k < player_quests.length; k++)
                player_quests[k].progress < quests[k].amount && (b = k);
        if ("undefined" == typeof player_quests[b])
            getElem("td_quests").style.display = "none";
        else
            return getElem("td_quests").style.display = "",
            e = "<span style='color: #BBB;'>Quest:</span> (" + player_quests[b].progress + "/" + quests[b].amount + ") " + npc_base[quests[b].npc_id].name,
            Mods.Miscmd.toolbar.activeQuest = b,
            localStorage.activeQuest = JSON.stringify(b),
            e
    }
    ;
    Mods.Miscmd.toolbar.currentTime = function() {
        var b = new Date
          , e = b.getHours()
          , f = 11 > e ? " AM" : " PM"
          , e = 0 == e ? 12 : 12 < e ? e - 12 : e
          , b = b.getMinutes()
          , b = b.toString()
          , b = 2 != b.length ? "0" + b : b;
        return e + ":" + b + " " + f
    }
    ;
    Mods.Miscmd.toolbar.invSlots = function() {
        getElem("td_inventory_old").style.display = "none";
        var b = 40 - players[0].temp.inventory.length
          , e = ""
          , f = "";
        players[0].pet.enabled && (e = players[0].pet.chest.length,
        f = pets[players[0].pet.id].params.inventory_slots,
        e = f - e);
        return "<span style='color: yellow;'>" + b + "</span>" + (players[0].pet.enabled ? "/<span style='color:yellow;'>" + e + "</span>" : "")
    }
    ;
    Mods.Miscmd.toolbar.currentWorld = function() {
        var b = "";
        0 < Mods.currentWorldID && (b = "<div id='td_current_world_hover' class='pointer' style='color: #FFF;'><span>World - " + Mods.currentWorldID + "</span></div>");
        return b
    }
    ;
    Mods.Miscmd.toolbar.cache = {};
    Mods.Miscmd.toolbar.updateToolbar = function(b) {
        var e = Mods.Miscmd.toolbar
          , f = Mods.Miscmd.toolbar.ids;
        if ("undefined" != typeof b)
            e.updateCheckCache(f[b], e[b]());
        else
            for (var g in f)
                e.updateCheckCache(f[g], e[g]())
    }
    ;
    Mods.Miscmd.toolbar.updateCheckCache = function(b, e) {
        Mods.Miscmd.toolbar.cache[b] && Mods.Miscmd.toolbar.cache[b] == e || (Mods.Miscmd.toolbar.cache[b] = e,
        getElem(b).innerHTML = e)
    }
    ;
    Mods.Miscmd.inventoryEquip = function(b, e, f) {
        if ("undefined" != typeof e && -1 != item_base[e].name.indexOf("Potion") && "Potion Of Preservation" != item_base[e].name)
            for (b = 1; 20 > b; b++)
                Timers.set("new_potion_" + e + "_" + b, function() {
                    var b, f, m, n, p, r, t;
                    r = {};
                    r[e] = {};
                    for (b in item_base[e].params)
                        if (f = /^boost_(.{1,})$/.exec(b))
                            m = f[1],
                            f = item_base[e].params[f[0]],
                            p = timestamp(),
                            n = skills[0][m].level,
                            n = Math.ceil(n * f),
                            t = 6E4 * n + p,
                            r[e][m] = {
                                percent: f,
                                start: p,
                                delta: n,
                                end: t
                            };
                    if (null != getElem("mod_potion_" + e))
                        for (b = 1; 20 > b; b++)
                            Timers.clear("new_potion_" + e + "_" + b);
                    else
                        Mods.Miscmd.potions[e] = r[e]
                }, 1E3 * b);
        return !1
    }
    ;
    Mods.Miscmd.checkPotions = function() {
        var b, e, f, g, k, m, n, p;
        b = Mods.Miscmd.potions;
        g = getElem("mod_potion_holder");
        m = {
            accuracy: "ACC",
            alchemy: "Alch",
            carpentry: "Crpt",
            cooking: "Cook",
            defense: "DEF",
            farming: "Farm",
            fishing: "Fish",
            forging: "Forg",
            health: "Hlth",
            jewelry: "Jewl",
            magic: "Mag",
            mining: "Mine",
            strength: "STR",
            woodcutting: "Wood",
            archery: "Arch",
            fletching: "Fletch"
        };
        null !== g && delete wrapper[g];
        null == g && createElem("div", wrapper, {
            id: "mod_potion_holder",
            style: "position: absolute; z-index: 999; background: transparent; left: 11%; top: 15%; min-width: 32px; min-height: 32px;"
        });
        for (e in b) {
            g = getElem("mod_potion_" + e);
            null == g && (g = item_base[e],
            createElem("div", "mod_potion_holder", {
                id: "mod_potion_" + e,
                title: g.name,
                style: "position: relative; display: block; padding: 2px; float: left;",
                innerHTML: "<div style='" + Items.get_background_image(g.b_i) + " float: left; width: 32px; height: 32px; margin-left: -16px; left: 50%; position: relative;'>&nbsp;</div><div id='mod_potion_duration_" + e + "' style='float: left; clear: left; font-size: 0.7em; color: #FFF; background: #444; padding: 4px; border: 1px solid #FFF; border-radius: 5px; -moz-border-radius: 5px;'>&nbsp;</div>"
            }));
            g = "";
            n = !1;
            for (f in b[e])
                k = skills[0][f].current - skills[0][f].level,
                0 < k ? (g += "<tr><td>" + m[f] + "</td><td><span style='color: #FF0; text-align: right; padding-left: 4px;'>+" + k + "</span></td></tr>",
                n = !0,
                b[e][f].value != k && (b[e][f].value = k,
                p = !0)) : b[e][f].value = 0;
            p ? (g = "<table>" + g + "</table>",
            getElem("mod_potion_duration_" + e).innerHTML = g) : n || (getElem("mod_potion_holder").removeChild(getElem("mod_potion_" + e)),
            delete b[e])
        }
    }
    ;
    Mods.Miscmd.socketOn = {
        actions: "update_quest quests quest_complete my_data skills inventory my_pet_data item_drop skills hit".split(" "),
        fn: function(b, e, f) {
            var g = Mods.Miscmd.toolbar.updateToolbar;
            "update_quest" != b && "quests" != b && "quest_complete" != b || g("questData");
            "my_pet_data" == b && 0 == e.enabled && setCanvasSize();
            if ("my_data" == b || "skills" == b)
                g("playerStats"),
                g("playerLocation");
            if ("inventory" == b || "my_pet_data" == b || "item_drop" == b)
                g("invSlots"),
                Mods.Miscmd.ideath.safe_items();
            if ("skills" == b && 0 == Mods.Miscmd.dpsmode) {
                var k = timestamp()
                  , m = k;
                if (e.skill) {
                    if (Mods.Miscmd.lastSkill[e.skill] && Mods.Miscmd.lastSkill[e.skill].xp < e.stats.xp) {
                        var n = {};
                        n.skill = e.skill;
                        n.xpdelta = e.stats.xp - Mods.Miscmd.lastSkill[e.skill].xp;
                        n.time = k;
                        Mods.Miscmd.adps.push(n)
                    }
                    Mods.Miscmd.lastSkill[e.skill] = {};
                    Mods.Miscmd.lastSkill[e.skill].level = e.stats.level;
                    Mods.Miscmd.lastSkill[e.skill].xp = e.stats.xp
                } else
                    for (sk in e)
                        Mods.Miscmd.lastSkill[sk] && Mods.Miscmd.lastSkill[sk].xp < e[sk].xp && (n = {},
                        n.skill = sk,
                        n.xpdelta = e[sk].xp - Mods.Miscmd.lastSkill[sk].xp,
                        n.time = k,
                        Mods.Miscmd.adps.push(n)),
                        Mods.Miscmd.lastSkill[sk] = {},
                        Mods.Miscmd.lastSkill[sk].xp = e[sk].xp,
                        Mods.Miscmd.lastSkill[sk].level = e[sk].level;
                if (0 < Mods.Miscmd.adps.length && Mods.Miscmd.adps[0] && Mods.Miscmd.adps[0].time)
                    for (; Mods.Miscmd.adps[0] && Mods.Miscmd.adps[0].time + Mods.Miscmd.maxtime < k; )
                        Mods.Miscmd.adps.shift();
                for (e = Mods.Miscmd.avgexp = 0; e < Mods.Miscmd.adps.length; e++)
                    Mods.Miscmd.avgexp += Mods.Miscmd.adps[e].xpdelta,
                    Mods.Miscmd.adps[e].time < m && (m = Mods.Miscmd.adps[e].time);
                Mods.Miscmd.avgexp = 3600 * Mods.Miscmd.avgexp / ((k - m) / 1E3);
                isFinite(Mods.Miscmd.avgexp) && NaN != Mods.Miscmd.avgexp || (Mods.Miscmd.avgexp = 0);
                g("dpsinfo")
            }
            if ("hit" == b && Mods.Miscmd.dpsmode && 0 != f.target.id && f.target.id == selected_object.id) {
                k = timestamp();
                n = {};
                n.damage = f.hit;
                n.time = k;
                m = k - 5E3;
                Mods.Miscmd.adps.push(n);
                Mods.Miscmd.avgdps = 0;
                if (0 < Mods.Miscmd.adps.length && Mods.Miscmd.adps[0] && Mods.Miscmd.adps[0].time) {
                    for (; Mods.Miscmd.adps[0].time + Mods.Miscmd.maxtime < k; )
                        Mods.Miscmd.adps.shift();
                    for (e = 0; e < Mods.Miscmd.adps.length; e++)
                        Mods.Miscmd.avgdps += Mods.Miscmd.adps[e].damage,
                        Mods.Miscmd.adps[e].time < m && (m = Mods.Miscmd.adps[e].time)
                }
                Mods.Miscmd.avgdps /= (k - m) / 1E3;
                Mods.Miscmd.avgdps > Mods.Miscmd.maxdps && (Mods.Miscmd.maxdps = Mods.Miscmd.avgdps);
                g("dpsinfo")
            }
        }
    };
    Quests.show_active = function() {
        Mods.Miscmd.toolbar.oldQuestsShowActive();
        Mods.Miscmd.toolbar.questData()
    }
    ;
    Mods.Miscmd.toolbar.checkTime = function() {
        Mods.Miscmd.toolbar.updateToolbar("currentTime");
        Mods.Miscmd.checkPotions();
        Timers.set("check_time", function() {
            Mods.Miscmd.toolbar.checkTime()
        }, 1E3)
    }
    ;
    Mods.Miscmd.inventoryClick = function() {
        Android && 500 > timestamp() - lastTap || (Mods.Miscmd.ideath.safe_items(),
        Mods.Miscmd.toolbar.updateToolbar("playerStats"),
        Mods.Miscmd.toolbar.updateToolbar("invSlots"))
    }
    ;
    drawMap = function(b, e, f) {
        Mods.Miscmd.toolbar.oldDrawMap(b, e, f);
        Mods.Miscmd.toolbar.updateToolbar("playerLocation")
    }
    ;
    Inventory.add = function(b, e, f) {
        Mods.Miscmd.toolbar.updateToolbar("invSlots");
        return Mods.Miscmd.toolbar.oldInventoryAdd(b, e, f)
    }
    ;
    Inventory.remove = function(b, e) {
        Mods.Miscmd.toolbar.updateToolbar("invSlots");
        return Mods.Miscmd.toolbar.oldInventoryRemove(b, e)
    }
    ;
    Mods.Miscmd.setCanvasSize = function() {
        getElem("toolbar_main_holder").style.fontSize = Mods.fontSize[0];
        var b = wrapper.style.width.replace("px", "") / width
          , e = wrapper.style.height.replace("px", "") / height;
        getElem("td_inventory", {
            style: {
                right: ((players[0].pet.enabled ? 66 : 34) + (300 == players[0].map || 16 == players[0].map ? 32 : 0)) * b + "px",
                top: 40 * e + "px",
                width: 28 * b + "px",
                height: 10 * e + "px",
                fontSize: Mods.fontSize[0]
            }
        });
        getElem("td_inv_click", {
            style: {
                right: ((players[0].pet.enabled ? 66 : 34) + (300 == players[0].map || 16 == players[0].map ? 32 : 0)) * b + "px",
                top: 22 * e + "px",
                width: 28 * b + "px",
                height: 28 * e + "px"
            }
        })
    }
    ;
    Mods.Miscmd.changeVolume = function(b) {
        localStorage.audioVolume = b;
        b = parseInt(b);
        try {
            for (var e in sound_effects)
                sound_effects[e].music.setVolume(b, 0);
            for (var f in map_music)
                map_music[f].music.setVolume(b, 0)
        } catch (g) {}
    }
    ;
    navigator.userAgent.match(/chrome/i) && (createElem("div", "options_audio", {
        innerHTML: "<br>Volume: <input id='settings_volume_slider' type='range' min='0' max='100' step='5' value='50' onchange='Mods.Miscmd.changeVolume(value)'/>"
    }),
    getElem("my_text").style.zIndex = "90",
    document.getElementById("settings_volume_slider").value = localStorage.audioVolume,
    Mods.Miscmd.changeVolume(localStorage.audioVolume));
    Mods.Miscmd.onWorldChange = function() {
        Mods.Miscmd.toolbar.updateToolbar("currentWorld");
        Mods.Miscmd.toolbar.updateToolbar("playerLocation")
    }
    ;
    Breeding.open_nest = function() {
        Mods.Miscmd.default_open_nest();
        Timers.set("mods_draw_pet_nest", function() {
            var b = (pet_nest = on_map[pet_nest.map][pet_nest.i][pet_nest.j]) && pet_nest.params && pet_nest.params.pet_id
              , e = [];
            if ("undefined" != typeof b)
                for (z in pets[b].params.eats)
                    e.push(pets[b].params.eats[z]);
            if (0 < e.length)
                for (var b = document.querySelectorAll("div#pet_nest_form > .inv_item.tooltip"), f = 1, g = b.length; f < g; f++)
                    b[f].title += " (" + parseInt(100 * e[f - 1]) + "%)"
        }, 1)
    }
    ;
    (function() {
        getElem("penalty_bonus_skill").value = Mods.Miscmd.penalty;
        for (var b = 0; 40 > b; b++)
            getElem("inv_" + b).style.position = "relative";
        getElem("chest_item", {
            style: {
                overflow: "hidden",
                maxWidth: "185px",
                whiteSpace: "nowrap"
            }
        });
        getElem("inv_name", {
            style: {
                overflow: "hidden",
                maxWidth: "185px",
                whiteSpace: "nowrap",
                cssFloat: "left"
            }
        });
        Mods.Miscmd.toolbar.loadDivs();
        Mods.Miscmd.toolbar.updateToolbar();
        Mods.Miscmd.toolbar.checkTime();
        Mods.Miscmd.ideath.safe_items();
        setCanvasSize()
    })();
    Mods.timestamp("miscmd")
}
;
Load.chatmd = function() {
    modOptions.chatmd.time = timestamp();
    Mods.Chatmd.blockChat = function(b, e, f, g, k) {
        f = {
            "#ping;": !0,
            "@mods ": !1
        };
        k = !1;
        if ("whisper" == g)
            for (var m in f) {
                0 == b.indexOf(m) && (e == players[0].name && f[m] || !f[m]) && (k = !0);
                if (k && "@mods " == m && e != players[0].name)
                    return b = b.replace(m, ""),
                    m = Player.is_chat_mod(e) ? COLOR.LGREEN : Player.is_mod(e) ? COLOR.GREEN : Player.is_admin(e) ? COLOR.ORANGE : "#EAE330",
                    addChatText(b, e, m, "chat", Mods.Chatmd.ModCh.channel),
                    !0;
                g = timestamp() - (Mods.Chatmd.delay || 0);
                if (k)
                    return 1E3 < g && (Mods.Chatmd.delay = timestamp(),
                    Mods.Chatmd.message(b)),
                    !0
            }
        return !1
    }
    ;
    Mods.Chatmd.message = function(b) {}
    ;
    addChatText = function(b, e, f, g, k, m, n, p) {
        p = p || !1;
        var r;
        "object" == typeof b && (e = b.user || b.name,
        f = b.color,
        g = b.type,
        k = b.lang,
        m = b.to,
        n = b.server,
        p = b.id,
        r = JSON.clone(b),
        b = b.text);
        if (!Mods.Chatmd.blockChat(b, e, f, g, k, m, n, p)) {
            for (var t = ["You are under attack!", "Cannot do that yet.", "Cannot do that yet", "Cannot do that yet.!", "I think that I'm missing something.", "You feel a bit better.", "Your inventory is full!", "Your inventory is full.", "You feel more experienced.", "I need a seed to do that.", "I need a rake to do that.", selected_object && selected_object.activities && selected_object.activities[0] == ACTIVITIES.INSPECT && (selected_object.params.desc || "It's a " + selected_object.name), "Not enough free space in magic pouch!", players[0].params.magic_slots && "This pouch has a limit " + thousandSeperate(1E3 * players[0].params.magic_slots) + " of each spell!", "You need a magic pouch!", "Your chest is full!", "You ran away.", "Plant is revived and starts to grow again", "Plant is feeling refreshed", "Your watering can is now filled with water"], q = 0; q < t.length; q++)
                if (b === t[q]) {
                    g = "spam";
                    break
                }
            if (g && "spam" == g) {
                if (1E3 > timestamp() - last_cannot_message)
                    return;
                last_cannot_message = timestamp()
            }
            t = !0;
            q = new Date;
            if (-1 < loadedMods.indexOf("Tabs")) {
                if (-1 < Contacts.ignores.indexOf(e)) {
                    "undefined" != typeof m && 1E4 < timestamp() - (last_ignore_message || 0) && (last_ignore_message = timestamp(),
                    Socket.send("message", {
                        data: '/w "' + e + '" [Ignored] This player does not receive your messages.',
                        lang: getElem("current_channel").value,
                        silent: !0
                    }));
                    return
                }
                for (var u in Mods.Tabs.wwCurrentTabs) {
                    var x = !0;
                    void 0 != k && (Contacts.channels[k] || (x = !1));
                    if (x)
                        for (var y in Mods.Tabs.wwCurrentTabs[u].channels)
                            if (y == k && 0 == Mods.Tabs.wwCurrentTabs[u].channels[y]) {
                                x = !1;
                                Mods.Tabs.wwCurrentTabs[u].id == Mods.Tabs.wwactiveTab && (t = !1);
                                break
                            }
                    x && (1 == Mods.Tabs.wwCurrentTabs[u].filter_skillattempts && "attempt" == g ? x = !1 : 1 == Mods.Tabs.wwCurrentTabs[u].filter_skillfails && "fails" == g ? x = !1 : 1 == Mods.Tabs.wwCurrentTabs[u].filter_playerchat && "chat" == g ? x = !1 : 1 == Mods.Tabs.wwCurrentTabs[u].filter_whispering && "whisper" == g ? x = !1 : 1 == Mods.Tabs.wwCurrentTabs[u].filter_joinleave && "join_leave" == g ? x = !1 : 1 == Mods.Tabs.wwCurrentTabs[u].filter_loot && "loot" == g ? x = !1 : 1 == Mods.Tabs.wwCurrentTabs[u].filter_magic && "magic" == g ? x = !1 : 1 == Mods.Tabs.wwCurrentTabs[u].filter_archery && "archery" == g ? x = !1 : 1 == Mods.Tabs.wwCurrentTabs[u].filter_spam && "spam" == g ? x = !1 : 0 != Mods.Tabs.wwCurrentTabs[u].filter_joinleave || "join_leave" != g || Contacts.are_friends(e) || (x = !1),
                    1 == Mods.Tabs.wwCurrentTabs[u].filter_chatmoderator && f == COLOR.GREEN && (f = COLOR.WHITE),
                    f == COLOR.WHITE && 0 == Mods.Tabs.wwCurrentTabs[u].filter_coloredchannels && 0 == Mods.Tabs.wwCurrentTabs[u].filter_coloredonly && (f = Mods.Chatmd.colorChat(k)));
                    !x || (void 0 != e && null != e || void 0 != k || void 0 != g && "chat" != g) && "spam" != g && "exists" != g && "cannot" != g && "duel" != g || Mods.Tabs.wwCurrentTabs[u].id != Mods.Tabs.wwactiveTab && (x = !1);
                    x && (Mods.Tabs.wwTabContent[Mods.Tabs.findWithAttr(Mods.Tabs.wwTabContent, "id", Mods.Tabs.wwCurrentTabs[u].id)].history.push({
                        text: b,
                        user: e,
                        color: f,
                        lang: k,
                        type: g,
                        to: m,
                        server: n,
                        id: p,
                        chattimestamp: (10 > q.getHours() ? "0" : "") + q.getHours() + ":" + (10 > q.getMinutes() ? "0" : "") + q.getMinutes() + ":" + (10 > q.getSeconds() ? "0" : "") + q.getSeconds()
                    }),
                    Mods.Tabs.wwTabContent[u].history.length > Chat.max_chat_history && Mods.Tabs.wwTabContent[u].history.splice(0, 1),
                    Mods.Tabs.wwCurrentTabs[u].id != Mods.Tabs.wwactiveTab && Mods.Tabs.Warning(Mods.Tabs.wwCurrentTabs[u].id))
                }
            }
            0 != t && (-1 < loadedMods.indexOf("Expmonitor") && f === COLOR.TEAL && "whisper" != g && (u = b.match(/Time left: (\d+\.\d+)\s*minute/)) && 0 < u.length && (u = Math.round(60 * u[1]),
            0 < u && (b = "Time left: " + String(u).toHHMMSS())),
            u = f == COLOR.GREEN || f == COLOR.PREMIUM || f == COLOR.LGREEN ? !0 : !1,
            y = 1 == chat_filters.modcolor ? !0 : !1,
            t = getElem("filter_channel_only").checked ? !1 : !0,
            !chat_filters.color && f != COLOR.ORANGE && (t && y || t && !u) && (f = Mods.Chatmd.colorChat(k) || f || COLOR.WHITE),
            !t && y && u && (f = COLOR.WHITE),
            "object" == typeof r ? (r.text = b,
            r.user = e,
            r.color = f,
            r.lang = k,
            r.type = g,
            r.to = m,
            r.server = n,
            r.id = p,
            Mods.Chatmd.addChatText(r, e, f, g, k, m, n, p)) : Mods.Chatmd.addChatText(b, e, f, g, k, m, n, p))
        }
    }
    ;
    Chat.add_line = function(b) {
        if ("object" == typeof chat_history[b]) {
            var e = document.createElement("div")
              , f = COLOR.WHITE
              , g = "";
            e.style.display = "block";
            e.className = "chat_text";
            chat_history[b].color && (f = chat_history[b].color);
            e.style.color = f;
            var k = COLOR.WHITE
              , m = chat_filters.color ? !1 : !0;
            "undefined" != typeof chat_history[b].lang && (m && (k = Mods.Chatmd.colorChat(chat_history[b].lang)) || (k = COLOR.WHITE)) && (g += "<span style='color: " + k + ";'>[" + chat_history[b].lang + "]</span>");
            1 != !chat_filters.chattimestamp || !chat_history[b].user && 1 != Mods.Chatmd.enableallchatts || (chat_history[b].chattimestamp ? g = "(" + chat_history[b].chattimestamp + ") " + g : (f = new Date,
            g = "(" + (10 > f.getHours() ? "0" : "") + f.getHours() + ":" + (10 > f.getMinutes() ? "0" : "") + f.getMinutes() + ":" + (10 > f.getSeconds() ? "0" : "") + f.getSeconds() + ") " + g));
            chat_history[b].id && (e.id = "chat_" + chat_history[b].id);
            if (chat_history[b].user && "join_leave" != chat_history[b].type) {
                if (!("whisper" != chat_history[b].type && void 0 != chat_history[b].lang || chat_history[b].user == players[0].name && chat_history[b].to == players[0].name)) {
                    var f = Mods.Chatmd.whispNames
                      , k = chat_history[b].user != players[0].name ? chat_history[b].user : chat_history[b].to
                      , n = f.indexOf(k);
                    -1 < n && f.splice(n, 1);
                    f.unshift(k)
                }
                var p = chat_history[b].user, f = !1, k = getElem("filter_highlight_friends").checked ? "<span style='color: #FFFF00;'>" : "", n = chat_history[b].to && chat_history[b].to != players[0].name ? "to " : "", r = chat_history[b].to && chat_history[b].to != players[0].name ? chat_history[b].to : chat_history[b].user, t = r && r.sanitizeChat(), q = !chat_filters.friends || !1, u;
                for (u in Contacts.friends)
                    Contacts.friends[u].name == t && (f = !0);
                g += (f && q && n + k + "&lt;</span>" || n + "&lt;") + t + (f && q && k + "&gt;</span> " || "&gt; ");
                f = function(b) {
                    return function(e) {
                        Mods.Chatmd.ModCh.nameClick(b)
                    }
                }(r);
                e.onclick = f;
                e.oncontextmenu = function(b) {
                    Mods.Chatmd.chatContext(b, r)
                }
                ;
                Chat.set_visible()
            }
            f = chat_history[b].text.sanitizeChat().replace(/%26/g, "&amp;");
            k = /( has joined the game.| has left the game.| has just completed the tutorial!)/.exec(f);
            if ("join_leave" == chat_history[b].type || k && void 0 == chat_history[b].lang && "whisper" != chat_history[b].type && void 0 == chat_history[b].user) {
                p = chat_history[b].user || f.replace(k[0], "");
                p = p.trim();
                n = k[0] || " " + chat_history[b].text;
                f = !1;
                k = -1 == Contacts.ignores.indexOf(p) ? !1 : !0;
                for (u in Contacts.friends)
                    Contacts.friends[u].name == p && (f = !0);
                f = f && !chat_filters.friends ? "<span style='color: #FFFF00'>" + p + "</span>" + n : p + n;
                if (k)
                    return;
                e.onclick = new Function("Mods.Chatmd.ModCh.nameClick('" + p.replace(/'/g, "\\'") + "')");
                e.oncontextmenu = function(b) {
                    Mods.Chatmd.chatContext(b, p)
                }
            }
            if ("$$" == chat_history[b].lang && m) {
                u = Mods.marketReplace;
                var m = {}, x;
                for (x in u)
                    "" !== u[x] && (m[u[x]] = x);
                u = /^\[BUY\]/.test(f) ? 1 : 0;
                k = /^\[BUY\]/.test(f) ? "#62E7B7" : "#E7A762";
                n = /(\d+\.?\d?[kmbt]? )([^|]{1,})( for )/ig;
                for (t = f; q = n.exec(f); ) {
                    var y = reduced_item_name = q[2];
                    for (x in m)
                        y = y.replace(x, m[x]);
                    var A = !1, B;
                    for (B in item_base)
                        if (item_base[B].name.replace(/ ?(permission|scroll|pet)\b ?/gi, "").toLowerCase() === y.toLowerCase()) {
                            A = B;
                            break
                        }
                    q[2] = q[2].replace(/\[(Ancient|Legendary|Rare|Common)\]/g, function(b, e) {
                        return "[" + e.slice(0, 1) + "]"
                    });
                    t = t.replace(q[0], q[1] + '<span class="pointer" item_id="' + A + '" onclick="Mods.Chatmd.marketSearch(' + u + ", false, " + A + '); Mods.Chatmd.block_hidden=true;" style="color: ' + k + ';">' + q[2] + "</span>" + q[3])
                }
                f = t.replace(/\[SELL\]/, "<span style='color: #E7A762;'>[SELL]</span>");
                f = f.replace(/\[BUY\]/, "<span style='color: #62E7B7;'>[BUY]</span>");
                /\[SELL\]/.test(f) && (f = f.replace(/\|/g, "<span style='color: #E7A762;'>|</span>"));
                /\[BUY\]/.test(f) && (f = f.replace(/\|/g, "<span style='color: #62E7B7;'>|</span>"))
            }
            "EN" == chat_history[b].lang && (f = f.filterChat("EN"));
            e.innerHTML = 1 == chat_filters.urlfilter ? g + Mods.Chatmd.urlify(f) : g + f;
            if (/Currently online\(/.test(f) && !chat_history[b].user) {
                g = f.split("):")[0];
                b = f.split("):")[1].split(",").sort();
                e.innerHTML = g + "):";
                for (var v in b)
                    g = b[v].trim().sanitize(),
                    x = document.createElement("span"),
                    x.innerHTML = " " + g,
                    Player.is_admin(g) ? x.style.color = COLOR.ORANGE : Player.is_chat_mod(g) ? x.style.color = COLOR.LGREEN : Player.is_mod(g) ? x.style.color = COLOR.GREEN : Mods.findWithAttr(Contacts.friends, "name", g) && (x.style.color = "yellow"),
                    x.onclick = new Function("Mods.Chatmd.ModCh.nameClick('" + g.replace(/'/g, "\\'") + "');"),
                    x.oncontextmenu = function(b) {
                        Mods.Chatmd.chatContext(b, this.innerHTML.trim())
                    }
                    ,
                    e.appendChild(x),
                    v < b.length - 1 && e.insertAdjacentHTML("beforeend", ",")
            }
            addClass(e, "scrolling_allowed");
            getElem("chat").appendChild(e);
            e = getElem("chat").scrollHeight - getElem("chat").offsetHeight - getElem("chat").scrollTop;
            16 < e && 60 > e && (getElem("chat").scrollTop = getElem("chat").scrollHeight)
        }
    }
    ;
    Mods.Chatmd.set_hidden = function() {
        return 1 == Mods.Chatmd.block_hidden ? Mods.Chatmd.block_hidden = !1 : !0
    }
    ;
    Mods.Chatmd.marketSearch = function(b, e, f) {
        if (selected && (!selected || -1 != selected.name.indexOf("Chest")) && "undefined" != typeof b && "undefined" != typeof f && (Market.open(selected),
        1 == b || 0 == b)) {
            getElem("market_search_type").value = b;
            if (!1 !== e && -1 < e && 11 > e)
                getElem("market_search_category").value = e;
            else if (void 0 != item_base[f])
                getElem("market_search_category").value = parseInt(item_base[f].b_t);
            else
                return;
            if (void 0 != item_base[f])
                getElem("market_search_item").value = f;
            else if (8 < e && "string" == typeof f)
                getElem("market_search_name").value = f;
            else
                return;
            Market.client_search()
        }
    }
    ;
    Mods.Chatmd.ModCh.nameClick = function(b) {
        if (GAME_STATE == GAME_STATES.CHAT) {
            var e = getElem("mod_text")
              , f = getElem("my_text");
            if (getElem("current_channel").value == Mods.Chatmd.ModCh.channel) {
                var g = Mods.Chatmd.ModCh.targets();
                if (g) {
                    var k = g.targets
                      , g = g.message;
                    -1 == k.indexOf(b) ? k.push(b) : k.splice(k.indexOf(b), 1);
                    b = JSON.stringify(k);
                    b = b.replace(/"/g, "");
                    e.value = "@" + b + " " + g;
                    f.value = "/@mods @" + b + " " + g
                } else
                    e.value = '/w "' + b + '" ',
                    f.value = '/w "' + b + '" '
            } else
                f.value = '/w "' + b + '" ';
            Chat.update_string()
        }
    }
    ;
    Mods.Chatmd.ModCh.targets = function() {
        if (GAME_STATE == GAME_STATES.CHAT && getElem("current_channel").value == Mods.Chatmd.ModCh.channel) {
            var b = getElem("mod_text").value;
            if (/^@/.test(b)) {
                var e = /^@ ?"([^"]{0,})"/
                  , f = /^@ ?([^ ]{1,}) /
                  , e = /^@ ?([\[\(][^\]\)]{0,}[\]\)])/.exec(b) || e.exec(b) || f.exec(b);
                if (!e)
                    return {
                        targets: [],
                        message: ""
                    };
                b = b.slice(e[0].length).trim().replace(/""/, '""');
                e = e[1];
                "" == e && (e = "[]");
                e = e.replace(/",? ?"/g, '","').replace(/^\(/, "[").replace(/\)$/, "]").replace(/^\[/, '["').replace(/, ?/g, '","').replace(/]$/, '"]').replace(/""/g, '"');
                '["]' == e && (e = "[]");
                !/^\[.*\]$/.test(e) && (e = '["' + e + '"]');
                e = JSON.parse(e);
                return e = {
                    message: b,
                    targets: e
                }
            }
        }
        return !1
    }
    ;
    Mods.Chatmd.chatContext = function(b, e) {
        var f = b.target || b.srcElement;
        b.preventDefault();
        b.clientX = b.clientX || b.pageX || b.touches[0].pageX;
        b.clientY = b.clientY || b.pageY || b.touches[0].pageY;
        var g = function(b) {
            Socket.send("message", {
                data: b,
                lang: getElem("current_channel").value
            })
        }
          , k = [];
        if (mod_initialized || chat_mod_initialized)
            k = [{
                name: e,
                method: "Mute",
                func: function() {
                    g("/mute " + e)
                }
            }, {
                name: e,
                method: "Unmute",
                func: function() {
                    g("/unmute " + e)
                }
            }],
            mod_initialized && (k.push({
                name: e,
                method: "Kick",
                func: function() {
                    g("/kick " + e)
                }
            }),
            k.push({
                name: e,
                method: "Ban",
                func: function() {
                    Popup.prompt("Ban. Are you sure?", function() {
                        g("/ban " + e)
                    })
                }
            })),
            f.id && k.push({
                name: e,
                method: "Remove Message",
                func: function() {
                    Socket.send("remove_line", {
                        line: f.id.replace(/^\D+/g, "")
                    });
                    Popup.prompt("Also mute " + e + "?", function() {
                        g("/mute " + e)
                    }, null_function)
                }
            });
        Contacts.are_friends(e) ? k.push({
            name: e,
            method: "Remove Friend",
            func: function() {
                Contacts.remove_friend(e)
            }
        }) : k.push({
            name: e,
            method: "Add Friend",
            func: function() {
                Contacts.add_friend(e);
                addChatText(e + " was added as a friend.", void 0, COLOR.TEAL)
            }
        });
        Player.has_lower_permissions(e) || (Contacts.is_ignored(e) ? k.push({
            name: e,
            method: "Remove ignore",
            func: function() {
                Contacts.remove_ignore(e)
            }
        }) : k.push({
            name: e,
            method: "Ignore",
            func: function() {
                Contacts.ignore_player(e);
                addChatText(e + " was added to your ignore list!", void 0, COLOR.TEAL)
            }
        }));
        var m = f.id.replace(/^\D+/g, "")
          , n = !1;
        for (li in chat_history)
            if (chat_history[li] && chat_history[li].id && chat_history[li].id == m) {
                n = chat_history[li];
                break
            }
        n && n.to && n.user != players[0].name ? k = k.concat([{
            name: e,
            method: "Report",
            func: function() {
                Report.show_dialog(n.user, [], !0)
            }
        }]) : n && n.user && n.user != players[0].name && Report.can_report(skills[0]) && (k = k.concat([{
            name: e,
            method: "Report",
            func: function() {
                Report.show_dialog(n.user, [n.lang], !1)
            }
        }]));
        k = k.concat([{
            name: e,
            method: "Whisper",
            func: function() {
                hasClass(getElem("my_text"), "hidden") && ChatSystem.toggle();
                getElem("my_text").value = '/w "' + e + '" '
            }
        }]);
        k = k.concat([{
            name: "",
            method: "Cancel",
            func: function() {
                addClass(getElem("action_menu"), "hidden")
            }
        }]);
        ActionMenu.custom_create(b, k)
    }
    ;
    Mods.Chatmd.urlify = function(b) {
        return b.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, '<a href="$1" target="_blank" onclick="event.stopPropagation();this.blur();" style="color:yellow;">$1</a>')
    }
    ;
    Mods.Chatmd.colorChat = function(b) {
        var e = !1
          , f = Mods.Chatmd.colors
          , g = !1;
        if ("boolean" != typeof b || b)
            if ("string" == typeof b) {
                for (var k in channel_names)
                    if (channel_names[k] == b) {
                        g = !0;
                        break
                    }
                if (!g)
                    return !1
            } else
                return !1;
        else
            e = !0;
        e && (b = getElem("current_channel").value);
        b = f[b] || channel_names.indexOf(b) && f["default"] || f.none;
        chat_filters.color && (b = COLOR.WHITE);
        return e ? (e = /^\//.test(getElem("my_text").value),
        f = /^\//.test(getElem("mod_text").value),
        g = /^\/\@mods/.test(getElem("my_text").value),
        getElem("current_channel").style.color = b,
        e && !g || (getElem("my_text").style.color = b),
        f || e && !g || (getElem("mod_text").style.color = b),
        !1) : b
    }
    ;
    getElem("current_channel").onchange = function() {
        Mods.Chatmd.chatCommand(!1)
    }
    ;
    Mods.Chatmd.chatCommand = function(b) {
        if (GAME_STATE === GAME_STATES.CHAT) {
            var e = getElem("my_text").value
              , f = getElem("mod_text").value
              , g = getElem("my_text")
              , k = getElem("mod_text");
            !/^\/id /.test(e) && /&/g.test(e) && (g.value = e.replace(/&/g, "%26"));
            !/^\/id /.test(f) && /&/g.test(f) && (k.value = f.replace(/&/g, "%26"));
            if (/^\/w /.test(e) && Mods.Chatmd.cycleWhisper && (33 == b || 34 == b || 0 == b)) {
                var f = /(^\/w (\"([^\"]{1,})\"|([^ ]{1,})))/.exec(e)
                  , m = Mods.Chatmd.whispNames;
                if (f) {
                    var n = ""
                      , p = m.indexOf(f[3]);
                    33 == b && (n = -1 == p || p == m.length - 1 ? m[0] : m[p + 1]);
                    34 == b && (n = -1 == p || 0 == p ? m[m.length - 1] : m[p - 1]);
                    e = e.replace(f[2], '"' + n + '"');
                    g.value = e;
                    k.value = e
                }
            }
            b = getElem("current_channel");
            f = /^\//.test(e);
            m = /^\/\@mods/.test(e);
            n = /^\//.test(k.value);
            chat_filters.color && (g.style.color = COLOR.WHITE,
            b.style.color = COLOR.WHITE,
            k.style.color = COLOR.WHITE);
            Mods.Chatmd.colorChat(!1);
            b.value == Mods.Chatmd.ModCh.channel ? Mods.Chatmd.ModCh.chatCommand(f, m, n, e, g, k) : b.value == Mods.Chatmd.ModCh.channel || !m && hasClass(k, "hidden") ? f ? (!chat_filters.color && (g.style.color = COLOR.TEAL) && (k.style.color = COLOR.TEAL),
            /^\/r/.test(e) && (Mods.Chatmd.mods_client_commands.whisp(e),
            Chat.update_string())) : k.value = g.value : (g.value = g.value.replace("/@mods ", ""),
            removeClass(g, "hidden"),
            g.focus(),
            k.value = "",
            addClass(k, "hidden"))
        }
        Chat.update_string()
    }
    ;
    Mods.Chatmd.ModCh.chatCommand = function(b, e, f, g, k, m) {
        !Player.has_lower_permissions(players[0].name) && (0 == Mods.Chatmd.ModCh.delay || Mods.Chatmd.ModCh.delay + 6E5 < timestamp()) && (Mods.Chatmd.ModCh.delay = timestamp(),
        addChatText("Use this channel to report issues of in-game abuse or harassment to the Chat Moderators.", void 0, COLOR.ORANGE));
        if (/^@ ?< ?$/g.test(m.value)) {
            for (b = chat_history.length - 1; 0 <= b; b--)
                if ("{M}" == chat_history[b].lang && /^@\(/.test(chat_history[b].text)) {
                    b = /(^@\([^\)]{1,}\)) /g.exec(chat_history[b].text)[1];
                    m.value = b;
                    k.value = "/@mods " + b;
                    Chat.update_string();
                    return
                }
            m.value = m.value.replace(/^@ ?\< ?/, "@() ");
            k.value = "/@mods " + m.value
        } else if (e || f)
            f ? (/^\/r/.test(m.value) && Mods.Chatmd.mods_client_commands.whisp(m.value),
            k.value = m.value,
            !chat_filters.color && (m.style.color = COLOR.TEAL) && (k.style.color = COLOR.TEAL)) : k.value = "/@mods " + m.value;
        else {
            if ("/" == k.value || "/" == m.value)
                k.value = "";
            m.value = 0 < m.value.length ? m.value : k.value;
            !b && (k.value = "/@mods " + k.value);
            addClass(k, "hidden");
            k.blur();
            removeClass(m, "hidden");
            m.focus()
        }
    }
    ;
    Mods.Chatmd.ModCh.createDiv = function() {
        null == getElem("mod_text") && createElem("input", wrapper, {
            id: "mod_text",
            type: "text",
            className: "hidden",
            style: "font-family: Brawler, cursive; font-size: 13px; position: absolute; left: 55px; bottom: 23px; z-index: 90; opacity: 1; color: " + COLOR.GREEN + "; text-shadow: 1px 1px 1px #3A3A3A;background: #9C9C9C; border: 0px; padding: 0px; margin: 0px;",
            setAttributes: {
                autocomplete: "off",
                size: "1",
                onkeypress: "javascript: Chat.update_string();",
                maxlength: "154"
            }
        })
    }
    ;
    Mods.Chatmd.ModCh.listener = function(b) {
        GAME_STATE == GAME_STATES.CHAT ? (hasClass(getElem("mod_text"), "hidden") || 8 != b && 46 != b || !/^\//.test(getElem("my_text").value) || "" != getElem("mod_text").value || (getElem("my_text").value = ""),
        Mods.Chatmd.chatCommand(b)) : (addClass(getElem("mod_text"), "hidden"),
        getElem("mod_text").value = "",
        getElem("mod_text").blur())
    }
    ;
    Mods.Chatmd.setCanvasSize = function() {
        var b = Math.min(16, Math.round(16 * current_ratio_y));
        getElem("mod_text").style.bottom = 25 * current_ratio_y + "px";
        getElem("mod_text").style.fontSize = b + "px"
    }
    ;
    Mods.Chatmd.ModCh.sendWhisper = function(b) {
        var e = Mods.Chatmd.ModCh.targets();
        b = getElem("mod_text").value;
        var f = ""
          , g = "";
        e && (b = e.message,
        f = e.targets,
        0 != f.length && (g = "@(" + f.toString() + ") "));
        if ("" != b && " " != b) {
            var k, m, n = {
                kemikaalikeijo: 1,
                reside: 1
            }, e = [], p = /^\s*~\s*/.test(b);
            p && (b = b.replace(/^\s*~\s*/, ""));
            for (k in online_players)
                if (m = !1,
                n[k] && -1 == f.indexOf(k) || !Player.has_lower_permissions(k) && -1 == f.indexOf(k) || (m = !0),
                m) {
                    e.push(k);
                    var r = Player.has_lower_permissions(k) ? g : "";
                    m && 0 < b.length && Socket.send("message", {
                        data: '/w "' + k + '" @mods ' + r + b
                    })
                }
            f = Player.is_chat_mod(players[0].name) ? COLOR.LGREEN : Player.is_mod(players[0].name) ? COLOR.GREEN : Player.is_admin(players[0].name) ? COLOR.ORANGE : "#EAE330";
            0 < b.length && addChatText(g + b, players[0].name, f, "chat", Mods.Chatmd.ModCh.channel);
            p && addChatText("~ Message sent to: " + e.toString().replace(/,/g, ", "), null , COLOR.ORANGE)
        }
    }
    ;
    Chat.update_string = function() {
        getElem("my_text").size = Math.max(getElem("my_text").value.length, 1);
        getElem("mod_text").size = Math.max(getElem("mod_text").value.length, 1)
    }
    ;
    Chat.has_client_command = function(b) {
        return 0 < b.length ? Mods.Chatmd.old_has_client_command(b) : !0
    }
    ;
    Chat.execute_client_command = function(b) {
        0 < b.length && Mods.Chatmd.old_execute_client_command(b)
    }
    ;
    window_onclick = function(b) {
        b && b.target && "current_channel" == b.target.id || (captcha && getElem("recaptcha_response_field") ? getElem("recaptcha_response_field").focus() : GAME_STATE == GAME_STATES.CHAT && (hasClass(getElem("mod_text"), "hidden") ? getElem("my_text").focus() : getElem("mod_text").focus()))
    }
    ;
    window.onclick = window_onclick;
    Mods.Chatmd.filter_checks = function() {
        var b = getElem("filter_channel_only").checked
          , e = getElem("filter_highlight_friends").checked;
        localStorage.colorChannel = JSON.stringify(b);
        localStorage.highlightFriends = JSON.stringify(e);
        -1 < loadedMods.indexOf("Tabs") && (b = Mods.Tabs.wwCurrentTabs[Mods.Tabs.findWithAttr(Mods.Tabs.wwCurrentTabs, "id", Mods.Tabs.wwactiveTab)],
        b.filter_coloredonly = getElem("filter_channel_only").checked,
        b.filter_highlightfriends = getElem("filter_highlight_friends").checked,
        localStorage.CurrentTabs = JSON.stringify(Mods.Tabs.wwCurrentTabs))
    }
    ;
    ChatSystem.filters_init = function() {
        var b = "attempt fails chat whisper join_leave loot magic archery spam color modcolor chattimestamp urlfilter".split(" "), e;
        for (e in b) {
            var f = getElem("filter_" + b[e]);
            removeClass(f, "green");
            removeClass(f, "red");
            chat_filters[b[e]] ? addClass(f, "red") : addClass(f, "green")
        }
        -1 < loadedMods.indexOf("Tabs") && Mods.Tabs.SaveCurrent()
    }
    ;
    Mods.Chatmd.socketOn = {
        actions: ["message", "login"],
        fn: function(b, e) {
            e && "whisper" == e.type && e.name != players[0].name && Mods.Chatmd.afkReply(e.name, e.message);
            "login" == b && e && "ok" == e.status && Contacts.add_channel("{M}")
        }
    };
    Mods.Chatmd.eventListener = {
        keys: {
            keydown: [KEY_ACTION.SEND_CHAT],
            keyup: [!0]
        },
        fn: function(b, e, f) {
            "keydown" != b || f != KEY_ACTION.SEND_CHAT || "" == getElem("my_text").value || Mods.Chatmd.blockCommand || (isTouchDevice() || (Mods.Chatmd.blockCommand = !0,
            Timers.set("unblockCommand", function() {
                Mods.Chatmd.blockCommand = !1
            }, 1E3)),
            0 == Mods.Chatmd.chatCommands(getElem("my_text").value) && (getElem("my_text").value = ""));
            "keyup" == b && (Mods.Chatmd.ModCh.listener(e),
            f != KEY_ACTION.SEND_CHAT || isTouchDevice() || (Mods.Chatmd.blockCommand = !1))
        }
    };
    Mods.Chatmd.newDrawObject = function(b, e) {
        var f;
        if (e.b_t == BASE_TYPE.PLAYER) {
            f = Player.has_lower_permissions(e.name) ? npc_base[437] : npc_base[102];
            var g = Math.random();
            Mods.Chatmd.mooDelay[e.name] = Mods.Chatmd.mooDelay[e.name] || 1;
            1E3 < timestamp() - Mods.Chatmd.mooDelay[e.name] && (Mods.Chatmd.mooDelay[e.name] = timestamp(),
            .7 < g && Mods.Chatmd.m00(e))
        } else
            f = e;
        Mods.Chatmd.oldDrawObject(b, f)
    }
    ;
    updateBase();
    Mods.Chatmd.m00 = function(b) {
        var e = "m00 m00! mU m00 m00 m00 m00 m00! moo MOO moo mOO M00".split(" ")
          , f = Math.max(1, Math.ceil(Math.random() * e.length)) - 1
          , g = getElem("enemy_hit").cloneNode(!0)
          , k = translateTileToCoordinates(b.i, b.j);
        g.id = "moo_" + b.id + (new Date).getTime();
        removeClass(g, "hidden");
        g.innerHTML = "<div id='enemy_burst' style='display: block; position: relative; background: #000000; text-align: center; width: 35px; height: 35px; -webkit-transform: rotate(20deg); -moz-transform: rotate(20deg); -ms-transform: rotate(20deg); -o-transform: rotate(20deg);'></div><div id='enemy_damage' class='damage' style='font-size: 16px; top: 4px;'></div>";
        g.childNodes[0].innerHTML = "<div style='position: absolute; background: #000000; top: 0; left: 0; height: 35px; width: 35px; -webkit-transform: rotate(135deg); -moz-transform: rotate(135deg); -ms-transform: rotate(135deg); -o-transform: rotate(135deg)'></div>";
        g.childNodes[1].innerHTML = e[f];
        g.style.background = "#000000";
        g.style.width = "35px";
        g.style.height = "35px";
        wrapper.appendChild(g);
        g.style.left = (k.x + 16 + players[0].mx) * current_ratio_x + "px";
        g.style.top = (k.y - 40 + players[0].my - 20) * current_ratio_y + "px";
        addClass(g, "opacity_100");
        setTimeout(function() {
            decreaseOpacity(g, 150, 10)
        }, 150)
    }
    ;
    drawObject = function(b, e) {
        Mods.Chatmd.oldDrawObject(b, e)
    }
    ;
    Draw.clear(ctx.players_show);
    updateBase();
    Mods.Chatmd.afkReply = function(b, e) {
        var f = Mods.Chatmd.afkHolder = Mods.Chatmd.afkHolder || {}
          , g = Mods.Chatmd.afkMessage;
        "" != g && b != players[0].name && (void 0 == f[b] || 3E5 < timestamp() - f[b]) && !/^@mods ?/.test(e) && (f[b] = timestamp(),
        Socket.send("message", {
            data: '/w "' + b + '" ' + g
        }))
    }
    ;
    Mods.Chatmd.wiki = function(b, e) {
        if ("object" === typeof e && "object" === typeof b && "wiki" === e[0]) {
            var f = {
                item: "item",
                mob: "monster",
                npc: "vendor",
                craft: "craft",
                pet: "pet",
                spell: "spell",
                enchant: "enchant"
            }
              , g = function(b, e, f) {
                e = "string" == typeof e ? "_" + e : "";
                return getElem("mods_wiki_" + b + e + ("string" == typeof e && "string" == typeof f ? "_" + f : ""))
            }
              , k = Mods.Wikimd.loadWikiType;
            e[1] && (g("type").value = f[e[1]] || e[1],
            k(0, "type"),
            e[2] && b[e[1]] && void 0 != b[e[1]][e[2]] && (g("type", f[e[1]] || e[1]).value = e[2],
            k(1, e[1]),
            e.text && "text" === b[e[1]][e[2]] && (g("name").value = "string" === typeof e.text ? e.text : null ),
            e.value && "value" === b[e[1]][e[2]] && (g("type", f[e[1]] || e[1], e[2]).value = "string" === typeof e.value ? e.value : -1,
            k(2, e[2])),
            !e.range || "range" !== b[e[1]][e[2]] && "value" !== b[e[1]][e[2]] || (g("range").value = e.range,
            g("level", "low").value = -1 < e.min ? e.min : null ,
            g("level", "high").value = -1 < e.max ? e.max : null )));
            removeClass(getElem("mods_form"), "hidden");
            Mods.Wikimd.populateWiki(!0);
            Mods.loadModMenu_wiki && Mods.loadModMenu_wiki()
        }
    }
    ;
    Mods.Chatmd.mods_client_commands = {
        findcom: function(b) {
            if ("undefined" === typeof Mods.Newmap || "undefined" === typeof Mods.Newmap.POI || "undefined" === typeof Mods.Newmap.POIfind)
                return "Enhanced Map mod not loaded! You need to load it first before using the /find command.";
            Mods.Newmap.POIfind = [];
            HUD.drawMinimap();
            b = b.toLowerCase();
            if ("" === b)
                return "Use /find [monster] or [material] to get the map or coordinates of what you're looking for.";
            var e = "", f = "", g = !1, k = !1, m = {
                0: "Dorpat",
                1: "Dungeon",
                2: "Narwa",
                3: "Whiland",
                4: "Reval",
                5: "Rakblood",
                6: "Blood River",
                7: "Hell",
                8: "Clouds",
                9: "Heaven",
                10: "Cesis",
                11: "Walco",
                13: "Pernau",
                14: "Fellin Island",
                15: "Dragon's Lair",
                16: "No Man's Land",
                17: "Ancient Dungeon",
                18: "Lost Woods",
                19: "Minigames",
                20: "Broceliande Forest",
                21: "Devil's Triangle",
                22: "Cathedral",
                23: "Illusion Guild",
                24: "Every Man's Land",
                25: "Moche",
                26: "Wittensten",
                27: "Dungeon II",
                28: "Dungeon III",
                29: "Dungeon IV"
            }, n = {}, p;
            for (p in m)
                n[p] = !1;
            var r = {
                "fir log": "fir",
                "fir tree": "fir",
                "fir wood": "fir",
                "oak log": "oak",
                "oak tree": "oak",
                "oak wood": "oak",
                "willow log": "willow",
                "willow tree": "willow",
                "willow wood": "willow",
                "maple log": "maple",
                "maple tree": "maple",
                "maple wood": "maple",
                "spirit wood": "spirit log",
                "spirit tree": "spirit log",
                "blue palm log": "blue palm",
                "blue palm tree": "blue palm",
                "blue palm wood": "blue palm",
                "magic oak log": "magic oak",
                "magic oak tree": "magic oak",
                "magic oak wood": "magic oak",
                "iron ore": "iron",
                "iron chunk": "iron",
                "silver ore": "silver",
                "silver chunk": "silver",
                "gold ore": "gold",
                "gold chunk": "gold",
                "white gold ore": "white gold",
                "white gold chunk": "white gold",
                "azure ore": "azure",
                "azure chunk": "azure",
                azurite: "azure",
                "azurite ore": "azure",
                "azurite chunk": "azure",
                "platinum ore": "platinum",
                "platinum chunk": "platinum",
                "fire stone ore": "fire stone",
                "fire stone chunk": "fire stone",
                firestone: "fire stone",
                "firestone ore": "fire stone",
                "firestone chunk": "fire stone",
                grendalf: "grendalf the grey",
                overlord: "orc overlord",
                phoenix: "flame phoenix",
                vortex: "chaos vortex",
                dorpat: "transfer to dorpat",
                dungeon: "dorpat mine",
                reval: "transfer to reval",
                cesis: "transfer to cesis",
                "ancient dungeon": "transfer to ancient dungeon",
                pernau: "transfer to pernau",
                whiland: "transfer to whiland",
                clouds: "transfer to clouds",
                heaven: "transfer to heaven",
                "lost woods": "transfer to lost woods",
                "forest maze": "transfer to lost woods",
                rakblood: "transfer to rakblood",
                "no man's land": "transfer to no man's land",
                pvp: "transfer to no man's land",
                narwa: "transfer to narwa",
                "blood river": "transfer to blood river",
                hell: "transfer to hell",
                "fellin island": "transfer to fellin island",
                "dragon's lair": "transfer to dragon's lair"
            };
            b in r && (b = r[b]);
            for (p in Mods.Newmap.POI[0])
                "undefined" !== typeof Mods.Newmap.POI[0][p].name && Mods.Newmap.POI[0][p].name.toLowerCase() === b && (current_map == Mods.Newmap.POI[0][p].mapid ? (g && (e += ", "),
                g = !0,
                e = e + "(" + Mods.Newmap.POI[0][p].x + ", " + Mods.Newmap.POI[0][p].y + ")",
                Mods.Newmap.POIfindMap = current_map,
                Mods.Newmap.POIfind.push({
                    color: "#FF0000",
                    i: Mods.Newmap.POI[0][p].x,
                    j: Mods.Newmap.POI[0][p].y
                })) : n[Mods.Newmap.POI[0][p].mapid] || (k && (f += ", "),
                k = !0,
                n[Mods.Newmap.POI[0][p].mapid] = !0,
                f += m[Mods.Newmap.POI[0][p].mapid]));
            b = b.replace(/\w\S*/g, function(b) {
                return b.charAt(0).toUpperCase() + b.substr(1).toLowerCase()
            });
            g && (e = "Found " + b + " in " + m[current_map] + " at coordinates: " + e + ". ",
            HUD.drawMinimap());
            k && (e = g ? e + "Found in: " + f + "." : e + "Found " + b + " in: " + f + ".");
            return g || k ? e : b + " not found."
        },
        dailylogin: function() {
            var b = players[0].temp.consecutive_logins;
            return "Daily rewards counter: " + b + " day" + sOrNoS(b) + ", happened " + beautifulTime(timestamp() - players[0].temp.consecutive_login, 2, !0) + " ago"
        },
        online: function(b) {
            var e = "", f;
            for (f in online_players)
                -1 != f.indexOf(b) && (e += f + ", ");
            return 0 < e.length ? "Online players (" + b + "): " + e.slice(0, -2) : "No players online matching " + b
        },
        tip: function() {
            return "TIP: " + Mods.Chatmd.game_tips[0][Math.floor(Math.random() * Mods.Chatmd.game_tips[0].length)]
        },
        played: function() {
            var b = timestamp() - players[0].temp.created_at;
            return "Time since you started playing: " + Mods.timeConvert(b / 1E3) + "."
        },
        friend: function(b) {
            var e = !0, f = !1, g;
            for (g in Contacts.friends)
                if (Contacts.friends[g].name == b) {
                    e = !1;
                    break
                }
            e && Contacts.add_friend(b);
            !e && Contacts.remove_friend(b);
            f = e && "added to " || "removed from ";
            reply = b + " has been " + f + "your friend's list.";
            return "removed from " == f ? !1 : reply
        },
        ignore: function(b) {
            var e = !0, f = !1, g;
            for (g in Contacts.ignores)
                if (Contacts.ignores[g] == b) {
                    e = !1;
                    break
                }
            e && Contacts.ignore_player(b);
            !e && Contacts.remove_ignore(b);
            f = e && "added to " || "removed from ";
            reply = b + " has been " + f + "your ignore list.";
            return "removed from " == f || Player.has_lower_permissions(b) ? !1 : reply
        },
        join: function(b) {
            var e = !0;
            Contacts.channels[b] && (e = !1);
            var f = !1, g;
            for (g in channel_names)
                if (channel_names[g] == b) {
                    f = !0;
                    break
                }
            e && f && Contacts.add_channel(b);
            return reply = "You" + (e && f && " have added channel " || !e && f && " are already in channel " || " cannot join channel ") + b + "."
        },
        leave: function(b) {
            var e = !0
              , f = !1;
            !Contacts.channels[b] && (e = !1);
            var g = !1, k;
            for (k in channel_names)
                if (channel_names[k] == b) {
                    g = !0;
                    break
                }
            e && g && Contacts.remove_channel(b);
            return reply = "You" + (e && g && " have left channel " || !f && " are not in channel " || f) + b + "."
        },
        whisp: function(b) {
            b = b.replace("/r", "").trim() || "";
            var e = Mods.Chatmd.whispNames;
            return 0 < e.length ? (b = '/w "' + e[0] + '" ' + b,
            getElem("my_text").value = b,
            !hasClass(getElem("mod_text"), "hidden") && (getElem("mod_text").value = b),
            !0) : "You have no target to whisper."
        },
        ping: function(b) {
            if ("all" == b)
                return !0;
            var e;
            b = parseInt(b) || Mods.currentWorldID || 0;
            for (var f in ServerList.downloaded)
                if (b == ServerList.downloaded[f].world) {
                    e = f;
                    break
                }
            e && ServerList.preping(e, !0);
            return !1
        },
        mods: function() {
            removeClass(getElem("mods_form"), "hidden");
            return !1
        },
        wiki: function(b) {
            function e(b) {
                b && (k.text = b)
            }
            function f(b) {
                b && (q = r.exec(b)) && (k.range = q[1],
                k.min = q[3],
                k.max = q[5])
            }
            function g(b) {
                if (b && (t = p.exec(b))) {
                    b = {
                        weapon: "weapons",
                        weaponss: "weapons",
                        shield: "r.hand armors"
                    };
                    var e = ["weapon", "weaponss", "shield"], g = t[1], m;
                    for (m in e)
                        g = g.replace(e[m], b[e[m]]);
                    k.value = g;
                    f(t[3])
                }
            }
            b = b.toLowerCase();
            var k, m, n, p, r, t, q;
            k = {
                0: "wiki"
            };
            m = {
                item: {
                    all: "range",
                    skill: "value",
                    type: "value",
                    name: "text"
                },
                mob: {
                    all: "range",
                    name: "text",
                    item: "text"
                },
                npc: {
                    all: "range",
                    name: "text",
                    item: "text"
                },
                craft: {
                    all: "range",
                    skill: "value",
                    source: "value",
                    item: "text"
                },
                pet: {
                    all: "range",
                    name: "text",
                    family: "text"
                },
                spell: {
                    all: "range",
                    name: "text"
                },
                enchant: {
                    all: "range",
                    item: "text"
                }
            };
            n = {
                monster: "mob",
                vendor: "npc"
            };
            p = /^([^ ]{1,})( (.*))?/gi;
            r = /^([^ ]{1,}) (\(|min ?|from ?|)?=?(\d{1,})? ?(, ?|to ?|max ?)?=?(\d{1,})?/gi;
            b = /^(item|mob|monster|npc|vendor|craft|pet|spell|enchant) ?(skill|type|name|item|family|all|source)?( (.*))?/gi.exec(b);
            if (!b)
                return Mods.Chatmd.wiki(m, k),
                !1;
            k[1] = n[b[1]] || b[1];
            k[2] = n[b[2]] || b[2];
            "text" == m[k[1]][k[2]] && e(b[4]);
            "range" == m[k[1]][k[2]] && f(b[4]);
            "value" == m[k[1]][k[2]] && g(b[4]);
            Mods.Chatmd.wiki(m, k);
            return !1
        },
        moo: function(b) {
            for (var e = 1; 120 > e; e++)
                Timers.clear("m00 chat" + e);
            b = parseInt(b);
            b = "number" == typeof b && 0 < b ? Math.min(120, Math.max(Math.ceil(b), 1)) : 10;
            reply = "m000000000000000000";
            drawObject = function(b, e) {
                Mods.Chatmd.newDrawObject(b, e)
            }
            ;
            drawMap(!1, !0, !1);
            updateBase();
            HUD.drawMinimap();
            Timers.set("m00", function() {
                drawObject = function(b, e) {
                    Mods.Chatmd.oldDrawObject(b, e)
                }
                ;
                drawMap(!1, !0, !1);
                updateBase()
            }, 1E3 * b);
            for (e = 1; e < 10 * b; e++)
                Timers.set("m00 chat" + e, function() {
                    drawMap(!1, !0, !1);
                    updateBase()
                }, 100 * e)
        },
        timer: function(b) {
            var e = /set/.test(b) && "set" || /start/.test(b) && "start" || /clear/.test(b) && "clear" || !1
              , f = "set" == e && /.{1,}set/.exec(b)[0].replace(" set", "") || "start" == e && /.{1,}start/.exec(b)[0].replace(" start", "") || "clear" == e && /.{1,}clear/.exec(b)[0].replace(" clear", "") || !1
              , g = (f = "string" == typeof f && 7 < f.length && f.slice(7, 100) || "default",
            " (" + f.toLowerCase() + ") ") || ""
              , k = f && " (" + f.toLowerCase() + ") " || "";
            target = "set" == e && /(?=set).{1,}/.exec(b)[0].replace("set ", "") || !1;
            if ("set" == e) {
                b = 0;
                var m = {
                    hrs: {
                        0: !1,
                        1: ["hours", "hour", "hrs", "hr", "h"],
                        2: 3600
                    },
                    min: {
                        0: !1,
                        1: ["minutes", "minute", "mins", "min", "m"],
                        2: 60
                    },
                    sec: {
                        0: !1,
                        1: ["seconds", "second", "secs", "sec", "s"],
                        2: 1
                    }
                }, n;
                for (n in m) {
                    var p = m[n], r = !1, t = t || !1, q;
                    for (q in p[1])
                        RegExp(p[1][q]).test(target) && (r = p[1][q],
                        p[0] = RegExp(".{1,}" + r).exec(target),
                        p[0] = p[0][0],
                        target = target.replace(p[0], ""),
                        p[0] = p[0].replace(r, ""),
                        p[0] = parseFloat(p[0]),
                        p[0] = 0 < p[0] && p[0] * p[2] || 0,
                        b += p[0],
                        t = !0)
                }
                target = t ? Math.ceil(b) : parseInt(target) || !1
            }
            if ("set" == e && "number" == typeof target && 0 < target)
                Mods.Chatmd.runTimer.set[f.toLowerCase()] = [timestamp(), 1E3 * target],
                Timers.set("set_timer" + f.toLowerCase(), function(b) {
                    addChatText("Countdown " + k + "has expired. It has been " + target + " seconds.", void 0, COLOR.TEAL);
                    delete Mods.Chatmd.runTimer.set[f.toLowerCase()]
                }, 1E3 * target),
                reply = "Countdown " + g + "started for " + Mods.timeConvert(target) + ".";
            else if ("start" == e)
                Mods.Chatmd.runTimer.start[f] = [timestamp()],
                reply = "Timer " + g + "started.";
            else if ("clear" == e)
                delete Mods.Chatmd.runTimer.start[f],
                delete Mods.Chatmd.runTimer.set[f],
                Timers.clear("set_timer" + f.toLowerCase()),
                reply = "Timer/Countdown " + g + "has been deleted.";
            else {
                g = Mods.Chatmd.runTimer;
                q = t = !1;
                for (b = 0; 2 > b; b++) {
                    0 == b ? (e = "start",
                    p = "Timers elapsed:",
                    m = ".") : (e = "set",
                    p = "Countdowns running:",
                    m = " left.");
                    addChatText(p, void 0, COLOR.TEAL);
                    for (n in g[e])
                        q = t = !0,
                        p = 0 < g[e][n][0] && timestamp() - g[e][n][0] - (g[e][n][1] || 0) || !1,
                        0 < g[e][n][1] && (p *= -1),
                        p = 0 < p ? "- Timer (" + n + ") running: " + Mods.timeConvert(p / 1E3) + m : "- Timer (" + n + ") has already elapsed.",
                        addChatText(p, void 0, COLOR.TEAL);
                    !t && addChatText("- No timers running...", void 0, COLOR.TEAL);
                    t = !1
                }
                !q && (reply = "No timers have been started. Try /timer name start (to start a timer) or /timer name set # (to start a countdown).") || (reply = !1)
            }
            localStorage.timer = JSON.stringify(Mods.Chatmd.runTimer);
            return reply
        },
        modch: function(b) {
            Mods.Chatmd.ModCh.sendWhisper(b)
        },
        ttlxp: function(b) {
            b = /^(\d{1,}) ?(\-|to)? ?(\d{1,})?$/.exec(b);
            if (!b) {
                b = 0;
                for (var e in skills[0])
                    skills[0][e].xp && (b += Math.floor(skills[0][e].xp));
                return "Your total experience for all skills is: " + thousandSeperate(Math.round(b))
            }
            e = b[1];
            var f = b[3] || 1;
            b = Math.min(e, f) + " to " + Math.max(e, f);
            e = Level.xp_for_level(e);
            f = Level.xp_for_level(f);
            e = Math.max(e, f) - Math.min(e, f);
            e = thousandSeperate(e);
            return "Total exp needed to go from level " + b + ": " + e
        },
        id: function(b) {
            if (!Player.has_lower_permissions(players[0].name) && !Player.is_mod_dev(players[0].name))
                return !1;
            var e, f, g, k, m, n, p, r, t, q, u, x, y;
            u = [];
            y = {};
            x = "";
            g = /^(item_base|objects_data|object_base|ground_base|npc_base|players|Magic|quests|pets|IMAGE_SHEET|skills|FORGE_FORMULAS|CARPENTRY_FORMULAS|sprite|countries)? ?(.*)/;
            f = /^(([^!=><&]{1,})?(!|!=|<=|>=|=|<|>))? ?([^!=><&]{1,})/g;
            k = /([^.]{1,})/g;
            b = g.exec(b);
            r = void 0 != b[1] && void 0 != window[b[1]] ? window[b[1]] : window.item_base;
            g = b[1] || "item_base";
            b = b[2].replace(/\+/g, "\\+").replace(/\-/g, "\\-").replace(/\'/g, "\\'").split(/ ?& ?/g);
            if (!b || !r)
                return "No items match the given values. (error: no parameters)";
            for (m in r)
                y[m] = r[m];
            for (m in b)
                if (f.lastIndex = 0,
                (e = f.exec(b[m].trim())) && e[4])
                    for (n in r = e[2] ? e[2].match(k) : ["name"],
                    t = e[3] && "=" != e[3] && "!" != e[3] && "!=" != e[3] && -1 < e[4] ? e[3] : "!" == e[3] || "!=" == e[3] ? "!=" : "=",
                    q = e[4],
                    str = "!=" == t ? "!" + q : "=" == t ? q.replace(/\\/g, "") : ">=" == t ? q + "+" : "<=" == t ? q + "-" : ">" == t ? parseInt(q) + 1 + "+" : parseInt(q) - 1 + "-",
                    u.push(r.toString().replace(/,/g, ".") + "=" + str),
                    y) {
                        e = y[n];
                        for (p in r)
                            "object" == typeof e && (e = e[r[p]]);
                        void 0 != e && "object" !== typeof e && null !== e && -1 < q && -1 < e && ("=" == t && e == q || ">" == t && e > q || "<" == t && e < q || ">=" == t && e >= q || "<=" == t && e <= q || "!=" == t && e != q) || !(-1 < q && -1 < e) && ("!=" !== t && RegExp(q, "gi").test(e) || "!=" === t && 0 == RegExp(q, "gi").test(e)) || delete y[n]
                    }
            u = u.toString().replace(/ ,/g, "; ");
            u = (0 < u.length ? "." : "") + u + ": ";
            b = 0;
            for (m in y)
                if (b += 1,
                20 < b) {
                    x += "(too many results), ";
                    break
                } else
                    x += y[m].name + " (" + m + "), ";
            return 0 < x.length ? g + u + x.slice(0, -2) : g + u + "No items match the given values."
        },
        help: function(b) {
            var e = {
                afk: 'Use /afk or /afk [message] to set an automatic reply to people who whisper you if you are away from the keyboard. While your status is "AFK" if you type /afk again, the automatic replies will be disabled.',
                combats: "Use /combats to see everyones combat level.",
                cathedral: "Use /cathedral to see how much time is left before can start another cathedral run.",
                daily: "Use /daily to see the number of consecutive days you have on your daily rewards counter.",
                find: "Use /find [monster] or [material] to get the map or coordinates of what you're looking for.",
                friend: "Use /friend [player] to quickly add or remove a player to/from your friends list. Example: /friend dendrek",
                help: "Use /help to see a list of the mod chat commands. To read a description of a command, type /help [command].",
                ignore: "Use /ignore [player] to quickly add or remove a player to/from your ignore list. Example: /ignore dumbplayer",
                join: "Use /join [CH] (where CH is a valid channel name, written with capital letters, such a EN, DE, 18, etc) to join that channel. Example: /join EN",
                leave: "Use /leave [CH] (where CH is a valid channel name, written with capital letters, such as EN, DE, 18, etc) to leave taht channel. Example: /leave EN",
                maintenance: "Use /maintenance to see how much time is left till the next maintenance restart.",
                m00: "Use /m00 to see ... something happen. You can extend the duration of this command with /m00 # (such as /m00 30 to set the duration to 30 seconds).",
                online: "Use /online to see a list of players who are currently online.",
                o: "Use /o [player] to check if that player is online. It's a fast way to confirm a players online-status without scanning the /online list. Example: /o dendrek",
                penalty: "Use /penalty to see how many captcha points you have stored. You can save up to 5 points. If you reach -5 points, you'll go to jail.",
                ping: "Use /ping to see how much of a delay (called latency) there is between you and your computer. Every 1000ms equals a 1 second delay.",
                played: "Use /played to see how long it has been since you created your current character. This is a measure of time since you started, not of actual time played.",
                premium: "Use /premium to buy or see how much premium time you have left.",
                r: 'Use /r to reply to the last person who whispered you. If a player has whispered you recently enough, /r will immediately change to /w "playername". Additionally, use PageUp and PageDown to cycle through previous whisper targets.',
                savemap: "Use /savemap to save current map into a .PNG file. Caution, might take a while to generate! Not to be used with a mobile device.",
                saveplayer: "Use /saveplayer to save current player into a .PNG file.",
                world: "Use /world to see which world you are in currently. Use /world x to connect to another world, change x into any available world number.",
                timer: {
                    desc: "Use /timer to check already created timers. You can also create a countdown (using /timer set), a clock (using /timer start), remove timers (using /timer clear), and even give timers names (using /timer [name] [command]). Type /help timer [set/start/clear/name] for more details.",
                    set: 'The command /timer set #[time type] starts a timer for "#" seconds. If time type is specified (examples: seconds/secs/sec/s, /minutes/mins/min/m, /hours/hrs/hr/h) the # will be in that time interval. Example: /timer set 30m starts a timer for 30minutes. /timer set 1h 20m 15s can also be done.',
                    start: 'The command /timer start starts a "clock" from the current moment that counts up. You can check how much time has passed by typing /timer at any time.',
                    clear: 'The command /timer [name] clear cancels all existing timers that have the specified "name" value. If name is not included, /timer clear cancels all existing "default" timers. See /help timer name for more details on naming timers.',
                    name: "Timers can be named in this way: /timer [name] [command]. The commands are set, start, and clear. The name can be practically anything, but it CANNOT contain the words set, start or clear. Examples: /timer orc overlord set 20m (starts a countdown named 'orc overlord'), /timer see how long this takes start (starts a clock named 'see how long this takes')."
                },
                totalexp: "Use /totalexp to see the total experience you've gathered. Or use /totalexp # to see how much exp would be required to go from level 1 to the level specified. Or use /totalexp # to # to see how much exp is required to go from the lower level to the higher. Example: /totalexp 90 to 95",
                totalvalue: "Use /totalvalue to see a total wiki value of all items in your inventory, chest, pet, as well as your coins.",
                xp: "Use /xp to see if a 2x experience event is currently running, and to see the duration if one is.",
                wiki: {
                    desc: 'Use /wiki to open up the in-game wiki. You can also perform a search using this command. /wiki [option1] [option2] [option3] etc, where each option "fills" in one of the search boxes in the wiki. For more details, type /help wiki options.',
                    options: 'The wiki has dropdown boxes that must be filled in. To do a wiki search using the /wiki command, you must "fill in" each box with an appropriate value. Examples of wiki searches: /wiki item name bronze pants, /wiki mob item superior armor enchant, /wiki npc name magician, /wiki craft item iron bar. The different parts of the search must be included for it to work.'
                }
            }, f = " List of commands: ", g = "(", k = "(", m;
            for (m in e) {
                var g = g + (m + "|"), f = f + (m + ", "), n;
                for (n in e[m])
                    "desc" == n || 0 <= n || -1 != k.indexOf(n) || (k += n + "|")
            }
            f = f.slice(0, -2) + ".";
            g = g.slice(0, -1) + ")";
            k = k.slice(0, -1) + ")";
            e.help += f;
            b = RegExp(g + " ?" + k + "?", "g").exec(b);
            f = "";
            return f = b && e[b[1]] && e[b[1]][b[2]] ? e[b[1]][b[2]] : b && e[b[1]] ? e[b[1]].desc || e[b[1]] : e.help
        },
        obj: function(b) {
            if (!Player.has_lower_permissions(players[0].name) && !Player.is_mod_dev(players[0].name))
                return !1;
            var e, f, g, k;
            e = /(item_base|objects_data|object_base|ground_base|npc_base|players|Magic|quests|pets|IMAGE_SHEET|skills|FORGE_FORMULAS|CARPENTRY_FORMULAS|sprite|countries)? ?\[?(\d{1,})\]? ?(.*)/g.exec(b);
            g = /([^.]{1,})/g;
            if (!e)
                return "No items match the given value. (error: no parameters)";
            b = e[1] || "item_base";
            g = e[3] ? e[3].match(g) : [];
            f = e[2];
            if (void 0 == window[b] || "undefined" == typeof f)
                return "No items match the given values. (error: base = undefined)";
            e = g.toString().replace(/,/g, ".");
            e = b + "[" + f + "]" + (0 < e.length ? "." + e : "") + ": ";
            b = window[b][f];
            for (k in g)
                "undefined" != typeof b && (b = b[g[k]]);
            if ("undefined" === typeof b)
                return "No items match the given values.";
            if ("object" !== typeof b && null !== b)
                e += b + ", ";
            else
                for (k in b)
                    e = "object" == typeof b[k] ? e + (k + " (object), ") : e + (k + " (" + b[k] + "), ");
            return e.slice(0, -2)
        },
        afk: function(b) {
            var e = ""
              , e = "";
            b = b.trim();
            e = "[AFK]: " + (0 < b.length ? b : "I am away from my keyboard.");
            "" == Mods.Chatmd.afkMessage || Mods.Chatmd.afkMessage != e && "" != b ? (Mods.Chatmd.afkMessage = e,
            Mods.Chatmd.afkHolder = {},
            e = 'You are now [AFK] : "' + b + '"') : (Mods.Chatmd.afkMessage = "",
            e = "You are no longer [AFK]");
            Player.update_healthbar();
            return e
        },
        ttval: function() {
            var b, e;
            b = 0;
            for (e in players[0].temp.inventory)
                b += item_base[players[0].temp.inventory[e].id].params.price;
            for (e in players[0].pet.chest)
                b += item_base[players[0].pet.chest[e]].params.price;
            for (e in chests[0])
                b += chests[0][e].count * item_base[chests[0][e].id].params.price;
            b += players[0].temp.coins;
            b = thousandSeperate(b);
            return "The total value of items in your Chest/Inv/Pet + Coins is: " + b
        },
        tele: function(b) {
            if (!Player.has_permissions(players[0].name))
                return !1;
            var e;
            b = b.split(" ");
            e = players[0].i + (parseInt(b[0]) || 0);
            b = players[0].j + (parseInt(b[1]) || 0);
            Socket.send("message", {
                data: "/level " + players[0].map + " " + e + " " + b
            });
            return !1
        },
        showcl: function() {
            return "Current combat level = " + players[0].params.combat_level
        },
        showversion: function() {
            return "Game Version = " + release_version + " | Modpack " + Mods.version + " (" + Mods.versionDate + ")"
        }
    };
    Mods.Chatmd.chatCommands = function(b) {
        var e = {
            online: ["/o", 1],
            played: ["/played", 0],
            friend: ["/friend", 1],
            ignore: ["/ignore", 1],
            join: ["/join", 1],
            leave: ["/leave", 1],
            whisp: ["/r", 0],
            ping: ["/ping"],
            mods: ["/mods", 0],
            wiki: ["/wiki"],
            moo: ["/m00"],
            timer: ["/timer"],
            tip: ["/tip", 0],
            modch: ["/@mods", 1],
            ttlxp: ["/totalexp"],
            id: ["/id", 1],
            help: ["/help"],
            obj: ["/obj", 1],
            afk: ["/afk"],
            ttval: ["/totalvalue", 0],
            tele: ["/tele", 1],
            dailylogin: ["/daily"],
            findcom: ["/find", 1],
            showcl: ["/cl", 0],
            showversion: ["/version", 0]
        }, f, g = !1, k;
        for (k in e)
            if (RegExp("^" + e[k][0] + "\\b" + (e[k][1] && 1 == e[k][1] ? " " : "")).test(b)) {
                g = !0;
                f = k;
                break
            }
        if (!g)
            return b;
        g = "number" == typeof e[f][1] ? e[f][1] : 2;
        if (0 < g) {
            var m = b.split(" ");
            k = "";
            m[0] == e[f][0] && (m.shift(),
            k = m.join(" ").trim(),
            m = [],
            k.replace(/"([^\\"]*(?:\\.[^\\"]*)*)"|'([^\\']*(?:\\.[^\\']*)*)'|(\S+)/g, function(b, e, f, g) {
                m.push(e || f || g || "")
            }),
            m = m.join(" ").trim());
            if (1 == g && 0 == k.length)
                return b;
            b = Mods.Chatmd.mods_client_commands[f](m)
        } else
            b = Mods.Chatmd.mods_client_commands[f]();
        return "string" == typeof b ? (addChatText(b, void 0, COLOR.TEAL),
        !1) : b ? !0 : !1
    }
    ;
    Mods.Chatmd.ScheduleTips = function() {
        0 == Mods.Chatmd.tipsenabled && Mods.Chatmd.chatCommands("/tip");
        setTimeout(function() {
            Mods.Chatmd.ScheduleTips()
        }, 6E5)
    }
    ;
    Mods.Chatmd.Tipstoggle = function() {
        var b = getElem("settings_tips");
        switch (Mods.Chatmd.tipsenabled) {
        case 0:
            b.innerHTML = "Tips (off)";
            Mods.Chatmd.tipsenabled = 1;
            break;
        default:
            b.innerHTML = "Tips (on)",
            Mods.Chatmd.tipsenabled = 0
        }
        localStorage.tipsenabled = JSON.stringify(Mods.Chatmd.tipsenabled)
    }
    ;
    Mods.Chatmd.Timestamptoggle = function() {
        var b = getElem("settings_enableallchatts");
        switch (Mods.Chatmd.enableallchatts) {
        case 0:
            b.innerHTML = "Timestamps on all chat lines (on)";
            Mods.Chatmd.enableallchatts = 1;
            break;
        default:
            b.innerHTML = "Timestamps on all chat lines (off)",
            Mods.Chatmd.enableallchatts = 0
        }
        localStorage.enableallchatts = JSON.stringify(Mods.Chatmd.enableallchatts)
    }
    ;
    (function() {
        getElem("chat").style.opacity = ".9";
        getElem("my_text").style.opacity = "1";
        createElem("div", "filters_form", {
            id: "mod_filters",
            style: "padding-top: 23px; width: 50%; float: left;"
        });
        var b = {
            spam: "Spam information",
            color: "Colored channels",
            modcolor: "Chat moderator color",
            chattimestamp: "Chat timestamps",
            urlfilter: "Disable URL in chat"
        }, e;
        for (e in b)
            createElem("span", "mod_filters", {
                id: "filter_" + e,
                className: "wide_link pointer green",
                innerHTML: b[e],
                onclick: "ChatSystem.filter_toggle('" + e + "')"
            }),
            "color" == e && (createElem("span", "mod_filters", {
                style: "margin-top: 5px; margin-bottom: 5px; padding-left: 5px; width: 100%; font-size: .9em; display: inline-block; vertical-align: middle;",
                innerHTML: "<input type='checkbox' id='filter_channel_only' onclick='Mods.Chatmd.filter_checks();'><span style='position: absolute; padding-top: 5px; padding-left: 3px;'>Color channel only</span>"
            }),
            createElem("span", "mod_filters", {
                style: "margin-top: 5px; margin-bottom: 5px; padding-top: 5px; padding-left: 5px; width: 100%; font-size: .9em; display: inline-block; vertical-align: middle;",
                innerHTML: "<input type='checkbox' id='filter_highlight_friends' onclick='Mods.Chatmd.filter_checks();'><span style='position: absolute; padding-top: 5px; padding-left: 3px;'>Highlight friends</span>"
            }));
        getElem("filter_channel_only").checked = JSON.parse(localStorage.colorChannel);
        getElem("filter_highlight_friends").checked = JSON.parse(localStorage.highlightFriends);
        getElem("filter_attempt").style.paddingTop = "20px";
        getElem("filter_attempt").parentNode.style.width = "50%";
        getElem("filter_attempt").parentNode.style.cssFloat = "left";
        getElem("filter_attempt").parentNode.childNodes[1].style.position = "absolute";
        getElem("filters_form").style.width = "328px";
        Mods.Chatmd.game_tips = {
            0: "In defensive fight mode, each point of melee damage you deal will give 2 xp to the defense skill and 1 xp to health.;In accurate fight mode, each point of melee damage you deal will give 2 xp to the accuracy skill and 1 xp to health.;In aggressive fight mode, each point of melee damage you deal will give 2 xp to the strength skill and 1 xp to health.;In controlled fight mode, combat xp is equally divided between strength, defense and accuracy. Health will always get 1 xp per damage dealt.;Ingame wiki mod is a precious resource to plan your adventure. Access it typing /wiki in the chat line.;You can turn tips off from the Game Options menu.;If you like RPG MO, consider writing a review and gaining free MOS: http://forums.mo.ee/viewtopic.php?t=3870.;There is a Secret Cow Level.;The Enhanced Map mod adds several details to the game map, including key resource spots, travel points and boss locations.;The Enhanced Market mod adds several helpers for player's market operations, including the ability to resubmit expired offers and compare your equip with the one that is for sale.;Your health slowly regenerates over time: you gain 1 health every minute.;The more health a mob has, the more time it takes to respawn.;Be ready to be hunted down and fight for your life if you go into No Man's Land, the RPG MO PvP area.;Don't sell raw fish you get, cook it!;Better boots can increase your movement speed.;Food heals you. You can get food by killing chickens or by fishing. You may have to cook the food.;The forums have a lot of information about this game. You can access them on http://forums.mo.ee/ .;Are you lost? Click on the minimap to enlarge it or save entire map with /savemap;If you die, you will lose all the items you are carrying but the two most valuable. Beware!;Potion of Preservation is a special potion that must be equipped and it will be consumed on death, allowing you to save a total of 7 items from your inventory.;If you have a pet equipped and you die you keep the pet. If it is not equipped, but it's in your inventory you may lose it.;When you die you do not lose the items you placed in your pet's inventory.;You can buy an island deed from the farmer in Dorpat.;To see your combat level, mouse over yourself. To see the level of monsters, position the mouse pointer over them.;Public chat is global, meaning everyone online can read it!;Players chat is white, moderators chat is green and developers/admins chat is orange.;To whisper, type /w \"[playersname]\" followed by the message.;Type /online to bring up a list of players currently online.;Type /played to see how much time has passed since your first login.;Type /penalty to view or spend your current penalty points.;Type /wiki to access the ingame wiki database.;Enable the Enhanced Market mod to gain access to the Trade Channel ($$).;Type /xp to check the duration of an ongoing x2 Experience event.;x2 Experience server events are triggered by players using special x2 pots from the MOS market.;Need help? Don't be afraid to ask! RPG MO is full of helpful players! Further help and guides can be found in the game forums.;Higher accuracy will allow you to equip better weapons.;Higher defense will allow you to equip better armor.;Higher health will allow you to equip better jewelry.;Do not ignore Captchas! If you fail or ignore them you will get -5 penalty points and you will go to jail.;If you end up in jail, only a Game Moderator or an Admin can decide to free you.;You can save up to 5 captcha points. Using Captcha points will add XP to a skill of your choice.;You can access the player's market through the chest.;Some pets can be purchased from the pet vendor in Dorpat. Better pets are usually available on the market ;A pet can extend your inventory space by 4, 8, 12 or 16 slots. Pets also give stats boosts.;Cross-chatting is bad. If someone is speaking in a chat channel, make sure you answer in the same one.;The best way to make money is through gathering professions (especially mining). There will always be players looking for iron, sand or coal in the player's market!;Through the market you can place \"buy\" or \"sell\" offers, and you can check buy and sell offers from other players.;MOS is a special currency that can be acquired with real money. It allows you to buy special items from the MOS store.;The MOS Store is accessible from the \"Buy items and coins\" link at the bottom right of page.;To use magic you need to buy and equip a magic pouch, fill it with spell scrolls (all available at Dorpat Magician NPC) and engage in combat.;You are allowed to have a max of 5 accounts (alts), but trading items or materials between your own accounts is not allowed.;Please check RPG MO Code of Conduct on http://mo.ee/rules".split(";")
        };
        createElem("div", "options_game", {
            innerHTML: "<span class='wide_link pointer' id='settings_tips' onclick='Mods.Chatmd.Tipstoggle();'>Tips (on)</span>"
        });
        createElem("div", "options_game", {
            innerHTML: "<span class='wide_link pointer' id='settings_enableallchatts' onclick='Mods.Chatmd.Timestamptoggle();'>Timestamps on all chat lines (off)</span>"
        });
        Mods.Chatmd.ModCh.createDiv();
        Mods.Chatmd.Tipstoggle();
        Mods.Chatmd.ScheduleTips();
        Mods.Chatmd.Timestamptoggle();
        iOS && (getElem("mod_text").style.left = "63px");
        getElem("checkbox_tabs").checked && !Mods.isLoaded("Tabs") && Mods.loadSelectedMods("tabs");
        Contacts.add_channel("{M}");
        channel_names.push(Mods.Chatmd.ModCh.channel);
        Contacts.add_channel(Mods.Chatmd.ModCh.channel);
        addChatText("Several new chat commands available. Type /help to see a list and usage instructions.", void 0, COLOR.TEAL);
        COLOR.MOD_DEV = "#B3BB2E"
    })();
    Mods.timestamp("chatmd")
}
;
Load.newmap = function() {
    modOptions.newmap.time = timestamp();
    Mods.Newmap.drawMinimapLarge = Mods.Newmap.drawMinimapLarge || HUD.drawMinimapLarge;
    Mods.Newmap.drawMinimap = Mods.Newmap.drawMinimap || HUD.drawMinimap;
    Mods.Newmap.addPOI = function(b) {
        Mods.Newmap.POI[0].push(b)
    }
    ;
    Mods.Newmap.removePOI = function(b, f) {
        for (var g = Mods.Newmap.POI[0].length - 1; 0 <= g; g--)
            if (Mods.Newmap.POI[0][g].mapid == b.map && Mods.Newmap.POI[0][g].x == b.i && Mods.Newmap.POI[0][g].y == b.j && Mods.Newmap.POI[0][g].type == f)
                return Mods.Newmap.POI[0].splice(g, 1)
    }
    ;
    createElem("div", wrapper, {
        id: "mods_newmap_coords",
        style: "visibility: hidden; z-index: 300; left: 35%; top: 20px; position: absolute; color #FFF; text-align: middle; font-size: 20px; text-shadow: #555 1px 1px 1px; pointer-events: none;"
    });
    createElem("div", wrapper, {
        id: "mods_newmap_popup",
        style: "visibility: hidden; z-index: 49; position: absolute; color: #FFF; border-radius: 4px; text-align: middle; font-size: 12px; background-color: #666; padding: 4px; pointer-events: none;"
    });
    createElem("div", wrapper, {
        id: "mods_zone_buttondiv",
        style: "visibility: hidden; z-index: 49; position: absolute; top: 40px; left: 3px; font-size: 8px;",
        innerHTML: "<button id='mods_zone_button' class='market_select pointer' onclick='Mods.Newmap.ShowZone();'>World Map</button>"
    });
    var b = !1;
    Mods.Newmap.POI = {
        0: [{
            mapid: 0,
            name: "Dorpat Town",
            type: "CITY",
            x: 20,
            y: 20
        }, {
            mapid: 0,
            name: "Dorpat Outpost",
            type: "CITY",
            x: 83,
            y: 38
        }, {
            mapid: 0,
            name: "Fishing Net",
            description: "5 fishing",
            type: "RESOURCE",
            icon: "net",
            x: 32,
            y: 5
        }, {
            mapid: 0,
            name: "Fishing Rod",
            description: "1 fishing",
            type: "RESOURCE",
            icon: "fish",
            x: 16,
            y: 8
        }, {
            mapid: 0,
            name: "Fishing Rod",
            description: "1 fishing",
            type: "RESOURCE",
            icon: "fish",
            x: 91,
            y: 33
        }, {
            mapid: 0,
            name: "Wooden Harpoon",
            description: "50 fishing",
            type: "RESOURCE",
            icon: "woodharp",
            x: 95,
            y: 5
        }, {
            mapid: 0,
            name: "Steel Harpoon",
            description: "63 fishing",
            type: "RESOURCE",
            icon: "steelharp",
            x: 81,
            y: 90
        }, {
            mapid: 0,
            name: "Sand",
            description: "1 mining",
            type: "RESOURCE",
            icon: "spade",
            x: 73,
            y: 73
        }, {
            mapid: 0,
            name: "Silver",
            description: "25 mining",
            type: "RESOURCE",
            icon: "pick",
            x: 69,
            y: 79
        }, {
            mapid: 0,
            name: "Fir",
            description: "1 woodcutting",
            type: "RESOURCE",
            icon: "wood",
            x: 24,
            y: 27
        }, {
            mapid: 0,
            name: "Fir",
            description: "1 woodcutting",
            type: "RESOURCE",
            icon: "wood",
            x: 88,
            y: 32
        }, {
            mapid: 0,
            name: "Cactus",
            description: "5 woodcutting",
            type: "RESOURCE",
            icon: "wood",
            x: 3,
            y: 88
        }, {
            mapid: 0,
            name: "Willow",
            description: "20 woodcutting",
            type: "RESOURCE",
            icon: "wood",
            x: 87,
            y: 88
        }, {
            mapid: 0,
            name: "Oak",
            description: "10 woodcutting",
            type: "RESOURCE",
            icon: "wood",
            x: 67,
            y: 23
        }, {
            mapid: 0,
            name: "Minotaur Maze",
            description: "Access to Minotaur Cave dungeon",
            type: "POI",
            x: 21,
            y: 87
        }, {
            mapid: 0,
            name: "Dorpat Castle",
            description: "Access to Dorpat Castle dungeon",
            type: "POI",
            x: 50,
            y: 59
        }, {
            mapid: 0,
            name: "Miner's Guild",
            description: "Requires Mining guild permission and 65 mining.",
            type: "POI",
            x: 56,
            y: 14
        }, {
            mapid: 0,
            name: "Skeleton Dungeon",
            description: "",
            type: "POI",
            x: 66,
            y: 29
        }, {
            mapid: 0,
            name: "Transfer to Whiland",
            description: "Leads to Rakblood, No Man's Land (PvP)",
            type: "TRAVEL",
            x: 92,
            y: 15
        }, {
            mapid: 0,
            name: "Cow",
            type: "MOB",
            icon: 102,
            x: 41,
            y: 11
        }, {
            mapid: 0,
            name: "Moth",
            type: "MOB",
            icon: 280,
            x: 48,
            y: 17
        }, {
            mapid: 0,
            name: "Orc Warrior",
            type: "MOB",
            icon: 4,
            x: 75,
            y: 18
        }, {
            mapid: 0,
            name: "Thief",
            type: "MOB",
            icon: 185,
            x: 80,
            y: 9
        }, {
            mapid: 0,
            name: "Minotaur",
            type: "MOB",
            icon: 6,
            x: 18,
            y: 90
        }, {
            mapid: 0,
            name: "Apeman",
            type: "MOB",
            icon: 119,
            x: 50,
            y: 78
        }, {
            mapid: 0,
            name: "Dwarf Mage",
            type: "MOB",
            icon: 7,
            x: 63,
            y: 52
        }, {
            mapid: 0,
            name: "Gray Wizard",
            type: "MOB",
            icon: 0,
            x: 15,
            y: 50
        }, {
            mapid: 0,
            name: "Black Rat",
            type: "MOB",
            icon: 8,
            x: 80,
            y: 78
        }, {
            mapid: 0,
            name: "Dragonfly",
            type: "MOB",
            icon: 120,
            x: 90,
            y: 41
        }, {
            mapid: 0,
            name: "Orc Mage",
            type: "MOB",
            icon: 13,
            x: 83,
            y: 56
        }, {
            mapid: 0,
            name: "Explorer",
            type: "MOB",
            icon: 187,
            x: 45,
            y: 60
        }, {
            mapid: 0,
            name: "Paladin",
            type: "MOB",
            icon: 25,
            x: 50,
            y: 63
        }, {
            mapid: 0,
            name: "Ridder",
            type: "MOB",
            icon: 201,
            x: 43,
            y: 58
        }, {
            mapid: 0,
            name: "Bronze Golem",
            type: "MOB",
            icon: 60,
            x: 70,
            y: 69
        }, {
            mapid: 0,
            name: "Iron Golem",
            type: "MOB",
            icon: 62,
            x: 65,
            y: 75
        }, {
            mapid: 0,
            name: "Sand Golem",
            type: "MOB",
            icon: 162,
            x: 71,
            y: 72
        }, {
            mapid: 0,
            name: "White Rat",
            type: "MOB",
            icon: 1,
            x: 28,
            y: 33
        }, {
            mapid: 0,
            name: "Hen",
            type: "MOB",
            icon: 101,
            x: 9,
            y: 31
        }, {
            mapid: 0,
            name: "Green Wizard",
            type: "MOB",
            icon: 3,
            x: 48,
            y: 46
        }, {
            mapid: 0,
            name: "Chicken",
            type: "MOB",
            icon: 100,
            x: 16,
            y: 34
        }, {
            mapid: 0,
            name: "Dorpat Mine",
            description: "",
            type: "TRAVEL",
            x: 9,
            y: 23
        }, {
            mapid: 0,
            name: "Transfer to Walco",
            description: "",
            type: "TRAVEL",
            x: 94,
            y: 83
        }, {
            mapid: 0,
            name: "Transfer to Reval",
            description: "Leads to Cesis, Pernau",
            type: "TRAVEL",
            x: 6,
            y: 89
        }, {
            mapid: 0,
            name: "Transfer to Clouds",
            description: "Leads to Heaven. Requires wings.",
            type: "TRAVEL",
            x: 43,
            y: 92
        }, {
            mapid: 0,
            name: "Transfer to Moche",
            description: "Leads to Reval",
            type: "TRAVEL",
            x: 9,
            y: 60
        }, {
            mapid: 1,
            name: "Big Treasure Chest",
            description: "Use spare keys from search dungeons here.",
            type: "POI",
            x: 26,
            y: 8
        }, {
            mapid: 1,
            name: "Campfire",
            type: "POI",
            x: 90,
            y: 41
        }, {
            mapid: 1,
            name: "Clay",
            description: "0 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 15,
            y: 27
        }, {
            mapid: 1,
            name: "Tin",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 6,
            y: 16
        }, {
            mapid: 1,
            name: "Tin",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 31,
            y: 18
        }, {
            mapid: 1,
            name: "Copper",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 4,
            y: 9
        }, {
            mapid: 1,
            name: "Copper",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 34,
            y: 18
        }, {
            mapid: 1,
            name: "Cage",
            description: "35 fishing",
            icon: "cage",
            type: "RESOURCE",
            x: 19,
            y: 25
        }, {
            mapid: 1,
            name: "Gold",
            description: "45 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 30,
            y: 90
        }, {
            mapid: 1,
            name: "Gold Vein",
            description: "45 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 30,
            y: 86
        }, {
            mapid: 1,
            name: "Iron",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 67,
            y: 14
        }, {
            mapid: 1,
            name: "Iron",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 34,
            y: 21
        }, {
            mapid: 1,
            name: "Iron Vein",
            description: "25 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 35,
            y: 22
        }, {
            mapid: 1,
            name: "Iron Vein",
            description: "25 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 71,
            y: 15
        }, {
            mapid: 1,
            name: "Coal",
            description: "40 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 55,
            y: 70
        }, {
            mapid: 1,
            name: "Coal",
            description: "40 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 33,
            y: 24
        }, {
            mapid: 1,
            name: "Coal Vein",
            description: "40 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 32,
            y: 22
        }, {
            mapid: 1,
            name: "Coal Vein",
            description: "40 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 68,
            y: 59
        }, {
            mapid: 1,
            name: "Transfer to Dorpat",
            description: "",
            type: "TRAVEL",
            x: 9,
            y: 23
        }, {
            mapid: 1,
            name: "Transfer to Dorpat",
            description: "",
            type: "TRAVEL",
            x: 66,
            y: 29
        }, {
            mapid: 1,
            name: "Transfer to Dorpat",
            description: "",
            type: "TRAVEL",
            x: 40,
            y: 56
        }, {
            mapid: 1,
            name: "Transfer to Dorpat",
            description: "",
            type: "TRAVEL",
            x: 22,
            y: 88
        }, {
            mapid: 1,
            name: "Transfer to Dungeon II",
            type: "TRAVEL",
            x: 22,
            y: 11
        }, {
            mapid: 1,
            name: "Transfer to Dungeon II",
            type: "TRAVEL",
            x: 10,
            y: 83
        }, {
            mapid: 1,
            name: "Transfer to Dungeon II",
            type: "TRAVEL",
            x: 46,
            y: 85
        }, {
            mapid: 1,
            name: "Transfer to Dungeon II",
            type: "TRAVEL",
            x: 34,
            y: 63
        }, {
            mapid: 1,
            name: "Transfer to Dungeon II",
            type: "TRAVEL",
            x: 60,
            y: 67
        }, {
            mapid: 1,
            name: "Transfer to Dungeon II",
            type: "TRAVEL",
            x: 82,
            y: 62
        }, {
            mapid: 1,
            name: "Transfer to Dungeon II",
            description: "Leads to Dungeons II-IV",
            type: "TRAVEL",
            x: 93,
            y: 90
        }, {
            mapid: 1,
            name: "Transfer to Dungeon II",
            type: "TRAVEL",
            x: 87,
            y: 25
        }, {
            mapid: 1,
            name: "White Rat",
            type: "MOB",
            icon: 1,
            x: 14,
            y: 21
        }, {
            mapid: 1,
            name: "Moth",
            type: "MOB",
            icon: 280,
            x: 10,
            y: 27
        }, {
            mapid: 1,
            name: "Cave Bat",
            type: "MOB",
            icon: 196,
            x: 21,
            y: 33
        }, {
            mapid: 1,
            name: "Cave Worm",
            type: "MOB",
            icon: 197,
            x: 14,
            y: 52
        }, {
            mapid: 1,
            name: "Black Rat",
            type: "MOB",
            icon: 8,
            x: 11,
            y: 66
        }, {
            mapid: 1,
            name: "Sapphire Dragon",
            type: "MOB",
            icon: 14,
            x: 25,
            y: 84
        }, {
            mapid: 1,
            name: "Ghost Dragon",
            type: "MOB",
            icon: 23,
            x: 9,
            y: 85
        }, {
            mapid: 1,
            name: "Efreet",
            type: "MOB",
            icon: 22,
            x: 91,
            y: 79
        }, {
            mapid: 1,
            name: "Ruby Dragon",
            type: "MOB",
            icon: 27,
            x: 41,
            y: 87
        }, {
            mapid: 1,
            name: "Cursed Dragon",
            type: "MOB",
            icon: 26,
            x: 60,
            y: 90
        }, {
            mapid: 1,
            name: "Adult Ruby Dragon",
            type: "MOB",
            icon: 184,
            x: 86,
            y: 91
        }, {
            mapid: 1,
            name: "King Ruby Dragon",
            type: "MOB",
            icon: 24,
            x: 91,
            y: 87
        }, {
            mapid: 1,
            name: "Ridder",
            type: "MOB",
            icon: 201,
            x: 44,
            y: 56
        }, {
            mapid: 1,
            name: "Crusader",
            type: "MOB",
            icon: 200,
            x: 53,
            y: 59
        }, {
            mapid: 1,
            name: "Dark Knight",
            type: "MOB",
            icon: 29,
            x: 58,
            y: 64
        }, {
            mapid: 1,
            name: "Paladin",
            type: "MOB",
            icon: 25,
            x: 61,
            y: 61
        }, {
            mapid: 1,
            name: "Holy Warrior",
            type: "MOB",
            icon: 30,
            x: 55,
            y: 79
        }, {
            mapid: 1,
            name: "Scholar",
            type: "MOB",
            icon: 202,
            x: 62,
            y: 80
        }, {
            mapid: 1,
            name: "Enchanter",
            type: "MOB",
            icon: 204,
            x: 79,
            y: 67
        }, {
            mapid: 1,
            name: "Skeleton",
            type: "MOB",
            icon: 10,
            x: 74,
            y: 29
        }, {
            mapid: 1,
            name: "Vampire",
            type: "MOB",
            icon: 11,
            x: 72,
            y: 16
        }, {
            mapid: 1,
            name: "Ghost",
            type: "MOB",
            icon: 9,
            x: 71,
            y: 44
        }, {
            mapid: 1,
            name: "Spirit",
            type: "MOB",
            icon: 135,
            x: 74,
            y: 49
        }, {
            mapid: 1,
            name: "Energy Ghost",
            type: "MOB",
            icon: 137,
            x: 58,
            y: 46
        }, {
            mapid: 1,
            name: "Minotaur Skeleton",
            type: "MOB",
            icon: 68,
            x: 43,
            y: 34
        }, {
            mapid: 1,
            name: "Skeleton Knight",
            type: "MOB",
            icon: 67,
            x: 32,
            y: 56
        }, {
            mapid: 1,
            name: "Skeleton Lord",
            type: "MOB",
            icon: 176,
            x: 32,
            y: 67
        }, {
            mapid: 1,
            name: "Vampire Lord",
            type: "MOB",
            icon: 28,
            x: 54,
            y: 19
        }, {
            mapid: 1,
            name: "Hydra",
            type: "MOB",
            icon: 17,
            x: 75,
            y: 17
        }, {
            mapid: 1,
            name: "Gnoll Warrior",
            type: "MOB",
            icon: 16,
            x: 65,
            y: 10
        }, {
            mapid: 1,
            name: "Skeleton Mage",
            type: "MOB",
            icon: 177,
            x: 85,
            y: 20
        }, {
            mapid: 1,
            name: "Gnoll Mage",
            type: "MOB",
            icon: 199,
            x: 89,
            y: 35
        }, {
            mapid: 2,
            name: "Narwa Town",
            type: "CITY",
            x: 68,
            y: 37
        }, {
            mapid: 2,
            name: "Water Altar",
            type: "POI",
            x: 61,
            y: 75
        }, {
            mapid: 2,
            name: "Wooden Harpoon",
            description: "50 fishing",
            icon: "woodharp",
            type: "RESOURCE",
            x: 78,
            y: 30
        }, {
            mapid: 2,
            name: "Transfer to Rakblood",
            description: "Leads to Whiland",
            type: "TRAVEL",
            x: 19,
            y: 81
        }, {
            mapid: 2,
            name: "Transfer to Fellin Island",
            description: "Requires ticket. Leads to Dragon's Lair",
            type: "TRAVEL",
            x: 78,
            y: 38
        }, {
            mapid: 2,
            name: "Transfer to Blood River",
            description: "Leads to Hell. Requires wings.",
            type: "TRAVEL",
            x: 86,
            y: 81
        }, {
            mapid: 2,
            name: "Sailor",
            description: "(NPC) Shop",
            type: "POI",
            x: 74,
            y: 38
        }, {
            mapid: 2,
            name: "Coal",
            description: "40 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 92,
            y: 11
        }, {
            mapid: 2,
            name: "Frozen Spirit",
            type: "MOB",
            icon: 57,
            x: 82,
            y: 93
        }, {
            mapid: 2,
            name: "Frozen Spirit",
            type: "MOB",
            icon: 57,
            x: 72,
            y: 78
        }, {
            mapid: 2,
            name: "Frozen Spirit",
            type: "MOB",
            icon: 57,
            x: 95,
            y: 56
        }, {
            mapid: 2,
            name: "Ice Lizard",
            type: "MOB",
            icon: 55,
            x: 77,
            y: 82
        }, {
            mapid: 2,
            name: "Ice Wyvern",
            type: "MOB",
            icon: 259,
            x: 91,
            y: 80
        }, {
            mapid: 2,
            name: "Ice Giant",
            type: "MOB",
            icon: 54,
            x: 79,
            y: 54
        }, {
            mapid: 2,
            name: "Frozen Bat",
            type: "MOB",
            icon: 53,
            x: 82,
            y: 58
        }, {
            mapid: 2,
            name: "Frozen Bat",
            type: "MOB",
            icon: 53,
            x: 84,
            y: 18
        }, {
            mapid: 2,
            name: "Ice Golem",
            type: "MOB",
            icon: 56,
            x: 90,
            y: 49
        }, {
            mapid: 2,
            name: "Ice Troglodyte",
            type: "MOB",
            icon: 52,
            x: 85,
            y: 34
        }, {
            mapid: 2,
            name: "Wind Protector",
            type: "MOB",
            icon: 58,
            x: 93,
            y: 17
        }, {
            mapid: 2,
            name: "Snow Troll Defender",
            type: "MOB",
            icon: 71,
            x: 51,
            y: 53
        }, {
            mapid: 2,
            name: "Snow Troll Knight",
            type: "MOB",
            icon: 69,
            x: 62,
            y: 64
        }, {
            mapid: 2,
            name: "King Elemental Dragon",
            type: "MOB",
            icon: 76,
            x: 52,
            y: 89
        }, {
            mapid: 2,
            name: "King Elemental Dragon",
            type: "MOB",
            icon: 76,
            x: 32,
            y: 86
        }, {
            mapid: 2,
            name: "Wind Elemental",
            type: "MOB",
            icon: 51,
            x: 18,
            y: 57
        }, {
            mapid: 2,
            name: "Wind Elemental",
            type: "MOB",
            icon: 51,
            x: 25,
            y: 90
        }, {
            mapid: 2,
            name: "Wind Elemental",
            type: "MOB",
            icon: 51,
            x: 10,
            y: 72
        }, {
            mapid: 2,
            name: "Wind Elemental",
            type: "MOB",
            icon: 51,
            x: 9,
            y: 44
        }, {
            mapid: 2,
            name: "Wind Elemental",
            type: "MOB",
            icon: 51,
            x: 32,
            y: 29
        }, {
            mapid: 2,
            name: "Adult Elemental Dragon",
            type: "MOB",
            icon: 74,
            x: 32,
            y: 82
        }, {
            mapid: 2,
            name: "Baby Elemental Dragon",
            type: "MOB",
            icon: 74,
            x: 23,
            y: 74
        }, {
            mapid: 2,
            name: "Snow Troll Assassin",
            type: "MOB",
            icon: 70,
            x: 18,
            y: 47
        }, {
            mapid: 2,
            name: "Snow Gungan Priest",
            type: "MOB",
            icon: 72,
            x: 44,
            y: 34
        }, {
            mapid: 2,
            name: "Snow Gungan Priest",
            type: "MOB",
            icon: 72,
            x: 66,
            y: 25
        }, {
            mapid: 2,
            name: "Bear",
            type: "MOB",
            icon: 104,
            x: 8,
            y: 18
        }, {
            mapid: 2,
            name: "Polar Bear",
            type: "MOB",
            icon: 189,
            x: 18,
            y: 14
        }, {
            mapid: 2,
            name: "Snow Gungan Lord",
            type: "MOB",
            icon: 73,
            x: 48,
            y: 16
        }, {
            mapid: 3,
            name: "Whiland Town",
            type: "CITY",
            x: 28,
            y: 93
        }, {
            mapid: 3,
            name: "Earth Altar",
            type: "POI",
            x: 42,
            y: 39
        }, {
            mapid: 3,
            name: "Wandering Farmer",
            description: "(NPC) Shop",
            type: "POI",
            x: 10,
            y: 29
        }, {
            mapid: 3,
            name: "Transfer to Dorpat",
            type: "TRAVEL",
            x: 4,
            y: 5
        }, {
            mapid: 3,
            name: "Transfer to Rakblood",
            description: "Leads to Narwa",
            type: "TRAVEL",
            x: 71,
            y: 46
        }, {
            mapid: 3,
            name: "Transfer to No Man's Land",
            description: "PVP Area",
            type: "TRAVEL",
            x: 90,
            y: 12
        }, {
            mapid: 3,
            name: "Transfer to Lost Woods",
            type: "TRAVEL",
            x: 8,
            y: 90
        }, {
            mapid: 3,
            name: "Oak",
            description: "10 woodcutting",
            type: "RESOURCE",
            icon: "wood",
            x: 19,
            y: 85
        }, {
            mapid: 3,
            name: "Deer",
            type: "MOB",
            icon: 103,
            x: 10,
            y: 13
        }, {
            mapid: 3,
            name: "Boletus",
            type: "MOB",
            icon: 34,
            x: 12,
            y: 7
        }, {
            mapid: 3,
            name: "Bear",
            type: "MOB",
            icon: 104,
            x: 25,
            y: 87
        }, {
            mapid: 3,
            name: "Silver Shroom",
            type: "MOB",
            icon: 35,
            x: 75,
            y: 42
        }, {
            mapid: 3,
            name: "Blue Magic Shroom",
            type: "MOB",
            icon: 33,
            x: 37,
            y: 81
        }, {
            mapid: 3,
            name: "Avatar's Shroom",
            type: "MOB",
            icon: 38,
            x: 42,
            y: 87
        }, {
            mapid: 3,
            name: "Russula",
            type: "MOB",
            icon: 31,
            x: 39,
            y: 77
        }, {
            mapid: 3,
            name: "Grizzly Bear",
            type: "MOB",
            icon: 188,
            x: 58,
            y: 69
        }, {
            mapid: 3,
            name: "Golden Shroom",
            type: "MOB",
            icon: 36,
            x: 67,
            y: 76
        }, {
            mapid: 3,
            name: "Lava Shroom",
            type: "MOB",
            icon: 41,
            x: 80,
            y: 66
        }, {
            mapid: 3,
            name: "Dark Shroom",
            type: "MOB",
            icon: 32,
            x: 84,
            y: 70
        }, {
            mapid: 3,
            name: "Fire Shroom",
            type: "MOB",
            icon: 40,
            x: 80,
            y: 30
        }, {
            mapid: 3,
            name: "Dry-Rotted Shroom",
            type: "MOB",
            icon: 37,
            x: 55,
            y: 60
        }, {
            mapid: 3,
            name: "Poisoned Shroom",
            type: "MOB",
            icon: 39,
            x: 75,
            y: 31
        }, {
            mapid: 4,
            name: "Reval Town",
            type: "CITY",
            x: 16,
            y: 24
        }, {
            mapid: 4,
            name: "Orc Overlord",
            type: "BOSS",
            cblevel: 450,
            x: 71,
            y: 87
        }, {
            mapid: 4,
            name: "Snake Maze",
            type: "POI",
            x: 59,
            y: 43
        }, {
            mapid: 4,
            name: "Flash Altar",
            type: "POI",
            x: 62,
            y: 65
        }, {
            mapid: 4,
            name: "Jewelry Guild",
            description: "Requires Jewelry Guild permission and 60 jewelry.",
            type: "POI",
            x: 48,
            y: 56
        }, {
            mapid: 4,
            name: "Sand",
            description: "1 mining",
            icon: "spade",
            type: "RESOURCE",
            x: 8,
            y: 34
        }, {
            mapid: 4,
            name: "Gold Vein",
            description: "45 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 66,
            y: 38
        }, {
            mapid: 4,
            name: "Gold",
            description: "45 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 45,
            y: 56
        }, {
            mapid: 4,
            name: "Silver",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 42,
            y: 55
        }, {
            mapid: 4,
            name: "Silver",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 65,
            y: 28
        }, {
            mapid: 4,
            name: "Silver Vein",
            description: "25 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 67,
            y: 29
        }, {
            mapid: 4,
            name: "Clay",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 46,
            y: 59
        }, {
            mapid: 4,
            name: "Coal",
            description: "40 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 93,
            y: 68
        }, {
            mapid: 4,
            name: "Coal Vein",
            description: "40 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 90,
            y: 67
        }, {
            mapid: 4,
            name: "Cactus",
            description: "5 woodcutting",
            type: "RESOURCE",
            icon: "wood",
            x: 10,
            y: 12
        }, {
            mapid: 4,
            name: "Transfer to Dorpat",
            description: "",
            type: "TRAVEL",
            x: 93,
            y: 7
        }, {
            mapid: 4,
            name: "Transfer to Cesis",
            description: "Leads to Ancient Dungeon",
            type: "TRAVEL",
            x: 40,
            y: 91
        }, {
            mapid: 4,
            name: "Transfer to Pernau",
            description: "",
            type: "TRAVEL",
            x: 83,
            y: 87
        }, {
            mapid: 4,
            name: "Lion",
            type: "MOB",
            icon: 190,
            x: 56,
            y: 82
        }, {
            mapid: 4,
            name: "Chaos Vortex",
            type: "MOB",
            icon: 174,
            x: 91,
            y: 81
        }, {
            mapid: 4,
            name: "Desert Runner",
            type: "MOB",
            icon: 44,
            x: 33,
            y: 12
        }, {
            mapid: 4,
            name: "Cyclops Knight",
            type: "MOB",
            icon: 43,
            x: 51,
            y: 30
        }, {
            mapid: 4,
            name: "Orc King",
            type: "MOB",
            icon: 46,
            x: 87,
            y: 68
        }, {
            mapid: 4,
            name: "Kobalos",
            type: "MOB",
            icon: 304,
            x: 89,
            y: 23
        }, {
            mapid: 4,
            name: "Sand Golem",
            type: "MOB",
            icon: 162,
            x: 83,
            y: 84
        }, {
            mapid: 4,
            name: "King Cobra",
            type: "MOB",
            icon: 48,
            x: 62,
            y: 36
        }, {
            mapid: 4,
            name: "Fire Viper",
            type: "MOB",
            icon: 49,
            x: 60,
            y: 49
        }, {
            mapid: 4,
            name: "Fire Imp",
            type: "MOB",
            icon: 47,
            x: 34,
            y: 36
        }, {
            mapid: 4,
            name: "Fire Imp",
            type: "MOB",
            icon: 47,
            x: 65,
            y: 72
        }, {
            mapid: 4,
            name: "Fire Ant",
            type: "MOB",
            icon: 50,
            x: 13,
            y: 82
        }, {
            mapid: 4,
            name: "Desert Orc",
            type: "MOB",
            icon: 45,
            x: 83,
            y: 46
        }, {
            mapid: 4,
            name: "Maple",
            description: "35 woodcutting",
            icon: "wood",
            type: "RESOURCE",
            x: 43,
            y: 84
        }, {
            mapid: 4,
            name: "Willow",
            description: "20 woodcutting",
            icon: "wood",
            type: "RESOURCE",
            x: 37,
            y: 93
        }, {
            mapid: 4,
            name: "Transfer to Moche",
            description: "Leads to Dorpat",
            type: "TRAVEL",
            x: 47,
            y: 9
        }, {
            mapid: 5,
            name: "Rakblood Town",
            type: "CITY",
            x: 34,
            y: 68
        }, {
            mapid: 5,
            name: "Coal Vein",
            type: "RESOURCE",
            icon: "steelpick",
            description: "40 mining",
            x: 56,
            y: 20
        }, {
            mapid: 5,
            name: "Coal Vein",
            type: "RESOURCE",
            icon: "steelpick",
            description: "40 mining",
            x: 49,
            y: 17
        }, {
            mapid: 5,
            name: "Fishing Master",
            type: "POI",
            x: 47,
            y: 76
        }, {
            mapid: 5,
            name: "Transfer to Whiland",
            description: "Leads to Dorpat",
            type: "TRAVEL",
            x: 38,
            y: 21
        }, {
            mapid: 5,
            name: "Transfer to Narwa",
            description: "Leads to Fellin Island, Blood River",
            type: "TRAVEL",
            x: 88,
            y: 91
        }, {
            mapid: 5,
            name: "Fishing Rod",
            description: "1 fishing",
            type: "RESOURCE",
            icon: "fish",
            x: 46,
            y: 79
        }, {
            mapid: 5,
            name: "Poseidon's Trident",
            description: "95 fishing",
            type: "RESOURCE",
            icon: "fish",
            x: 77,
            y: 73
        }, {
            mapid: 5,
            name: "Assassin",
            type: "MOB",
            icon: 186,
            x: 25,
            y: 79
        }, {
            mapid: 5,
            name: "Explorer",
            type: "MOB",
            icon: 187,
            x: 23,
            y: 66
        }, {
            mapid: 5,
            name: "Dark Orc",
            type: "MOB",
            icon: 66,
            x: 34,
            y: 83
        }, {
            mapid: 5,
            name: "Bronze Golem",
            type: "MOB",
            icon: 60,
            x: 14,
            y: 42
        }, {
            mapid: 5,
            name: "Azure Golem",
            type: "MOB",
            icon: 59,
            x: 17,
            y: 12
        }, {
            mapid: 5,
            name: "Iron Golem",
            type: "MOB",
            icon: 62,
            x: 55,
            y: 25
        }, {
            mapid: 5,
            name: "Coal Golem",
            type: "MOB",
            icon: 61,
            x: 72,
            y: 20
        }, {
            mapid: 5,
            name: "Steel Golem",
            type: "MOB",
            icon: 63,
            x: 65,
            y: 45
        }, {
            mapid: 5,
            name: "Thief",
            type: "MOB",
            icon: 185,
            x: 37,
            y: 44
        }, {
            mapid: 5,
            name: "Rock Spirit",
            type: "MOB",
            icon: 64,
            x: 45,
            y: 85
        }, {
            mapid: 5,
            name: "Mutated Hydra",
            type: "MOB",
            icon: 65,
            x: 51,
            y: 88
        }, {
            mapid: 5,
            name: "Giant Troll",
            type: "MOB",
            icon: 303,
            x: 60,
            y: 79
        }, {
            mapid: 5,
            name: "Emerald Dragon",
            type: "MOB",
            icon: 126,
            x: 63,
            y: 71
        }, {
            mapid: 6,
            name: "Blood River Town",
            type: "CITY",
            x: 35,
            y: 86
        }, {
            mapid: 6,
            name: "Fire Altar",
            type: "POI",
            x: 78,
            y: 42
        }, {
            mapid: 6,
            name: "Platinum",
            description: "75 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 43,
            y: 46
        }, {
            mapid: 6,
            name: "Azure",
            description: "60 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 63,
            y: 33
        }, {
            mapid: 6,
            name: "Azurite",
            description: "60 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 63,
            y: 33
        }, {
            mapid: 6,
            name: "Azurite Vein",
            description: "60 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 85,
            y: 49
        }, {
            mapid: 6,
            name: "Transfer to Narwa",
            description: "Leads to Fellin Island, Rakblood",
            type: "TRAVEL",
            x: 29,
            y: 42
        }, {
            mapid: 6,
            name: "Transfer to Hell",
            description: "",
            type: "TRAVEL",
            x: 59,
            y: 21
        }, {
            mapid: 6,
            name: "Blood Lizard",
            type: "MOB",
            icon: 90,
            x: 61,
            y: 25
        }, {
            mapid: 6,
            name: "Flame Phoenix",
            type: "MOB",
            icon: 87,
            x: 45,
            y: 46
        }, {
            mapid: 6,
            name: "Flame Phoenix",
            type: "MOB",
            icon: 87,
            x: 65,
            y: 31
        }, {
            mapid: 6,
            name: "Efreet",
            type: "MOB",
            icon: 22,
            x: 61,
            y: 37
        }, {
            mapid: 6,
            name: "Efreet",
            type: "MOB",
            icon: 22,
            x: 52,
            y: 60
        }, {
            mapid: 6,
            name: "Efreet",
            type: "MOB",
            icon: 22,
            x: 30,
            y: 29
        }, {
            mapid: 6,
            name: "Cursed Dragon",
            type: "MOB",
            icon: 26,
            x: 55,
            y: 74
        }, {
            mapid: 6,
            name: "Fire Imp",
            type: "MOB",
            icon: 47,
            x: 65,
            y: 88
        }, {
            mapid: 6,
            name: "Fire Imp",
            type: "MOB",
            icon: 47,
            x: 23,
            y: 53
        }, {
            mapid: 6,
            name: "Ruby Dragon",
            type: "MOB",
            icon: 27,
            x: 75,
            y: 83
        }, {
            mapid: 6,
            name: "Ruby Dragon",
            type: "MOB",
            icon: 27,
            x: 39,
            y: 14
        }, {
            mapid: 6,
            name: "Ruby Dragon",
            type: "MOB",
            icon: 27,
            x: 32,
            y: 67
        }, {
            mapid: 6,
            name: "Adult Ruby Dragon",
            type: "MOB",
            icon: 184,
            x: 82,
            y: 30
        }, {
            mapid: 6,
            name: "Adult Ruby Dragon",
            type: "MOB",
            icon: 184,
            x: 73,
            y: 15
        }, {
            mapid: 6,
            name: "King Ruby Dragon",
            type: "MOB",
            icon: 24,
            x: 90,
            y: 60
        }, {
            mapid: 6,
            name: "King Ruby Dragon",
            type: "MOB",
            icon: 24,
            x: 28,
            y: 81
        }, {
            mapid: 6,
            name: "Fire Centipede",
            type: "MOB",
            icon: 159,
            x: 89,
            y: 82
        }, {
            mapid: 6,
            name: "Flame Wyvern",
            type: "MOB",
            icon: 181,
            x: 75,
            y: 65
        }, {
            mapid: 6,
            name: "Fire Behemoth",
            type: "MOB",
            icon: 88,
            x: 69,
            y: 48
        }, {
            mapid: 6,
            name: "Archdevil",
            type: "MOB",
            icon: 19,
            x: 19,
            y: 16
        }, {
            mapid: 6,
            name: "Archdevil",
            type: "MOB",
            icon: 19,
            x: 17,
            y: 36
        }, {
            mapid: 6,
            name: "Fire Viper",
            type: "MOB",
            icon: 49,
            x: 18,
            y: 87
        }, {
            mapid: 7,
            name: "Hell Town",
            type: "CITY",
            x: 31,
            y: 22
        }, {
            mapid: 7,
            name: "Diablo",
            type: "BOSS",
            cblevel: 800,
            x: 11,
            y: 79
        }, {
            mapid: 7,
            name: "Platinum",
            description: "75 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 48,
            y: 38
        }, {
            mapid: 7,
            name: "King Ruby Dragon",
            type: "MOB",
            icon: 24,
            x: 8,
            y: 69
        }, {
            mapid: 7,
            name: "King Ruby Dragon",
            type: "MOB",
            icon: 24,
            x: 27,
            y: 53
        }, {
            mapid: 7,
            name: "Adult Ruby Dragon",
            type: "MOB",
            icon: 184,
            x: 80,
            y: 29
        }, {
            mapid: 7,
            name: "Adult Ruby Dragon",
            type: "MOB",
            icon: 184,
            x: 89,
            y: 15
        }, {
            mapid: 7,
            name: "Ruby Dragon",
            type: "MOB",
            icon: 27,
            x: 40,
            y: 12
        }, {
            mapid: 7,
            name: "Ruby Dragon",
            type: "MOB",
            icon: 27,
            x: 16,
            y: 76
        }, {
            mapid: 7,
            name: "Ghost Dragon",
            type: "MOB",
            icon: 23,
            x: 31,
            y: 59
        }, {
            mapid: 7,
            name: "Flame Phoenix",
            type: "MOB",
            icon: 87,
            x: 11,
            y: 48
        }, {
            mapid: 7,
            name: "Flame Phoenix",
            type: "MOB",
            icon: 87,
            x: 85,
            y: 87
        }, {
            mapid: 7,
            name: "Fire Spirit",
            type: "MOB",
            icon: 191,
            x: 81,
            y: 82
        }, {
            mapid: 7,
            name: "Fire Behemoth",
            type: "MOB",
            icon: 88,
            x: 13,
            y: 15
        }, {
            mapid: 7,
            name: "Fire Behemoth",
            type: "MOB",
            icon: 88,
            x: 81,
            y: 63
        }, {
            mapid: 7,
            name: "Fire Dragon",
            type: "MOB",
            icon: 253,
            x: 71,
            y: 90
        }, {
            mapid: 7,
            name: "Fire Dragon",
            type: "MOB",
            icon: 253,
            x: 51,
            y: 34
        }, {
            mapid: 7,
            name: "Cursed Dragon",
            type: "MOB",
            icon: 26,
            x: 59,
            y: 34
        }, {
            mapid: 7,
            name: "Hell Angel",
            type: "MOB",
            icon: 91,
            x: 47,
            y: 89
        }, {
            mapid: 7,
            name: "Blood Lizard",
            type: "MOB",
            icon: 90,
            x: 26,
            y: 90
        }, {
            mapid: 7,
            name: "Blood Lizard",
            type: "MOB",
            icon: 90,
            x: 59,
            y: 67
        }, {
            mapid: 7,
            name: "Blood Lizard",
            type: "MOB",
            icon: 90,
            x: 43,
            y: 58
        }, {
            mapid: 7,
            name: "Blood Lizard",
            type: "MOB",
            icon: 90,
            x: 34,
            y: 54
        }, {
            mapid: 7,
            name: "Lava Shroom",
            type: "MOB",
            icon: 41,
            x: 89,
            y: 47
        }, {
            mapid: 7,
            name: "Lava Shroom",
            type: "MOB",
            icon: 41,
            x: 89,
            y: 12
        }, {
            mapid: 7,
            name: "Lava Shroom",
            type: "MOB",
            icon: 41,
            x: 55,
            y: 6
        }, {
            mapid: 7,
            name: "Fire Shroom",
            type: "MOB",
            icon: 40,
            x: 87,
            y: 25
        }, {
            mapid: 7,
            name: "Fire Shroom",
            type: "MOB",
            icon: 40,
            x: 85,
            y: 10
        }, {
            mapid: 7,
            name: "Fire Shroom",
            type: "MOB",
            icon: 40,
            x: 57,
            y: 8
        }, {
            mapid: 7,
            name: "Flame Wyvern",
            type: "MOB",
            icon: 181,
            x: 86,
            y: 31
        }, {
            mapid: 7,
            name: "Flame Wyvern",
            type: "MOB",
            icon: 181,
            x: 57,
            y: 11
        }, {
            mapid: 7,
            name: "Archdevil",
            type: "MOB",
            icon: 19,
            x: 59,
            y: 23
        }, {
            mapid: 7,
            name: "Flaming Giant",
            type: "MOB",
            icon: 89,
            x: 70,
            y: 45
        }, {
            mapid: 7,
            name: "Ruby Dragon",
            type: "MOB",
            icon: 27,
            x: 85,
            y: 45
        }, {
            mapid: 7,
            name: "Efreet",
            type: "MOB",
            icon: 22,
            x: 31,
            y: 32
        }, {
            mapid: 7,
            name: "Efreet",
            type: "MOB",
            icon: 22,
            x: 21,
            y: 49
        }, {
            mapid: 7,
            name: "Azure",
            description: "60 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 34,
            y: 65
        }, {
            mapid: 7,
            name: "Azure",
            description: "60 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 62,
            y: 48
        }, {
            mapid: 7,
            name: "Fire Stone",
            description: "80 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 89,
            y: 93
        }, {
            mapid: 7,
            name: "Transfer to Blood River",
            description: "",
            type: "TRAVEL",
            x: 40,
            y: 57
        }, {
            mapid: 8,
            name: "Clouds Town",
            type: "CITY",
            x: 60,
            y: 72
        }, {
            mapid: 8,
            name: "Acid Dragon Lord",
            type: "BOSS",
            cblevel: 3987,
            x: 46,
            y: 37
        }, {
            mapid: 8,
            name: "Air Altar",
            type: "POI",
            x: 13,
            y: 68
        }, {
            mapid: 8,
            name: "White Gold",
            description: "55 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 52,
            y: 18
        }, {
            mapid: 8,
            name: "Observer",
            type: "MOB",
            icon: 114,
            x: 29,
            y: 17
        }, {
            mapid: 8,
            name: "Observer",
            type: "MOB",
            icon: 114,
            x: 24,
            y: 32
        }, {
            mapid: 8,
            name: "Archangel",
            type: "MOB",
            icon: 18,
            x: 23,
            y: 44
        }, {
            mapid: 8,
            name: "Blood Battlemage",
            type: "MOB",
            icon: 116,
            x: 35,
            y: 49
        }, {
            mapid: 8,
            name: "Griffin",
            type: "MOB",
            icon: 107,
            x: 38,
            y: 30
        }, {
            mapid: 8,
            name: "Baby Griffin",
            type: "MOB",
            icon: 106,
            x: 40,
            y: 16
        }, {
            mapid: 8,
            name: "Royal Griffin",
            type: "MOB",
            icon: 110,
            x: 9,
            y: 91
        }, {
            mapid: 8,
            name: "Baby Griffin",
            type: "MOB",
            icon: 106,
            x: 22,
            y: 81
        }, {
            mapid: 8,
            name: "Griffin",
            type: "MOB",
            icon: 107,
            x: 35,
            y: 90
        }, {
            mapid: 8,
            name: "Naga",
            type: "MOB",
            icon: 109,
            x: 32,
            y: 68
        }, {
            mapid: 8,
            name: "Ettin",
            type: "MOB",
            icon: 115,
            x: 70,
            y: 46
        }, {
            mapid: 8,
            name: "Chaos Vortex",
            type: "MOB",
            icon: 174,
            x: 84,
            y: 39
        }, {
            mapid: 8,
            name: "Chaos Vortex",
            type: "MOB",
            icon: 174,
            x: 93,
            y: 67
        }, {
            mapid: 8,
            name: "Observer King",
            type: "MOB",
            icon: 113,
            x: 83,
            y: 29
        }, {
            mapid: 8,
            name: "Observer King",
            type: "MOB",
            icon: 113,
            x: 86,
            y: 46
        }, {
            mapid: 8,
            name: "Royal Griffin",
            type: "MOB",
            icon: 110,
            x: 89,
            y: 21
        }, {
            mapid: 8,
            name: "Royal Griffin",
            type: "MOB",
            icon: 110,
            x: 53,
            y: 15
        }, {
            mapid: 8,
            name: "Wind Protector",
            type: "MOB",
            icon: 58,
            x: 84,
            y: 11
        }, {
            mapid: 8,
            name: "Observer King",
            type: "MOB",
            icon: 113,
            x: 70,
            y: 30
        }, {
            mapid: 8,
            name: "Archangel",
            type: "MOB",
            icon: 18,
            x: 65,
            y: 15
        }, {
            mapid: 8,
            name: "Archangel",
            type: "MOB",
            icon: 18,
            x: 11,
            y: 40
        }, {
            mapid: 8,
            name: "Naga",
            type: "MOB",
            icon: 109,
            x: 57,
            y: 30
        }, {
            mapid: 8,
            name: "Royal Griffin",
            type: "MOB",
            icon: 110,
            x: 54,
            y: 44
        }, {
            mapid: 8,
            name: "Zeus",
            icon: 99,
            type: "MOB",
            x: 71,
            y: 54
        }, {
            mapid: 8,
            name: "Zeus",
            icon: 99,
            type: "MOB",
            x: 77,
            y: 43
        }, {
            mapid: 8,
            name: "Zeus",
            icon: 99,
            type: "MOB",
            x: 76,
            y: 36
        }, {
            mapid: 8,
            name: "Zeus",
            icon: 99,
            type: "MOB",
            x: 94,
            y: 33
        }, {
            mapid: 8,
            name: "King Sapphire Dragon",
            icon: 112,
            type: "MOB",
            x: 63,
            y: 78
        }, {
            mapid: 8,
            name: "Adult Sapphire Dragon",
            icon: 111,
            type: "MOB",
            x: 53,
            y: 77
        }, {
            mapid: 8,
            name: "King Black Dragon",
            icon: 108,
            type: "MOB",
            x: 57,
            y: 61
        }, {
            mapid: 8,
            name: "King Ruby Dragon",
            icon: 24,
            type: "MOB",
            x: 60,
            y: 68
        }, {
            mapid: 8,
            name: "Ruby Dragon",
            icon: 27,
            type: "MOB",
            x: 69,
            y: 70
        }, {
            mapid: 8,
            name: "Transfer to Dorpat",
            description: "",
            type: "TRAVEL",
            x: 13,
            y: 19
        }, {
            mapid: 8,
            name: "Transfer to Heaven",
            description: "",
            type: "TRAVEL",
            x: 83,
            y: 83
        }, {
            mapid: 9,
            name: "Heaven Town",
            type: "CITY",
            x: 58,
            y: 16
        }, {
            mapid: 9,
            name: "Demon Portal",
            type: "BOSS",
            cblevel: 1500,
            x: 38,
            y: 9
        }, {
            mapid: 9,
            name: "Nephilim Warrior",
            type: "BOSS",
            cblevel: 3E3,
            x: 26,
            y: 89
        }, {
            mapid: 9,
            name: "White Gold",
            description: "55 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 79,
            y: 18
        }, {
            mapid: 9,
            name: "Zeus",
            icon: 99,
            type: "MOB",
            x: 89,
            y: 40
        }, {
            mapid: 9,
            name: "Flame Phoenix",
            icon: 87,
            type: "MOB",
            x: 73,
            y: 41
        }, {
            mapid: 9,
            name: "Unicorn",
            icon: 245,
            type: "MOB",
            x: 69,
            y: 59
        }, {
            mapid: 9,
            name: "Thunder Bird",
            icon: 258,
            type: "MOB",
            x: 8,
            y: 70
        }, {
            mapid: 9,
            name: "Grendalf The Grey",
            icon: 98,
            type: "MOB",
            x: 58,
            y: 45
        }, {
            mapid: 9,
            name: "Grendalf The Grey",
            icon: 98,
            type: "MOB",
            x: 81,
            y: 15
        }, {
            mapid: 9,
            name: "Thunder Angel",
            icon: 269,
            type: "MOB",
            x: 54,
            y: 62
        }, {
            mapid: 9,
            name: "Confused Merlin",
            icon: 95,
            type: "MOB",
            x: 53,
            y: 74
        }, {
            mapid: 9,
            name: "Dwarf Battlemage",
            icon: 94,
            type: "MOB",
            x: 29,
            y: 66
        }, {
            mapid: 9,
            name: "Dwarf Battlemage",
            icon: 94,
            type: "MOB",
            x: 88,
            y: 29
        }, {
            mapid: 9,
            name: "Merlin",
            icon: 96,
            type: "MOB",
            x: 85,
            y: 33
        }, {
            mapid: 9,
            name: "King Black Dragon",
            icon: 108,
            type: "MOB",
            x: 25,
            y: 79
        }, {
            mapid: 9,
            name: "Young Grendalf",
            icon: 97,
            type: "MOB",
            x: 40,
            y: 31
        }, {
            mapid: 9,
            name: "Young Grendalf",
            icon: 97,
            type: "MOB",
            x: 75,
            y: 85
        }, {
            mapid: 9,
            name: "Battlemage",
            icon: 93,
            type: "MOB",
            x: 16,
            y: 50
        }, {
            mapid: 9,
            name: "Battlemage",
            icon: 93,
            type: "MOB",
            x: 66,
            y: 82
        }, {
            mapid: 9,
            name: "Adult Sapphire Dragon",
            icon: 111,
            type: "MOB",
            x: 20,
            y: 24
        }, {
            mapid: 9,
            name: "Adult Sapphire Dragon",
            icon: 111,
            type: "MOB",
            x: 81,
            y: 51
        }, {
            mapid: 9,
            name: "King Sapphire Dragon",
            icon: 112,
            type: "MOB",
            x: 39,
            y: 44
        }, {
            mapid: 9,
            name: "King Sapphire Dragon",
            icon: 112,
            type: "MOB",
            x: 23,
            y: 11
        }, {
            mapid: 9,
            name: "King Sapphire Dragon",
            icon: 112,
            type: "MOB",
            x: 85,
            y: 68
        }, {
            mapid: 9,
            name: "King Gilded Dragon",
            icon: 244,
            type: "MOB",
            x: 84,
            y: 84
        }, {
            mapid: 9,
            name: "Death Angel",
            icon: 105,
            type: "MOB",
            x: 39,
            y: 13
        }, {
            mapid: 9,
            name: "Transfer to Clouds",
            description: "",
            type: "TRAVEL",
            x: 15,
            y: 21
        }, {
            mapid: 10,
            name: "Cesis Town",
            type: "CITY",
            x: 58,
            y: 64
        }, {
            mapid: 10,
            name: "Fishing Rod",
            description: "1 fishing",
            type: "RESOURCE",
            icon: "fish",
            x: 51,
            y: 66
        }, {
            mapid: 10,
            name: "Ancient Hydra",
            type: "BOSS",
            cblevel: 1E3,
            x: 60,
            y: 89
        }, {
            mapid: 10,
            name: "Maple",
            description: "35 woodcutting",
            icon: "wood",
            type: "RESOURCE",
            x: 71,
            y: 32
        }, {
            mapid: 10,
            name: "Blue Palm",
            description: "55 woodcutting",
            icon: "wood2",
            type: "RESOURCE",
            x: 10,
            y: 38
        }, {
            mapid: 10,
            name: "Magic Oak",
            description: "65 woodcutting",
            icon: "wood2",
            type: "RESOURCE",
            x: 77,
            y: 28
        }, {
            mapid: 10,
            name: "Transfer to Reval",
            description: "Leads to Dorpat, Pernau",
            type: "TRAVEL",
            x: 48,
            y: 17
        }, {
            mapid: 10,
            name: "Transfer to Ancient Dungeon",
            description: "",
            type: "TRAVEL",
            x: 20,
            y: 92
        }, {
            mapid: 10,
            name: "King Emerald Dragon",
            type: "MOB",
            icon: 128,
            x: 52,
            y: 35
        }, {
            mapid: 10,
            name: "King Emerald Dragon",
            type: "MOB",
            icon: 128,
            x: 57,
            y: 80
        }, {
            mapid: 10,
            name: "Grass Killer",
            type: "MOB",
            icon: 195,
            x: 31,
            y: 13
        }, {
            mapid: 10,
            name: "Grass Killer",
            type: "MOB",
            icon: 195,
            x: 17,
            y: 69
        }, {
            mapid: 10,
            name: "Grass Killer",
            type: "MOB",
            icon: 195,
            x: 42,
            y: 61
        }, {
            mapid: 10,
            name: "Barbarian Shaman",
            type: "MOB",
            icon: 132,
            x: 31,
            y: 33
        }, {
            mapid: 10,
            name: "Barbarian Shaman",
            type: "MOB",
            icon: 132,
            x: 76,
            y: 21
        }, {
            mapid: 10,
            name: "Emerald Dragon",
            type: "MOB",
            icon: 126,
            x: 21,
            y: 48
        }, {
            mapid: 10,
            name: "Emerald Dragon",
            type: "MOB",
            icon: 126,
            x: 35,
            y: 64
        }, {
            mapid: 10,
            name: "Barbarian Berserker",
            type: "MOB",
            icon: 133,
            x: 26,
            y: 75
        }, {
            mapid: 10,
            name: "Barbarian Berserker",
            type: "MOB",
            icon: 133,
            x: 84,
            y: 85
        }, {
            mapid: 10,
            name: "Emerald Plant",
            type: "MOB",
            icon: 194,
            x: 17,
            y: 83
        }, {
            mapid: 10,
            name: "Adult Emerald Dragon",
            type: "MOB",
            icon: 127,
            x: 9,
            y: 31
        }, {
            mapid: 10,
            name: "Adult Emerald Dragon",
            type: "MOB",
            icon: 127,
            x: 39,
            y: 82
        }, {
            mapid: 10,
            name: "Grass Snake",
            type: "MOB",
            icon: 130,
            x: 43,
            y: 46
        }, {
            mapid: 10,
            name: "Grass Snake",
            type: "MOB",
            icon: 130,
            x: 77,
            y: 15
        }, {
            mapid: 10,
            name: "Grass Snake",
            type: "MOB",
            icon: 130,
            x: 78,
            y: 39
        }, {
            mapid: 10,
            name: "Baby Emerald Dragon",
            type: "MOB",
            icon: 125,
            x: 36,
            y: 21
        }, {
            mapid: 10,
            name: "Baby Emerald Dragon",
            type: "MOB",
            icon: 125,
            x: 48,
            y: 27
        }, {
            mapid: 10,
            name: "Baby Emerald Dragon",
            type: "MOB",
            icon: 125,
            x: 56,
            y: 23
        }, {
            mapid: 10,
            name: "Naga",
            type: "MOB",
            icon: 109,
            x: 67,
            y: 17
        }, {
            mapid: 10,
            name: "Naga",
            type: "MOB",
            icon: 109,
            x: 87,
            y: 18
        }, {
            mapid: 10,
            name: "Barbarian Ghost",
            type: "MOB",
            icon: 131,
            x: 19,
            y: 34
        }, {
            mapid: 10,
            name: "Barbarian Ghost",
            type: "MOB",
            icon: 131,
            x: 82,
            y: 51
        }, {
            mapid: 10,
            name: "Poisonous Behemoth",
            type: "MOB",
            icon: 193,
            x: 12,
            y: 18
        }, {
            mapid: 10,
            name: "Poisonous Behemoth",
            type: "MOB",
            icon: 193,
            x: 75,
            y: 75
        }, {
            mapid: 10,
            name: "Moss Wyvern",
            type: "MOB",
            icon: 129,
            x: 64,
            y: 84
        }, {
            mapid: 11,
            name: "Walco Town",
            type: "CITY",
            x: 22,
            y: 29
        }, {
            mapid: 11,
            name: "Reaper",
            type: "BOSS",
            cblevel: 600,
            x: 45,
            y: 70
        }, {
            mapid: 11,
            name: "Spirit Log",
            description: "45 woodcutting",
            icon: "wood2",
            type: "RESOURCE",
            x: 29,
            y: 44
        }, {
            mapid: 11,
            name: "Spirit Log",
            description: "45 woodcutting",
            icon: "wood2",
            type: "RESOURCE",
            x: 58,
            y: 33
        }, {
            mapid: 11,
            name: "Spirit Log",
            description: "45 woodcutting",
            icon: "wood2",
            type: "RESOURCE",
            x: 38,
            y: 21
        }, {
            mapid: 11,
            name: "Spirit Log",
            description: "45 woodcutting",
            icon: "wood2",
            type: "RESOURCE",
            x: 35,
            y: 70
        }, {
            mapid: 11,
            name: "Spirit Log",
            description: "45 woodcutting",
            icon: "wood2",
            type: "RESOURCE",
            x: 24,
            y: 79
        }, {
            mapid: 11,
            name: "Transfer to Dorpat",
            description: "",
            type: "TRAVEL",
            x: 9,
            y: 84
        }, {
            mapid: 11,
            name: "Illusion Gate",
            description: "Teleports you to Devil's Triangle",
            type: "TRAVEL",
            x: 86,
            y: 85
        }, {
            mapid: 11,
            name: "Shadow Ghost",
            type: "MOB",
            icon: 134,
            x: 16,
            y: 79
        }, {
            mapid: 11,
            name: "Shadow Ghost",
            type: "MOB",
            icon: 134,
            x: 38,
            y: 82
        }, {
            mapid: 11,
            name: "Ghost",
            type: "MOB",
            icon: 9,
            x: 23,
            y: 68
        }, {
            mapid: 11,
            name: "Poltergeist",
            type: "MOB",
            icon: 136,
            x: 20,
            y: 39
        }, {
            mapid: 11,
            name: "Poltergeist",
            type: "MOB",
            icon: 136,
            x: 50,
            y: 82
        }, {
            mapid: 11,
            name: "Energy Ghost",
            type: "MOB",
            icon: 137,
            x: 32,
            y: 20
        }, {
            mapid: 11,
            name: "Skeleton Assassin",
            type: "MOB",
            icon: 138,
            x: 30,
            y: 35
        }, {
            mapid: 11,
            name: "Skeleton Assassin",
            type: "MOB",
            icon: 138,
            x: 82,
            y: 82
        }, {
            mapid: 11,
            name: "Ghost Dragon",
            type: "MOB",
            icon: 23,
            x: 67,
            y: 53
        }, {
            mapid: 11,
            name: "Vampire",
            type: "MOB",
            icon: 11,
            x: 55,
            y: 45
        }, {
            mapid: 11,
            name: "Vampire Lord",
            type: "MOB",
            icon: 28,
            x: 46,
            y: 74
        }, {
            mapid: 11,
            name: "Spirit",
            type: "MOB",
            icon: 135,
            x: 23,
            y: 55
        }, {
            mapid: 11,
            name: "Spirit",
            type: "MOB",
            icon: 135,
            x: 38,
            y: 82
        }, {
            mapid: 11,
            name: "Skeleton",
            type: "MOB",
            icon: 10,
            x: 76,
            y: 39
        }, {
            mapid: 11,
            name: "Skeleton Knight",
            type: "MOB",
            icon: 67,
            x: 79,
            y: 70
        }, {
            mapid: 11,
            name: "Skeleton Knight",
            type: "MOB",
            icon: 67,
            x: 73,
            y: 78
        }, {
            mapid: 13,
            name: "Campfire",
            description: "(There is no chest in Pernau)",
            type: "POI",
            x: 90,
            y: 13
        }, {
            mapid: 13,
            name: "Pharaoh",
            type: "BOSS",
            cblevel: 1300,
            x: 12,
            y: 45
        }, {
            mapid: 13,
            name: "Transfer to Reval",
            description: "",
            type: "TRAVEL",
            x: 85,
            y: 80
        }, {
            mapid: 13,
            name: "Transfer to Pernau Desert",
            description: "",
            type: "TRAVEL",
            x: 40,
            y: 57
        }, {
            mapid: 13,
            name: "Transfer to Pernau Desert",
            description: "",
            type: "TRAVEL",
            x: 11,
            y: 23
        }, {
            mapid: 13,
            name: "Transfer to Pernau Pyramid",
            description: "",
            type: "TRAVEL",
            x: 37,
            y: 42
        }, {
            mapid: 13,
            name: "Transfer to Lion's Den",
            description: "Leads to Pharaoh",
            type: "TRAVEL",
            x: 55,
            y: 10
        }, {
            mapid: 13,
            name: "Transfer to Lion's Den",
            description: "",
            type: "TRAVEL",
            x: 6,
            y: 32
        }, {
            mapid: 13,
            name: "Transfer to Pharaoh",
            description: "",
            type: "TRAVEL",
            x: 7,
            y: 12
        }, {
            mapid: 13,
            name: "Shopkeeper",
            type: "POI",
            x: 15,
            y: 8
        }, {
            mapid: 13,
            name: "Mummy",
            type: "MOB",
            icon: 163,
            x: 83,
            y: 88
        }, {
            mapid: 13,
            name: "Mummy",
            type: "MOB",
            icon: 163,
            x: 53,
            y: 71
        }, {
            mapid: 13,
            name: "White Wall",
            type: "MOB",
            icon: 179,
            x: 88,
            y: 92
        }, {
            mapid: 13,
            name: "White Wall",
            type: "MOB",
            icon: 179,
            x: 88,
            y: 69
        }, {
            mapid: 13,
            name: "White Wall",
            type: "MOB",
            icon: 179,
            x: 91,
            y: 55
        }, {
            mapid: 13,
            name: "White Wall",
            type: "MOB",
            icon: 179,
            x: 80,
            y: 55
        }, {
            mapid: 13,
            name: "Rotting Mummy",
            type: "MOB",
            icon: 164,
            x: 87,
            y: 74
        }, {
            mapid: 13,
            name: "Rotting Mummy",
            type: "MOB",
            icon: 164,
            x: 66,
            y: 81
        }, {
            mapid: 13,
            name: "Rotting Mummy",
            type: "MOB",
            icon: 164,
            x: 76,
            y: 71
        }, {
            mapid: 13,
            name: "Skeleton Lord",
            type: "MOB",
            icon: 176,
            x: 92,
            y: 74
        }, {
            mapid: 13,
            name: "Skeleton Lord",
            type: "MOB",
            icon: 176,
            x: 82,
            y: 58
        }, {
            mapid: 13,
            name: "Skeleton Lord",
            type: "MOB",
            icon: 176,
            x: 59,
            y: 91
        }, {
            mapid: 13,
            name: "Skeleton Lord",
            type: "MOB",
            icon: 176,
            x: 33,
            y: 64
        }, {
            mapid: 13,
            name: "Skeleton Mage",
            type: "MOB",
            icon: 177,
            x: 91,
            y: 64
        }, {
            mapid: 13,
            name: "Skeleton Mage",
            type: "MOB",
            icon: 177,
            x: 79,
            y: 66
        }, {
            mapid: 13,
            name: "Phantom Skull",
            type: "MOB",
            icon: 170,
            x: 80,
            y: 62
        }, {
            mapid: 13,
            name: "Ice Mummy",
            type: "MOB",
            icon: 165,
            x: 76,
            y: 81
        }, {
            mapid: 13,
            name: "Ice Mummy",
            type: "MOB",
            icon: 165,
            x: 58,
            y: 85
        }, {
            mapid: 13,
            name: "Ice Mummy",
            type: "MOB",
            icon: 165,
            x: 41,
            y: 71
        }, {
            mapid: 13,
            name: "DarkElf Mage",
            type: "MOB",
            icon: 161,
            x: 58,
            y: 89
        }, {
            mapid: 13,
            name: "Skeleton King",
            type: "MOB",
            icon: 175,
            x: 60,
            y: 91
        }, {
            mapid: 13,
            name: "Skeleton King",
            type: "MOB",
            icon: 175,
            x: 24,
            y: 65
        }, {
            mapid: 13,
            name: "Emerald Mummy",
            type: "MOB",
            icon: 166,
            x: 62,
            y: 62
        }, {
            mapid: 13,
            name: "Emerald Mummy",
            type: "MOB",
            icon: 166,
            x: 43,
            y: 59
        }, {
            mapid: 13,
            name: "Sand Golem",
            type: "MOB",
            icon: 162,
            x: 45,
            y: 85
        }, {
            mapid: 13,
            name: "White Hard Wall",
            type: "MOB",
            icon: 180,
            x: 39,
            y: 67
        }, {
            mapid: 13,
            name: "White Hard Wall",
            type: "MOB",
            icon: 180,
            x: 36,
            y: 64
        }, {
            mapid: 13,
            name: "White Hard Wall",
            type: "MOB",
            icon: 180,
            x: 40,
            y: 61
        }, {
            mapid: 13,
            name: "White Hard Wall",
            type: "MOB",
            icon: 180,
            x: 46,
            y: 54
        }, {
            mapid: 13,
            name: "Flame Phoenix",
            type: "MOB",
            icon: 87,
            x: 27,
            y: 69
        }, {
            mapid: 13,
            name: "Sand Centipede",
            type: "MOB",
            icon: 157,
            x: 32,
            y: 36
        }, {
            mapid: 13,
            name: "Rock Centipede",
            type: "MOB",
            icon: 158,
            x: 39,
            y: 19
        }, {
            mapid: 13,
            name: "Fire Centipede",
            type: "MOB",
            icon: 159,
            x: 55,
            y: 33
        }, {
            mapid: 13,
            name: "Gilded Mummy",
            type: "MOB",
            icon: 167,
            x: 61,
            y: 40
        }, {
            mapid: 13,
            name: "Gilded Mummy",
            type: "MOB",
            icon: 167,
            x: 59,
            y: 19
        }, {
            mapid: 13,
            name: "Skeletal Dragon",
            type: "MOB",
            icon: 160,
            x: 66,
            y: 45
        }, {
            mapid: 13,
            name: "Diamond Mummy",
            type: "MOB",
            icon: 169,
            x: 79,
            y: 21
        }, {
            mapid: 13,
            name: "Deathstalker Scorpion",
            type: "MOB",
            icon: 171,
            x: 75,
            y: 43
        }, {
            mapid: 13,
            name: "Deathstalker Scorpion",
            type: "MOB",
            icon: 171,
            x: 89,
            y: 45
        }, {
            mapid: 13,
            name: "Emperor Scorpion",
            type: "MOB",
            icon: 172,
            x: 82,
            y: 41
        }, {
            mapid: 13,
            name: "War Elephant",
            type: "MOB",
            icon: 173,
            x: 85,
            y: 25
        }, {
            mapid: 13,
            name: "Amethyst Mummy",
            type: "MOB",
            icon: 168,
            x: 66,
            y: 13
        }, {
            mapid: 13,
            name: "Lion",
            type: "MOB",
            icon: 190,
            x: 16,
            y: 15
        }, {
            mapid: 13,
            name: "Earth Dragon",
            type: "MOB",
            icon: 251,
            x: 11,
            y: 34
        }, {
            mapid: 13,
            name: "Fire Dragon",
            type: "MOB",
            icon: 253,
            x: 19,
            y: 45
        }, {
            mapid: 13,
            name: "Void Dragon",
            type: "MOB",
            icon: 254,
            x: 7,
            y: 43
        }, {
            mapid: 14,
            name: "Fishing Guild",
            description: "Requires Fishing Guild permission and 80 fishing.",
            type: "POI",
            x: 79,
            y: 32
        }, {
            mapid: 14,
            name: "Transfer to Dragon's Lair",
            description: "",
            type: "TRAVEL",
            x: 41,
            y: 48
        }, {
            mapid: 14,
            name: "Transfer to Narwa",
            description: "",
            type: "TRAVEL",
            x: 10,
            y: 26
        }, {
            mapid: 14,
            name: "Gilded Dragon",
            type: "MOB",
            icon: 248,
            x: 45,
            y: 51
        }, {
            mapid: 14,
            name: "Naga",
            type: "MOB",
            icon: 109,
            x: 26,
            y: 63
        }, {
            mapid: 14,
            name: "Poisonous Behemoth",
            type: "MOB",
            icon: 193,
            x: 36,
            y: 77
        }, {
            mapid: 14,
            name: "Barbarian Berserker",
            type: "MOB",
            icon: 133,
            x: 69,
            y: 74
        }, {
            mapid: 14,
            name: "Barbarian Shaman",
            type: "MOB",
            icon: 132,
            x: 58,
            y: 63
        }, {
            mapid: 14,
            name: "Skeletal Dragon",
            type: "MOB",
            icon: 160,
            x: 72,
            y: 49
        }, {
            mapid: 14,
            name: "Barbarian Ghost",
            type: "MOB",
            icon: 131,
            x: 68,
            y: 34
        }, {
            mapid: 14,
            name: "Grass Snake",
            type: "MOB",
            icon: 130,
            x: 51,
            y: 27
        }, {
            mapid: 14,
            name: "Behemoth",
            type: "MOB",
            icon: 20,
            x: 31,
            y: 35
        }, {
            mapid: 14,
            name: "Dragonfly",
            type: "MOB",
            icon: 120,
            x: 36,
            y: 18
        }, {
            mapid: 14,
            name: "Fishing Rod",
            description: "1 fishing",
            type: "RESOURCE",
            icon: "fish",
            x: 87,
            y: 31
        }, {
            mapid: 14,
            name: "Iron Fishing Rod",
            description: "65 fishing",
            type: "RESOURCE",
            icon: "ironrod",
            x: 89,
            y: 31
        }, {
            mapid: 14,
            name: "Fishing Net",
            description: "5 fishing",
            type: "RESOURCE",
            icon: "net",
            x: 88,
            y: 36
        }, {
            mapid: 14,
            name: "Cage",
            description: "35 fishing",
            icon: "cage",
            type: "RESOURCE",
            x: 85,
            y: 32
        }, {
            mapid: 14,
            name: "Wooden Harpoon",
            description: "50 fishing",
            type: "RESOURCE",
            icon: "woodharp",
            x: 88,
            y: 27
        }, {
            mapid: 14,
            name: "Steel Harpoon",
            description: "63 fishing",
            type: "RESOURCE",
            icon: "steelharp",
            x: 87,
            y: 81
        }, {
            mapid: 14,
            name: "Steel Harpoon",
            description: "63 fishing",
            type: "RESOURCE",
            icon: "steelharp",
            x: 12,
            y: 70
        }, {
            mapid: 15,
            name: "Dragon's Lair Outpost",
            description: "",
            type: "CITY",
            x: 49,
            y: 45
        }, {
            mapid: 15,
            name: "Chaotic Dragon",
            description: "",
            type: "BOSS",
            cblevel: 2100,
            x: 71,
            y: 21
        }, {
            mapid: 15,
            name: "Fire Stone",
            description: "80 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 77,
            y: 69
        }, {
            mapid: 15,
            name: "Ruby Dragon",
            type: "MOB",
            icon: 27,
            x: 49,
            y: 34
        }, {
            mapid: 15,
            name: "Adult Ruby Dragon",
            type: "MOB",
            icon: 184,
            x: 48,
            y: 24
        }, {
            mapid: 15,
            name: "King Ruby Dragon",
            type: "MOB",
            icon: 24,
            x: 54,
            y: 16
        }, {
            mapid: 15,
            name: "Fire Dragon",
            type: "MOB",
            icon: 253,
            x: 68,
            y: 17
        }, {
            mapid: 15,
            name: "Ghost Dragon",
            type: "MOB",
            icon: 23,
            x: 61,
            y: 43
        }, {
            mapid: 15,
            name: "Skeletal Dragon",
            type: "MOB",
            icon: 160,
            x: 72,
            y: 39
        }, {
            mapid: 15,
            name: "Void Dragon",
            type: "MOB",
            icon: 254,
            x: 77,
            y: 57
        }, {
            mapid: 15,
            name: "Emerald Dragon",
            type: "MOB",
            icon: 126,
            x: 40,
            y: 40
        }, {
            mapid: 15,
            name: "Adult Emerald Dragon",
            type: "MOB",
            icon: 127,
            x: 32,
            y: 39
        }, {
            mapid: 15,
            name: "King Emerald Dragon",
            type: "MOB",
            icon: 128,
            x: 16,
            y: 42
        }, {
            mapid: 15,
            name: "Adult Black Dragon",
            type: "MOB",
            icon: 249,
            x: 50,
            y: 57
        }, {
            mapid: 15,
            name: "King Black Dragon",
            type: "MOB",
            icon: 108,
            x: 48,
            y: 74
        }, {
            mapid: 15,
            name: "Metal Dragon",
            type: "MOB",
            icon: 252,
            x: 62,
            y: 69
        }, {
            mapid: 15,
            name: "Metal Dragon",
            type: "MOB",
            icon: 252,
            x: 74,
            y: 72
        }, {
            mapid: 15,
            name: "Earth Dragon",
            type: "MOB",
            icon: 251,
            x: 12,
            y: 77
        }, {
            mapid: 15,
            name: "Gilded Dragon",
            type: "MOB",
            icon: 248,
            x: 39,
            y: 55
        }, {
            mapid: 15,
            name: "Adult Gilded Dragon",
            type: "MOB",
            icon: 250,
            x: 31,
            y: 65
        }, {
            mapid: 15,
            name: "King Gilded Dragon",
            type: "MOB",
            icon: 244,
            x: 24,
            y: 62
        }, {
            mapid: 15,
            name: "Transfer to Fellin Island",
            description: "",
            type: "TRAVEL",
            x: 44,
            y: 45
        }, {
            mapid: 16,
            name: "No Man's Land Outpost",
            description: "Chest",
            type: "CITY",
            x: 15,
            y: 23
        }, {
            mapid: 16,
            name: "World Tree",
            description: "",
            type: "BOSS",
            cblevel: 3775,
            x: 84,
            y: 42
        }, {
            mapid: 16,
            name: "Fire Stone",
            description: "80 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 79,
            y: 93
        }, {
            mapid: 16,
            name: "Dragonstone",
            description: "110 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 56,
            y: 47
        }, {
            mapid: 16,
            name: "Fir",
            description: "1 woodcutting",
            type: "RESOURCE",
            icon: "wood",
            x: 10,
            y: 19
        }, {
            mapid: 16,
            name: "Tin",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 16,
            y: 37
        }, {
            mapid: 16,
            name: "Tin",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 35,
            y: 19
        }, {
            mapid: 16,
            name: "Copper",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 17,
            y: 35
        }, {
            mapid: 16,
            name: "Copper",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 37,
            y: 14
        }, {
            mapid: 16,
            name: "Iron",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 29,
            y: 40
        }, {
            mapid: 16,
            name: "Iron",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 47,
            y: 31
        }, {
            mapid: 16,
            name: "Iron",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 17,
            y: 55
        }, {
            mapid: 16,
            name: "Iron Vein",
            description: "25 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 25,
            y: 42
        }, {
            mapid: 16,
            name: "Iron Vein",
            description: "25 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 15,
            y: 52
        }, {
            mapid: 16,
            name: "Iron Vein",
            description: "25 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 44,
            y: 31
        }, {
            mapid: 16,
            name: "Coal",
            description: "40 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 55,
            y: 20
        }, {
            mapid: 16,
            name: "Coal",
            description: "40 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 66,
            y: 12
        }, {
            mapid: 16,
            name: "Coal",
            description: "40 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 77,
            y: 17
        }, {
            mapid: 16,
            name: "Coal",
            description: "40 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 84,
            y: 12
        }, {
            mapid: 16,
            name: "Coal Vein",
            description: "40 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 66,
            y: 9
        }, {
            mapid: 16,
            name: "Coal Vein",
            description: "40 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 57,
            y: 17
        }, {
            mapid: 16,
            name: "Coal Vein",
            description: "40 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 87,
            y: 8
        }, {
            mapid: 16,
            name: "Loot Master",
            description: "(NPC)",
            type: "POI",
            x: 8,
            y: 25
        }, {
            mapid: 16,
            name: "Loot Master",
            description: "(NPC)",
            type: "POI",
            x: 21,
            y: 11
        }, {
            mapid: 16,
            name: "Poisoned Altar",
            type: "POI",
            x: 88,
            y: 90
        }, {
            mapid: 16,
            name: "Legendary Breeding Master",
            description: "(NPC) Shop",
            type: "POI",
            x: 11,
            y: 88
        }, {
            mapid: 16,
            name: "PVP Shopkeeper",
            description: "(NPC) Shop",
            type: "POI",
            x: 82,
            y: 66
        }, {
            mapid: 16,
            name: "Transfer to Whiland",
            description: "",
            type: "TRAVEL",
            x: 13,
            y: 14
        }, {
            mapid: 16,
            name: "Novice Knight",
            type: "MOB",
            icon: 271,
            x: 18,
            y: 27
        }, {
            mapid: 16,
            name: "Knight",
            type: "MOB",
            icon: 272,
            x: 23,
            y: 29
        }, {
            mapid: 16,
            name: "Knight",
            type: "MOB",
            icon: 272,
            x: 49,
            y: 48
        }, {
            mapid: 16,
            name: "Baron",
            type: "MOB",
            icon: 273,
            x: 73,
            y: 17
        }, {
            mapid: 16,
            name: "Baron",
            type: "MOB",
            icon: 273,
            x: 19,
            y: 52
        }, {
            mapid: 16,
            name: "Baron",
            type: "MOB",
            icon: 273,
            x: 14,
            y: 78
        }, {
            mapid: 16,
            name: "Baron",
            type: "MOB",
            icon: 273,
            x: 62,
            y: 53
        }, {
            mapid: 16,
            name: "Baron",
            type: "MOB",
            icon: 273,
            x: 54,
            y: 56
        }, {
            mapid: 16,
            name: "Baron",
            type: "MOB",
            icon: 273,
            x: 65,
            y: 39
        }, {
            mapid: 16,
            name: "Earl",
            type: "MOB",
            icon: 274,
            x: 22,
            y: 61
        }, {
            mapid: 16,
            name: "Earl",
            type: "MOB",
            icon: 274,
            x: 15,
            y: 89
        }, {
            mapid: 16,
            name: "Earl",
            type: "MOB",
            icon: 274,
            x: 74,
            y: 43
        }, {
            mapid: 16,
            name: "Prince",
            type: "MOB",
            icon: 276,
            x: 43,
            y: 87
        }, {
            mapid: 16,
            name: "Prince",
            type: "MOB",
            icon: 276,
            x: 82,
            y: 72
        }, {
            mapid: 16,
            name: "Prince",
            type: "MOB",
            icon: 276,
            x: 70,
            y: 82
        }, {
            mapid: 16,
            name: "King",
            type: "MOB",
            icon: 277,
            x: 62,
            y: 81
        }, {
            mapid: 16,
            name: "King",
            type: "MOB",
            icon: 277,
            x: 84,
            y: 87
        }, {
            mapid: 16,
            name: "Marquis",
            type: "MOB",
            icon: 275,
            x: 74,
            y: 67
        }, {
            mapid: 16,
            name: "Marquis",
            type: "MOB",
            icon: 275,
            x: 68,
            y: 51
        }, {
            mapid: 16,
            name: "Marquis",
            type: "MOB",
            icon: 275,
            x: 81,
            y: 42
        }, {
            mapid: 16,
            name: "Marquis",
            type: "MOB",
            icon: 275,
            x: 52,
            y: 64
        }, {
            mapid: 16,
            name: "Redhodium Vein",
            description: "90 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 69,
            y: 54
        }, {
            mapid: 17,
            name: "Ancient Dungeon Outpost",
            description: "Chest",
            type: "CITY",
            x: 44,
            y: 91
        }, {
            mapid: 17,
            name: "Ancient Magician",
            description: "(NPC) Shop",
            type: "POI",
            x: 46,
            y: 86
        }, {
            mapid: 17,
            name: "Ancient Furniture Master",
            description: "(NPC) Shop",
            type: "POI",
            x: 48,
            y: 90
        }, {
            mapid: 17,
            name: "Cannibal Plant",
            description: "",
            type: "BOSS",
            cblevel: 2100,
            x: 41,
            y: 49
        }, {
            mapid: 17,
            name: "Pyrohydra",
            description: "",
            type: "MOB",
            icon: 283,
            x: 13,
            y: 78
        }, {
            mapid: 17,
            name: "Diamond Plant",
            description: "",
            type: "MOB",
            icon: 285,
            x: 27,
            y: 63
        }, {
            mapid: 17,
            name: "Diamond Plant",
            description: "",
            type: "MOB",
            icon: 285,
            x: 48,
            y: 48
        }, {
            mapid: 17,
            name: "Emerald Plant",
            description: "",
            type: "MOB",
            icon: 194,
            x: 45,
            y: 48
        }, {
            mapid: 17,
            name: "Grass Killer",
            description: "",
            type: "MOB",
            icon: 195,
            x: 29,
            y: 85
        }, {
            mapid: 17,
            name: "Earth Dragon",
            description: "",
            type: "MOB",
            icon: 251,
            x: 55,
            y: 47
        }, {
            mapid: 17,
            name: "Earth Dragon",
            description: "",
            type: "MOB",
            icon: 251,
            x: 56,
            y: 73
        }, {
            mapid: 17,
            name: "Observer Overseer",
            description: "",
            type: "MOB",
            icon: 288,
            x: 48,
            y: 32
        }, {
            mapid: 17,
            name: "Hydra Dragon",
            description: "",
            type: "MOB",
            icon: 286,
            x: 19,
            y: 26
        }, {
            mapid: 17,
            name: "Earthstorm",
            description: "",
            type: "MOB",
            icon: 284,
            x: 13,
            y: 42
        }, {
            mapid: 17,
            name: "Unicorn",
            description: "",
            type: "MOB",
            icon: 245,
            x: 73,
            y: 19
        }, {
            mapid: 17,
            name: "Queen Lizard",
            description: "",
            type: "MOB",
            icon: 282,
            x: 77,
            y: 56
        }, {
            mapid: 17,
            name: "Blood Spirit",
            description: "",
            type: "MOB",
            icon: 281,
            x: 69,
            y: 36
        }, {
            mapid: 17,
            name: "Blood Spirit",
            description: "",
            type: "MOB",
            icon: 281,
            x: 70,
            y: 81
        }, {
            mapid: 17,
            name: "Transfer to Cesis",
            description: "",
            type: "TRAVEL",
            x: 79,
            y: 87
        }, {
            mapid: 18,
            name: "Cave Crawler",
            description: "",
            type: "BOSS",
            cblevel: 434,
            x: 50,
            y: 35
        }, {
            mapid: 18,
            name: "Giant Cyclops",
            description: "",
            type: "BOSS",
            cblevel: 450,
            x: 36,
            y: 76
        }, {
            mapid: 18,
            name: "Venus Flytrap",
            description: "",
            type: "BOSS",
            cblevel: 545,
            x: 79,
            y: 80
        }, {
            mapid: 18,
            name: "Grizzly Bear",
            description: "",
            type: "MOB",
            icon: 188,
            x: 83,
            y: 19
        }, {
            mapid: 18,
            name: "Poisoned Shroom",
            description: "",
            type: "MOB",
            icon: 39,
            x: 78,
            y: 40
        }, {
            mapid: 18,
            name: "Golden Shroom",
            description: "",
            type: "MOB",
            icon: 36,
            x: 70,
            y: 36
        }, {
            mapid: 18,
            name: "Dry-Rotted Shroom",
            description: "",
            type: "MOB",
            icon: 37,
            x: 72,
            y: 24
        }, {
            mapid: 18,
            name: "Avatar's Shroom",
            description: "",
            type: "MOB",
            icon: 38,
            x: 65,
            y: 21
        }, {
            mapid: 18,
            name: "Archdevil",
            description: "",
            type: "MOB",
            icon: 19,
            x: 55,
            y: 30
        }, {
            mapid: 18,
            name: "Archdevil",
            description: "",
            type: "MOB",
            icon: 19,
            x: 17,
            y: 82
        }, {
            mapid: 18,
            name: "Behemoth",
            description: "",
            type: "MOB",
            icon: 20,
            x: 35,
            y: 83
        }, {
            mapid: 18,
            name: "Ettin King",
            description: "",
            type: "MOB",
            icon: 21,
            x: 63,
            y: 78
        }, {
            mapid: 18,
            name: "Transfer to Whiland",
            description: "",
            type: "TRAVEL",
            x: 86,
            y: 14
        }, {
            mapid: 20,
            name: "Brocaliande Forest Town",
            type: "CITY",
            x: 50,
            y: 76
        }, {
            mapid: 20,
            name: "Illusion Gate",
            description: "Teleports you to Devil's Triangle",
            type: "TRAVEL",
            x: 11,
            y: 91
        }, {
            mapid: 20,
            name: "Cathedral Door",
            description: "Enter Cathedral",
            type: "TRAVEL",
            x: 86,
            y: 13
        }, {
            mapid: 20,
            name: "Gold",
            description: "45 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 15,
            y: 15
        }, {
            mapid: 20,
            name: "Silver",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 59,
            y: 13
        }, {
            mapid: 20,
            name: "White Gold",
            description: "55 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 10,
            y: 37
        }, {
            mapid: 20,
            name: "Fishing Net",
            description: "5 fishing",
            type: "RESOURCE",
            icon: "net",
            x: 42,
            y: 88
        }, {
            mapid: 20,
            name: "Steel Harpoon",
            description: "63 fishing",
            type: "RESOURCE",
            icon: "steelharp",
            x: 40,
            y: 93
        }, {
            mapid: 20,
            name: "Ancient Golem",
            type: "MOB",
            icon: 325,
            x: 14,
            y: 63
        }, {
            mapid: 20,
            name: "Ancient Golem",
            type: "MOB",
            icon: 325,
            x: 70,
            y: 30
        }, {
            mapid: 20,
            name: "Draman",
            type: "MOB",
            icon: 318,
            x: 30,
            y: 56
        }, {
            mapid: 20,
            name: "Draman",
            type: "MOB",
            icon: 318,
            x: 20,
            y: 72
        }, {
            mapid: 20,
            name: "Earth Elemental",
            type: "MOB",
            icon: 314,
            x: 21,
            y: 15
        }, {
            mapid: 20,
            name: "Ent",
            type: "MOB",
            icon: 323,
            x: 14,
            y: 51
        }, {
            mapid: 20,
            name: "Ent",
            type: "MOB",
            icon: 323,
            x: 26,
            y: 34
        }, {
            mapid: 20,
            name: "Ent",
            type: "MOB",
            icon: 323,
            x: 31,
            y: 16
        }, {
            mapid: 20,
            name: "Gor-gin",
            type: "MOB",
            icon: 320,
            x: 14,
            y: 90
        }, {
            mapid: 20,
            name: "Gor-gin",
            type: "MOB",
            icon: 320,
            x: 42,
            y: 13
        }, {
            mapid: 20,
            name: "Gravekeeper",
            type: "MOB",
            icon: 328,
            x: 87,
            y: 34
        }, {
            mapid: 20,
            name: "Ice Elemental",
            type: "MOB",
            icon: 316,
            x: 67,
            y: 56
        }, {
            mapid: 20,
            name: "Ice Elemental",
            type: "MOB",
            icon: 316,
            x: 64,
            y: 44
        }, {
            mapid: 20,
            name: "Iphar",
            type: "MOB",
            icon: 322,
            x: 91,
            y: 65
        }, {
            mapid: 20,
            name: "Iphar",
            type: "MOB",
            icon: 322,
            x: 76,
            y: 69
        }, {
            mapid: 20,
            name: "Necromancer",
            type: "MOB",
            icon: 327,
            x: 14,
            y: 27
        }, {
            mapid: 20,
            name: "Raaz",
            type: "MOB",
            icon: 319,
            x: 28,
            y: 45
        }, {
            mapid: 20,
            name: "Rock Golem",
            type: "MOB",
            icon: 317,
            x: 41,
            y: 58
        }, {
            mapid: 20,
            name: "Summoned Skull",
            type: "MOB",
            icon: 324,
            x: 85,
            y: 79
        }, {
            mapid: 20,
            name: "Summoned Skull",
            type: "MOB",
            icon: 324,
            x: 90,
            y: 81
        }, {
            mapid: 20,
            name: "Summoned Skull",
            type: "MOB",
            icon: 324,
            x: 71,
            y: 77
        }, {
            mapid: 20,
            name: "Undead Paladin",
            type: "MOB",
            icon: 329,
            x: 82,
            y: 34
        }, {
            mapid: 20,
            name: "Undead Paladin",
            type: "MOB",
            icon: 329,
            x: 50,
            y: 33
        }, {
            mapid: 20,
            name: "Verme",
            type: "MOB",
            icon: 321,
            x: 62,
            y: 89
        }, {
            mapid: 20,
            name: "Verme",
            type: "MOB",
            icon: 321,
            x: 76,
            y: 92
        }, {
            mapid: 20,
            name: "Verme",
            type: "MOB",
            icon: 321,
            x: 71,
            y: 84
        }, {
            mapid: 20,
            name: "Water Elemental",
            type: "MOB",
            icon: 315,
            x: 69,
            y: 13
        }, {
            mapid: 20,
            name: "Transfer to Wittensten",
            description: "Teleports you to Wittensten",
            type: "TRAVEL",
            x: 93,
            y: 77
        }, {
            mapid: 21,
            name: "Traitor",
            description: "(NPC) tele to Walco's Illusion Gate",
            type: "POI",
            icon: 313,
            x: 55,
            y: 58
        }, {
            mapid: 21,
            name: "Blizzard Altar",
            type: "POI",
            x: 77,
            y: 76
        }, {
            mapid: 21,
            name: "Azurite Vein",
            description: "60 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 39,
            y: 33
        }, {
            mapid: 21,
            name: "Azurite Vein",
            description: "60 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 61,
            y: 88
        }, {
            mapid: 21,
            name: "Clay",
            description: "0 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 44,
            y: 85
        }, {
            mapid: 21,
            name: "Copper",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 28,
            y: 54
        }, {
            mapid: 21,
            name: "Dragonstone",
            description: "110 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 35,
            y: 69
        }, {
            mapid: 21,
            name: "Iron",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 41,
            y: 88
        }, {
            mapid: 21,
            name: "Iron",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 34,
            y: 55
        }, {
            mapid: 21,
            name: "Iron",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 32,
            y: 72
        }, {
            mapid: 21,
            name: "Iron Vein",
            description: "25 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 64,
            y: 55
        }, {
            mapid: 21,
            name: "Gold",
            description: "45 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 18,
            y: 14
        }, {
            mapid: 21,
            name: "Gold Vein",
            description: "45 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 67,
            y: 52
        }, {
            mapid: 21,
            name: "Platinum Vein",
            description: "75 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 89,
            y: 22
        }, {
            mapid: 21,
            name: "Silver Vein",
            description: "25 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 70,
            y: 51
        }, {
            mapid: 21,
            name: "Alligator",
            type: "MOB",
            icon: 326,
            x: 79,
            y: 15
        }, {
            mapid: 21,
            name: "Alligator",
            type: "MOB",
            icon: 326,
            x: 50,
            y: 71
        }, {
            mapid: 21,
            name: "Ancient Golem",
            type: "MOB",
            icon: 325,
            x: 64,
            y: 27
        }, {
            mapid: 21,
            name: "Ancient Golem",
            type: "MOB",
            icon: 325,
            x: 71,
            y: 92
        }, {
            mapid: 21,
            name: "Ancient Golem",
            type: "MOB",
            icon: 325,
            x: 15,
            y: 50
        }, {
            mapid: 21,
            name: "Draman",
            type: "MOB",
            icon: 318,
            x: 29,
            y: 87
        }, {
            mapid: 21,
            name: "Draman",
            type: "MOB",
            icon: 318,
            x: 23,
            y: 33
        }, {
            mapid: 21,
            name: "Earth Elemental",
            type: "MOB",
            icon: 314,
            x: 50,
            y: 60
        }, {
            mapid: 21,
            name: "Earth Elemental",
            type: "MOB",
            icon: 314,
            x: 62,
            y: 72
        }, {
            mapid: 21,
            name: "Earth Elemental",
            type: "MOB",
            icon: 314,
            x: 8,
            y: 30
        }, {
            mapid: 21,
            name: "Earth Elemental",
            type: "MOB",
            icon: 314,
            x: 51,
            y: 24
        }, {
            mapid: 21,
            name: "Gor-gin",
            type: "MOB",
            icon: 320,
            x: 81,
            y: 35
        }, {
            mapid: 21,
            name: "Gravekeeper",
            type: "MOB",
            icon: 328,
            x: 88,
            y: 86
        }, {
            mapid: 21,
            name: "Gravekeeper",
            type: "MOB",
            icon: 328,
            x: 68,
            y: 43
        }, {
            mapid: 21,
            name: "Ice Elemental",
            type: "MOB",
            icon: 316,
            x: 51,
            y: 54
        }, {
            mapid: 21,
            name: "Ice Elemental",
            type: "MOB",
            icon: 316,
            x: 77,
            y: 71
        }, {
            mapid: 21,
            name: "Ice Elemental",
            type: "MOB",
            icon: 316,
            x: 50,
            y: 41
        }, {
            mapid: 21,
            name: "Ice Elemental",
            type: "MOB",
            icon: 316,
            x: 17,
            y: 65
        }, {
            mapid: 21,
            name: "Iphar",
            type: "MOB",
            icon: 322,
            x: 87,
            y: 46
        }, {
            mapid: 21,
            name: "Iphar",
            type: "MOB",
            icon: 322,
            x: 34,
            y: 18
        }, {
            mapid: 21,
            name: "Necromancer",
            type: "MOB",
            icon: 327,
            x: 46,
            y: 83
        }, {
            mapid: 21,
            name: "Necromancer",
            type: "MOB",
            icon: 327,
            x: 48,
            y: 6
        }, {
            mapid: 21,
            name: "Necromancer",
            type: "MOB",
            icon: 327,
            x: 31,
            y: 53
        }, {
            mapid: 21,
            name: "Raaz",
            type: "MOB",
            icon: 319,
            x: 84,
            y: 30
        }, {
            mapid: 21,
            name: "Raaz",
            type: "MOB",
            icon: 319,
            x: 24,
            y: 38
        }, {
            mapid: 21,
            name: "Rock Golem",
            type: "MOB",
            icon: 317,
            x: 22,
            y: 15
        }, {
            mapid: 21,
            name: "Rock Golem",
            type: "MOB",
            icon: 317,
            x: 40,
            y: 64
        }, {
            mapid: 21,
            name: "Rock Golem",
            type: "MOB",
            icon: 317,
            x: 67,
            y: 58
        }, {
            mapid: 21,
            name: "Summoned Skull",
            type: "MOB",
            icon: 324,
            x: 37,
            y: 39
        }, {
            mapid: 21,
            name: "Summoned Skull",
            type: "MOB",
            icon: 324,
            x: 58,
            y: 87
        }, {
            mapid: 21,
            name: "Summoned Skull",
            type: "MOB",
            icon: 324,
            x: 92,
            y: 25
        }, {
            mapid: 21,
            name: "Undead Paladin",
            type: "MOB",
            icon: 329,
            x: 69,
            y: 39
        }, {
            mapid: 21,
            name: "Undead Paladin",
            type: "MOB",
            icon: 329,
            x: 85,
            y: 84
        }, {
            mapid: 21,
            name: "Verme",
            type: "MOB",
            icon: 321,
            x: 81,
            y: 46
        }, {
            mapid: 21,
            name: "Verme",
            type: "MOB",
            icon: 321,
            x: 37,
            y: 21
        }, {
            mapid: 21,
            name: "Water Elemental",
            type: "MOB",
            icon: 315,
            x: 12,
            y: 84
        }, {
            mapid: 21,
            name: "Water Elemental",
            type: "MOB",
            icon: 315,
            x: 64,
            y: 10
        }, {
            mapid: 21,
            name: "Water Elemental",
            type: "MOB",
            icon: 315,
            x: 87,
            y: 62
        }, {
            mapid: 21,
            name: "Redhodium",
            description: "90 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 88,
            y: 80
        }, {
            mapid: 22,
            name: "Harpy 1",
            type: "MOB",
            icon: 343,
            x: 5,
            y: 9
        }, {
            mapid: 22,
            name: "Harpy 2",
            type: "MOB",
            icon: 344,
            x: 5,
            y: 18
        }, {
            mapid: 22,
            name: "Harpy 3",
            type: "MOB",
            icon: 345,
            x: 5,
            y: 27
        }, {
            mapid: 22,
            name: "Harpy 4",
            type: "MOB",
            icon: 346,
            x: 5,
            y: 36
        }, {
            mapid: 22,
            name: "[Elite] Lion Turtle",
            type: "MOB",
            icon: 347,
            x: 5,
            y: 45
        }, {
            mapid: 22,
            name: "Harpy 5",
            type: "MOB",
            icon: 348,
            x: 5,
            y: 54
        }, {
            mapid: 22,
            name: "Harpy 6",
            type: "MOB",
            icon: 349,
            x: 5,
            y: 63
        }, {
            mapid: 22,
            name: "Harpy 7",
            type: "MOB",
            icon: 350,
            x: 5,
            y: 72
        }, {
            mapid: 22,
            name: "Harpy 8",
            type: "MOB",
            icon: 351,
            x: 5,
            y: 81
        }, {
            mapid: 22,
            name: "[Boss] Air Priest",
            type: "MOB",
            icon: 333,
            x: 5,
            y: 92
        }, {
            mapid: 22,
            name: "Dragonbat 1",
            type: "MOB",
            icon: 352,
            x: 14,
            y: 9
        }, {
            mapid: 22,
            name: "Dragonbat 2",
            type: "MOB",
            icon: 353,
            x: 14,
            y: 18
        }, {
            mapid: 22,
            name: "Dragonbat 3",
            type: "MOB",
            icon: 354,
            x: 14,
            y: 27
        }, {
            mapid: 22,
            name: "Dragonbat 4",
            type: "MOB",
            icon: 355,
            x: 14,
            y: 36
        }, {
            mapid: 22,
            name: "[Elite] Capricorn",
            type: "MOB",
            icon: 356,
            x: 14,
            y: 45
        }, {
            mapid: 22,
            name: "Dragonbat 5",
            type: "MOB",
            icon: 357,
            x: 14,
            y: 54
        }, {
            mapid: 22,
            name: "Dragonbat 6",
            type: "MOB",
            icon: 358,
            x: 14,
            y: 63
        }, {
            mapid: 22,
            name: "Dragonbat 7",
            type: "MOB",
            icon: 359,
            x: 14,
            y: 72
        }, {
            mapid: 22,
            name: "Dragonbat 8",
            type: "MOB",
            icon: 432,
            x: 14,
            y: 81
        }, {
            mapid: 22,
            name: "[Boss] Earth Priestess",
            type: "MOB",
            icon: 334,
            x: 14,
            y: 92
        }, {
            mapid: 22,
            name: "Ogre 1",
            type: "MOB",
            icon: 360,
            x: 24,
            y: 9
        }, {
            mapid: 22,
            name: "Ogre 2",
            type: "MOB",
            icon: 361,
            x: 24,
            y: 18
        }, {
            mapid: 22,
            name: "Ogre 3",
            type: "MOB",
            icon: 362,
            x: 24,
            y: 27
        }, {
            mapid: 22,
            name: "Ogre 4",
            type: "MOB",
            icon: 363,
            x: 24,
            y: 36
        }, {
            mapid: 22,
            name: "[Elite] Giant",
            type: "MOB",
            icon: 364,
            x: 24,
            y: 45
        }, {
            mapid: 22,
            name: "Ogre 5",
            type: "MOB",
            icon: 365,
            x: 24,
            y: 54
        }, {
            mapid: 22,
            name: "Ogre 6",
            type: "MOB",
            icon: 366,
            x: 24,
            y: 63
        }, {
            mapid: 22,
            name: "Ogre 7",
            type: "MOB",
            icon: 367,
            x: 24,
            y: 72
        }, {
            mapid: 22,
            name: "Ogre 8",
            type: "MOB",
            icon: 368,
            x: 24,
            y: 81
        }, {
            mapid: 22,
            name: "[Boss] Water Priest",
            type: "MOB",
            icon: 335,
            x: 24,
            y: 92
        }, {
            mapid: 22,
            name: "Water Elf 1",
            type: "MOB",
            icon: 369,
            x: 33,
            y: 9
        }, {
            mapid: 22,
            name: "Water Elf 2",
            type: "MOB",
            icon: 370,
            x: 33,
            y: 18
        }, {
            mapid: 22,
            name: "Water Elf 3",
            type: "MOB",
            icon: 371,
            x: 33,
            y: 27
        }, {
            mapid: 22,
            name: "Water Elf 4",
            type: "MOB",
            icon: 372,
            x: 33,
            y: 36
        }, {
            mapid: 22,
            name: "[Elite] Spider Queen",
            type: "MOB",
            icon: 373,
            x: 33,
            y: 45
        }, {
            mapid: 22,
            name: "Water Elf 5",
            type: "MOB",
            icon: 374,
            x: 33,
            y: 54
        }, {
            mapid: 22,
            name: "Water Elf 6",
            type: "MOB",
            icon: 375,
            x: 33,
            y: 63
        }, {
            mapid: 22,
            name: "Water Elf 7",
            type: "MOB",
            icon: 376,
            x: 33,
            y: 72
        }, {
            mapid: 22,
            name: "Water Elf 8",
            type: "MOB",
            icon: 377,
            x: 33,
            y: 81
        }, {
            mapid: 22,
            name: "[Boss] Fire Priestess",
            type: "MOB",
            icon: 336,
            x: 33,
            y: 92
        }, {
            mapid: 22,
            name: "Survivor",
            description: "(NPC)",
            type: "POI",
            x: 44,
            y: 11
        }, {
            mapid: 22,
            name: "Wisp 1",
            type: "MOB",
            icon: 378,
            x: 42,
            y: 7
        }, {
            mapid: 22,
            name: "Wisp 2",
            type: "MOB",
            icon: 379,
            x: 42,
            y: 18
        }, {
            mapid: 22,
            name: "Wisp 3",
            type: "MOB",
            icon: 380,
            x: 42,
            y: 27
        }, {
            mapid: 22,
            name: "Wisp 4",
            type: "MOB",
            icon: 381,
            x: 42,
            y: 36
        }, {
            mapid: 22,
            name: "[Elite] Poseidon",
            type: "MOB",
            icon: 382,
            x: 42,
            y: 45
        }, {
            mapid: 22,
            name: "Wisp 5",
            type: "MOB",
            icon: 383,
            x: 42,
            y: 54
        }, {
            mapid: 22,
            name: "Wisp 6",
            type: "MOB",
            icon: 384,
            x: 42,
            y: 63
        }, {
            mapid: 22,
            name: "Wisp 7",
            type: "MOB",
            icon: 385,
            x: 42,
            y: 72
        }, {
            mapid: 22,
            name: "Wisp 8",
            type: "MOB",
            icon: 386,
            x: 42,
            y: 81
        }, {
            mapid: 22,
            name: "[Boss] Cathedral Guardian",
            type: "MOB",
            icon: 337,
            x: 42,
            y: 92
        }, {
            mapid: 22,
            name: "Swamp Monkey 1",
            type: "MOB",
            icon: 387,
            x: 51,
            y: 9
        }, {
            mapid: 22,
            name: "Swamp Monkey 2",
            type: "MOB",
            icon: 388,
            x: 51,
            y: 18
        }, {
            mapid: 22,
            name: "Swamp Monkey 3",
            type: "MOB",
            icon: 389,
            x: 51,
            y: 27
        }, {
            mapid: 22,
            name: "Swamp Monkey 4",
            type: "MOB",
            icon: 390,
            x: 51,
            y: 36
        }, {
            mapid: 22,
            name: "[Elite] Headless Knight",
            type: "MOB",
            icon: 391,
            x: 51,
            y: 45
        }, {
            mapid: 22,
            name: "Swamp Monkey 5",
            type: "MOB",
            icon: 392,
            x: 51,
            y: 54
        }, {
            mapid: 22,
            name: "Swamp Monkey 6",
            type: "MOB",
            icon: 393,
            x: 51,
            y: 63
        }, {
            mapid: 22,
            name: "Swamp Monkey 7",
            type: "MOB",
            icon: 394,
            x: 51,
            y: 72
        }, {
            mapid: 22,
            name: "Swamp Monkey 8",
            type: "MOB",
            icon: 395,
            x: 51,
            y: 81
        }, {
            mapid: 22,
            name: "[Boss] God's Eye",
            type: "MOB",
            icon: 338,
            x: 51,
            y: 92
        }, {
            mapid: 22,
            name: "Basilisk 1",
            type: "MOB",
            icon: 396,
            x: 61,
            y: 9
        }, {
            mapid: 22,
            name: "Basilisk 2",
            type: "MOB",
            icon: 397,
            x: 61,
            y: 18
        }, {
            mapid: 22,
            name: "Basilisk 3",
            type: "MOB",
            icon: 398,
            x: 61,
            y: 27
        }, {
            mapid: 22,
            name: "Basilisk 4",
            type: "MOB",
            icon: 399,
            x: 61,
            y: 36
        }, {
            mapid: 22,
            name: "[Elite] Wood Elf",
            type: "MOB",
            icon: 400,
            x: 61,
            y: 45
        }, {
            mapid: 22,
            name: "Basilisk 5",
            type: "MOB",
            icon: 401,
            x: 61,
            y: 54
        }, {
            mapid: 22,
            name: "Basilisk 6",
            type: "MOB",
            icon: 402,
            x: 61,
            y: 63
        }, {
            mapid: 22,
            name: "Basilisk 7",
            type: "MOB",
            icon: 403,
            x: 61,
            y: 72
        }, {
            mapid: 22,
            name: "Basilisk 8",
            type: "MOB",
            icon: 404,
            x: 61,
            y: 81
        }, {
            mapid: 22,
            name: "[Boss] Zombie Lord",
            type: "MOB",
            icon: 339,
            x: 61,
            y: 92
        }, {
            mapid: 22,
            name: "Crusader 1",
            type: "MOB",
            icon: 405,
            x: 70,
            y: 9
        }, {
            mapid: 22,
            name: "Crusader 2",
            type: "MOB",
            icon: 406,
            x: 70,
            y: 18
        }, {
            mapid: 22,
            name: "Crusader 3",
            type: "MOB",
            icon: 407,
            x: 70,
            y: 27
        }, {
            mapid: 22,
            name: "Crusader 4",
            type: "MOB",
            icon: 408,
            x: 70,
            y: 36
        }, {
            mapid: 22,
            name: "[Elite] Ice Golem",
            type: "MOB",
            icon: 409,
            x: 70,
            y: 45
        }, {
            mapid: 22,
            name: "Crusader 5",
            type: "MOB",
            icon: 410,
            x: 70,
            y: 54
        }, {
            mapid: 22,
            name: "Crusader 6",
            type: "MOB",
            icon: 411,
            x: 70,
            y: 63
        }, {
            mapid: 22,
            name: "Crusader 7",
            type: "MOB",
            icon: 412,
            x: 70,
            y: 72
        }, {
            mapid: 22,
            name: "Crusader 8",
            type: "MOB",
            icon: 413,
            x: 70,
            y: 81
        }, {
            mapid: 22,
            name: "[Boss] Holy Knight",
            type: "MOB",
            icon: 340,
            x: 70,
            y: 92
        }, {
            mapid: 22,
            name: "Defender 1",
            type: "MOB",
            icon: 414,
            x: 79,
            y: 9
        }, {
            mapid: 22,
            name: "Defender 2",
            type: "MOB",
            icon: 415,
            x: 79,
            y: 18
        }, {
            mapid: 22,
            name: "Defender 3",
            type: "MOB",
            icon: 416,
            x: 79,
            y: 27
        }, {
            mapid: 22,
            name: "Defender 4",
            type: "MOB",
            icon: 417,
            x: 79,
            y: 36
        }, {
            mapid: 22,
            name: "[Elite] Lave Golem",
            type: "MOB",
            icon: 418,
            x: 79,
            y: 45
        }, {
            mapid: 22,
            name: "Defender 5",
            type: "MOB",
            icon: 419,
            x: 79,
            y: 54
        }, {
            mapid: 22,
            name: "Defender 6",
            type: "MOB",
            icon: 420,
            x: 79,
            y: 63
        }, {
            mapid: 22,
            name: "Defender 7",
            type: "MOB",
            icon: 421,
            x: 79,
            y: 72
        }, {
            mapid: 22,
            name: "Defender 8",
            type: "MOB",
            icon: 422,
            x: 79,
            y: 81
        }, {
            mapid: 22,
            name: "[Boss] Saint Richard",
            type: "MOB",
            icon: 341,
            x: 79,
            y: 92
        }, {
            mapid: 22,
            name: "Gladiator 1",
            type: "MOB",
            icon: 423,
            x: 88,
            y: 9
        }, {
            mapid: 22,
            name: "Gladiator 2",
            type: "MOB",
            icon: 424,
            x: 88,
            y: 18
        }, {
            mapid: 22,
            name: "Gladiator 3",
            type: "MOB",
            icon: 425,
            x: 88,
            y: 27
        }, {
            mapid: 22,
            name: "Gladiator 4",
            type: "MOB",
            icon: 426,
            x: 88,
            y: 36
        }, {
            mapid: 22,
            name: "[Elite] Demon Unicorn",
            type: "MOB",
            icon: 427,
            x: 88,
            y: 45
        }, {
            mapid: 22,
            name: "Gladiator 5",
            type: "MOB",
            icon: 428,
            x: 88,
            y: 54
        }, {
            mapid: 22,
            name: "Gladiator 6",
            type: "MOB",
            icon: 429,
            x: 88,
            y: 63
        }, {
            mapid: 22,
            name: "Gladiator 7",
            type: "MOB",
            icon: 430,
            x: 88,
            y: 72
        }, {
            mapid: 22,
            name: "Gladiator 8",
            type: "MOB",
            icon: 431,
            x: 88,
            y: 81
        }, {
            mapid: 22,
            name: "[Boss] High Priest",
            type: "MOB",
            icon: 342,
            x: 88,
            y: 92
        }, {
            mapid: 22,
            name: "Gate",
            type: "MOB",
            icon: 434,
            x: 94,
            y: 96
        }, {
            mapid: 23,
            name: "Illusion Guild",
            description: "Chest",
            type: "CITY",
            x: 24,
            y: 25
        }, {
            mapid: 23,
            name: "Transfer to Fellen",
            description: "Tele to outside of fishing guild",
            type: "TRAVEL",
            x: 23,
            y: 29
        }, {
            mapid: 23,
            name: "Cage",
            description: "35 fishing",
            icon: "cage",
            type: "RESOURCE",
            x: 12,
            y: 27
        }, {
            mapid: 23,
            name: "Fishing Net",
            description: "5 fishing",
            type: "RESOURCE",
            icon: "net",
            x: 8,
            y: 30
        }, {
            mapid: 23,
            name: "Fishing Rod",
            description: "1 fishing",
            type: "RESOURCE",
            icon: "fish",
            x: 14,
            y: 19
        }, {
            mapid: 23,
            name: "Fishing Rod",
            description: "1 fishing",
            type: "RESOURCE",
            icon: "fish",
            x: 13,
            y: 13
        }, {
            mapid: 23,
            name: "Fishing Rod",
            description: "1 fishing",
            type: "RESOURCE",
            icon: "fish",
            x: 17,
            y: 14
        }, {
            mapid: 23,
            name: "Fishing Rod",
            description: "1 fishing",
            type: "RESOURCE",
            icon: "fish",
            x: 20,
            y: 16
        }, {
            mapid: 23,
            name: "Poseidon's Trident",
            description: "95 fishing",
            type: "RESOURCE",
            icon: "trident",
            x: 13,
            y: 39
        }, {
            mapid: 23,
            name: "Poseidon's Trident",
            description: "95 fishing",
            type: "RESOURCE",
            icon: "woodharp",
            x: 17,
            y: 39
        }, {
            mapid: 23,
            name: "Steel Harpoon",
            description: "63 fishing",
            type: "RESOURCE",
            icon: "steelharp",
            x: 6,
            y: 23
        }, {
            mapid: 23,
            name: "Steel Harpoon",
            description: "63 fishing",
            type: "RESOURCE",
            icon: "steelharp",
            x: 7,
            y: 33
        }, {
            mapid: 23,
            name: "Wooden Harpoon",
            description: "50 fishing",
            type: "RESOURCE",
            icon: "woodharp",
            x: 9,
            y: 24
        }, {
            mapid: 23,
            name: "Gold Vein",
            description: "45 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 21,
            y: 69
        }, {
            mapid: 23,
            name: "Gold Vein",
            description: "45 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 41,
            y: 72
        }, {
            mapid: 23,
            name: "Redhodium Vein",
            description: "90 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 30,
            y: 83
        }, {
            mapid: 23,
            name: "Redhodium Vein",
            description: "90 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 47,
            y: 65
        }, {
            mapid: 23,
            name: "Silver Vein",
            description: "45 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 24,
            y: 80
        }, {
            mapid: 23,
            name: "Silver Vein",
            description: "45 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 35,
            y: 58
        }, {
            mapid: 23,
            name: "Silver Vein",
            description: "45 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 41,
            y: 80
        }, {
            mapid: 23,
            name: "Transfer",
            description: "transfer to dorpat",
            type: "TRAVEL",
            x: 31,
            y: 74
        }, {
            mapid: 23,
            name: "Pluto Guild Chest",
            description: "Chest",
            type: "CITY",
            x: 39,
            y: 66
        }, {
            mapid: 24,
            name: "Tombstone",
            description: "Respawn Location",
            type: "POI",
            x: 11,
            y: 14
        }, {
            mapid: 24,
            name: "Transfer to Dorpat",
            type: "TRAVEL",
            x: 18,
            y: 10
        }, {
            mapid: 24,
            name: "Every Man's Land",
            description: "Chest",
            type: "CITY",
            x: 18,
            y: 15
        }, {
            mapid: 24,
            name: "Cannibal Plant",
            type: "BOSS",
            cblevel: 2100,
            x: 71,
            y: 76
        }, {
            mapid: 24,
            name: "Nephilim Warrior",
            type: "BOSS",
            cblevel: 3E3,
            x: 78,
            y: 76
        }, {
            mapid: 24,
            name: "Ancient Hydra",
            type: "BOSS",
            cblevel: 1E3,
            x: 85,
            y: 76
        }, {
            mapid: 24,
            name: "Cow",
            type: "MOB",
            icon: 102,
            x: 33,
            y: 32
        }, {
            mapid: 24,
            name: "Cow King",
            type: "MOB",
            icon: 437,
            x: 39,
            y: 77
        }, {
            mapid: 25,
            name: "Moche",
            description: "Chest",
            type: "CITY",
            x: 48,
            y: 63
        }, {
            mapid: 25,
            name: "Campfire",
            type: "POI",
            x: 58,
            y: 41
        }, {
            mapid: 25,
            name: "Tin",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 67,
            y: 32
        }, {
            mapid: 25,
            name: "Copper",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 70,
            y: 24
        }, {
            mapid: 25,
            name: "Gray Wizard",
            type: "MOB",
            icon: 1,
            x: 60,
            y: 37
        }, {
            mapid: 25,
            name: "Minotaur",
            type: "MOB",
            icon: 6,
            x: 78,
            y: 10
        }, {
            mapid: 25,
            name: "Orc Warrior",
            type: "MOB",
            icon: 4,
            x: 62,
            y: 12
        }, {
            mapid: 25,
            name: "Sapphire Dragon",
            type: "MOB",
            icon: 14,
            x: 47,
            y: 10
        }, {
            mapid: 25,
            name: "Skeleton",
            type: "MOB",
            icon: 10,
            x: 25,
            y: 12
        }, {
            mapid: 25,
            name: "Campfire",
            type: "POI",
            x: 15,
            y: 21
        }, {
            mapid: 25,
            name: "Iron",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 20,
            y: 31
        }, {
            mapid: 25,
            name: "Ghost",
            type: "MOB",
            icon: 9,
            x: 13,
            y: 41
        }, {
            mapid: 25,
            name: "Campfire",
            type: "POI",
            x: 18,
            y: 49
        }, {
            mapid: 25,
            name: "Orc Warrior",
            type: "MOB",
            icon: 4,
            x: 22,
            y: 49
        }, {
            mapid: 25,
            name: "White Rat",
            type: "MOB",
            icon: 1,
            x: 32,
            y: 63
        }, {
            mapid: 25,
            name: "Chicken",
            type: "MOB",
            icon: 100,
            x: 38,
            y: 44
        }, {
            mapid: 25,
            name: "Sand",
            description: "1 mining",
            icon: "spade",
            type: "RESOURCE",
            x: 20,
            y: 62
        }, {
            mapid: 25,
            name: "Sand",
            description: "1 mining",
            icon: "spade",
            type: "RESOURCE",
            x: 25,
            y: 92
        }, {
            mapid: 25,
            name: "Desert Runner",
            type: "MOB",
            icon: 44,
            x: 11,
            y: 71
        }, {
            mapid: 25,
            name: "Fire Imp",
            type: "MOB",
            icon: 47,
            x: 19,
            y: 91
        }, {
            mapid: 25,
            name: "Transfer to Reval",
            description: "Leads to Cesis, Pernau",
            type: "TRAVEL",
            x: 46,
            y: 90
        }, {
            mapid: 25,
            name: "Orc Mage",
            type: "MOB",
            icon: 13,
            x: 57,
            y: 85
        }, {
            mapid: 25,
            name: "Orc Mage",
            type: "MOB",
            icon: 13,
            x: 85,
            y: 33
        }, {
            mapid: 25,
            name: "Silver",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 83,
            y: 94
        }, {
            mapid: 25,
            name: "Green WIzaard",
            type: "MOB",
            icon: 3,
            x: 93,
            y: 77
        }, {
            mapid: 25,
            name: "Transfer to Dorpat",
            description: "Teleports you to Dorpat",
            type: "TRAVEL",
            x: 93,
            y: 42
        }, {
            mapid: 25,
            name: "Woodcutter's Guild",
            description: "Requires Woodcutting guild permission and 80 woodcutting.",
            type: "POI",
            x: 84,
            y: 27
        }, {
            mapid: 26,
            name: "Transfer to Brocaliande Forest",
            description: "Teleports you to Brocaliande Forest",
            type: "TRAVEL",
            x: 10,
            y: 87
        }, {
            mapid: 26,
            name: "Summoned Skull",
            type: "MOB",
            icon: 324,
            x: 22,
            y: 76
        }, {
            mapid: 26,
            name: "Metal Dragon",
            type: "MOB",
            icon: 252,
            x: 13,
            y: 58
        }, {
            mapid: 26,
            name: "Fire Dragon",
            type: "MOB",
            icon: 253,
            x: 12,
            y: 37
        }, {
            mapid: 26,
            name: "Undead Paladin",
            type: "MOB",
            icon: 329,
            x: 51,
            y: 27
        }, {
            mapid: 26,
            name: "Rock Golem",
            type: "MOB",
            icon: 317,
            x: 77,
            y: 15
        }, {
            mapid: 26,
            name: "Ent",
            type: "MOB",
            icon: 323,
            x: 83,
            y: 36
        }, {
            mapid: 26,
            name: "Acient Golem",
            type: "MOB",
            icon: 325,
            x: 83,
            y: 36
        }, {
            mapid: 26,
            name: "Acient Golem",
            type: "MOB",
            icon: 325,
            x: 41,
            y: 75
        }, {
            mapid: 26,
            name: "Gravekeeper",
            type: "MOB",
            icon: 328,
            x: 64,
            y: 85
        }, {
            mapid: 26,
            name: "Wittensten Outpost",
            type: "CITY",
            x: 67,
            y: 51
        }, {
            mapid: 26,
            name: "Campfire",
            type: "POI",
            x: 74,
            y: 51
        }, {
            mapid: 27,
            name: "Transfer to Dungeon I",
            type: "TRAVEL",
            x: 22,
            y: 11
        }, {
            mapid: 27,
            name: "Transfer to Dungeon I",
            type: "TRAVEL",
            x: 10,
            y: 83
        }, {
            mapid: 27,
            name: "Transfer to Dungeon I",
            type: "TRAVEL",
            x: 46,
            y: 85
        }, {
            mapid: 27,
            name: "Transfer to Dungeon I",
            type: "TRAVEL",
            x: 34,
            y: 63
        }, {
            mapid: 27,
            name: "Transfer to Dungeon I",
            type: "TRAVEL",
            x: 60,
            y: 67
        }, {
            mapid: 27,
            name: "Transfer to Dungeon I",
            type: "TRAVEL",
            x: 82,
            y: 62
        }, {
            mapid: 27,
            name: "Transfer to Dungeon I",
            type: "TRAVEL",
            x: 93,
            y: 90
        }, {
            mapid: 27,
            name: "Transfer to Dungeon I",
            type: "TRAVEL",
            x: 87,
            y: 25
        }, {
            mapid: 27,
            name: "Ghost Dragon",
            type: "MOB",
            icon: 23,
            x: 15,
            y: 82
        }, {
            mapid: 27,
            name: "King Sapphire Dragon",
            type: "MOB",
            icon: 112,
            x: 14,
            y: 62
        }, {
            mapid: 27,
            name: "Adult Gilded Dragon",
            type: "MOB",
            icon: 250,
            x: 18,
            y: 46
        }, {
            mapid: 27,
            name: "King Gilded Dragon",
            type: "MOB",
            icon: 244,
            x: 17,
            y: 35
        }, {
            mapid: 27,
            name: "Campfire",
            type: "POI",
            x: 7,
            y: 37
        }, {
            mapid: 27,
            name: "Campfire",
            type: "POI",
            x: 10,
            y: 11
        }, {
            mapid: 27,
            name: "Campfire",
            type: "POI",
            x: 31,
            y: 34
        }, {
            mapid: 27,
            name: "Campfire",
            type: "POI",
            x: 63,
            y: 71
        }, {
            mapid: 27,
            name: "Black Rat",
            type: "MOB",
            icon: 8,
            x: 8,
            y: 19
        }, {
            mapid: 27,
            name: "Cave Worm",
            type: "MOB",
            icon: 197,
            x: 18,
            y: 16
        }, {
            mapid: 27,
            name: "Tin",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 22,
            y: 18
        }, {
            mapid: 27,
            name: "Tin",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 87,
            y: 31
        }, {
            mapid: 27,
            name: "Tin",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 55,
            y: 43
        }, {
            mapid: 27,
            name: "Copper",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 12,
            y: 7
        }, {
            mapid: 27,
            name: "Copper",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 61,
            y: 14
        }, {
            mapid: 27,
            name: "Iron",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 5,
            y: 83
        }, {
            mapid: 27,
            name: "Iron",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 77,
            y: 78
        }, {
            mapid: 27,
            name: "Iron",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 81,
            y: 59
        }, {
            mapid: 27,
            name: "Iron",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 79,
            y: 22
        }, {
            mapid: 27,
            name: "Iron Vein",
            description: "25 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 5,
            y: 88
        }, {
            mapid: 27,
            name: "Iron Vein",
            description: "25 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 85,
            y: 72
        }, {
            mapid: 27,
            name: "Iron Vein",
            description: "25 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 73,
            y: 61
        }, {
            mapid: 27,
            name: "Iron Vein",
            description: "25 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 73,
            y: 17
        }, {
            mapid: 27,
            name: "Campfire",
            type: "POI",
            x: 7,
            y: 37
        }, {
            mapid: 27,
            name: "Ettin King",
            type: "MOB",
            icon: 21,
            x: 37,
            y: 87
        }, {
            mapid: 27,
            name: "Efreet",
            type: "MOB",
            icon: 22,
            x: 50,
            y: 86
        }, {
            mapid: 27,
            name: "Skeleton Assassin",
            type: "MOB",
            icon: 138,
            x: 36,
            y: 68
        }, {
            mapid: 27,
            name: "Copper",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 25,
            y: 68
        }, {
            mapid: 27,
            name: "Skeleton Lord",
            type: "MOB",
            icon: 176,
            x: 29,
            y: 55
        }, {
            mapid: 27,
            name: "Skeleton King",
            type: "MOB",
            icon: 175,
            x: 32,
            y: 51
        }, {
            mapid: 27,
            name: "Dracula's Messenger",
            type: "MOB",
            icon: 444,
            x: 26,
            y: 42
        }, {
            mapid: 27,
            name: "Dracula's Messenger",
            type: "MOB",
            icon: 444,
            x: 43,
            y: 19
        }, {
            mapid: 27,
            name: "Dracula",
            type: "MOB",
            icon: 443,
            x: 30,
            y: 26
        }, {
            mapid: 27,
            name: "Tin",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 28,
            y: 20
        }, {
            mapid: 27,
            name: "Copper",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 36,
            y: 19
        }, {
            mapid: 27,
            name: "Hell Demon",
            type: "MOB",
            icon: 446,
            x: 43,
            y: 41
        }, {
            mapid: 27,
            name: "Hell Demon",
            type: "MOB",
            icon: 446,
            x: 87,
            y: 63
        }, {
            mapid: 27,
            name: "Hell Demon",
            type: "MOB",
            icon: 446,
            x: 58,
            y: 46
        }, {
            mapid: 27,
            name: "Enchanter",
            type: "MOB",
            icon: 204,
            x: 45,
            y: 51
        }, {
            mapid: 27,
            name: "Orc Overlord",
            type: "BOSS",
            cblevel: 470,
            x: 42,
            y: 58
        }, {
            mapid: 27,
            name: "Paladin",
            type: "MOB",
            icon: 25,
            x: 55,
            y: 58
        }, {
            mapid: 27,
            name: "Paladin",
            type: "MOB",
            icon: 25,
            x: 68,
            y: 73
        }, {
            mapid: 27,
            name: "Dark Knight",
            type: "MOB",
            icon: 29,
            x: 55,
            y: 68
        }, {
            mapid: 27,
            name: "King Ruby Dragon",
            type: "MOB",
            icon: 24,
            x: 59,
            y: 86
        }, {
            mapid: 27,
            name: "King Ruby Dragon",
            type: "MOB",
            icon: 24,
            x: 82,
            y: 83
        }, {
            mapid: 27,
            name: "Adult Ruby Dragon",
            type: "MOB",
            icon: 184,
            x: 69,
            y: 95
        }, {
            mapid: 27,
            name: "Adult Ruby Dragon",
            type: "MOB",
            icon: 184,
            x: 89,
            y: 89
        }, {
            mapid: 27,
            name: "Gold Vein",
            description: "45 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 92,
            y: 94
        }, {
            mapid: 27,
            name: "Gold",
            description: "45 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 58,
            y: 91
        }, {
            mapid: 27,
            name: "Gold",
            description: "45 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 87,
            y: 75
        }, {
            mapid: 27,
            name: "Undead Demon",
            type: "MOB",
            icon: 445,
            x: 80,
            y: 57
        }, {
            mapid: 27,
            name: "Undead Demon",
            type: "MOB",
            icon: 445,
            x: 74,
            y: 44
        }, {
            mapid: 27,
            name: "Undead Demon",
            type: "MOB",
            icon: 445,
            x: 68,
            y: 27
        }, {
            mapid: 27,
            name: "Undead Demon",
            type: "MOB",
            icon: 445,
            x: 56,
            y: 8
        }, {
            mapid: 27,
            name: "Undead Demon",
            type: "MOB",
            icon: 445,
            x: 53,
            y: 35
        }, {
            mapid: 27,
            name: "Energy Ghost",
            type: "MOB",
            icon: 137,
            x: 89,
            y: 41
        }, {
            mapid: 27,
            name: "Vampire",
            type: "MOB",
            icon: 11,
            x: 89,
            y: 20
        }, {
            mapid: 27,
            name: "Vampire Lord",
            type: "MOB",
            icon: 28,
            x: 73,
            y: 10
        }, {
            mapid: 27,
            name: "Demon Overlord",
            type: "BOSS",
            cblevel: 470,
            x: 83,
            y: 71
        }, {
            mapid: 27,
            name: "Transfer to Dungeon III",
            description: "Leads to Dungeon IV",
            type: "TRAVEL",
            x: 79,
            y: 83
        }, {
            mapid: 28,
            name: "Transfer to Dungeon II",
            description: "Leads to Dungeon III-I",
            type: "TRAVEL",
            x: 79,
            y: 83
        }, {
            mapid: 28,
            name: "Transfer to Dungeon IV",
            type: "TRAVEL",
            x: 44,
            y: 29
        }, {
            mapid: 28,
            name: "Transfer to Dungeon IV",
            type: "TRAVEL",
            x: 17,
            y: 81
        }, {
            mapid: 28,
            name: "Transfer to Dungeon IV",
            type: "TRAVEL",
            x: 51,
            y: 58
        }, {
            mapid: 28,
            name: "Mutated Knight",
            type: "MOB",
            icon: 448,
            x: 75,
            y: 90
        }, {
            mapid: 28,
            name: "Mutated Knight",
            type: "MOB",
            icon: 448,
            x: 69,
            y: 71
        }, {
            mapid: 28,
            name: "Mutated Knight",
            type: "MOB",
            icon: 448,
            x: 57,
            y: 84
        }, {
            mapid: 28,
            name: "Mutated Baron",
            type: "MOB",
            icon: 449,
            x: 82,
            y: 51
        }, {
            mapid: 28,
            name: "Mutated Baron",
            type: "MOB",
            icon: 449,
            x: 71,
            y: 45
        }, {
            mapid: 28,
            name: "Mutated Earl",
            type: "MOB",
            icon: 450,
            x: 65,
            y: 42
        }, {
            mapid: 28,
            name: "Mutated Earl",
            type: "MOB",
            icon: 450,
            x: 63,
            y: 26
        }, {
            mapid: 28,
            name: "Mutated Earl",
            type: "MOB",
            icon: 450,
            x: 85,
            y: 27
        }, {
            mapid: 28,
            name: "Mutated Earl",
            type: "MOB",
            icon: 450,
            x: 60,
            y: 21
        }, {
            mapid: 28,
            name: "Mutated Earl",
            type: "MOB",
            icon: 450,
            x: 65,
            y: 31
        }, {
            mapid: 28,
            name: "Royal Cyclops",
            type: "MOB",
            icon: 451,
            x: 50,
            y: 21
        }, {
            mapid: 28,
            name: "Royal Cyclops",
            type: "MOB",
            icon: 451,
            x: 27,
            y: 26
        }, {
            mapid: 28,
            name: "Royal Cyclops",
            type: "MOB",
            icon: 451,
            x: 27,
            y: 13
        }, {
            mapid: 28,
            name: "Royal Cyclops",
            type: "MOB",
            icon: 451,
            x: 17,
            y: 31
        }, {
            mapid: 28,
            name: "Cyclops Battlemage",
            type: "MOB",
            icon: 452,
            x: 12,
            y: 28
        }, {
            mapid: 28,
            name: "Cyclops Battlemage",
            type: "MOB",
            icon: 452,
            x: 18,
            y: 14
        }, {
            mapid: 28,
            name: "Cyclops Battlemage",
            type: "MOB",
            icon: 452,
            x: 15,
            y: 41
        }, {
            mapid: 28,
            name: "Cyclops Battlemage",
            type: "MOB",
            icon: 452,
            x: 9,
            y: 59
        }, {
            mapid: 28,
            name: "Hell Angel",
            type: "MOB",
            icon: 91,
            x: 8,
            y: 69
        }, {
            mapid: 28,
            name: "Hell Angel",
            type: "MOB",
            icon: 91,
            x: 18,
            y: 76
        }, {
            mapid: 28,
            name: "Hell Angel",
            type: "MOB",
            icon: 91,
            x: 21,
            y: 81
        }, {
            mapid: 28,
            name: "Hell Angel",
            type: "MOB",
            icon: 91,
            x: 31,
            y: 91
        }, {
            mapid: 28,
            name: "Soul Eater",
            type: "MOB",
            icon: 460,
            x: 19,
            y: 54
        }, {
            mapid: 28,
            name: "Soul Eater",
            type: "MOB",
            icon: 460,
            x: 26,
            y: 61
        }, {
            mapid: 28,
            name: "Death Energy",
            type: "MOB",
            icon: 462,
            x: 39,
            y: 75
        }, {
            mapid: 28,
            name: "Death Energy",
            type: "MOB",
            icon: 462,
            x: 41,
            y: 81
        }, {
            mapid: 28,
            name: "Death Energy",
            type: "MOB",
            icon: 462,
            x: 50,
            y: 79
        }, {
            mapid: 28,
            name: "Death Shadow",
            type: "MOB",
            icon: 461,
            x: 61,
            y: 62
        }, {
            mapid: 28,
            name: "Death Shadow",
            type: "MOB",
            icon: 461,
            x: 69,
            y: 59
        }, {
            mapid: 28,
            name: "Death Shadow",
            type: "MOB",
            icon: 461,
            x: 66,
            y: 52
        }, {
            mapid: 28,
            name: "Cyclops Ghost",
            type: "MOB",
            icon: 459,
            x: 47,
            y: 42
        }, {
            mapid: 28,
            name: "Cyclops Ghost",
            type: "MOB",
            icon: 459,
            x: 38,
            y: 38
        }, {
            mapid: 28,
            name: "Cyclops Ghost",
            type: "MOB",
            icon: 459,
            x: 47,
            y: 30
        }, {
            mapid: 28,
            name: "Blood Eagle",
            type: "BOSS",
            cblevel: 1E4,
            x: 43,
            y: 58
        }, {
            mapid: 28,
            name: "Campfire",
            type: "POI",
            x: 65,
            y: 83
        }, {
            mapid: 28,
            name: "Campfire",
            type: "POI",
            x: 73,
            y: 26
        }, {
            mapid: 28,
            name: "Campfire",
            type: "POI",
            x: 31,
            y: 20
        }, {
            mapid: 28,
            name: "Campfire",
            type: "POI",
            x: 15,
            y: 70
        }, {
            mapid: 28,
            name: "Campfire",
            type: "POI",
            x: 38,
            y: 49
        }, {
            mapid: 28,
            name: "Campfire",
            type: "POI",
            x: 35,
            y: 68
        }, {
            mapid: 28,
            name: "Campfire",
            type: "POI",
            x: 53,
            y: 67
        }, {
            mapid: 28,
            name: "Campfire",
            type: "POI",
            x: 54,
            y: 48
        }, {
            mapid: 28,
            name: "Iron",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 72,
            y: 77
        }, {
            mapid: 28,
            name: "Iron",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 86,
            y: 57
        }, {
            mapid: 28,
            name: "Iron",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 71,
            y: 20
        }, {
            mapid: 28,
            name: "Iron Vein",
            description: "25 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 71,
            y: 87
        }, {
            mapid: 28,
            name: "Iron Vein",
            description: "25 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 82,
            y: 42
        }, {
            mapid: 16,
            name: "Coal",
            description: "40 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 56,
            y: 17
        }, {
            mapid: 16,
            name: "Coal",
            description: "40 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 35,
            y: 15
        }, {
            mapid: 28,
            name: "Coal Vein",
            description: "40 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 63,
            y: 76
        }, {
            mapid: 28,
            name: "Coal Vein",
            description: "40 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 30,
            y: 17
        }, {
            mapid: 28,
            name: "Coal Vein",
            description: "40 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 11,
            y: 31
        }, {
            mapid: 28,
            name: "Dragonstone",
            description: "110 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 84,
            y: 75
        }, {
            mapid: 28,
            name: "Dragonstone",
            description: "110 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 8,
            y: 85
        }, {
            mapid: 28,
            name: "Dragonstone Vein",
            description: "110 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 81,
            y: 77
        }, {
            mapid: 28,
            name: "Dragonstone Vein",
            description: "110 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 12,
            y: 91
        }, {
            mapid: 29,
            name: "Burning Cyclops Lord",
            type: "MOB",
            icon: 454,
            x: 78,
            y: 88
        }, {
            mapid: 29,
            name: "Burning Cyclops Lord",
            type: "MOB",
            icon: 454,
            x: 90,
            y: 93
        }, {
            mapid: 29,
            name: "Burning Cyclops Lord",
            type: "MOB",
            icon: 454,
            x: 85,
            y: 84
        }, {
            mapid: 29,
            name: "Burning Cyclops Lord",
            type: "MOB",
            icon: 454,
            x: 68,
            y: 90
        }, {
            mapid: 29,
            name: "Burning Cyclops Lord",
            type: "MOB",
            icon: 454,
            x: 58,
            y: 84
        }, {
            mapid: 29,
            name: "Burning Cyclops Lord",
            type: "MOB",
            icon: 454,
            x: 46,
            y: 84
        }, {
            mapid: 29,
            name: "Burning Cyclops Lord",
            type: "MOB",
            icon: 454,
            x: 44,
            y: 94
        }, {
            mapid: 29,
            name: "Burning Cyclops",
            type: "MOB",
            icon: 453,
            x: 76,
            y: 78
        }, {
            mapid: 29,
            name: "Burning Cyclops",
            type: "MOB",
            icon: 453,
            x: 79,
            y: 64
        }, {
            mapid: 29,
            name: "Burning Cyclops",
            type: "MOB",
            icon: 453,
            x: 68,
            y: 71
        }, {
            mapid: 29,
            name: "Burning Cyclops",
            type: "MOB",
            icon: 453,
            x: 62,
            y: 80
        }, {
            mapid: 29,
            name: "Demonic Minotaur",
            type: "MOB",
            icon: 455,
            x: 38,
            y: 82
        }, {
            mapid: 29,
            name: "Demonic Minotaur",
            type: "MOB",
            icon: 455,
            x: 28,
            y: 85
        }, {
            mapid: 29,
            name: "Demonic Minotaur",
            type: "MOB",
            icon: 455,
            x: 24,
            y: 88
        }, {
            mapid: 29,
            name: "Demonic Minotaur",
            type: "MOB",
            icon: 455,
            x: 17,
            y: 89
        }, {
            mapid: 29,
            name: "Demonic Minotaur",
            type: "MOB",
            icon: 455,
            x: 79,
            y: 48
        }, {
            mapid: 29,
            name: "Demonic Minotaur",
            type: "MOB",
            icon: 455,
            x: 77,
            y: 37
        }, {
            mapid: 29,
            name: "Demonic Minotaur",
            type: "MOB",
            icon: 455,
            x: 87,
            y: 38
        }, {
            mapid: 29,
            name: "Demonic Minotaur",
            type: "MOB",
            icon: 455,
            x: 87,
            y: 29
        }, {
            mapid: 29,
            name: "Cyclops Battlemage",
            type: "MOB",
            icon: 452,
            x: 80,
            y: 25
        }, {
            mapid: 29,
            name: "Cyclops Battlemage",
            type: "MOB",
            icon: 452,
            x: 79,
            y: 15
        }, {
            mapid: 29,
            name: "Cyclops Battlemage",
            type: "MOB",
            icon: 452,
            x: 86,
            y: 9
        }, {
            mapid: 29,
            name: "Cyclops Battlemage",
            type: "MOB",
            icon: 452,
            x: 77,
            y: 7
        }, {
            mapid: 29,
            name: "Cyclops Battlemage",
            type: "MOB",
            icon: 452,
            x: 67,
            y: 26
        }, {
            mapid: 29,
            name: "Holy Minotaur",
            type: "MOB",
            icon: 455,
            x: 62,
            y: 26
        }, {
            mapid: 29,
            name: "Holy Minotaur",
            type: "MOB",
            icon: 455,
            x: 65,
            y: 15
        }, {
            mapid: 29,
            name: "Holy Minotaur",
            type: "MOB",
            icon: 455,
            x: 49,
            y: 29
        }, {
            mapid: 29,
            name: "Holy Minotaur",
            type: "MOB",
            icon: 455,
            x: 49,
            y: 19
        }, {
            mapid: 29,
            name: "Holy Minotaur",
            type: "MOB",
            icon: 455,
            x: 57,
            y: 18
        }, {
            mapid: 29,
            name: "Holy Minotaur",
            type: "MOB",
            icon: 455,
            x: 44,
            y: 8
        }, {
            mapid: 29,
            name: "Blood Minotaur",
            type: "MOB",
            icon: 464,
            x: 37,
            y: 32
        }, {
            mapid: 29,
            name: "Blood Minotaur",
            type: "MOB",
            icon: 464,
            x: 25,
            y: 40
        }, {
            mapid: 29,
            name: "Blood Minotaur",
            type: "MOB",
            icon: 464,
            x: 28,
            y: 30
        }, {
            mapid: 29,
            name: "Blood Minotaur",
            type: "MOB",
            icon: 464,
            x: 18,
            y: 35
        }, {
            mapid: 29,
            name: "Blood Minotaur",
            type: "MOB",
            icon: 464,
            x: 25,
            y: 28
        }, {
            mapid: 29,
            name: "Blood Minotaur",
            type: "MOB",
            icon: 464,
            x: 21,
            y: 20
        }, {
            mapid: 29,
            name: "Blood Minotaur",
            type: "MOB",
            icon: 464,
            x: 24,
            y: 8
        }, {
            mapid: 29,
            name: "Blood Minotaur",
            type: "MOB",
            icon: 464,
            x: 31,
            y: 17
        }, {
            mapid: 29,
            name: "Ice Minotaur",
            type: "MOB",
            icon: 466,
            x: 24,
            y: 45
        }, {
            mapid: 29,
            name: "Ice Minotaur",
            type: "MOB",
            icon: 466,
            x: 21,
            y: 55
        }, {
            mapid: 29,
            name: "Ice Minotaur",
            type: "MOB",
            icon: 466,
            x: 10,
            y: 55
        }, {
            mapid: 29,
            name: "Ice Minotaur",
            type: "MOB",
            icon: 466,
            x: 10,
            y: 42
        }, {
            mapid: 29,
            name: "Dragon Hunter",
            type: "MOB",
            icon: 463,
            x: 20,
            y: 71
        }, {
            mapid: 29,
            name: "Dragon Hunter",
            type: "MOB",
            icon: 463,
            x: 8,
            y: 71
        }, {
            mapid: 29,
            name: "Dragon Hunter",
            type: "MOB",
            icon: 463,
            x: 9,
            y: 83
        }, {
            mapid: 29,
            name: "Death Guardian",
            type: "MOB",
            icon: 456,
            x: 50,
            y: 45
        }, {
            mapid: 29,
            name: "Death Guardian",
            type: "MOB",
            icon: 456,
            x: 47,
            y: 57
        }, {
            mapid: 29,
            name: "Death Guardian",
            type: "MOB",
            icon: 456,
            x: 55,
            y: 60
        }, {
            mapid: 29,
            name: "Death Guardian",
            type: "MOB",
            icon: 456,
            x: 61,
            y: 50
        }, {
            mapid: 29,
            name: "Titan Minotaur",
            type: "BOSS",
            cblevel: 10015,
            x: 42,
            y: 58
        }, {
            mapid: 29,
            name: "Campfire",
            type: "POI",
            x: 35,
            y: 87
        }, {
            mapid: 29,
            name: "Campfire",
            type: "POI",
            x: 88,
            y: 68
        }, {
            mapid: 29,
            name: "Campfire",
            type: "POI",
            x: 89,
            y: 26
        }, {
            mapid: 29,
            name: "Campfire",
            type: "POI",
            x: 31,
            y: 34
        }, {
            mapid: 29,
            name: "Campfire",
            type: "POI",
            x: 12,
            y: 78
        }, {
            mapid: 29,
            name: "Transfer to Dungeon III",
            type: "TRAVEL",
            x: 44,
            y: 29
        }, {
            mapid: 29,
            name: "Transfer to Dungeon III",
            type: "TRAVEL",
            x: 17,
            y: 81
        }, {
            mapid: 29,
            name: "Transfer to Dungeon III",
            description: "Leads to Boss Blood Eagle",
            type: "TRAVEL",
            x: 51,
            y: 58
        }]
    };
    Mods.Newmap.POIfind = [];
    Mods.Newmap.POIfindMap = 0;
    HUD.drawMinimap = function() {
        if (!minimap) {
            getElem("mods_zone_buttondiv").style.visibility = "hidden";
            Mods.Newmap.drawMinimap();
            ctx.hud.fillStyle = "rgba(255, 255, 255, 0.3)";
            ctx.hud.fillRect(0, 14, 76, 4);
            ctx.hud.fillRect(76, 14, 4, 76);
            ctx.hud.fillRect(0, 90, 80, 4);
            ctx.hud.fillRect(0, 18, 4, 72);
            ctx.globalAlpha = 0;
            ctx.hud.font = "9px Arial";
            ctx.hud.textAlign = "center";
            ctx.hud.fillStyle = "black";
            ctx.hud.fillText("N", 39.5, 18);
            ctx.hud.fillStyle = "yellow";
            ctx.hud.fillText("N", 40.5, 19);
            var b = [], f = [], g;
            for (g in players)
                "undefined" != typeof players[g] && players[g].b_t == BASE_TYPE.PLAYER && (players[g].me ? b.push({
                    color: "#55FF55",
                    i: players[g].i,
                    j: players[g].j
                }) : Mods.findWithAttr(Contacts.friends, "name", players[g].name) ? f.push({
                    color: "yellow",
                    i: players[g].i,
                    j: players[g].j
                }) : 0 <= Contacts.ignores.indexOf(players[g].name) ? b.push({
                    color: "#FFFFFF",
                    i: players[g].i,
                    j: players[g].j
                }) : b.push({
                    color: "#00BFFF",
                    i: players[g].i,
                    j: players[g].j
                }));
            for (g in f)
                b.push(f[g]);
            if ("undefined" !== typeof Mods.Newmap && "undefined" !== typeof Mods.Newmap.POIfind)
                if (Mods.Newmap.POIfindMap == current_map)
                    for (g in Mods.Newmap.POIfind)
                        b.push(Mods.Newmap.POIfind[g]);
                else
                    Mods.Newmap.POIfind = [];
            for (g in b) {
                col = b[g].color;
                d = translateTileToCoordinates(b[g].i + 13, b[g].j - 9);
                a = 3 * map_increase;
                a = (Math.round((d.x - dest_x) / 8) / 1.01 + .5 | 0) - a;
                d = 14 + Math.round((d.y - dest_y) / 8);
                var k = !1
                  , m = 0
                  , f = [{
                    x: 0,
                    y: 0
                }, {
                    x: -6,
                    y: -3
                }, {
                    x: -6,
                    y: 3
                }]
                  , n = [{
                    x: -1,
                    y: 0
                }, {
                    x: -5,
                    y: -1
                }, {
                    x: -5,
                    y: 1
                }];
                2 > a && (m = Math.atan2(d - 53.5, a - 39.5),
                k = !0,
                d = 39.5 * (d - 53.5) / (39.5 - a) + 53.5,
                a = 0);
                16 > d && (k || (m = Math.atan2(d - 53.5, a - 39.5),
                k = !0),
                a = 39.5 * (a - 39.5) / (53.5 - d) + 39.5,
                d = 14);
                78 < a && (k || (m = Math.atan2(d - 53.5, a - 39.5),
                k = !0),
                d = -39.5 * (d - 53.5) / (39.5 - a) + 53.5,
                a = 79);
                92 < d && (k || (m = Math.atan2(d - 53.5, a - 39.5),
                k = !0),
                a = -39.5 * (a - 39.5) / (53.5 - d) + 39.5,
                d = 93);
                if (k) {
                    var k = [{
                        x: 0,
                        y: 0
                    }, {
                        x: 0,
                        y: 0
                    }, {
                        x: 0,
                        y: 0
                    }], p = [{
                        x: 0,
                        y: 0
                    }, {
                        x: 0,
                        y: 0
                    }, {
                        x: 0,
                        y: 0
                    }], r = Math.cos(m), m = Math.sin(m), t;
                    for (t in k)
                        k[t].x = a + r * f[t].x - m * f[t].y,
                        k[t].y = d + m * f[t].x + r * f[t].y,
                        p[t].x = a + r * n[t].x - m * n[t].y,
                        p[t].y = d + m * n[t].x + r * n[t].y;
                    ctx.hud.closePath();
                    ctx.hud.fillStyle = "#000000";
                    ctx.hud.beginPath();
                    ctx.hud.moveTo(k[0].x, k[0].y);
                    ctx.hud.lineTo(k[1].x, k[1].y);
                    ctx.hud.lineTo(k[2].x, k[2].y);
                    ctx.hud.fill();
                    ctx.hud.closePath();
                    ctx.hud.fillStyle = col;
                    ctx.hud.beginPath();
                    ctx.hud.moveTo(p[0].x, p[0].y);
                    ctx.hud.lineTo(p[1].x, p[1].y);
                    ctx.hud.lineTo(p[2].x, p[2].y);
                    ctx.hud.fill();
                    ctx.hud.closePath()
                } else
                    ctx.hud.fillStyle = "#000000",
                    ctx.hud.fillRect(a - 2, d - 2, 4, 4),
                    ctx.hud.fillStyle = col,
                    ctx.hud.fillRect(a - 1, d - 1, 2, 2)
            }
        }
    }
    ;
    HUD.drawMinimapLarge = function() {
        Mods.Newmap.drawMinimapLarge();
        if (minimap) {
            getElem("mods_zone_buttondiv").style.visibility = "";
            b = !1;
            var e = Mods.Newmap.FilterObj(Mods.Newmap.POI[0], {
                mapid: current_map
            });
            Mods.Newmap.HotSpots = [];
            var f, g, k;
            for (k in e) {
                var m = Mods.Newmap.translateMapCoords(e[k].x + 6, e[k].y - 3)
                  , n = Math.round(m.x) / 1.01 + .5 | 0
                  , m = 14 + Math.round(m.y);
                f = null ;
                switch (e[k].type) {
                case "CITY":
                    g = "#55FF55";
                    e[k].icon = "city";
                    break;
                case "BOSS":
                    g = "red";
                    e[k].icon = "boss";
                    break;
                case "MOB":
                    g = "transparent";
                    f = npc_base[e[k].icon].img;
                    var p = npc_base[e[k].icon];
                    e[k].cblevel = npc_base[e[k].icon].params.combat_level;
                    e[k].description = p.temp.total_accuracy + "A, " + p.temp.total_strength + "S, " + p.temp.total_defense + "D, " + p.params.health + "Hp";
                    break;
                case "POI":
                    g = "yellow";
                    e[k].icon = "poi";
                    break;
                case "TRAVEL":
                    g = "#00FFFF";
                    e[k].icon = "travel";
                    break;
                case "LOOT":
                    g = "white";
                    e[k].icon = "loot";
                    break;
                case "RESOURCE":
                    g = "#F5A9E1";
                    break;
                default:
                    g = "yellow"
                }
                switch (e[k].icon) {
                case "spade":
                    f = item_base[286].img;
                    break;
                case "pick":
                    f = item_base[23].img;
                    break;
                case "steelpick":
                    f = item_base[400].img;
                    break;
                case "wood":
                    f = item_base[22].img;
                    break;
                case "wood2":
                    f = item_base[152].img;
                    break;
                case "fish":
                    f = item_base[7].img;
                    break;
                case "ironrod":
                    f = item_base[1036].img;
                    break;
                case "net":
                    f = item_base[124].img;
                    break;
                case "cage":
                    f = item_base[127].img;
                    break;
                case "woodharp":
                    f = item_base[125].img;
                    break;
                case "trident":
                    f = item_base[1397].img;
                    break;
                case "steelharp":
                    f = item_base[126].img;
                    break;
                case "city":
                    f = {
                        sheet: IMAGE_SHEET.MISC,
                        x: 2,
                        y: 7
                    };
                    break;
                case "boss":
                    f = item_base[544].img;
                    break;
                case "poi":
                    f = item_base[1132].img;
                    break;
                case "travel":
                    f = {
                        sheet: IMAGE_SHEET.SICOS,
                        x: 0,
                        y: 5
                    };
                    break;
                case "loot":
                    f = {
                        sheet: IMAGE_SHEET.MISC,
                        x: 4,
                        y: 0
                    }
                }
                "transparent" != g && (ctx.hud.beginPath(),
                ctx.hud.arc(n, m, 6, 0, 2 * Math.PI, !1),
                ctx.hud.fillStyle = g,
                ctx.hud.fill(),
                ctx.hud.lineWidth = 1,
                ctx.hud.strokeStyle = "#000000",
                ctx.hud.stroke());
                if (f) {
                    var r, t;
                    "string" == typeof f.hash ? (f.x = 12,
                    f.y = 10,
                    p = getBodyImgNoHalo(f.hash),
                    r = {
                        img: [p],
                        tile_width: 1,
                        tile_height: 1
                    },
                    r.url = p.toDataURL(),
                    p = 12,
                    t = 10) : (r = IMAGE_SHEET[f.sheet],
                    p = f.x,
                    t = f.y);
                    g = "transparent" == g ? 16 : 12;
                    ctx.hud.drawImage(r.img[0], p * r.tile_width, t * r.tile_height, 32, 32, n - g / 2, m - g / 2, g, g)
                }
                Mods.Newmap.HotSpots.push({
                    x: n,
                    y: m,
                    desc: (f ? "<div style='width:32px;height:32px;float:left;background:url(\"" + r.url + '") no-repeat scroll ' + -f.x * r.tile_width + "px " + -f.y * r.tile_height + "px transparent;display: inline-block;margin: 0px;padding: 0px;'>&nbsp;</div>" : "") + e[k].type + ": <b>" + e[k].name + (e[k].cblevel ? " (" + e[k].cblevel + ")" : "") + "</b><br/>" + (e[k].description ? e[k].description : "")
                })
            }
            Mods.Newmap.BlinkPos("#55FF55");
            if (-1 != ["Dungeon quest", "No Man's Land", "Cathedral", "Every Man's Land"].indexOf(map_names[players[0].map]))
                for (var q in players)
                    players[q].b_t != BASE_TYPE.PLAYER || players[q].me || (m = Mods.Newmap.translateMapCoords(players[q].i + 6, players[q].j - 3),
                    n = Math.round(m.x) / 1.01 + .5 | 0,
                    m = 14 + Math.round(m.y),
                    e = players[q].name,
                    ctx.hud.font = "9px Arial",
                    ctx.hud.textAlign = "center",
                    ctx.hud.fillStyle = "#000",
                    ctx.hud.fillText(e, n - 1, m - 1),
                    ctx.hud.fillStyle = "yellow",
                    ctx.hud.fillText(e, n, m));
            getElem("hud").addEventListener("mousemove", Mods.Newmap.MapCoords, !1)
        }
    }
    ;
    Mods.Newmap.ShowZone = function() {
        getElem("mods_zone_buttondiv").style.visibility = "hidden";
        b = !0;
        var e = new Image;
        e.onload = function() {
            ctx.hud.drawImage(e, .01 * ctx.hud.canvas.width, .05 * ctx.hud.canvas.height, .98 * ctx.hud.canvas.width, .9 * ctx.hud.canvas.height)
        }
        ;
        e.src = "https://mo.mo.ee/world_map_2015_oct.png"
    }
    ;
    Mods.Newmap.BlinkPos = function(e, f, g) {
        if (minimap && !b) {
            if (!f && !g) {
                var k = Mods.Newmap.translateMapCoords(players[0].i + 6, players[0].j - 3)
                  , m = Math.round(k.x) / 1.01 + .5 | 0
                  , k = 14 + Math.round(k.y);
                f = m;
                g = k
            }
            ctx.hud.fillStyle = e;
            ctx.hud.fillRect(f - 2, g - 2, 4, 4);
            setTimeout(function() {
                Mods.Newmap.BlinkPos("red" == e ? "#55FF55" : "red", f, g)
            }, 1E3)
        }
    }
    ;
    Mods.Newmap.translateMapCoords = function(b, f) {
        return {
            x: f * half_tile_width_round + b * half_tile_width_round + dest_x,
            y: b * half_tile_height_round - f * half_tile_height_round + dest_y
        }
    }
    ;
    Mods.Newmap.FilterObj = function(b, f) {
        return b.filter(function(b) {
            return Object.keys(f).every(function(e) {
                return b[e] == f[e]
            })
        })
    }
    ;
    Mods.Newmap.MouseTranslate = function(b, f) {
        var g = width / wrapper.style.width.replace("px", "")
          , k = height / wrapper.style.height.replace("px", "");
        b = b * g - dest_x;
        f = f * k - dest_y;
        var k = 2 * b / tile_width
          , m = 2 * f / (1.18 * tile_height)
          , g = Math.round((k + m) / 2) - 1
          , k = Math.round((k - m) / 2);
        return {
            i: g,
            j: k
        }
    }
    ;
    Mods.Newmap.MapCoords = function(e) {
        var f = getElem("mods_newmap_coords")
          , g = getElem("mods_newmap_popup");
        e.clientX = e.clientX || e.pageX || e.touches && e.touches[0].pageX;
        e.clientY = e.clientY || e.pageY || e.touches && e.touches[0].pageY;
        var k = translateMousePositionToScreenPosition(e.clientX, e.clientY)
          , m = Mods.Newmap.MouseTranslate(1.15 * e.clientX, e.clientY)
          , n = Math.round(m.i) - 9
          , m = Math.round(m.j) + 7;
        -1 < n && -1 < m && 101 > n && 101 > m && (f.innerHTML = n + "/" + m);
        var n = !1, p;
        for (p in Mods.Newmap.HotSpots)
            if (5 > Math.abs(k.x - Mods.Newmap.HotSpots[p].x) && 5 > Math.abs(k.y - Mods.Newmap.HotSpots[p].y)) {
                g.style.top = e.clientY + "px";
                g.style.left = e.clientX + 10 + "px";
                g.innerHTML = Mods.Newmap.HotSpots[p].desc;
                n = !0;
                break
            }
        f.style.visibility = "";
        g.style.visibility = n ? "" : "hidden";
        if (!minimap || b)
            getElem("hud").removeEventListener("mousemove", Mods.Newmap.MapCoords, !1),
            f.style.visibility = "hidden",
            g.style.visibility = "hidden"
    }
    ;
    Mods.timestamp("newmap")
}
;
Load.newmarket = function() {
    modOptions.newmarket.time = timestamp();
    Handlebars.registerHelper("mod_quantity", function(b) {
        var e = ""
          , f = market_results.filter(function(e) {
            return e.id == b
        });
        0 < f.length && (e = f[0].count,
        f = Mods.Newmarket.OwnedQuantity(f[0].item_id),
        e = "You own: <span style='color:" + (f >= e ? "lightgreen" : 0 == f ? "red" : "yellow") + "'>" + f + "</span>");
        return e
    });
    Handlebars.registerHelper("select_states", function(b, e) {
        if (e == Mods.Newmarket.states[b])
            return "selected='selected'"
    });
    Mods.Newmarket.transaction_announce = function(b) {
        if (b = "string" == typeof b ? b : !1)
            switch (b) {
            case "announce":
                b = getElem("announce_list");
                Mods.Newmarket.submitAnnouncement();
                Mods.Newmarket.announceList = {};
                addClass(b, "hidden");
                b.innerHTML = "&nbsp;";
                break;
            case "expand":
                b = getElem("announce_queued_list");
                var e = getElem("announce_expand");
                hasClass(b, "hidden") ? (removeClass(b, "hidden"),
                e.innerHTML = "Collapse") : (addClass(b, "hidden"),
                e.innerHTML = "Expand");
                break;
            case "select":
                var f = market_transaction_offers;
                b = 0;
                for (e in f)
                    f[e].count && f[e].available && (Mods.Newmarket.gatherAnnounce(f[e].id),
                    b++);
                e = hasClass(getElem("announce_queued_list"), "hidden");
                getElem("announce_list").innerHTML = market_announce_template({
                    results: Mods.Newmarket.announceList
                });
                getElem("announce_queued_amount").innerHTML = b;
                null === e && removeClass(getElem("announce_queued_list"), "hidden");
                break;
            case "remove":
                b = getElem("announce_list"),
                Mods.Newmarket.announceList = {},
                addClass(b, "hidden"),
                b.innerHTML = "&nbsp;"
            }
    }
    ;
    Mods.Newmarket.transaction_remove_announce = function(b) {
        delete Mods.Newmarket.announceList[b];
        b = 0;
        for (var e in Mods.Newmarket.announceList)
            b++;
        0 < b ? (e = hasClass(getElem("announce_queued_list"), "hidden"),
        getElem("announce_list").innerHTML = market_announce_template({
            results: Mods.Newmarket.announceList
        }),
        getElem("announce_queued_amount").innerHTML = b,
        null === e && removeClass(getElem("announce_queued_list"), "hidden")) : (getElem("announce_list").innerHTML = "&nbsp;",
        addClass(getElem("announce_list"), "hidden"))
    }
    ;
    Mods.Newmarket.offerFilter = function(b, e, f) {
        if (void 0 == item_base[b] || "number" != typeof parseInt(e) || 1 > e || "number" != typeof parseInt(f))
            return "";
        b = item_base[b].name;
        var g = Mods.marketReplace, k = "", m;
        for (m in g)
            b = b.replace(m, g[m]);
        return k = formatLargeNumber(e, 1) + " " + b + " for " + formatLargeNumber(f, 1) + (1 < e ? " ea" : "")
    }
    ;
    Mods.Newmarket.gatherAnnounce = function(b) {
        var e = !1, f = market_transaction_offers, g;
        for (g in f)
            if (f[g].id == b) {
                f = f[g];
                e = !0;
                break
            }
        if (e && 0 != f.count && 0 != f.available) {
            var e = f.id
              , k = f.to_player || !1
              , m = f.type
              , n = Mods.Newmarket.offerFilter(f.item_id, f.count, f.price)
              , f = Mods.Newmarket.announceList;
            if (0 != n.length) {
                f[b] = {
                    id: e,
                    to: k,
                    name: n,
                    type: m
                };
                b = hasClass(getElem("announce_queued_list"), "hidden");
                getElem("announce_list").innerHTML = market_announce_template({
                    results: Mods.Newmarket.announceList
                });
                removeClass(getElem("announce_list"), "hidden");
                null === b && removeClass(getElem("announce_queued_list"), "hidden");
                b = 0;
                for (g in f)
                    b++;
                getElem("announce_queued_amount").innerHTML = b
            }
        }
    }
    ;
    Mods.Newmarket.clearAnnouncement = function() {
        var b = getElem("announce_list");
        Mods.Newmarket.announceList = {};
        addClass(b, "hidden");
        b.innerHTML = "&nbsp;";
        Mods.Newmarket.announces = {
            messages: [],
            count: 0
        }
    }
    ;
    Mods.Newmarket.submitAnnouncement = function() {
        var b, e, f, g, k, m, n, p, r, t, q;
        e = Mods.Newmarket.max_lines();
        b = Mods.Newmarket.announceList;
        f = Mods.Newmarket.announces.messages = [];
        g = "[BUY] ";
        k = "[SELL] ";
        m = {};
        n = 0;
        for (r in b)
            !1 !== b[r].to ? (p = 0 == b[r].type ? " [SELL] " : " [BUY] ",
            m[b[r].to] = m[b[r].to] || [],
            m[b[r].to].push(p + b[r].name)) : 1 == b[r].type ? 160 > b[r].name.length + g.length + 3 ? g += b[r].name + " | " : (f.push(g.slice(0, -3)),
            g = "[BUY] " + b[r].name + " | ",
            n++) : 0 == b[r].type && (160 > b[r].name.length + k.length + 3 ? k += b[r].name + " | " : (f.push(k.slice(0, -3)),
            k = "[SELL] " + b[r].name + " | ",
            n++));
        0 < g.length - 7 && (f.push(g.slice(0, -3)),
        n++);
        0 < k.length - 7 && (f.push(k.slice(0, -3)),
        n++);
        Mods.Newmarket.announces.count = n;
        b = "";
        for (t in m) {
            b = '/w "' + t + '" My offer:';
            for (q in m[t])
                160 > b.length + m[t][q].length + 6 ? b += m[t][q] + ", " : (b = capitaliseFirstLetter(b.slice(0, -2)) + " is up.",
                f.push(b),
                b = '/w "' + t + '" My offer:');
            b = capitaliseFirstLetter(b.slice(0, -2)) + " is up.";
            b.length > ('/w "' + t + '"').length && f.push(b)
        }
        0 != f.length && (f.sort(function(b, e) {
            return /^\[BUY\]/.test(e) || /^\/w/.test(b) ? 1 : /^\/w/.test(e) || /^\[BUY\]/.test(b) ? -1 : 0
        }),
        0 < n ? Mods.Newmarket.allowTrade() ? (e = (1 == n ? "This Announcement uses 1 $$ line. " : 1 < n ? "These Announcements use " + n + " $$ lines. " : "") + "You have " + (e - Mods.Newmarket.times.length) + " available this hour. Post this Announcement?",
        Popup.prompt(e, Mods.Newmarket.submitAnnouncementCallback, Mods.Newmarket.clearAnnouncement)) : (e = 36E5 + Mods.Newmarket.times[0] - timestamp(),
        e = Math.ceil(Math.round(e / 6E4 * 10) / 10) + " minutes",
        Popup.dialog("You have used all announcement lines this hour.<br>You must wait at least " + e + " before you can submit another offer.", null_function)) : Mods.Newmarket.submitAnnouncementCallback())
    }
    ;
    Mods.Newmarket.submitAnnouncementCallback = function() {
        var b = Mods.Newmarket.announces.messages, e, f = [!1, !1], g = 1;
        if (0 < b.length)
            for (e in b) {
                var k = -1 != b[e].indexOf("/w");
                k || !0 === Contacts.channels.$$ ? k || Mods.Newmarket.allowTrade() ? (function(b) {
                    setTimeout(function() {
                        Socket.send("message", b)
                    }, 100 * g)
                }(k ? {
                    data: b[e]
                } : {
                    data: b[e],
                    lang: "$$"
                }),
                k || (Mods.Newmarket.times.push(timestamp()),
                localStorage.announceBlock = JSON.stringify(Mods.Newmarket.times)),
                g++) : f[1] || (k = 36E5 + Mods.Newmarket.times[0] - timestamp(),
                k = Math.ceil(Math.round(k / 6E4 * 10) / 10) + " minutes",
                addChatText("You have submitted " + Mods.Newmarket.max_lines() + " or more offers within the last hour. You must wait at least " + k + " before you can submit another offer.", void 0, COLOR.TEAL),
                f[1] = !0) : f[0] || (addChatText("You must be subscribed to [$$] to use the Announce feature. Go to: Contacts - Channels - [$$] Subscribe.", void 0, COLOR.TEAL),
                f[0] = !0)
            }
        Mods.Newmarket.announceList = {}
    }
    ;
    Mods.Newmarket.allowTrade = function() {
        for (var b = Mods.Newmarket.max_lines(), e = Mods.Newmarket.times.length; Mods.Newmarket.times[0] + 36E5 < timestamp(); )
            Mods.Newmarket.times.splice(0, 1);
        Mods.Newmarket.times.length != e && (localStorage.announceBlock = JSON.stringify(Mods.Newmarket.times));
        return Mods.Newmarket.times.length >= b ? !1 : !0
    }
    ;
    Mods.Newmarket.transaction_click = function(b) {
        Mods.Newmarket.saveSelectValue();
        var e = getElem("market_drop_" + b).value;
        "delete" == e && Market.client_cancel_offer(b);
        "resubmit" == e && Market.client_extend_offer(b);
        "announce" == e && Mods.Newmarket.gatherAnnounce(b);
        "edit" == e && Mods.Newmarket.edit(b)
    }
    ;
    Mods.Newmarket.transaction_select = function() {
        var b = getElem("market_drop_default").value, e = market_transaction_offers, f;
        for (f in e) {
            var g = e[f].id
              , k = getElem("market_drop_" + g);
            "undefined" != typeof b && "number" == typeof g && ("delete" == b || "edit" == b ? k.value = b : 0 < parseInt(e[f].count) && (e[f].available && "announce" == b ? k.value = b : "resubmit" == b && (k.value = b)))
        }
        Mods.Newmarket.saveSelectValue()
    }
    ;
    Mods.Newmarket.saveSelectValue = function() {
        var b = market_transaction_offers, e = Mods.Newmarket.states = {}, f;
        for (f in b) {
            var g = getElem("market_drop_" + b[f].id);
            g && g.value && (e[b[f].id] = g.value)
        }
        e["default"] = getElem("market_drop_default").value
    }
    ;
    Mods.Newmarket.OwnedQuantity = function(b) {
        return (b = Mods.findWithAttr(chest_content, "id", b)) && 0 < chest_content[b].count ? chest_content[b].count : 0
    }
    ;
    Mods.Newmarket.MaxQuantity = function(b) {
        if (b) {
            var e = market_results.filter(function(e) {
                return e.id == b
            });
            if (0 < e.length) {
                var f = e[0].item_id
                  , g = e[0].count;
                0 == e[0].type ? getElem("market_offer_amount").value = g : (f = Mods.Newmarket.OwnedQuantity(f),
                getElem("market_offer_amount").value = f < g ? f : g);
                Market.client_update_total_cost(e[0].id)
            }
        } else
            getElem("market_new_offer_amount").value = getElem("market_new_offer_count").innerText,
            Market.client_new_offer_update_total_cost()
    }
    ;
    Mods.Newmarket.Tradetoggle = function() {
        var b = getElem("settings_tradechannel");
        switch (Mods.Newmarket.tradechatmode) {
        case 0:
            b.innerHTML = "Trade Chat: manual join";
            Mods.Newmarket.tradechatmode = 1;
            break;
        default:
            b.innerHTML = "Trade Chat: join automatically",
            Mods.Newmarket.tradechatmode = 0
        }
        localStorage.tradechatmode = JSON.stringify(Mods.Newmarket.tradechatmode)
    }
    ;
    Mods.Newmarket.next = function() {
        getElem("market_search_results").scrollTop = 0;
        50 == market_results.length && (getElem("market_search_min_price").value = market_results[market_results.length - 1].price,
        getElem("market_search_max_price").value = "",
        Market.client_search())
    }
    ;
    Mods.Newmarket.togglepopup = function() {
        Mods.Newmarket.popup = !Mods.Newmarket.popup;
        localStorage.marketpopup = JSON.stringify(Mods.Newmarket.popup)
    }
    ;
    Mods.Newmarket.equippedinslot = function(b) {
        var e = players[0].temp.inventory, f;
        for (f in e)
            if (1 == e[f].selected && item_base[e[f].id].params.slot == b)
                return e[f].id;
        return null
    }
    ;
    Mods.Newmarket.hidedetails = function(b) {
        if (b = getElem("market_offer_popup"))
            b.style.visibility = "hidden"
    }
    ;
    Mods.Newmarket.details = function(b) {
        if (!Mods.Newmarket.popup) {
            if (null == getElem("market_offer_popup")) {
                var e = document.createElement("div");
                e.className = "marketpopup menu";
                e.id = "market_offer_popup";
                e.style.opacity = "1";
                getElem("wrapper").appendChild(e)
            }
            var f = market_results.filter(function(e) {
                return e.id == b
            })
              , e = getElem("market_offer_popup")
              , g = new Date(f[0].available_until) - new Date
              , g = g / 1E3
              , g = Math.floor(g / 3600) + "h " + Math.floor(g % 3600 / 60) + "m"
              , k = item_base[f[0].item_id]
              , m = "<div style='" + Items.get_background_image(k.b_i) + "width: 32px;height: 32px;display: inline-block;margin: 0px;padding: 0px;float:left;'>&nbsp;</div>"
              , m = m + "<table>" + ("<tr><td colspan=2>" + (0 == f[0].type ? "<span style='color:lightgreen'>[You are BUYING]" : "<span style='color:orange'>[You are SELLING]") + " <b>" + k.name + "</b></span></td></tr>")
              , m = m + ("<tr><td colspan=2 style='color:#3BEEEE'>" + Items.info(f[0].item_id) + "</td></tr>");
            if (1 == f[0].type)
                var n = Mods.findWithAttr(chest_content, "id", f[0].item_id)
                  , n = n && 0 < chest_content[n].count ? chest_content[n].count : 0
                  , m = m + ("<tr><td style='color:#CCC'>You own:</td><td style='color:" + (0 < n ? "#00FF00'>" : "#FF0000'>") + n + "</td></tr>");
            else
                k.b_t != ITEM_CATEGORY.WEAPON && k.b_t != ITEM_CATEGORY.ARMOR && k.b_t != ITEM_CATEGORY.JEWELRY && k.b_t != ITEM_CATEGORY.PET || !k.params.wearable || (n = Mods.Newmarket.equippedinslot(k.params.slot)) && (m += "<tr><td colspan=2 style='color:#F3A7BD'>" + Items.info(n) + "<br/>Comparing: " + item_base[n].name + "</td></tr>");
            m += "<tr><td style='color:#CCC'>Dealer:</td><td style='color:" + (Mods.findWithAttr(Contacts.friends, "name", f[0].player) ? "#FFFF00'>(friend) " : "'>") + f[0].player + "</td></tr>";
            m += "<tr><td style='color:#CCC'>Expires in:</td><td>" + g + "</td></tr><tr><td style='color:#CCC'>Price:</td><td>" + thousandSeperate(f[0].price) + " vs " + thousandSeperate(k.params.price) + " (wiki) = " + Math.round(f[0].price / k.params.price * 100) + "%</td></tr>";
            m += "<tr><td style='color:#CCC'>Quantity:</td><td>" + f[0].count + " (total " + thousandSeperate(f[0].count * f[0].price) + " coins)</td></tr>";
            m += "</table>";
            e.innerHTML = m;
            f = getElem("market");
            e.style.position = "absolute";
            e.style.zIndex = "310";
            e.style.left = f.offsetLeft - 25 + "px";
            e.style.top = f.offsetTop - 25 + "px";
            e.style.visibility = ""
        }
    }
    ;
    Mods.Newmarket.edit = function(b) {
        var e = market_transaction_offers.filter(function(e) {
            return e.id == b
        });
        if (0 < e.length) {
            var f = e[0].type
              , g = e[0].item_id
              , k = null == e[0].to_player ? "" : e[0].to_player
              , m = e[0].price
              , n = e[0].count;
            Market.client_cancel_offer(b);
            setTimeout(function() {
                Market.open();
                Market.client_new_offer();
                getElem("market_new_offer_search_type").value = f;
                Market.client_update_new_offer_items();
                getElem("market_new_offer_items_item").value = g;
                Market.client_update_new_offer_item_change();
                getElem("market_offer_player").value = k;
                getElem("market_new_offer_price").value = m;
                getElem("market_new_offer_amount").value = n;
                Market.client_new_offer_update_total_cost()
            }, 1E3)
        }
    }
    ;
    Mods.Newmarket.eventListener = {
        keys: {
            keydown: [KEY_ACTION.SEND_CHAT]
        },
        fn: function(b, e, f) {
            "keydown" == b && GAME_STATE == GAME_STATES.CHAT && "$$" == getElem("current_channel").value && f == KEY_ACTION.SEND_CHAT && 0 < getElem("my_text").value.length && !/^\//.test(getElem("my_text").value) && ((b = Player.has_lower_permissions(players[0].name),
            b || Mods.Newmarket.allowTrade()) ? b || (Mods.Newmarket.times.push(timestamp()),
            localStorage.announceBlock = JSON.stringify(Mods.Newmarket.times)) : (getElem("my_text").value = "",
            b = 36E5 + Mods.Newmarket.times[0] - timestamp(),
            b = Math.ceil(Math.round(b / 6E4 * 10) / 10) + " minutes",
            addChatText("You have submitted " + Mods.Newmarket.max_lines() + " or more offers within the last hour. You must wait at least " + b + " before you can submit another offer.", void 0, COLOR.TEAL)))
        }
    };
    Mods.Newmarket.socketOn = {
        actions: ["market_transaction_offers", "login"],
        fn: function(b, e) {
            if ("market_transaction_offers" == b) {
                var f, g, k;
                hasClass(getElem("market"), "hidden") || Timers.set("confirm_submit", function() {
                    Mods.Newmarket.checkSubmit(!0);
                    Timers.clear("confirm_submit")
                }, 1E3);
                f = Mods.Newmarket.announceList;
                g = 0;
                for (k in f)
                    g++;
                0 < g && (getElem("announce_list").innerHTML = market_announce_template({
                    results: Mods.Newmarket.announceList
                }),
                getElem("announce_queued_amount").innerHTML = g,
                removeClass(getElem("announce_list"), "hidden"))
            }
            "login" == b && e && "ok" == e.status && Mods.Newmarket.tradechatmode && Contacts.add_channel("$$")
        }
    };
    Mods.Newmarket.resubmit = function(b) {
        if (!(Timers.running("checkSubmit") || 0 < Mods.Newmarket.submitHolder.length)) {
            var e = market_transaction_offers.filter(function(e) {
                return e.id == b
            });
            if (0 < e.length) {
                Mods.Newmarket.submitHolder.push(e[0]);
                var f = market_transaction_offers.filter(function(b) {
                    return b.item_id == e[0].item_id && b.type == e[0].type && b.to_player == e[0].to_player && b.price == e[0].price && b.count == e[0].count
                });
                Mods.Newmarket.submitHolder[0].likeoff = f.length;
                Mods.Newmarket.submitHolder[0].timer = 0;
                Market.client_cancel_offer(b);
                Timers.clear("checkSubmit")
            }
        }
    }
    ;
    Mods.Newmarket.checkSubmit = function(b, e) {
        var f = Mods.Newmarket.submitHolder;
        if (0 == f.length || f[0] && void 0 == f[0].id || f[0] && 0 < f[0].timer) {
            var g = !0;
            if (f[0] && 0 < f[0].timer) {
                var k = market_transaction_offers.filter(function(b) {
                    return b.item_id == f[0].item_id && b.type == f[0].type && b.to_player == f[0].to_player && b.price == f[0].price && b.count == f[0].count
                });
                k.length >= f[0].likeoff && (g = !1)
            }
            if (g) {
                0 != f.length && (Mods.consoleLog("resubmit failed: timeout"),
                addChatText("Failed to resubmit", void 0, COLOR.TEAL));
                Mods.Newmarket.submitQueued = !1;
                Timers.clear("checkSubmit");
                Mods.Newmarket.submitHolder = [];
                return
            }
        }
        b && (k = market_transaction_offers.filter(function(b) {
            return b.item_id == f[0].item_id && b.type == f[0].type && b.to_player == f[0].to_player && b.price == f[0].price && b.count == f[0].count
        }),
        g = k.length >= f[0].likeoff ? !0 : !1,
        k = market_transaction_offers.filter(function(b) {
            return b.id == f[0].id
        }),
        g && 0 == k.length ? (addChatText("Your offer for " + f[0].count + " " + item_base[f[0].item_id].name + ("" == f[0].to_player || null == f[0].to_player ? "" : " to " + f[0].to_player) + " was resubmitted.", void 0, COLOR.TEAL),
        Mods.Newmarket.submitHolder = [],
        Mods.Newmarket.submitQueued = !1) : 0 < k.length ? (Mods.Newmarket.submitHolder = [],
        Mods.Newmarket.submitQueued = !1) : (g = chests[0].filter(function(b) {
            return b.id == f[0].item_id
        }),
        k = 0 < g.length ? parseInt(g[0].count) : 0,
        0 < g.length && k >= f[0].count && (0 < Mods.Newmarket.submitHolder.length && setTimeout(function() {
            var b = Mods.Newmarket.submitHolder;
            0 != b.length && Socket.send("market_make_new_offer", {
                type: b[0].type,
                item_id: b[0].item_id,
                to_player: null != b[0].to_player ? b[0].to_player : "",
                price: b[0].price,
                count: b[0].count,
                target_id: chest_npc.id
            })
        }, 100),
        Mods.Newmarket.submitHolder[0].timer += 1),
        f[0].id && Timers.set("resubmit", function() {
            Market.client_transactions()
        }, 2E3 * Mods.Newmarket.submitHolder[0].timer + 1500)))
    }
    ;
    Market.client_update_new_offer_item_change = function() {
        if (1 == getElem("market_new_offer_search_type").selectedIndex) {
            var b = document.getElementById("market_new_offer_items_item");
            b.options[b.selectedIndex].setAttribute("data-count", "50000")
        }
        Mods.Newmarket.old_client_update_new_offer_item_change()
    }
    ;
    Mods.Newmarket.max_lines = function() {
        return 2 + players[0].params.market_offers / 5 * 2
    }
    ;
    (function() {
        createElem("div", "options_game", {
            innerHTML: "<span class='wide_link pointer' id='settings_tradechannel' onclick='Mods.Newmarket.Tradetoggle();'>Trade Chat: join automatically</span>"
        });
        Mods.Newmarket.Tradetoggle();
        channel_names.unshift("$$");
        0 == Mods.Newmarket.tradechatmode && Contacts.add_channel("$$");
        getElem("market").style.overflowY = "";
        getElem("market_search_results").style.overflowY = "auto";
        getElem("market_search_results").style.maxHeight = "230px";
        var b = getElem("market_search_max_price").parentElement;
        b.getElementsByClassName("market_select pointer")[0].onclick = function() {
            Market.client_search();
            getElem("market_search_results").scrollTop = 0
        }
        ;
        var e = document.createElement("span");
        e.style.verticalAlign = "middle";
        e.style.fontSize = "10px";
        e.innerHTML = "<input type='checkbox' id='chk_enable_mktpopup' onclick='Mods.Newmarket.togglepopup();'> Popup";
        b.insertBefore(e, getElem("market_search_item").nextSibling);
        getElem("chk_enable_mktpopup").checked = !Mods.Newmarket.popup;
        e = document.createElement("span");
        e.innerHTML = "<button onclick='Mods.Newmarket.next();' class='market_select pointer'>Next &gt;&gt;</button>";
        b.appendChild(e);
        market_client_new_offer_template = Handlebars.compile("<table style='text-align: left;border: 1px #666666 solid;width: 100%;margin: 0px;margin-top: 20px;' class='table'><tbody><tr class='offer_line'><td>Type</td><td><select id='market_new_offer_search_type' onchange='Market.client_update_new_offer_items();' class='market_select'><option value='0'>Sell</option><option value='1'>Buy</option></select></td></tr><tr class='offer_line even'><td style='width: 96px;'>Item</td><td id='market_new_offer_items'></td></tr><tr class='offer_line'><td>To</td><td><input type='text' class='market_select' placeholder='Everybody' id='market_offer_player' list='player_datalist'/></td></tr><tr class='offer_line even'><td>Price</td><td><input type='number' id='market_new_offer_price' onchange='Market.client_new_offer_update_total_cost();' class='market_select'/></td></tr><tr class='offer_line'><td>Amount</td><td><input id='market_new_offer_amount' type='number' autocomplete='off' style='width:85px;' value='1' class='market_select' onchange='Market.client_new_offer_update_total_cost();'> of <span id='market_new_offer_count'>0</span> <button onclick='javascript:Mods.Newmarket.MaxQuantity()' class='market_select pointer' style='margin: 0px;font-weight: bold;'>Max</button></td></tr><tr class='offer_line even'><td>Total cost</td><td><b id='market_new_offer_total_cost'>0</b></td></tr><tr class='offer_line'><td></td><td><button onclick='javascript:Market.client_make_offer()' class='market_select pointer' style='margin: 0px;font-weight: bold;'>Make offer</button></td></tr></tbody></table><span>* Each offer lasts 24 hours. You can have {{market_offers}} active offers.{{#can_upgrade_market_offers}}<br/><button class='market_select pointer' onclick='Market.upgrade_offers_dialog();'>Upgrade</button>{{/can_upgrade_market_offers}}</span><div style='position: absolute;bottom: 2px;right: 4px;'>You have <span id='market_new_offer_player_coins'></span> coins</div>");
        market_client_search_results_template = Handlebars.compile("<table class='table scrolling_allowed'><tbody class='scrolling_allowed'><tr class='scrolling_allowed'><th>Item</th><th>Count</th><th>Price</th><th>User</th></tr>{{#each results}}<tr class='{{this.classes}} scrolling_allowed {{#if this.to_player}}green{{/if}}' onclick='Market.client_open_offer({{this.id}})' onmouseenter='Mods.Newmarket.details({{this.id}})' onmouseleave='Mods.Newmarket.hidedetails()'>  <td item_id='{{this.item_id}}' class='scrolling_allowed'>{{item_name this.item_id}}</td>  <td  class='scrolling_allowed'>{{this.count}}</td>  <td class='scrolling_allowed'>{{item_price this.price}}</td>  <td class='scrolling_allowed'>{{this.player}}</td></tr>{{/each}}</tbody></table>");
        market_client_open_offer_template = Handlebars.compile("<table style='text-align: left;border: 1px #666666 solid;width: 100%;margin: 0px;margin-top: 20px;' class='table'><tbody><tr class='offer_line'><td style='width: 96px;'>Item</td><td><span style='vertical-align: bottom;margin-right: 4px;padding-bottom: -26px;line-height: 32px;'>{{item_name this.item_id}}</span><div style='{{item_image this.item_id}}width: 32px;height: 32px;display: inline-block;margin: 0px;padding: 0px;'>&nbsp;</div></td></tr><tr class='offer_line even'><td>About</td><td>{{item_stats this.item_id}}</td></tr><tr class='offer_line'><td>Dealer</td><td>{{this.player}}</td></tr><tr class='offer_line even'><td>Price</td><td>{{item_price this.price}}</td></tr><tr class='offer_line'><td>Amount</td><td><input id='market_offer_amount' type='number' autocomplete='off' style='width:85px;' value='1' class='market_select' onchange='Market.client_update_total_cost({{this.id}});'> of {{this.count}} <button onclick='javascript:Mods.Newmarket.MaxQuantity({{this.id}})' class='market_select pointer' style='margin: 0px;font-weight: bold;'>Max</button> {{#if this.type}}{{{mod_quantity this.id}}}{{/if}}</td></tr><tr class='offer_line even'><td>Total cost</td><td><b id='market_total_cost'>{{item_price this.price}}</b></td></tr><tr class='offer_line'><td></td><td><button onclick='javascript:Market.client_accept_offer({{this.id}})' class='market_select pointer' style='margin: 0px;font-weight: bold;'>{{#if this.type}}Sell{{else}}Buy{{/if}}</button></td></tr></tbody></table><div style='position: absolute;bottom: 2px;right: 4px;'>You have <span id='market_offer_player_coins'></span> coins</div>");
        market_announce_template = Handlebars.compile("<div style='border: 1px solid #666; padding: 5px; margin-bottom: 5px; background-color: #111;'><span style='color: #FF0; font-weight: bold; padding-top: 3px; line-height: 20px;'>Announces: <span id='announce_queued_amount' style='color: #FFF;'>0</span></span><button class='market_select pointer scrolling_allowed' onclick='Mods.Newmarket.transaction_announce(&apos;announce&apos;)' style='font-size: 0.7em; float: right; margin-bottom: 8px;'>Announce!</button><button class='market_select pointer scrolling_allowed' onclick='Mods.Newmarket.transaction_announce(&apos;remove&apos;)' style='font-size: 0.7em; float: right;'>Cancel</button><button class='market_select pointer scrolling_allowed' onclick='Mods.Newmarket.transaction_announce(&apos;select&apos;)' style='font-size: 0.7em; float: right;'>Select All</button><button id='announce_expand' class='market_select pointer scrolling_allowed' onclick='Mods.Newmarket.transaction_announce(&apos;expand&apos;)' style='font-size: 0.7em; float: right;'>Expand</button><table id='announce_queued_list' class='table scrolling_allowed hidden' style='text-align: center; min-width: 100%; max-width: 100%'><tbody><tr><th style='text-align: left; padding-bottom: 5px;' colspan='2'>Queued Item</th><th>To</th><th style='text-align: right; padding-right: 3px;'>Remove</th></tr>{{#each results}}<tr style='padding-top: 2px;'><td style='padding-right: 2px;'>{{#if this.type}}<div style='color: #0F0; padding-bottom: 8px;'>[B]</div>{{else}}<div style='color: #0F0; padding-bottom: 8px'>[S]</div>{{/if}}</td><td style='text-align: left; padding-top: 2px'>{{this.name}}</td><td style='padding-top: 2px;'>{{#if this.to}}{{this.to}}{{else}}<span style='color: #F2A2F2;'>$$</span>{{/if}}</td><td style='padding-left: 8px;'><button class='market_select pointer scrolling_allowed' onclick='Mods.Newmarket.transaction_remove_announce({{this.id}})' style='font-size: 0.7em; float: right;'>Remove</button></td></tr>{{/each}}</tbody></table></div>");
        market_client_transaction_offers_template = Handlebars.compile("<div id='announce_list' class='hidden'>&nbsp;</div>Offers<table class='table scrolling_allowed'><tbody><tr><th style='width:12%; text-align:center'>Type</th><th style='width:15%; text-align:center;'>Item</th><th style='width:4%'>#</th><th style='width:19%;'>Price</th><th style='text-align:center; width:18%; padding-left:9px;'>To</th><th style='width:21%; text-align:left; padding-left:9px; position:relative;'>Select<select id='market_drop_default' class='market_select scrolling allowed' style='width:70px; position:absolute; top:-68%; right:-51%; font-weight:bold;' onchange='Mods.Newmarket.transaction_select()'> <option class='scrolling_allowed' value='delete'{{select_states 'default' 'delete'}}>Delete</option><option class='scrolling_allowed' value='resubmit'{{select_states 'default' 'resubmit'}}>Resubmit</option><option class='scrolling_allowed' value='announce'{{select_states 'default' 'announce'}}>Announce</option><option class='scrolling_allowed' value='edit'{{select_states 'default' 'edit'}}>Edit</option></select></th><th style='width:10%;'></th></tr>{{#each results}}<tr class='scrolling_allowed {{this.classes}} {{#if this.available}}green{{else}}red{{/if}}' {{#if this.available}}{{#if this.count}}{{else}}style='color:yellow'{{/if}}{{/if}}><td class='scrolling_allowed' style='vertical-align:middle; text-align:center;'>{{#if this.type}}Buy{{else}}Sell{{/if}}</td><td class='scrolling_allowed' style='vertical-align:middle; position:relative;'><div title='{{item_name this.item_id}}' item_id='{{this.item_id}}' style='{{item_image this.item_id}} width:32px; height:32px; display:inline-block; margin:0px; margin-left:14px; padding:0px; float:left; '></div></td><td class='scrolling_allowed' style='vertical-align:middle'>{{this.count}}</td><td class='scrolling_allowed' style='vertical-align:middle;'>{{item_price this.price}}</td><td class='scrolling_allowed' style='vertical-align:middle; text-align:left; padding-left:12px;'>{{#if this.to_player}}{{this.to_player}}{{else}}Everyone{{/if}}</td><td class='scrolling_allowed' style='text-align:left; position:relative;'><select id='market_drop_{{this.id}}' class='market_select scrolling allowed' style='margin:0px; margin-left:9px; width:70px; position: absolute; top: 25%;'><option class='scrolling_allowed' value='delete'{{select_states this.id 'delete'}}>Delete</option>{{#if this.count}}<option class='scrolling_allowed' value='resubmit'{{select_states this.id 'resubmit'}}>Resubmit</option>{{#if this.available}}<option class='scrolling_allowed' value='announce'{{select_states this.id 'announce'}}>Announce</option>{{/if}}{{/if}}<option class='scrolling_allowed' value='edit'{{select_states this.id 'edit'}}>Edit</option></select></td><td class='scrolling_allowed' style='text-align:center; position:relative'><button class='market_select pointer scrolling_allowed' onclick='Mods.Newmarket.transaction_click({{this.id}})' style='position: absolute; left: 6px; top: 25%;'>Go</button></td></tr>{{/each}}</tbody></table>")
    })();
    Mods.timestamp("newmarket")
}
;
Load.tabs = function() {
    modOptions.tabs.time = timestamp();
    Mods.Tabs.lockScroll = function() {
        var b = getElem("chat");
        0 < b.scrollTop && (b.scrollTop = b.scrollHeight - b.offsetHeight - Mods.Tabs.chatMovement)
    }
    ;
    Mods.Tabs.dragEvents = function(b) {
        if (-1 < Mods.Tabs.chatMovement || "mousedown" == b.type) {
            var e = getElem("chat");
            switch (b.type) {
            case "drop":
                Mods.Tabs.chatMovement = -1;
            case "dragenter":
            case "dragover":
                b.stopPropagation();
                b.preventDefault();
                break;
            case "scroll":
                Mods.Tabs.lockScroll();
            case "mousedown":
                Mods.Tabs.chatMovement = Math.max(0, e.scrollHeight - (e.offsetHeight + e.scrollTop));
                break;
            case "mouseup":
                Mods.Tabs.chatMovement = -1
            }
        }
    }
    ;
    Mods.Tabs.resize = function(b) {
        var e = getElem("chat")
          , f = getElem("tabs")
          , g = getElem("chat_resize")
          , k = getAbsoluteHeight(my_text);
        Mods.isLoaded("Chatmd") && (hasClass(getElem("mod_text"), "hidden") || (k = getAbsoluteHeight(mod_text)));
        var k = GAME_STATE == GAME_STATES.CHAT ? k + 25 * current_ratio_y : 25 * current_ratio_y
          , m = getAbsoluteHeight(tabs) || 0;
        e.style.bottom = k + "px";
        e.style.maxHeight = Math.round(.8 * last_updated.set_canvas_size_new_height - 2 * m) + "px";
        e.style.height = Math.round(last_updated.set_canvas_size_new_height * Mods.Tabs.chat_size_percent - parseFloat(e.style.bottom)) + "px";
        "undefined" != typeof b && (e.scrollTop += b);
        b = Math.round(getAbsoluteHeight(chat) + k);
        e = Math.round(parseFloat(e.style.maxHeight) + k);
        void 0 != g && (g.style.bottom = Math.min(b, e) + "px ");
        void 0 != f && (f.style.bottom = Math.min(b, e) + parseFloat(g.style.height) + "px")
    }
    ;
    Mods.Tabs.add = function(b) {
        for (var e = getElem("tabs"), f = document.createElement("li"), g = e.childNodes.length - 1; getElem("tabs_" + g); )
            g++;
        f.id = "tabs_" + g;
        f.innerHTML = "" + b + "";
        f.onclick = function() {
            Mods.Tabs.showTab(this);
            Mods.isLoaded("Chatmd") && Mods.Chatmd.chatCommand(!1)
        }
        ;
        f.oncontextmenu = function(b) {
            Mods.Tabs.rclick(b)
        }
        ;
        b = getElem("tabs_add");
        e.insertBefore(f, b);
        Mods.Tabs.wwTabContent.push({
            id: "tabs_" + g,
            history: []
        });
        e.childNodes.length > Mods.Tabs.wwMaxTabs && (getElem("tabs_add").style.display = "none");
        return f.id
    }
    ;
    Mods.Tabs.rclick = function(b) {
        b = b.target;
        if (null != b) {
            var e = b.innerText
              , f = elementXY(b.id)
              , g = getElem("action_menu");
            addClass(g, "hidden");
            g.style.left = f.left + 20 + "px";
            g.innerHTML = "<span class='line' onclick='Mods.Tabs.showTab(getElem(\"" + b.id + '"));ChatSystem.filters();addClass(getElem("action_menu"),"hidden");\'>Edit Tab Filters</span>';
            g.innerHTML += "<span class='line' onclick='Mods.Tabs.rename(\"" + b.id + '");addClass(getElem("action_menu"),"hidden");\'>Rename<span class=\'item\'>' + e + "</span></span>";
            "tabs_default" != b.id && (g.innerHTML += "<span class='line' onclick='Mods.Tabs.remove(\"" + b.id + '");addClass(getElem("action_menu"),"hidden");\'>Remove<span class=\'item\'>' + e + "</span></span>");
            if (0 == Mods.Tabs.wwCurrentTabs[Mods.Tabs.findWithAttr(Mods.Tabs.wwCurrentTabs, "id", b.id)].filter_playerchat) {
                var e = Mods.Tabs.wwCurrentTabs[Mods.Tabs.findWithAttr(Mods.Tabs.wwCurrentTabs, "id", b.id)].channels, k;
                for (k in Contacts.channels)
                    g.innerHTML = void 0 == e[k] || 1 == e[k] ? g.innerHTML + ("<span class='line' onclick='Mods.Tabs.switchtabchannel(\"" + b.id + '", "' + k + '", false);addClass(getElem("action_menu"),"hidden");\'>Hide Channel <span class=\'item\'>' + k + "</span></span>") : g.innerHTML + ("<span class='line' onclick='Mods.Tabs.switchtabchannel(\"" + b.id + '", "' + k + '", true);addClass(getElem("action_menu"),"hidden");\'>Show Channel <span class=\'item\'>' + k + "</span></span>")
            }
            g.style.top = f.top - 22 * g.childElementCount + "px";
            0 < g.innerHTML.length && removeClass(g, "hidden")
        }
    }
    ;
    Mods.Tabs.switchtabchannel = function(b, e, f) {
        Mods.Tabs.wwCurrentTabs[Mods.Tabs.findWithAttr(Mods.Tabs.wwCurrentTabs, "id", b)].channels[e] = f;
        localStorage.CurrentTabs = JSON.stringify(Mods.Tabs.wwCurrentTabs)
    }
    ;
    Mods.Tabs.rename = function(b) {
        var e = getElem(b);
        void 0 != e && Popup.input_prompt("Please enter new chat tab name:", function(b) {
            b && "" != b && (Mods.Tabs.wwCurrentTabs[Mods.Tabs.findWithAttr(Mods.Tabs.wwCurrentTabs, "name", e.innerText)].name = b,
            e.innerText = b,
            localStorage.CurrentTabs = JSON.stringify(Mods.Tabs.wwCurrentTabs))
        })
    }
    ;
    Mods.Tabs.remove = function(b) {
        var e = getElem("tabs")
          , f = getElem(b);
        if (void 0 != f) {
            var g = Mods.Tabs.findWithAttr(Mods.Tabs.wwCurrentTabs, "id", b);
            "undefined" != typeof g && (Mods.Tabs.wwactiveTab == b && (b = getElem("tabs_default"),
            Mods.Tabs.showTab(b),
            Mods.Tabs.wwactiveTab = "tabs_default"),
            Mods.Tabs.wwCurrentTabs.splice(g, 1),
            localStorage.CurrentTabs = JSON.stringify(Mods.Tabs.wwCurrentTabs),
            f.parentNode.removeChild(f));
            e.childNodes.length > Mods.Tabs.wwMaxTabs ? getElem("tabs_add").style.display = "none" : getElem("tabs_add").style.display = ""
        }
    }
    ;
    Mods.Tabs.findWithAttr = function(b, e, f) {
        for (var g = 0; g < b.length; g += 1)
            if (b[g][e] === f)
                return g
    }
    ;
    Mods.Tabs.chatrefill = function(b) {
        chat_history = b.slice(0);
        getElem("chat").innerHTML = "";
        resyncRequired = 100;
        Chat.resync()
    }
    ;
    Mods.Tabs.Warning = function(b) {
        getElem(b).className = "warning";
        setTimeout(function() {
            "selected" != getElem(b).className && (getElem(b).className = "")
        }, 350);
        setTimeout(function() {
            "selected" != getElem(b).className && (getElem(b).className = "warning")
        }, 700)
    }
    ;
    Mods.Tabs.SaveCurrent = function() {
        var b = Mods.Tabs.wwCurrentTabs[Mods.Tabs.findWithAttr(Mods.Tabs.wwCurrentTabs, "id", Mods.Tabs.wwactiveTab)];
        b.filter_skillattempts = chat_filters.attempt || !1;
        b.filter_skillfails = chat_filters.fails || !1;
        b.filter_playerchat = chat_filters.chat || !1;
        b.filter_whispering = chat_filters.whisper || !1;
        b.filter_joinleave = chat_filters.join_leave || !1;
        b.filter_loot = chat_filters.loot || !1;
        b.filter_magic = chat_filters.magic || !1;
        b.filter_archery = chat_filters.archery || !1;
        b.filter_spam = chat_filters.spam || !1;
        b.filter_coloredchannels = chat_filters.color || !1;
        b.filter_coloredonly = getElem("filter_channel_only") ? getElem("filter_channel_only").checked : !1;
        b.filter_highlightfriends = getElem("filter_highlight_friends") ? getElem("filter_highlight_friends").checked : !1;
        b.filter_chatmoderator = chat_filters.modcolor || !1;
        b.filter_timestamps = chat_filters.chattimestamp || !1;
        b.filter_urlfilter = chat_filters.urlfilter || !1;
        b.activechannel = "" != getElem("current_channel").value ? getElem("current_channel").value : "EN";
        localStorage.CurrentTabs = JSON.stringify(Mods.Tabs.wwCurrentTabs)
    }
    ;
    Mods.Tabs.LoadCurrent = function() {
        var b = Mods.Tabs.wwCurrentTabs[Mods.Tabs.findWithAttr(Mods.Tabs.wwCurrentTabs, "id", Mods.Tabs.wwactiveTab)];
        chat_filters.attempt = b.filter_skillattempts || !1;
        chat_filters.fails = b.filter_skillfails || !1;
        chat_filters.chat = b.filter_playerchat || !1;
        chat_filters.whisper = b.filter_whispering || !1;
        chat_filters.join_leave = b.filter_joinleave || !1;
        chat_filters.loot = b.filter_loot || !1;
        chat_filters.magic = b.filter_magic || !1;
        chat_filters.archery = b.filter_archery || !1;
        chat_filters.spam = b.filter_spam || !1;
        chat_filters.color = b.filter_coloredchannels || !1;
        getElem("filter_channel_only") && (getElem("filter_channel_only").checked = b.filter_coloredonly);
        getElem("filter_highlight_friends") && (getElem("filter_highlight_friends").checked = b.filter_highlightfriends);
        chat_filters.modcolor = b.filter_chatmoderator || !1;
        chat_filters.chattimestamp = b.filter_timestamps || !1;
        chat_filters.urlfilter = b.filter_urlfilter || !1;
        b.activechannel && Contacts.channels[b.activechannel] && (getElem("current_channel").value = b.activechannel)
    }
    ;
    Mods.Tabs.showTab = function(b) {
        var e = b.id;
        getElem("filters_form").style.display = "none";
        Mods.Tabs.SaveCurrent();
        if (void 0 != getElem("tabs") && Mods.Tabs.wwactiveTab != b.id) {
            b = getElem("tabs").childNodes;
            for (var f in b)
                b[f].id == e ? (b[f].className = "selected",
                Mods.Tabs.wwactiveTab = e,
                Mods.Tabs.LoadCurrent(),
                Mods.Tabs.chatrefill(Mods.Tabs.wwTabContent[Mods.Tabs.findWithAttr(Mods.Tabs.wwTabContent, "id", e)].history)) : "selected" == b[f].className && (b[f].className = "")
        }
    }
    ;
    (function() {
        var b = getElem("wrapper")
          , e = getElem("chat")
          , f = document.createElement("ul");
        f.id = "tabs";
        Mods.Tabs.wwactiveTab = "tabs_default";
        try {
            Mods.Tabs.wwCurrentTabs = void 0 != localStorage.CurrentTabs ? JSON.parse(localStorage.CurrentTabs) : [];
            if (1 > Mods.Tabs.wwCurrentTabs.length || "undefined" == typeof Mods.Tabs.wwCurrentTabs[Mods.Tabs.findWithAttr(Mods.Tabs.wwCurrentTabs, "id", "tabs_default")])
                Mods.Tabs.wwCurrentTabs.unshift({
                    id: "tabs_default",
                    name: "Default",
                    activechannel: "EN",
                    channels: JSON.parse(JSON.stringify(Contacts.channels)),
                    filter_skillattempts: chat_filters.attempt || !1,
                    filter_skillfails: chat_filters.fails || !1,
                    filter_playerchat: chat_filters.chat || !1,
                    filter_whispering: chat_filters.whisper || !1,
                    filter_joinleave: chat_filters.join_leave || !1,
                    filter_loot: chat_filters.loot || !1,
                    filter_magic: chat_filters.magic || !1,
                    filter_archery: chat_filters.archery || !1,
                    filter_spam: chat_filters.spam || !1,
                    filter_coloredchannels: chat_filters.color || !1,
                    filter_coloredonly: getElem("filter_channel_only") ? getElem("filter_channel_only").checked : !1,
                    filter_highlightfriends: getElem("filter_highlight_friends") ? getElem("filter_highlight_friends").checked : !1,
                    filter_chatmoderator: chat_filters.modcolor || !1,
                    filter_timestamps: chat_filters.chattimestamp || !1,
                    filter_urlfilter: chat_filters.urlfilter || !1
                }),
                localStorage.CurrentTabs = JSON.stringify(Mods.Tabs.wwCurrentTabs);
            if (0 < Mods.Tabs.wwCurrentTabs.length)
                for (i in Mods.Tabs.wwCurrentTabs) {
                    var g = document.createElement("li");
                    g.id = Mods.Tabs.wwCurrentTabs[i].id;
                    if (Mods.Tabs.wwCurrentTabs[i].id == Mods.Tabs.wwactiveTab) {
                        g.style.selected = "true";
                        g.className = "selected";
                        chat_filters.attempt = Mods.Tabs.wwCurrentTabs[i].filter_skillattempts || !1;
                        chat_filters.fails = Mods.Tabs.wwCurrentTabs[i].filter_skillfails || !1;
                        chat_filters.chat = Mods.Tabs.wwCurrentTabs[i].filter_playerchat || !1;
                        chat_filters.whisper = Mods.Tabs.wwCurrentTabs[i].filter_whispering || !1;
                        chat_filters.join_leave = Mods.Tabs.wwCurrentTabs[i].filter_joinleave || !1;
                        chat_filters.loot = Mods.Tabs.wwCurrentTabs[i].filter_loot || !1;
                        chat_filters.magic = Mods.Tabs.wwCurrentTabs[i].filter_magic || !1;
                        chat_filters.archery = Mods.Tabs.wwCurrentTabs[i].filter_archery || !1;
                        chat_filters.spam = Mods.Tabs.wwCurrentTabs[i].filter_spam || !1;
                        chat_filters.color = Mods.Tabs.wwCurrentTabs[i].filter_coloredchannels || !1;
                        getElem("filter_channel_only") && (getElem("filter_channel_only").checked = Mods.Tabs.wwCurrentTabs[i].filter_coloredonly);
                        getElem("filter_highlight_friends") && (getElem("filter_highlight_friends").checked = Mods.Tabs.wwCurrentTabs[i].filter_highlightfriends);
                        chat_filters.modcolor = Mods.Tabs.wwCurrentTabs[i].filter_chatmoderator || !1;
                        chat_filters.chattimestamp = Mods.Tabs.wwCurrentTabs[i].filter_timestamps || !1;
                        chat_filters.urlfilter = Mods.Tabs.wwCurrentTabs[i].filter_urlfilter || !1;
                        var k = Mods.Tabs.wwCurrentTabs[Mods.Tabs.findWithAttr(Mods.Tabs.wwCurrentTabs, "id", Mods.Tabs.wwactiveTab)];
                        k.activechannel && (getElem("current_channel").value = k.activechannel)
                    }
                    g.innerHTML = Mods.Tabs.wwCurrentTabs[i].name;
                    g.onclick = function() {
                        Mods.Tabs.showTab(this);
                        Mods.isLoaded("Chatmd") && Mods.Chatmd.chatCommand(!1)
                    }
                    ;
                    g.oncontextmenu = function(b) {
                        Mods.Tabs.rclick(b)
                    }
                    ;
                    f.appendChild(g);
                    Mods.Tabs.wwTabContent.push({
                        id: Mods.Tabs.wwCurrentTabs[i].id,
                        history: Mods.Tabs.wwCurrentTabs[i].id == Mods.Tabs.wwactiveTab ? chat_history.slice(0) : []
                    })
                }
        } catch (m) {
            return !1
        }
        g = document.createElement("li");
        g.id = "tabs_add";
        g.innerHTML = "[+]";
        g.onclick = function(b) {
            Mods.Tabs.wwCurrentTabs.length < Mods.Tabs.wwMaxTabs && Popup.input_prompt("Please enter new chat tab name:", function(b) {
                if (b && "" != b) {
                    var e = Mods.Tabs.add(b)
                      , f = {};
                    f.name = b;
                    f.channels = JSON.parse(JSON.stringify(Contacts.channels));
                    f.id = e;
                    f.filter_skillattempts = chat_filters.attempt || !1;
                    f.filter_skillfails = chat_filters.fails || !1;
                    f.filter_playerchat = chat_filters.chat || !1;
                    f.filter_whispering = chat_filters.whisper || !1;
                    f.filter_joinleave = chat_filters.join_leave || !1;
                    f.filter_loot = chat_filters.loot || !1;
                    f.filter_magic = chat_filters.magic || !1;
                    f.filter_archery = chat_filters.archery || !1;
                    f.filter_spam = chat_filters.spam || !1;
                    f.filter_coloredchannels = chat_filters.color || !1;
                    f.filter_coloredonly = getElem("filter_channel_only") ? getElem("filter_channel_only").checked : !1;
                    f.filter_highlightfriends = getElem("filter_highlight_friends") ? getElem("filter_highlight_friends").checked : !1;
                    f.filter_chatmoderator = chat_filters.modcolor || !1;
                    f.filter_timestamps = chat_filters.chattimestamp || !1;
                    f.filter_urlfilter = chat_filters.urlfilter || !1;
                    f.activechannel = "" != getElem("current_channel").value ? getElem("current_channel").value : "EN";
                    Mods.Tabs.wwCurrentTabs.push(f)
                }
                localStorage.CurrentTabs = JSON.stringify(Mods.Tabs.wwCurrentTabs)
            })
        }
        ;
        f.appendChild(g);
        b.appendChild(f);
        f.childNodes.length > Mods.Tabs.wwMaxTabs && (getElem("tabs_add").style.display = "none");
        f = getElem("chat_resize");
        void 0 == f && (f = document.createElement("div"),
        f.id = "chat_resize",
        f.style.height = "4px",
        f.style.width = "99.5%",
        f.style.left = "5px",
        f.style.position = "absolute",
        f.style.display = "block",
        f.style.cursor = "n-resize",
        f.style.zIndex = "100",
        f.draggable = "true",
        addEvent(f, "touchmove", function(b) {
            100 < timestamp() - Mods.Tabs.chat_resize_timestamp && (b = (last_updated.set_canvas_size_new_height - b.changedTouches[0].pageY) / last_updated.set_canvas_size_new_height,
            1 > b && 0 < b && (Mods.Tabs.chat_size_percent = b),
            Mods.setCanvasSize(),
            Mods.Tabs.chat_resize_timestamp = timestamp())
        }, !1),
        addEvent(f, "mousedown", function(b) {
            Mods.Tabs.dragEvents(b)
        }),
        addEvent(f, "mouseup", function(b) {
            Mods.Tabs.dragEvents(b)
        }),
        addEvent(document.documentElement, "drop", function(b) {
            Mods.Tabs.dragEvents(b)
        }),
        addEvent(document.documentElement, "mouseup", function(b) {
            Mods.Tabs.dragEvents(b)
        }),
        addEvent(f, "drag", function(b) {
            50 < timestamp() - Mods.Tabs.chat_resize_timestamp && (b = (last_updated.set_canvas_size_new_height - b.pageY) / last_updated.set_canvas_size_new_height,
            1 > b && 0 < b && (Mods.Tabs.chat_size_percent = b),
            Mods.setCanvasSize(),
            Mods.Tabs.lockScroll(),
            Mods.Tabs.chat_resize_timestamp = timestamp())
        }),
        getElem("wrapper").appendChild(f));
        addEvent(b, "dragenter", function(b) {
            Mods.Tabs.dragEvents(b)
        });
        addEvent(b, "dragover", function(b) {
            Mods.Tabs.dragEvents(b)
        });
        addEvent(e, "scroll", function(b) {
            Mods.Tabs.dragEvents(b)
        });
        return !0
    })() && (Chat.set_visible = function() {
        if (0 == Mods.Tabs.set_visible())
            return !1;
        Mods.isLoaded("Tabs") && (getElem("tabs").style.visibility = "visible",
        getElem("chat_resize").style.visibility = "visible",
        Mods.Tabs.resize());
        return !0
    }
    ,
    Chat.remove_line = function(b, e) {
        var f = document.getElementById("chat_" + b);
        if (f) {
            var g = /(.*?)&gt;/g.exec(f.innerHTML)[0];
            f.innerHTML = g + " &lt;Message removed by " + e + "&gt;"
        }
        for (g in chat_history)
            if (chat_history[g] && chat_history[g].id && chat_history[g].id == b) {
                chat_history[g].text = "<Message removed by " + e + ">";
                break
            }
        for (tab in Mods.Tabs.wwTabContent)
            for (g in Mods.Tabs.wwTabContent[tab].history)
                Mods.Tabs.wwTabContent[tab].history[g] && Mods.Tabs.wwTabContent[tab].history[g].id && Mods.Tabs.wwTabContent[tab].history[g].id == b && (Mods.Tabs.wwTabContent[tab].history[g].text = "<Message removed by " + e + ">")
    }
    ,
    Mods.timestamp("tabs"))
}
;
Load.farming = function() {
    modOptions.farming.time = timestamp();
    Mods.Farming.loadDivs = function() {
        null == getElem("mods_farming_holder") && (createElem("div", wrapper, {
            id: "mods_farming_holder",
            className: "menu",
            style: "position: absolute; display: none; z-index: 999;",
            innerHTML: Mods.Farming.farming_queue_template()
        }),
        createElem("div", wrapper, {
            id: "mods_farming_options",
            className: "menu",
            style: "position: absolute; display: none; z-index: 999;",
            innerHTML: Mods.Farming.farming_queue_option_template(),
            onclick: "Mods.Farming.queueOptions();"
        }))
    }
    ;
    Mods.Farming.loadDivs();
    Mods.Farming.lastCtrlTime = 0;
    Mods.Farming.eventListener = {
        keys: {
            keyup: [KEY_ACTION.CTRL],
            keydown: [KEY_ACTION.CTRL, 32]
        },
        fn: function(b, e, f) {
            300 === players[0].map && players[0].name == players[0].params.island && ("keyup" === b && f === KEY_ACTION.CTRL && 50 > timestamp() - Mods.Farming.lastCtrlTime && Mods.Farming.ctrlHeld(!1),
            "keydown" === b && (f === KEY_ACTION.CTRL && (200 < timestamp() - Mods.Farming.lastCtrlTime ? Mods.Farming.ctrlHeld(!Mods.Farming.ctrlPressed) : Mods.Farming.ctrlHeld(!0),
            Mods.Farming.lastCtrlTime = timestamp()),
            300 == players[0].map && 32 === e && GAME_STATE != GAME_STATES.CHAT && (!1 === Mods.Farming.queuePaused ? Mods.Farming.pauseQueue(!1, !1, !0) : Mods.Farming.pauseQueue(!1, !1, !1))))
        }
    };
    Mods.Farming.lastMove = 0;
    Mods.Farming.farmingActions = {
        332: {
            slot: 4,
            name: "Rake"
        },
        333: {
            slot: 3,
            name: "Seed"
        },
        water: {
            slot: 3,
            name: "Water"
        },
        revive: {
            slot: 3,
            name: "Revive"
        },
        harvest: {
            slot: 3,
            name: "Harvest"
        }
    };
    moveInPath = function(b) {
        if (!b.path || b.path && 0 === b.path.length)
            return !1;
        b.me && 300 == players[0].map && Mods.Farming.options.mods_farming_opt_stop && (1 === Mods.Farming.queuePaused || Mods.Farming.ctrlPressed) ? (players[0].path = [],
        selected = selected_object = {
            i: null ,
            j: null
        }) : Mods.Farming.oldMoveInPath(b)
    }
    ;
    Mods.Farming.queueOptions = function(b) {
        if (!0 === b) {
            var e = getElem("mods_farming_options")
              , f = e.style.display;
            e.style.display = "none" == f ? "block" : "none"
        }
        var g = {
            mods_farming_opt_stop: !1,
            mods_farming_opt_save: !0,
            mods_farming_opt_equipped: !0
        }, k = Mods.Farming.options, m;
        for (m in g)
            e = getElem(m),
            void 0 === k[m] ? (f = g[m],
            k[m] = f,
            e.checked = f) : !1 === b ? e.checked = k[m] : (f = e.checked,
            k[m] = f);
        localStorage.farming_options = JSON.stringify(k)
    }
    ;
    Mods.Farming.queueOptions(!1);
    Mods.Farming.findExtendedPath = function(b) {
        if ("object" === typeof b && void 0 != b.i && void 0 != b.j)
            b = map_increase,
            map_increase = 200,
            players[0].path = findPathFromTo(players[0], selected_object, players[0]),
            map_increase = b;
        else
            return []
    }
    ;
    Mods.Farming.ctrlHeld = function(b) {
        Mods.Farming.ctrlPressed = !0 === b ? !0 : !1;
        b = !0 === b ? 1 : !0;
        Mods.Farming.actionState();
        Mods.Farming.pauseQueue(null , !0, b)
    }
    ;
    Mods.Farming.setCanvasSize = function() {
        getElem("mods_farming_holder", {
            style: {
                display: 300 == players[0].map && players[0].name == players[0].params.island ? "block" : "none",
                left: 6 + ("block" == getElem("magic_slots").style.display || "block" == getElem("quiver").style.display || "" == getElem("magic_slots").style.left ? 38 : 0) + "px",
                top: Math.ceil(105 * current_ratio_y) + "px",
                width: "145px",
                fontSize: ".7em"
            }
        });
        getElem("mods_farming_queue").style.height = Math.round(120 * current_ratio_y) + "px";
        getElem("mods_farming_options", {
            style: {
                display: 300 != players[0].map || players[0].name != players[0].params.island ? "none" : getElem("mods_farming_options").style.display,
                left: 18 + parseInt(getElem("mods_farming_holder").style.width.replace("px", "")) + ("block" == getElem("magic_slots").style.display || "block" == getElem("quiver").style.display || "" == getElem("magic_slots").style.left ? 38 : 0) + "px",
                top: Math.ceil(105 * current_ratio_y) + "px",
                width: "145px",
                fontSize: ".7em",
                height: ""
            }
        });
        300 != players[0].map && Mods.Farming.cancelQueue()
    }
    ;
    Mods.Farming.onMapChange = function(b) {
        getElem("mods_farming_holder").style.display = 300 == b ? "block" : "none"
    }
    ;
    Mods.Farming.hideQueue = function(b, e) {
        var f = getElem("mods_farming_queue")
          , g = b || getElem("mods_farming_opt_hide");
        Mods.Farming.queueHidden || e ? (Mods.Farming.queueHidden = !1,
        f.style.display = "",
        g.innerHTML = "Hide queued window") : (Mods.Farming.queueHidden = !0,
        f.style.display = "none",
        g.innerHTML = "Show queued window")
    }
    ;
    Mods.Farming.actionState = function() {
        var b;
        b = Mods.Farming.ctrlPressed || 1 === Mods.Farming.queuePaused ? "Queuing" : !0 === Mods.Farming.queuePaused ? "Paused" : "Active";
        getElem("mods_farming_action").innerHTML = b
    }
    ;
    Mods.Farming.pauseQueue = function(b, e, f) {
        e ? Mods.Farming.ctrlPressed || Timers.set("farm_check", function(b) {
            Mods.Farming.checkQueue(0, b)
        }, Math.min(Math.max(players[0].temp.animate_until - timestamp(), 50), 500)) : Mods.Farming.ctrlPressed && Mods.Farming.ctrlHeld(!1);
        b = {
            "true": "1",
            1: "false",
            "false": "true"
        };
        Mods.Farming.queuePaused = void 0 != b[f] ? JSON.parse(b[f]) : Mods.Farming.queuePaused;
        f = getElem("farming_queue_button");
        !0 === Mods.Farming.queuePaused ? (Mods.Farming.queuePaused = !1,
        Timers.set("farm_check", function(b) {
            Mods.Farming.checkQueue(0, b)
        }, Math.min(Math.max(players[0].temp.animate_until - timestamp(), 50), 100)),
        f.innerHTML = "(queue)") : 1 === Mods.Farming.queuePaused ? (Mods.Farming.queuePaused = !0,
        f.innerHTML = "(resume)") : (Mods.Farming.queuePaused = 1,
        f.innerHTML = "(pause)",
        players[0].path = []);
        Mods.Farming.actionState()
    }
    ;
    Mods.Farming.addToQueue = function(b) {
        if (players[0].params.island !== players[0].name)
            Mods.Farming.pauseQueue(!1, !1, !0);
        else if ("object" == typeof b && void 0 != b.id) {
            var e = Mods.Farming.queue
              , f = b.b_i
              , g = b.id
              , k = b.name
              , m = b.i + "_" + b.j + "_" + f
              , n = 333 == f || 332 == f ? 1E3 : 2E3
              , p = Mods.Farming.canPerform(g, !1);
            p.action && Mods.Farming.farmingActions[p.action] && (e[m] = {
                id: m,
                obj_id: g,
                item_id: f,
                i: b.i,
                j: b.j,
                delay: n,
                action: p.action
            },
            Mods.Farming.sortedQueue.push(m),
            getElem("mods_farming_queue").innerHTML += Mods.Farming.farming_queue_action_template({
                slot: m,
                action: capitaliseFirstLetter(Mods.Farming.farmingActions[p.action].name),
                object: k,
                i: b.i,
                j: b.j
            }),
            (1 == Mods.Farming.sortedQueue.length || !Timers.running("farm_queue") || 5E3 < timer_holder.farm_queue || 0 == players[0].path.length) && Timers.set("farm_queue", function(b) {
                Mods.Farming.performQueue(0, Mods.Farming.sortedQueue[0])
            }, Math.max(players[0].temp.animate_until - timestamp(), 50)),
            getElem("mods_farming_total").innerHTML = Mods.Farming.sortedQueue.length)
        }
    }
    ;
    Mods.Farming.canPerform = function(b, e) {
        if ((null != e ? e : 1) && 0 == Mods.Farming.sortedQueue.length)
            return !1;
        var f = objects_data[b];
        if (void 0 == f)
            return !1;
        var g = f.b_i
          , k = !1;
        if (Mods.Farming.farmingActions[g] && 753 == object_base[g].params.carpentry_item_id) {
            var f = players[0].temp.inventory, m;
            for (m in f)
                if (f[m].selected && item_base[f[m].id]) {
                    var n = !1;
                    switch (g) {
                    case 332:
                        -1 < item_base[f[m].id].name.indexOf(Mods.Farming.farmingActions[g].name) && (n = !0);
                        break;
                    case 333:
                        Mods.Farming.isSeed(f[m].id) && (n = !0)
                    }
                    if (n) {
                        k = {
                            status: !0,
                            action: g
                        };
                        break
                    }
                }
            k || !1 !== Mods.Farming.options.mods_farming_opt_equipped || (k = {
                status: 1,
                action: g
            })
        } else if (g = object_base[g].params.duration)
            m = (secondstamp() - f.params.secondstamp) / 60 || g,
            f = Farming.plant_rotten(f),
            n = Inventory.get_watering_can_id(players[0]),
            m >= g ? k = f && n ? 0 < players[0].temp.water ? {
                status: !0,
                action: "revive"
            } : {
                status: 1,
                action: "revive"
            } : 40 > players[0].temp.inventory.length ? {
                status: !0,
                action: "harvest"
            } : {
                status: 1,
                action: "harvest"
            } : !f && n && (k = 0 < players[0].temp.water ? {
                status: !0,
                action: "water"
            } : {
                status: 1,
                action: "water"
            });
        return k
    }
    ;
    Mods.Farming.performQueue = function(b, e) {
        if (players[0].params.island === players[0].name) {
            300 != players[0].map && Mods.Farming.pauseQueue(!1, !1, !0);
            e = "string" == typeof e ? e : Mods.Farming.sortedQueue[0] || null ;
            var f = Mods.Farming.sortedQueue
              , g = Mods.Farming.queue
              , k = g[f[0]];
            if (!Mods.Farming.ctrlPressed && !Mods.Farming.queuePaused)
                if (f["number" == typeof b ? b : 0] != e)
                    Mods.Farming.checkQueue(0, f[0]);
                else {
                    var f = Mods.Farming.canPerform(k.obj_id)
                      , m = "boolean" != typeof f ? f.status : f;
                    "object" == typeof f && "water" == g[e].action && "harvest" == f.action && (g[e].action = "harvest");
                    void 0 == k || !0 !== m ? Mods.Farming.pauseQueue(!1, !1, !0) : (g = objects_data[k.obj_id],
                    void 0 != g && g.i == k.i && g.j == k.j && (selected = selected_object = g,
                    Mods.Farming.findExtendedPath(selected_object),
                    0 == players[0].path.length && ActionMenu.act(0),
                    k = k.delay + Math.min(Math.max(players[0].temp.animate_until - timestamp(), 50), 200),
                    0 < players[0].path.length && moveInPath(players[0]),
                    Timers.set("farm_check", function(b, e) {
                        Mods.Farming.checkQueue(0, b)
                    }, k)))
                }
        }
    }
    ;
    Mods.Farming.checkQueue = function(b, e) {
        if (players[0].params.island === players[0].name)
            if (100 > timestamp() - Mods.Farming.lastMove || players[0].temp.busy || 0 < players[0].path.length || captcha)
                Timers.set("farm_check", function() {
                    Mods.Farming.checkQueue()
                }, 100);
            else {
                Mods.Farming.lastMove = timestamp();
                b = "number" == typeof b ? b : 0;
                e = "string" == typeof e ? e : Mods.Farming.sortedQueue[0] || null ;
                var f = Mods.Farming.sortedQueue
                  , g = Mods.Farming.queue[f[b]]
                  , k = void 0 != g ? g.obj_id : null ;
                0 == f.length ? Mods.Farming.cancelQueue() : void 0 == g ? Mods.Farming.deleteFromQueue(b) : "number" != typeof b || "string" != typeof e ? Timers.set("farm_check", function(b) {
                    Mods.Farming.checkQueue(0, b)
                }, Math.min(Math.max(players[0].temp.animate_until - timestamp(), 50), 500)) : (g = obj_g(on_map[300][g.i][g.j]),
                k != g.id ? Mods.Farming.deleteFromQueue(b, !0) : inDistance(players[0].i, players[0].j, g.i, g.j) ? (f = Mods.Farming.canPerform(k),
                void 0 == k || "object" !== typeof f || !0 !== f.status ? Mods.Farming.pauseQueue(!1, !1, !0) : (selected_object = g,
                ActionMenu.act(0),
                Mods.Farming.deleteFromQueue(b, !0))) : f[b] == e ? Mods.Farming.performQueue(b, e) : 0 < f.length && !Timers.running("farm_queue") && Mods.Farming.performQueue(0, f[0]))
            }
    }
    ;
    Mods.Farming.deleteFromQueue = function(b, e) {
        e = e || !1;
        var f = Mods.Farming.queue[Mods.Farming.sortedQueue[b]]
          , g = void 0 != f ? f.obj_id : null
          , f = obj_g(on_map[300][f.i][f.j]);
        0 < Mods.Farming.sortedQueue.length && b < Mods.Farming.sortedQueue.length && !Mods.Farming.queuePaused && !Mods.Farming.ctrlPressed && f.id != g && (g = Mods.Farming.sortedQueue[b],
        delete Mods.Farming.queue[g],
        Mods.Farming.sortedQueue.splice(b, 1),
        null != getElem("mods_farming_" + g) && getElem("mods_farming_queue").removeChild(getElem("mods_farming_" + g)),
        e && Mods.Farming.checkQueue(b, Mods.Farming.sortedQueue[b]),
        Timers.set("farming_queue_active", function() {
            Mods.Farming.checkQueue(0)
        }, 2500),
        getElem("mods_farming_total").innerHTML = Mods.Farming.sortedQueue.length)
    }
    ;
    Mods.Farming.cancelQueue = function() {
        Timers.clear("farm_check");
        Timers.clear("farm_queue");
        Mods.Farming.queue = {};
        Mods.Farming.sortedQueue = [];
        getElem("mods_farming_queue").innerHTML = "<span style='width: 100%; float: left; display: inline-block; font-weight: bold; color: #999;'><span>Action:&nbsp;&nbsp;Object</span><span style='float: right;'>Coords</span></span>";
        getElem("mods_farming_total").innerHTML = Mods.Farming.sortedQueue.length
    }
    ;
    DEFAULT_FUNCTIONS.rake = function(b, e) {
        Mods.Farming.performActivity(b) ? (Mods.Farming.oldDefault.rake(b, e),
        Timers.set("farming_queue_active", function() {
            Mods.Farming.checkQueue(0)
        }, 100)) : (Mods.Farming.findExtendedPath(b),
        0 < players[0].path.length && !players[0].temp.busy && moveInPath(players[0]))
    }
    ;
    DEFAULT_FUNCTIONS.seed = function(b, e) {
        Mods.Farming.performActivity(b) ? (Mods.Farming.oldDefault.seed(b, e),
        Timers.set("farming_queue_active", function() {
            Mods.Farming.checkQueue(0)
        }, 100)) : (Mods.Farming.findExtendedPath(b),
        0 < players[0].path.length && !players[0].temp.busy && moveInPath(players[0]))
    }
    ;
    DEFAULT_FUNCTIONS.harvest = function(b, e) {
        Inventory.get_watering_can_id(players[0]) && 0 == players[0].temp.water ? Mods.Farming.pauseQueue(!1, !1, !0) : Mods.Farming.performActivity(b) ? (Mods.Farming.oldDefault.harvest(b, e),
        Timers.set("farming_queue_active", function() {
            Mods.Farming.checkQueue(0)
        }, 100)) : (Mods.Farming.findExtendedPath(b),
        0 < players[0].path.length && !players[0].temp.busy && moveInPath(players[0]))
    }
    ;
    Mods.Farming.performActivity = function(b) {
        if (300 == players[0].map) {
            var e = obj_g(b);
            if (!building_mode_enabled && (!0 !== Mods.Farming.queuePaused || Mods.Farming.ctrlPressed) && e.id && e.params && (void 0 != e.params.rotate || 753 == e.params.carpentry_item_id))
                if (void 0 == Mods.Farming.queue[e.i + "_" + e.j + "_" + e.b_i] && Mods.Farming.addToQueue(e),
                !Mods.Farming.ctrlPressed && 1 !== Mods.Farming.queuePaused && 0 < Mods.Farming.sortedQueue.length) {
                    b = Mods.Farming.queue[Mods.Farming.sortedQueue[0]];
                    b = obj_g(on_map[300][b.i][b.j]);
                    if (e.id == selected_object.id)
                        return !0;
                    b && (selected = selected_object = b);
                    "object" == typeof selected_object && selected_object.activities && selected_object.activities[0] && 0 < selected_object.activities[0].length && ActionMenu.act(0);
                    if (b.id != e.id)
                        return !1
                } else
                    return !1;
            else if (!(e && e.id && e.params) || void 0 == e.params.rotate && 753 != e.params.carpentry_item_id)
                return !1
        }
        return !0
    }
    ;
    Mods.Farming.inventoryEquip = function(b, e, f) {
        779 == e && 300 == players[0].map && (selected = selected_object = obj_g(on_map[300][9][10]),
        Mods.Farming.findExtendedPath(selected),
        0 < players[0].path.length ? moveInPath(players[0]) : ActionMenu.act(0));
        return !1
    }
    ;
    Mods.Farming.isSeed = function(b) {
        return -1 < item_base[b].name.indexOf("Seed") || "Bag of Worms" == item_base[b].name ? !0 : !1
    }
    ;
    Mods.timestamp("farming")
}
;
Load.gearmd = function() {
    modOptions.gearmd.time = timestamp();
    Mods.Gearmd = {};
    Gearmd = Mods.Gearmd;
    Gearmd.temp = function() {
        clearGear = function() {
            null !== getElem("gear_inv_holder") && document.body.removeChild(getElem("gear_inv_holder"))
        }
        ;
        clearGear();
        createElem("div", wrapper, {
            id: "gear_inv_holder",
            className: "menu",
            title: "Click and drag to move this window.",
            onmousedown: function(b) {
                b = b || window.event;
                this.coordinates = {
                    dx: (parseInt(this.style.left) || 0) - b.clientX,
                    dy: (parseInt(this.style.top) || 0) - b.clientY
                };
                this.canMove = !0
            },
            onmousemove: function(b) {
                b = b || window.event;
                this.canMove && "mods_wiki_name" != b.target.id && (this.style.left = Math.min(parseInt(wrapper.style.width) - 100, Math.max(-100, b.clientX + this.coordinates.dx)) + "px",
                this.style.top = Math.min(parseInt(wrapper.style.height) - 80, Math.max(-80, b.clientY + this.coordinates.dy)) + "px")
            },
            onmouseup: function(b) {
                this.canMove = !1
            },
            style: "position: absolute; top: 100px; width: 190px; left: 45px; float: left; z-index: 999; display: none;"
        });
        createElem("div", "gear_inv_holder", {
            id: "gear_inv_set",
            style: "position: relative; float: left; width: 108px; height: 100%; display: inline-block;"
        });
        createElem("div", "gear_inv_holder", {
            id: "gear_inv_stats",
            style: "position: relative; float: right; width: 70px; padding: 0px 8px 0px 4px; font-size: 10px;"
        });
        createElem("div", "gear_inv_set", {
            style: "position: relative; float: left; width: 100%; height: 20%; display: inline-block; padding: 0px 4px 4px; font-size: 10px;",
            innerHTML: "<span id='gear_inv_equipped' class='link pointer' style='font-weight: bold' onmouseover='javascript: this.style.color=&apos;#3BEEEE&apos;' onmouseout='javascript: this.style.color=&apos;#FFF&apos;' onclick='javascript: Gearmd.toggleEquipped(); Gearmd.updateEquipped();'>Equipped</span><div class='link pointer' style='float: right; font-size: 10px; margin-right: 8px; font-weight: bold; display: block;' onmouseover='javascript: this.style.color=&apos;#3BEEEE&apos;' onmouseout='javascript: this.style.color=&apos;#FFF&apos;' onclick='javascript: Gearmd.hideStats(this);'></div>"
        });
        createElem("div", "gear_inv_stats", {
            id: "gear_stats_holder",
            style: "position: relative; width: 100%; display: inline-block; padding: 0px 4px 4px;",
            innerHTML: "<span style='color: yellow; padding-bottom: 4px; width: 100%; display: inline-block;'>Bonuses<span class='link pointer' style='float: right; font-weight: bold; color: #FFF;' onmouseover='javascript: this.style.color=&apos;#3BEEEE&apos;' onmouseout='javascript: this.style.color=&apos;#FFF&apos;' onclick='javascript: Gearmd.showEquipment(getElem(&apos;inv_name&apos;).childNodes[0]);'>Close</span></span>"
        });
        createElem("div", "gear_inv_stats", {
            id: "gear_canvas_holder",
            style: "position: relative; float: left; bottom: 4px; right: -7px; width: 66px; height: 66px; background-color: #222;"
        });
        createElem("canvas", "gear_canvas_holder", {
            id: "gear_inv_canvas",
            width: "64px",
            height: "64px",
            style: "border: 1px solid #666; width: 64px; height: 64px;"
        });
        var b = ["Aim", "Power", "Armor", "Magic", "Speed"], e;
        for (e in b) {
            var f = b[e]
              , g = "gear_stats_" + f.toLowerCase();
            createElem("span", "gear_stats_holder", {
                style: "color: #FFF; display: block; width: 100%; padding-bottom: 4px; font-size: 10px;",
                innerHTML: f + " <span id='" + g + "' style='color: #3BEEEE; font-size: 10px; float: right'>111</span>"
            })
        }
        b = "neck helm cape shield chest weapon ring legs gloves pet boots pop".split(" ");
        for (e in b)
            createElem("div", "gear_inv_set", {
                id: "gear_inv_" + b[e],
                className: "inv_item",
                style: "position: relative; width: 32px; height: 32px; margin: 1px; padding: 0px; border: solid 1px #666666; display: inline-block; font-size: 10px; color: #FFF; text-shadow: 1px 1px #000, 1px -1px #000, -1px 1px #000, -1px -1px #000; letter-spacing: 1px; text-align: center; background-color: #222;",
                onmouseover: "javascript: this.style.borderColor='#3BEEEE'; this.innerHTML='" + b[e] + "'",
                onmouseout: "javascript: this.style.borderColor='#666'; this.innerHTML='&nbsp;'",
                onclick: "javascript: Gearmd.changeTryOn(false, false, this);",
                title: capitaliseFirstLetter(b[e]),
                innerHTML: "&nbsp;"
            });
        e = localStorage.tryGear;
        e = "string" == typeof e ? JSON.parse(e) : {
            head: players[0].params.d_head,
            facial_hair: players[0].params.d_facial_hair,
            body: players[0].params.d_body,
            pants: players[0].params.d_pants,
            cape: !1,
            left_hand: !1,
            right_hand: !1,
            shield: !1,
            helmet: !1,
            boots: !1,
            weapon: !1,
            hands: !1
        };
        Gearmd.tryGear = e;
        e = localStorage.showGear;
        e = "string" == typeof e ? JSON.parse(e) : {
            0: !1,
            1: !1,
            2: !1,
            3: !1,
            4: !1,
            5: !1,
            6: !1,
            7: !1,
            8: !1,
            9: !1,
            10: !1,
            11: !1,
            12: !1,
            14: !1
        };
        Gearmd.showGear = e;
        Gearmd.equipped = !0;
        Gearmd.tryEmptyReplace = !1;
        getElem("gear_inv_equipped").setAttribute("title", "Click here to toggle between currently equipped items and your Vanity Set.\nUse the Wiki and search under Items to (Try On) items in your Vanity Set.")
    }
    ;
    getElem("inventory").addEventListener("mouseup", function(b) {
        Timers.set("update_equipped", function() {
            Mods.Gearmd.updateEquipped()
        }, 1E3)
    });
    Gearmd.toggleEquipped = function(b) {
        b = "boolean" === typeof b ? b : 0;
        var e = getElem("gear_inv_equipped");
        Gearmd.equipped && 0 === b || !1 === b ? (Gearmd.equipped = !1,
        e.innerHTML = "Vanity Set") : Gearmd.equipped && !0 !== b || (Gearmd.equipped = !0,
        e.innerHTML = "Equipped")
    }
    ;
    Gearmd.hideStats = function(b) {
        var e = getElem("gear_inv_stats")
          , f = e.style.display
          , g = getElem("gear_inv_holder");
        "" == f || void 0 == f || null == f ? (e.style.display = "none",
        b.innerHTML = ">>",
        g.style.width = "108px") : (e.style.display = "",
        b.innerHTML = "<<",
        g.style.width = "190px")
    }
    ;
    Gearmd.showEquipment = function(b, e) {
        div = getElem("gear_inv_holder");
        b = b || getElem("inv_name").childNodes[0];
        "" != div.style.display || e ? (b.innerHTML = "Hide Equipment",
        div.style.display = "") : (b.innerHTML = "Show Equipment",
        div.style.display = "None");
        Gearmd.updateEquipped()
    }
    ;
    Gearmd.getPlayerOutfit = function(b) {
        var e = {}, f;
        for (f in Gearmd.tryGear)
            e[f] = players[0].params["d_" + f] ? players[0].params["d_" + f] : !Gearmd.equipped || 0 < Gearmd && ("boolean" === typeof Gearmd.tryGear[f] || "head" === f || "facial_hair" === f || "body" === f || "pants" === f) ? Gearmd.tryGear[f] : 0;
        for (var g in e) {
            if (0 < Gearmd.tryGear[g] && !b) {
                var k = item_base[Gearmd.tryGear[g]];
                k.params && "object" === typeof k.params.visible && "undefined" != typeof k.params.visible[g] && (e[g] = k.params.visible[g],
                "undefined" != typeof k.params.visible.left_hand && (e.left_hand = k.params.visible.left_hand),
                "undefined" != typeof k.params.visible.right_hand && (e.right_hand = k.params.visible.right_hand))
            } else if (!0 === e[g] || b || Gearmd.tryEmptyReplace)
                for (f = 0; f < players[0].temp.inventory.length; f++)
                    item = players[0].temp.inventory[f],
                    item.selected && (k = item_base[item.id],
                    k.params && "object" == typeof k.params.visible && "undefined" != typeof k.params.visible[g] && (e[g] = k.params.visible[g]));
            0 < e[g] || (e[g] = 0)
        }
        return e.head + " " + e.facial_hair + " " + e.body + " " + e.pants + " " + e.cape + " " + e.left_hand + " " + e.right_hand + " " + e.shield + " " + e.weapon + " " + e.helmet + " " + e.boots + " " + e.hands
    }
    ;
    Gearmd.displayPlayer = function(b) {
        b = getElem("gear_inv_canvas").getContext("2d");
        Draw.clear(b);
        b.drawImage(getBodyImg(Gearmd.getPlayerOutfit(Gearmd.equipped)), 0, 0, 64, 54, 5, 10, 64, 54)
    }
    ;
    void 0 == Gearmd.oldShowInventory && (Gearmd.oldShowInventory = BigMenu.show_inventory);
    BigMenu.show_inventory = function() {}
    ;
    getElem("inv_name").innerHTML = "<div class='link pointer' style='font-size: 10px; font-weight: bold; padding-top: 2px; color: #999;' onmouseover='javascript: this.style.color=&apos;#3BEEEE&apos;' onmouseout='javascript: this.style.color=&apos;#999&apos;' onclick='javascript: Gearmd.showEquipment(this);'>Show Equipment</div>";
    getElem("inv_name").setAttribute("title", "Open the gear menu from here.");
    Mods.Gearmd.inventoryClick = function(b) {
        Gearmd.updateEquipped()
    }
    ;
    Gearmd.showEquipped = function(b) {
        return b ? !0 : Gearmd.equipped
    }
    ;
    Gearmd.updateEquipped = function() {
        var b = Gearmd.equipped, e = {
            0: "helm",
            1: "cape",
            2: "chest",
            3: "shield",
            4: "weapon",
            5: "gloves",
            6: "boots",
            7: "neck",
            8: "ring",
            11: "legs",
            12: "pet",
            14: "pop"
        }, f;
        for (f in e)
            null !== getElem("gear_inv_" + e[f]) && (getElem("gear_inv_" + e[f]).style.background = "#333",
            getElem("gear_inv_" + e[f]).setAttribute("item_id", "false"));
        if (b) {
            f = 0;
            for (var g = players[0].temp.inventory.length; f < g; f++) {
                var k = players[0].temp.inventory[f];
                if (k.selected) {
                    var m = item_base[k.id]
                      , k = m.params.slot;
                    e[k] && (k = getElem("gear_inv_" + e[k]),
                    k.style.background = Items.get_background(m.b_i).replace("transparent", "#333"),
                    k.setAttribute("item_id", m.b_i))
                }
            }
        } else
            for (f in e)
                if (k = Gearmd.showGear[f],
                !1 !== k) {
                    if (!0 === k)
                        for (g in players[0].temp.inventory)
                            if (m = players[0].temp.inventory[g],
                            m.selected && item_base[m.id].params.slot == f) {
                                k = m.id;
                                break
                            }
                    if (item_base[k] || k.id && item_base[k.id])
                        m = k.id ? item_base[k.id] : item_base[k],
                        k = f,
                        k = getElem("gear_inv_" + e[k]),
                        k.style.background = Items.get_background(m.b_i).replace("transparent", "#333"),
                        k.setAttribute("item_id", m.b_i)
                }
        Gearmd.updateStats(b);
        Gearmd.displayPlayer(b)
    }
    ;
    Gearmd.updateStats = function(b) {
        var e = {
            aim: 0,
            power: 0,
            armor: 0,
            magic: 0,
            speed: 0
        };
        if (b)
            for (var f = 0; f < players[0].temp.inventory.length; f++) {
                if (b = players[0].temp.inventory[f],
                b.selected) {
                    b = item_base[b.id];
                    for (var g in e)
                        void 0 !== b.params[g] && (e[g] += b.params[g])
                }
            }
        else
            for (f in Mods.Gearmd.showGear)
                if (b = Mods.Gearmd.showGear[f],
                0 < b)
                    for (g in b = item_base[b],
                    e)
                        void 0 !== b.params[g] && (e[g] += b.params[g]);
        for (g in e)
            getElem("gear_stats_" + g).innerHTML = e[g];
        60 < e.speed && (getElem("gear_stats_speed").innerHTML = e.speed + "(60)")
    }
    ;
    Gearmd.changeTryOn = function(b, e, f) {
        var g = {
            0: "helm",
            1: "cape",
            2: "chest",
            3: "shield",
            4: "weapon",
            5: "gloves",
            6: "boots",
            7: "neck",
            8: "ring",
            11: "legs",
            12: "pet",
            14: "pop"
        }
          , k = {
            helm: "helmet",
            gloves: "hands",
            pop: "right_hand",
            chest: "body",
            legs: "pants"
        };
        if (e && (void 0 == item_base[e] || void 0 == item_base[e].params.slot || void 0 == g[item_base[e].params.slot]) || e && 0 != item_base[e].b_t && 2 != item_base[e].b_t && 5 != item_base[e].b_t && 7 != item_base[e].b_t)
            return !1;
        if (b) {
            if (f = item_base[e],
            b = f.params.slot,
            void 0 !== b && void 0 !== g[b]) {
                Gearmd.showGear[b] = e;
                k[g[b]] ? Gearmd.tryGear[k[g[b]]] = e : Gearmd.tryGear[g[b]] = e;
                if ("undefined" !== typeof f.params.disable_slot) {
                    var m = f.params.disable_slot;
                    Gearmd.showGear[m] = !1;
                    k[g[m]] ? Gearmd.tryGear[k[g[m]]] = !1 : Gearmd.tryGear[g[m]] = !1
                }
                for (var n in Gearmd.showGear)
                    f = Gearmd.showGear[n],
                    0 < f && "undefined" != typeof item_base[f].params && (m = item_base[f].params.slot,
                    item_base[f].params.disable_slot === b && (Gearmd.showGear[m] = !1,
                    k[g[m]] ? Gearmd.tryGear[k[g[m]]] = !1 : Gearmd.tryGear[g[m]] = !1))
            }
        } else if (Gearmd.equipped) {
            b = f;
            b = b.id || b;
            b = b.replace("gear_inv_", "");
            for (m in g)
                if (g[m] == b) {
                    b = m;
                    break
                }
            if (0 <= b)
                for (m = 0; m < players[0].temp.inventory.length; m++)
                    if (f = players[0].temp.inventory[m],
                    f.selected && (f = item_base[f.id],
                    f.params.slot == b)) {
                        left_click_cancel = !1;
                        inventoryClick(m);
                        break
                    }
        } else {
            b = f;
            b = b.id || b;
            b = b.replace("gear_inv_", "");
            for (m in g)
                if (g[m] == b) {
                    b = m;
                    break
                }
            Gearmd.showGear[b] = !1;
            k[g[b]] ? Gearmd.tryGear[k[g[b]]] = !1 : Gearmd.tryGear[g[b]] = !1
        }
        localStorage.tryGear = JSON.stringify(Gearmd.tryGear);
        localStorage.showGear = JSON.stringify(Gearmd.showGear);
        Gearmd.updateEquipped();
        e && Gearmd.toggleEquipped(!1);
        e && Gearmd.showEquipment(!1, !0)
    }
    ;
    Gearmd.temp();
    Gearmd.updateEquipped();
    Mods.timestamp("gearmd")
}
;
Mods.elemClass = function(b, e, f) {
    if ("object" === typeof f) {
        if ("undefined" === typeof f.className)
            return !1
    } else if ("undefined" != typeof e) {
        if (f = getElem(e),
        "object" !== typeof f || "undefined" === typeof f.className)
            return !1
    } else
        return !1;
    addClass(f, b);
    for (var g in f.childNodes)
        "object" === typeof f.childNodes[g] && Mods.elemClass(b, null , f.childNodes[g])
}
;
Mods.confirmClass = function(b, e, f) {
    if ("object" === typeof f) {
        if ("undefined" === typeof f.className)
            return !1
    } else if ("undefined" != typeof e) {
        if (ClassValue = 0,
        f = getElem(e),
        "object" !== typeof f || "undefined" === typeof f.className)
            return !1
    } else
        return !1;
    !hasClass(f, b) && ClassValue++;
    for (var g in f.childNodes)
        "object" === typeof f.childNodes[g] && Mods.confirmClass(b, null , f.childNodes[g])
}
;
Mods.initialize();
Mods.loadModOptions();
Mods.elemClass("scrolling_allowed", "mods_form");
Mods.initializeOptionsMenu();
getElem("mods_link").innerHTML = "Wiki &amp; Mods menu";
getElem("mods_link").setAttribute("onclick", "javascript: removeClass(getElem('mods_form'),'hidden'); BigMenu.show(-1);");
getElem("mods_link").style.display = "";
quiet_mod_load ? (Mods.loadSelectedMods(),
addClass(getElem("mods_form"), "hidden")) : Mods.consoleLog("Ready: RPG MO Mods Pack version " + Mods.version);
//# sourceMappingURL=mod.map?r=8b4c79cf0abb44cfef57e7f9edde2318

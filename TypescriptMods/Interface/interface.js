var interface;
(function (interface) {
    var $Body = $("Body");
    var $Right;
    //Enable for enabling.disabling different features
    var Options = (function () {
        //Empty constructor by default all true
        function Options(_escapeHP) {
            if (_escapeHP === void 0) { _escapeHP = true; }
            this.escapeHP = _escapeHP;
        }
        return Options;
    })();
    interface.Options = Options;
    //Modify this for according to personal preferences
    interface.enable = new Options(true);
    //PreCond: element is a string ID, appendTo is DOM element
    //PostCond: Appends element to appendTo element
    function reAppend(elementId, appendTo) {
        if (appendTo === void 0) { appendTo = $Body; }
        console.log(elementId);
        appendTo.appendChild($(elementId));
    }
    var IdToReassign = ["chat", "chat_button", "filters_button", "quests_button", "contacts_button", "donation_button", "my_text", "current_channel", "chat_resize", "tabs", "player_healthbar", "toolbar_main_holder"];
    function init() {
        createElem("div", $Body, {
            id: "rightSideMenuWrapper",
            innerHTML: ""
        });
        $Right = $("#rightSideMenuWrapper");
        for (var i in IdToReassign) {
            console.log(i);
            reAppend("#" + IdToReassign[i], $Body);
        }
        reAppend("#" + "player_xp_bar", $("#toolbar_main_holder"));
        //reAppend("#" + "inventory", $Right);
        reAppend("#" + "skills_menu", $Right);
        //// Change existing function 
        //Doesnt draw bottom bar now
        HUD.drawMenu = function () {
            var a = IMAGE_SHEET[IMAGES.ACTIVITIES[0].sheet].tile_width, b = IMAGE_SHEET[IMAGES.ACTIVITIES[0].sheet].tile_height;
            bigIcons && (a *= 2,
                b *= 2);
            for (var d = -1, e = 0, f = IMAGES.ACTIVITIES.length; e < f; e++)
                if (IMAGES.ACTIVITIES[e].visible) {
                    d++;
                    var g = IMAGES.ACTIVITIES[e], h = IMAGE_SHEET[g.sheet];
                    ctx.hud.drawImage(h.img[0], IMAGE_SHEET[g.sheet].tile_width * g.x, IMAGE_SHEET[g.sheet].tile_height * g.y, h.tile_width, h.tile_height, Math.round(width - a * (d + 1)), 16, a, b);
                }
            Draw.drawToMap(ctx.hud, IMAGES.GUI[0], {
                x: 0,
                y: 0,
                relative: !1
            });
        };
        //ctx.hud.clearRect(0, 105, 1720, 1080);
        refreshHUD();
    }
    init();
    function fixCss() {
        $("#toolbar_main_holder").style.height = "15px";
        $("#toolbar_main_holder").style["background"] = "#333333";
        $("#player_xp_bar_front").style["background"] = "rgb(0, 184, 192)";
        $("#toolbar_main_holder").style.width = "100%";
        $("#player_xp_name").style["font-size"] = "1em";
        $("#player_xp_bar").style.height = "15px";
    }
    fixCss();
})(interface || (interface = {}));
//# sourceMappingURL=interface.js.map
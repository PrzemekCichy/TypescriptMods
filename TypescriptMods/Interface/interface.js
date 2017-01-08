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
    }());
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
        //Bottom Bar
        createElem("div", $Body, {
            id: "bottomBar",
            innerHTML: "",
            style: {
                "position": "absolute",
                "width": "100%",
                "height": "31px",
                "bottom": "0",
                "background-color": "#333333",
                "z-index": "0"
            }
        });
        for (var i in IdToReassign) {
            console.log(i);
            reAppend("#" + IdToReassign[i], $Body);
        }
        reAppend("#" + "player_xp_bar", $("#toolbar_main_holder"));
        reAppend("#" + "inventory", $Right);
        //reAppend("#" + "skills_menu", $Right);
        reAppend("#" + "gear_inv_holder", $Right);
        //reAppend("#" + "settings", $Right);   
        //// Change existing function 
        //Doesnt draw bottom/top bar now
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
        $("#toolbar_main_holder").style["font-size"] = "90%";
        $("#player_xp_name").style["font-size"] = "90%";
        $("#player_xp_bar").style.height = "15px";
        $("#player_xp_bar").style.width = "350px";
        $("#inventory").style.top = "178px";
        $("#inventory").style.display = "block";
        /*  $("#skills_menu").class = "menu";
          $("#skills_menu").style.top = "490px";
          $("#skills_menu").style.display = "block";
          $("#skills_menu").style.display = "block";
          $("#skills_menu").style["width"] = "268px";
          $("#skills_menu").style["padding-left"] = "14px";
          $("#skills_menu").style["padding-right"] = "14px";
          $("#skills_menu").style["max-width"] = "268px";
          */
        for (var i = 0; i < document.getElementsByClassName("menu").length; i++) {
            $$(".menu")[i].style["box-shadow"] = "";
            $$(".menu")[i].style["opacity"] = "1";
        }
        $(".menu").style["box-shadow"] = "";
        $(".menu").style["opacity"] = "1";
        //Equipment
        $("#gear_inv_holder").style.display = "block";
        $("#gear_inv_holder").style["top"] = "15px";
        $("#gear_inv_holder").style["left"] = "";
        $("#gear_inv_holder").style["right"] = "0";
        $("#gear_inv_holder").style["width"] = "288px";
        $("#gear_canvas_holder").style["width"] = "130px";
        $("#gear_canvas_holder").style.height = "130px";
        $("#gear_canvas_holder").style["float"] = "right";
        $("#gear_canvas_holder").style.margin = "20px 8px 0px 4px";
        $("#gear_inv_canvas").style["width"] = "130px";
        $("#gear_inv_canvas").style.height = "130px";
        $("#chat").style["height"] = "220px";
        $("#gear_inv_set").style["margin-right"] = "10px";
        $("#chat").style["width"] = "849px";
        $("#chat").style["min-width"] = "849px";
        $("#chat").style["max-height"] = "420px";
        $("#chat").style["background"] = "#333333";
        $("#chat_resize").style["max-width"] = "849px";
        $("#chat_resize").style["bottom"] = "250px";
        $("#tabs").style["bottom"] = "253px";
        $("#chat").style["bottom"] = "28px";
        //settings
        /*$("#settings").style.top = "806px"
        $("#settings").style.display = "block";
        $("#settings").style["width"] = "288px";
        $("#settings").style["max-width"] = "288px";
        $("#settings").style["max-height"] = "120px";
        */
        //Fixes blurry img rendering
        getElem("gear_inv_canvas").style["image-rendering"] = "pixelated";
        getElem("base_show").style["image-rendering"] = "pixelated";
        getElem("objects_show").style["image-rendering"] = "pixelated";
        getElem("players_show").style["image-rendering"] = "pixelated";
        getElem("hud").style["image-rendering"] = "pixelated";
        try {
            $("#gear_stats_holder").remove();
        }
        catch (e) { }
        Gearmd.updateStats = function () { };
    }
    fixCss();
})(interface || (interface = {}));
//# sourceMappingURL=interface.js.map
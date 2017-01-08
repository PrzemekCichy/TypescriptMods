var newElement = (function () {
    function newElement() {
    }
    ;
    return newElement;
}());
var Chestmod;
(function (Chestmod) {
    var Tabs = (function () {
        function Tabs(properties) {
            this.CurrentFilter = "All";
            this.properties = properties;
        }
        Tabs.prototype.createHolderElement = function () {
            var _this = this;
            if (typeof (this.holderElement) !== "undefined") {
                return;
            }
            /*
            This is terible, needs to be rewritten
            */
            var chestTopHoler = document.getElementById("chest_top_holder");
            this.holderElement = document.createElement("div");
            this.holderElement.setAttribute("id", "chestSortButtonsHolder");
            this.holderElement.setAttribute("height", "54px");
            this.holderElement.setAttribute("style", "background-color: #333333; width: 408px; \
                display: inline-block; margin-top: 6px; left: -24px; position: relative; margin-bottom: 6px;");
            this.holderElement1 = document.createElement("div");
            this.holderElement1.setAttribute("id", "chestSortButtonsHolder");
            this.holderElement1.setAttribute("height", "54px");
            this.holderElement1.setAttribute("style", "background-color: #333333; width: 408px; \
                display: inline-block; margin-top: 6px; left: -24px; position: relative; margin-bottom: 6px;");
            this.holderElement2 = document.createElement("div");
            this.holderElement2.setAttribute("id", "chestSortButtonsHolder");
            this.holderElement2.setAttribute("height", "54px");
            this.holderElement2.setAttribute("style", "background-color: #333333; \
                display: inline-block; margin-top: 6px; left: -24px; position: absolute;vertical-align: middle; top: 80px; margin-bottom: 6px; text-align: center;");
            chestTopHoler.appendChild(this.holderElement);
            chestTopHoler.appendChild(this.holderElement1);
            chestTopHoler.appendChild(this.holderElement2);
            this.renderButtons();
            this.holderElement.addEventListener('click', function (e) {
                console.log(e.target.attributes[0].nodeValue);
                _this.CurrentFilter = e.target.attributes[0].nodeValue;
                _this.sortChest(_this.CurrentFilter);
            }, false);
            return this;
        };
        Tabs.prototype.renderButtons = function () {
            var _this = this;
            this.properties.map(function (tab) {
                _this.holderElement.insertAdjacentHTML("afterbegin", _this.returnHtmlButton(tab));
            });
        };
        Tabs.prototype.returnHtmlButton = function (tab) {
            return "<div id = " + tab.categoryName + " style='\
                height: 32px;\
                width: 32px;\
                float: left;\
                border: 1px solid grey;\
                background: url(" + tab.imgPath + ") no-repeat scroll " + tab.imgX + "px " + tab.imgY + "px transparent;\
            '>\
            </div>";
        };
        Tabs.prototype.sortChest = function (categoryFilter) {
            if (categoryFilter === void 0) { categoryFilter = this.CurrentFilter; }
            categoryFilter = categoryFilter || this.CurrentFilter;
            console.log(ITEM_CATEGORY[categoryFilter.toUpperCase()]);
            //Favourites should be separated
            if (categoryFilter === "All" || categoryFilter === "Favourites") {
                chest_content = chests[0];
                Chest.change_page(1);
                return;
            }
            chest_content = chests[0];
            chest_content = chest_content.filter(function (chestItem) {
                return item_base[chestItem.id].b_t == ITEM_CATEGORY[categoryFilter.toUpperCase()];
            });
            Chest.change_page(1);
            console.log("Change Page");
        };
        return Tabs;
    }());
    Chestmod.Tabs = Tabs;
})(Chestmod || (Chestmod = {}));
var categories = [
    {
        imgX: -128,
        imgY: -160,
        imgPath: 'https://data.mo.ee/sheet/sicos.gif?3a49127a54e8383ed92fcd22438e8a8982.131.43.200',
        categoryName: "Spell"
    },
    {
        imgX: -32,
        imgY: -64,
        imgPath: 'https://data.mo.ee/sheet/pets.gif',
        categoryName: "Pet"
    },
    {
        imgX: -96,
        imgY: -576,
        imgPath: 'https://data.mo.ee/sheet/house_inv.gif',
        categoryName: "House"
    },
    {
        imgX: 0,
        imgY: 0,
        imgPath: 'https://data.mo.ee/sheet/wearable/archery.gif',
        categoryName: "Archery"
    }, {
        imgX: -160,
        imgY: -128,
        imgPath: 'https://data.mo.ee/sheet/dgmisc32.gif',
        categoryName: "Tool"
    }, {
        imgX: -32,
        imgY: 0,
        imgPath: 'https://data.mo.ee/sheet/fish_new32.gif',
        categoryName: "Food"
    }, {
        imgX: -32,
        imgY: -256,
        imgPath: 'https://data.mo.ee/sheet/dg_jewls32.gif',
        categoryName: "Jewellery"
    },
    {
        imgX: -256,
        imgY: -224,
        imgPath: 'https://data.mo.ee/sheet/dgmisc32.gif',
        categoryName: "Material"
    },
    {
        imgX: -160,
        imgY: -160,
        imgPath: 'https://data.mo.ee/sheet/dg_armor2.gif',
        categoryName: "Armor"
    }, {
        imgX: -32,
        imgY: -64,
        imgPath: 'https://data.mo.ee/sheet/dgweapon2.gif',
        categoryName: "Weapon"
    },
    {
        imgX: 0,
        imgY: -576,
        imgPath: 'https://data.mo.ee/sheet/dg_armor32.gif',
        categoryName: "Favourites"
    },
    {
        imgX: -160,
        imgY: 0,
        imgPath: 'https://data.mo.ee/sheet/dgmisc32.gif',
        categoryName: "All"
    }
];
var buttons = new Chestmod.Tabs(categories).createHolderElement();
Chest.withdraw = function (a) {
    var b = chest_page - 1, b = parseInt(selected_chest) + 60 * b;
    chest_item_id = chest_content[b].id;
    Socket.send("chest_withdraw", { item_id: chest_content[b].id, item_slot: b, target_id: chest_npc.id, target_i: chest_npc.i, target_j: chest_npc.j, amount: a });
    buttons.sortChest();
};
Chest.deposit = function (a) {
    var b = chest_page - 1, b = parseInt(selected_chest) + 60 * b;
    chest_item_id = chest_content[b].id;
    Socket.send("chest_deposit", { item_id: chest_content[b].id, item_slot: b, target_id: chest_npc.id, target_i: chest_npc.i, target_j: chest_npc.j, amount: a });
    buttons.sortChest();
};
Chest.destroy = function () {
    var a = chest_page - 1, b = parseInt(selected_chest) + 60 * a;
    chest_item_id = chest_content[b].id;
    Popup.prompt(_ti("Do you want to destroy {item_name}?", { item_name: item_base[chest_item_id].name }), function () {
        Socket.send("chest_destroy", { item_id: chest_content[b].id, item_slot: b, target_id: chest_npc.id, target_i: chest_npc.i, target_j: chest_npc.j });
    });
    buttons.sortChest();
};
//# sourceMappingURL=ChestMod.js.map
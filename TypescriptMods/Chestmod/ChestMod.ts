declare var chest_content, chests, Chest;
declare var ITEM_CATEGORY;
declare interface IButtonsProperties {
    imgX: number;
    imgY: number;
    imgPath: string;
    categoryName: string;
};

module Chestmod {

    export class Buttons {

        private properties;
        public holderElement;

        public constructor(properties: IButtonsProperties[]) {
            this.properties = properties;
        }

        public createHolderElement() {
            if (typeof (this.holderElement) !== "undefined") {
                return;
            }

            var parent = document.getElementById("chest_top_holder");
            this.holderElement = document.createElement("div");
            this.holderElement.setAttribute("id", "chestSortButtonsHolder");
            this.holderElement.setAttribute("height", "54px");
            this.holderElement.setAttribute("left", "-30px");
            this.holderElement.setAttribute("style", "background-color: #333333; width: 408px; \
                display: inline-block; margin-top: 6px; left: -24px; position: relative; margin-bottom: 6px;");



            parent.appendChild(this.holderElement);
            this.renderButtons();

            this.holderElement.addEventListener('click', (e) => {
                this.sortChest(e.target.attributes[0].nodeValue);
            }, false);

            return this;
        }

        private renderButtons() {
            this.properties.map((tab: IButtonsProperties) => {
                this.holderElement.insertAdjacentHTML(
                    "afterbegin",
                    this.returnHtmlButton(tab)
                );
            });
        }

        private returnHtmlButton(tab: IButtonsProperties) {
            return "<div id = " + tab.categoryName + " style='\
                height: 32px;\
                width: 32px;\
                float: left;\
                border: 1px solid grey;\
                background: url(" + tab.imgPath + ") no-repeat scroll " + tab.imgX + "px " + tab.imgY + "px transparent;\
            '>\
            </div>"
        }

        /*
declare interface ITEM_CATEGORY {
    -1: "All",
    0: "Armors",
    1: "Foods",
    2: "Jewellery",
    3: "Materials",
    4: "Tools",
    5: "Weapons",
    6: "Spells",
    7: "Pets",
    8: "House",
    9: "Archery",
};
*/

        public sortChest(categoryFilter: string) {
            console.log(ITEM_CATEGORY[categoryFilter.toUpperCase()]);

            //Favourites should be separated
            if (categoryFilter == "All" || categoryFilter == "Favourites") {
                chest_content = chests[0];
                Chest.change_page(1);
                return;
            }

            chest_content = chests[0];
            chest_content = chest_content.filter(
                function (chestItem) {
                    return item_base[chestItem.id].b_t == ITEM_CATEGORY[categoryFilter.toUpperCase()];
                });
            Chest.change_page(1);
        }
    }
}

var categories: IButtonsProperties[] = [
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

var buttons = new Chestmod.Buttons(categories).createHolderElement();
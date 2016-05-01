declare var item_base, FORGE_FORMULAS, BASE_TYPE, Player, fights;

var arrowDetails = function () {
    /*
        price: 3430,
        min_archery: 75,
        archery_speed: 325,
        archery_cooldown: 1550,
        archery_damage: 15,
        archery_range: 7,
    }
    */
    for (var i = 0; i < item_base.length; i++) {
        if (item_base[i].name.match(/Arrow/g)) {
            var item = item_base[i].params;
            var d = item.archery_damage,
                p = item.archery_speed,
                l = item.min_archery,
                c = item.archery_cooldown,
                c:any = c / 1000,
                x = item.archery_range,
                n = item_base[i].name,
                price = item.price;
            console.log(n + "\t" + price + "\t " + l + "\t" + d + "\t" + p + "\t" + ((c)).toFixed(2) + "\t" + x + "\t" + ((d / (c))).toFixed(1) + "\t" + ((d / (c))).toFixed(1) + "\t" + (price / d).toFixed(0));
        }
    }
};


console.log("Name\tPrice\tLevel\tDamage\tSpeed\tCooldown\tRange\tDPS\tXPS\tPrice/Exp\t");
arrowDetails();



var formulas = function () {
    console.log("Name\tChance\tLevel\tExperience\tMaterial\tMaterial\tMaterial");
    for (var i = 0; i < 577; i++) {
        var item = FORGE_FORMULAS[i];
        var string = "";
        if (typeof (item.fletching_level) !== "undefined") {
            string += item_base[FORGE_FORMULAS[i].item_id].name + "\t";
            string += item.chance + "\t";
            if (typeof (item.fletching_level) !== "undefined") {
                string += item.fletching_level + "\t";
            }            else {
                string += "0\t";
            }
            string += item.xp + "\t";
            try {
                for (var z = 0; z < FORGE_FORMULAS[i].pattern.length; z++) {
                    var occurences = 0, required = "";
                    for (var x = 0; x < FORGE_FORMULAS[i].pattern[z].length; x++) {
                        var a = FORGE_FORMULAS[i].pattern[z][x];
                        if (a < 0)
                            string += "0\t";
                        else
                            string += item_base[a].name + "\t";
                    }
                }
                string += "\n\t\t\t\t";
            } catch (e) {
                console.log("Error onabort Position:", i);
            }
            string += "\n";
            console.log(string);
        }

    }
};
formulas();
//b=players[0], d=npc_base[i],  e=ArrowID
var add_archery_damage = function(a, b, d, e) {

        e = Math.round(item_base[e].params.archery_damage * (1 + b.params.archery.damage_boost));
        var f:any = Math.min(1, b.temp.total_archery / d.temp.total_defense);
        //Base damage
        e = Math.round((Math.random() / 1.333 + .25) * e * f);
        f = "";
    //Block % of arrow dmg
        if (d.temp.archery_block) {
            var g = e;
            e = Math.round(e * (100 - d.temp.archery_block) / 100);
            g -= e;
            0 < g && (f = " (enemy blocked " + g + " damage)",
                d.b_t == BASE_TYPE.PLAYER && Player.send_message(d.id, "Blocked " + g + " archery damage", COLOR.GREEN, "archery"))
        }
        //If mob has less hp than calculated dmg
        e = Math.min(e, d.temp.health);

        b.b_t == BASE_TYPE.PLAYER && Player.send_message(b.id, "+" + e + " archery damage" + f, COLOR.GREEN, "archery");

        //Archery works like magic, so you can attack 2ce in combat or something? Not sure
    //If this is correct does it mean that if you are standing close more DPS since arrow fly faster?
        if (fights[a].second.id != b.id)
            return fights[a].second_magic_dmg += e,
                e;
        fights[a].first_magic_dmg += e;
        return e    
}
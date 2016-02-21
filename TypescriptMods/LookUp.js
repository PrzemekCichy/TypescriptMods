//Return object containing steps to cary out.
//1-2 parameters passed. 
/*
class LookUp {

    constructor(public a : number, public y: number, public z: number) { }

    static times(k: number, v: boolean) {
        return new LookUp(k * v.x, k * v.y, k * v.z);
    }
    
}
*/
var AutoSkill;
(function (AutoSkill) {
    var LookUp = (function () {
        //Create an instance of lookUp, which will contain steps requires to complete
        //a given action with certain parameters
        //Most methods run once, the purpose of this class is to calculate most important steps 
        function LookUp(action, params) {
            this.action = this.getAction(); //Fishing();
            this.actionType = action;
            this.params = params;
        }
        //Depending on user action different actions will execute 
        //Select appriopriate function and reference it to default variable called action
        LookUp.prototype.getAction = function () {
            switch (this.actionType) {
                case ("Gathering"):
                    return this.gathering;
            }
        };
        //Find object which matches the property from params array
        //and push number to array. 
        LookUp.prototype.gathering = function () {
            for (var i = 0; i < objects_data.length; i++) {
                for (var j = 0; j < this.params.length; j++) {
                    if (objects_data[i].name === this.params[j]) {
                        this.paramsId.push(i);
                    }
                }
            }
        };
        //When we have items, we need to find them on a map
        //The following function might not be the most optimal, due to slight redundancy when searching
        //Also it matches best case first, which is problematic for fighting as it often doesn't select
        //the most optimal pathing. More advanced algorithm shold be used to determine the most optimal
        //pathing
        LookUp.prototype.searchLoop = function () {
            var myX = players[0].i, myY = players[0].j;
            loop1: for (var i = 0; i < 10; i++) {
                var offset = 1 * i;
                for (var c = 0; c < 3 + 2 * i; c++) {
                    if (this.lookUp((myX - offset), (myY - offset + c))) {
                        break loop1;
                    }
                    else if (this.lookUp((myX + offset), (myY - offset + c))) {
                        break loop1;
                    }
                    else if (this.lookUp((myX - offset + c), (myY - offset))) {
                        break loop1;
                    }
                    else if (this.lookUp((myX - offset + c), (myY + offset))) {
                        break loop1;
                    }
                    ;
                }
            }
        };
        //Checks if the map location passed from searchLoop contains any object
        //If so, checks if it matches any object from parameters
        LookUp.prototype.lookUp = function (x, y) {
            //console.log("LookUp");
            if (on_map[current_map][x] !== undefined
                && on_map[current_map][x][y] !== undefined
                && on_map[current_map][x][y] !== false
                && on_map[current_map][x][y].id !== undefined) {
                for (var i = 0; i < this.paramsId.length; i++) {
                    if (on_map[current_map][x][y].id === this.paramsId[i]) {
                        this.objectsFound.push({ i: x, j: y });
                        return true;
                    }
                }
            }
            else {
                return false;
            }
        };
        return LookUp;
    })();
    AutoSkill.LookUp = LookUp;
})(AutoSkill || (AutoSkill = {}));
var greeter = new AutoSkill.LookUp("Gathering", ["Sand"]);
greeter.getAction();
//# sourceMappingURL=LookUp.js.map
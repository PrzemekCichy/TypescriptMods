function convertInput(userInput) {
    var actionArray = userInput.split("|");
    var actionParameterArray = [];
    //Callback in typescript, need to look more into those
    actionArray.forEach(function (parameter) {
        actionParameterArray.push(parameter.split(":"));
    });
    return actionParameterArray;
}
var o1 = convertInput("Gather:Sand | Destroy:Empty Medium Vial: Empty Small Vial: Uncut High Grade Crystal");
var o2 = convertInput("Gather: Coal:20:Iron:20 | Smelt:Coal:Iron | Destroy:Steel Bar");
var o3 = convertInput("Buy: Iron: 20 | Withdraw: Coal:20 | Smelt: Iron: Coal | Deposit: Steel Bar");
var AutoSkill;
(function (AutoSkill) {
    var LookUp = (function () {
        //Create an instance of lookUp, which will contain steps requires to complete
        //a given action with certain parameters
        //Most methods run once, the purpose of this class is to calculate most important steps 
        function LookUp(action, params) {
            this.action = function () { }; //Fishing();
            this.paramsId = [];
            this.objectsFound = [];
            this.actionType = action;
            this.params = params;
            this.getAction();
            this.action();
            this.searchLoop();
        }
        //Depending on user action different actions will execute 
        //Select appriopriate function and reference it to default variable called action
        LookUp.prototype.getAction = function () {
            switch (this.actionType) {
                case ("Gather"):
                    this.action = this.gather;
                    break;
                case ("Smelt"):
                    this.action = this.gather;
                    break;
                case ("Cook"):
                    this.action = this.gather;
                    break;
                case ("Fight"):
                    this.action = this.gather;
                    break;
                case ("Withdraw"):
                    this.action = this.gather;
                    break;
                case ("Deposit"):
                    this.action = this.gather;
                    break;
                case ("Buy"):
                    this.action = this.gather;
                    break;
                case ("Destroy"):
                    this.action = this.gather;
                    break;
                case ("Forge"):
                    this.action = this.gather;
                    break;
                case ("Craft"):
                    this.action = this.gather;
                    break;
            }
        };
        //Find object which matches the property from params array
        //and push number to array. 
        //If number if passed this should should just push a number
        LookUp.prototype.gather = function () {
            for (var i = 0; i < objects_data.length; i++) {
                for (var j = 0; j < this.params.length; j++) {
                    if (objects_data[i] !== undefined && objects_data[i].name === this.params[j]) {
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
var test = new AutoSkill.LookUp("Gathering", ["Sand"]);
var test1 = new AutoSkill.LookUp("Gathering", ["Furnace"]);
//# sourceMappingURL=LookUp.js.map
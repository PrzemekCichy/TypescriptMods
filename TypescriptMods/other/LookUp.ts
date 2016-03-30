﻿//game defined variables defined for compiler 
//Ambient Declarations
declare var objects_data;
declare var players;
declare var on_map;
declare var current_map;

/*
function convertInput(userInput) {
    var actionArray = userInput.split("|");
    var actionParameterArray = [];
    //Callback in typescript, need to look more into those
    actionArray.forEach(function (parameter) {
        actionParameterArray.push(parameter.split(":"));
    });
    return actionParameterArray;
}
var o1 = convertInput("gather:sand | destroy:Empty Medium Vial: Empty Small Vial: Uncut High Grade Crystal");
var o2 = convertInput("gather: Coal:20:Iron:20 | smelt:Coal:Iron | destroy:Steel Bar");
var o3 = convertInput("Buy: Iron: 20 | Withdraw: coal:20 | smelt: Iron: Coal | deposit: Steel Bar");
*/

interface objectCoordinates {
    x: number;
    y: number;
}

//Precondition: Pass a string with actions
//PpostCondition: create object which contains data to execute by engine
module AutoSkill {

    function convertInput(userInput) {
        var actionArray = userInput.split("|");
        var actionParameterArray = [];
        //Callback in typescript, need to look more into those
        actionArray.forEach(function (parameter) {
            actionParameterArray.push(parameter.split(":"));
        });
        return actionParameterArray;
    }

    export class LookUp {
        actionParameterArray = [];
        action = function () { };//Fishing();
        actionType: string;//Fishing
        params: string[];//Eg. Raw King crab
        paramsId: number[] = [];
        objectsFound: any[] = [];

        //Create an instance of lookUp, which will contain steps requires to complete
        //a given action with certain parameters
        //Most methods run once, the purpose of this class is to calculate most important steps 
        constructor(action: string) {
            this.actionType = action;
            this.getAction();
            this.action();
            this.searchLoop();
        }

        //Depending on user action different actions will execute 
        //Select appriopriate function and reference it to default variable called action
        getAction(): void {
            switch (this.actionType) {
                case ("Gather"):
                    this.action = this.gather;
            }
        }

        //Find object which matches the property from params array
        //and push number to array. 
        //If number if passed this should should just push a number
        gather(): void {
            for (var i = 0; i < objects_data.length; i++) {
                for (var j = 0; j < this.params.length; j++) {
                    if (objects_data[i] !== undefined && objects_data[i].name === this.params[j]) {
                        this.paramsId.push(i);
                    }
                }
            }
        }

        //When we have items, we need to find them on a map
        //The following function might not be the most optimal, due to slight redundancy when searching
        //Also it matches best case first, which is problematic for fighting as it often doesn't select
        //the most optimal pathing. More advanced algorithm shold be used to determine the most optimal
        //pathing
        searchLoop() {
            var myX = players[0].i, myY = players[0].j;

            loop1:
            for (var i = 0; i < 10; i++) {
                var offset = 1 * i;
                for (var c = 0; c < 3 + 2 * i; c++) {
                    if (this.lookUp((myX - offset), (myY - offset + c))) {
                        break loop1;
                    } else if (this.lookUp((myX + offset), (myY - offset + c))) {
                        break loop1;
                    } else if (this.lookUp((myX - offset + c), (myY - offset))) {
                        break loop1;
                    } else if (this.lookUp((myX - offset + c), (myY + offset))) {
                        break loop1;
                    };
                }
            }
        }

        //Checks if the map location passed from searchLoop contains any object
        //If so, checks if it matches any object from parameters
        lookUp(x, y): boolean {
            //console.log("LookUp");
            if (on_map[current_map][x] !== undefined
                && on_map[current_map][x][y] !== undefined
                && on_map[current_map][x][y] !== false
                && on_map[current_map][x][y].id !== undefined
            ) {
                for (var i = 0; i < this.paramsId.length; i++) {
                    if (on_map[current_map][x][y].id === this.paramsId[i]) {
                        this.objectsFound.push({ i: x, j: y });
                        return true;
                    }
                }
            } else {
                return false;
            }
        }

    }
}
var test = new AutoSkill.LookUp("Buy: Iron: 20 | Withdraw: coal:20 | smelt: Iron: Coal | deposit: Steel Bar");
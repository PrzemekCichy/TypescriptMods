declare var pets;

module BreedingMod {

    //Enable for enabling.disabling different features
    export class PetPair {
        firstId;
        secondId;
        //Empty constructor by default all true
        constructor(_firstId, _secondId) {
            this.firstId = _firstId;
            this.secondId = _secondId;
        }
    }

    //Modify this for according to personal preferences
    export var petPairs = [];

    export function generatePetPairs(n) {
        var pet1 = pets[n], pet2;

        petPairs.push(new PetPair(pet1, pet2));
    }

    generatePetPairs(0);


}

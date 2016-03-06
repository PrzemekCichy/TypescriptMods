declare var angular;
declare var itemsFromString;
declare var categoriesFromString;

var wikiApp = angular.module('wikiApp', ['smart-table']);
wikiApp.controller('ItemListCtrl', function ($scope) {
    $scope.items = itemsFromString;
    $scope.itemCategories = categoriesFromString;

    $scope.images = {
        5: 'images/dgweapon32.gif',
        6: 'images/dg_armor32.gif',
        7: 'images/dg_food32.gif',
        8: 'images/tools.gif',
        9: 'images/fish_new32.gif',
        10: 'images/dgmisc32.gif',
        11: 'images/dg_jewls32.gif',
        13: 'images/dg_dragon32.gif',
        15: 'images/dg_uniques32.gif',     
        16: 'images/alchemyitems2.gif',
        17: 'images/dg_monster532.gif', 
        31: 'images/mspell.gif',
        33: 'images/mweapons.gif',
        38: 'images/pets.gif',
        42: 'images/house_inv.gif',
        52: 'images/dgmisc2.gif',
        53: 'images/dgmisc3.gif',
        54: 'images/dgmisc4.gif',
        55: 'images/dgmisc5.gif',
        56: 'images/dg_armor2.gif'
    };

    $scope.predicates = ['name', 'lastName', 'birthDate', 'balance', 'email'];
    $scope.selectedPredicate = $scope.predicates[0];

    $scope.getBackgroundStyle = function (imagePath, x, y) {
        var url = 'url(' + $scope.images[imagePath] + ')';
        return {
            'background-image': url,
            'background-position': (x * -32 + 'px ' + y * -32 + 'px')

        };
    };

});

//# sourceMappingURL=controller.js.map
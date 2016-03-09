var map_json = map_json || [];
var wikiApp = angular.module('wikiApp', ['smart-table']);
wikiApp.controller('ItemListCtrl', function ($scope) {
    $scope.items = itemsFromString;
    $scope.itemCategories = categoriesFromString;
    $scope.images = {
        0: 'https://1239889624.rsc.cdn77.org/sheet/ground.gif',
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
wikiApp.controller('MapsCtrl', function ($scope) {
    //Use <HTMLCanvasElement> or var groundTilesCanvas : any = document.getElementById("groundTilesCanvas");
    var groundTilesCanvas = document.getElementById("groundTilesCanvas");
    var ctxGround = groundTilesCanvas.getContext('2d');
    $scope.groundBase = groundBaseFromString;
    var map_id = 0;
    $scope.maps = map_json[map_id];
    var imgGround = new Image();
    imgGround.src = "https://1239889624.rsc.cdn77.org/sheet/ground.gif";
    $scope.render = function () {
        var offsetX = 0;
        var offsetY = 0;
        $scope.maps = map_json[map_id];
        var tile;
        for (var xx = 100; xx < 10000; xx += 100) {
            for (var yx = 1; yx < 100; yx++) {
                tile = xx - yx;
                offsetX = 2700 + 27 * ($scope.maps[tile].i);
                offsetX -= 27 * (99 - ($scope.maps[tile].j));
                offsetY = 0 + 14 * (99 - $scope.maps[tile].j);
                offsetY += 14 * (($scope.maps[tile].i));
                ctxGround.drawImage(imgGround, $scope.groundBase[$scope.maps[tile].b_i].img.x * 54, $scope.groundBase[$scope.maps[tile].b_i].img.y * 34, 54, 34, offsetX, offsetY, 54, 34);
            }
        }
    };
    var clicked = false, clickY;
    $("#Maps").on({
        'mousemove': function (e) {
            clicked && updateScrollPos(e);
        },
        'mousedown': function (e) {
            clicked = true;
            clickY = e.pageY;
        },
        'mouseup': function () {
            clicked = false;
            $('#Maps').css('cursor', 'auto');
        }
    });
    var updateScrollPos = function (e) {
        $('#Maps').css('cursor', 'row-resize');
        $(window).scrollTop($(window).scrollTop() + (clickY - e.pageY));
    };
});
//# sourceMappingURL=controller.js.map 
//# sourceMappingURL=controller.js.map
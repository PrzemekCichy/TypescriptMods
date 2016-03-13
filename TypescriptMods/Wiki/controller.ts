﻿declare var angular;
declare var itemsFromString;
declare var categoriesFromString;
declare var groundBaseFromString;
declare var $;
var map_json = map_json || [];
var on_map_json = on_map_json || [];


var wikiApp = angular.module('wikiApp', ['smart-table']);
wikiApp.controller('ItemListCtrl', function ($scope) {
    $scope.items = itemsFromString;
    $scope.itemCategories = categoriesFromString;

    $scope.images = {
        0: 'https://1239889624.rsc.cdn77.org/sheet/ground.gif',
        1: 'https://1239889624.rsc.cdn77.org/sheet/ground2.gif',
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

    $scope.mapNames = [{"id":"0","name":"Dorpat"},{"id":"1","name":"Dungeon I"},{"id":"2","name":"Narwa"},{"id":"3","name":"Whiland"},{"id":"4","name":"Reval"},{"id":"5","name":"Rakblood"},{"id":"6","name":"Blood River"},{"id":"7","name":"Hell"},{"id":"8","name":"Clouds"},{"id":"9","name":"Heaven"},{"id":"10","name":"Cesis"},{"id":"11","name":"Walco"},{"id":"12","name":"Tutorial Island"},{"id":"13","name":"Pernau"},{"id":"14","name":"Fellin"},{"id":"15","name":"Dragon's Lair"},{"id":"16","name":"No Man's Land"},{"id":"17","name":"Ancient Dungeon"},{"id":"18","name":"Lost Woods"},{"id":"19","name":"Minigames"},{"id":"20","name":"Broceliande Forest"},{"id":"21","name":"Devil's Triangle"},{"id":"22","name":"Cathedral"},{"id":"23","name":"Illusion Guild"},{"id":"24","name":"Every Man's Land"},{"id":"25","name":"Moche"},{"id":"26","name":"Wittensten"},{"id":"27","name":"Dungeon II"},{"id":"28","name":"Dungeon III"},{"id":"29","name":"Dungeon IV"}]

      var loadMaps = function (a) {
        var mapFile:any = document.createElement('script');
        mapFile.setAttribute("type", "text/javascript");
        mapFile.setAttribute("src", "https://1239889624.rsc.cdn77.org/maps/map" + a + ".js");
        document.getElementsByTagName("head")[0].appendChild(mapFile);
        console.log("https://1239889624.rsc.cdn77.org/maps/map" + a + ".js")
     }

      for (var i in $scope.mapNames) {
          loadMaps(i);
      }

     //Use <HTMLCanvasElement> or var groundTilesCanvas : any = document.getElementById("groundTilesCanvas");
    var groundTilesCanvas:any = document.getElementById("groundTilesCanvas");
    var ctxGround = groundTilesCanvas.getContext('2d');

    var topTilesCanvas: any = document.getElementById("topTilesCanvas");
    var ctxTop = topTilesCanvas.getContext('2d');

    $scope.groundBase = groundBaseFromString;

    var imageGround = {};
    imageGround[2] = new Image();
    imageGround[2].src = "https://1239889624.rsc.cdn77.org/sheet/ground.gif";

    imageGround[46] = new Image();
    imageGround[46].src = "https://1239889624.rsc.cdn77.org/sheet/ground2.gif";

    var imgGroundTop = new Image();
    imgGroundTop.src = "https://1239889624.rsc.cdn77.org/sheet/pots_crates.gif";

    $scope.render = function (map_id) {
        ctxGround.clearRect(0, 0, groundTilesCanvas.width, groundTilesCanvas.height);
        var offsetX = 0, offsetY = 0, tile;
        var map_id = map_id || 0;
        $scope.maps = map_json[map_id];
        $scope.mapsTop = on_map_json[map_id];

        //Rendres from top
        for (var xx = 100; xx <= 10000; xx += 100) {
            for (var yx = 1; yx <= 100; yx++) {
                tile = xx - yx;
                offsetX = 2700 + 27 * ($scope.maps[tile].i);
                offsetX -= 27 * (99-($scope.maps[tile].j));
                offsetY = 0 + 14 * (99-$scope.maps[tile].j);
                offsetY += 14 * (($scope.maps[tile].i));    
                ctxGround.drawImage(imageGround[$scope.groundBase[$scope.maps[tile].b_i].img.sheet] , $scope.groundBase[$scope.maps[tile].b_i].img.x * 54, $scope.groundBase[$scope.maps[tile].b_i].img.y * 34, 54, 34, offsetX, offsetY, 54, 34);
                
            }
        }
        
        /*
        for (var tile in $scope.mapsTop) {
            //                ctxTop.drawImage(imgGroundTop, 7*54, 7*34, 54, 34, offsetX, offsetY, 54, 34);
            offsetX = 27 + 27 * ($scope.mapsTop[tile].i);
            offsetX += 27 * (($scope.mapsTop[tile].j));
            offsetY = 1400 - 28 - 14 * ($scope.mapsTop[tile].j);
            offsetY += 14 * (($scope.mapsTop[tile].i));
            if ($scope.maps[tile].b_i < $scope.groundBase.length) {
                //image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight
                ctxTop.drawImage(imgGroundTop, ($scope.groundBase[$scope.maps[tile].b_i].img.y + 1) * 54, ($scope.groundBase[$scope.maps[tile].b_i].img.x + 1) * 50, 54, 50, offsetX, offsetY, 54, 50);
            } else {
                //ctxTop.drawImage(imgGroundTop, 54, 50, 54, 50, offsetX, offsetY, 54, 50);
            }
        }
        */
    }
    var clicked = false, clickY, clickX;;
    $("#Maps").on({
        'mousemove': function (e) {
            clicked && updateScrollPos(e);
        },
        'mousedown': function (e) {
            clicked = true;
            clickY = e.pageY;
            clickX = e.pageX;
        },
        'mouseup': function () {
            clicked = false;
            $('#Maps').css('cursor', 'auto');
        }
    });

    var updateScrollPos = function (e) {
        $('#Maps').css('cursor', 'row-resize');
        $('#Maps').scrollTop($('#Maps').scrollTop() + (clickY - e.pageY));
        $('#Maps').scrollLeft($('#Maps').scrollLeft() + (clickX - e.pageX));
    }
});


wikiApp.controller('ScrollController', ['$scope', '$location', '$anchorScroll',
        function ($scope, $location, $anchorScroll) {
            $scope.gotoMaps = function () {
                // set the location.hash to the id of
                // the element you wish to scroll to.
                $location.hash('mapsMenu');
                // call $anchorScroll()
                $anchorScroll();
            };
            $scope.gotoWiki = function () {
                // set the location.hash to the id of
                // the element you wish to scroll to.
                $location.hash('wikiAnchor');
                // call $anchorScroll()
                $anchorScroll();
            };
        }]);

//# sourceMappingURL=controller.js.map
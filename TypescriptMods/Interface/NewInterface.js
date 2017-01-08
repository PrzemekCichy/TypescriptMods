var Interface;
(function (Interface) {
    var Colours = (function () {
        function Colours() {
        }
        Colours.prototype.changeColour = function (domElement, colour) {
            if (domElement == undefined) {
                return;
            }
            domElement.style.color = colour;
        };
        Colours.prototype.changeOpacity = function (domElement, opacity) {
            if (domElement == undefined) {
                return;
            }
            domElement.style.opacity = opacity;
        };
        return Colours;
    }());
    new Colours();
})(Interface || (Interface = {}));
//# sourceMappingURL=NewInterface.js.map
module Interface {
    class Colours {
        constructor() {
            
        }

        public changeMenu

        private changeColour(domElement: HTMLBaseElement, colour: string) {
            if (domElement == undefined) {
                return;
            }
            domElement.style.color = colour;
        }

        private changeOpacity(domElement: HTMLBaseElement, opacity: string) {
            if (domElement == undefined) {
                return;
            }
            domElement.style.opacity = opacity;
        }
    }
    new Colours();
}


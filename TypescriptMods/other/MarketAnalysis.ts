interface Offer {
    id: number;
    type: string;
    other?: string;
}

function add(offer: Offer) {
    var id = offer.id;
}

function remove(offer: Offer) {
    var id = offer.id;
}

add({ id: 12, type: "Buy" });  

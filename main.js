

// load pokemon from json url into a POKEMON_DATA, updating data and reloading page
// const url = 'https://raw.githubusercontent.com/chase-manning/pokemon-tcg-pocket-cards/refs/heads/main/v4.json';
const url = 'https://raw.githubusercontent.com/chrisn5413/CARDS-PokemonPocket-scrapper/refs/heads/main/pokemon_cards.json'
let CONTAINER = document.getElementById('card-container');

const CARD_DATA_BY_SET = new Map();

const TRAINER_CARDS = new Set();
const SUPPORT_CARDS = new Set();
const ITEMS_CARDS = new Set();

const POKEMON_CARDS = new Set();

// this is a map in case more types come out (fairy)
const POKEMON_BY_TYPE = new Map();

const STAGE_BASIC = new Set();
const STAGE_ONE = new Set();
const STAGE_TWO = new Set();

// map these instead in case more rarities come out
// const CROWN_RARE_CARDS = new Set();
// const THREE_STAR_CARDS = new Set();
// const TWO_STAR_CARDS = new Set();
// // const TWO_STAR_SHINY_CARDS = new Set();
// const ONE_STAR_CARDS = new Set();
// const FOUR_DIAMOND_CARDS = new Set();
// const THREE_DIAMOND_CARDS = new Set();
// const TWO_DIAMOND_CARDS = new Set();
// const ONE_DIAMOND_CARDS = new Set();


let ALL_CARD_DATA;
(async () => {
    let promiseResult = await fetch(url);
    ALL_CARD_DATA = await promiseResult.json();
    // newUpdatePokemonData();
    // reloadCardContainer(ALL_CARD_DATA);
})();


// adds more details to card data
// function updatePokemonData() {
//     let realId = 0;
//     for (let pokemon of ALL_CARD_DATA) {
//         realId++;
//         pokemon.realId = realId;
//
//         let cardType = pokemon.health === "" ? "non-pokemon" : "pokemon";
//         let fullart = pokemon.fullart === "Yes" ? " fullart" : '';
//         let pack = ` pack:${pokemon.pack}`;
//        
//         let pokeDiv = document.createElement('div');
//         pokeDiv.className = `${cardType} ${pokemon.realId} ${pokemon.name} ${pokemon.rarity}${fullart}${pack}`;
//        
//         let pokeImg = document.createElement('img');
//         pokeImg.id = pokemon.realId;
//         pokeImg.loading = "lazy";
//         pokeImg.src = pokemon.image;
//         pokeImg.alt = `${pokemon.name} ${pokemon.realId}`;
//        
//         pokeDiv.appendChild(pokeImg);
//         pokemon.pokeDiv = pokeDiv;
//     }
// }

function newUpdatePokemonData() {
    let chronologicalId = 0;
    for (let card of ALL_CARD_DATA) {
        chronologicalId++;
        card.chronologicalId = chronologicalId;

        let cardImg = document.createElement('img');
        cardImg.id = card.chronologicalId;
        cardImg.loading = "lazy";
        cardImg.src = card.image;
        cardImg.alt = `${card.name} ${card.chronologicalId}`;

        card.cardImg = cardImg;

        // add card to list mapped by set name or create if nonexistent
        if (CARD_DATA_BY_SET.has(card.set_details)) {
            CARD_DATA_BY_SET.get(card.set_details).push(card);
        } else {
            CARD_DATA_BY_SET.set(card.set_details, [card])
        }

        // update trainer, item, and supporter cards sets
        if (card.card_type.includes('Trainer')) {
            TRAINER_CARDS.add(card);

            if (card.card_type.includes('Supporter')) 
                SUPPORT_CARDS.add(card);
            if (card.card_type.includes('Item'))
                ITEMS_CARDS.add(card);
        } else if (card.card_type.includes) {

        }

        
    }
}

// loads cards onto page given pokemon objects in a collection
function reloadCardContainer(newData) {
    if(typeof newData !== 'object')
        return;

    // 30ms between every card loading
    let secondsBetweenLoading = 0.03;
    let currentSeconds = 0;
    let counter = 0;
    
    CONTAINER.replaceChildren()
    for (let card of newData) {
        // controls loading between sequential cards
        currentSeconds += secondsBetweenLoading;
        
        // every 30 pokemon, reduce speed between loading by 5ms
        counter++;
        if(counter > 30 && secondsBetweenLoading > 0) {
            counter = 0;
            secondsBetweenLoading -= 0.005;
        }
        
        setTimeout(() => {
            CONTAINER.append(card.cardImg)
        }, currentSeconds * 1000);
    }
    // document.getElementsByTagName('body')[0].appendChild(CONTAINER);
}


function expandAllImageSizes() {
    const images = document.querySelectorAll('div img');
    images.forEach(image => {
        image.width += 75;
    });
}
function shrinkAllImageSizes() {
    const images = document.querySelectorAll('div img');
    images.forEach(image => {
        image.width -= 75;
    });
}
function resetImages() {
    for (let pokemon of ALL_CARD_DATA) {
        pokemon.pokeDiv.querySelector('img').removeAttribute('width');
    }

function filterBy() {

}

function sortBy(){

}
}



// load pokemon from json url into a POKEMON_DATA, updating data and reloading page
// const url = 'https://raw.githubusercontent.com/chase-manning/pokemon-tcg-pocket-cards/refs/heads/main/v4.json';
const url = 'https://raw.githubusercontent.com/chrisn5413/CARDS-PokemonPocket-scrapper/refs/heads/main/pokemon_cards.json'

// let CONTAINER;
let ALL_CARD_DATA;
let CURRENT_PAGE_CARD_DATA;
const CONTAINER = document.getElementById('card-container');

(async () => {
    let promiseResult = await fetch(url);
    ALL_CARD_DATA = await promiseResult.json();
    CURRENT_PAGE_CARD_DATA = ALL_CARD_DATA;
    updatePokemonData();
    reloadCardContainer(CONTAINER, CURRENT_PAGE_CARD_DATA);
    // reloadCardContainer(createNewCardContainer(), CURRENT_PAGE_CARD_DATA);
})();

const rarity = {
    "":0,
    "◊":1,
    "◊◊":2,
    "◊◊◊":3,
    "◊◊◊◊":4,
    "☆":5,
    "☆☆":6,
    "☆☆☆":7,
    "Crown Rare":8
}

const default_image_width = 367;
let current_image_width = default_image_width;

// updates each card with new data to make finding/sorting/filtering easier
function updatePokemonData() {
    let chronologicalId = 0;
    for (let card of ALL_CARD_DATA) {
        chronologicalId++;
        card.chronologicalId = chronologicalId;
        card.rarityNum = rarity[card.rarity]
        card.json = JSON.stringify(card);

        let cardImg = document.createElement('img');
        cardImg.id = card.chronologicalId;
        cardImg.loading = "lazy";
        cardImg.src = `./PokemonImages/${chronologicalId}.webp`;
        cardImg.alt = `${card.name} ${card.chronologicalId}`;

        card.cardImg = cardImg;
    }
}

// Called to create a new card container every time cards are loaded
// function createNewCardContainer() {
//     let container = document.getElementById('card-container');
//     if (container !== null)
//         container.remove();

//     container = document.createElement('div');
//     container.id = 'card-container';
//     document.getElementsByTagName('body')[0].append(container);

//     return container;
// }

// loads cards onto page given pokemon objects in a collection
function reloadCardContainer(container, newData) {
    if(typeof newData !== 'object')
        return;

    container.replaceChildren();

    for (let card of newData) {
        container.append(card.cardImg);
    }
    
    // keeping this in, in memory of my waste of time lmao, turns out browsers and phones are smart
    // and I don't need to baby them with delayed loading
    
    // // 30ms between every card loading
    // let secondsBetweenLoading = 0.03;
    // let currentSeconds = 0;
    // let counter = 0;
    //
    // for (let card of newData) {
    //     // controls loading between sequential cards
    //     currentSeconds += secondsBetweenLoading;
    //    
    //     // every 30 pokemon, reduce speed between loading by 5ms
    //     counter++;
    //     if(counter > 30 && secondsBetweenLoading > 0) {
    //         counter = 0;
    //         secondsBetweenLoading -= 0.005;
    //     }
    //    
    //     setTimeout(() => {
    //         container.append(card.cardImg)
    //     }, currentSeconds * 1000);
    // }
}

const image_resize_amount = 50;
const min_image_width = 67;
const max_image_width = 567;
function expandAllImageSizes() {
    changeImageSize(current_image_width + image_resize_amount);
}
function shrinkAllImageSizes() {
    changeImageSize(current_image_width - image_resize_amount);
}
function resetImages() {
    changeImageSize(default_image_width);
}
function changeImageSize(new_width) {
    if (new_width < min_image_width || new_width > max_image_width)
        return;

    current_image_width = new_width;
    // CONTAINER = createNewCardContainer();
    
    for (let card of ALL_CARD_DATA) {
        card.cardImg.setAttribute('width', current_image_width);
    }

    reloadCardContainer(CONTAINER, CURRENT_PAGE_CARD_DATA);
    // reloadCardContainer(createNewCardContainer(), CURRENT_PAGE_CARD_DATA);
}

const TYPE_FILTER = new Set();
const RARITY_NUM_FILTER = new Set();
const BOOSTER_FILTER = new Set();

function updateFilterText() {
    let types = Array.from(TYPE_FILTER.keys());
    let rarity = Array.from(RARITY_NUM_FILTER.keys());
    let booster = Array.from(BOOSTER_FILTER.keys());
    document.getElementsByClassName('filter-selection-text')[0].innerHTML = types.concat(rarity, booster).join(', ');
}

function updateFilters(category, value) {
    if (category === "type") {
        if (TYPE_FILTER.has(value))
            TYPE_FILTER.delete(value);
        else
            TYPE_FILTER.add(value)
    } else if (category === "rarityNum") {
        if (RARITY_NUM_FILTER.has(value))
            RARITY_NUM_FILTER.delete(value);
        else
            RARITY_NUM_FILTER.add(value)
    } else if (category === "booster") {
        if (BOOSTER_FILTER.has(value))
            BOOSTER_FILTER.delete(value);
        else
            BOOSTER_FILTER.add(value)
    } else {
        print('dont call this improperly');
        return;
    }

    updateFilterText();    
}

function loadFilter() {
    CURRENT_PAGE_CARD_DATA = ALL_CARD_DATA;
    if (BOOSTER_FILTER.size > 0) {
        CURRENT_PAGE_CARD_DATA = CURRENT_PAGE_CARD_DATA.filter(card => {
            for (const boosterName of BOOSTER_FILTER)
                if (boosterName === card.set_details)
                    return true;
            return false;
        });
    }

    if (RARITY_NUM_FILTER.size > 0) {
        CURRENT_PAGE_CARD_DATA = CURRENT_PAGE_CARD_DATA.filter(card => {
            for (const rarityNum of RARITY_NUM_FILTER) {
                if (rarityNum === card.rarityNum) 
                    return true;
            }
            return false;
        });
    }

    if (TYPE_FILTER.size > 0) {
        CURRENT_PAGE_CARD_DATA = CURRENT_PAGE_CARD_DATA.filter(card => {
            for (const type of TYPE_FILTER) {
                if (type === card.type)
                    return true;
            }
            return false;
        });
    }

    reloadCardContainer(CONTAINER, CURRENT_PAGE_CARD_DATA);
    // reloadCardContainer(createNewCardContainer(), CURRENT_PAGE_CARD_DATA);
}


function resetFilter() {
    TYPE_FILTER.clear();
    RARITY_NUM_FILTER.clear();
    BOOSTER_FILTER.clear();
    updateFilterText();
    CURRENT_PAGE_CARD_DATA = ALL_CARD_DATA;
    reloadCardContainer(CONTAINER, CURRENT_PAGE_CARD_DATA);
    // reloadCardContainer(createNewCardContainer(), CURRENT_PAGE_CARD_DATA);
}


let sortOption = "chronologicalId";
let ascending = 1;

function sortByCardId() {
    if (sortOption === "chronologicalId"){
        ascending *= -1;
    } else {
        sortOption = "chronologicalId";
        ascending = 1;
    }
    sortByOption("chronologicalId", ascending);
    document.getElementsByClassName('sort-selection-text')[0].innerHTML = 'Card Id';
}

function sortByCardType() {
    if (sortOption === "type"){
        ascending *= -1;
    } else {
        sortOption = "type";
        ascending = 1;
    }
    sortByOption("type", ascending);
    document.getElementsByClassName('sort-selection-text')[0].innerHTML = 'Card Type';
}

function sortByCardRarity() {
    if (sortOption === "rarityNum"){
        ascending *= -1;
    } else {
        sortOption = "rarityNum";
        ascending = -1;
    }
    sortByOption("rarityNum", ascending);
    document.getElementsByClassName('sort-selection-text')[0].innerHTML = 'Rarity';
}

function sortByOption(option, ascending){
    CURRENT_PAGE_CARD_DATA = sortArrayByProperty(ascending, CURRENT_PAGE_CARD_DATA, option);
    reloadCardContainer(CONTAINER, CURRENT_PAGE_CARD_DATA);
    // reloadCardContainer(createNewCardContainer(), CURRENT_PAGE_CARD_DATA);
}

function resetPage() {
    CURRENT_PAGE_CARD_DATA = ALL_CARD_DATA;
    reloadCardContainer(CONTAINER, CURRENT_PAGE_CARD_DATA);
    // reloadCardContainer(createNewCardContainer(), CURRENT_PAGE_CARD_DATA);
 }

// stolen from google
function sortArrayByProperty(ascending, arr, property) {
    return arr.toSorted((a, b) => {
        if (a[property] < b[property]) {
            return -1 * ascending;
        }
        if (a[property] > b[property]) {
            return 1 * ascending;
        }
        return 0;
    });
}


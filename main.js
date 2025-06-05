// A Pokemon Pocket TCG sorting page

// Created by Christopher Nguyen
// Credits:
// - images & card data: limitless tcg
// - scraper that grabbed their images: LucachuTW and collaborators on github

// load pokemon from json url into a POKEMON_DATA, updating data and reloading page
const url = 'https://raw.githubusercontent.com/chrisn5413/CARDS-PokemonPocket-scrapper/refs/heads/main/pokemon_cards.json'

let ALL_CARD_DATA;
let CURRENT_PAGE_CARD_DATA;
const CONTAINER = document.getElementById('card-container');

// loads initial page
(async () => {
    let promiseResult = await fetch(url);
    ALL_CARD_DATA = await promiseResult.json();
    CURRENT_PAGE_CARD_DATA = ALL_CARD_DATA;
    updatePokemonData();
    reloadCardContainer(CURRENT_PAGE_CARD_DATA);
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
        card.json = JSON.stringify(Object.values(card)).toLowerCase();

        let cardImg = document.createElement('img');
        cardImg.id = card.chronologicalId;
        cardImg.loading = "lazy";
        cardImg.src = `./PokemonImages/${chronologicalId}.webp`;
        cardImg.alt = `${card.name} ${card.chronologicalId}`;

        card.cardImg = cardImg;
    }
}

// loads cards onto page given pokemon objects in a collection
function reloadCardContainer(newData) {
    if(typeof newData !== 'object')
        return;

    CONTAINER.replaceChildren();

    for (let card of newData) {
        CONTAINER.append(card.cardImg);
    }
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
    
    for (let card of ALL_CARD_DATA) {
        card.cardImg.setAttribute('width', current_image_width);
    }

    reloadCardContainer(CURRENT_PAGE_CARD_DATA);
}

const TYPE_FILTER = new Set();
const RARITY_NUM_FILTER = new Set();
const BOOSTER_FILTER = new Set();
const USER_SEARCH_FIELD = document.getElementById('user-search');

// this is the visual indicator for selected filters
function updateFilterText() {
    let types = Array.from(TYPE_FILTER.keys());
    let rarity = Array.from(RARITY_NUM_FILTER.keys());
    let booster = Array.from(BOOSTER_FILTER.keys());
    document.getElementsByClassName('filter-selection-text')[0].innerHTML = types.concat(rarity, booster).join(', ');
}

// this adds and removes filters every time one is selected
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

// reloads page based on selected types, rarity, booster, and user input
function loadPage() {
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

    if (USER_SEARCH_FIELD.value) {
        CURRENT_PAGE_CARD_DATA = CURRENT_PAGE_CARD_DATA.filter(card => {
            let search = USER_SEARCH_FIELD.value.toLowerCase().split(' ');
            
            for (let word of search) {
                if (word.includes('_'))
                    word = word.replace('_',' ');
                
                if (card.json.includes(word))
                    return true;
            }
            return false;
        });
    }

    reloadCardContainer(CURRENT_PAGE_CARD_DATA);
}

// clears all selected filters and resets page
function clearFilter() {
    TYPE_FILTER.clear();
    RARITY_NUM_FILTER.clear();
    BOOSTER_FILTER.clear();
    updateFilterText();
}

// default sort on fresh page
let sortOption = "chronologicalId";
let ascending = 1;

// sorts by id, reverses the sort if previous sort was the same
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

// sorts by type, reverses the sort if previous sort was the same
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

// sorts by rarity, reverses the sort if previous sort was the same
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

// called by specific sorts and loads page accordingly
function sortByOption(option, ascending){
    CURRENT_PAGE_CARD_DATA = sortArrayByProperty(ascending, CURRENT_PAGE_CARD_DATA, option);
    reloadCardContainer(CURRENT_PAGE_CARD_DATA);
}

// restarts page to original sort order and no filter
function resetPage() {
    document.getElementsByClassName('sort-selection-text')[0].innerHTML = 'Card Id';
    sortOption = "chronologicalId";
    ascending = 1;

    clearFilter();

    document.getElementById('user-search').value = ""
    
    CURRENT_PAGE_CARD_DATA = ALL_CARD_DATA;
    reloadCardContainer(CURRENT_PAGE_CARD_DATA);
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
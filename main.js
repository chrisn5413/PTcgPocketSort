

// load pokemon from json url into a POKEMON_DATA, updating data and reloading page
// const url = 'https://raw.githubusercontent.com/chase-manning/pokemon-tcg-pocket-cards/refs/heads/main/v4.json';
const url = 'https://raw.githubusercontent.com/chrisn5413/CARDS-PokemonPocket-scrapper/refs/heads/main/pokemon_cards.json'

// let CONTAINER;
let ALL_CARD_DATA;
let CURRENT_PAGE_CARD_DATA;
(async () => {
    let promiseResult = await fetch(url);
    ALL_CARD_DATA = await promiseResult.json();
    CURRENT_PAGE_CARD_DATA = ALL_CARD_DATA;
    updatePokemonData();
    reloadCardContainer(createNewCardContainer(), CURRENT_PAGE_CARD_DATA);
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
function updatePokemonData() {
    let chronologicalId = 0;
    for (let card of ALL_CARD_DATA) {
        chronologicalId++;
        card.chronologicalId = chronologicalId;
        card.rarityNum = rarity[card.rarity]

        let cardImg = document.createElement('img');
        cardImg.id = card.chronologicalId;
        cardImg.loading = "lazy";
        cardImg.src = card.image;
        cardImg.alt = `${card.name} ${card.chronologicalId}`;

        card.cardImg = cardImg;
    }
}

function createNewCardContainer() {
    let container = document.getElementById('card-container');
    if (container !== null)
        container.remove();

    container = document.createElement('div');
    container.id = 'card-container';
    document.getElementsByTagName('body')[0].append(container);

    return container;
}

// loads cards onto page given pokemon objects in a collection
function reloadCardContainer(container, newData) {
    if(typeof newData !== 'object')
        return;

    // 30ms between every card loading
    let secondsBetweenLoading = 0.03;
    let currentSeconds = 0;
    let counter = 0;

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
            container.append(card.cardImg)
        }, currentSeconds * 1000);
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
    // CONTAINER = createNewCardContainer();
    
    for (let card of ALL_CARD_DATA) {
        card.cardImg.setAttribute('width', current_image_width);
    }

    // reloadCardContainer(CONTAINER, CURRENT_PAGE_CARD_DATA);
    reloadCardContainer(createNewCardContainer(), CURRENT_PAGE_CARD_DATA);
}

function filterBy() {

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
}

function sortByCardType() {
    if (sortOption === "type"){
        ascending *= -1;
    } else {
        sortOption = "type";
        ascending = 1;
    }
    sortByOption("type", ascending);
}

function sortByCardRarity() {
    if (sortOption === "rarityNum"){
        ascending *= -1;
    } else {
        sortOption = "rarityNum";
        ascending = -1;
    }
    sortByOption("rarityNum", ascending);
}

function sortByOption(option, ascending){
    CURRENT_PAGE_CARD_DATA = sortArrayByProperty(ascending, CURRENT_PAGE_CARD_DATA, option);
    reloadCardContainer(createNewCardContainer(), CURRENT_PAGE_CARD_DATA);
}

function resetSortOptions() {
    CURRENT_PAGE_CARD_DATA = ALL_CARD_DATA;
    reloadCardContainer(createNewCardContainer(), CURRENT_PAGE_CARD_DATA);
 }

// stolen from google
function sortArrayByProperty(ascending, arr, property) {
  if(ascending === 1) {
    return arr.toSorted((a, b) => {
        if (a[property] < b[property]) {
            return -1;
        }
        if (a[property] > b[property]) {
            return 1;
        }
        return 0;
    });
  } 
  else {
    return arr.toSorted((a, b) => {
    if (a[property] < b[property]) {
      return 1;
    }
    if (a[property] > b[property]) {
      return -1;
    }
    return 0;
  });
  }
}

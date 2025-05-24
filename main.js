

// load pokemon from json url into a POKEMON_DATA, updating data and reloading page
const url = 'https://raw.githubusercontent.com/chase-manning/pokemon-tcg-pocket-cards/refs/heads/main/v4.json';
const CONTAINER = document.getElementById('card-container');
let ALL_POKEMON_DATA;
let SETS = [];
let POKEMON_DATA_BY_SET = [];
(async () => {
    let promiseResult = await fetch(url);
    ALL_POKEMON_DATA = await promiseResult.json();
    updatePokemonData();
    reloadCardContainer(ALL_POKEMON_DATA);
})();


// adds more details to card data
// chronological id, html image, etc
// todo: card description
function updatePokemonData() {
    let realId = 0;
    for (let pokemon of ALL_POKEMON_DATA) {
        realId++;
        pokemon.realId = realId;

        let cardType = pokemon.health === "" ? "non-pokemon" : "pokemon";
        let fullart = pokemon.fullart === "Yes" ? " fullart" : '';
        let pack = ` pack:${pokemon.pack}`;
        
        let pokeDiv = document.createElement('div');
        pokeDiv.className = `${cardType} ${pokemon.realId} ${pokemon.name} ${pokemon.rarity}${fullart}${pack}`;
        
        let pokeImg = document.createElement('img');
        pokeImg.id = pokemon.realId;
        pokeImg.loading = "lazy";
        pokeImg.src = pokemon.image;
        pokeImg.alt = `${pokemon.name} ${pokemon.realId}`;
        
        pokeDiv.appendChild(pokeImg);
        pokemon.pokeDiv = pokeDiv;
    }
}

// loads cards onto page given pokemon objects in an object
function reloadCardContainer(newData) {
    if(typeof newData !== 'object')
        return;

    // 30ms between every card loading
    let secondsBetweenLoading = 0.03;
    let currentSeconds = 0;
    let counter = 0;
    
    CONTAINER.replaceChildren()
    for (let pokemon of newData) {
        // controls loading between sequential cards
        currentSeconds += secondsBetweenLoading;
        
        // every 30 pokemon, reduce speed between loading by 5ms
        counter++;
        if(counter > 30 && secondsBetweenLoading > 0) {
            counter = 0;
            secondsBetweenLoading -= 0.005;
        }
        
        setTimeout(() => {
            CONTAINER.append(pokemon.pokeDiv)
        }, currentSeconds * 1000);
    }
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
    for (let pokemon of ALL_POKEMON_DATA) {
        pokemon.pokeDiv.querySelector('img').removeAttribute('width');
    }

function filterBy() {

}

function sortBy(){

}
}

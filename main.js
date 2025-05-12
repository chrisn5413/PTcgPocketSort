
/*var response = fetch('https://raw.githubusercontent.com/chase-manning/pokemon-tcg-pocket-cards/refs/heads/main/v4.json')
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById('card-container');
        print(container)
        
        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `<h3>${item.title}</h3><p>${item.description}</p>`;
            container.appendChild(card);
        });
    });*/

const url = 'https://raw.githubusercontent.com/chase-manning/pokemon-tcg-pocket-cards/refs/heads/main/v4.json'

// const POKEMON_PROMISE_RESULT = await fetch(url)
// const POKEMON_DATA = await POKEMON_PROMISE_RESULT.json()

const CONTAINER = document.getElementById('card-container')
let POKEMON_DATA
let pokemonPromise = (async () => {
    let promiseResult = await fetch(url)
    let response = await promiseResult.json()
    POKEMON_DATA = response
    updatePokemonData()
    reloadCardContainer(POKEMON_DATA)
})()


// adds more details to card data
// chronological id, html element + image, etc
// todo: card description
function updatePokemonData() {
    let realId = 0
    for (let pokemon of POKEMON_DATA) {
        realId++
        pokemon.realId = realId

        let cardType = pokemon.health === "" ? "non-pokemon" : "pokemon"
        let ex = pokemon.ex == "Yes" ? ' Ex' : ''
        let fullart = pokemon.fullart == "Yes" ? " fullart" : ''
        let pack = ` pack:${pokemon.pack}`

        const card = document.createElement('div')
        card.className = `${cardType} ${pokemon.realId} ${pokemon.name} ${pokemon.rarity}${ex}${fullart}${pack}`
        card.innerHTML = `<img src=\"${pokemon.image}\" alt=\"${pokemon.name} ${pokemon.realId}\">`

        pokemon.div = card
    }
}

function reloadCardContainer(newData) {
    if(typeof newData !== 'object')
        return

    CONTAINER.replaceChildren()
    for (let pokemon of newData) {
        CONTAINER.append(pokemon.div)
    }
}
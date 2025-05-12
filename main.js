
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
(async () => {
    let promiseResult = await fetch(url)
    let response = await promiseResult.json()
    POKEMON_DATA = response
})()


// adds more details to card data
// chronological id, html element + image, etc
// todo: card description
function updatePokemonData() {
    let realId = 0
    for (let pokemon of POKEMON_DATA) {
        realId++
        pokemon.realId = realId

        const card = document.createElement('div')
        card.className = 'card'
        card.innerHTML = `<img src=\"${pokemon.image}\" alt=\"${pokemon.name} ${pokemon.realID}\">`
        pokemon.div = card
    }
}
function reloadCardContainer(newData) {
    CONTAINER.replaceChildren(newData)
}
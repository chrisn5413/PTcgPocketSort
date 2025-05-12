
var response = fetch('https://raw.githubusercontent.com/chase-manning/pokemon-tcg-pocket-cards/refs/heads/main/v4.json')
    /*.then(res => res.json())
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

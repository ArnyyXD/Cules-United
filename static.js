// static.js

// Static data for iconic players
const iconicPlayers = [
    {
        name: "Lionel Messi",
        nationality: "Argentina",
        image: "photos/Messi.jpg",
        description: "Widely regarded as one of the greatest football players of all time."
    },
    {
        name: "Xavi Hernandez",
        nationality: "Spain",
        image: "photos/Xavi.jpg",
        description: "One of the best midfielders in football history, known for his vision and passing."
    },
    {
        name: "Andrés Iniesta",
        nationality: "Spain",
        image: "photos/Iniesta.jpg",
        description: "A key figure in Barcelona's golden era, renowned for his dribbling and playmaking."
    },
    {
        name: "Ronaldinho",
        nationality: "Brazil",
        image: "photos/Ronaldinho.jpg",
        description: "Known for his flair and creativity, he brought joy and magic to the game."
    },
    {
        name: "Johan Cruyff",
        nationality: "Netherlands",
        image: "photos/Cruyff.jpg",
        description: "An influential figure in football, known for his skill and tactical understanding."
    },
    {
        name: "Carles Puyol",
        nationality: "Spain",
        image: "photos/Puyol.jpg",
        description: "A legendary defender and captain, known for his leadership and determination."
    },
    {
        name: "Gerard Piqué",
        nationality: "Spain",
        image: "photos/Pique.jpg",
        description: "A key defender for Barcelona and the Spanish national team."
    },
    {
        name: "Samuel Eto'o",
        nationality: "Cameroon",
        image: "photos/Eto.jpg",
        description: "One of the best strikers of his generation, known for his speed and goal-scoring ability."
    },
    {
        name: "Ronald Koeman",
        nationality: "Netherlands",
        image: "photos/Koeman.jpg",
        description: "A versatile defender and midfielder, known for his free-kick taking."
    },
    {
        name: "César Rodríguez",
        nationality: "Spain",
        image: "photos/Cesar.jpg",
        description: "One of Barcelona's all-time top scorers and a key player in the 1940s."
    },
    {
        name: "Pep Guardiola",
        nationality: "Spain",
        image: "photos/Guardiola.jpg",
        description: "One of the most successful managers in football history."
    },
    {
        name: "Frank Rijkaard",
        nationality: "Netherlands",
        image: "photos/Rijkaard.jpg",
        description: "Former player and manager, known for his tactical acumen."
    },
    {
        name: "Dani Alves",
        nationality: "Brazil",
        image: "photos/Alves.jpg",
        description: "One of the most decorated players in football history."
    },
    {
        name: "Luis Suárez",
        nationality: "Uruguay",
        image: "photos/Suarez.jpg",
        description: "One of the best strikers of his generation, known for his finishing and intelligent play."
    },
    {
        name: "Neymar Jr.",
        nationality: "Brazil",
        image: "photos/Neymar.jpg",
        description: "A skillful forward known for his flair and ability to score."
    },
    {
        name: "Sergio Busquets",
        nationality: "Spain",
        image: "photos/Busquets.jpg",
        description: "One of the best defensive midfielders of his era."
    },
    {
        name: "David Villa",
        nationality: "Spain",
        image: "photos/Villa.jpg",
        description: "A prolific striker known for his finishing ability."
    },
    {
        name: "Ivan Rakitić",
        nationality: "Croatia",
        image: "photos/Rakitic.jpg",
        description: "An important midfielder known for his passing and vision."
    },
    {
        name: "Bojan Krkić",
        nationality: "Spain",
        image: "photos/Bojan.jpg",
        description: "A promising talent who made his mark at a young age."
    },
    {
        name: "Eusébio",
        nationality: "Portugal",
        image: "photos/Eusebio.jpg",
        description: "One of the greatest players of all time, known for his goal-scoring prowess."
    },
    {
        name: "R9 (Ronaldo Nazário)",
        nationality: "Brazil",
        image: "photos/R9.jpg",
        description: "A two-time FIFA World Player of the Year known for his incredible skills."
    },
    {
        name: "Marc-André ter Stegen",
        nationality: "Germany",
        image: "photos/Ter Stegen.jpg",
        description: "A world-class goalkeeper known for his shot-stopping ability."
    },
    {
        name: "Diego Maradona",
        nationality: "Argentina",
        image: "photos/Maradona.jpg",
        description: "Also known as God of Football with excellent dribbling and shooting."
    },
    {
        name: "Claudio Bravo",
        nationality: "Chile",
        image: "photos/Bravo.jpg",
        description: "A reliable goalkeeper who played an important role at the club."
    },
    {
        name: "Hristo Stoichkov",
        nationality: "Bulgaria",
        image: "photos/Stoichkov.jpg",
        description: "One of the most talented forwards, known for his goal-scoring ability."
    },
    {
        name: "Michael Laudrup",
        nationality: "Denmark",
        image: "photos/Michael.jpg",
        description: "A brilliant playmaker known for his creativity and technical skills."
    },
    {
        name: "Rivaldo",
        nationality: "Brazil",
        image: "photos/Rivaldo.jpg",
        description: "An exceptional forward known for his powerful shots and playmaking abilities."
    },
    {
        name: "Zlatan Ibrahimović",
        nationality: "Sweden",
        image: "photos/Zlatan.jpg",
        description: "A world-class striker known for his strength, skill, and incredible goal-scoring ability."
    },
    {
        name: "Thierry Henry",
        nationality: "France",
        image: "photos/Henry.jpg",
        description: "A legendary forward known for his pace, finishing, and intelligence on the pitch."
    },
    {
        name: "Jordi Alba",
        nationality: "Spain",
        image: "photos/Alba.jpg",
        description: "One of the best left-backs in the world, known for his speed and attacking prowess."
    }
  
];

// Function to display iconic players
function displayIconicPlayers() {
    const iconicPlayersContainer = document.getElementById('iconic-players-content');
    iconicPlayersContainer.innerHTML = ''; // Clear previous content

    iconicPlayers.forEach(player => {
        // Correct path for the flags
        const flagImagePath = `flags/${player.nationality.toLowerCase()}.png`;

        // Appending player cards dynamically using template literals
        iconicPlayersContainer.innerHTML += `
            <div class="iconic-player-card">
                <img src="${player.image}" alt="${player.name}" class="iconic-player-image" />
                <p><strong>Name:</strong> ${player.name}</p>
                <p><strong>Nationality:</strong> 
                    <img src="${flagImagePath}" alt="${player.nationality} flag" class="nationality-flag" />
                    ${player.nationality}
                </p>
                <p>${player.description}</p>
            </div>
        `;
    });
}


// Initial call to display iconic players
document.addEventListener("DOMContentLoaded", () => {
    displayIconicPlayers(); 
});
const paymentInfo = localStorage.getItem('seance-data');
const parsedSelectedChairs = JSON.parse(paymentInfo);

const ticketTitle = document.querySelector('.ticket__title');
ticketTitle.textContent = parsedSelectedChairs.filmName;

const ticketChairs = document.querySelector('.ticket__chairs');
const ticketHall = document.querySelector('.ticket__hall');
ticketHall.textContent = parsedSelectedChairs.hallName;

const seanceDate = new Date(parsedSelectedChairs.seanceTimeStamp * 1000);
const fullDate = seanceDate.toLocaleString("ru-RU", {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
});
const ticketStart = document.querySelector('.ticket__start');
ticketStart.textContent = `${parsedSelectedChairs.seanceTime}, ${fullDate}`;

const places = parsedSelectedChairs.selectedPlaces;
const takenChairs = places.map(place => `${place.row}/${place.place}`).join(', ');
ticketChairs.textContent = takenChairs;

let price = 0;

for (const place of places) {
    price += place.type === 'standart' ? +parsedSelectedChairs.hallPriceStandart : 
             (place.type === 'vip' ? +parsedSelectedChairs.hallPriceVip : 0);
}

const ticketCost = document.querySelector('.ticket__cost');
ticketCost.textContent = `${price}`;

let newHallConfig = parsedSelectedChairs.hallConfig.replace(/selected/g, "taken");
parsedSelectedChairs.hallConfig = newHallConfig;
parsedSelectedChairs.takenChairs = takenChairs;

localStorage.setItem('seance-data', JSON.stringify(parsedSelectedChairs));

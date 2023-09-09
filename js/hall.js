const seanceData = localStorage.getItem('seance-data');
const parsedSeances = JSON.parse(seanceData);

const confStepWrapper = document.querySelector('.conf-step__wrapper');
const movieTitle = document.querySelector('.buying__info-title');
movieTitle.innerText = parsedSeances.filmName;

const movieSeanceStart = document.querySelector('.buying__info-start');
movieSeanceStart.innerText = `Начало сеанса:  ${parsedSeances.seanceTime}`;

const hallName = document.querySelector('.buying__info-hall'); 
hallName.innerText = parsedSeances.hallName;

const acceptinButton = document.querySelector('.acceptin-button');
const priceStandart = document.querySelector('.price-standart');
priceStandart.innerText = parsedSeances.hallPriceStandart;

const priceVip = document.querySelector('.price-vip');
priceVip.innerText = parsedSeances.hallPriceVip;

createRequest('POST', 'https://jscp-diplom.netoserver.ru/', `event=get_hallConfig&timestamp=${parsedSeances.seanceTimeStamp}&hallId=${parsedSeances.hallId}&seanceId=${parsedSeances.seanceId}`, function (response) {
    if(response) {
       parsedSeances.hallConfig = response;     
    } else {
        console.log('Нет купленных билетов');
    }

    confStepWrapper.innerHTML = parsedSeances.hallConfig;
    
    const updateAcceptinButtonState = () => {
        const arrSelectedChairs = document.querySelectorAll('.conf-step__row .conf-step__chair_selected');
        if(arrSelectedChairs.length > 0) {
            acceptinButton.removeAttribute('disabled');
        } else {
            acceptinButton.setAttribute('disabled', 'disabled');
        }
    };
    
    document.querySelectorAll('.conf-step__chair').forEach((chair) => {
        chair.addEventListener('click', (event) => {
            if(event.target.classList.contains('conf-step__chair_taken')) {
                return;
            }
            event.target.classList.toggle('conf-step__chair_selected');
            updateAcceptinButtonState();
        });
    });

    updateAcceptinButtonState();

    acceptinButton.addEventListener('click', () => {
        const selectedChairs = [...document.querySelectorAll('.conf-step__row .conf-step__chair_selected')].map((selectedChair) => {
            const rowElement = selectedChair.closest('.conf-step__row');   
            const rowIndex = Array.from(rowElement.parentNode.children).indexOf(rowElement) + 1;
            const placeIndex = Array.from(rowElement.children).indexOf(selectedChair) + 1;
            
            let typePlace;
            if (selectedChair.classList.contains('conf-step__chair_standart')){
                typePlace = 'standart';
            } else if (selectedChair.classList.contains('conf-step__chair_vip')){
                typePlace = 'vip';
            }

            return { row: rowIndex, place: placeIndex, type: typePlace };
        });

        parsedSeances.hallConfig = confStepWrapper.innerHTML;
        parsedSeances.selectedPlaces = selectedChairs;
        localStorage.setItem('seance-data', JSON.stringify(parsedSeances));
        window.location.href = "payment.html";
    });    
});

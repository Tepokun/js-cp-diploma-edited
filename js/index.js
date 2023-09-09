document.addEventListener("DOMContentLoaded", () => {
	const dayWeekElements = document.querySelectorAll('.page-nav__day-week');
	const dayNumberElements = document.querySelectorAll('.page-nav__day-number');
	const pageNavDays = document.querySelectorAll('.page-nav__day');
  
	dayNumberElements.forEach((dayNumberElement, index) => {
	  const day = new Date();
	  day.setDate(day.getDate() + index);
	  dayNumberElement.textContent = day.getDate();
	  dayWeekElements[index].textContent = weekDays(day);
	  const navDay = dayNumberElement.parentNode;
	  navDay.classList.toggle('page-nav__day_weekend', ['Сб', 'Вс'].includes(dayWeekElements[index].textContent));
	});
  
	function weekDays(date) {
	  const daysOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
	  return daysOfWeek[date.getDay()];
	}
  
	createRequest('POST', 'https://jscp-diplom.netoserver.ru/', 'event=update', function (response) {
	  const films = response.films.result;  
	  const halls = response.halls.result.filter(hall => hall.hall_open !== '0');  
	  const arrSeances = response.seances.result;  
  
	  const main = document.querySelector('main');
	  main.innerHTML = '';
  
	  for(const film of films) {
		let hallSeances = ''; 
		halls.forEach(hall => {
		  const seances = arrSeances.filter(seance => seance.seance_filmid == film.film_id && seance.seance_hallid == hall.hall_id);
  
		  if(seances.length === 0) return;
  
		  hallSeances += `
			<div class="movie-seances__hall">
			  <h3 class="movie-seances__hall-title">${hall.hall_name}</h3>
			  <ul class="movie-seances__list">
				${seances.map(seance => `
				  <li class="movie-seances__time-block">
					<a class="movie-seances__time" href="hall.html" data-film-name="${film.film_name}" 
					data-seance-start="${seance.seance_start}" data-seance-time="${seance.seance_time}" 
					data-hall-name="${hall.hall_name}" data-hall-id="${hall.hall_id}" data-seance-id="${seance.seance_id}" 
					data-hall-price-standart="${hall.hall_price_standart}"
					data-hall-price-vip="${hall.hall_price_vip}">${seance.seance_time}</a>
				  </li>
				`).join('')}
			  </ul>          
			</div>
		  `;   
		});
  
		if(!hallSeances) return;
  
		main.innerHTML += `
		  <section class="movie">
			<div class="movie__info">
			  <div class="movie__poster">
				<img class="movie__poster-image" alt='${film.film_name}' src="${film.film_poster}">
			  </div>
			  <div class="movie__description">
				<h2 class="movie__title">${film.film_name}</h2>
				<p class="movie__synopsis">${film.film_description}</p>
				<p class="movie__data">
				  <span class="movie__data-duration">${film.film_duration}</span>
				  <span class="movie__data-origin">${film.film_origin}</span>
				</p>
			  </div>
			</div>  
			${hallSeances}
		  </section>
		`;
	  }
  
	  const seancesTime = document.querySelectorAll('.movie-seances__time');
  
	  function updateSeances() {
		seancesTime.forEach((time) => {
		  const seanceStart = +time.dataset.seanceStart;
		  const selectedDay = document.querySelector('.page-nav__day_chosen'); 
		  const selectedDayIndex = Array.from(pageNavDays).indexOf(selectedDay);
		  const selectedDate = new Date();
		  selectedDate.setDate(selectedDate.getDate() + selectedDayIndex);
		  selectedDate.setHours(0, 0, 0);
		  const seanceTime = Math.floor(selectedDate.getTime()/1000) + seanceStart*60;  
		  time.dataset.seanceTimeStamp = seanceTime;
		  const todayTime = new Date();
		  const currentTime = Math.round(todayTime.getTime()/1000);
		  time.classList.toggle("acceptin-button-disabled", currentTime > seanceTime);
		});
	  }
  
	  updateSeances();
  
	  for (const pageNavDay of pageNavDays) {
		pageNavDay.addEventListener('click', function(e) {
		  e.preventDefault();
		  const selectedDay = document.querySelector('.page-nav__day_chosen');
		  if (selectedDay) {
			  selectedDay.classList.remove('page-nav__day_chosen');
		  }
		  pageNavDay.classList.add('page-nav__day_chosen');      
		  updateSeances();
		});
	  } 
  
	  seancesTime.forEach(time => {
		time.addEventListener('click', function(event) {
		  const hallId = event.target.dataset.hallId;
		  const selectedHall = halls.find(hall => hall.hall_id == hallId);       
		  const selectedSeance = {
			  ...event.target.dataset,
			  hallConfig: selectedHall.hall_config
		  };   
		  const jsonSeance = JSON.stringify(selectedSeance);
		  localStorage.setItem('seance-data', jsonSeance);
		});
	  });
	});
  });
  
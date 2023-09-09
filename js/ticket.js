function generateQrCode() {
  const ticketInfo = localStorage.getItem('seance-data');
  const parsedTickets = JSON.parse(ticketInfo);
  
  const ticketTitle = document.querySelector('.ticket__title');
  ticketTitle.textContent = parsedTickets.filmName;

  const ticketChairs = document.querySelector('.ticket__chairs');
  ticketChairs.textContent = parsedTickets.takenChairs;

  const ticketHall = document.querySelector('.ticket__hall');
  ticketHall.textContent = parsedTickets.hallName;

  const ticketStart = document.querySelector('.ticket__start');
  ticketStart.textContent = parsedTickets.seanceTime;
  
  const seanceDate = new Date(parsedTickets.seanceTimeStamp * 1000);
  
  const fullDate = seanceDate.toLocaleString("ru-RU", {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
  });

  const seanceInfo = `На фильм: ${parsedTickets.filmName}, Зал: ${parsedTickets.hallName}, Ряд/Место: ${parsedTickets.takenChairs}, Время: ${fullDate}`;
  const qrcode = QRCreator(seanceInfo, { image: "SVG" });
  document.querySelector('.ticket__info-qr').append(qrcode.result);
}

document.addEventListener("DOMContentLoaded", generateQrCode);

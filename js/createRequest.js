function createRequest(method, url, data, callback) {
    const xhr = new XMLHttpRequest();
  
    xhr.open(method, url);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
  
    xhr.onerror = () => {
      console.error('Ошибка при отправке запроса');
      callback(null);
    };
  
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = xhr.response;
          callback(response);
        } catch (error) {
          console.error('Ошибка обработки ответа:', error);
          callback(null);
        }
      }
    };
  
    xhr.send(data);
  }
  
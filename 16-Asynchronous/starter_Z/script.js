'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
};

const renderCountry = (data, className = '') => {
  const html = `
    <article class="country ${className}">
    <img class="country__img" src="${data.flags.png}" />
    <div class="country__data">
      <h3 class="country__name">${data.name.common}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)} people</p>
      <p class="country__row"><span>🗣️</span>${Object.values(
        data.languages
      )}</p>
      <p class="country__row"><span>💰</span>${Object.keys(data.currencies)}</p>
    </div>
  </article>`;
  countriesContainer.insertAdjacentHTML('beforeend', html);
};

const getJSON = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errorMsg} ${response.status}`);
    return response.json();
  });
};

const getCountryData = function (country) {
  getJSON(`https://restcountries.com/v3.1/name/${country}`, 'Country not found')
    .then(data => {
      renderCountry(data[0]);

      if (!data[0].borders) throw new Error('No neighbour found');

      const neighbour = data[0].borders[0];

      return getJSON(
        `https://restcountries.com/v3.1/alpha/${neighbour}`,
        'Neighbour country not found'
      );
    })
    .then(data => renderCountry(data[0], 'neighbour'))
    .catch(err => {
      console.error(`${err} 💥💥💥`);
      renderError(`Something went wrong 💥💥💥 ${err.message}. Try again!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

const whereAmI = function () {
  getPosition()
    .then(pos => {
      console.log(pos);
      const { latitude: lat, longitude: lng } = pos.coords;
      return fetch(
        `https://geocode.xyz/${lat},${lng}?geoit=json&auth=369140244988012877940x7595`
      );
    })

    .then(response => {
      if (!response.ok) throw new Error('Problem with geocoding');
      return response.json();
    })
    .then(data => {
      getCountryData(data.country);
      console.log(`You are in ${data.city}, ${data.country}`);
    })
    .catch(err =>
      console.error(`Something went wrong ${err.message}. Try again`)
    );
};

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

btn.addEventListener('click', function () {
  whereAmI();
});

/* console.log('Test start');

setTimeout(() => console.log('o sec timer'), 0);
Promise.resolve('Resolved Promise 1').then(res => console.log(res));
Promise.resolve('Resolved promise 2').then(res => {
  for (let i = 0; i < 1000000000; i++) {}
  console.log(res);
});

console.log('Test end'); */
//////////////////////////////////////////////////////

/* const lotteryPromise = new Promise(function (resolve, reject) {
  console.log('Lottery draw is happening');
  setTimeout(function () {
    if (Math.random() >= 0.5) {
      resolve('You win!');
    } else {
      reject(new Error('You LOSE!'));
    }
  }, 2000);
}); */

// lotteryPromise.then(res => console.log(res)).catch(err => console.error(err));

// Promisifying SetTimeout
/* const wait = function (ms) {
  return new Promise(res => {
    setTimeout(res, ms);
  });
};


wait(2000)
  .then(() => {
    console.log(`I've waited 2 s`);
    return wait(1000);
  })
  .then(() => console.log('I waited 1 s'));


// Promise.resolve('abc').then(res => console.log(res));
// Promise.reject(new Error('abc')).catch(res => console.log(res));
 */
/* 
///////CHALLENGE 2//////////////////
const wait = function (ms) {
  return new Promise(res => {
    setTimeout(res, ms);
  });
};

const createImage = imgPath => {
  return new Promise((resolve, reject) => {
    const imgEl = document.createElement('img');
    imgEl.src = imgPath;

    imgEl.addEventListener('load', () => {
      const containerEl = document.querySelector('.images');
      containerEl.appendChild(imgEl);
      resolve(imgEl);
    });

    imgEl.addEventListener('error', () => {
      reject(new Error('Error loading the file'));
    });
  });
};
let currentImg;
createImage('img/img-1.jpg')
  .then(img => {
    currentImg = img;
    return wait(2000);
  })
  .then(() => {
    currentImg.style.display = 'none';
    return createImage('img/img-2.jpg');
  })
  .then(img => {
    currentImg = img;
    return wait(2000);
  })
  .then(() => {
    currentImg.style.display = 'none';
    return createImage('img/img-3.jpg');
  })
  .then(img => {
    currentImg = img;
    return wait(2000);
  })
  .then(() => {
    currentImg.style.display = 'none';
  })

  .catch(err => console.error(err)); */

//////////////////////////////////////////////////////
const whereAmI2 = async function (country) {
  // fetch(`https://restcountries.com/v3.1/name/${country}`)
  // .then(res=>console.log(res));

  const res = await fetch(`https://restcountries.com/v3.1/name/${country}`);
  const data = await res.json();
  renderCountry(data[0]);
  console.log(data[0]);
};

whereAmI2('portugal');

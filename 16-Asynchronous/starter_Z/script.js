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
  countriesContainer.style.opacity = 1;
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
////////// Creating Promises ///////////////////
/* 
console.log('Test start');
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
}); 

 lotteryPromise.then(res => console.log(res)).catch(err => console.error(err));

// Promisifying SetTimeout
 const wait = function (ms) {
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
/* const whereAmI2 = async function () {
  try {
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;
    const resGeo = await fetch(
      `https://geocode.xyz/${lat},${lng}?geoit=json&auth=369140244988012877940x7595`
    );
    if (!resGeo) throw new Error('Problem getting location data');
    const dataGeo = await resGeo.json();
    const res = await fetch(
      `https://restcountries.com/v3.1/name/${dataGeo.country}`
    );
    if (!res) throw new Error('Problem getting new country');
    const data = await res.json();
    renderCountry(data[0]);

    return `2. You are in ${dataGeo.city}, ${dataGeo.country}`;
  } catch (err) {
    console.error(err.message);
    renderError(`Something went wrong ${err.message}`);

    //Reject promise returned from async
    throw err;
  }
}; */

/* (async function () {
  console.log('1. Will get location');
  try {
    const city = await whereAmI2();
    console.log(city);
  } catch (err) {
    console.error(err.message);
  } finally {
    console.log('3. Finished getting location');
  }
})(); */
/* 
const get3Countries = async function (c1, c2, c3) {
  try {
    // const [data1] = await getJSON(`https://restcountries.com/v3.1/name/${c1}`);
    // const [data2] = await getJSON(`https://restcountries.com/v3.1/name/${c2}`);
    // const [data3] = await getJSON(`https://restcountries.com/v3.1/name/${c3}`);

    const data = await Promise.all([
      getJSON(`https://restcountries.com/v3.1/name/${c1}`),
      getJSON(`https://restcountries.com/v3.1/name/${c2}`),
      getJSON(`https://restcountries.com/v3.1/name/${c3}`),
    ]);

    console.log(data.map(el => el[0].capital[0]));
  } catch (err) {
    console.error(err);
  }
};

// get3Countries('portugal', 'canada', 'bosnia');
// Promice.race
(async function () {
  const res = await Promise.race([
    getJSON(`https://restcountries.com/v3.1/name/italy`),
    getJSON(`https://restcountries.com/v3.1/name/egypt`),
    getJSON(`https://restcountries.com/v3.1/name/mexico`),
  ]);
  console.log(res[0].name);
})();

const timeout = function (s) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Request took too long'));
    }, s);
  });
};

Promise.race([
  getJSON(`https://restcountries.com/v3.1/name/mexico`),
  getJSON(`https://restcountries.com/v3.1/name/egypt`),
  timeout(250),
])
  .then(res => console.log(res[0]))
  .catch(err => console.log(err));

// Promise.allSettled
Promise.allSettled([
  Promise.resolve('Success'),
  Promise.reject('Error'),
  Promise.resolve('Success'),
  Promise.resolve('Success'),
]).then(res => console.log(res));

//Promise.any
Promise.any([
  Promise.resolve('Success'),
  Promise.reject('Error'),
  Promise.resolve('Success'),
  Promise.resolve('Success'),
]).then(res => console.log(res));
 */

///////////CHALLENGE 3 //////////////////////
const createImage2 = imgPath => {
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

const wait2 = function (ms) {
  return new Promise(res => {
    setTimeout(res, ms);
  });
};

const loadNPause = async function () {
  try {
    let currentImg = await createImage2('img/img-1.jpg');
    await wait2(2000);
    currentImg.style.display = 'none';
    currentImg = await createImage2('img/img-2.jpg');
    await wait2(2000);
    currentImg.style.display = 'none';
    currentImg = await createImage2('img/img-3.jpg');
    await wait2(2000);
    currentImg.style.display = 'none';
  } catch (err) {
    console.error(err);
  }
};

// loadNPause();

const loadAll = async function (imgArr) {
  try {
    const imgs = imgArr.map(async img => await createImage2(img));
    console.log(imgs);
    const imgsEl = await Promise.all(imgs);
    console.log(imgsEl);
    imgsEl.forEach(img => img.classList.add('parallel'));
  } catch (error) {}
};
loadAll(['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg']);

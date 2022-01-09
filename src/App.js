import './index.css';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'

// api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=09a52bcb2a7e16f19190debd17cc8c04
const api = {
  key: '09a52bcb2a7e16f19190debd17cc8c04',
  base: 'https://api.openweathermap.org/data/2.5/'
}

// Takes current date and returns user friendly date
const dateBuilder = (d) => {
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];

  let year = d.getFullYear();

  return `${day} ${month} ${date}, ${year}`
};

// animation variants for elements
const variants = {
  hidden: {
    opacity: 0,
    y: "-50vh",
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1
    }
  },
  exit: {
    opacity: 0,
    y: "-100vh",
    transition: { 
      duration: .7
    }
  },

}


function App() {
  // used to send query to api and display value in input
  const [query, setQuery] = useState('')
  // used to store data from api
  const [weather, setWeather] = useState(null)
  // used to display error if failed value from api
  const [error, setError] = useState(null)

  // function to send search to api
  const search = (e) => {
    if (e.key == 'Enter') {
      fetch(`${api.base}weather?q=${query}&units=imperial&APPID=${api.key}`)
        .then(res => res.json())
        .then(result => {
          if (result.cod !== '404') {
            setWeather(result);
            setQuery('');
            setError(null)

          } else {
            setWeather(null);
            setQuery('');
            setError(result.message)
          }
        });

    }
  }

  // trigger for exit animation using AnimatePresence
  useEffect(() => {
    const search = document.getElementById('search-bar')
    search.addEventListener('keypress', () => {
      setWeather('')
    })

  }, [weather]);


  return (
    <div className={weather ? (weather.main.temp > 70 ? "app warm" : "app") : "app"}>
      <main>

        {/* Search Box */}
        <motion.div
          variants={variants}
          initial='hidden'
          animate='visible'
          className="search-box"
        >
          <input
            id='search-bar'
            type='text'
            className='search-bar'
            placeholder='Search for city...'
            onChange={e => setQuery(e.target.value)}
            value={query}
            onKeyPress={search}
          />
        </motion.div>

        {/* ERROR DISPLAY */}
        {error && <div className='error'>{error}</div>}

        {/* Tempature Display */}
        <AnimatePresence exitBeforeEnter>
          {weather &&
            <motion.div
              className='request-box'
              variants={variants}
              initial='hidden'
              animate='visible'
              exit='exit'
              key={Math.random()}
            >
              {/* Display for location and date */}
              <div
                className='location-box'
                key={Math.random()}
              >
                {weather && <div className='location' key={weather.name}>{weather.name}</div>}
                {weather && <div className='date' key={new Date()}>{dateBuilder(new Date())}</div>}

              </div>

              {/* Display of returned temp and current weather */}
              <div
                className='weather-box'
                key={Math.random()}
              >
                {weather && <div className='temp' key={Math.round(weather.main.temp)}>{Math.round(weather.main.temp)}</div>}
                {weather && <div className='weather' key={weather.weather[0].main}>{weather.weather[0].main}</div>}
              </div>
            </motion.div>
          }
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;

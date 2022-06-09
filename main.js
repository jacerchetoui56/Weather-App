let search = document.querySelector('.search-input')
let searchBtn = document.querySelector('.search-button')
let cityName = document.querySelector('.name')
let temp = document.querySelector('.temp')
let description = document.querySelector('.description')
let humidity = document.querySelector('.humidity')
let wind = document.querySelector('.windSpeed')
let locationBtn = document.querySelector('.location')
let icon = document.querySelector('.des-icon img')
let body = document.querySelector('body')
let rainSound = document.querySelector('#rain')
let sunnyDaySound = document.querySelector('#sunny')

async function getWeather(city = "tunisia") { //the city is tunisia by default
    let response = null
    if (city != "") {

        response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric&appid=' + apiKey)
        let data = await response.json()
        let { name } = data
        let temp = data.main.temp
        let humidity = data.main.humidity
        let { description, icon } = data.weather[0]
        let speed = data.wind.speed
        let myWeather = {
            name: name,
            temperature: `${temp}°C`,
            description: description,
            humidity: `${humidity}%`,
            wind: `${speed}km/h`,
            icon: icon
        }
        displayInfos(myWeather)
    }
}

function displayInfos(WeatherInfos) {
    cityName.innerHTML = "Weather in " + WeatherInfos.name
    temp.innerHTML = WeatherInfos.temperature
    description.innerHTML = WeatherInfos.description
    humidity.innerHTML = "Humidity : " + WeatherInfos.humidity
    wind.innerHTML = "wind speed : " + WeatherInfos.wind
    icon.setAttribute('src', `https://openweathermap.org/img/wn/${WeatherInfos.icon}.png`)
    changeBackground(WeatherInfos.description)
}

//!============== Event Listeners ==========
getWeather()
locationBtn.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(success, console.log)

    function success(position) {
        let { latitude, longitude } = position.coords
        fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=0329aab0cda94946a805658568855af8`)
            .then(res => res.json())
            .then(data => {
                let firstData = data.results[0].formatted.split(',')
                let secondData = firstData[firstData.length - 2].split(' ')
                let city = secondData[secondData.length - 1]
                getWeather(city)
                animation()
            })

    }

})
searchBtn.addEventListener('click', () => {
    let city = search.value
    getWeather(city)
    search.value = ""
    animation()

})
search.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
        let city = search.value
        getWeather(city)
        search.value = ""
        animation()
    }
})

function animation() {

    body.classList.add('animate')
    setTimeout(() => {
        body.classList.remove('animate')
    }, 1000)
}

function changeBackground(desc = "Sday.jpg") {
    switch (desc) {
        case "clear sky": bcImage = "Sday.jpg"
            break;
        case "rain", "light rain": bcImage = "Rday.jpg"
            break;
        case "clouds": bcImage = "Cday.jpg"
            break;
        case "snow": bcImage = "SNday.jpg"
            break;
        case "scattered clouds": bcImage = "SCday.jpg"
            break;
        case "broken clouds", "few clouds": bcImage = "BROKENCday.jpg"
            break;
        case "overcast clouds": bcImage = "OCday.jpg"
        case "mist": bcImage = "MISTday.jpg"
            break
    }
    body.style.backgroundImage = `url('./images/${bcImage}')`
    sunnyDaySound.pause()
    rainSound.pause()
    if (bcImage == "Sday.jpg") {
        sunnyDaySound.currenTime = 0
        sunnyDaySound.volume = 0.3
        sunnyDaySound.play()
    }
    else if (bcImage == "Rday.jpg") {
        rainSound.currenTime = 0
        rainSound.volume = 0.3
        rainSound.play()
    }
}


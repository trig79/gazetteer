const navSlide = () => {
    //Activation/De-activation of NavBar

    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links-container')
    const navLinksImages = document.querySelectorAll('.nav-links-container li')

    burger.addEventListener('click', () => {
        //Toggle Nav in and out
        nav.classList.toggle('nav-active')
        navLinksImages.forEach( (link, index) => {
            if(link.style.animation){
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease-in backwards ${index / 9}s`
            }
        })
    })



    // Activation/De-activation of Information Panes
    const infoImage = document.querySelector('.nav-info-icon')
    const infoClearIcon = document.querySelector('.info-clear-icon')
    const infoDiv = document.querySelector('.information-section')
    let infoPaneActivate = true;

    const covid19Image = document.querySelector('#nav-covid-19-icon')
    const covidClearIcon = document.querySelector('.covid-clear-icon')
    const covidDiv = document.querySelector('.covid-section')
    let covidPaneActivate = false;

    const exchangeImage = document.querySelector('#nav-exrate-icon')
    const exchangeClearIcon = document.querySelector('.exchange-clear-icon')
    const exchangeDiv = document.querySelector('.exchange-rate-section')
    let exchangePaneActivate = false;

    const newsImage = document.querySelector('#nav-news-icon')
    const newsClearIcon = document.querySelector('.news-clear-icon')
    const newsDiv = document.querySelector('.news-info-section')
    let newsPaneActivate = false;

    const weatherImage = document.querySelector('#nav-weather-icon')
    const weatherClearIcon = document.querySelector('.weather-clear-icon')
    const weatherDiv = document.querySelector('.weather-info-section')
    let weatherPaneActivate = false;

    weatherImage.addEventListener('click', () => {
        if (weatherPaneActivate) {
            weatherDiv.classList.toggle('weather-info-section-translate');
            weatherPaneActivate = false
        } else if (!weatherPaneActivate && infoPaneActivate) {
            weatherDiv.classList.toggle('weather-info-section-translate');
            infoDiv.classList.toggle('information-section-translate')
            weatherPaneActivate = true
            infoPaneActivate = false
        } else if (!weatherPaneActivate && exchangePaneActivate) {
            weatherDiv.classList.toggle('weather-info-section-translate');
            exchangeDiv.classList.toggle('exchange-rate-section-translate')
            weatherPaneActivate = true
            exchangePaneActivate = false
        } else if (!weatherPaneActivate && newsPaneActivate) {
            weatherDiv.classList.toggle('weather-info-section-translate');
            newsDiv.classList.toggle('news-info-section-translate');
            weatherPaneActivate = true
            newsPaneActivate = false
        } else if (!weatherPaneActivate && covidPaneActivate) {
            weatherDiv.classList.toggle('weather-info-section-translate');
            covidDiv.classList.toggle('covid-section-translate');
            weatherPaneActivate = true
            covidPaneActivate = false
        } else if (!covidPaneActivate && !infoPaneActivate && !exchangePaneActivate && !newsPaneActivate && !weatherPaneActivate) {
            weatherDiv.classList.toggle('weather-info-section-translate');
            weatherPaneActivate = true
        }
    })

    weatherClearIcon.addEventListener('click', () => {
            weatherDiv.classList.toggle('weather-info-section-translate');
            weatherPaneActivate = false
    })


    infoImage.addEventListener('click', () => {
        if (infoPaneActivate) {
            infoDiv.classList.toggle('information-section-translate')
            infoPaneActivate = false
        } else if (!infoPaneActivate && covidPaneActivate) {
            infoDiv.classList.toggle('information-section-translate')
            covidDiv.classList.toggle('covid-section-translate');
            infoPaneActivate = true
            covidPaneActivate = false
        } else if (!infoPaneActivate && exchangePaneActivate) {
            infoDiv.classList.toggle('information-section-translate')
            exchangeDiv.classList.toggle('exchange-rate-section-translate');
            infoPaneActivate = true
            exchangePaneActivate = false
        } else if (!infoPaneActivate && newsPaneActivate) {
            infoDiv.classList.toggle('information-section-translate')
            newsDiv.classList.toggle('news-info-section-translate');
            infoPaneActivate = true
            newsPaneActivate = false
        } else if (!infoPaneActivate && weatherPaneActivate) {
            infoDiv.classList.toggle('information-section-translate')
            weatherDiv.classList.toggle('weather-info-section-translate');
            infoPaneActivate = true
            weatherPaneActivate = false
        } else if (!infoPaneActivate && !covidPaneActivate  && !exchangePaneActivate && !newsPaneActivate && !weatherPaneActivate)  {
            infoDiv.classList.toggle('information-section-translate')
            infoPaneActivate = true
        }
    })

    infoClearIcon.addEventListener('click', () => {
            infoDiv.classList.toggle('information-section-translate')
            infoPaneActivate = false
    })

    covid19Image.addEventListener('click', () => {
        if (covidPaneActivate) {
            covidDiv.classList.toggle('covid-section-translate');
            covidPaneActivate = false
        } else if (!covidPaneActivate && infoPaneActivate) {
            covidDiv.classList.toggle('covid-section-translate');
            infoDiv.classList.toggle('information-section-translate')
            covidPaneActivate = true
            infoPaneActivate = false
        } else if (!covidPaneActivate && exchangePaneActivate) {
            covidDiv.classList.toggle('covid-section-translate');
            exchangeDiv.classList.toggle('exchange-rate-section-translate')
            covidPaneActivate = true
            exchangePaneActivate = false
        } else if (!covidPaneActivate && newsPaneActivate) {
            covidDiv.classList.toggle('covid-section-translate');
            newsDiv.classList.toggle('news-info-section-translate');
            covidPaneActivate = true
            newsPaneActivate = false
        } else if (!covidPaneActivate && weatherPaneActivate) {
            covidDiv.classList.toggle('covid-section-translate');
            weatherDiv.classList.toggle('weather-info-section-translate');
            covidPaneActivate = true
            weatherPaneActivate = false
        } else if (!covidPaneActivate && !infoPaneActivate && !exchangePaneActivate && !newsPaneActivate && !weatherPaneActivate) {
            covidDiv.classList.toggle('covid-section-translate');
            covidPaneActivate = true
        }
    })

    covidClearIcon.addEventListener('click', () => {
            covidDiv.classList.toggle('covid-section-translate');
            covidPaneActivate = false
    })

    exchangeImage.addEventListener('click', () => {
        if (exchangePaneActivate) {
            exchangeDiv.classList.toggle('exchange-rate-section-translate');
            exchangePaneActivate = false
        } else if (!exchangePaneActivate && infoPaneActivate) {
            exchangeDiv.classList.toggle('exchange-rate-section-translate');
            infoDiv.classList.toggle('information-section-translate')
            exchangePaneActivate = true
            infoPaneActivate = false
        } else if (!exchangePaneActivate && covidPaneActivate) {
            exchangeDiv.classList.toggle('exchange-rate-section-translate');
            covidDiv.classList.toggle('covid-section-translate')
            exchangePaneActivate = true
            covidPaneActivate = false
        } else if (!exchangePaneActivate && newsPaneActivate) {
            exchangeDiv.classList.toggle('exchange-rate-section-translate');
            newsDiv.classList.toggle('news-info-section-translate');
            exchangePaneActivate = true
            newsPaneActivate = false
        } else if (!exchangePaneActivate && weatherPaneActivate) {
            exchangeDiv.classList.toggle('exchange-rate-section-translate');
            weatherDiv.classList.toggle('weather-info-section-translate');
            exchangePaneActivate = true
            weatherPaneActivate = false
        } else if (!covidPaneActivate && !infoPaneActivate && !exchangePaneActivate && !newsPaneActivate && !weatherPaneActivate) {
            exchangeDiv.classList.toggle('exchange-rate-section-translate');
            exchangePaneActivate = true
        }
    })

    exchangeClearIcon.addEventListener('click', () => {
            exchangeDiv.classList.toggle('exchange-rate-section-translate');
            exchangePaneActivate = false
    })

    newsImage.addEventListener('click', () => {
        if (newsPaneActivate) {
            newsDiv.classList.toggle('news-info-section-translate');
            newsPaneActivate = false
        } else if (!newsPaneActivate && infoPaneActivate) {
            newsDiv.classList.toggle('news-info-section-translate');
            infoDiv.classList.toggle('information-section-translate')
            newsPaneActivate = true
            infoPaneActivate = false
        } else if (!newsPaneActivate && covidPaneActivate) {
            newsDiv.classList.toggle('news-info-section-translate');
            covidDiv.classList.toggle('covid-section-translate')
            newsPaneActivate = true
            covidPaneActivate = false
        } else if (!newsPaneActivate && exchangePaneActivate) {
            newsDiv.classList.toggle('news-info-section-translate');
            exchangeDiv.classList.toggle('exchange-rate-section-translate')
            newsPaneActivate = true
            exchangePaneActivate = false
        } else if (!newsPaneActivate && weatherPaneActivate) {
            newsDiv.classList.toggle('news-info-section-translate');
            weatherDiv.classList.toggle('weather-info-section-translate')
            newsPaneActivate = true
            weatherPaneActivate = false
        } else if (!covidPaneActivate && !infoPaneActivate && !exchangePaneActivate && !newsPaneActivate && !weatherPaneActivate) {
            newsDiv.classList.toggle('news-info-section-translate');
            newsPaneActivate = true
        }
    })

    newsClearIcon.addEventListener('click', () => {
            newsDiv.classList.toggle('news-info-section-translate');
            newsPaneActivate = false
    })


}
navSlide()

//Clears text from the search input field....
//Note: Search Function can be found in API.js
$('.search-clear-icon').click(function() {
    $('.searchInput').val("");
})

//forces the return key to submit the search and not refresh the page
$('.search-input-container').keypress(function(e) {
    if(e.which == 13) {
        e.preventDefault();
    $country = $('.searchInput').val()
    $alpha2code = '';
    $functionCalled = 'countrySearch'

    restCountriesSearch($country, $alpha2code, $functionCalled)
    } 
    })

//To create the variable the Dev should manual run the autocomplete.php file. 
//creates autocomplete country list > uses variable from /resources/autocomplete.js and node module
$(document).ready(function(){
$('#autocomplete').autocomplete({
    //serviceUrl: './php/autocomplete.php', //use if querying DB
    lookup: autoCountry
    });

$('.leaflet-control-layers-toggle').html(`<img src="./images/layers.svg">`)
//$('.leaflet-control-zoom-in').html('xxx')

//<a class="leaflet-control-zoom-in" href="#" title="Zoom in" role="button" aria-label="Zoom in">+</a>
})

//create dropdown country list for use on mobile devices > uses variable from /resources/autocomplete.js
const dropdownList = () => {
    let options = '';
  
    for (let i = 0; i < autoCountry.length; i++) {
       options += `<option value="${autoCountry[i]}" class="dropdown-list-item">${autoCountry[i]}</option>`
    }
    $('#dropdown-menu-list').html(options)
    
};


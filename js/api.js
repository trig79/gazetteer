//On Load uses geolocation to call API's:  currentTime | {OpenCage > RestCountries > OpenWeather}
window.addEventListener('load', () => {

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(navSuccess, navError)
    }       
})

const navSuccess = (position) => {
    let lon = position.coords.longitude.toFixed(2);
    let lat = position.coords.latitude.toFixed(2);
    mapLoad(lat,lon);   //intializes the map; located in leafletjs.js.
    //currentTimeAPI(lat, lon);       
    openCage(lat, lon, 'latLonSearch');
    //intiated dropdown country list
    dropdownList()
    //triggers country highlight for persons location
    searchBarStyle_Initial(lon, lat)


    //bug testing....
//     $('#news-div').append(`
//     <div class="news-articles">\
//     <h3 class="news-title">Mr President, I look forward to speaking with you': Joe Biden tells supporters 'nothing's going to stop us</h3>\
//     <a href="https://news.sky.com/story/mr-president-i-look-forward-to-speaking-with-you-joe-biden-tells-supporters-nothings-going-to-stop-us-12129497" class="news-link"><img src="https://e3.365dm.com/20/11/1600x900/skynews-biden-president_5168253.jpg?20201110201436" class="news-image">\
//     <p class="news-description">"Mr Biden said his transition to the White House is "well under way" in preparation for taking power on 20 January 2021."</p></a>\
//     </div>\
//  `)
}

const navError = (error) => {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            //x.innerHTML = "User denied the request for Geolocation."
            alert("This site requires location services, please adjust your settings.")
            break;
        case error.POSITION_UNAVAILABLE:
            //x.innerHTML = "Location information is unavailable."
            alert("This site requires location services, please adjust your settings.")
            break;
        case error.TIMEOUT:
            //x.innerHTML = "The request to get user location timed out."
            alert("This site requires location services, please adjust your settings.")
            break;
        case error.UNKNOWN_ERROR:
            //x.innerHTML = "An unknown error occurred."
            alert("This site requires location services, please adjust your settings.")
            break;
      }
}

//activated when user clicks/taps on a country - Only works when a layer is loaded
const countryOnClick = (lat, lon) => {
    //currentTimeAPI(lat, lon);      
    openCage(lat, lon, 'latLonSearch'); 

}

//activated when user enters or selects country in  search bar:  {RestCountries > OpenWeather > OpenCage } | currentTime  
$('.search-icon').click(function() {
    //checks whether value has been typed or chosen from drop down
    $country = $('.searchInput').val() ? $('.searchInput').val() : $('#dropdown-menu-list').val()
    $alpha2code = '';
    $functionCalled = 'countrySearch'

    restCountriesSearch($country, $alpha2code, $functionCalled)

    // console.log(SM)
    })

//function to handle the display of preloader
$(document).ajaxSend(function(event, request, settings){
        $('.loader-div').fadeIn(50);
    });
let count = 0;
const preloader = () => {
    count++
    //console.log(count) //bug testing
    if(count >= 5) {
        count = 0
        $('.loader-div').fadeOut(500)
    }
}

// <<<<<<<<<<<<  AJAX CALLS    >>>>>>>>>>
// 1.Rest Countries
// 2.Open Weather
// 3.Open Cage
// 4.Covid-19
// 5.Current Time
// 6.Exchange Rate API
// 7.Triposo - Country Blurb
// 8.Triposo - Top Ten Cities
// 9.Current News
// 10.Error Log


// 1.Rest Countries
const restCountriesSearch = (country, alpha2code, functionCalled) => {
    //let capital;
    $.ajax({
        url: "./php/restCountries.php",
        type: 'POST',
        dataType: 'json',
            data: {
            country: country,
            countryCode: alpha2code,
            functionCalled: functionCalled,
            },
        
        success: function(result) {
        console.log(result);  //Bug Testing
        // Removes data from the previous search to prevent incorrect display in case of only partial data return from API calls
        $('.info-population-container').html(`<h5>Population:</h5><br><h6 class="country-population">Nil Data</h6>`);
        $('.capital-name').html(`<h5 class="capital-name">Nil Data</h5>`);
        $('.nav-info-icon').html('<img src="./images/info2.svg" class="nav-link-icons" >')
        $('.flag-icon').html('<img src="./images/flag_plain.svg" class="flag-icon" alt="flag icon">')

        let capital     = result['rest_countries'][0]['capital']
        let flagIcon    = result['rest_countries'][0]['flag']
        
        $('.info-population-container').html(`<h5>Population:</h5><br><h6 class="country-population">${result['rest_countries'][0]['population']}</h6>`);
        $('.capital-name').html(`<h5 class="capital-name"> ${result['rest_countries'][0]['capital']} </h5>`);
        $('.nav-info-icon').html('<img src=' + flagIcon + ' class="nav-link-icons" >')
        $('.flag-icon').html('<img src=' + flagIcon + ' class="flag-icon" >')

        switch(functionCalled) {
            case 'latLonSearch' :     
                //openWeather(capital, functionCalled);
                weatherApi(capital, functionCalled);
            break;
            case 'countrySearch' :
                //openWeather(capital, functionCalled);
                weatherApi(capital, functionCalled);
            }
        preloader()
        },
        error: function(xhr, status, error){
            var errorMessage = `Rest Countries Error ${xhr.status} : ${xhr.statusText}. Error was generated calling ${functionCalled} with alpha2code: ${alpha2code} or country: ${country}`
            console.log(errorMessage);
            errorLog(errorMessage)
            preloader()
            alert('Unfortunately there has been an issue in locating this Country on the database. The error has been logged for investigation. Please make another selection.')
        }
    })
}


const weatherApi = (capital, functionCalled) => {
    $.ajax({
        url: "./php/weatherApi.php",
        type: 'POST',
        dataType: 'json',
        data: {
            city: capital,
        },
    
        success: function(result) {
            console.log(result);   //Bug Testing
            // Removes data from the previous search to prevent incorrect display in case of only partial data return from API calls
            $('#nav-weather-icon').html(`<img src="./images/cloudy2.svg" 	class="nav-link-icons"  >`)  
            $('#current-weather-cloud-icon').html('')  
            $('#current-weather-temp').html('')
            $('#current-weather-feelslike').html('')
            $('#current-weather-wind').html('')
            $('#current-weather-text').html('')
            $('#forecast-weather-cloud-icon-day1').html('')
            $('#forecast-weather-cloud-icon-day2').html('')
            $('#forecast-weather-cloud-icon-day3').html('')
            $('#forecast-weather-maxtemp_today').html('')
            $('#forecast-weather-maxtemp_today1').html('')
            $('#forecast-weather-maxtemp_today2').html('')
            $('#forecast-weather-mintemp_today').html('')
            $('#forecast-weather-mintemp_today1').html('')
            $('#forecast-weather-mintemp_today2').html('')
            $('#forecast-weather-sunrise_today').html('')
            $('#forecast-weather-sunrise_today1').html('')
            $('#forecast-weather-sunrise_today2').html('')
            $('#forecast-weather-sunset_today').html('')
            $('#forecast-weather-sunset_today1').html('')
            $('#forecast-weather-sunset_today2').html('')

            //error check for non-return of data
            if(!result['weatherApi'][0]['current_weather']['date']) {
                alert('Sadly this search has only returned partial data and some bits of information may be missing.')

            } else {

        // || Current Weather Config
            let currentWeatherIcon = result['weatherApi'][0]['current_weather']['icon'];
            let iconHtml = `https:${currentWeatherIcon}`
            $('#nav-weather-icon').html(`<img src="${iconHtml}" id="weather-img" class="nav-link-icons" >`)  
            $('#current-weather-cloud-icon').html(`<img src="${iconHtml}" id="weather-img-div" class="current-weather-cloud-icon" >`)  
            
            let temp_c = result['weatherApi'][0]['current_weather']['temp_c']
            $('#current-weather-temp').html(temp_c + 'C');
            let feelslike_c = result['weatherApi'][0]['current_weather']['feelslike_c']
            $('#current-weather-feelslike').html(feelslike_c + 'C');
            let wind_mph = result['weatherApi'][0]['current_weather']['wind_mph']
            $('#current-weather-wind').html(wind_mph + 'mph');
        
            $('#current-weather-text').html(result['weatherApi'][0]['current_weather']['description']);
    
        // || Forecast Weather Config

        //icon
        let todayWeatherIcon = result['weatherApi'][1]['forecast'][0]['condition']['icon'];
        let today1WeatherIcon = result['weatherApi'][2]['forecast'][1]['condition']['icon'];
        let today2WeatherIcon = result['weatherApi'][3]['forecast'][2]['condition']['icon'];
        $('#forecast-weather-cloud-icon-day1').html(`<img src="https:${todayWeatherIcon}"  class="forecast-weather-cloud-icon-day"   alt="weather icon">`);
        $('#forecast-weather-cloud-icon-day2').html(`<img src="https:${today1WeatherIcon}" class="forecast-weather-cloud-icon-day"   alt="weather icon">`);
        $('#forecast-weather-cloud-icon-day3').html(`<img src="https:${today2WeatherIcon}" class="forecast-weather-cloud-icon-day"   alt="weather icon">`);
        //max temp
        let todayWeatherMax = result['weatherApi'][1]['forecast'][0]['day']['maxtemp_c'];
        let today1WeatherMax = result['weatherApi'][2]['forecast'][1]['day']['maxtemp_c'];
        let today2WeatherMax = result['weatherApi'][3]['forecast'][2]['day']['maxtemp_c'];
        $('#forecast-weather-maxtemp_today').html(`<h5 id="forecast-weather-maxtemp_today">${todayWeatherMax} C</h5>`);
        $('#forecast-weather-maxtemp_today1').html(`<h5 id="forecast-weather-maxtemp_today">${today1WeatherMax} C</h5>`);
        $('#forecast-weather-maxtemp_today2').html(`<h5 id="forecast-weather-maxtemp_today">${today2WeatherMax} C</h5>`);
        //min temp
        let todayWeatherMin = result['weatherApi'][1]['forecast'][0]['day']['mintemp_c'];
        let today1WeatherMin = result['weatherApi'][2]['forecast'][1]['day']['mintemp_c'];
        let today2WeatherMin = result['weatherApi'][3]['forecast'][2]['day']['mintemp_c'];
        $('#forecast-weather-mintemp_today').html(`<h5 id="forecast-weather-maxtemp_today">${todayWeatherMin} C</h5>`);
        $('#forecast-weather-mintemp_today1').html(`<h5 id="forecast-weather-maxtemp_today">${today1WeatherMin} C</h5>`);
        $('#forecast-weather-mintemp_today2').html(`<h5 id="forecast-weather-maxtemp_today">${today2WeatherMin} C</h5>`);
        //sunrise
        let todayWeatherSunrise = result['weatherApi'][1]['forecast'][0]['astro']['sunrise'];
        let today1WeatherSunrise = result['weatherApi'][2]['forecast'][1]['astro']['sunrise'];
        let today2WeatherSunrise = result['weatherApi'][3]['forecast'][2]['astro']['sunrise'];
        $('#forecast-weather-sunrise_today').html(`<h5 id="forecast-weather-sunrise_today">${todayWeatherSunrise.slice(0,5)}</h5>`);
        $('#forecast-weather-sunrise_today1').html(`<h5 id="forecast-weather-sunrise_today1">${today1WeatherSunrise.slice(0,5)}</h5>`);
        $('#forecast-weather-sunrise_today2').html(`<h5 id="forecast-weather-sunrise_today2">${today2WeatherSunrise.slice(0,5)}</h5>`);
        //sunset
        let todayWeatherSunset = result['weatherApi'][1]['forecast'][0]['astro']['sunset'];
        let today1WeatherSunset = result['weatherApi'][2]['forecast'][1]['astro']['sunset'];
        let today2WeatherSunset = result['weatherApi'][3]['forecast'][2]['astro']['sunset'];
        //convert string to 24 hour
        let todayWeatherSunset24Hour  = `${parseInt(todayWeatherSunset.slice(0,2)) + 12}${todayWeatherSunset.slice(2,5)}`
        let today1WeatherSunset24Hour = `${parseInt(today1WeatherSunset.slice(0,2)) + 12}${today1WeatherSunset.slice(2,5)}`
        let today2WeatherSunset24Hour = `${parseInt(today2WeatherSunset.slice(0,2)) + 12}${today2WeatherSunset.slice(2,5)}`
        $('#forecast-weather-sunset_today').html(`<h5 id="forecast-weather-sunset">${todayWeatherSunset24Hour}</h5>`);
        $('#forecast-weather-sunset_today1').html(`<h5 id="forecast-weather-sunset">${today1WeatherSunset24Hour}</h5>`);
        $('#forecast-weather-sunset_today2').html(`<h5 id="forecast-weather-sunset">${today2WeatherSunset24Hour}</h5>`);

        let lat = result['weatherApi'][0]['current_weather']['coord']['lat'];
        let lon = result['weatherApi'][0]['current_weather']['coord']['lon'];
                
        switch(functionCalled) {
            case 'countrySearch' :     
                openCage(lat, lon, functionCalled)
                //currentTimeAPI(lat, lon);
                mymap.flyTo([lat, lon], 4);
                searchBarStyle_Initial(lon, lat)
            }
        preloader()
        }},
        error: function(xhr, status, error){
            var errorMessage = `Weather API Error: ${xhr.status} : ${xhr.statusText}. Error was generated calling ${functionCalled} with capital: ${capital}`
            console.log(errorMessage);
            errorLog(errorMessage)
            preloader()
            alert('Doh! something went wrong when attempting to retrieve weather information for this country. The error has been logged for investigation.  Please choose another country.')

        }
    })
}
    

// 3.Open Cage
const openCage = (lat,lon, functionCalled) => {
    
     $.ajax({
        url: "./php/openCage.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: lat,
            lon: lon,
            functionCalled: functionCalled,
        },
        success: function(result) {
            console.log(result);   //Bug Testing
            // Removes data from the previous search to prevent incorrect display in case of only partial data return from API calls
            $('.txtSide').html('');
            $('.txtSpeed').html('');
            $('.info-currency-container').html('');
            $('.country-name').html('');
            $('.info-latlon-container').html('');

            //Applies the returned API call to the DOM
            $('.txtSide').html(result['open_cage'][0]['roadinfo']['sideOfRoad']);
            $('.txtSpeed').html(result['open_cage'][0]['roadinfo']['speed']);
            $('.info-currency-container').html(`<h5>Currency</h5><br><h6 class="country-currency-name"> ${result['open_cage'][0]['currency']['symbol']}: ${result['open_cage'][0]['currency']['name']}</h6>`);
            $('.country-name').html(result['open_cage'][0]['country']);
            $('.info-latlon-container').html(`<h5> Co-Ords <br> Lat, Lon </h5><h6 class="country-latlon">${lat} / ${lon}</h6>`);

            let country = result['open_cage'][0]['country']
            let alpha2code = result['open_cage'][0]['countryCode']
            let alpha3code      = result['open_cage'][0]['currency']['iso_code'];                                    
            //mymap.setView(new L.LatLng(lat, lon), 4) - creates unstable behavior in desktop mode, on hover
            switch(functionCalled) {
                case 'latLonSearch' :     
                    restCountriesSearch(country, alpha2code, functionCalled)
                    covid19api(alpha2code);
                    //currentNews(alpha2code)
                    //triposo(alpha2code)
                    //triposoCities(alpha2code)
                    exchangeRateApi(alpha3code)
                break;
                case 'countrySearch' :
                    covid19api(alpha2code)
                    //currentNews(alpha2code)
                    //triposo(alpha2code)
                    //triposoCities(alpha2code)
                    exchangeRateApi(alpha3code)
            }
            preloader() 
            

        },
        error: function(xhr, status, error){
            var errorMessage = `Open Cage Error ${xhr.status} : ${xhr.statusText}. Error was generated calling ${functionCalled} at lat: ${lat} lon: ${lon}`
            console.log(errorMessage);
            errorLog(errorMessage)
            preloader()
            alert('Unfortunately there has been an issue in locating this Country on the database. The error has been logged for investigation. Please make another selection.')
        }
    })
}

// 4.Covid-19
const covid19api = (alpha2code) => {

    $.ajax({
        url: "./php/covid19.php",
        type: 'POST',
        dataType: 'json',
        data: {
            countryCode: alpha2code,
        },

        success: function(result) {
            console.log(result);   //Bug Testing
            $totalConf      = result['covid_19']['total_confirmed'];
            $totalDeath     = result['covid_19']['total_deaths'];
            $totalRecover   = result['covid_19']['total_recovered'];
            $recentConf     = result['covid_19']['new_confirmed'];

            //sends data to generate chart.
            totalCovidChart($totalDeath, $totalRecover, $recentConf)
            $('.covid-total-header').html('');
            $('#covid-totals-text').html('');

            $('#covid-totals-text').append(`\
                <div class="covid-results-mini-div">\
                    <h5 class="covid-numbers-headers">Total Confirmed Cases</h5>\
                    <p id="covid-total-death-numbers" class="covid-numbers-class"> ${$totalConf} </p>\
                </div>\
                <div class="covid-results-mini-div">\
                    <h5 class="covid-numbers-headers">New Cases</h5>\
                    <p id="covid-total-recent-numbers" class="covid-numbers-class"> ${$recentConf} </p>\
                </div>\
                <div class="covid-results-mini-div">\
                    <h5 class="covid-numbers-headers">Recovered</h5>\
                    <p id="covid-total-recover-numbers" class="covid-numbers-class"> ${$totalRecover} </p>\
                </div>\
                <div class="covid-results-mini-div">\
                    <h5 class="covid-numbers-headers">Deaths</h5>\
                    <p id="covid-total-death-numbers" class="covid-numbers-class"> ${$totalDeath} </p>\
                </div>\
            `)
            preloader()
            
        },
        error: function(xhr, status, error){
            var errorMessage = `Covid-19 Error: ${xhr.status} : ${xhr.statusText}. Error was generated with alpha2code: ${alpha2code}`
            console.log(errorMessage);
            errorLog(errorMessage)
            preloader()
            alert('Doh! something went wrong when attempting to retrieve Covid-19 information for this country. The error has been logged for investigation.  Please choose another country.')

            }
    })
}

// 5.Current Time
const currentTimeAPI = (lat, lon) => {
    $.ajax({
        url: "./php/currentTime.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: lat,
            lon: lon,
        },

        success: function(result){
            console.log(result)  //Bug Testing
            //format '2020-11-05 16:18:22'
            $time = result['current_time'][0]['formatted']

            $('.clock-display').html(`
            <h5>Current <br> Time</h5>\
            <div class="clock-field">\
                <p class="hours">${$time.slice(11,13)}</p>\
                <p class="colon">:</p>\
                <p class="minutes">${$time.slice(14,16)}</p>\
                <p class="colon">:</p>\
                <p class="seconds">${$time.slice(17)}</p>\
            </div>`);
        },
        error: function(xhr, status, error){
            var errorMessage = `current Time Error: ${xhr.status} : ${xhr.statusText}. Error was generated using lat: ${lat} lon: ${lon}`
            console.log(errorMessage);
            errorLog(errorMessage)
            preloader()
            alert('Doh! something went wrong when attempting to retrieve current time information for this country. The error has been logged for investigation.  Please choose another country.')

            }
    })
}

// 6.Exchange Rate API
const exchangeRateApi = (alpha3code) => {
    $.ajax({
        url: "./php/exchangeRateApi.php",
        type: 'POST',
        dataType: 'json',
        data: {
            alpha3code: alpha3code,
        },

        success: function(result){
            console.log(result)  //Bug Testing
            $base = result['exchange_rate_api']['base']
            $('#base-currency').html('<h5> 1 ' + $base + ' will buy you.....</h5>') 
            $usd    = result['exchange_rate_api']['rates']['USD'];
            $eur    = result['exchange_rate_api']['rates']['EUR']
            $gbp    = result['exchange_rate_api']['rates']['GBP']
            $aud    = result['exchange_rate_api']['rates']['AUD']
            $jpy    = result['exchange_rate_api']['rates']['JPY']
            $cad    = result['exchange_rate_api']['rates']['CAD']
            $swiss  = result['exchange_rate_api']['rates']['CHF']
            $china  = result['exchange_rate_api']['rates']['CNY']
            $nzd    = result['exchange_rate_api']['rates']['NZD']
            $hkd    = result['exchange_rate_api']['rates']['HKD']
            $('#txt-usd').html($usd.toFixed(2));
            $('#txt-eur').html($eur.toFixed(2));
            $('#txt-gbp').html($gbp.toFixed(2));
            $('#txt-aud').html($aud.toFixed(2));
            $('#txt-jpy').html($jpy.toFixed(2));
            $('#txt-cad').html($cad.toFixed(2));
            $('#txt-swiss').html($swiss.toFixed(2));
            $('#txt-china').html($china.toFixed(2));
            $('#txt-nzd').html($nzd.toFixed(2));
            $('#txt-hkd').html($hkd.toFixed(2));

            preloader()
        },
        error: function(xhr, status, error){
            var errorMessage = `Exchange Rate Error: ${xhr.status} : ${xhr.statusText}. Error was generated using alpha3code: ${alpha3code}`
            console.log(errorMessage);
            errorLog(errorMessage)
            preloader()
            alert('Doh! something went wrong when attempting to retrieve the exchange rates for this country. The error has been logged for investigation.  Please choose another country.')
            }
    })
}


// 7.Triposo - Country Blurb
const triposo = (alpha2code) => {
    $.ajax({
        url: "./php/triposo.php",
        type: 'POST',
        dataType: 'json',
        data: {
            alpha2code: alpha2code,
        },

        success: function(result){
            console.log(result)
            const snippet = result['triposo_country'][0]['snippet'];
            $('.triposo-snippet').html(snippet);
        },

        error: function(xhr, status, error){
            var errorMessage = `Triposo Country Blurb Error: ${xhr.status} : ${xhr.statusText}. Error was generated using alpha2code ${alpha2code}`
            console.log(errorMessage);
            errorLog(errorMessage)
            preloader()
            alert('Doh! something went wrong when attempting to retrieve some information for this country. The error has been logged for investigation.  Please choose another country.')

        }
    })
}

// 8.Triposo - Top Ten Cities by country,
const triposoCities = (alpha2code) => {
    $.ajax({
        url: "./php/triposo_cities.php",
        type: 'POST',
        dataType: 'json',
        data: {
            alpha2code: alpha2code,
        },

        success: function(result){
            console.log(result)  //Bug Testing
            $cityMarkers = result['triposo_cities']
            topCities($cityMarkers)
        },
        error: function(xhr, status, error){
            var errorMessage = `Triposo Top Cities Error: ${xhr.status} : ${xhr.statusText}. Error was generated using alpha2code ${alpha2code}`
            console.log(errorMessage);
            errorLog(errorMessage)
            preloader()
            alert('Doh! something went wrong when attempting to retrieve some information for this country. The error has been logged for investigation.  Please choose another country.')

        }
    })
}

// 9.Current News
//return top 20 news headlines and append then to the news DIV
const currentNews = (alpha2code) => {
    $.ajax({
        url: "./php/newsApi.php",
        type: 'POST',
        dataType: 'json',
        data: {
            alpha2code: alpha2code,
        },

        success: function(result){
            console.log(result)  //Bug Testing
            $('.news-image').remove();
            $('.news-link').remove();
            $('.news-title').remove();
            $('.news-description').remove();

            if(result['current_news']['totalResults'] === 0) {
                $('#news-div').append('<h3 class="news-title">Sorry Live News is Currently Not Available For This Country.</h3>')
            } else if (result['current_news']['code'] === 'rateLimited'){
                $('#news-div').append('<h3 class="news-title">You have made too many requests recently. Developer accounts are limited to 100 requests over a 24 hour period (50 requests available every 12 hours). Please upgrade to a paid plan if you need more requests.</h3>')
            } else {
            for(i=0; i < result['current_news']['articles'].length; i++) {
                //Prevents 'null' errors appearing in console when APi information is no complete.
                !result['current_news']['articles'][i]['title']         ? 'No Info Avlb' : $title = result['current_news']['articles'][i]['title'];
                !result['current_news']['articles'][i]['description']   ? 'No Info Avlb' : $description = result['current_news']['articles'][i]['description'];
                !result['current_news']['articles'][i]['url']           ? 'No Info Avlb' : $url = result['current_news']['articles'][i]['url'];
                !result['current_news']['articles'][i]['urlToImage']    ? 'No Info Avlb' : $image = result['current_news']['articles'][i]['urlToImage'];
                
                // $title = result['current_news']['articles'][i]['title'];
                // $description = result['current_news']['articles'][i]['description'];
                // $url = result['current_news']['articles'][i]['url'];
                // $image = result['current_news']['articles'][i]['urlToImage'];


                $('#news-div').append(`
                    <div class="news-articles">\
                    <a href="${$url}" class="news-link"><img src="${$image}" class="news-image">\
                    <h3 class="news-title">${$title}'</h3>\
                    <p class="news-description">${$description}</p></a>\
                    </div>\
                 `)
            }
        }
        },
        error: function(xhr, status, error){
            var errorMessage = `Current News Error: ${xhr.status} : ${xhr.statusText}. Error was generated using alpha2code ${alpha2code}`
            console.log(errorMessage);
            errorLog(errorMessage)
        }
    })
}

// 10.Error Log
const errorLog = (errorMessage) => {
    console.log('errorlog called')
    $.ajax({
        url: "./php/errorLog.php",
        type: 'POST',
        //dataType: 'json',
        data: {
            errorMessage: errorMessage,
        },

        success: function(result){
            console.log(result)  //Bug Testing
        },
        error: function(xhr, status, error){
            console.log(`errorLog.php failed: ${result}`)
        }
    })
}


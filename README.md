# Gazetteer

Gazetteer Project
Create a mobile web app: 'a geographical dictionary or directory used in conjunction with a map or atlas. It typically contains information concerning the geographical makeup, social statistics and physical features of a country, region, or continent.'

Frameworks/Plugins:

    1. leafletJs - import via cdn.
    2. Jquery    - imported via cdn.
    3. leafletJs - terminator - provides day/night overlay.
    4. leafletJs - markerCluster imported via cdn.
    5. bootstrap - imported via cdn.
    6. chartJs   - creates covid chart
    7. autocomplete - https://github.com/devbridge/jQuery-Autocomplete

API's in use are:

    1.Opencage      - Supports reverse geocoding for location identity ie. lat/lng coord returns text location.
    2.RestCountries - Well known free resource for country information.
    3.Exchange Rate - free resource for worldwide exchange rates. https://exchangerate.host/
    4.Current Time  - Worldwide data and time API.
    5.Weather API   - Free resource for current/forecast weather, also provides weather icons.
    6.News API      - Free news aggregator, for major countries around the world (but currently not all).
    7.covid19 API   - Free worldwide resouce for covid statistics.
    8.triposo       - Lots of info for worldwide countrys focuses on tourism info.
    9.openflights   - Not technically an API but provides a data file by way of download for over 7000 aiports.

Cron Jobs:

    1.covid data pulled twice a day and stored in db.
    2.covid data pulled from db twice a day to refresh map data

Upload Process (hostinger):

    1.zip, upload and extract files in public_html folder.
    2.adjust connection settings in dbConnection.php from localhost to live hosting.
    3.adjust the file read/write locations in covidJson.php to support cron on hostinger.
    4.ensure .htaccess file is loaded to root, turn on hostinger rules.
    5.check for blanks fields in restCountries DB, amend or import Db from localhost
    6.ensure all api calls have been re-activated

Manual Jobs:

    1.Airport data: if new data added to db then the marker variable will need repopulating by running airportDataConversion.php.

Key Function Flow:

    There are 3 main function flows for deliverying data to the user.
    1. Map Load     - User geo location provides Lat/Lng coords and calls the following.
        i.   mapload
        ii.  Current Time API
        iii. openCage returns countrycode and calls:
                i.  Covid
                ii. Current News
                iii.Triposo
                iv. Rest Countries returns country capital and calls:
                    i. Weather Api
    2. Map Click    - Provides Lat/Lng coords from onclick and calls as per above.
    3. Search Form  - Provides text of country and calls
        i. Rest Countries returns country capital and calls:
            i. Weather Api which returns lat/lng can calls:
                i.  Current Time
                ii. Open Cage returns countrycode and calls:
                    i.   Covid
                    ii.  Current News
                    iii. Triposo


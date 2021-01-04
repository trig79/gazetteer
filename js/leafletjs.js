//Nb: countries varible is located in       /resources/culturalVector.js
//Nb: smallCountries varible is located in  /resources/countriesSmallGeoJson.js
//Nb: covid varible is located in           /resources/covidJson.js

let mymap;
let populationLayer;
let initialLoadLayer;
let covidLayer;
let onclickTarget;


const cityIcon = L.icon({
    iconUrl : './images/city.svg',
    iconSize:[30, 38], // size of the icon
})
const youAreHereIcon = L.icon({
    iconUrl : './images/you-are-here.svg',
    iconSize:[35, 43], // size of the icon
})
const airportIcon = L.icon({
    iconUrl : './images/airport.svg',
    iconSize:[30, 30], // size of the icon
})


/////////////////    LAYERS   //////////////////////
// 1.Population
// 2.Covid
// 3.Intial Load Layer
// 4.Top Ten Cities Per Country
// 5.Shared Functions
// 6.World Airport Layer - within mapLoad()

// 1.POPULATION LAYER
const populationLayerColors = (popEst) => {
    return  popEst > 120000000  ? '#b10026' :
            popEst > 100000000  ? '#e31a1c' :
            popEst > 80000000   ? '#fc4e2a' :
            popEst > 60000000   ? '#fd8d3c' :
            popEst > 40000000   ? '#feb24c' :
            popEst > 20000000   ? '#fed976' :
                                  '#ffffb2' ;
    }

const populationStyle = (feature) => {
    return {
        fillColor: populationLayerColors(feature.properties.POP_EST),
        weight: 1.5,
        opacity: 1,
        color: '#666',
        dashArray: 3,
        fillOpacity: 0.7,
    }
}
const onClickInfo_population = (e) => {
    //triggers api calls
    let coord = e.latlng;
    let lat = coord.lat.toFixed(2);
    let lng = coord.lng.toFixed(2);
    countryOnClick(lat,lng)

    //zooms to location
    mymap.flyTo([lat, lng], 4);

    //resets style layer. i.e. only one country should be highlighted at a time
    let layerName = e.sourceTarget.defaultOptions.onEachFeature.name
    layerName == 'onEachFeature_population' ? populationLayer.resetStyle() : covidLayer.resetStyle()
    
    //feeds in to reset layer function.  prevents mouseout reseting the styling created from onclick.
    onclickTarget = e.target;

    let layer = e.target;
    layer.setStyle(
        {   
            fillColor: 'blue',
            weight: 2,
            opacity: 1,
            color: 'blue',
            dashArray: 3,
            fillOpacity: 0.2,
        },
    )

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}
let populationLegend = L.control({position: 'bottomright'});

populationLegend.onAdd = function (mymap) {
    //must itrate through real grades as mentioned in populationLayerColors for function to work. but displayed grades are used for visuals on the map.
    var div = L.DomUtil.create('div', 'info-legend'),
        grades = [0, 20000000, 40000000, 60000000, 80000000, 100000000, 120000000],
        displayedGrades = [0, '2', '4', '6', '8', '10', '12'];

        div.innerHTML += `<h5 id="legend-pop-header">Population (millions)</h5>`
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            `<div class="pop-legend-mini-div">
            <i style="background:${populationLayerColors(grades[i] + 1)}"></i>
            <h5>${displayedGrades[i] + (displayedGrades[i + 1] ? '&ndash;' + displayedGrades[i + 1] + '<br>' : '+')}</h5>
            </div>`
    }
    return div;
};

const onEachFeature_population = (feature, layer) => {
    layer.on({
        mouseover:  highlightCountry,
        mouseout:   resetHighlightCountry,
        click :     onClickInfo,
        dblclick :  zoomToFeature,
        })
    }


// 2.COVID LAYER    
const covidLayerColors = (totCase) => {
    return  totCase > 750000 ? '#800026' :
            totCase > 500000 ? '#bd0026' :
            totCase > 250000 ? '#e31a1c' :
            totCase > 100000 ? '#fc4e2a' :
            totCase > 75000  ? '#fd8d3c' :
            totCase > 50000  ? '#feb24c' :
            totCase > 25000  ? '#fed976' :
            totCase > 10000  ? '#ffeda0' :
            totCase > 5000   ? '#ffffcc' :
                               '#fff5eb' ;
    }

const covidStyle = (feature) => {
    return {
        fillColor: covidLayerColors(ignoreNull(feature)),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: 3,
        fillOpacity: 0.7,
    }
}

//error handling for countries that have nil data.
const ignoreNull = (feature) => {
    try { return feature.covid.total_confirmed} catch (err) { return 0 } 
}

let covidLegend = L.control({position: 'bottomright'});

covidLegend.onAdd = function (mymap) {

    var div = L.DomUtil.create('div', 'info-legend'),
        grades = [0, 5000, 10000, 25000, 50000, 75000, 100000, 250000, 500000, 750000],
        displayedGrades = [0, '5k', '10k', '25k', '50k', '75k', '100k', '250k', '500k', '750k'];

        div.innerHTML += `<h5 id="legend-covid-header">Covid Infections</h5>`
        // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            `<div class="covid-legend-mini-div">
            <i style="background:${covidLayerColors(grades[i] + 1)}"></i>
            <h5>${displayedGrades[i] + (displayedGrades[i + 1] ? '&ndash;' + displayedGrades[i + 1] + '<br>' : '+')}</h5>
            </div>`
        }
    return div;
};

const onEachFeature_covid = (feature, layer) => {
    layer.on({
        mouseover: highlightCountry,
        mouseout: resetHighlightCountry,
        click : onClickInfo,
        dblclick : zoomToFeature,
        })
    }


    
// 3. INTIAL LOAD LAYER 
const intialLoadStyle = (feature) => {
    return {
        weight: 0,
        //color: '#666',
        //dashArray: 1,
        fillOpacity: 0,
    }
}

const highlightCountry_initial = (e) => {
    //console.log(e) //bug testing

    let highlightCountryTarget = e.target
    let layer = e.target;

    if(highlightCountryTarget != onclickTarget) {
        layer.setStyle(
            {   
                weight: 1,
                color: '#666',
                // dashArray: '',
                fillOpacity: 0.7
            },
        )}

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

const searchBarStyle_Initial = (lng, lat) => {
    //returns the 'e.target' values
    layer = {}
    layer = leafletPip.pointInLayer([lng, lat], initialLoadLayer);
    target = layer[0]

    onClickInfo(target, 'search')
    }

const onClickInfo = (e, functionCalled) => {
    let layer;
    //this function is called from 2 places, the first part relates to a click on the map. in which case we need to use the latlng to trigger apis calls.
    //the 2nd part is called via the search bar in which case the api call have already been triggered and we only need the coutry to be highlighted on the map.
    if (!functionCalled){
        layer = e.target
        //triggers api calls
        let coord = e.latlng;
        let lat = coord.lat.toFixed(2);
        let lng = coord.lng.toFixed(2);
        countryOnClick(lat,lng)
    
        //zooms to location
        mymap.flyTo([lat, lng], 4);
        //feeds in to reset layer function.  prevents mouseout resetting the styling created from onclick.
        onclickTarget = e.target;
    } else{
        layer = e
        //feeds in to reset layer function.  prevents mouseout resetting the styling created from onclick.
        onclickTarget = e;
    }

    if(layer) {
        //resets style layer. i.e. only one country should be highlighted at a time
        initialLoadLayer.resetStyle()
        populationLayer.resetStyle()
        covidLayer.resetStyle()

        layer.setStyle(
            {   
                fillColor: 'blue',
                weight: 2,
                opacity: 1,
                color: 'blue',
                dashArray: 3,
                fillOpacity: 0.2,

                // fillColor: 'red',
                // weight: 2,
                // opacity: 1,
                // color: 'white',
                // dashArray: 3,
                // fillOpacity: 0.7,
            },
        )
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
    } 
    }
    
const onEachFeature_initial = (feature, layer) => {
    layer.on({
        mouseover: highlightCountry_initial,
        mouseout: resetHighlightCountry,
        click : onClickInfo,
        dblclick : zoomToFeature,
        })
    }

// 4. TOP 10 CITIES LAYER - adds top 10 cities per country to map, called from api.js

let cityCluster;
const topCities = (cityMarkers) => {
    if(cityCluster){ mymap.removeLayer(cityCluster) }
    
    cityCluster = L.markerClusterGroup({
        maxClusterRadius: 60,
    });
    for ( let i = 0; i < $cityMarkers.length; ++i ){
        let popup = $cityMarkers[i].name + '<br/>' + $cityMarkers[i].snippet;
        let m = L.marker( [$cityMarkers[i].lat, $cityMarkers[i].lon], {icon: cityIcon}).bindPopup( popup );
        
        cityCluster.addLayer( m );
    }
    mymap.addLayer( cityCluster );
}

const setViewPop = () => {
    mymap.setView([20.0,35.0],1)
}

// 5. SHARED LAYER FUNCTIONS


const resetHighlightCountry = (e) => {
    //prevents the styling of the onClick selected country being removed on mouseout
    let resetTarget = e.target
    if(resetTarget != onclickTarget) {
        let layerName = e.sourceTarget.defaultOptions.onEachFeature.name
        layerName == 'onEachFeature_population' ? 
                populationLayer.resetStyle(e.target) : layerName == 'onEachFeature_covid' ?
                covidLayer.resetStyle(e.target)      : initialLoadLayer.resetStyle(e.target)
    }
    }
        
const zoomToFeature = (e) => {
    mymap.fitBounds(e.target.getBounds())
    }

const highlightCountry = (e) => {
    let highlightCountryTarget = e.target
    let layer = e.target;

    if(highlightCountryTarget != onclickTarget) {
        layer.setStyle(
            {   
                weight: 1.5,
                color: 'white',
                dashArray: '',
                fillOpacity: 0.1
            },
        )
    }

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}
 


/////////////////    MAP LOAD   //////////////////////

const mapLoad = (lat,lng) => {
    const southWest = L.latLng(-90, -180);
    const northEast = L.latLng(90, 180);
    const bounds    = L.latLngBounds(southWest, northEast);

    //zoomcontrol deactivated here and reinstated as final call to allow better positioning on map. as per guidance from leafletJs 
    //minZoom prevents user zooming outside of boundary.
    mymap = L.map('mapid', { 
        zoomControl: false, 
        minZoom: 3,
        //dragging: !L.Browser.mobile,
        tap: !L.Browser.mobile,
        bounceAtZoomLimits: false,
        touchZoom: true,
        
    });
    //set starting point of map to user lat/lng coords        
    mymap.setView([lat, lng], 4);

    //sets boundary limits of map                                     
    mymap.setMaxBounds([[-90, -180],[90, 180]]); 
    mymap.fitBounds([[-90, -180],[90, 180]]);    

    //MARKER CONFIGS

    //Adds user Location marker
    const userMarker = L.marker([lat, lng]).addTo(mymap);    

    // 6. WORLD AIRPORTS LAYER
    //marker variable can be found in cache/airportData.js
    const airportCluster = L.markerClusterGroup({
        maxClusterRadius: 60,
    });
        for ( let i = 0; i < markers.length; ++i ) {
            let popup = markers[i].name +
                '<br/>' + markers[i].location +
                '<br/><b>IATA Code:</b> ' + markers[i].iata3 +
                '<br/><b>ICAO Code:</b> ' + markers[i].icao4 +
                '<br/><b>Altitude:</b> ' + Math.round( markers[i].altitude * 0.3048 ) + ' m';
        
            let m = L.marker( [markers[i].lat, markers[i].lon], {icon: airportIcon})
                .bindPopup( popup );
                airportCluster.addLayer( m );
        }

    //MAP STYLES IMPORT
    const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_imagery/MapServer/tile/{z}/{y}/{x}', {
        noWrap: true,
        attribution: '&copy; <a href="arcgisonline.com">arcgisonline</a> contributors',
        })

    const minimalMap = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        noWrap: true,
        attribution: '&copy; <a href="https://carto.com/">carto.com</a> contributors'
        })

    const openStreetMap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        noWrap: true,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        //maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoidHJpZzc5IiwiYSI6ImNrZm1mNzRzbDF4cnEyeW52NHk0ajF4OXUifQ.2HwgGrxrBrHm8YB89REHqA'
        }).addTo(mymap)

    const lightMap = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
        noWrap: true,
        //maxZoom: 20,
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    });

    const darkMap = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
        //maxZoom: 20,
        noWrap: true,
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    });


    // LAYER CONFIG 
    initialLoadLayer =  L.geoJson(
        smallCountries,
        {
            style           : intialLoadStyle,
            onEachFeature   : onEachFeature_initial,
        }
        ).addTo(mymap)
            
    //timezone layer plugin
    dayNightLayer = L.terminator();

    populationLayer =  L.geoJson(
        countries,
            {
            style           : populationStyle,
            onEachFeature   : onEachFeature_population,
            }
    )

    covidLayer =  L.geoJson(
        covidJson,
            {
            style           : covidStyle,
            onEachFeature   : onEachFeature_covid,
            }
    )

    //creates map menu 
    const baseMaps = {
        "High Contrast" : openStreetMap,
        "Minimal Map"   : minimalMap,
        "Light Map"     : lightMap,
        "Dark Map"      : darkMap,
        "Satellite"     : satellite,
        };

    const overlayMaps = {
        //back up code in case of formatting needs
        // "<span class='overlay-map-list' id='populationLayer'>Population</span>"         : populationLayer,
        // "<span class='overlay-map-list' id='covidLayer'>Covid</span>"                   : covidLayer,
        // "<span class='overlay-map-list' id='dayNightLayer'>Day/Night Zones</span>"      : dayNightLayer,
        // "<span class='overlay-map-list' id='covidLayer'>World Airport</span>"           : airportCluster,
        "Population"        : populationLayer,
        "Covid-19"          : covidLayer,
        "Time Zone"         : dayNightLayer,
        "World Airports"    : airportCluster,
    }

    //zoomControl called here to allow postioning below layer icon
    L.control.zoom({ 
        position: 'topright',
        zoomInText: '',
        zoomOutText: '',   
    }).addTo(mymap);   
    
    L.control.layers(baseMaps, overlayMaps).addTo(mymap);
    
    // LAYER EVENT 'ONADD'
    mymap.on('overlayadd', function(e){
        //console.log(e) //Bug Testing
        if(e.name === 'Population') {
            populationLegend.addTo(mymap);
            mymap.setView([0, 0], 2);
            covidLayer.remove(mymap);
        } else if (e.name === 'Covid-19'){
            populationLayer.remove(mymap);
            populationLegend.remove(mymap)
            covidLegend.addTo(mymap);
            mymap.setView([0, 0], 2);
        } else if (e.name === 'Time Zone'){
            mymap.setView([0, 0], 2);

        }
    })

    mymap.on('overlayremove', function(e){
        //console.log(e) // Bug Testing
        if(e.name === 'Population') {
            populationLegend.remove(mymap);
        } else if (e.name === 'Covid-19'){
            covidLegend.remove(mymap);
        }

    })
    
}  




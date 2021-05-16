//Create the map object (centered in the US)
let myMap = L.map("map",{
    center: [37.09, -95.71],
    zoom: 5
});


// Get the earthquake data from the last 7 days

let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
let earthquakeCircles = [];

d3.json(queryUrl).then(function(data){
    
    let earthquakes = data.features;
    console.log(earthquakes);
    earthquakes.forEach(earthquake =>{
        let long = earthquake.geometry.coordinates[0];
        let lat = earthquake.geometry.coordinates[1];
        let depth = earthquake.geometry.coordinates[2];
        let mag = earthquake.properties.mag;
        let color = getColor(depth);

        earthquakeCircles.push(
            L.circle([lat,long], {
                color: color,
                fillColor: color,
                fillOpacity: 0.75,
                radius: mag*10000
            }).bindPopup(earthquake.properties.place)
        );
           

    });

});

// Add the circles markets to a layer group
let earthquakeLayer = L.layerGroup(earthquakeCircles);

// Create the background map image
let lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
}).addTo(myMap);


// Function to get the color of the circle
// based on the depth of the earthquake

function getColor(depth){
    let color = "";
    if (depth > 90){
        color = "#D9302C"; // Red
    } else if (depth > 69){
        color = "#E6873C"; // Orange
    } else if (depth > 49){
        color = "#F0DD5D"; // Yellow
    } else if (depth > 29){
        color = "#0DB14B"; // Green
    } else if (depth > 9){
        color = "#83D1C4"; //Aqua
    } else{
        color = "#1C4481"; //Blue
    }
    return color;
}


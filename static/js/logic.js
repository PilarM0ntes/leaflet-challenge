// Get the earthquake data from the last 7 days
// Only the first 500 records

let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
let earthquakeCircles = [];

d3.json(queryUrl).then(function(data){
    console.log(data);
    let earthquakes = data.features.slice(0,500);
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
            }).bindPopup("<h3>" + earthquake.properties.place + "</h3>")
        );
    });

    // Add the circles markets to a layer group
    let earthquakeLayer = L.layerGroup(earthquakeCircles);
    createMap(earthquakeLayer);

});

function createMap(earthquakeLayer){
        // Create the background map image
        let lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
            attribution: "",
            tileSize: 512,
            maxZoom: 18,
            zoomOffset: -1,
            id: "mapbox/light-v10",
            accessToken: API_KEY
            });
        
        let outdoorMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
            attribution: "",
            tileSize: 512,
            maxZoom: 18,
            zoomOffset: -1,
            id: "mapbox/outdoors-v11",
            accessToken: API_KEY
        });
    
        // Create Map options
        let baseMaps = {
            Light: lightMap,
            Outdoors: outdoorMap
        };
    
        // Create the overlay options
        let overlayMaps = {
            Earthquake: earthquakeLayer
        };
    
        //Create the map object (centered in the US)
        let myMap = L.map("map",{
            center: [37.09, -95.71],
            zoom: 5,
            layers: [lightMap, earthquakeLayer]
        });
    
        L.control.layers(baseMaps, overlayMaps).addTo(myMap);

        //Create Legends
        let legend = L.control({position: "bottomright"});
        legend.onAdd = function(){
            let div = L.DomUtil.create("div", "info legend");
            let labels = []
            let limits = [8,9,29,49,69,90];
            let categories = ["-10-10","10-30","30-50","50-70", "70-90","+90"];


            labels.push("<text x =\"10\" y=\"25\""
                + "style=\"font-size:20px; font-weight:bold;\">"+
                "Quake Depth"+"</text>");

            limits.forEach(function(limit, index){
                //Create the square for the legend & the text
                let ypos = 40+(40*index)
                let label = "<rect x=\"10\" y=\"" + ypos + "\" height=\"40\""+
                " width=\"40\" style=\"fill:" + getColor(limit +1) + 
                ";fill-opacity:0.75;\"/> <text x =\"60\" y=\"" + (ypos+25) +
                "\" style=\"font-size:20px;\">"+categories[index]+"</text>";

                labels.push(label);
            });

            div.innerHTML += "<svg height=\"300\" width=\"150\" style=\"background-color:white\">"+
            labels.join("") + "</svg>";
            console.log(div);
            return div;

        };
        // Adding legend to the map
        legend.addTo(myMap);
}







// Function to get the color of the circle
// based on the depth of the earthquake

function getColor(depth){
    let color = "";
    if (depth > 90){
        color = "#022D41"; // Cyprus
    } else if (depth > 69){
        color = "#FE424D"; // Crush
    } else if (depth > 49){
        color = "#F8981D"; // Orange
    } else if (depth > 29){
        color = "#5BBDC8"; // Turquoise
    } else if (depth > 9){
        color = "#F0DD5D"; //Yellow
    } else{
        color = "#FEC0C1"; // Blush
    }
    return color;
}


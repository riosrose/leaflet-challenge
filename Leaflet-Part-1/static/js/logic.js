// Initialize the map
let myMap = L.map('map', {
  center: [39.83, -98.59],
  zoom: 2.5
});

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// API endpoint for earthquake data
let queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

d3.json(queryURL).then(function (data) {
// // Fetch earthquake data and process it
// fetch(queryUrl)
//   .then(response => response.json())
//   .then(data => createFeatures(data.features))
//   .catch(error => console.error('Error fetching data:', error));

// Function to create features (markers) on the map
function createFeatures(eqData) {
  // Function to style each circle marker
  function styleInfo(feature) {
    return {
      radius: getRadius(feature.properties.mag),
      fillColor: getColor(feature.geometry.coordinates[2]), // Color based on depth
      color: '#000',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
  }

  // Function to determine marker size based on magnitude
  function getRadius(magnitude) {
    return magnitude ? magnitude * 3 : 1; // Scale the radius based on magnitude
  }

  // Function to determine marker color based on depth
  function getColor(depth) {
    if (depth > 90) return '#ea2c2c'; // Deep earthquakes
    if (depth > 70) return '#ea822c';
    if (depth > 50) return '#ee9c00';
    if (depth > 30) return '#eecc00';
    if (depth > 10) return '#d4ee00';
    return '#98ee00'; // Shallow earthquakes
  }

  // Add circle markers for each earthquake
  L.geoJSON(eqData, {
    pointToLayer: (feature, latlng) => L.circleMarker(latlng, styleInfo(feature)),
    onEachFeature: (feature, layer) => {
      const mag = feature.properties.mag;
      const place = feature.properties.place;
      const depth = feature.geometry.coordinates[2]; // Depth is the third value in the coordinates array
      layer.bindPopup(`<h3>${place}</h3><p>Magnitude: ${mag}</p><p>Depth: ${depth} km</p>`);
    }
  }).addTo(myMap);

// Create and add the legend to the map
const legend = L.control({ position: 'bottomright' });

legend.onAdd = function() {
  const div = L.DomUtil.create('div', 'info legend');
  const depths = [-10, 10, 30, 50, 70, 90];
  const labels = [];

  // Loop through depth intervals and generate a label with colored square for each interval
  for (let i = 0; i < depths.length; i++) {
    div.innerHTML +=
      '<i class="legend-square" style="background:' + getColor(depths[i] + 1) + '"></i> ' +
      depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
  }

  return div;
};

legend.addTo(myMap);
}
}

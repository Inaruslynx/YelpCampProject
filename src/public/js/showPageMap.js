mapboxgl.accessToken = mapToken;
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: geometry.coordinates,
  zoom: 10,
});

new mapboxgl.Marker()
  .setLngLat(geometry.coordinates)
  .addTo(map);

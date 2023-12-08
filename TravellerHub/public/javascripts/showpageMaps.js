
mapboxgl.accessToken = 'pk.eyJ1IjoiYWRpdHlhcHJha2FzaDY3IiwiYSI6ImNrdndiYzV6ZzBjcTUyb29lenF1OWc1YW4ifQ.MUVqfUOXnFgjFgsRd6WAJg';

  const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/dark-v9', // style URL
  center: destination.geometry.coordinates, // starting position [lng, lat]
  zoom: 4// starting zoom
  });
  map.addControl(new mapboxgl.NavigationControl());
  new mapboxgl.Marker()
  .setLngLat( destination.geometry.coordinates)
  .setPopup(
      new mapboxgl.Popup({ offset: 25 })
          .setHTML(
              `<h3>${destination.name}</h3><p>${destination.location}</p>`
          )
  )
  .addTo(map)

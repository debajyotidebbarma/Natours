/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoibWVvd3lwaG9lbml4IiwiYSI6ImNrbzkzZnNhYzBxMHMyd211bXB4dXdqdGcifQ.aGrXdRpeV4b6auWhDamLyA';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/meowyphoenix/cko948te05qbw17qs4ncc3bcp',
    scrollZoom: false,
    //   center: [-118.113491, 34.111745],
    //   zoom: 8,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    //create Marker

    const el = document.createElement('div');
    el.className = 'marker';

    //Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    //Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>${loc.description}</p>`)
      .addTo(map);

    // Extends the map bounds to include the current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};

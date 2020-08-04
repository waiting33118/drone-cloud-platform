(function () {
  mapboxgl.accessToken = 'pk.eyJ1Ijoid2FpdGluZzMzMTE4IiwiYSI6ImNrZDVlZWp6MjFxcXQyeHF2bW0xenU4YXoifQ.iGfojLdouAjsovJuRxjYVA'
  const map = new mapboxgl.Map({
    style: 'mapbox://styles/waiting33118/ckdfkx3t10k9w1irkp8anuy39',
    center: { lon: 121.533907, lat: 25.043163 },
    zoom: 17,
    pitch: 60,
    bearing: 0,
    container: 'mapbox',
    antialias: true
  })
  // The 'building' layer in the mapbox-streets vector source contains building-height data from OpenStreetMap.
  map.on('load', () => {
    // Insert the layer beneath any symbol layer.
    const layers = map.getStyle().layers
    let labelLayerId
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
        labelLayerId = layers[i].id
        break
      }
    }
    map.addLayer(
      {
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 17,
        paint: {
          'fill-extrusion-color': '#aaa',
          // use an 'interpolate' expression to add a smooth transition effect to the buildings as the user zooms in
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'height']
          ],
          'fill-extrusion-base': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'min_height']
          ],
          'fill-extrusion-opacity': 0.6
        }
      },
      labelLayerId
    )
  })
  // 縮放
  const nav = new mapboxgl.NavigationControl({
    showCompass: true,
    showZoom: true,
    visualizePitch: true
  })
  map.addControl(nav, 'bottom-right')

  const mbControl = document.querySelector('.mapboxgl-ctrl-bottom-right')
  const btn = document.createElement('button')
  btn.className = 'locate'
  mbControl.prepend(btn)
  document.querySelector('.locate').addEventListener('click', (e) => {
    const getLocate = new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(position => resolve(position.coords))
    })
    getLocate
      .then(coords => {
        const bounds = { lng: Number(coords.longitude), lat: Number(coords.latitude) }
        map.flyTo({
          center: bounds,
          zoom: 17,
          essential: true
        })
      })
      .catch(err => console.log(err))
  })
})()

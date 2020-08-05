(function () {
  const token = 'pk.eyJ1Ijoid2FpdGluZzMzMTE4IiwiYSI6ImNrZDVlZWp6MjFxcXQyeHF2bW0xenU4YXoifQ.iGfojLdouAjsovJuRxjYVA'
  const dataURL = `https://api.mapbox.com/datasets/v1/waiting33118/ckdgqzwtr010x23miea77hh4h/features?access_token=${token}`
  mapboxgl.accessToken = token
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
  // 縮放控制
  const nav = new mapboxgl.NavigationControl({
    showCompass: true,
    showZoom: true,
    visualizePitch: true
  })
  map.addControl(nav, 'bottom-right')
  // 定位控制
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
      .catch(err => console.warn(err))
  })
  // 路徑demo
  const demo1 = document.querySelector('.demo1')

  demo1.addEventListener('click', () => {
    axios.get(dataURL)
      .then(api => {
        const coordinates = api.data.features[0].geometry.coordinates
        api.data.features[0].geometry.coordinates = [coordinates[0]]
        if (!map.getSource('trace')) {
          map.addSource('trace', { type: 'geojson', data: api.data })
          map.addLayer({
            id: 'trace',
            type: 'line',
            source: 'trace',
            paint: {
              'line-color': 'yellow',
              'line-opacity': 0.75,
              'line-width': 10
            }
          })
        }
        map.jumpTo({ center: coordinates[0], zoom: 17 })
        map.setPitch(50)
        let i = 0
        const timer = window.setInterval(() => {
          if (i < coordinates.length) {
            api.data.features[0].geometry.coordinates.push(
              coordinates[i]
            )
            map.getSource('trace').setData(api.data)
            map.panTo(coordinates[i])
            i++
          } else {
            window.clearInterval(timer)
          }
        }, 300)
      })
      .catch(err => console.warn(err))
  })
})()

(function () {
  const originConfig = {
    content: [
      {
        type: 'row',
        content: [
          {
            type: 'column',
            content: [
              {
                type: 'component',
                componentName: 'mapboxComponent',
                title: 'Mapbox'
              },
              {
                type: 'component',
                componentName: 'testComponent',
                title: 'Control panel'
              }
            ]
          }, {
            type: 'column',
            content: [
              {
                type: 'component',
                componentName: 'testComponent',
                title: 'Live Monitor'
              },
              {
                type: 'component',
                componentName: 'testComponent'
              }
            ]
          }
        ]
      }
    ]
  }
  const myLayout = new GoldenLayout(originConfig)
  class MapboxComponent {
    constructor(container, state) {
      this._container = container
      this._state = state
      this._container.getElement().append('<div id="map"></div>')
      this._container.on('resize', this._mapResize, this)
    }
  }
  MapboxComponent.prototype._mapResize = function () {
    // console.log(this._container.width, this._container.height, this._container.getElement()[0])
  }
  myLayout.registerComponent('mapboxComponent', MapboxComponent)
  myLayout.registerComponent('testComponent', function (container, state) { })
  myLayout.init()
}
)()

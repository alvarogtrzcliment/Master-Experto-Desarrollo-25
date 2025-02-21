require([
  'esri/Map',
  'esri/views/MapView',
  'esri/layers/GraphicsLayer',
  'esri/Graphic',
  'esri/geometry/Polyline'
], (Map, MapView, GraphicsLayer, Graphic, Polyline) => {
  const mapa = new Map({
    basemap: 'topo-vector'
  })

  const vistaMapa = new MapView({
    container: 'viewDiv',
    map: mapa,
    center: [-3.7, 40.4],
    zoom: 12
  })

  const puntoInicial = {
    type: 'point',
    latitude: 40.4,
    longitude: -3.7
  }

  const puntoFinal = {
    type: 'point',
    latitude: 40.41,
    longitude: -3.5
  }

  let pointSymbol = {
    type: 'simple-marker',
    color: [226, 119, 40],
    width: 4
  }

  const graficoPuntoInicial = new Graphic({
    geometry: puntoInicial,
    symbol: pointSymbol
  })

  const graficoPuntoFinal = new Graphic({
    geometry: puntoFinal,
    symbol: pointSymbol
  })

  const capaGraficaPuntos = new GraphicsLayer()

  capaGraficaPuntos.addMany([graficoPuntoInicial, graficoPuntoFinal])

  mapa.add(capaGraficaPuntos)

  const capaGraficaResultado = new GraphicsLayer()
  mapa.add(capaGraficaResultado)

  const token =
    'mzFcMRqhxzPAoRJavp2MJmJUcadbCVil_E77hNco2FGkYUWA9wkSe_yRelR23SoXrJUgTc8c00-OLTYj-jgq-mxq6cjCpJ4a6JTygwN-fUu5IzczvXsQckOALZALaqCUYrXrqsVysYKbe-V5FUuk1hXFnoJZgNfjPG-x6SdqTxZQqijHa7uAJDWwydBcgG7F'

  fetch(
    `https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve?token=${token}&f=pjson&stops=-3.7,40.40;-3.5,40.41&findBestSequence=true`
  ).then((resultadoFetch) => {
    resultadoFetch.json().then((resultadoJSON) => {
      const polilineaGeometriaResultado = new Polyline({
        paths: resultadoJSON.routes.features[0].geometry.paths
      })
      const resultadoGrafico = new Graphic({
        geometry: polilineaGeometriaResultado,
        symbol: {
          type: 'simple-line',
          color: [226, 119, 40],
          width: 1
        }
      })

      capaGraficaResultado.add(resultadoGrafico)
    })
  })
})

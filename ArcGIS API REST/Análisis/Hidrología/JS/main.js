require([
  'esri/Map',
  'esri/views/MapView',
  'esri/rest/support/FeatureSet',
  'esri/Graphic',
  'esri/layers/GraphicsLayer'
], (Map, MapView, FeatureSet, Graphic, GraphicsLayer) => {
  const mapa = new Map({
    basemap: 'topo-vector'
  })

  const vistaMapa = new MapView({
    container: 'viewDiv',
    map: mapa,
    center: [-3.7, 40.4],
    zoom: 6
  })

  const capaGraficaResutlados = new GraphicsLayer()
  mapa.add(capaGraficaResutlados)

  vistaMapa.on('click', (eventoPoint) => {
    const geometria = eventoPoint.mapPoint
    const punto = new Graphic({
      geometry: geometria
    })
    const coleccionPuntos = new FeatureSet({
      geometryType: 'point',
      features: [punto]
    })

    console.log(typeof coleccionPuntos)

    const coleccionPuntosString = encodeURIComponent(
      JSON.stringify(coleccionPuntos)
    )

    traceDownstream(coleccionPuntosString)
  })

  function traceDownstream(coleccion) {
    const token =
      'mzFcMRqhxzPAoRJavp2MJmJUcadbCVil_E77hNco2FGkYUWA9wkSe_yRelR23SoXrJUgTc8c00-OLTYj-jgq-nDzyiM5XlNTtHjylg_X1St_ABjHUtjRErzP1Bf5pEW3ORQULEA7GwGWjoV7PT_x7Wwowe0Jwj0Y0mQNM7ADTywI4IXyVios0jAhAZ-XbH2e'

    fetch(
      `https://hydro.arcgis.com/arcgis/rest/services/Tools/Hydrology/GPServer/TraceDownstream/submitJob?f=json&InputPoints=${coleccion}&SourceDatabase=FINEST&Generalize=True&token=${token}`
    ).then((respuestaServidor) => {
      respuestaServidor.text().then(async (resultadoFetch) => {
        const resultadoFetchJSON = await JSON.parse(resultadoFetch)
        checkJobStatus(resultadoFetchJSON.jobId, token)
      })
    })
  }

  function checkJobStatus(jobId, token) {
    fetch(
      `https://hydro.arcgis.com/arcgis/rest/services/Tools/Hydrology/GPServer/TraceDownstream/jobs/${jobId}?f=json&token=${token}`
    )
      .then((response) => response.text())
      .then(async (result) => {
        const resultJSON = JSON.parse(result)
        if (
          resultJSON.jobStatus === 'esriJobExecuting' ||
          resultJSON.jobStatus === 'esriJobSubmitted'
        ) {
          setTimeout(checkJobStatus(jobId, token), 2000)
        }

        if (resultJSON.jobStatus === 'esriJobSucceeded') {
          fetch(
            `https://hydro.arcgis.com/arcgis/rest/services/Tools/Hydrology/GPServer/TraceDownstream/jobs/${jobId}/results/?token=${token}&f=json&OutputTraceLine=%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22paramUrl%22%3A%20%22results%2FOutputTraceLine%22%0A%20%20%20%20%20%20%20%20%7D`
          )
            .then((response) => response.text())
            .then((result) => {
              const resultadoJSON = JSON.parse(result)
              const resultadoGrafico = new Graphic({
                geometry: {
                  type: 'polyline',
                  paths: resultadoJSON[0].value.features[0].geometry.paths
                }
              })

              capaGraficaResutlados.add(resultadoGrafico)
            })
        }
      })
      .catch((error) => console.error(error))
  }
})

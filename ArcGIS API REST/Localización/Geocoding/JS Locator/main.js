require([
  'esri/Map',
  'esri/views/MapView',
  'esri/rest/locator',
  'esri/config'
], (Map, MapView, locator, esriConfig) => {
  esriConfig.apiKey =
    'mzFcMRqhxzPAoRJavp2MJmJUcadbCVil_E77hNco2FGkYUWA9wkSe_yRelR23SoXrJUgTc8c00-OLTYj-jgq-rnZ-PsPMfF1ZW_Qda-axsY3Z9Gql6sJc54YyjDT4iOYJJ6ahOzyaRUv4Y6ENH-8TFRO1UbH1Lp2CfyyXKm1vrYxNadR6hTYxibA5kF4-wdY'

  const mapa = new Map({
    basemap: 'topo-vector'
  })

  const vistaMapa = new MapView({
    container: 'viewDiv',
    map: mapa
  })

  const button = document.getElementById('geocodificar')

  button.addEventListener('click', geocodificarDireccion)

  function geocodificarDireccion() {
    const geocodingServiceUrl =
      'https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer'

    const params = {
      address: {
        address: 'Paseo de la Castellana 91, Madrid'
      }
    }

    locator.addressToLocations(geocodingServiceUrl, params).then((results) => {
      console.log(results)
    })
  }
})

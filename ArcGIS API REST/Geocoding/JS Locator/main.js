require([
  'esri/Map',
  'esri/views/MapView',
  'esri/rest/locator',
  'esri/config'
], (Map, MapView, locator, esriConfig) => {
  esriConfig.apiKey =
    'mzFcMRqhxzPAoRJavp2MJmJUcadbCVil_E77hNco2FGkYUWA9wkSe_yRelR23SoXrJUgTc8c00-OLTYj-jgq-kN7Tt7OPIm2a3endtFJFFc3DHLVoii-0j_SpITuwR1tc_3PHZJRkk5jyVOjT9IG7J8XSirvasTAviIJ4Y5dpUpLWd54PVwM24lZ_T371GdP'

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

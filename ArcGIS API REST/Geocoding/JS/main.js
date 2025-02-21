
require(["esri/Map", "esri/views/MapView"],(Map, MapView)=>{

    const mapa = new Map({
        basemap:'topo-vector'
    })

    const vistaMapa = new MapView({
        container:'viewDiv',
        map:mapa
    })

    
    const button = document.getElementById('geocodificar')

    button.addEventListener('click',geocodificarDireccion)

    function geocodificarDireccion(){

        const token = 'mzFcMRqhxzPAoRJavp2MJmJUcadbCVil_E77hNco2FGkYUWA9wkSe_yRelR23SoXrJUgTc8c00-OLTYj-jgq-pDLm-BwU_ViPF2wgJuInfzO3kcKn66Rv0Wz8WcvBNKuZfuotbBPK0L7a7-PF_YWwRGjBuaZuLThyHM1oKCiOCIP8tk5RBerliLjmSjGbJRx'
        
        fetch(`https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?token=${token}&SingleLine=Calle Paseo de la Castellana 91 Madrid España&f=pjson`)
            .then((respuestaServidor)=>{
                respuestaServidor.json().then((resultadoJSON)=>{
                    console.log(resultadoJSON.candidates)
                })
            })
    }

})
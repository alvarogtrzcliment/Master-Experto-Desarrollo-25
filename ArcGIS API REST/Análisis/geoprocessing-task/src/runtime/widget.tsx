/** @jsx jsx */

import { type AllWidgetProps, css, jsx } from 'jimu-core'
import { JimuMapViewComponent, type JimuMapView } from 'jimu-arcgis'
import { useCallback, useEffect, useState } from 'react'
import { type IMConfig } from '../config'
import FeatureSet from '@arcgis/core/rest/support/FeatureSet'
import LinearUnit from '@arcgis/core/rest/support/LinearUnit'
import type Point from '@arcgis/core/geometry/Point'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import Graphic from '@arcgis/core/Graphic'
import geoprocessor from '@arcgis/core/rest/geoprocessor'

const widgetStyle = css`
  background-color: rgb(243, 243, 243);
  border-radius: 15px;
  padding: 20px;
  margin: 10px;
  box-shadow: 1px 1px 3px 0px rgba(0, 0, 0, 0.5);
  width: fit-content;
`

const markerSymbol = {
  type: 'simple-marker',
  color: [255, 0, 0],
  outline: {
    color: [255, 255, 255],
    width: 2
  }
}

const fillSymbol = {
  type: 'simple-fill',
  color: [226, 119, 40, 0.75],
  outline: {
    color: [255, 255, 255],
    width: 1
  }
}

const Widget = (props: AllWidgetProps<IMConfig>) => {
  const [activeView, setActiveView] = useState<JimuMapView>()

  const activeViewHandler = (JimuMapView: JimuMapView) => {
    setActiveView(() => JimuMapView)
  }

  const urlGeoprocess =
    'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Elevation/ESRI_Elevation_World/GPServer/Viewshed'

  const options = {
    outSpatialReference: {
      wkid: 102100
    }
  }

  const computeViewshedAnalysis = useCallback(
    (point: Graphic, layer: GraphicsLayer) => {
      const inputGraphicContainer = []
      inputGraphicContainer.push(point)
      const featureSet = new FeatureSet()
      featureSet.features = inputGraphicContainer

      const vsDistance = new LinearUnit()
      vsDistance.distance = 5
      vsDistance.units = 'miles'

      const params = {
        Input_Observation_Point: featureSet,
        Viewshed_Distance: vsDistance
      }

      geoprocessor.execute(urlGeoprocess, params, options).then((result) => {
        const resultFeatures = result.results[0].value.features

        const viewshedGraphics = resultFeatures.map((feature) => {
          feature.symbol = fillSymbol
          return feature
        })

        layer.addMany(viewshedGraphics)

        activeView.view.goTo({
          target: viewshedGraphics,
          tilt: 0
        })
      })
    },
    [activeView, options]
  )

  useEffect(() => {
    if (activeView) {
      const graphicsLayer = new GraphicsLayer()

      const pointerMoveEvent = activeView.view.on('click', (evento) => {
        graphicsLayer.removeAll()
        const point: Point = evento.mapPoint
        const pointGraphic = new Graphic({
          geometry: point,
          symbol: markerSymbol
        })
        graphicsLayer.add(pointGraphic)
        computeViewshedAnalysis(pointGraphic, graphicsLayer)
      })

      activeView.view.map.add(graphicsLayer)

      return () => {
        pointerMoveEvent.remove()
      }
    }
  }, [activeView, computeViewshedAnalysis])
  return (
    <div css={widgetStyle}>
      {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
        <JimuMapViewComponent
          useMapWidgetId={props.useMapWidgetIds[0]}
          onActiveViewChange={activeViewHandler}
        ></JimuMapViewComponent>
      )}
      Click on the map
    </div>
  )
}

export default Widget

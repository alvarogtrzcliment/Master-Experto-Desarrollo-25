const fs = require('fs').promises
const express = require('express')
const cors = require('cors')

const aplicacion = express()
aplicacion.use(cors())
aplicacion.use(express.json())

async function getDataBase() {
  const dataBase = await fs.readFile(
    './../DataBase/DataBase.json',
    'utf-8',
    (err, data) => {
      return data
    }
  )

  return JSON.parse(dataBase)
}

async function getArboles(req, res) {
  const dataBase = await getDataBase()

  res.status(200)
  res.json({
    status: 'success',
    results: dataBase.length,
    data: dataBase
  })
}

async function getArbol(req, res) {
  console.log(req.params)

  // LLamo a la DB

  const dataBase = await getDataBase()

  // Transformar un string a número

  const id = Number(req.params.id)

  // Filtrar los árboels en función de la ID

  const arbol = dataBase.find((arbol) => arbol.id === id)
  if (arbol) {
    res.status(200)
    res.json({
      status: 'success',
      data: {
        arbol: arbol
      }
    })
  } else {
    res.status(404)
    res.json({
      status: 'failed',
      message: 'Invalid ID'
    })
  }
}

async function newArbol(req, res) {
  const dataBase = await getDataBase()

  const idNueva = dataBase[dataBase.length - 1].id + 1

  const nuevoArbol = {
    id: idNueva,
    especie: req.body.especie,
    altura: Number(req.body.altura),
    diametro: Number(req.body.diametro),
    longitud: Number(req.body.longitud),
    latitud: Number(req.body.latitud)
  }

  dataBase.push(nuevoArbol)

  await fs.writeFile(
    './../DataBase/DataBase.json',
    JSON.stringify(dataBase),
    (err) => {
      console.log(err)
    }
  )

  res.status(201)
  res.json({
    status: 'success',
    data: {
      arbol: nuevoArbol
    }
  })
}

aplicacion.get('/api/arboles', getArboles)

aplicacion.get('/api/arboles/:id', getArbol)

aplicacion.post('/api/arboles', newArbol)

const port = 8000
aplicacion.listen(port, () => {
  console.log('Aplicación ejecutándose en el puerto: ' + port)
})

const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
app.use(cors())
app.use(express.json())

//banco de dados em memória
var clientes = []

app.get('/listar', (request, response) => {
  response.json(clientes)
})

app.post("/cadastrar", (request, response) => {
    let cliente = request.body
    console.log(cliente)
    clientes.push(cliente) //adiciona o cliente no BD
    response.json({ success: true  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
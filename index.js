const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
app.use(cors())
app.use(express.json())

const redis = require('redis')
const redisClient = redis.createClient({
  url: 'redis://default:FKlJHdPumpEa858L0ACF8GBL41dmAQMv@redis-10302.c308.sa-east-1-1.ec2.redns.redis-cloud.com:10302'
});

redisClient.on("error", () => {
  console.log("Erro ao conectar ao BD")
})
redisClient.connect()

//banco de dados em memória
var clientes = []

app.get('/listar', (request, response) => {
  let lista = redisClient.get("clientes-leandro")
  .then((clientes) => {
    response.json(JSON.parse(clientes))
  }).catch(() => {
    response.json([])
  })  
})

app.post("/cadastrar", (request, response) => {
    let cliente = request.body
    console.log(cliente)
    clientes.push(cliente) //adiciona o cliente no BD
    redisClient.set("clientes-leandro",JSON.stringify(clientes))
    response.json({ success: true  })
})

app.delete("/excluir/:cpf", (request, response) => {
  let cpf = request.params.cpf
  for(let i=0; i < clientes.length; i++){
    let cliente = clientes[i]
    if (cliente.cpf == cpf){
        //remove o elemento encontrado na posição "i"
        clientes.splice(i, 1) 
    }
  }
  response.json({ success: true })
})

app.put("/alterar", (request, response) => {
  let cliente = request.body
  //procura o cliente que tem o CPF enviado
  for(let i=0; i < clientes.length; i++){
    if (clientes[i].cpf == cliente.cpf){
      //substitui os dados do cliente pelos dados enviados pelo front
      clientes[i] = cliente 
    }
  }
  response.json({ success: true })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
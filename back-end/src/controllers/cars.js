import prisma from '../database/client.js'
import Car from '../models/Car.js' // Importamos o model Car (adaptado de Customer)
import { ZodError } from 'zod'     // Importamos o objeto de erro do Zod

const controller = {}   // Objeto vazio

// Todas as funções de controller têm, pelo menos,
// dois parâmetros:
// req ~> representa a requisição (request)
// res ~> representa a resposta (response)
controller.create = async function(req, res) {
  try {
    // ADAPTAÇÃO: Convertemos a string da data de venda para objeto Date (se existir)
    if(req.body.selling_date) req.body.selling_date = new Date(req.body.selling_date)

    // ADAPTAÇÃO: Chamamos a validação do modelo Car
    Car.parse(req.body)

    // Para a inserção no BD, os dados são enviados
    // dentro de um objeto chamado "body" que vem
    // dentro da requisição ("req")
    await prisma.car.create({ data: req.body })

    // Se tudo der certo, enviamos o código HTTP
    // apropriado, no caso
    // HTTP 201: created
    res.status(201).end()
  }
  catch(error) {
    // Se algo de errado ocorrer, cairemos aqui
    console.error(error)  // Exibe o erro no terminal

    // Tratamento de erro do Zod (igual ao da imagem)
    if(error instanceof ZodError) res.status(422).send(error.issues)

    // Enviamos como resposta o código HTTP relativo
    // a erro interno do servidor
    // HTTP 500: Internal Server Error
    res.status(500).end()
  }
}

controller.retrieveAll = async function(req, res) {
  try {
    // Recupera todos os registros de veículos, ordenados
    // pelo campo "brand"
    const result = await prisma.car.findMany({
      orderBy: [ { brand: 'asc' } ]
    })

    // HTTP 200: OK (implícito)
    res.send(result)
  }
  catch(error) {
    // Se algo de errado ocorrer, cairemos aqui
    console.error(error)  // Exibe o erro no terminal

    // Enviamos como resposta o código HTTP relativo
    // a erro interno do servidor
    // HTTP 500: Internal Server Error
    res.status(500).end()
  }
}

controller.retrieveOne = async function (req, res) {
  try {
    // Busca no banco de dados apenas o veículo indicado
    // pelo parâmetro "id"
    const result = await prisma.car.findUnique({
      where: { id: Number(req.params.id) }
    })

    // Encontrou ~> HTTP 200: OK (implícito)
    if(result) res.send(result)
    // Não encontrou ~> HTTP 404: Not Found
    else res.status(404).end()
  }
  catch(error) {
    // Se algo de errado ocorrer, cairemos aqui
    console.error(error)  // Exibe o erro no terminal

    // Enviamos como resposta o código HTTP relativo
    // a erro interno do servidor
    // HTTP 500: Internal Server Error
    res.status(500).end()
  }
}

controller.update = async function(req, res) {
  try {
    // ADAPTAÇÃO: Verifica se há data de venda para converter
    if(req.body.selling_date) req.body.selling_date = new Date(req.body.selling_date)

    // ADAPTAÇÃO: Valida os dados usando o model Car
    Car.parse(req.body)

    // Busca o registro no banco de dados por seu id
    // e o atualiza com as informações que vieram em req.body
    await prisma.car.update({
      where: { id: Number(req.params.id) },
      data: req.body
    })

    // Encontrou e atualizou ~> HTTP 204: No Content
    res.status(204).end()
  }
  catch(error) {
    // Se algo de errado ocorrer, cairemos aqui
    console.error(error)  // Exibe o erro no terminal

    // Não encontrou e não atualizou ~> HTTP 404: Not Found
    if(error?.code === 'P2025') res.status(404).end()

    // Tratamento de erro: Validação do Zod (422)
    else if(error instanceof ZodError) res.status(422).send(error.issues)

    // Se não for erro de não encontrado, retorna o habitual
    // HTTP 500: Internal Server Error
    else res.status(500).end()
  }
}

controller.delete = async function (req, res) {
  try {
    await prisma.car.delete({
      where: { id:  Number(req.params.id) }
    })

    // Encontrou e excluiu ~> HTTP 204: No Content
    res.status(204).end()
  }
  catch(error) {
    // Se algo de errado ocorrer, cairemos aqui
    console.error(error)  // Exibe o erro no terminal

    // Não encontrou e não excluiu ~> HTTP 404: Not Found
    if(error?.code === 'P2025') res.status(404).end()

    // Se não for erro de não encontrado, retorna o habitual
    // HTTP 500: Internal Server Error
    else res.status(500).end()
  }
}

export default controller
import { z } from 'zod'

// Regra: O ano de fabricação não pode ser maior que o ano atual
const maxManufactureYear = new Date().getFullYear()

// Regra: Cores permitidas (Enum)
const colors = [
  'AMARELO', 'AZUL', 'BRANCO', 'CINZA', 'DOURADO', 'LARANJA',
  'MARROM', 'PRATA', 'PRETO', 'ROSA', 'ROXO', 'VERDE', 'VERMELHO'
]

// Regra: Data de abertura da loja para validação da data de venda
const minSellingDate = new Date('2020-03-20T00:00:00')
const maxSellingDate = new Date() // Data de hoje

const Car = z.object({
  brand: z.string()
    .trim()
    .min(1, { message: 'A marca deve ter no mínimo 1 caractere.' })
    .max(25, { message: 'A marca deve ter no máximo 25 caracteres.' }),

  model: z.string()
    .trim()
    .min(1, { message: 'O modelo deve ter no mínimo 1 caractere.' })
    .max(25, { message: 'O modelo deve ter no máximo 25 caracteres.' }),

  color: z.enum(colors, {
    errorMap: () => ({ message: 'A cor deve ser uma das seguintes: ' + colors.join(', ') })
  }),

  year_manufacture: z.number()
    .int({ message: 'O ano de fabricação deve ser um número inteiro.' })
    .min(1960, { message: 'O ano de fabricação deve ser no mínimo 1960.' })
    .max(maxManufactureYear, { message: `O ano de fabricação não pode ser superior a ${maxManufactureYear}.` }),

  imported: z.boolean({
    required_error: 'O campo "importado" é obrigatório.',
    invalid_type_error: 'O campo "importado" deve ser verdadeiro ou falso.'
  }),

  plates: z.string()
    .trim()
    // Transformação opcional: remove sublinhados caso venha de uma máscara do front-end
    .transform(val => val.replace('_', '')) 
    .refine(val => val.length === 8, { 
      message: 'A placa deve ter exatamente 8 caracteres.' 
    }),
  selling_date: z.coerce.date()
    .min(minSellingDate, { message: 'A data da venda não pode ser anterior a 20/03/2020.' })
    .max(maxSellingDate, { message: 'A data da venda não pode ser posterior à data de hoje.' })
    .nullish(), // O campo é opcional (aceita null ou undefined)

  selling_price: z.number()
    .min(5000, { message: 'O preço de venda deve ser no mínimo R$ 5.000,00.' })
    .max(5000000, { message: 'O preço de venda deve ser no máximo R$ 5.000.000,00.' })
    .nullish() // O campo é opcional (aceita null ou undefined)
})

export default Car
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Router} from 'express'


const route = Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const productsFilePath = path.join(__dirname, '../data/products.json')

const getProducts = () => {
    const data = fs.readFileSync(productsFilePath, 'utf8')
    return JSON.parse(data)
}


const saveProducts = (products) => {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf8')
}

const generarId = () => {
    return Math.floor(Math.random() * 10000)
}


route.get('/', (req, res) => {
    const products = getProducts()
    const limit = req.query.limit ? parseInt(req.query.limit) : products.length
    res.json(products.slice(0, limit))
})


route.get('/:pid', (req, res) => {
    const products = getProducts()
    const product = products.find(p => p.id === req.params.pid)
    if (product) {
        res.json(product)
    } else {
        res.status(404).json({ message: 'Product not found' })
    }
})


route.post('/', (req, res) => {
    const products = getProducts()
    const newProduct = {
        id: generarId(),
        ...req.body,
        status: req.body.status !== undefined ? req.body.status : true
    }
    products.push(newProduct)
    saveProducts(products)
    res.status(201).json(newProduct)
});


route.put('/:pid', (req, res) => {
    const products = getProducts()
    const index = products.findIndex(p => p.id === req.params.pid)
    if (index !== -1) {
        const updatedProduct = { ...products[index], ...req.body }
        products[index] = updatedProduct
        saveProducts(products)
        res.json(updatedProduct)
    } else {
        res.status(404).json({ message: 'Product not found' })
    }
})


route.delete('/:pid', (req, res) => {
    const products = getProducts()
    const index = products.findIndex(p => p.id === req.params.pid)
    if (index !== -1) {
        const deletedProduct = products.splice(index, 1)
        saveProducts(products)
        res.json(deletedProduct)
    } else {
        res.status(404).json({ message: 'Product not found' })
    }
})

export default route

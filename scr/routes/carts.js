import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Router } from 'express'


const route = Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const cartsFilePath = path.join(__dirname, '../data/carts.json')


const getCarts = () => {
    const data = fs.readFileSync(cartsFilePath, 'utf8')
    return JSON.parse(data)
}


const saveCarts = (carts) => {
    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2), 'utf8')
}


const generarId = () => {
    return Math.floor(Math.random() * 10000)
};


route.post('/', (req, res) => {
    const carts = getCarts()
    const nuevoCarrito = {
        id: generarId(),
        products: []
    }
    carts.push(nuevoCarrito)
    saveCarts(carts)
    res.status(201).json(nuevoCarrito)
})


route.get('/:cid', (req, res) => {
    const carts = getCarts()
    const cart = carts.find(c => c.id === req.params.cid)
    if (cart) {
        res.json(cart.products)
    } else {
        res.status(404).json({ message: 'Carrito no encontrado' })
    }
})


route.post('/:cid/product/:pid', (req, res) => {
    const carts = getCarts()
    const cart = carts.find(c => c.id === req.params.cid)
    if (cart) {
        const productIndex = cart.products.findIndex(p => p.product === req.params.pid)
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1
        } else {
            cart.products.push({ product: req.params.pid, quantity: 1 })
        }
        saveCarts(carts)
        res.json(cart)
    } else {
        res.status(404).json({ message: 'Carrito no encontrado' })
    }
})

export default route


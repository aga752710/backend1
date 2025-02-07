import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Router } from 'express'

const route = Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const cartsFilePath = path.join(__dirname, '../data/carts.json')

const getCarts = () => {
    try {
        const data = fs.readFileSync(cartsFilePath, 'utf8')
        return JSON.parse(data)
    } catch (error) {
        console.error('Error al leer el archivo de carritos:', error)
        return []
    }
}

const saveCarts = (carts) => {
    try {
        fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2), 'utf8')
    } catch (error) {
        console.error('Error al guardar el archivo de carritos:', error)
    }
}

const generarId = () => {
    return Math.floor(Math.random() * 10000)
};

route.post('/', (req, res) => {
    const carts = getCarts()
    const nuevoCarrito = {
        id: generarId(),
        products: req.body.products || []
    }
    carts.push(nuevoCarrito)
    saveCarts(carts)
    res.status(201).json(nuevoCarrito)
});

route.get('/', (req, res) => {
    const carts = getCarts()
    if (carts.length > 0) {
        res.json(carts)
    } else {
        res.status(404).json({ message: 'No se encontraron carritos' })
    }
})

route.get('/:cid', (req, res) => {
    const carts = getCarts()
    const cart = carts.find(c => c.id == req.params.cid)
    if (cart) {
        res.json(cart)
    } else {
        res.status(404).json({ message: 'Carrito no encontrado' })
    }
})

route.post('/:cid/product/:pid', (req, res) => {
    const carts = getCarts()
    const cart = carts.find(c => c.id == req.params.cid)
    if (cart) {
        const productIndex = cart.products.findIndex(p => p.product == req.params.pid)
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
});

export default route


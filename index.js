import express from 'express'
import productsRouter from './src/routes/products.js'
import cartsRouter from './src/routes/carts.js'

const app = express()

app.use(express.json())
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

app.listen(8080, () => {
    console.log('Server listo en puerto 8080')
})
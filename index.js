import express from 'express'
import productsRouter from './scr/routes/products.js'
import cartsRouter from './scr/routes/carts.js'

const app = express()

app.use(express.json())
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

app.listen(8080, () => {
    console.log('Server is listening on port 8080')
})

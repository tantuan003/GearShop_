import express from 'express'

const Routes = express.Router()
Routes.route('/')
.get((req,res)=>{
    res.status(200).json({message : 'API get list products'})

})
.post((req,res)=>{
    res.status(200).json({message : 'API get create Products'})

})
export const ProductRoutes = Routes

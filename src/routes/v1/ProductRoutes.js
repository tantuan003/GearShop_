import express from 'express'
import { StatusCodes } from 'http-status-codes';
const Routes = express.Router()
Routes.route('/')
.get((req,res)=>{
    res.status(200).json({message : 'API get list products'})

})
.post((req,res)=>{
    res.status(200).json({message : 'API get create Products'})

})

export const ProductRoutes = Routes

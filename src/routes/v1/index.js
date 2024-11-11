import express from 'express'
import { ProductRoutes } from '~/routes/v1/ProductRoutes'
import { UserRoutes } from '~/routes/v1/UserRoutes'
import { StatusCodes } from 'http-status-codes';
const Router = express.Router()

Router.get('/status',(req,res) =>{
    res.status(200).json({message : 'ready'})
} )
Router.use('/Products',ProductRoutes)
Router.use('/User',UserRoutes)
export const APIs_V1 = Router


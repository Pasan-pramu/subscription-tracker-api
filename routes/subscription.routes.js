import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import {createSubscription} from "../controllers/subscription.controller.js";


const subscriptionRouter = Router();


subscriptionRouter.get('/', (req,res)=>res.send({title:"get all subscription"}));

subscriptionRouter.get('/:id', (req,res)=>res.send({title:"get subscription details by ID"}));

subscriptionRouter.post('/', authorize,createSubscription);

subscriptionRouter.put('/:id', (req,res)=>res.send({title:"update subscription"}));

subscriptionRouter.delete('/:id', (req,res)=>res.send({title:"delete subscription"}));

subscriptionRouter.get('/user/:id', (req,res)=>res.send({title:"get all user subscription"}));

subscriptionRouter.get('/:id/cancel', (req,res)=>res.send({title:"cancel subscription"}));

subscriptionRouter.get('/upcoming-renewals', (req,res)=>res.send({title:"cancel subscription"}));

export default subscriptionRouter ;

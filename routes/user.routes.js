import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import {getUser, getUsers} from "../controllers/user.controller.js";


const userRouter = Router();



userRouter.get('/',getUsers);

userRouter.get('/:id',authorize,getUser);

userRouter.post('/',(req,res)=>res.send({title:"create new users"}));

userRouter.put('/:id',(req,res)=>res.send({title:"Update all users"}));

userRouter.delete('/:id',(req,res)=>res.send({title:"delete all users"}));


export default userRouter;

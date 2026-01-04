import { Router } from "express";


const userRouter = Router();



userRouter.get('/',(req,res)=>res.send({title:"get all users"}));

userRouter.get('/:id',(req,res)=>res.send({title:"Get  user details"}));

userRouter.post('/',(req,res)=>res.send({title:"create new users"}));

userRouter.put('/:id',(req,res)=>res.send({title:"Update all users"}));

userRouter.delete('/:id',(req,res)=>res.send({title:"delete all users"}));


export default userRouter;

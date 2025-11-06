import express from 'express'

const router = express.Router();

router.get('/', (req,res)=>{


    res.send({
        message:"User is working",
    })
})

export const UserRoutes = router;


import express from 'express'
import { UserRoutes } from '../User/user.routes';
import { AdminRoutes } from '../Admin/admin.routes';
const router = express.Router();

const moduleRoutes = [
    {
        path:'/user',
        route:UserRoutes
    },
    {
        path:'/admin',
        route:AdminRoutes
    }
]

moduleRoutes.forEach(route=> router.use(route.path,router.route))



export default router

import { Request, Response } from "express";
import { AdminService } from "./admin.service";


const pick = (obj,keys)=>{

    const finalObj = {}
    for(const key of keys){
        if(obj && Object
        .hasOwnProperty.call(obj,key)){
            finalObj[key]=obj[key]
        }
    }
        
    return finalObj;
}

const getAllDB = async (req: Request, res: Response) => {
  try {

    const filters = pick(req.query, ['searchTerm','name','email'])
const options = pick(req.query,['page','limit','sortBy','sortOrder'])

    const result = await AdminService.getAllFromDb(filters,options);
    res.status(200).json({
      data: result,
      success: true,
      message: "Admins fetched successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch admins" });
  }
};

export const AdminController = {
  getAllDB
};

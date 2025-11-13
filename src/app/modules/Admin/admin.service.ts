import { Admin, Prisma, UserStatus } from "@prisma/client";
import { adminSearchAbleFields } from "./admin.constant";
import { pagination } from "../../../helpars/paginationHelpers";
import prisma from "../../../shared/prisma";
import { IAdminFilterRequest } from "./admin.interface";
import { IPagination } from "../../interface/pagination";
import bcrypt from "bcryptjs";

const getAllFromDb = async (params:IAdminFilterRequest, options:IPagination) => {
const {searchTerm, ...filerData}= params;
const {limit,page,skip}=pagination.calculatePagination(options)

const andContidions= [];

if(params.searchTerm){

andContidions.push({
    OR:adminSearchAbleFields.map(field=>({
        [field]:{
            contains:params.searchTerm,
            mode:'insensitive'
        }
    }))

})
}

if(Object.keys(filerData).length>0){
andContidions.push({
    AND:Object.keys(filerData).map(field=>({
        [field]:{
           equals:filerData[field]
        }
    }))

})
}
const whereConditions:Prisma.AdminWhereInput={AND:andContidions}

  const result = await prisma.admin.findMany({
    where:whereConditions,
    skip,
    take:limit,
    orderBy:options.sortBy && options.sortOrder ?{

        [options.sortBy]:options.sortOrder
    }:{
        createdAt:'desc'
    }
  });

const total =await prisma.admin.count({
    where: whereConditions
})
  return {
    meta:{
        page,
        limit,
        total
    },
    data:result
  }
};




const getByIdFromDB = async(id:string)=>{


    const result = await  prisma.admin.findUnique({
        where:{
            id,
            isDeleted:false
        }
    })

    return result
}


const updateByIdDB = async(id:string,data: Partial<Admin>)=>{


   if(!id){
    throw new Error("Cannot given any id !")
   }
    const result = await prisma.admin.update({
        where:{
            id,
            isDeleted:false
        },
        data:data
    })

}
const deleteByIdFromDB = async(id:string)=>{


   if(!id){
    throw new Error("Cannot given any id !")
   }


   
    const result = await prisma.$transaction(async(transactionClient)=>{

        const adminDeletedData = await transactionClient.admin.delete({
            where:{
                id
            }
        })

      await transactionClient.user.delete({
            where:{
                email:adminDeletedData.email
            }
        })
        return adminDeletedData

    })


}
const softDeleteByIdFromDB = async(id:string)=>{


   if(!id){
    throw new Error("Cannot given any id !")
   }


   
    const result = await prisma.$transaction(async(transactionClient)=>{

        const adminDeletedData = await transactionClient.admin.update({
            where:{
                id
            },
            data:{
                isDeleted:true
            }
        })

        await transactionClient.user.update({
            where:{
                email:adminDeletedData.email
            },
            data:{
                status:UserStatus.DELETED
            }
        })
        return adminDeletedData

    })


}


export const AdminService = {
  getAllFromDb,
  getByIdFromDB,
  updateByIdDB,
  deleteByIdFromDB,
  softDeleteByIdFromDB,

};

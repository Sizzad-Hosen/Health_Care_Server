import { Prisma } from "@prisma/client";
import { adminSearchAbleFields } from "./admin.constant";
import { pagination } from "../../../helpars/paginationHelpers";
import prisma from "../../../shared/prisma";


const getAllFromDb = async (params:any, options:any) => {
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

  return result;
};

export const AdminService = {
  getAllFromDb
};

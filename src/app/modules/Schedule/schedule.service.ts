import { addMinutes, format } from 'date-fns';
import { Prisma, Schedule } from '@prisma/client';
import { IFilterRequest, ISchedule } from './schedule.interface';
import { IPaginationOptions } from '../../interface/pagination';
import { IAuthUser } from '../../interface/common';
import { paginationHelper } from '../../../helpars/paginationHelpers';
import { ScheduleRepository as defaultRepository } from './schedule.repository';
import { ScheduleRepository } from './schedule.types';

export const createScheduleService = (repository: ScheduleRepository = defaultRepository) => {
const inserIntoDB = async (payload: ISchedule): Promise<Schedule[]> => {
  const { startDate, endDate, startTime, endTime } = payload;

  const intervalTime = 30; // 30 minutes
  const schedules: Schedule[] = [];

  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    const day = format(currentDate, 'yyyy-MM-dd');

    let startDateTime = new Date(`${day}T${startTime}:00`);
    const endDateTime = new Date(`${day}T${endTime}:00`);

    while (startDateTime < endDateTime) {
      const slotStart = new Date(startDateTime);
      const slotEnd = addMinutes(slotStart, intervalTime);

      // check existing schedule
      const existingSchedule = await repository.findExistingSlot(slotStart, slotEnd);

      if (!existingSchedule) {
        const result = await repository.createSlot(slotStart, slotEnd);

        schedules.push(result);
      }

      // go to next 30-minute slot
      startDateTime = slotEnd;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return schedules;
};

const getAllFromDB = async (
    filters: IFilterRequest,
    options: IPaginationOptions,
    user: IAuthUser
) => {
    const { limit, page, skip } = paginationHelper.calculatePagination(options);
    const { startDate, endDate, ...filterData } = filters;

    const andConditions = [];

    if (startDate && endDate) {
        andConditions.push({
            AND: [
                {
                    startDateTime: {
                        gte: startDate
                    }
                },
                {
                    endDateTime: {
                        lte: endDate
                    }
                }
            ]
        })
    };


    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => {
                return {
                    [key]: {
                        equals: (filterData as any)[key],
                    },
                };
            }),
        });
    }

    const whereConditions: Prisma.ScheduleWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const doctorScheduleIds = await repository.findDoctorScheduleIdsByDoctorEmail(user?.email);
    console.log(doctorScheduleIds)

    const queryWhere = {
        ...whereConditions,
        id: {
            notIn: doctorScheduleIds
        },
    };
    const orderBy: Prisma.ScheduleOrderByWithRelationInput = options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder as Prisma.SortOrder }
        : {
            createdAt: 'desc' as Prisma.SortOrder,
        };

    const result = await repository.findMany(queryWhere, skip, limit, orderBy);
    const total = await repository.count(queryWhere);

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
};

const getByIdFromDB = async (id: string): Promise<Schedule | null> => {
    const result = await repository.findById(id);
    //console.log(result?.startDateTime.getHours() + ":" + result?.startDateTime.getMinutes())
    return result;
};

const deleteFromDB = async (id: string): Promise<Schedule> => {
    const result = await repository.deleteById(id);
    return result;
};


return {
    inserIntoDB,
    getAllFromDB,
    getByIdFromDB,
    deleteFromDB
};
};

export const ScheduleService = createScheduleService();

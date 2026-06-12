import assert from "node:assert/strict";
import test from "node:test";
import { Prisma, Schedule, UserRole } from "@prisma/client";
import { createScheduleService } from "./schedule.service";
import { ScheduleRepository } from "./schedule.types";

const schedule = (overrides: Partial<Schedule> = {}): Schedule => ({
    id: "schedule-1",
    startDate: new Date("2026-01-01T09:00:00"),
    endDate: new Date("2026-01-01T09:30:00"),
    createdAt: new Date("2026-01-01T00:00:00"),
    updatedAt: new Date("2026-01-01T00:00:00"),
    ...overrides,
});

const slotKey = (startDate: Date, endDate: Date): string => {
    return `${startDate.toISOString()}-${endDate.toISOString()}`;
};

const createRepository = (existingSlots = new Set<string>()) => {
    const calls: {
        createSlot: Array<{ startDate: Date; endDate: Date }>;
        findDoctorScheduleIdsByDoctorEmail: Array<string | undefined>;
        findMany: Array<{
            where: Prisma.ScheduleWhereInput;
            skip: number;
            take: number;
            orderBy: Prisma.ScheduleOrderByWithRelationInput;
        }>;
        count: Prisma.ScheduleWhereInput[];
        findById: string[];
        updateById: Array<{ id: string; data: Prisma.ScheduleUpdateInput }>;
        deleteById: string[];
    } = {
        createSlot: [],
        findDoctorScheduleIdsByDoctorEmail: [],
        findMany: [],
        count: [],
        findById: [],
        updateById: [],
        deleteById: [],
    };

    const rows = [schedule()];

    const repository: ScheduleRepository = {
        async findExistingSlot(startDate, endDate) {
            const key = slotKey(startDate, endDate);
            return existingSlots.has(key) ? schedule({ startDate, endDate }) : null;
        },
        async createSlot(startDate, endDate) {
            calls.createSlot.push({ startDate, endDate });
            return schedule({
                id: `schedule-${calls.createSlot.length}`,
                startDate,
                endDate,
            });
        },
        async findDoctorScheduleIdsByDoctorEmail(email) {
            calls.findDoctorScheduleIdsByDoctorEmail.push(email);
            return ["booked-schedule"];
        },
        async findMany(where, skip, take, orderBy) {
            calls.findMany.push({ where, skip, take, orderBy });
            return rows;
        },
        async count(where) {
            calls.count.push(where);
            return rows.length;
        },
        async findById(id) {
            calls.findById.push(id);
            return schedule({ id });
        },
        async updateById(id, data) {
            calls.updateById.push({ id, data });
            return schedule({
                id,
                startDate: data.startDate as Date,
                endDate: data.endDate as Date,
            });
        },
        async deleteById(id) {
            calls.deleteById.push(id);
            return schedule({ id });
        },
    };

    return { calls, repository, rows };
};

test("ScheduleService creates 30-minute slots for the requested time range", async () => {
    const { calls, repository } = createRepository();
    const service = createScheduleService(repository);

    const result = await service.inserIntoDB({
        startDate: "2026-01-01",
        endDate: "2026-01-01",
        startTime: "09:00",
        endTime: "10:00",
    });

    assert.equal(result.length, 2);
    assert.deepEqual(
        calls.createSlot.map((call) => [
            call.startDate.getHours(),
            call.startDate.getMinutes(),
            call.endDate.getHours(),
            call.endDate.getMinutes(),
        ]),
        [
            [9, 0, 9, 30],
            [9, 30, 10, 0],
        ]
    );
});

test("ScheduleService skips slots that already exist", async () => {
    const existingStart = new Date("2026-01-01T09:00:00");
    const existingEnd = new Date("2026-01-01T09:30:00");
    const existingSlots = new Set([
        slotKey(existingStart, existingEnd),
    ]);
    const { calls, repository } = createRepository(existingSlots);
    const service = createScheduleService(repository);

    const result = await service.inserIntoDB({
        startDate: "2026-01-01",
        endDate: "2026-01-01",
        startTime: "09:00",
        endTime: "10:00",
    });

    assert.equal(result.length, 1);
    assert.equal(calls.createSlot.length, 1);
    assert.equal(calls.createSlot[0].startDate.getHours(), 9);
    assert.equal(calls.createSlot[0].startDate.getMinutes(), 30);
});

test("ScheduleService fetches unassigned schedules with pagination metadata", async () => {
    const { calls, repository, rows } = createRepository();
    const service = createScheduleService(repository);

    const result = await service.getAllFromDB(
        {},
        { page: 2, limit: 5 },
        { email: "doctor@example.com", role: UserRole.DOCTOR }
    );

    assert.equal(result.data, rows);
    assert.deepEqual(result.meta, { total: 1, page: 2, limit: 5 });
    assert.deepEqual(calls.findDoctorScheduleIdsByDoctorEmail, ["doctor@example.com"]);
    assert.equal(calls.findMany[0].skip, 5);
    assert.equal(calls.findMany[0].take, 5);
    assert.deepEqual(calls.findMany[0].where.id, { notIn: ["booked-schedule"] });
});

test("ScheduleService fetches all schedules for admin users", async () => {
    const { calls, repository, rows } = createRepository();
    const service = createScheduleService(repository);

    const result = await service.getAllFromDB(
        {},
        { page: 1, limit: 10 },
        { email: "admin@example.com", role: UserRole.ADMIN }
    );

    assert.equal(result.data, rows);
    assert.deepEqual(calls.findDoctorScheduleIdsByDoctorEmail, []);
    assert.equal(calls.findMany[0].where.id, undefined);
});

test("ScheduleService delegates get and delete by id to the repository", async () => {
    const { calls, repository } = createRepository();
    const service = createScheduleService(repository);

    const found = await service.getByIdFromDB("schedule-1");
    const deleted = await service.deleteFromDB("schedule-1");

    assert.equal(found?.id, "schedule-1");
    assert.equal(deleted.id, "schedule-1");
    assert.deepEqual(calls.findById, ["schedule-1"]);
    assert.deepEqual(calls.deleteById, ["schedule-1"]);
});

test("ScheduleService updates a schedule slot", async () => {
    const { calls, repository } = createRepository();
    const service = createScheduleService(repository);

    const result = await service.updateIntoDB("schedule-1", {
        startDate: "2026-01-02",
        endDate: "2026-01-02",
        startTime: "10:00",
        endTime: "10:30",
    });

    assert.equal(result.id, "schedule-1");
    assert.equal(calls.updateById.length, 1);
    assert.equal(calls.updateById[0].id, "schedule-1");
    assert.equal((calls.updateById[0].data.startDate as Date).getHours(), 10);
    assert.equal((calls.updateById[0].data.endDate as Date).getHours(), 10);
    assert.equal((calls.updateById[0].data.endDate as Date).getMinutes(), 30);
});

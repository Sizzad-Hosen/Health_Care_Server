import assert from "node:assert/strict";
import test from "node:test";
import { Specialties } from "@prisma/client";
import { createSpecialtiesService } from "./specalties.service";
import { CreateSpecialtyPayload, SpecialtiesRepository } from "./specalties.types";
import { IFile } from "../../interface/file";

const specialty = (overrides: Partial<Specialties> = {}): Specialties => ({
    id: "specialty-1",
    title: "Cardiology",
    icon: "https://example.com/icon.png",
    ...overrides,
});

const createRepository = () => {
    const calls: {
        create: CreateSpecialtyPayload[];
        deleteById: string[];
    } = {
        create: [],
        deleteById: [],
    };

    const rows = [specialty()];

    const repository: SpecialtiesRepository = {
        async create(data) {
            calls.create.push(data);
            return specialty(data);
        },
        async findAll() {
            return rows;
        },
        async deleteById(id) {
            calls.deleteById.push(id);
            return specialty({ id });
        },
    };

    return { calls, repository, rows };
};

test("SpecialtiesService creates a specialty without uploading when no file is provided", async () => {
    const { calls, repository } = createRepository();
    const service = createSpecialtiesService(repository, async () => {
        throw new Error("upload should not be called");
    });

    const result = await service.inserIntoDB({ title: "Cardiology" });

    assert.deepEqual(calls.create, [{ title: "Cardiology" }]);
    assert.equal(result.title, "Cardiology");
});

test("SpecialtiesService uploads a file and stores the icon URL", async () => {
    const { calls, repository } = createRepository();
    const file = { path: "uploads/icon.png" } as IFile;
    const service = createSpecialtiesService(repository, async (uploadedFile) => {
        assert.equal(uploadedFile, file);
        return { secure_url: "https://cdn.example.com/icon.png" };
    });

    const result = await service.inserIntoDB({ title: "Neurology" }, file);

    assert.deepEqual(calls.create, [
        { title: "Neurology", icon: "https://cdn.example.com/icon.png" },
    ]);
    assert.equal(result.icon, "https://cdn.example.com/icon.png");
});

test("SpecialtiesService reads all specialties through the repository", async () => {
    const { repository, rows } = createRepository();
    const service = createSpecialtiesService(repository);

    const result = await service.getAllFromDB();

    assert.equal(result, rows);
});

test("SpecialtiesService deletes a specialty through the repository", async () => {
    const { calls, repository } = createRepository();
    const service = createSpecialtiesService(repository);

    const result = await service.deleteFromDB("specialty-1");

    assert.deepEqual(calls.deleteById, ["specialty-1"]);
    assert.equal(result.id, "specialty-1");
});

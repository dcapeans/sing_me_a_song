import '../../src/setup'
import supertest from "supertest";
import app from "../../src/app";
import { clearDatabase, createRecommendation, endConnection } from '../utils/database'

beforeEach(async () => {
  await clearDatabase()
})

afterAll(async () => {
  await endConnection()
})

describe("POST /recommendations", () => {
  it("should answer status 201 when passed valid body", async () => {
    const body = {name: "test", youtubeLink: "https://www.youtube.com/watch?v=testing"}

    const response = await supertest(app).post("/recommendations").send(body);
    expect(response.status).toBe(201);
  });
  it("should answer status 400 for invalid name or youtubeLink", async () => {
    const response = await supertest(app).post("/recommendations");
    expect(response.status).toBe(400);
  });
});

describe("POST /recommendations/:id/upvote", () => {
  it("should answer status 200 for success", async () => {
    createRecommendation()
    const response = await supertest(app).post("/recommendations/1/upvote");
    expect(response.status).toBe(200);
  });
});

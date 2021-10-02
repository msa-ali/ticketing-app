import request from "supertest";
import { app } from "../../app";

it("should responds with user details when user is signed in", async () => {
  const cookie = await signin();
  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);
  expect(response.body.currentUser.email).toBe("test@test.com");
});

it("should responds with null when user is not signed in", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);
  expect(response.body.currentUser).toBeNull();
});

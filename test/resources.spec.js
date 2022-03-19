const supertest = require("supertest");
const server = require("../server");
const userService = require("../services/userService");
const teamService = require("../services/teamService");
const playerService = require("../services/playerService");
const transferService = require("../services/transferService");

const secret = process.env.secret
const jwt = require("jsonwebtoken");

const userPayload = {
  id: 1,
  email: "mubarak014@example.com",
  firstName: "mubarak",
  lastName: "muse",
};

const userInput = {
  email: "mubarak014@example.com",
  firstName: "mubarak",
  lastName: "muse",
  password: "testPassowrd",
};

const playerRes = {
  firstName: "first name",
  lastName: "last name",
  country: "country",
  marketValue: 1000,
};
const playerReq = {
  firstName: "updated first name",
  lastName: "updated last name",
  country: "updated country",
};

const teamRes = {
  country: "usa",
  name: "team usa",
  value: 10000,
};

const teamReq = {
  country: "usa",
  name: "team usa",
};
let token = "";

// describe("resources", () => {
//   beforeAll(async () => {
//     token = await jwt.sign({ sub: 1 }, secret, { expiresIn: "1d" });
//   });

  describe("user", () => {
    beforeAll(async () => {
      token = await jwt.sign({ sub: 1 }, secret, { expiresIn: "1d" });
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    describe("user signup ", () => {
      describe("SUCCESS - given valid payload", () => {
        it("should return the user payload", async () => {
          const singupUserServiceMock = jest
            .spyOn(userService, "signup")
            .mockReturnValueOnce(Promise.resolve(userPayload));

          const { statusCode, body } = await supertest(server)
            .post("/users/signup")
            .send(userInput);

          expect(statusCode).toBe(200);

          expect(body).toEqual({"message": "succesfully signed up"});

          expect(singupUserServiceMock).toHaveBeenCalledWith(userInput);
        });
      });

      describe("FAIL - given Invalid payload", () => {
        it("should return validation error 400", async () => {
          let invalidUserInput = { ...userInput, password: 1234 };
          const signupUserServiceMock = jest
            .spyOn(userService, "signup")
            .mockReturnValueOnce(Promise.resolve(userPayload));

          const { statusCode, body } = await supertest(server)
            .post("/users/signup")
            .send(invalidUserInput);

          expect(statusCode).toBe(400);
          expect(signupUserServiceMock).not.toHaveBeenCalled();
        });
      });
    });

    describe("user login", () => {
      let loginRes = { ...userPayload, jwt: "sdsadasad" };
      let loginReq = {
        email: "mubarak014@example.com",
        password: "testPassowrd",
      };

      describe("SUCCESS - given valid email and password", () => {
        it("should return the user payload", async () => {
          const loginUserServiceMock = jest
            .spyOn(userService, "login")
            .mockReturnValueOnce(Promise.resolve(loginRes));

          const { statusCode, body } = await supertest(server)
            .post("/users/login")
            .send(loginReq);
          expect(statusCode).toBe(200);

          expect(body).toEqual(loginRes);

          expect(loginUserServiceMock).toHaveBeenCalledWith(loginReq);
        });
      });

      describe("FAIL - given Invalid payload", () => {
        it("should return validation error 500", async () => {
          const loginUserServiceMock = jest
            .spyOn(userService, "login")
            .mockReturnValueOnce(Promise.resolve(loginRes));

          const { statusCode, body } = await supertest(server)
            .post("/users/login")
            .send({ ...loginReq, password: 1234 });

          expect(statusCode).toBe(400);
          expect(loginUserServiceMock).not.toHaveBeenCalled();
        });
      });
    });
    describe("user get all", () => {
      let getAllRes = [userPayload];
      describe("SUCCESS with valid jwt", () => {
        it("should return all users", async () => {
          const getAllUsersServiceMock = jest
            .spyOn(userService, "getAll")
            .mockReturnValueOnce(Promise.resolve(getAllRes));

          const { statusCode, body } = await supertest(server)
            .get("/users/")
            .set("Authorization", `Bearer ${token}`);

          expect(statusCode).toBe(200);
          expect(body).toEqual([userPayload]);

          expect(getAllUsersServiceMock).toHaveBeenCalled();
        });
      });
      describe("FAIL with invalid jwt", () => {
        it("should return 401", async () => {
          const getAllUsersServiceMock = jest
            .spyOn(userService, "getAll")
            .mockReturnValueOnce(Promise.resolve(getAllRes));

          const { statusCode, body } = await supertest(server).get("/users/");

          expect(statusCode).toBe(401);
          expect(getAllUsersServiceMock).not.toHaveBeenCalled();
        });
      });
    });
    describe("user get by id", () => {
      describe("SUCCESS with valid jwt", () => {
        it("should return a users", async () => {
          const getByIdUserServiceMock = jest
            .spyOn(userService, "getById")
            .mockReturnValueOnce(Promise.resolve(userPayload));

          const { statusCode, body } = await supertest(server)
            .get("/users/1")
            .set("Authorization", `Bearer ${token}`);

          expect(statusCode).toBe(200);
          expect(body).toEqual(userPayload);

          expect(getByIdUserServiceMock).toHaveBeenCalledWith("1");
        });
      });
    });
  });

  describe("team", () => {
    beforeAll(async () => {
      token = await jwt.sign({ sub: 1 }, secret, { expiresIn: "1d" });
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    describe("update", () => {
      describe("SUCCESS - given valid payload", () => {
        it("should return the team payload", async () => {
          const updateTeamServiceMock = jest
            .spyOn(teamService, "update")
            .mockReturnValueOnce(Promise.resolve(teamRes));

          const { statusCode, body } = await supertest(server)
            .put("/teams/1")
            .set("Authorization", `Bearer ${token}`)
            .send(teamReq);

          expect(statusCode).toBe(200);
          expect(body).toEqual(teamRes);

          expect(updateTeamServiceMock).toHaveBeenCalledWith("1", 1, teamReq);
        });
      });

      describe("FAIL - given Invalid payload", () => {
        it("should return validation error 400", async () => {
          let invalidTeamReq = { ...teamReq, country: 1234 };
          const updateTeamServiceMock = jest
            .spyOn(teamService, "update")
            .mockReturnValueOnce(Promise.resolve(teamRes));

          const { statusCode } = await supertest(server)
            .put("/teams/1")
            .set("Authorization", `Bearer ${token}`)
            .send(invalidTeamReq);

          expect(statusCode).toBe(400);
          expect(updateTeamServiceMock).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe("player", () => {
    beforeAll(async () => {
      token = await jwt.sign({ sub: 1 }, secret, { expiresIn: "1d" });
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    describe("update", () => {
      describe("SUCCESS - given valid payload", () => {
        it("should return the player payload", async () => {
          const updatePlayerServiceMock = jest
            .spyOn(playerService, "update")
            .mockReturnValueOnce(Promise.resolve(playerRes));

          const { statusCode, body } = await supertest(server)
            .put("/players/1")
            .set("Authorization", `Bearer ${token}`)
            .send(playerReq);

          expect(statusCode).toBe(200);
          expect(body).toEqual(playerRes);

          expect(updatePlayerServiceMock).toHaveBeenCalledWith(
            "1",
            1,
            playerReq
          );
        });
      });

      describe("FAIL - given Invalid payload", () => {
        it("should return validation error 400", async () => {
          let invalidPlayerReq = { ...playerReq, country: 1234 };
          const updatePlayerServiceMock = jest
            .spyOn(playerService, "update")
            .mockReturnValueOnce(Promise.resolve(playerRes));

          const { statusCode } = await supertest(server)
            .put("/players/1")
            .set("Authorization", `Bearer ${token}`)
            .send(invalidPlayerReq);

          expect(statusCode).toBe(400);
          expect(updatePlayerServiceMock).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe("transfer", () => {
    beforeAll(async () => {
      token = await jwt.sign({ sub: 1 }, secret, { expiresIn: "1d" });
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    describe("buy", () => {
      describe("SUCCESS", () => {
        it("should return 200", async () => {
          const buyTransferServiceMock = jest
            .spyOn(transferService, "buy")
            .mockReturnValueOnce(Promise.resolve({}));

          const { statusCode, body } = await supertest(server)
            .post("/transfers/1/buy")
            .set("Authorization", `Bearer ${token}`);

          expect(statusCode).toBe(200);
          expect(body).toEqual({"message": "successful purchase",});

          expect(buyTransferServiceMock).toHaveBeenCalledWith("1", 1);
        });
      });
    });

    describe("sell", () => {
      describe("SUCCESS with valid payload", () => {
        it("should return 200", async () => {
          const sellTransferServiceMock = jest
            .spyOn(transferService, "sell")
            .mockReturnValueOnce(Promise.resolve({}));

          const { statusCode, body } = await supertest(server)
            .post("/transfers/1/sell")
            .set("Authorization", `Bearer ${token}`)
            .send({ askPrice: 1000 });

          expect(statusCode).toBe(200);
          expect(body).toEqual({});

          expect(sellTransferServiceMock).toHaveBeenCalledWith("1", 1, {
            askPrice: 1000,
          });
        });
      });

      describe("fail with invalid payload", () => {
        it("should return 400", async () => {
          const sellTransferServiceMock = jest
            .spyOn(transferService, "sell")
            .mockReturnValueOnce(Promise.resolve({}));

          const { statusCode, body } = await supertest(server)
            .post("/transfers/1/sell")
            .set("Authorization", `Bearer ${token}`)
            .send({ askPrice: "1000" });

          expect(statusCode).toBe(400);

          expect(sellTransferServiceMock).not.toHaveBeenCalled();
        });
      });
    });
  });
// });

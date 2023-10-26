import { createClient } from "redis";

let redisClient;

(async () => {
  //Creating redis object - default port 6379

  redisClient = createClient({ url: "redis://localhost:6379" });

  redisClient.on("connect", () => {
    console.log("Redis Connected");
  });

  redisClient.on("error", (error: any) => {
    console.log(`Error : ${error}`);
  });

  redisClient.on("end", () => {
    console.log("Connection ended");
  });

  // await redisClient.connect();
})();

export { redisClient };

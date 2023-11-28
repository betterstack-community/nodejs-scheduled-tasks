import "dotenv/config";
import Agenda from "agenda";

const mongoConnectionString = process.env.MONGO_URI;

const agenda = new Agenda({ db: { address: mongoConnectionString } });

export async function scheduleTask(name, frequency, callback) {
  try {
    await agenda.define(name, { priority: "high" }, async (job, done) => {
      await callback();
      await fetch(
        `https://uptime.betterstack.com/api/v1/heartbeat/${process.env.HEARTBEAT_TOKEN}`
      );

      done();
    });

    await agenda.start();
    await agenda.every(frequency, name);
  } catch (error) {
    throw new Error(`Error scheduling task '${name}': ${error.message}`);
  }
}

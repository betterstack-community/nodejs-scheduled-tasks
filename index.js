import "dotenv/config";
import Agenda from "agenda";
import Agendash from "agendash";
import express from "express";
const app = express();

const mongoConnectionString = process.env.MONGO_URI;

const agenda = new Agenda({
  db: {
    address: mongoConnectionString,
    processEvery: "30 seconds",
    maxConcurrency: 28,
  },
});

app.use("/dash", Agendash(agenda));

agenda.define("welcome message", async () => {
  console.log("Sending a welcome message every few seconds");
});

agenda.define("exporting data", { priority: "high" }, async (job) => {
  const { database, path } = job.attrs.data;
  console.log(`Exporting ${database} data to ${path}`);
});

await agenda.start();

await agenda.every("* * * * *", "welcome message");

await agenda.cancel({ name: "exporting data" });

await agenda.now("exporting data", {
  database: "Sales Report",
  path: "/home/username/sales_report.csv",
});

async function listJobs() {
  const jobs = await agenda.jobs({});
  jobs.forEach((job) => {
    console.log(
      `Job ID: ${job.attrs._id}, Name: ${
        job.attrs.name
      }, Data: ${JSON.stringify(job.attrs.data)}`
    );
  });
}

listJobs();

app.listen(3000, () => {
  console.log("Agendash is accessible at: http://localhost:3000/dash/");
});

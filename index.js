import 'dotenv/config';
import Agenda from 'agenda';

const mongoConnectionString = process.env.MONGO_URI;

const agenda = new Agenda({ db: { address: mongoConnectionString } });

agenda.define('welcomeMessage', () => {
  console.log('Sending a welcome message every few seconds');
});

agenda.define('dataExport', (job) => {
  const { name, path } = job.attrs.data;
  console.log(`Exporting ${name} data to ${path}`);
});

await agenda.start();

await agenda.every('5 seconds', 'welcomeMessage');

await agenda.every('5 seconds', 'dataExport', {
  name: 'Sales report',
  path: '/home/username/sales_report.csv',
});

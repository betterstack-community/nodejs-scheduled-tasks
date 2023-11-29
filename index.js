import 'dotenv/config';
import Agenda from 'agenda';

const mongoConnectionString = process.env.MONGO_URI;

const agenda = new Agenda({ db: { address: mongoConnectionString } });

agenda.define('welcomeMessage', () => {
  console.log('Sending a welcome message every few seconds');
});

await agenda.start();

await agenda.every('5 seconds', 'welcomeMessage');

import promise from 'bluebird';
import debugFn from 'debug';
import monitor from 'pg-monitor';
import pg from 'pg-promise';

import config from './index';

const debug = debugFn('commute:db');

const options = {
  promiseLib: promise,
};
const pgp = pg(options);

const db = pgp(config.DB_URL);
monitor.setTheme('invertedMonochrome');
monitor.attach(options);

async function dbConnect() {
  try {
    await db.connect();
    debug('Successfully connected to db');
  } catch (error: any) {
    debug(error.message);
    process.exit(1);
  }
}

export { dbConnect, db };

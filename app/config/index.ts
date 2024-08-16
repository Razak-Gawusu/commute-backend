import * as path from 'path';

import development from './env/development';
import production from './env/production';
import test from './env/test';

interface EnvironmentConfig {
  [key: string]: any;
}

const defaults: EnvironmentConfig = {
  root: path.normalize(`${__dirname}/..`),
};

const environment = {
  development: Object.assign(development, defaults),
  test: Object.assign(test, defaults),
  production: Object.assign(production, defaults),
}[process.env.KREDIT_NODE_ENV || 'development'];

const mergedConfig: EnvironmentConfig = { ...process.env, ...environment };

export default mergedConfig;

export * from './postgres';

import { purgeExpiredExperimentData } from '../lib/analytics';

purgeExpiredExperimentData();
console.log('Stale experiment data purged');

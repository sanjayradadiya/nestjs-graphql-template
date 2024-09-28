import 'reflect-metadata';
import { startDataLoading } from './data-loading';

startDataLoading()
  .then(() => {
    console.log('Data loading completed successfully.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error loading data:', err);
    process.exit(1);
  });

import { startWorker } from '~/mocks/handlers';

export default defineNuxtPlugin(() => {
  if (process.env.NODE_ENV === 'development') {
    startWorker();
  }
});

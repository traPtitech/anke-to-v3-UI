import { setupWorker } from 'msw/browser';
import { handlers } from '~/mocks/handlers';

export default defineNuxtPlugin(async () => {
  if (process.env.NODE_ENV === 'development') {
    const worker = setupWorker(...handlers);
    await worker.start();
  }
});

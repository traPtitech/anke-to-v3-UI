import { setupWorker } from 'msw/browser';
import { handlers } from '~/mocks/handlers';

export default defineNuxtPlugin(async () => {
  if (process.env.NODE_ENV === 'development') {
    const worker = setupWorker(...handlers);
    await worker.start({
      onUnhandledRequest(req, print) {
        if (req.url.includes('/_nuxt')) {
          return;
        }
        print.warning();
      },
    });
  }
});

import { remindHandlers } from '~/mocks/handlers/remind';
import { responseHandlers } from '~/mocks/handlers/response';
import { questionnaireHandlers } from './questionnaire';
import { traqHandlers } from './traq';
import { delay, http } from 'msw';

export const handlers = [
  http.all('*', async () => {
    await delay();
  }),
  ...questionnaireHandlers,
  ...remindHandlers,
  ...responseHandlers,
  ...traqHandlers,
];

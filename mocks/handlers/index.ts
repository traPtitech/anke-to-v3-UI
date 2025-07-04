import { remindHandlers } from "~/mocks/handlers/remind";
import { responseHandlers } from "~/mocks/handlers/response";
import { questionnaireHandlers } from "./questionnaire";

export const handlers = [
  ...questionnaireHandlers,
  ...remindHandlers,
  ...responseHandlers,
];

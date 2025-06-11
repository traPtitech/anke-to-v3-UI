import { remindHandlers } from "~/mocks/handlers/remind";
import { questionnaireHandlers } from "./questionnaire";

export const handlers = [...questionnaireHandlers, ...remindHandlers];

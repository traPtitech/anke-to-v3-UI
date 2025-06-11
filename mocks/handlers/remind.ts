import { http, HttpResponse } from "msw";
import type { paths } from "~/composables/type-fetch/anke-to/openapi";

export const myRemindsData = [
  {
    questionnaire_id: 3,
    remind: true,
  },
];

type GetMyRemindStatusResponse =
  paths["/questionnaires/{questionnaireID}/myRemindStatus"]["get"]["responses"][
    "200"
  ]["content"]["application/json"];

export const remindHandlers = [
  http.get("/api/questionnaires/:id/myRemindStatus", (req) => {
    const { id } = req.params;
    const remind = myRemindsData.find((r) => r.questionnaire_id === Number(id));

    const response: GetMyRemindStatusResponse = {
      is_remind_enabled: remind ? remind.remind : false,
    };

    return HttpResponse.json(response);
  }),
];

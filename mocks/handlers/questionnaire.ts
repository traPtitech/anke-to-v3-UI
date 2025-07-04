import { http, HttpResponse } from "msw";
import type {
  components,
  paths,
} from "~/composables/type-fetch/anke-to/openapi";
import { responsesData } from "~/mocks/handlers/response";
import {
  myUserId,
  oneDayAfter,
  oneDayBefore,
  twoWeeksAfter,
} from "~/mocks/handlers/util";
import type { GatewayQuestionnaire } from "~/models/questionnaire";

type QuestionnaireSummary = components["schemas"]["QuestionnaireSummary"];

const defaultQuestionnaire: Omit<
  GatewayQuestionnaire,
  "questionnaire_id" | "title"
> = {
  description: "",
  response_due_date_time: undefined,
  created_at: oneDayBefore,
  modified_at: oneDayBefore,
  is_duplicate_answer_allowed: false,
  is_anonymous: false,
  is_published: true,
  response_viewable_by: "anyone",
  admin: { users: [myUserId], groups: [] },
  admins: [myUserId],
  target: { users: [myUserId], groups: [] },
  targets: [myUserId],
  questions: [
    {
      question_id: 1,
      title: "質問1",
      description: "質問1の説明",
      question_type: "Text",
      is_required: true,
      created_at: oneDayBefore,
    },
    {
      question_id: 2,
      title: "質問2",
      description: "質問2の説明",
      question_type: "TextLong",
      is_required: true,
      created_at: oneDayBefore,
    },
    {
      question_id: 3,
      title: "質問3",
      description: "質問3の説明",
      question_type: "Number",
      is_required: true,
      created_at: oneDayBefore,
    },
    {
      question_id: 4,
      title: "質問4",
      description: "質問4の説明",
      question_type: "SingleChoice",
      is_required: true,
      options: ["選択肢1", "選択肢2", "選択肢3"],
      created_at: oneDayBefore,
    },
    {
      question_id: 5,
      title: "質問5",
      description: "質問5の説明",
      question_type: "MultipleChoice",
      is_required: true,
      options: ["選択肢1", "選択肢2", "選択肢3"],
      created_at: oneDayBefore,
    },
    {
      question_id: 6,
      title: "質問6",
      description: "質問6の説明",
      question_type: "Scale",
      is_required: true,
      min_value: 1,
      min_label: "最小値",
      max_value: 5,
      max_label: "最大値",
      created_at: oneDayBefore,
    },
  ],
  respondents: [],
};

export const questionnairesData: GatewayQuestionnaire[] = [
  {
    ...defaultQuestionnaire,
    questionnaire_id: 1,
    title: "テスト用のアンケート",
    description:
      "ここに **Markdown** 形式で *アンケート* の説明を書けます。\n- リスト\n  - も使えるよ！\n```\n使うか分からんけどコードブロックも書けるよ\n```:traq: ← スタンプは使えるのかな？",
    response_due_date_time: oneDayAfter,
    admins: [],
    admin: { users: [], groups: [] },
  },
  {
    ...defaultQuestionnaire,
    questionnaire_id: 2,
    title:
      "結構長いタイトルのアンケートが作られることをちゃんと開発者が考慮するためのアンケート",
    description: "",
    response_due_date_time: twoWeeksAfter,
  },
  {
    ...defaultQuestionnaire,
    questionnaire_id: 3,
    title: "既に自分が回答したアンケート (自分が対象)",
    targets: [myUserId],
    respondents: [myUserId],
  },
  {
    ...defaultQuestionnaire,
    questionnaire_id: 4,
    title: "既に自分が回答したアンケート (自分が対象ではない)",
    targets: [],
    respondents: [myUserId],
  },
  {
    ...defaultQuestionnaire,
    questionnaire_id: 5,
    title: "自分の下書きが残っているアンケート",
    respondents: [],
  },
  {
    ...defaultQuestionnaire,
    questionnaire_id: 6,
    title: "自分の下書きが残っているアンケート (回答済み)",
    is_duplicate_answer_allowed: true,
    respondents: [myUserId],
  },
  {
    ...defaultQuestionnaire,
    questionnaire_id: 7,
    title: "自分が管理者のアンケート (未公開)",
    admin: { users: [myUserId], groups: [] },
    admins: [myUserId],
    is_published: false,
  },
  {
    ...defaultQuestionnaire,
    questionnaire_id: 8,
    title: "自分が管理者のアンケート (公開済み)",
    admin: { users: [myUserId], groups: [] },
    admins: [myUserId],
    is_published: true,
  },
  {
    ...defaultQuestionnaire,
    questionnaire_id: 9,
    title: "自分が管理者のアンケート (全員回答済み)",
    admin: { users: [myUserId], groups: [] },
    admins: [myUserId],
    is_published: true,
    target: { users: [myUserId], groups: [] },
    targets: [myUserId],
    respondents: [myUserId],
  },
  {
    ...defaultQuestionnaire,
    questionnaire_id: 10,
    title: "回答が非公開のアンケート",
    response_viewable_by: "admins",
    admin: { users: [], groups: [] },
    admins: [],
  },
  {
    ...defaultQuestionnaire,
    questionnaire_id: 11,
    title: "回答が回答者のみに公開されるアンケート",
    response_viewable_by: "respondents",
    admin: { users: [], groups: [] },
    admins: [],
  },
  {
    ...defaultQuestionnaire,
    questionnaire_id: 12,
    title: "複数回答できるアンケート",
    is_duplicate_answer_allowed: true,
  },
  {
    ...defaultQuestionnaire,
    questionnaire_id: 13,
    title: "匿名回答のアンケート",
    is_anonymous: true,
  },
];

type Question = components["schemas"]["Question"];
export const questionsData: Question[] = [];

export const toSummary = (
  q: GatewayQuestionnaire,
): QuestionnaireSummary => ({
  questionnaire_id: q.questionnaire_id,
  title: q.title,
  description: q.description,
  response_due_date_time: q.response_due_date_time,
  is_published: q.is_published,
  is_duplicate_answer_allowed: q.is_duplicate_answer_allowed,
  is_anonymous: q.is_anonymous,
  response_viewable_by: q.response_viewable_by,
  created_at: q.created_at,
  modified_at: q.modified_at,
  all_responded: q.targets.every((user) => q.respondents.includes(user)),
  has_my_draft: responsesData.some(
    (r) =>
      r.questionnaire_id === q.questionnaire_id &&
      r.is_draft &&
      r.respondent === myUserId,
  ),
  is_targeting_me: q.targets.includes(myUserId),
  has_my_response: q.respondents.includes(myUserId),
  responded_date_time_by_me: responsesData.find(
    (r) =>
      r.questionnaire_id === q.questionnaire_id &&
      r.respondent === myUserId && !r.is_draft,
  )?.submitted_at,
});

const questionnairesSortFunc: Record<
  string,
  (a: QuestionnaireSummary, b: QuestionnaireSummary) => number
> = {
  "created_at": (a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  "modified_at": (a, b) =>
    new Date(b.modified_at).getTime() - new Date(a.modified_at).getTime(),
  "title": (a, b) => a.title.localeCompare(b.title),
  "-created_at": (a, b) =>
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  "-modified_at": (a, b) =>
    new Date(a.modified_at).getTime() - new Date(b.modified_at).getTime(),
  "-title": (a, b) => b.title.localeCompare(a.title),
};

type GetQuestionnairesResponse =
  paths["/questionnaires"]["get"]["responses"]["200"]["content"][
    "application/json"
  ];

type PostQuestionnaireRequest =
  paths["/questionnaires"]["post"]["requestBody"]["content"][
    "application/json"
  ];

type PatchQuestionnaireBody =
  paths["/questionnaires/{questionnaireID}"]["patch"]["requestBody"]["content"][
    "application/json"
  ];

type GetQuestionnaireResponse =
  paths["/questionnaires/{questionnaireID}"]["get"]["responses"]["200"][
    "content"
  ]["application/json"];

export const questionnaireHandlers = [
  http.get("/api/questionnaires", (req) => {
    const pageSize = 20;

    const sort = new URL(req.request.url).searchParams.get("sort") ??
      "created_at";
    const search = new URL(req.request.url).searchParams.get("search") ?? "";
    const page = parseInt(
      new URL(req.request.url).searchParams.get("page") ?? "1",
    );
    const onlyTargetingMe = new URL(req.request.url).searchParams.get(
      "onlyTargetingMe",
    ) === "true";
    const onlyAdministratedByMe = new URL(
      req.request.url,
    ).searchParams.get("onlyAdministratedByMe") === "true";

    const questionnaires: QuestionnaireSummary[] = questionnairesData.map(
      toSummary,
    );

    const filteredQuestionnaires = questionnaires.filter((q) => {
      const detail = questionnairesData.find(
        (data) => data.questionnaire_id === q.questionnaire_id,
      );

      const matchesSearch = q.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const isTargetingMe = !onlyTargetingMe || q.is_targeting_me;
      const isAdministeredByMe = !onlyAdministratedByMe ||
        detail?.admins.includes(myUserId);
      return matchesSearch && isTargetingMe && isAdministeredByMe;
    }).toSorted(questionnairesSortFunc[sort]);

    const pagedQuestionnaires = filteredQuestionnaires.slice(
      (page - 1) * pageSize,
      page * pageSize,
    );

    const response: GetQuestionnairesResponse = {
      page_max: Math.ceil(
        filteredQuestionnaires.length / pageSize,
      ),
      questionnaires: pagedQuestionnaires,
    };

    return HttpResponse.json(response);
  }),

  http.post("/api/questionnaires", async (req) => {
    const body = await req.request.json() as PostQuestionnaireRequest;
    for (const question of body.questions) {
      questionsData.push({
        ...question,
        question_id: questionsData.length + 1,
        created_at: new Date().toISOString(),
      });
    }
    const newQuestionnaire: GatewayQuestionnaire = {
      ...body,
      questionnaire_id: questionnairesData.length + 1,
      created_at: new Date().toISOString(),
      modified_at: new Date().toISOString(),
      questions: questionsData.slice(
        questionsData.length - body.questions.length,
        questionsData.length,
      ),
      targets: body.target?.users ?? [],
      admins: body.admin?.users ?? [],
      respondents: [],
    };
    questionnairesData.push(newQuestionnaire);
    return HttpResponse.json(newQuestionnaire, { status: 201 });
  }),

  http.get("/api/questionnaires/:id", (req) => {
    const { id } = req.params;
    const questionnaire = questionnairesData.find((q) =>
      q.questionnaire_id === Number(id)
    );
    if (!questionnaire) {
      return HttpResponse.json(
        { error: "Questionnaire not found" },
        { status: 404 },
      );
    }

    const response: GetQuestionnaireResponse = questionnaire;

    return HttpResponse.json(response);
  }),

  http.patch("/api/questionnaires/:id", async (req) => {
    const id = Number(req.params.id);
    const body = await req.request.json() as PatchQuestionnaireBody;
    const index = questionnairesData.findIndex(
      (q) => q.questionnaire_id === id,
    );
    if (index === -1) {
      return HttpResponse.json(
        { error: "Questionnaire not found" },
        { status: 404 },
      );
    }
    const questionnaire = questionnairesData[index];
    questionnairesData[index] = {
      ...questionnaire,
      ...body,
      modified_at: new Date().toISOString(),
      // TODO: update questionsData accordingly
    };

    return HttpResponse.json(questionnairesData[index]);
  }),

  http.delete("/api/questionnaires/:id", (req) => {
    const { id } = req.params;
    const index = questionnairesData.findIndex(
      (q) => q.questionnaire_id === Number(id),
    );
    if (index === -1) {
      return HttpResponse.json(
        { error: "Questionnaire not found" },
        { status: 404 },
      );
    }
    questionnairesData.splice(index, 1);
    return HttpResponse.json({ message: "Questionnaire deleted" });
  }),
];

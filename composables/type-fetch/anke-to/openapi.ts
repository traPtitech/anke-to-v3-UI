/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */


export interface paths {
  "/questionnaires": {
    /** @description 与えられた条件を満たす20件以下のアンケートのリストを取得します。 */
    get: operations["getQuestionnaires"];
    /** @description 新しいアンケートを作成します。 */
    post: operations["postQuestionnaire"];
  };
  "/questionnaires/{questionnaireID}": {
    /** @description アンケートの情報を取得します。 */
    get: operations["getQuestionnaire"];
    /** @description アンケートを削除します。 */
    delete: operations["deleteQuestionnaire"];
    /** @description アンケートの情報を変更します。 */
    patch: operations["editQuestionnaire"];
  };
  "/questionnaires/{questionnaireID}/myRemindStatus": {
    /** @description 自分に対するリマインドが有効かどうかを取得します。 */
    get: operations["getQuestionnaireMyRemindStatus"];
    /** @description 自分に対するリマインドが有効かどうかを変更します。 */
    patch: operations["editQuestionnaireMyRemindStatus"];
  };
  "/questionnaires/{questionnaireID}/responses": {
    /** @description アンケートの全ての回答を取得します。アンケートが匿名回答の場合、取得できません。 */
    get: operations["getQuestionnaireResponses"];
    /** @description 新しい回答を作成します。アンケートが複数回答可能でない場合、過去の回答が削除されます。 */
    post: operations["postQuestionnaireResponse"];
  };
  "/questionnaires/{questionnaireID}/result": {
    /** @description アンケートの回答を集計した結果を取得します。回答者の情報は含まれず、アンケートが匿名回答であっても取得できます。 */
    get: operations["getQuestionnaireResult"];
  };
  "/responses/{responseID}": {
    /** @description 回答を取得します。 */
    get: operations["getResponse"];
    /** @description 回答を削除します */
    delete: operations["deleteResponse"];
    /** @description 回答を変更します。 */
    patch: operations["editResponse"];
  };
  "/responses/myResponses": {
    /** @description 自分のすべての回答のリストを取得します。 */
    get: operations["getMyResponses"];
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    /**
     * @description アンケート検索時に回答済みかの状態での絞り込み
     * @enum {string}
     */
    AnsweredType: "answered" | "unanswered";
    /**
     * @description question、questionnaire用のソートの種類
     * @enum {string}
     */
    SortType: "created_at" | "-created_at" | "title" | "-title" | "modified_at" | "-modified_at";
    /**
     * @description response用のsortの種類
     * @enum {string}
     */
    ResponseSortType: "submitted_at" | "-submitted_at" | "title" | "-title" | "modified_at" | "-modified_at";
    /**
     * @description アンケートの結果を, 運営は見られる ("admins"), 回答済みの人は見られる ("respondents") 誰でも見られる ("anyone")
     *
     * @example anyone
     * @enum {string}
     */
    ResShareType: "admins" | "respondents" | "anyone";
    NewQuestionnaire: components["schemas"]["QuestionnaireTitle"] & components["schemas"]["QuestionnaireDescription"] & components["schemas"]["QuestionnaireResponseDueDateTime"] & components["schemas"]["QuestionnaireResponseViewableBy"] & components["schemas"]["QuestionnaireIsAnonymous"] & components["schemas"]["QuestionnaireIsAllowingMultipleResponses"] & components["schemas"]["QuestionnaireIsPublished"] & components["schemas"]["QuestionnaireTargetsAndAdmins"] & {
      questions: components["schemas"]["NewQuestion"][];
    };
    QuestionnaireDetail: components["schemas"]["QuestionnaireID"] & components["schemas"]["NewQuestionnaire"] & components["schemas"]["QuestionnaireRespondents"] & components["schemas"]["QuestionnaireCreatedAt"] & components["schemas"]["QuestionnaireModifiedAt"];
    QuestionnaireSummary: components["schemas"]["QuestionnaireID"] & components["schemas"]["QuestionnaireTitle"] & components["schemas"]["QuestionnaireDescription"] & components["schemas"]["QuestionnaireResponseDueDateTime"] & components["schemas"]["QuestionnaireResponseViewableBy"] & components["schemas"]["QuestionnaireIsAnonymous"] & components["schemas"]["QuestionnaireIsAllowingMultipleResponses"] & components["schemas"]["QuestionnaireIsPublished"] & {
      /**
       * @description 自分がターゲットになっているかどうか
       *
       * @example true
       */
      is_targeting_me: boolean;
      /** Format: date-time */
      responded_at: string;
      /** @description 下書きが存在する */
      has_my_draft: boolean;
      /** @description 回答が存在する */
      has_my_response: boolean;
      /**
       * @description すべての対象者が回答済みの場合 true を返す。それ以外は false を返す。 (対象者が存在しない場合は true を返す)
       *
       * @example true
       */
      all_responded: boolean;
    };
    QuestionnaireList: {
      /**
       * @description 合計のページ数
       *
       * @example 1
       */
      page_max: number;
      questionnaires: components["schemas"]["QuestionnaireSummary"][];
    };
    QuestionnaireID: {
      /** @example 1 */
      questionnaire_id: number;
    };
    QuestionnaireTitle: {
      /** @example 第1回集会らん☆ぷろ募集アンケート */
      title: string;
    };
    QuestionnaireDescription: {
      /** @example 第1回メンバー集会でのらん☆ぷろで発表したい人を募集します らん☆ぷろで発表したい人あつまれー！ */
      description: string;
    };
    QuestionnaireResponseDueDateTime: {
      /** Format: date-time */
      response_due_date_time: string;
    };
    QuestionnaireResponseViewableBy: {
      response_viewable_by: components["schemas"]["ResShareType"];
    };
    QuestionnaireIsAnonymous: {
      /**
       * @description 匿名回答かどうか
       *
       * @example true
       */
      is_anonymous: boolean;
    };
    QuestionnaireIsAllowingMultipleResponses: {
      /**
       * @description 一人が複数回回答できるかどうか
       *
       * @example true
       */
      is_allowing_multiple_responses: boolean;
    };
    QuestionnaireIsPublished: {
      /**
       * @description アンケートが公開されているかどうか
       *
       * @example true
       */
      is_published: boolean;
    };
    QuestionnaireCreatedAt: {
      /** Format: date-time */
      created_at: string;
    };
    QuestionnaireModifiedAt: {
      /** Format: date-time */
      modified_at: string;
    };
    QuestionnaireTargetsAndAdmins: {
      targets: components["schemas"]["UsersAndGroups"];
      admins: components["schemas"]["UsersAndGroups"];
    };
    QuestionnaireRespondents: {
      respondents: components["schemas"]["Users"];
    };
    QuestionnaireHasMyResponse: {
      /** @description 回答済みあるいは下書きが存在する */
      has_response: boolean;
    };
    QuestionnaireIsRemindEnabled: {
      /** @description 自分に対するリマインドが有効かどうか。ユーザーが対象者でありかつ回答していない場合、この値がtrueであればリマインドが送信される。 */
      is_remind_enabled: boolean;
    };
    NewQuestion: components["schemas"]["QuestionBase"] & components["schemas"]["QuestionSettingsByType"];
    Question: components["schemas"]["QuestionBase"] & components["schemas"]["QuestionSettingsByType"] & {
      /** @example 1 */
      question_id: number;
      /** Format: date-time */
      created_at: string;
    };
    Questions: components["schemas"]["Question"][];
    QuestionBase: {
      /** @example 1 */
      questionnaire_id: number;
      title: string;
      description: string;
      is_required: boolean;
    };
    QuestionSettingsByType: components["schemas"]["QuestionSettingsText"] | components["schemas"]["QuestionSettingsTextLong"] | components["schemas"]["QuestionSettingsNumber"] | components["schemas"]["QuestionSettingsSingleChoice"] | components["schemas"]["QuestionSettingsMultipleChoice"] | components["schemas"]["QuestionSettingsScale"];
    QuestionSettingsText: components["schemas"]["QuestionTypeText"] & {
      max_length?: number;
    };
    QuestionSettingsTextLong: components["schemas"]["QuestionTypeTextLong"] & {
      max_length?: number;
    };
    QuestionSettingsNumber: components["schemas"]["QuestionTypeNumber"] & {
      min_value?: number;
      max_value?: number;
    };
    QuestionSettingsSingleChoice: components["schemas"]["QuestionTypeSingleChoice"] & {
      options: string[];
    };
    QuestionSettingsMultipleChoice: components["schemas"]["QuestionTypeMultipleChoice"] & {
      options: string[];
    };
    QuestionSettingsScale: components["schemas"]["QuestionTypeScale"] & {
      min_value: number;
      max_value: number;
    };
    NewResponse: {
      /** @example true */
      is_draft: boolean;
      body: components["schemas"]["ResponseBody"][];
    };
    Response: components["schemas"]["QuestionnaireID"] & {
      /** @example 1 */
      response_id: number;
      /** Format: date-time */
      submitted_at: string;
      /** Format: date-time */
      modified_at: string;
    } & components["schemas"]["NewResponse"];
    Responses: components["schemas"]["Response"][];
    ResponseBody: components["schemas"]["ResponseSettingsText"] | components["schemas"]["ResponseSettingsTextLong"] | components["schemas"]["ResponseSettingsNumber"] | components["schemas"]["ResponseSettingsSingleChoice"] | components["schemas"]["ResponseSettingsMultipleChoice"] | components["schemas"]["ResponseSettingsScale"];
    ResponseSettingsText: components["schemas"]["QuestionTypeText"] & {
      text: string;
    };
    ResponseSettingsTextLong: components["schemas"]["QuestionTypeTextLong"] & {
      textLong: string;
    };
    ResponseSettingsNumber: components["schemas"]["QuestionTypeNumber"] & {
      number: number;
    };
    ResponseSettingsSingleChoice: components["schemas"]["QuestionTypeSingleChoice"] & {
      /** @description 選択肢のインデックス */
      index: number;
    };
    ResponseSettingsMultipleChoice: components["schemas"]["QuestionTypeMultipleChoice"] & {
      /** @description 選択肢のインデックスの配列 */
      indexes: number[];
    };
    ResponseSettingsScale: components["schemas"]["QuestionTypeScale"] & {
      number: number;
    };
    QuestionTypeText: {
      /** @enum {string} */
      question_type: "Text";
    };
    QuestionTypeTextLong: {
      /** @enum {string} */
      question_type: "TextLong";
    };
    QuestionTypeNumber: {
      /** @enum {string} */
      question_type: "Number";
    };
    QuestionTypeSingleChoice: {
      /** @enum {string} */
      question_type: "SingleChoice";
    };
    QuestionTypeMultipleChoice: {
      /** @enum {string} */
      question_type: "MultipleChoice";
    };
    QuestionTypeScale: {
      /** @enum {string} */
      question_type: "Scale";
    };
    Result: {
      /** @example 1 */
      questionnaire_id: number;
      /** @example 1 */
      response_count: number;
      body: components["schemas"]["ResultBody"][];
    };
    ResultBody: components["schemas"]["ResultSettingsText"] | components["schemas"]["ResultSettingsTextLong"] | components["schemas"]["ResultSettingsNumber"] | components["schemas"]["ResultSettingsSingleChoice"] | components["schemas"]["ResultSettingsMultipleChoice"] | components["schemas"]["ResultSettingsScale"];
    ResultSettingsText: components["schemas"]["QuestionTypeText"] & {
      /** @description 回答文の配列 */
      answers: string[];
    };
    ResultSettingsTextLong: components["schemas"]["QuestionTypeTextLong"] & {
      /** @description 回答文の配列 */
      answers: string[];
    };
    ResultSettingsNumber: components["schemas"]["QuestionTypeNumber"] & components["schemas"]["ResultSettingsAnswerCountsPerNumber"];
    ResultSettingsSingleChoice: components["schemas"]["QuestionTypeSingleChoice"] & components["schemas"]["ResultSettingsAnswerCountsPerIndex"];
    ResultSettingsMultipleChoice: components["schemas"]["QuestionTypeMultipleChoice"] & components["schemas"]["ResultSettingsAnswerCountsPerIndex"];
    ResultSettingsScale: components["schemas"]["QuestionTypeScale"] & components["schemas"]["ResultSettingsAnswerCountsPerNumber"];
    ResultSettingsAnswerCountsPerNumber: {
      answer_counts_per_number: {
          number: number;
          answer_count: number;
        }[];
    };
    ResultSettingsAnswerCountsPerIndex: {
      answer_counts_per_index: {
          index: number;
          answer_count: number;
        }[];
    };
    UsersAndGroups: {
      users: components["schemas"]["Users"];
      groups: components["schemas"]["Groups"];
    };
    Users: string[];
    Groups: string[];
  };
  responses: never;
  parameters: {
    /** @description 回答したもの(answered)か未回答のもの(unanswered)かを選別 */
    answeredInQuery?: components["schemas"]["AnsweredType"];
    /** @description 並び順 (作成日時が新しい "created_at", 作成日時が古い "-created_at", タイトルの昇順 "title", タイトルの降順 "-title", 更新日時が新しい "modified_at", 更新日時が古い "-modified_at" ) */
    sortInQuery?: components["schemas"]["SortType"];
    /** @description 並び順 (作成日時が新しい "submitted_at", 作成日時が古い "-submitted_at", タイトルの昇順 "title", タイトルの降順 "-title", 更新日時が新しい "modified_at", 更新日時が古い "-modified_at" ) */
    responseSortInQuery?: components["schemas"]["ResponseSortType"];
    /** @description タイトルの検索 */
    searchInQuery?: string;
    /** @description 何ページ目か (未定義の場合は1ページ目) */
    pageInQuery?: number;
    /** @description 自分がターゲットになっているもののみ取得 (true), ターゲットになっているものも含めてすべて取得 (false)。デフォルトはfalse。 */
    onlyTargetingMeInQuery?: boolean;
    /** @description 自分が管理者になっていないもののみ取得 (true), 管理者になっているものも含めてすべて取得 (false)。デフォルトはfalse。 */
    onlyAdministratedByMeInQuery?: boolean;
    /** @description 自分の回答のみ取得 (true), 自分の回答以外も含めてすべて取得 (false)。デフォルトはfalse。 */
    onlyMyResponseInQuery?: boolean;
    /** @description アンケートID */
    questionnaireIDInPath: number;
    /** @description 質問ID */
    questionIDInPath: number;
    /** @description 回答ID */
    responseIDInPath: number;
    /** @description traQ ID(ex:mazrean) */
    traQIDInPath: string;
  };
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type $defs = Record<string, never>;

export type external = Record<string, never>;

export interface operations {

  /** @description 与えられた条件を満たす20件以下のアンケートのリストを取得します。 */
  getQuestionnaires: {
    parameters: {
      query?: {
        sort?: components["parameters"]["sortInQuery"];
        search?: components["parameters"]["searchInQuery"];
        page?: components["parameters"]["pageInQuery"];
        onlyTargetingMe?: components["parameters"]["onlyTargetingMeInQuery"];
        onlyAdministratedByMe?: components["parameters"]["onlyAdministratedByMeInQuery"];
      };
    };
    responses: {
      /** @description 正常に取得できました。アンケートの配列を返します。 */
      200: {
        content: {
          "application/json": components["schemas"]["QuestionnaireList"];
        };
      };
      /** @description 与えられた情報の形式が異なります */
      400: {
        content: never;
      };
      /** @description アンケートを正常に取得できませんでした */
      500: {
        content: never;
      };
      /** @description SQLの実行時間が3sを超えた場合。主に正規表現が原因。 */
      503: {
        content: never;
      };
    };
  };
  /** @description 新しいアンケートを作成します。 */
  postQuestionnaire: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["NewQuestionnaire"];
      };
    };
    responses: {
      /** @description 正常にアンケートを作成できました。作成されたアンケートを返します。 */
      201: {
        content: {
          "application/json": components["schemas"]["QuestionnaireDetail"];
        };
      };
      /** @description 与えられた情報の形式が異なります */
      400: {
        content: never;
      };
      /** @description アンケートを正常に作成できませんでした */
      500: {
        content: never;
      };
    };
  };
  /** @description アンケートの情報を取得します。 */
  getQuestionnaire: {
    parameters: {
      path: {
        questionnaireID: components["parameters"]["questionnaireIDInPath"];
      };
    };
    responses: {
      /** @description 正常に取得できました。 */
      200: {
        content: {
          "application/json": components["schemas"]["QuestionnaireDetail"];
        };
      };
      /** @description アンケートのIDが無効です */
      400: {
        content: never;
      };
      /** @description アンケートが存在しません */
      404: {
        content: never;
      };
      /** @description アンケートを正常に取得できませんでした */
      500: {
        content: never;
      };
    };
  };
  /** @description アンケートを削除します。 */
  deleteQuestionnaire: {
    parameters: {
      path: {
        questionnaireID: components["parameters"]["questionnaireIDInPath"];
      };
    };
    responses: {
      /** @description 正常にアンケートを削除できました。 */
      200: {
        content: never;
      };
      /** @description アンケートのIDが無効です */
      400: {
        content: never;
      };
      /** @description アンケートの削除ができませんでした */
      500: {
        content: never;
      };
    };
  };
  /** @description アンケートの情報を変更します。 */
  editQuestionnaire: {
    parameters: {
      path: {
        questionnaireID: components["parameters"]["questionnaireIDInPath"];
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["QuestionnaireDetail"];
      };
    };
    responses: {
      /** @description 正常にアンケートを変更できました。 */
      200: {
        content: never;
      };
      /** @description アンケートのIDが無効です */
      400: {
        content: never;
      };
      /** @description 正常にアンケートを変更できませんでした */
      500: {
        content: never;
      };
    };
  };
  /** @description 自分に対するリマインドが有効かどうかを取得します。 */
  getQuestionnaireMyRemindStatus: {
    parameters: {
      path: {
        questionnaireID: components["parameters"]["questionnaireIDInPath"];
      };
    };
    responses: {
      /** @description 正常に取得できました。 */
      200: {
        content: {
          "application/json": components["schemas"]["QuestionnaireIsRemindEnabled"];
        };
      };
      /** @description アンケートのIDが無効です */
      400: {
        content: never;
      };
      /** @description アンケートが存在しません */
      404: {
        content: never;
      };
      /** @description リマインド設定を正常に取得できませんでした */
      500: {
        content: never;
      };
    };
  };
  /** @description 自分に対するリマインドが有効かどうかを変更します。 */
  editQuestionnaireMyRemindStatus: {
    parameters: {
      path: {
        questionnaireID: components["parameters"]["questionnaireIDInPath"];
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["QuestionnaireIsRemindEnabled"];
      };
    };
    responses: {
      /** @description 正常に変更できました。 */
      200: {
        content: never;
      };
      /** @description アンケートのIDが無効です */
      400: {
        content: never;
      };
      /** @description アンケートが存在しません */
      404: {
        content: never;
      };
      /** @description リマインド設定を正常に変更できませんでした */
      500: {
        content: never;
      };
    };
  };
  /** @description アンケートの全ての回答を取得します。アンケートが匿名回答の場合、取得できません。 */
  getQuestionnaireResponses: {
    parameters: {
      query?: {
        sort?: components["parameters"]["responseSortInQuery"];
        onlyMyResponse?: components["parameters"]["onlyMyResponseInQuery"];
      };
      path: {
        questionnaireID: components["parameters"]["questionnaireIDInPath"];
      };
    };
    responses: {
      /** @description 正常に取得できました。 */
      200: {
        content: {
          "application/json": components["schemas"]["Responses"];
        };
      };
      /** @description アンケートのIDが無効です */
      400: {
        content: never;
      };
      /** @description アンケートが匿名回答のため回答を取得できません */
      403: {
        content: never;
      };
      /** @description アンケートが存在しません */
      404: {
        content: never;
      };
      /** @description 回答を正常に取得できませんでした */
      500: {
        content: never;
      };
    };
  };
  /** @description 新しい回答を作成します。アンケートが複数回答可能でない場合、過去の回答が削除されます。 */
  postQuestionnaireResponse: {
    parameters: {
      path: {
        questionnaireID: components["parameters"]["questionnaireIDInPath"];
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["NewResponse"];
      };
    };
    responses: {
      /** @description 正常に回答を作成できました。作成された回答を返します。 */
      201: {
        content: {
          "application/json": components["schemas"]["Response"];
        };
      };
      /** @description 与えられた情報の形式が異なります */
      400: {
        content: never;
      };
      /** @description アンケートが存在しません */
      404: {
        content: never;
      };
      /** @description 回答期限が過ぎたため回答できません */
      422: {
        content: never;
      };
      /** @description 正常に回答が作成できませんでした */
      500: {
        content: never;
      };
    };
  };
  /** @description アンケートの回答を集計した結果を取得します。回答者の情報は含まれず、アンケートが匿名回答であっても取得できます。 */
  getQuestionnaireResult: {
    parameters: {
      path: {
        questionnaireID: components["parameters"]["questionnaireIDInPath"];
      };
    };
    responses: {
      /** @description 正常に取得できました。 */
      200: {
        content: {
          "application/json": components["schemas"]["Result"];
        };
      };
      /** @description アンケートのIDが無効です */
      400: {
        content: never;
      };
      /** @description 結果を閲覧する権限がありません。 */
      403: {
        content: never;
      };
      /** @description アンケートが存在しません */
      404: {
        content: never;
      };
      /** @description アンケートの結果を正常に取得できませんでした */
      500: {
        content: never;
      };
    };
  };
  /** @description 回答を取得します。 */
  getResponse: {
    parameters: {
      path: {
        responseID: components["parameters"]["responseIDInPath"];
      };
    };
    responses: {
      /** @description 正常に取得できました。 */
      200: {
        content: {
          "application/json": components["schemas"]["Response"];
        };
      };
      /** @description responseIDが無効です */
      400: {
        content: never;
      };
      /** @description 回答を閲覧する権限がありません。 */
      403: {
        content: never;
      };
      /** @description 回答が存在しません */
      404: {
        content: never;
      };
      /** @description 回答を正常に取得できませんでした */
      500: {
        content: never;
      };
    };
  };
  /** @description 回答を削除します */
  deleteResponse: {
    parameters: {
      path: {
        responseID: components["parameters"]["responseIDInPath"];
      };
    };
    responses: {
      /** @description 正常に回答を削除できました */
      200: {
        content: never;
      };
      /** @description 与えられた回答の情報が異なります */
      400: {
        content: never;
      };
      /** @description 回答を削除する権限がありません。 */
      403: {
        content: never;
      };
      /** @description アンケートの回答の期限がきれたため回答が存在しません */
      404: {
        content: never;
      };
      /** @description 回答期限が過ぎたため回答を削除できません */
      405: {
        content: never;
      };
      /** @description responseIDを取得できませんでした */
      500: {
        content: never;
      };
    };
  };
  /** @description 回答を変更します。 */
  editResponse: {
    parameters: {
      path: {
        responseID: components["parameters"]["responseIDInPath"];
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["Response"];
      };
    };
    responses: {
      /** @description 正常に回答を変更できました */
      200: {
        content: never;
      };
      /** @description 与えられた回答の情報が異なります */
      400: {
        content: never;
      };
      /** @description 回答を変更する権限がありません */
      403: {
        content: never;
      };
      /** @description アンケートの回答の期限がきれたため回答が存在しません */
      404: {
        content: never;
      };
      /** @description 回答期限が過ぎたため回答できません */
      405: {
        content: never;
      };
      /** @description responseIDを取得できませんでした */
      500: {
        content: never;
      };
    };
  };
  /** @description 自分のすべての回答のリストを取得します。 */
  getMyResponses: {
    parameters: {
      query?: {
        sort?: components["parameters"]["responseSortInQuery"];
      };
    };
    responses: {
      /** @description 正常に取得できました。回答の配列を返します。 */
      200: {
        content: {
          "application/json": components["schemas"]["Responses"][];
        };
      };
      /** @description 自分の回答のリストを取得できませんでした */
      500: {
        content: never;
      };
    };
  };
}

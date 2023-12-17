import type { Router } from 'vue-router';
import { useStoreNewQuestionnaireForm } from '~/components/new-questionnaire-form/store';
import type {
  QuestionSettings,
  QuestionSettingsBase,
} from '~/components/new-questionnaire-form/type';
import type {
  components,
  paths,
} from '~/composables/type-fetch/anke-to/openapi';
import type { QuestionnaireDetail } from './type';

type ActionRespondBody =
  paths['/questionnaires/{questionnaireID}/myRemindStatus']['patch']['requestBody']['content']['application/json'];
export const actionRespondLater = async (questionnaireId: number) => {
  const body: ActionRespondBody = {
    is_remind_enabled: true,
  };
  const res = await fetch(
    `/api/questionnaires/${questionnaireId}/myRemindStatus`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  );

  return res.ok;
};

type ActionNotRespondBody =
  paths['/questionnaires/{questionnaireID}/myRemindStatus']['patch']['requestBody']['content']['application/json'];
export const actionNotRespond = async (questionnaireId: number) => {
  const body: ActionNotRespondBody = {
    is_remind_enabled: false,
  };
  const res = await fetch(
    `/api/questionnaires/${questionnaireId}/myRemindStatus`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  );

  return res.ok;
};

export const actionDelete = async (questionnaireId: number) => {
  const res = await fetch(`/api/questionnaires/${questionnaireId}`, {
    method: 'DELETE',
  });

  return res.ok;
};

type ActionCloseBody =
  paths['/questionnaires/{questionnaireID}']['patch']['requestBody']['content']['application/json'];
export const actionClose = async (detail: QuestionnaireDetail) => {
  const body: ActionCloseBody = {
    ...detail,
    response_due_date_time: toISOStringWithTZ(new Date()),
  };
  const res = await fetch(`/api/questionnaires/${detail.questionnaire_id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return res.ok;
};

const convertQuestion = (
  question: components['schemas']['NewQuestion'],
): QuestionSettings => {
  const convertedBase: QuestionSettingsBase = {
    id: createId(),
    title: question.title,
    description: question.description,
    required: question.is_required,
  };

  if (question.question_type === 'Text') {
    return {
      ...convertedBase,
      type: 'Text',
    };
  }

  if (question.question_type === 'TextLong') {
    return {
      ...convertedBase,
      type: 'TextLong',
    };
  }

  if (question.question_type === 'Number') {
    return {
      ...convertedBase,
      type: 'Number',
    };
  }

  if (question.question_type === 'SingleChoice') {
    return {
      ...convertedBase,
      type: 'SingleChoice',
      options: question.options.map((o) => ({
        id: createId(),
        label: o,
      })),
    };
  }

  if (question.question_type === 'MultipleChoice') {
    return {
      ...convertedBase,
      type: 'MultipleChoice',
      options: question.options.map((o) => ({
        id: createId(),
        label: o,
      })),
    };
  }

  if (question.question_type === 'Scale') {
    return {
      ...convertedBase,
      type: 'Scale',
      minLabel: question.min_label,
      minValue: question.min_value,
      maxLabel: question.max_label,
      maxValue: question.max_value,
    };
  }

  const _: never = question;
  throw new Error('Unknown question type');
};

export const actionDuplicate = async (
  detail: QuestionnaireDetail,
  router: Router,
) => {
  const { state } = useStoreNewQuestionnaireForm();
  state.title = detail.title;
  state.description = detail.description;
  state.responseDueDateTime = detail.response_due_date_time ?? null;
  state.admins = detail.admins;
  state.questions = detail.questions.map(convertQuestion);
  state.targets = detail.targets;
  state.isAnonymous = detail.is_anonymous;
  state.isAllowingMultipleResponses = detail.is_allowing_multiple_responses;
  state.responseViewableBy = detail.response_viewable_by;

  await router.push('/questionnaires/new');
};

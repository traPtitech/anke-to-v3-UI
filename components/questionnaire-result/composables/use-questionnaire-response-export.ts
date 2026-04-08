import type { GatewayQuestionnaire } from '~/models/questionnaire';
import type { GatewayResponse } from '~/models/response';

type ExportFormat = 'json' | 'csv' | 'md';

const sanitizeFileName = (value: string): string => {
  return value
    .trim()
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, '-');
};

const escapeCsvCell = (value: unknown): string => {
  const text = value === undefined ? '' : String(value);
  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return `"${text.replaceAll('"', '""')}"`;
  }

  return text;
};

const normalizeAnswer = (value: unknown): string => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).join(' / ');
  }

  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
};

const buildAnswerMap = (response: GatewayResponse): Map<number, unknown> => {
  return new Map(
    response.body.map((answer) => [answer.question_id, answer.answer]),
  );
};

const toJson = (
  questionnaire: GatewayQuestionnaire,
  responses: GatewayResponse[],
): string => {
  const payload = {
    questionnaire: {
      questionnaire_id: questionnaire.questionnaire_id,
      title: questionnaire.title,
      is_anonymous: questionnaire.is_anonymous,
      is_published: questionnaire.is_published,
      response_due_date_time: questionnaire.response_due_date_time,
      question_count: questionnaire.questions.length,
    },
    exported_at: new Date().toISOString(),
    responses: responses.map((response) => ({
      response_id: response.response_id,
      respondent: response.respondent,
      submitted_at: response.submitted_at,
      is_draft: response.is_draft,
      answers: response.body,
    })),
  };

  return JSON.stringify(payload, null, 2);
};

const toCsv = (
  questionnaire: GatewayQuestionnaire,
  responses: GatewayResponse[],
): string => {
  const questionColumns = questionnaire.questions.map(
    (question) => `${question.question_id}:${question.title}`,
  );
  const header = [
    'response_id',
    'respondent',
    'submitted_at',
    'is_draft',
    ...questionColumns,
  ];

  const rows = responses.map((response) => {
    const answerMap = buildAnswerMap(response);

    const questionCells = questionnaire.questions.map((question) => {
      if (question.question_id === undefined) {
        return '';
      }

      return normalizeAnswer(answerMap.get(question.question_id));
    });

    return [
      String(response.response_id),
      response.respondent,
      response.submitted_at,
      response.is_draft ? 'true' : 'false',
      ...questionCells,
    ];
  });

  return [header, ...rows]
    .map((row) => row.map(escapeCsvCell).join(','))
    .join('\n');
};

const toMarkdown = (
  questionnaire: GatewayQuestionnaire,
  responses: GatewayResponse[],
): string => {
  const lines: string[] = [
    `# ${questionnaire.title} 回答一覧`,
    '',
    `- アンケートID: ${questionnaire.questionnaire_id}`,
    `- 回答数: ${responses.length}`,
    `- 出力日時: ${new Date().toISOString()}`,
    '',
  ];

  responses.forEach((response, index) => {
    const answerMap = buildAnswerMap(response);
    lines.push(`## ${index + 1}. 回答ID ${response.response_id}`);
    lines.push(`- 回答者: ${response.respondent}`);
    lines.push(`- 提出日時: ${response.submitted_at}`);
    lines.push(`- 下書き: ${response.is_draft ? 'はい' : 'いいえ'}`);
    lines.push('');
    lines.push('### 回答内容');

    questionnaire.questions.forEach((question) => {
      const answer =
        question.question_id === undefined
          ? ''
          : normalizeAnswer(answerMap.get(question.question_id));

      lines.push(
        `- Q${question.question_id ?? '-'} ${question.title}: ${answer}`,
      );
    });

    lines.push('');
  });

  return lines.join('\n');
};

const getMimeType = (format: ExportFormat): string => {
  if (format === 'json') {
    return 'application/json;charset=utf-8';
  }

  if (format === 'csv') {
    return 'text/csv;charset=utf-8';
  }

  return 'text/markdown;charset=utf-8';
};

const createExportText = (
  format: ExportFormat,
  questionnaire: GatewayQuestionnaire,
  responses: GatewayResponse[],
): string => {
  if (format === 'json') {
    return toJson(questionnaire, responses);
  }

  if (format === 'csv') {
    return toCsv(questionnaire, responses);
  }

  return toMarkdown(questionnaire, responses);
};

const downloadTextFile = ({
  text,
  fileName,
  mimeType,
}: {
  text: string;
  fileName: string;
  mimeType: string;
}) => {
  const blob = new Blob([text], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
};

export const useQuestionnaireResponseExport = ({
  questionnaire,
  responses,
}: {
  questionnaire: MaybeRefOrGetter<GatewayQuestionnaire>;
  responses: MaybeRefOrGetter<GatewayResponse[]>;
}) => {
  const fileNameBase = computed(() => {
    const value = toValue(questionnaire);
    return sanitizeFileName(
      `questionnaire-${value.questionnaire_id}-${value.title}-responses`,
    );
  });

  const exportResponses = (format: ExportFormat) => {
    const q = toValue(questionnaire);
    const r = toValue(responses);
    const text = createExportText(format, q, r);

    downloadTextFile({
      text,
      fileName: `${fileNameBase.value}.${format}`,
      mimeType: getMimeType(format),
    });
  };

  return {
    exportResponses,
  };
};

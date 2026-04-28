import type { GatewayQuestionnaire } from '~/models/questionnaire';
import type { GatewayResponse } from '~/models/response';
import type { GatewayQuestion } from '~/models/question';

export type ExportFormat = 'json' | 'csv' | 'md';
export type ExportTarget = 'summary' | 'responses';

type ExportOption = {
  format: ExportFormat;
  target: ExportTarget;
};

type SummaryChoiceItem = {
  question_id?: number;
  title: string;
  question_type: 'SingleChoice' | 'MultipleChoice';
  response_count: number;
  option_counts: Record<string, number>;
};

type SummaryNumberItem = {
  question_id?: number;
  title: string;
  question_type: 'Number' | 'Scale';
  response_count: number;
  min: number | null;
  max: number | null;
  average: number | null;
};

type SummaryTextItem = {
  question_id?: number;
  title: string;
  question_type: 'Text' | 'TextLong';
  response_count: number;
  samples: string[];
};

type SummaryQuestionItem = SummaryChoiceItem | SummaryNumberItem | SummaryTextItem;

const isChoiceSummary = (item: SummaryQuestionItem): item is SummaryChoiceItem => {
  return item.question_type === 'SingleChoice' || item.question_type === 'MultipleChoice';
};

const isNumberSummary = (item: SummaryQuestionItem): item is SummaryNumberItem => {
  return item.question_type === 'Number' || item.question_type === 'Scale';
};

const isTextSummary = (item: SummaryQuestionItem): item is SummaryTextItem => {
  return item.question_type === 'Text' || item.question_type === 'TextLong';
};

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

const escapeMarkdownCell = (value: unknown): string => {
  return String(value ?? '')
    .replaceAll('|', '\\|')
    .replaceAll('\n', '<br>');
};

const toMarkdownTable = (headers: string[], rows: string[][]): string => {
  const headerRow = `| ${headers.map(escapeMarkdownCell).join(' | ')} |`;
  const separatorRow = `| ${headers.map(() => '---').join(' | ')} |`;
  const dataRows = rows.map((row) => `| ${row.map((cell) => escapeMarkdownCell(cell)).join(' | ')} |`);

  return [headerRow, separatorRow, ...dataRows].join('\n');
};

const buildQuestionAnswerEntries = (
  question: GatewayQuestion,
  responses: GatewayResponse[],
): { answer: string; respondent: string }[] => {
  const questionId = question.question_id;
  if (questionId === undefined) {
    return [];
  }

  const entries: { answer: string; respondent: string }[] = [];

  responses
    .filter((response) => !response.is_draft)
    .forEach((response) => {
      const answerMap = buildAnswerMap(response);
      const rawAnswer = answerMap.get(questionId);
      if (rawAnswer === undefined) {
        return;
      }

      const respondent = String(response.respondent ?? '');

      if (Array.isArray(rawAnswer)) {
        rawAnswer.forEach((value) => {
          entries.push({
            answer: normalizeAnswer(value),
            respondent,
          });
        });
        return;
      }

      entries.push({
        answer: normalizeAnswer(rawAnswer),
        respondent,
      });
    });

  return entries;
};

const formatRate = (count: number, total: number): string => {
  if (total <= 0) {
    return '0.00%';
  }

  return `${((count / total) * 100).toFixed(2)}%`;
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
  return new Map(response.body.map((answer) => [answer.question_id, answer.answer]));
};

const getAnswerList = (question: GatewayQuestion, responses: GatewayResponse[]): unknown[] => {
  const questionId = question.question_id;
  if (questionId === undefined) {
    return [];
  }

  return responses
    .filter((response) => !response.is_draft)
    .map((response) => {
      const answerMap = buildAnswerMap(response);
      return answerMap.get(questionId);
    })
    .filter((answer) => answer !== undefined);
};

const getSummaryQuestionItem = (question: GatewayQuestion, responses: GatewayResponse[]): SummaryQuestionItem => {
  const answers = getAnswerList(question, responses);

  if (question.question_type === 'SingleChoice' || question.question_type === 'MultipleChoice') {
    const optionCounts = new Map<string, number>();

    answers.forEach((answer) => {
      if (Array.isArray(answer)) {
        answer.forEach((value) => {
          const key = String(value);
          optionCounts.set(key, (optionCounts.get(key) ?? 0) + 1);
        });
        return;
      }

      const key = String(answer);
      optionCounts.set(key, (optionCounts.get(key) ?? 0) + 1);
    });

    return {
      question_id: question.question_id,
      title: question.title,
      question_type: question.question_type,
      response_count: answers.length,
      option_counts: Object.fromEntries(optionCounts),
    };
  }

  if (question.question_type === 'Number' || question.question_type === 'Scale') {
    const numbers = answers.map((answer) => Number(answer)).filter((value) => Number.isFinite(value));

    const sum = numbers.reduce((acc, value) => acc + value, 0);
    const avg = numbers.length > 0 ? sum / numbers.length : null;

    return {
      question_id: question.question_id,
      title: question.title,
      question_type: question.question_type,
      response_count: numbers.length,
      min: numbers.length > 0 ? Math.min(...numbers) : null,
      max: numbers.length > 0 ? Math.max(...numbers) : null,
      average: avg,
    };
  }

  return {
    question_id: question.question_id,
    title: question.title,
    question_type: question.question_type,
    response_count: answers.length,
    samples: answers.map((answer) => normalizeAnswer(answer)),
  };
};

const toSummaryJson = (questionnaire: GatewayQuestionnaire, responses: GatewayResponse[]): string => {
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
    summary: {
      response_count: responses.filter((response) => !response.is_draft).length,
      questions: questionnaire.questions.map((question) => getSummaryQuestionItem(question, responses)),
    },
  };

  return JSON.stringify(payload, null, 2);
};

const toSummaryMarkdown = (questionnaire: GatewayQuestionnaire, responses: GatewayResponse[]): string => {
  const totalResponses = responses.filter((response) => !response.is_draft).length;
  const lines: string[] = [`# ${questionnaire.title} 集計結果`];

  questionnaire.questions.forEach((question) => {
    const entries = buildQuestionAnswerEntries(question, responses);
    const answerMap = new Map<string, { count: number; respondents: string[] }>();

    entries.forEach((entry) => {
      const current = answerMap.get(entry.answer) ?? {
        count: 0,
        respondents: [],
      };
      current.count += 1;
      current.respondents.push(entry.respondent);
      answerMap.set(entry.answer, current);
    });

    const sortedRows = [...answerMap.entries()]
      .sort((a, b) => {
        const diff = b[1].count - a[1].count;
        if (diff !== 0) {
          return diff;
        }

        return a[0].localeCompare(b[0]);
      })
      .map(([answer, value]) => {
        const base = [answer, String(value.count), value.respondents.join(', ')];

        if (question.question_type === 'Text' || question.question_type === 'TextLong') {
          return base;
        }

        return [answer, String(value.count), formatRate(value.count, totalResponses), value.respondents.join(', ')];
      });

    const isTextQuestion = question.question_type === 'Text' || question.question_type === 'TextLong';

    const headers = isTextQuestion
      ? ['回答', '回答数', 'その回答をした人']
      : ['回答', '回答数', '選択率', 'その回答をした人'];

    const rows =
      sortedRows.length > 0 ? sortedRows : [isTextQuestion ? ['回答なし', '0', '-'] : ['回答なし', '0', '0.00%', '-']];

    lines.push('');
    lines.push(`# ${question.title}`);
    lines.push(toMarkdownTable(headers, rows));
  });

  return lines.join('\n');
};

const buildSummaryRows = (questionnaire: GatewayQuestionnaire, responses: GatewayResponse[]): string[][] => {
  const rows: string[][] = [];

  questionnaire.questions.forEach((question) => {
    const summary = getSummaryQuestionItem(question, responses);

    if (isChoiceSummary(summary)) {
      Object.entries(summary.option_counts).forEach(([option, count]) => {
        rows.push([
          String(summary.question_id ?? ''),
          summary.title,
          summary.question_type,
          String(summary.response_count),
          `option:${option}`,
          String(count),
        ]);
      });
      return;
    }

    if (isNumberSummary(summary)) {
      rows.push([
        String(summary.question_id ?? ''),
        summary.title,
        summary.question_type,
        String(summary.response_count),
        'min',
        String(summary.min ?? ''),
      ]);
      rows.push([
        String(summary.question_id ?? ''),
        summary.title,
        summary.question_type,
        String(summary.response_count),
        'max',
        String(summary.max ?? ''),
      ]);
      rows.push([
        String(summary.question_id ?? ''),
        summary.title,
        summary.question_type,
        String(summary.response_count),
        'average',
        summary.average === null ? '' : summary.average.toFixed(2),
      ]);
      return;
    }

    if (isTextSummary(summary)) {
      rows.push([
        String(summary.question_id ?? ''),
        summary.title,
        summary.question_type,
        String(summary.response_count),
        'samples',
        summary.samples.join(' | '),
      ]);
    }
  });

  return rows;
};

const toSummaryCsv = (questionnaire: GatewayQuestionnaire, responses: GatewayResponse[]): string => {
  const header = ['question_id', 'title', 'question_type', 'response_count', 'metric_key', 'metric_value'];
  const rows = buildSummaryRows(questionnaire, responses);

  return [header, ...rows].map((row) => row.map(escapeCsvCell).join(',')).join('\n');
};

const buildResponsesTable = (
  questionnaire: GatewayQuestionnaire,
  responses: GatewayResponse[],
): {
  header: string[];
  rows: string[][];
} => {
  const questionColumns = questionnaire.questions.map((question) => `${question.question_id}:${question.title}`);
  const header = ['response_id', 'respondent', 'submitted_at', 'is_draft', ...questionColumns];

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
      String(response.respondent ?? ''),
      String(response.submitted_at ?? ''),
      response.is_draft ? 'true' : 'false',
      ...questionCells,
    ];
  });

  return { header, rows };
};

const toResponsesJson = (questionnaire: GatewayQuestionnaire, responses: GatewayResponse[]): string => {
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

const toResponsesCsv = (questionnaire: GatewayQuestionnaire, responses: GatewayResponse[]): string => {
  const { header, rows } = buildResponsesTable(questionnaire, responses);

  return [header, ...rows].map((row) => row.map(escapeCsvCell).join(',')).join('\n');
};

const toResponsesMarkdown = (questionnaire: GatewayQuestionnaire, responses: GatewayResponse[]): string => {
  const { header, rows } = buildResponsesTable(questionnaire, responses);

  const lines: string[] = [
    `# ${questionnaire.title} 回答一覧`,
    '',
    `- アンケートID: ${questionnaire.questionnaire_id}`,
    `- 回答数: ${responses.length}`,
    `- 出力日時: ${new Date().toISOString()}`,
    '',
    toMarkdownTable(header, rows),
  ];

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
  { format, target }: ExportOption,
  questionnaire: GatewayQuestionnaire,
  responses: GatewayResponse[],
): string => {
  if (target === 'summary') {
    if (format === 'json') {
      return toSummaryJson(questionnaire, responses);
    }

    if (format === 'csv') {
      return toSummaryCsv(questionnaire, responses);
    }

    return toSummaryMarkdown(questionnaire, responses);
  }

  if (format === 'json') {
    return toResponsesJson(questionnaire, responses);
  }

  if (format === 'csv') {
    return toResponsesCsv(questionnaire, responses);
  }

  return toResponsesMarkdown(questionnaire, responses);
};

const downloadTextFile = ({ text, fileName, mimeType }: { text: string; fileName: string; mimeType: string }) => {
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
    return sanitizeFileName(`questionnaire-${value.questionnaire_id}-${value.title}-responses`);
  });

  const createPreviewText = (option: ExportOption): string => {
    const q = toValue(questionnaire);
    const r = toValue(responses);

    return createExportText(option, q, r);
  };

  const downloadExportText = (option: ExportOption) => {
    const text = createPreviewText(option);

    downloadTextFile({
      text,
      fileName: `${fileNameBase.value}-${option.target}.${option.format}`,
      mimeType: getMimeType(option.format),
    });
  };

  return {
    createPreviewText,
    downloadExportText,
  };
};

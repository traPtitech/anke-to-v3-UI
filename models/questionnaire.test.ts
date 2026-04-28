import { describe, expect, it } from 'vitest';
import type { GatewayQuestionnaireSummary, GatewayResponseShareType } from './questionnaire';
import { canViewResults } from './questionnaire';

type CanViewInput = Pick<
  GatewayQuestionnaireSummary,
  'is_published' | 'response_viewable_by' | 'is_administrated_by_me' | 'has_my_response'
>;

const buildCanViewInput = (overrides: Partial<CanViewInput> = {}): CanViewInput => ({
  is_published: true,
  response_viewable_by: 'admins',
  is_administrated_by_me: false,
  has_my_response: false,
  ...overrides,
});

const scopes: GatewayResponseShareType[] = ['anyone', 'respondents', 'admins'];

const privilegeCases = [
  {
    label: 'non-admin and non-respondent',
    is_administrated_by_me: false,
    has_my_response: false,
    expected: {
      published: {
        anyone: true,
        respondents: false,
        admins: false,
      },
      unpublished: {
        anyone: false,
        respondents: false,
        admins: false,
      },
    },
  },
  {
    label: 'non-admin and respondent',
    is_administrated_by_me: false,
    has_my_response: true,
    expected: {
      published: {
        anyone: true,
        respondents: true,
        admins: false,
      },
      unpublished: {
        anyone: false,
        respondents: false,
        admins: false,
      },
    },
  },
  {
    label: 'admin and non-respondent',
    is_administrated_by_me: true,
    has_my_response: false,
    expected: {
      published: {
        anyone: true,
        respondents: true,
        admins: true,
      },
      unpublished: {
        anyone: false,
        respondents: false,
        admins: false,
      },
    },
  },
  {
    label: 'admin and respondent',
    is_administrated_by_me: true,
    has_my_response: true,
    expected: {
      published: {
        anyone: true,
        respondents: true,
        admins: true,
      },
      unpublished: {
        anyone: false,
        respondents: false,
        admins: false,
      },
    },
  },
] as const;

const publicationCases = [
  { label: 'published', is_published: true },
  { label: 'unpublished', is_published: false },
] as const;

describe('canViewResults', () => {
  for (const publicationCase of publicationCases) {
    for (const scope of scopes) {
      for (const privilegeCase of privilegeCases) {
        it(`returns expected permission for ${publicationCase.label}, ${scope} with ${privilegeCase.label}`, () => {
          const input = buildCanViewInput({
            is_published: publicationCase.is_published,
            response_viewable_by: scope,
            is_administrated_by_me: privilegeCase.is_administrated_by_me,
            has_my_response: privilegeCase.has_my_response,
          });

          const expected = privilegeCase.expected[publicationCase.label][scope];

          expect(canViewResults(input)).toBe(expected);
        });
      }
    }
  }
});

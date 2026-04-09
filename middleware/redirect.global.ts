import { buildTabFilterQuery } from '~/components/explorer/filter-query';
import {
  explorerQueryKeys,
  questionnaireDetailQueryKeys,
  questionnaireDetailTabValues,
} from '~/composables/explorer/query-params';

const legacyExplorerRedirectFilterByPath: Record<string, string | undefined> = {
  '/administrates': buildTabFilterQuery('administered'),
  '/responses': buildTabFilterQuery('answered'),
};

// v1 からパスが変わった部分などをリダイレクトで対応する
export default defineNuxtRouteMiddleware((to, _from) => {
  // before: /
  // after: /explorer
  if (to.path === '/') {
    return { path: '/explorer', query: to.query };
  }

  const legacyExplorerFilter = legacyExplorerRedirectFilterByPath[to.path];
  if (legacyExplorerFilter !== undefined) {
    return {
      path: '/explorer',
      query: {
        ...to.query,
        [explorerQueryKeys.filter]: legacyExplorerFilter,
      },
    };
  }

  {
    // before: /questionnaires/:id?tab=questions
    // after: /questionnaires/:id/questions
    const match = to.path.match(/\/questionnaires\/(\d+)/);
    if (
      match !== null &&
      to.query[questionnaireDetailQueryKeys.tab] ===
        questionnaireDetailTabValues.questions
    ) {
      return {
        path: `${to.path}/questions`,
        query: {
          ...to.query,
          [questionnaireDetailQueryKeys.tab]: undefined,
        },
      };
    }
  }

  {
    // before: /questionnaires/results/:id
    // after: /questionnaires/:id/result
    const match = to.path.match(/\/questionnaires\/results\/(\d+)/);
    if (match !== null) {
      return {
        path: `/questionnaires/${match[1]}/result`,
        query: to.query,
      };
    }
  }

  {
    // before: /responses/new/:id
    // after: /questionnaires/:id/responses/new
    const match = to.path.match(/\/responses\/new\/(\d+)/);
    if (match !== null) {
      return {
        path: `/questionnaires/${match[1]}/responses/new`,
        query: to.query,
      };
    }
  }
});

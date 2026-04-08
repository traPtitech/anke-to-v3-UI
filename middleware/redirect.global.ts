export default defineNuxtRouteMiddleware((to, _from) => {
  // before: /
  // after: /explorer
  if (to.path === '/') {
    return { path: '/explorer', query: to.query };
  }

  // before: /administrates
  // after: /explorer?filter=administered
  if (to.path === '/administrates') {
    return {
      path: '/explorer',
      query: { ...to.query, filter: 'administered' },
    };
  }

  // before: /responses
  // after: /explorer?filter=answered
  if (to.path === '/responses') {
    return {
      path: '/explorer',
      query: { ...to.query, filter: 'answered' },
    };
  }

  {
    // before: /questionnaires/:id?tab=questions
    // after: /questionnaires/:id/questions
    const match = to.path.match(/\/questionnaires\/(\d+)/);
    if (match !== null && to.query.tab === 'questions') {
      return {
        path: `${to.path}/questions`,
        query: { ...to.query, tab: undefined },
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
});

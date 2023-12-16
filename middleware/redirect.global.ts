export default defineNuxtRouteMiddleware((to, _from) => {
  const match = to.path.match(/\/questionnaires\/results\/(\d+)/);
  if (match !== null) {
    return {
      path: `/questionnaires/${match[1]}/result`,
      query: to.query,
    };
  }
});

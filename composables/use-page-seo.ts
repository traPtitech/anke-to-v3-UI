type UsePageSeoParams = {
  title: MaybeRefOrGetter<string>;
  description: MaybeRefOrGetter<string>;
};

const APP_NAME = 'anke-to';

export const usePageSeo = ({ title, description }: UsePageSeoParams) => {
  const resolvedTitle = computed(() => {
    const base = toValue(title).trim();
    return base.length > 0 ? `${base} | ${APP_NAME}` : APP_NAME;
  });
  const resolvedDescription = computed(() => toValue(description).trim());

  useSeoMeta({
    title: resolvedTitle,
    description: resolvedDescription,
    ogTitle: resolvedTitle,
    ogDescription: resolvedDescription,
    twitterCard: 'summary',
  });
};

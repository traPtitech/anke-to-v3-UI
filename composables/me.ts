import { useFetchTraqApi } from '~/composables/type-fetch/traq/use-fetch-traq-api';

export const useMe = () => {
  const { data: me } = useFetchTraqApi('/users/me');
  return me;
};

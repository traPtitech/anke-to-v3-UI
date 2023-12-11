const userIconCache = new Map<string, string>();

export const getUserIcon = (userId: string) => async (): Promise<string> => {
  if (userIconCache.has(userId)) {
    return userIconCache.get(userId)!;
  }

  const { state } = useTraqAuthStore();

  const url = `https://q.trap.jp/api/v3/users/${userId}/icon`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${state.accessToken}`,
    },
  });
  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);
  userIconCache.set(userId, blobUrl);
  return blobUrl;
};

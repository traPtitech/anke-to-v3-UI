export const getUserAvatarUrl = (username: string): string =>
  `https://image-proxy.trap.jp/icon/${username}?width=48&height=48&format=webp`;

export const getStampImageUrl = (stampId: string): string =>
  `https://image-proxy.trap.jp/stamp/${stampId}?width=48&height=48&format=webp`;

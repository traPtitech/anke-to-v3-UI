import { type Store, traQMarkdownIt } from "@traptitech/traq-markdown-it";
import {
  useChannels,
  useGroups,
  useMe,
  useStamps,
  useUsers,
} from "~/composables/type-fetch/traq/client";
import type { components } from "~/composables/type-fetch/traq/openapi";

type User = components["schemas"]["User"];
type Stamp = components["schemas"]["Stamp"];

const createMarkdownRenderer = () => {
  const { data: me } = useMe();
  const { data: users } = useUsers();
  const { data: channels } = useChannels();
  const { data: groups } = useGroups();
  const { data: stamps } = useStamps();

  const initialized = computed(
    () =>
      me.value !== undefined &&
      users.value !== undefined &&
      channels.value !== undefined &&
      groups.value !== undefined &&
      stamps.value !== undefined,
  );

  const userIconFileIdMap = computed(() => {
    const map = new Map<string, User>();
    for (const user of users.value ?? []) {
      map.set(user.iconFileId, user);
    }
    return map;
  });

  const stampFileIdMap = computed(() => {
    const map = new Map<string, Stamp>();
    for (const stamp of stamps.value ?? []) {
      map.set(stamp.fileId, stamp);
    }
    return map;
  });

  const store: Store = {
    getUser: (userId) => users.value?.find((u) => u.id === userId),
    getChannel: (channelId: string) =>
      channels.value?.public.find((c) => c.id === channelId),
    getUserGroup: (groupId: string) =>
      groups.value?.find((g) => g.id === groupId),
    getMe: () => me.value ?? undefined,
    getStampByName: (name: string) =>
      stamps.value?.find((s) => s.name === name),
    getUserByName: (name: string) => users.value?.find((u) => u.name === name),
    generateUserHref: (userId: string) => `https://q.trap.jp/user/${userId}`,
    generateUserGroupHref: (groupId: string) =>
      `https://q.trap.jp/group/${groupId}`,
    generateChannelHref: (channelId: string) =>
      `https://q.trap.jp/channel/${channelId}`,
    generateStampHref: (fileId: string) => {
      const user = userIconFileIdMap.value?.get(fileId);
      if (user) {
        return `https://image-proxy.trap.jp/icon/${user.name}?width=48&height=48&format=webp`;
      }
      const stamp = stampFileIdMap.value?.get(fileId);
      if (stamp) {
        return `https://image-proxy.trap.jp/stamp/${stamp.id}?width=48&height=48&format=webp`;
      }
      return `https://q.trap.jp/api/v3/files/${fileId}`;
    },
  };

  const markdownIt = new traQMarkdownIt(store, undefined, "https://q.trap.jp");

  const renderToHtml = (content: string) => {
    return markdownIt.render(content).renderedText;
  };

  return {
    initialized,
    renderToHtml,
  };
};

export const provideMarkdownRenderer = () => {
  const renderer = createMarkdownRenderer();
  provide("markdownRenderer", renderer);
  return renderer;
};

export const useMarkdownRenderer = () => {
  const renderer = inject<ReturnType<typeof createMarkdownRenderer>>(
    "markdownRenderer",
  );
  if (!renderer) {
    throw new Error("Markdown renderer is not provided");
  }
  return renderer;
};

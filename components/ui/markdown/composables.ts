import { type Store, traQMarkdownIt } from "@traptitech/traq-markdown-it";
import {
  useChannels,
  useGroups,
  useMe,
  useStamps,
  useUsers,
} from "~/composables/type-fetch/anke-to/client";

type User = {
  id: string;
  name: string;
  iconFileId: string;
};
type Stamp = {
  id: string;
  name: string;
  fileId: string;
};

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

  const traqUsers = computed<User[]>(() => {
    return users.value?.map((u) => ({
      id: u.id,
      name: u.name,
      iconFileId: u.icon_file_id,
    })) ?? [];
  });

  const traqStamps = computed<Stamp[]>(() => {
    return stamps.value?.map((s) => ({
      id: s.id,
      name: s.name,
      fileId: s.file_id,
    })) ?? [];
  });

  const userIconFileIdMap = computed(() => {
    const map = new Map<string, User>();
    for (const user of traqUsers.value ?? []) {
      map.set(user.iconFileId, user);
    }
    return map;
  });

  const stampFileIdMap = computed(() => {
    const map = new Map<string, Stamp>();
    for (const stamp of traqStamps.value ?? []) {
      map.set(stamp.fileId, stamp);
    }
    return map;
  });

  const store: Store = {
    getUser: (userId) => traqUsers.value?.find((u) => u.id === userId),
    getChannel: (channelId: string) =>
      channels.value?.find((c) => c.id === channelId),
    getUserGroup: (groupId: string) =>
      groups.value?.find((g) => g.id === groupId),
    getMe: () => me.value ?? undefined,
    getStampByName: (name: string) =>
      traqStamps.value?.find((s) => s.name === name),
    getUserByName: (name: string) =>
      traqUsers.value?.find((u) => u.name === name),
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

import { http, HttpResponse } from "msw";
import type { paths } from "~/composables/type-fetch/anke-to/openapi";
import { myUserId } from "~/mocks/handlers/util";

type GetTraqUsersResponse =
  paths["/traq/users"]["get"]["responses"]["200"]["content"][
    "application/json"
  ];

type GetTraqUsersMeResponse =
  paths["/traq/users/me"]["get"]["responses"]["200"]["content"][
    "application/json"
  ];

type GetTraqGroupsResponse =
  paths["/traq/groups"]["get"]["responses"]["200"]["content"][
    "application/json"
  ];

type GetTraqStampsResponse =
  paths["/traq/stamps"]["get"]["responses"]["200"]["content"][
    "application/json"
  ];

type GetTraqChannelsResponse =
  paths["/traq/channels"]["get"]["responses"]["200"]["content"][
    "application/json"
  ];

const myUser = {
  id: "00000000-0000-0000-0000-000000000001",
  name: myUserId,
  icon_file_id: "10000000-0000-0000-0000-000000000001",
  is_bot: false,
} as const;

const usersData: GetTraqUsersResponse = [
  myUser,
  {
    id: "00000000-0000-0000-0000-000000000002",
    name: "kaitoyama",
    icon_file_id: "10000000-0000-0000-0000-000000000002",
    is_bot: false,
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    name: "Eraxyso",
    icon_file_id: "10000000-0000-0000-0000-000000000003",
    is_bot: false,
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    name: "traP",
    icon_file_id: "10000000-0000-0000-0000-000000000004",
    is_bot: false,
  },
  {
    id: "00000000-0000-0000-0000-000000000005",
    name: "anke-to bot",
    icon_file_id: "10000000-0000-0000-0000-000000000005",
    is_bot: true,
  },
];

const groupsData: GetTraqGroupsResponse = [
  {
    id: "20000000-0000-0000-0000-000000000001",
    name: "Developers",
    members: [
      { id: myUser.id, role: "" },
      { id: usersData[1].id, role: "" },
    ],
  },
  {
    id: "20000000-0000-0000-0000-000000000002",
    name: "Operators",
    members: [
      { id: usersData[2].id, role: "" },
      { id: usersData[3].id, role: "" },
    ],
  },
];

const stampsData: GetTraqStampsResponse = [
  {
    id: "73c2f7eb-03a1-4bc7-a47a-18beae915ef8",
    name: "traq",
    file_id: "454eba82-0b8a-4203-9b41-684d17c030fb",
  },
];

const channelsData: GetTraqChannelsResponse = [
  {
    id: "50000000-0000-0000-0000-000000000001",
    name: "general",
    path: "general",
  },
  {
    id: "50000000-0000-0000-0000-000000000002",
    name: "random",
    path: "random",
  },
];

export const traqHandlers = [
  http.get("/api/traq/users", () => {
    const response: GetTraqUsersResponse = usersData;
    return HttpResponse.json(response);
  }),
  http.get("/api/traq/users/me", () => {
    const response: GetTraqUsersMeResponse = myUser;
    return HttpResponse.json(response);
  }),
  http.get("/api/traq/groups", () => {
    const response: GetTraqGroupsResponse = groupsData;
    return HttpResponse.json(response);
  }),
  http.get("/api/traq/stamps", () => {
    const response: GetTraqStampsResponse = stampsData;
    return HttpResponse.json(response);
  }),
  http.get("/api/traq/channels", () => {
    const response: GetTraqChannelsResponse = channelsData;
    return HttpResponse.json(response);
  }),
];

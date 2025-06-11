import { handlers } from "./handlers";

export const setupMockWorker = async () => {
  const { setupWorker } = await import("msw/browser");

  const worker = setupWorker(...handlers);

  return worker;
};

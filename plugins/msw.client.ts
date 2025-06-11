export default defineNuxtPlugin(async () => {
  if (process.env.NODE_ENV === "development") {
    try {
      const { setupMockWorker } = await import("~/mocks/browser");

      const worker = await setupMockWorker();

      await worker.start({
        // MSW に handle されなかったリクエストはそのまま通す
        onUnhandledRequest: "bypass",
      });

      console.log("[MSW] Mock Service Worker initialized");
    } catch (error) {
      console.error("[MSW] Failed to initialize Mock Service Worker:", error);
    }
  }
});

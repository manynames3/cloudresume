export function createPagesWorker(app) {
  return {
    fetch(request, env, context) {
      const { pathname } = new URL(request.url);

      if (pathname.startsWith("/assets/")) {
        return env.ASSETS.fetch(request);
      }

      return app.fetch(request, env, context);
    },
  };
}

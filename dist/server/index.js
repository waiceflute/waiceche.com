const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname === "/" ? "/index.html" : url.pathname;

    if (env?.ASSETS) {
      const assetUrl = new URL(pathname, request.url);
      const response = await env.ASSETS.fetch(new Request(assetUrl, request));
      if (response.status !== 404) return response;
      return env.ASSETS.fetch(new Request(new URL("/index.html", request.url), request));
    }

    return new Response("Site assets are unavailable.", { status: 500 });
  },
};

export default worker;

export const auth = {
  handler: () => ({
    GET: async () => new Response("ok"),
    POST: async () => new Response("ok"),
  }),
};
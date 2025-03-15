// remix.config.js

module.exports = {
    serverBuildTarget: "node-cjs",
    ignoredRouteFiles: [".*"],
    env: {
      DIRECTUS_API_URL: process.env.DIRECTUS_API_URL,
    },
  };
  
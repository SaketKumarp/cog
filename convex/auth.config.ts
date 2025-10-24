import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      domain: "https://credible-newt-80.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;

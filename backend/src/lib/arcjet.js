import arcjet, { filter ,detectBot, shield, slidingWindow} from "@arcjet/node";



import dotenv from "dotenv";
dotenv.config();

const aj = arcjet({
  key:process.env.ARCJET_API_KEY, 
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection
    shield({ mode: "LIVE" }),
    filter({
      allow: [
          'http.request.user_agent contains "Postman"',
        'ip.src eq "127.0.0.1"',
      ],
      mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
    }),
    // Create a bot detection rule
    detectBot({
      mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
      // Block all bots except the following
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        // Uncomment to allow these other common bot categories
        // See the full list at https://arcjet.com/bot-list
        //"CATEGORY:MONITOR", // Uptime monitoring services
        //"CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
      ],
    }),
    // Create a token bucket rate limit. Other algorithms are supported.
    slidingWindow({
        mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
        max: 100, // Max 100 requests 
        interval: "1m", 
    }),
  ],
});

export default aj;
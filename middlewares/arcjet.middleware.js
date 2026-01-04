import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { ARCJET_KEY } from "../config/env.js";

const aj = arcjet({
  key: ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "DRY_RUN", // Changed to DRY_RUN so bot detection doesn't block but rate limiting works
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        "CATEGORY:PREVIEW",
        "CATEGORY:MONITOR",
        "CURL",
        "POSTMAN",
        "HTTPIE",
        "INSOMNIA",
      ],
    }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 1, // Refill 1 token
      interval: 5, // Every 5 seconds
      capacity: 3, // Maximum 3 tokens (requests) allowed
    }),
  ],
});

const arcjetMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, { requested: 1 });

    // Log the decision for debugging
    console.log("Arcjet decision:", {
      conclusion: decision.conclusion,
      reason: decision.reason,
      results: decision.results,
      ip: decision.ip,
    });

    if (decision.isDenied()) {
      // Loop through results to find the specific denial reason
      for (const result of decision.results) {
        if (result.reason.isRateLimit() && result.conclusion === "DENY") {
          return res.status(429).json({
            success: false,
            message: "Rate limit exceeded. Please try again later.",
          });
        }

        if (result.reason.isBot() && result.conclusion === "DENY") {
          return res.status(403).json({
            success: false,
            message: "Bot detected. Automated access not permitted.",
          });
        }

        if (result.reason.isShield() && result.conclusion === "DENY") {
          return res.status(403).json({
            success: false,
            message: "Request blocked for security reasons.",
          });
        }
      }

      // Fallback generic denial
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    next();
  } catch (error) {
    console.error("Arcjet middleware error:", error);
    next();
  }
};

export default arcjetMiddleware;

import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetProtection = async (req, res, next) => {
    try {
        const decision = await aj.protect({
            ip: req.ip,
            method: req.method,
            headers: req.headers,  
           path: req.path,
        })

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({
                    message: "Too many requests. Please try again later."
                });
            }

            else if (decision.reason.isBot()) {
                return res.status(403).json({
                    message: "Access denied. Bots are not allowed."
                });
            }
            else {
                return res.status(403).json({
                    message: "Access denied by security rules."
                });
            }

        }
        // Additional check for spoofed bots
        if (decision.results.some(isSpoofedBot)) {
            return res.status(403).json({
                error: "spoofed bot detected. Access denied.",
                message: "Malicious bots activity detected"
            })
        }
        next();
    }

    catch (error) {
        console.error("Error in Arcjet middleware:", error);
        return res
            .status(500)
            .json({ message: "Internal server error" });
    }
}
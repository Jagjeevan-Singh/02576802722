// src/middleware/logger.js

const ALLOWED_STACKS = ["frontend"];
const ALLOWED_LEVELS = ["debug", "info", "warn", "error", "fatal"];
const ALLOWED_PACKAGES = [
  "api", "component", "hook", "page", "state", "style",
  "auth", "config", "middleware", "utils"
];

export async function Log(stack, level, pkg, message) {
  if (
    !ALLOWED_STACKS.includes(stack) ||
    !ALLOWED_LEVELS.includes(level) ||
    !ALLOWED_PACKAGES.includes(pkg)
  ) {
    console.error("Invalid log parameters", { stack, level, pkg, message });
    return;
  }

  try {
    const res = await fetch("http://20.244.56.144/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
        // Add Authorization header here if needed
      },
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message
      })
    });
    if (!res.ok) {
      console.error("Failed to log event", await res.text());
    }
  } catch (err) {
    console.error("Logging middleware error:", err);
  }
}
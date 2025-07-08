// loginmiddleware/logger.js

const ALLOWED_STACKS = ["frontend", "backend"];
const ALLOWED_LEVELS = ["debug", "info", "warn", "error", "fatal"];
const ALLOWED_PACKAGES = [
  // Backend only
  "cache", "controller", "cron_job", "db", "domain", "handler", "repository", "route", "service",
  // Frontend only
  "api", "component", "hook", "page", "state", "style",
  // Shared
  "auth", "config", "middleware", "utils"
];

export async function Log(stack, level, pkg, message) {
  const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJqYWdqZWV2YW4wMDRAZ21haWwuY29tIiwiZXhwIjoxNzUxOTU4ODA3LCJpYXQiOjE3NTE5NTc5MDcsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiJhYTA1MTJjYy0xYzEwLTRjNjMtOWVlOS05YWExOWY2NThlNTkiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJqYWdqZWV2YW4gc2luZ2giLCJzdWIiOiJiYTc5NjhkNS1hYWU0LTQ4OTgtYmM2YS04ODhkZjkzNDRjMzgifSwiZW1haWwiOiJqYWdqZWV2YW4wMDRAZ21haWwuY29tIiwibmFtZSI6ImphZ2plZXZhbiBzaW5naCIsInJvbGxObyI6IjAyNTc2ODAyNzIyIiwiYWNjZXNzQ29kZSI6IlZQcHNtVCIsImNsaWVudElEIjoiYmE3OTY4ZDUtYWFlNC00ODk4LWJjNmEtODg4ZGY5MzQ0YzM4IiwiY2xpZW50U2VjcmV0IjoiVk1jdWZOQWtaWHZSc05jeSJ9.H9I2IguGCyp5ptNlWtLlvhkF1iXmAy0BJNJf4OGOcLA";
  const LOG_URL = "http://20.244.56.144/evaluation-service/logs";
  if (
    !ALLOWED_STACKS.includes(stack) ||
    !ALLOWED_LEVELS.includes(level) ||
    !ALLOWED_PACKAGES.includes(pkg)
  ) {
    console.error("Invalid log parameters", { stack, level, pkg, message });
    return;
  }

  // Diagnostics
  console.info("[Logger] Attempting to log event", { stack, level, pkg, message });
  console.info("[Logger] Current window location:", window.location.href);
  console.info("[Logger] Log endpoint:", LOG_URL);

  // Timeout helper
  function fetchWithTimeout(resource, options = {}, timeout = 5000) {
    return Promise.race([
      fetch(resource, options),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Request timed out")), timeout))
    ]);
  }

  try {
    const res = await fetchWithTimeout(LOG_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ACCESS_TOKEN}`
      },
      mode: "cors",
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message
      })
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Failed to log event", errorText, res.status, res.statusText);
    }
  } catch (err) {
    console.error("Logging middleware error:", err.message || err);
    if (err instanceof TypeError && err.message && err.message.includes("Failed to fetch")) {
      console.error("Possible causes: CORS error, network issue, or server is down. Check browser network tab for details.");
      if (window.location.protocol === "https:") {
        console.error("Your frontend is served over HTTPS but the log endpoint is HTTP. Browsers block mixed content. Use an HTTPS endpoint if available.");
      }
    }
    if (err.message && err.message.includes("timed out")) {
      console.error("Logging request timed out. Server may be down or unreachable.");
    }
  }
}

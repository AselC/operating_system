const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0"; // required for Docker/WSL networking

// Basic hardening
app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));

// Health endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

// Root route
app.get("/", (_req, res) => {
  res.status(200).send("Hello from Node + Express!");
});

// Start server
const server = app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});

// Graceful shutdown
function shutdown(signal) {
  console.log(`\nReceived ${signal}, shutting down...`);
  server.close(err => {
    if (err) {
      console.error("Error during shutdown:", err);
      process.exit(1);
    }
    process.exit(0);
  });
}
["SIGINT", "SIGTERM"].forEach(sig => process.on(sig, () => shutdown(sig)));

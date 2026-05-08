/* eslint-disable no-console */
const { createServer } = require("http");
const next = require("next");
const { parse } = require("url");

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "0.0.0.0";
const port = Number(process.env.PORT || 3000);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url || "", true);
        await handle(req, res, parsedUrl);
      } catch (error) {
        console.error("Request handling error:", error);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end("Internal Server Error");
        }
      }
    }).listen(port, hostname, () => {
      console.log(`> Ready on http://${hostname}:${port} (${dev ? "dev" : "prod"})`);
    });
  })
  .catch((error) => {
    console.error("Server bootstrap error:", error);
    process.exit(1);
  });


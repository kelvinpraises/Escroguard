import chokidar from "chokidar";
import { Server, createServer } from "http";
import { Socket } from "net";
import next from "next";
import path from "path";
import { parse } from "url";

const state = {
  backendServer: undefined as Server | undefined,
  backendSockets: [] as Socket[],
};

const dev = process.env.NODE_ENV !== "production";
const NEXT_PORT = 3000; // Port for the Next.js app
const BACKEND_PORT = 3001; // Port for the Express server

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const nextServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url ?? "", true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  nextServer.once("error", (err) => {
    console.error(err);
    process.exit(1);
  });

  nextServer.listen(NEXT_PORT, () => {
    console.log(`🔥 [next server]: running at http://localhost:${NEXT_PORT}`);
  });

  function startBackendServer() {
    state.backendServer = (require("./backend") as unknown as Server).listen(
      BACKEND_PORT,
      () => {
        console.log(
          `🔥 [backend server]: running at http://localhost:${BACKEND_PORT}`
        );
      }
    );
    state.backendServer.on("connection", (socket) => {
      console.log("Add socket", state.backendSockets.length + 1);
      state.backendSockets.push(socket);
    });
  }

  function pathCheck(id: string) {
    return id.startsWith(path.join(__dirname, "backend"));
  }

  function restartBackendServer() {
    // clean the cache
    Object.keys(require.cache).forEach((id) => {
      if (pathCheck(id)) {
        console.log("Reloading", id);
        delete require.cache[id];
      }
    });

    state.backendSockets.forEach((socket, index) => {
      console.log("Destroying socket", index + 1);
      if (socket.destroyed === false) {
        socket.destroy();
      }
    });

    state.backendSockets = [];

    state.backendServer?.close(() => {
      console.log("Server is closed");
      console.log("\n----------------- restarting -------------");
      startBackendServer();
    });
  }

  startBackendServer();
  chokidar.watch("./backend").on("all", (event, at) => {
    if (event === "add") {
      console.log("Watching for", at);
    }

    if (event === "change") {
      console.log("Changes at", at);
      restartBackendServer();
    }
  });
});

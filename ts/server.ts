import { createServer, IncomingMessage, Server, ServerResponse } from "http";
import { createReadStream, promises, watch } from "fs";
import { join } from "path";
import { exec, ExecException } from "child_process";

const { lookup } = require("mime-types");

async function handle(
    request: IncomingMessage,
    response: ServerResponse
): Promise<void> {
    let url = (request.url || "").split("/").filter(val => val);
    let file = join(
        __dirname,
        "..",
        url[1] === "node_modules" ? "" : "dist",
        ...url
    );

    console.log(`Server inbound: /${url.join("/")} => ${file}`);

    try {
        let stats = await promises.stat(file);

        if (stats.isDirectory()) {
            request.url = url.concat("index.html").join("/");

            return handle(request, response);
        }

        createReadStream(file).pipe(
            response.writeHead(200, "OK", {
                "Content-Type": lookup(file)
            })
        );
    } catch (_1) {
        if (url.length && !url[url.length - 1].includes(".")) {
            request.url = "/";

            return handle(request, response);
        }

        response.writeHead(404).end("File Not Found.");
    }
}

function startServer(is_restart = false, port = 3000) {
    console.log(
        `Server ${is_restart ? "re" : ""}started: http://localhost:${port}`
    );

    return createServer((request, response) =>
        handle(request, response)
    ).listen(port);
}

let server: Server;
let execs: {
    [suffix: string]: {
        queue?: boolean;
        parent?: string;
        callback?: () => void;
    };
} = {
    ts: {
        callback: () => {
            server.close(error => {
                if (error) console.log(error);

                server = startServer(true);
            });
        }
    },
    js: {
        parent: "js"
    },
    vue: {},
    scss: {}
};

function watchCallback(suffix: string, callback?: Function) {
    return (error: ExecException | null, stdout: string, stderror: string) => {
        console.log(`Finished Executing: npm run ${suffix}`);

        if (error) console.log(error);

        if (stderror) console.log(stderror);

        if (stdout) console.log(stdout);

        if (callback) callback();

        execs[suffix].queue = false;
    };
}

watch(
    join(__dirname, ".."),
    {
        recursive: true
    },
    (_1, path) => {
        let ext = path.split(".").pop() || "";
        if (
            ext in execs &&
            !execs[ext].queue &&
            (!execs[ext].parent || path.startsWith(`${execs[ext].parent}\\`))
        ) {
            execs[ext].queue = true;

            console.log(`Executing: npm run ${ext}`);

            exec(`npm run ${ext}`, watchCallback(ext, execs[ext].callback));
        }
    }
);

exec(
    "npm run vue",
    watchCallback("vue", () => {
        server = startServer();
    })
);

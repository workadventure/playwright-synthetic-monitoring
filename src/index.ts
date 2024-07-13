import express from "express";
import {env} from "./EnvironmentVariable";
import {executeTest} from "./runTest";
import {ChildProcess, exec, execFile} from "node:child_process";

// Let's start an express server.
// This server will respond on the /healthcheck and the /metrics route with the status of the last page loading of Pupetteer

const app = express();

let status = false;
let testDuration = 0;

app.get('/healthcheck', async (req, res) => {
    if (!status) {
        res.status(500);
        res.send('KO');
    } else {
        res.status(200);
        res.send('OK');
    }
});

app.get('/metrics', async (req, res) => {
    // Output the test duration in seconds and the status
    res.status(200);
    res.set('Content-Type', 'text/plain');
    const metrics = `# HELP playwright_synthetic_monitoring_test_duration_seconds Duration of the last test in seconds
# TYPE playwright_synthetic_monitoring_test_duration_seconds gauge
playwright_synthetic_monitoring_test_duration_seconds ${testDuration / 1000}
# HELP playwright_synthetic_monitoring_status Status of the last test
# TYPE playwright_synthetic_monitoring_status gauge
playwright_synthetic_monitoring_status ${status ? 1 : 0}`
    res.send(metrics);

});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});

let childProcess: ChildProcess|undefined = undefined;

test().catch(e => console.error(e));
setInterval(() => {
    test().catch(e => console.error(e));
}, 60*1000);

async function test() {
    if (childProcess) {
        console.log("Killing process that did not finish in time");
        childProcess.kill();
        childProcess = undefined;
    }
    const startTime = Date.now();
    childProcess = exec("npm run test", (error, stdout, stderr) => {
        testDuration = Date.now() - startTime;
        if (stdout) {
            console.log(stdout);
        }
        if (stderr) {
            console.log(stderr);
        }
        if (error) {
            console.error("Error code received: " + error.code);
            status = false;
        } else {
            status = true;
        }
        childProcess = undefined;
    });
}

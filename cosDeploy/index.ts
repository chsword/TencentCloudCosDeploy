import tl = require('azure-pipelines-task-lib/task');
import { GetParameters } from "./src/getParameter"
async function run() {
    try {

        const params: InputParameter = GetParameters();
        if (params.Bucket.indexOf("-") <= 0) {
            tl.setResult(tl.TaskResult.Failed, 'Bad input was given');
            return;
        }
        console.log('Bucket', params.Bucket);
    }
    catch (err: any) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}
run();


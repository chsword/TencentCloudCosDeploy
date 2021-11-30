import tl = require('azure-pipelines-task-lib/task');
import { GetParameters } from "./src/getParameter"
import path = require('path');
import { uploadFiles } from './src/uploadFiles';
async function run() {
    try {
        tl.setResourcePath(path.join(__dirname, 'task.json'));
        console.log("start processing ...");
        const params: InputParameter = GetParameters();
        console.log("params", params);
        await uploadFiles(params);
        console.log("end processing ...");
    }
    catch (err: any) {
        console.error(err);
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}
run();




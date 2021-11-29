import ma = require('azure-pipelines-task-lib/mock-answer');
import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');

let taskPath = path.join(__dirname, '..', 'index.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tmr.setInput('Bucket', 'a-123');
tmr.setInput('Region', 'ap-beijing');
tmr.setInput('AppId', '123456');
tmr.setInput('SecretId', '123456');
tmr.setInput('SecretKey', '123456');
tmr.setInput('SourceFolder', '123456');
tmr.setInput('Contents', '**');
tmr.setInput('TargetFolder', '/');

tmr.run();
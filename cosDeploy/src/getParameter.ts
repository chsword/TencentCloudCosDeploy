import tl = require('azure-pipelines-task-lib/task');
function GetParameters(): InputParameter {
    return {
        Bucket: tl.getInput("Bucket", true) || "",
        Region: tl.getInput("Region", true) || "",
        AppId: tl.getInput("AppId", true) || "",
        SecretId: tl.getInput("SecretId", true) || "",
        SecretKey: tl.getInput("SecretKey", true) || "",

        SourceFolder: tl.getPathInput("SourceFolder", true) || "",
        Contents: tl.getDelimitedInput('Contents', '\n', true),
        TargetFolder: tl.getInput("TargetFolder", true) || "/",
        CleanTargetFolder: tl.getBoolInput("CleanTargetFolder", false),

        OverWrite: tl.getBoolInput("OverWrite", false),
        RetryCount: GetNumber("retryCount"),
        DelayBetweenRetries: GetNumber("delayBetweenRetries"),
    }
}

function GetNumber(key: string) {
    var num = parseInt(tl.getInput(key) || "0");
    if (isNaN(num) || num < 0) {
        return 0;
    }
    return num;
}

export { GetParameters }
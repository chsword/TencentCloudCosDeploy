import tl = require('azure-pipelines-task-lib/task');
function GetParameters(): InputParameter {
    return {
        Bucket: tl.getInput("Bucket", true) || "",
        Region: tl.getInput("Region", true) || "",
        AppId: tl.getInput("AppId", true) || "",
        SecretId: tl.getInput("SecretId", true) || "",
        SecretKey: tl.getInput("SecretKey", true) || "",

        SourceFolder: tl.getPathInput("SourceFolder", true) || "",
        Contents: tl.getInput("Contents", true),
        TargetFolder: tl.getInput("TargetFolder", true) || "/",
        CleanTargetFolder: tl.getBoolInput("CleanTargetFolder", false),

        OverWrite: tl.getBoolInput("OverWrite", false),
        retryCount: tl.getInput("retryCount", false),
        delayBetweenRetries: tl.getInput("delayBetweenRetries", false),
    }
}

export { GetParameters }
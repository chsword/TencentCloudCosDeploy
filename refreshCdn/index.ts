import tl = require('azure-pipelines-task-lib/task');
import path = require('path');
import * as tencentcloud from "tencentcloud-sdk-nodejs"
import { ClientConfig } from 'tencentcloud-sdk-nodejs/tencentcloud/common/interface';
async function run() {
    try {
        // tl.setResourcePath(path.join(__dirname, 'task.json'));
        console.log("start");
        const params: InputParameter = GetParameters();
        console.log("params", params);
        await refresh(params);
        console.log("done!");
        tl.setResult(tl.TaskResult.Succeeded, "done");
    }
    catch (err: any) {
        console.error(err);
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}
run();


function GetParameters(): InputParameter {
    return {
        Url: tl.getInput("Url", false) || "",
        RefreshType: tl.getInput("RefreshType", false) == "url" ? "url" : "path",
        RefreshPathFlushType: tl.getInput("RefreshPathFlushType", false) == "delete" ? "delete" : "flush",
        Region: tl.getInput("Region", false) || "",
        SecretId: tl.getInput("SecretId", false) || "",
        SecretKey: tl.getInput("SecretKey", false) || "",
    }
}

async function refresh(params: InputParameter) {
    const clientConfig: ClientConfig = {
        credential: {
            secretId: params.SecretId,
            secretKey: params.SecretKey,
        },
        region: params.Region,
        profile: {
            signMethod: "TC3-HMAC-SHA256", // 签名方法
            httpProfile: {
                reqMethod: "POST", // 请求方法
                reqTimeout: 30, // 请求超时时间，默认60s
            },
        },
    }
    const urls = params.Url.split('\n');

    const CdnClient = tencentcloud.cdn.v20180606.Client;
    //console.log("tencentcloud", tencentcloud)
    const client = new CdnClient(clientConfig);
    console.log("api Version", client.apiVersion);
    if (params.RefreshType == "path") {
        const ret = await client.PurgePathCache(
            {
                FlushType: params.RefreshPathFlushType,
                Paths: urls
            });
        console.log(`refresh path: requestId:${ret.RequestId} taskId:${ret.TaskId}`);
    } else {
        const ret = await client.PurgeUrlsCache(
            {
                Urls: urls,
            });
        console.log(`refresh path: requestId:${ret.RequestId} taskId:${ret.TaskId}`);
    }
}
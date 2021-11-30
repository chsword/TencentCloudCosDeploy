import COS from "cos-nodejs-sdk-v5";
//const COS = c as any
import { UploadBody, onProgress, UploadFileItemParams } from "cos-nodejs-sdk-v5"
//import COS = require("../lib/cos-js-sdk-v5.js");
//import * as COS from "cos-js-sdk-v5";//'../lib/cos-js-sdk-v5.js'
//type UploadFileItemParams = COS.UploadFileItemParams;
import { fixPrefix } from './utils';

//https://github.com/tencentyun/cos-js-sdk-v5/blob/master/test/test.js

// interface ProgressInfo {
//     loaded: number,
//     total: number,
//     speed: number,
//     percent: number,
// }
interface UploadItem {
    FilePath: string;
    Key: string;
    // Body: UploadBody,
    /** 上传的进度回调方法 */
    onProgress?: onProgress;// (p: ProgressInfo) => any,
    /** 上传完成回调方法 */
    onFileFinish?: (err: Error, data?: Record<string, any>) => void,
}
class CosSdk {
    cos: COS;
    params: InputParameter;

    constructor(params: InputParameter) {
        this.params = params;
        console.log("COS", 1)
        //console.log("COS", COS)
        console.log("using COS version:", COS.version);
        this.cos = new COS({
            SecretId: params.SecretId,
            SecretKey: params.SecretKey,
            // 可选参数
            FileParallelLimit: 10,    // 控制文件上传并发数
            ChunkParallelLimit: 3,   // 控制单个文件下分片上传并发数
            ChunkSize: 1024 * 1024,  // 控制分片大小，单位 B
            ProgressInterval: 1,  // 控制 onProgress 回调的间隔
            ChunkRetryTimes: params.RetryCount,   // 控制文件切片后单片上传失败后重试次数
            UploadCheckContentMd5: true,   // 上传过程计算 Content-MD5
        });
    }
    get baseInfo() {
        return {
            Bucket: this.params.Bucket,
            Region: this.params.Region,
        }
    }
    get prefix() {
        return fixPrefix(this.params.TargetFolder);
    }
    /**
     * 1. 获取旧文件列表
     * 2. 上传新文件覆盖
     * 3. 删除旧文件？
     */
    async getList() {
        const res = await this.cos.getBucket(Object.assign(this.baseInfo, {
            Prefix: this.prefix,
        }));
        return res.Contents;
    }
    async updateList(list: UploadItem[]) {
        const files: UploadFileItemParams[] = list.map(item => Object.assign(this.baseInfo, item));
        const res = await this.cos.uploadFiles(Object.assign(this.baseInfo, {
            files: files
        }));
        return res.files;
    }
    async cleanOldFiles(keys: string[]) {
        const res = await this.cos.deleteMultipleObject(Object.assign(this.baseInfo, {
            Objects: keys.map(key => ({ Key: key }))
        }))
        return res.Deleted
    }
}

export { CosSdk }
export type { UploadItem }
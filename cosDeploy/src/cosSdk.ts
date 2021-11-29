import COS = require("cos-js-sdk-v5");
//https://github.com/tencentyun/cos-js-sdk-v5/blob/master/test/test.js


class cosSdk {
    cos: COS;
    /**
     *
     */
    constructor(params: InputParameter) {
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
    /**
     * 1. 获取旧文件列表
     * 2. 上传新文件覆盖
     * 3. 删除旧文件？
     */
    getList() { }
    updateList() { }
    cleanOldFiles() { }
}
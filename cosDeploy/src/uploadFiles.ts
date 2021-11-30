
import tl = require('azure-pipelines-task-lib/task');
import path = require('path');
import { keyJoin } from './utils';
import { CosSdk, } from './cosSdk';
import type { UploadItem } from './cosSdk';


async function uploadFiles(params: InputParameter) {
    let cleanTargetFolder: boolean = params.CleanTargetFolder;
    let targetFolder = params.TargetFolder;
    // const retryOptions: RetryOptions = {
    //     timeoutBetweenRetries: params.DelayBetweenRetries,
    //     numberOfReties: params.RetryCount
    // };
    // const retryHelper = new RetryHelper(retryOptions);
    const findOptions: tl.FindOptions = {
        allowBrokenSymbolicLinks: true,
        followSpecifiedSymbolicLink: true,
        followSymbolicLinks: true
    };
    let sourceFolder = path.normalize(params.SourceFolder);
    let allPaths: string[] = tl.find(sourceFolder, findOptions);
    let sourceFolderPattern = sourceFolder.replace('[', '[[]'); // directories can have [] in them, and they have special meanings as a pattern, so escape them
    let matchedPaths: string[] = tl.match(allPaths, params.Contents, sourceFolderPattern); // default match options
    let matchedFiles: string[] = matchedPaths.filter((itemPath: string) => !stats(itemPath, false).isDirectory()); // filter-out directories
    if (matchedFiles.length > 0) {
        const cosSdk = new CosSdk(params);
        try {
            const list: UploadItem[] = [];
            const fileCount = matchedFiles.length;
            let uploadedCount = 0;
            for (let file of matchedFiles) {
                let relativePath = file.substring(sourceFolder.length).replace(/\\/ig, "/");
                if (relativePath.startsWith("\\") || relativePath.startsWith("/")) {
                    relativePath = relativePath.substr(1);
                }
                const key = keyJoin(targetFolder, relativePath);
                list.push({
                    FilePath: file,
                    Key: key,
                    onProgress: (p) => {
                        tl.setProgress((uploadedCount + p.percent) / fileCount, `上传中 :${key}`)
                        // console.log(`${key} : ${p.loaded}/${p.total} ${p.percent * 100}% ${p.speed}/Bs`)
                    },
                    onFileFinish: (err, data) => {
                        if (err && err.message) {
                            console.log(err.name)
                            console.log(err.message)
                            console.error(err.stack)
                        } else {
                            uploadedCount++;
                            //console.log("data", data)
                            console.log(`${relativePath} upload successed.`)
                            tl.setProgress(uploadedCount / fileCount, `上传成功 :${key}`)
                        }

                    }
                });

            }
            const res = await cosSdk.updateList(list);

            tl.setResult(tl.TaskResult.Succeeded, "successed");
        } catch (err: any) {
            console.error(err);
            tl.setResult(tl.TaskResult.Failed, err);
        }

    }
}
function stats(path: string, ignoreEnoent: boolean): tl.FsStats {
    try {
        return tl.stats(path);
    } catch (err: any) {
        if (err.code != 'ENOENT' && ignoreEnoent) {
            throw err;
        }
        throw err;
    }
}
export { uploadFiles }
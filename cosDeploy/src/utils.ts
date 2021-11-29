function keyJoin(targetFolder: string, relativePath: string): string {

    return fixPrefix(targetFolder) + relativePath;
}

function fixPrefix(targetFolder: string) {
    let tf = targetFolder || "";
    if (tf) {
        tf = tf.replace(/\\/, "/").trim();
        if (tf === "/") return "";
        if (!tf.endsWith("/")) tf = tf + "/";
        if (tf.startsWith("/")) {
            tf = tf.substring(1);
        }
    }
    return tf;
}

export { keyJoin, fixPrefix }
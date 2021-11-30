interface InputParameter {
    Bucket: string;
    Region: string;
    //  AppId: string;
    SecretId: string;
    SecretKey: string;

    SourceFolder: string;
    Contents: string[];
    TargetFolder: string;
    CleanTargetFolder: boolean;

    // OverWrite: boolean;
    //  RetryCount: number;
    //  DelayBetweenRetries: number;
}


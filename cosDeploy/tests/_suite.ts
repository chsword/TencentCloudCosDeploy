import * as path from 'path';
import * as assert from 'assert';
import * as ttm from 'azure-pipelines-task-lib/mock-test';

describe('all test', function () {
    before(function () {

    });

    after(() => {

    });

    it('sucess', function (done: Mocha.Done) {
        this.timeout(1000);
        let tp = path.join(__dirname, 'success.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run();
        //console.log(tr.succeeded);
        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        // console.log("ret:", tr.stdout);
        assert.equal(tr.stdout.indexOf("Bucket=a-123") >= 0, true, "should display Bucket a-123");
        done();
    });

    it('only bucket', function (done: Mocha.Done) {
        this.timeout(1000);

        let tp = path.join(__dirname, 'failure.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        // console.log("succeeded:", tr.succeeded);
        // console.log("failed:", tr.failed);
        // console.log("stdout:", tr.stdout);

        assert.equal(tr.succeeded, false, 'should have failed');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.equal(tr.errorIssues[0], 'Input required: Region', 'error issue output');
        assert.equal(tr.stdout.indexOf('Bucket=bad') >= 0, true, "Should not display Hello bad");
        done();

    });

});




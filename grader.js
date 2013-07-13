#!/usr/bin/env node

var fs=require('fs');
var program=require('commander');
var cheerio=require('cheerio');
var rest=require('restler');
var HTMLFILE_DEFAULT="index.html";
var CHECKSFILE_DEFAULT="checks.json";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if (!fs.existsSync(instr)) {
	console.log("%s does not exists. Exiting.", instr);
	process.exit(1);
    }
    return instr;
	
};

var cheerioHtmlFile = function(htmlFileContent) {
    return cheerio.load(htmlFileContent);
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfileContent, checksfile) {
    $ = cheerioHtmlFile(htmlfileContent);
    var checks = loadChecks(checksfile);
    var out = {};
    for (var ii in checks) {
	var present = $(checks[ii]).length > 0;
	out[checks[ii]] = present;
    }
    return out;
};

var assertUrlExists = function(urlpath, executeFn, checkFile) {
    return rest.get(urlpath).on('complete', function(result) {
	if (result instanceof Error) {
	    console.log('url is not valid');
	    return false;
	} else {
	    executeFn(result, checkFile);
	    return true;
	}
	});
//    return true
};

var clone = function(fn) {
    return fn.bind({});
};

var executeValidation = function(htmlFileContent, checkFile) {
    var checkJson = checkHtmlFile(htmlFileContent, checkFile);
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);    
};

if (require.main == module) {
    program.option('-c, --checks <check_file>','Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
    .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
    .option('-u, --url <html_url>', 'URL to index.html')
    .parse(process.argv);
    if (program.url) {
	assertUrlExists(program.url, executeValidation, program.checks);
    } else {
	executeValidation(fs.readFileSync(program.file), program.checks);
    }
} else {
    exports.checkHtmlFile = checkHtmlFile;
}

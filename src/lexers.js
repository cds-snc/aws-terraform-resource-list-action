const fs = require('fs');
const glob = require('glob');

const terraformDir = (path) => {
    // Get all files in the path recursively that end with .tf
    const files = getFilesInDir(path, '.tf');

    // Call terraformFile on each file
    const resources = files.reduce((acc, file) => {
        const fileResources = terraformFile(file);
        fileResources.forEach(fileResource => {
            acc.add(fileResource);
        });
        return acc;
    }, new Set());
    return resources;
}

const terraformFile = (path) => {
    const lines = loadLinesInFile(path);
    return lines.reduce((acc, line) => {
        const matches = line.match(/^resource "([^"]+)" "([^"]+)" {$/);
        if (matches) {
            acc.add(matches[1] + "." + matches[2]);
        }
        return acc;
    }, new Set());
}

const terraformGraphFile = (path) => {
    const lines = loadLinesInFile(path);
    return lines.reduce((acc, line) => {
        const matches = line.match(/aws_[^ ,"']*\.[^ ,"']*(?!,)/g);
        if (matches) {
            matches.forEach(match => {
                acc.add(match);
            });
        }
        return acc;
    }, new Set());
}

const terraformStateFile = (path) => {
    const json = loadJSONFile(path);
    return json.resources.reduce((acc, resource) => {
        acc.add(resource.type + "." + resource.name);
        return acc;
    }, new Set());
}

const getFilesInDir = (path, extension) => {
    // Get all files in the path recursively that end with the extension
    let files = [];
    try {
        glob.sync(path + '/**/*' + extension).forEach(file => {
            files.push(file);
        });
    } catch (err) {
        console.error(err);
    }
    return files;
}

const loadLinesInFile = (path) => {
    // Load the file and parse it into lines synchronously
    let lines = [];
    try {
        if (fs.existsSync(path)) { // check if file exists
            const fileData = fs.readFileSync(path, 'utf-8');
            lines = fileData.split('\n');
        }
    } catch (err) {
        console.error(err);
    }
    return lines;
}

const loadJSONFile = (path) => {
    // Load the file and parse the JSON synchronously
    let json = {};
    try {
        if (fs.existsSync(path)) { // check if file exists
            const fileData = fs.readFileSync(path, 'utf-8');
            json = JSON.parse(fileData);
        }
    } catch (err) {
        console.error(err);
    }
    return json;
}

exports.terraformDir = terraformDir;
exports.terraformGraphFile = terraformGraphFile;
exports.terraformStateFile = terraformStateFile;
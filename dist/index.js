require('./sourcemap-register.js');/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(2037));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2037));
const path = __importStar(__nccwpck_require__(1017));
const oidc_utils_1 = __nccwpck_require__(8041);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('ENV', file_command_1.prepareKeyValueMessage(name, val));
    }
    command_1.issueCommand('set-env', { name }, convertedVal);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueFileCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    if (options && options.trimWhitespace === false) {
        return inputs;
    }
    return inputs.map(input => input.trim());
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    const filePath = process.env['GITHUB_OUTPUT'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('OUTPUT', file_command_1.prepareKeyValueMessage(name, value));
    }
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, utils_1.toCommandValue(value));
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    const filePath = process.env['GITHUB_STATE'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('STATE', file_command_1.prepareKeyValueMessage(name, value));
    }
    command_1.issueCommand('save-state', { name }, utils_1.toCommandValue(value));
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
/**
 * Summary exports
 */
var summary_1 = __nccwpck_require__(1327);
Object.defineProperty(exports, "summary", ({ enumerable: true, get: function () { return summary_1.summary; } }));
/**
 * @deprecated use core.summary
 */
var summary_2 = __nccwpck_require__(1327);
Object.defineProperty(exports, "markdownSummary", ({ enumerable: true, get: function () { return summary_2.markdownSummary; } }));
/**
 * Path exports
 */
var path_utils_1 = __nccwpck_require__(2981);
Object.defineProperty(exports, "toPosixPath", ({ enumerable: true, get: function () { return path_utils_1.toPosixPath; } }));
Object.defineProperty(exports, "toWin32Path", ({ enumerable: true, get: function () { return path_utils_1.toWin32Path; } }));
Object.defineProperty(exports, "toPlatformPath", ({ enumerable: true, get: function () { return path_utils_1.toPlatformPath; } }));
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prepareKeyValueMessage = exports.issueFileCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(7147));
const os = __importStar(__nccwpck_require__(2037));
const uuid_1 = __nccwpck_require__(5840);
const utils_1 = __nccwpck_require__(5278);
function issueFileCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueFileCommand = issueFileCommand;
function prepareKeyValueMessage(key, value) {
    const delimiter = `ghadelimiter_${uuid_1.v4()}`;
    const convertedValue = utils_1.toCommandValue(value);
    // These should realistically never happen, but just in case someone finds a
    // way to exploit uuid generation let's not allow keys or values that contain
    // the delimiter.
    if (key.includes(delimiter)) {
        throw new Error(`Unexpected input: name should not contain the delimiter "${delimiter}"`);
    }
    if (convertedValue.includes(delimiter)) {
        throw new Error(`Unexpected input: value should not contain the delimiter "${delimiter}"`);
    }
    return `${key}<<${delimiter}${os.EOL}${convertedValue}${os.EOL}${delimiter}`;
}
exports.prepareKeyValueMessage = prepareKeyValueMessage;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 8041:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const http_client_1 = __nccwpck_require__(6255);
const auth_1 = __nccwpck_require__(5526);
const core_1 = __nccwpck_require__(2186);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.result.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ 2981:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toPlatformPath = exports.toWin32Path = exports.toPosixPath = void 0;
const path = __importStar(__nccwpck_require__(1017));
/**
 * toPosixPath converts the given path to the posix form. On Windows, \\ will be
 * replaced with /.
 *
 * @param pth. Path to transform.
 * @return string Posix path.
 */
function toPosixPath(pth) {
    return pth.replace(/[\\]/g, '/');
}
exports.toPosixPath = toPosixPath;
/**
 * toWin32Path converts the given path to the win32 form. On Linux, / will be
 * replaced with \\.
 *
 * @param pth. Path to transform.
 * @return string Win32 path.
 */
function toWin32Path(pth) {
    return pth.replace(/[/]/g, '\\');
}
exports.toWin32Path = toWin32Path;
/**
 * toPlatformPath converts the given path to a platform-specific path. It does
 * this by replacing instances of / and \ with the platform-specific path
 * separator.
 *
 * @param pth The path to platformize.
 * @return string The platform-specific path.
 */
function toPlatformPath(pth) {
    return pth.replace(/[/\\]/g, path.sep);
}
exports.toPlatformPath = toPlatformPath;
//# sourceMappingURL=path-utils.js.map

/***/ }),

/***/ 1327:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.summary = exports.markdownSummary = exports.SUMMARY_DOCS_URL = exports.SUMMARY_ENV_VAR = void 0;
const os_1 = __nccwpck_require__(2037);
const fs_1 = __nccwpck_require__(7147);
const { access, appendFile, writeFile } = fs_1.promises;
exports.SUMMARY_ENV_VAR = 'GITHUB_STEP_SUMMARY';
exports.SUMMARY_DOCS_URL = 'https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary';
class Summary {
    constructor() {
        this._buffer = '';
    }
    /**
     * Finds the summary file path from the environment, rejects if env var is not found or file does not exist
     * Also checks r/w permissions.
     *
     * @returns step summary file path
     */
    filePath() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._filePath) {
                return this._filePath;
            }
            const pathFromEnv = process.env[exports.SUMMARY_ENV_VAR];
            if (!pathFromEnv) {
                throw new Error(`Unable to find environment variable for $${exports.SUMMARY_ENV_VAR}. Check if your runtime environment supports job summaries.`);
            }
            try {
                yield access(pathFromEnv, fs_1.constants.R_OK | fs_1.constants.W_OK);
            }
            catch (_a) {
                throw new Error(`Unable to access summary file: '${pathFromEnv}'. Check if the file has correct read/write permissions.`);
            }
            this._filePath = pathFromEnv;
            return this._filePath;
        });
    }
    /**
     * Wraps content in an HTML tag, adding any HTML attributes
     *
     * @param {string} tag HTML tag to wrap
     * @param {string | null} content content within the tag
     * @param {[attribute: string]: string} attrs key-value list of HTML attributes to add
     *
     * @returns {string} content wrapped in HTML element
     */
    wrap(tag, content, attrs = {}) {
        const htmlAttrs = Object.entries(attrs)
            .map(([key, value]) => ` ${key}="${value}"`)
            .join('');
        if (!content) {
            return `<${tag}${htmlAttrs}>`;
        }
        return `<${tag}${htmlAttrs}>${content}</${tag}>`;
    }
    /**
     * Writes text in the buffer to the summary buffer file and empties buffer. Will append by default.
     *
     * @param {SummaryWriteOptions} [options] (optional) options for write operation
     *
     * @returns {Promise<Summary>} summary instance
     */
    write(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const overwrite = !!(options === null || options === void 0 ? void 0 : options.overwrite);
            const filePath = yield this.filePath();
            const writeFunc = overwrite ? writeFile : appendFile;
            yield writeFunc(filePath, this._buffer, { encoding: 'utf8' });
            return this.emptyBuffer();
        });
    }
    /**
     * Clears the summary buffer and wipes the summary file
     *
     * @returns {Summary} summary instance
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.emptyBuffer().write({ overwrite: true });
        });
    }
    /**
     * Returns the current summary buffer as a string
     *
     * @returns {string} string of summary buffer
     */
    stringify() {
        return this._buffer;
    }
    /**
     * If the summary buffer is empty
     *
     * @returns {boolen} true if the buffer is empty
     */
    isEmptyBuffer() {
        return this._buffer.length === 0;
    }
    /**
     * Resets the summary buffer without writing to summary file
     *
     * @returns {Summary} summary instance
     */
    emptyBuffer() {
        this._buffer = '';
        return this;
    }
    /**
     * Adds raw text to the summary buffer
     *
     * @param {string} text content to add
     * @param {boolean} [addEOL=false] (optional) append an EOL to the raw text (default: false)
     *
     * @returns {Summary} summary instance
     */
    addRaw(text, addEOL = false) {
        this._buffer += text;
        return addEOL ? this.addEOL() : this;
    }
    /**
     * Adds the operating system-specific end-of-line marker to the buffer
     *
     * @returns {Summary} summary instance
     */
    addEOL() {
        return this.addRaw(os_1.EOL);
    }
    /**
     * Adds an HTML codeblock to the summary buffer
     *
     * @param {string} code content to render within fenced code block
     * @param {string} lang (optional) language to syntax highlight code
     *
     * @returns {Summary} summary instance
     */
    addCodeBlock(code, lang) {
        const attrs = Object.assign({}, (lang && { lang }));
        const element = this.wrap('pre', this.wrap('code', code), attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML list to the summary buffer
     *
     * @param {string[]} items list of items to render
     * @param {boolean} [ordered=false] (optional) if the rendered list should be ordered or not (default: false)
     *
     * @returns {Summary} summary instance
     */
    addList(items, ordered = false) {
        const tag = ordered ? 'ol' : 'ul';
        const listItems = items.map(item => this.wrap('li', item)).join('');
        const element = this.wrap(tag, listItems);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML table to the summary buffer
     *
     * @param {SummaryTableCell[]} rows table rows
     *
     * @returns {Summary} summary instance
     */
    addTable(rows) {
        const tableBody = rows
            .map(row => {
            const cells = row
                .map(cell => {
                if (typeof cell === 'string') {
                    return this.wrap('td', cell);
                }
                const { header, data, colspan, rowspan } = cell;
                const tag = header ? 'th' : 'td';
                const attrs = Object.assign(Object.assign({}, (colspan && { colspan })), (rowspan && { rowspan }));
                return this.wrap(tag, data, attrs);
            })
                .join('');
            return this.wrap('tr', cells);
        })
            .join('');
        const element = this.wrap('table', tableBody);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds a collapsable HTML details element to the summary buffer
     *
     * @param {string} label text for the closed state
     * @param {string} content collapsable content
     *
     * @returns {Summary} summary instance
     */
    addDetails(label, content) {
        const element = this.wrap('details', this.wrap('summary', label) + content);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML image tag to the summary buffer
     *
     * @param {string} src path to the image you to embed
     * @param {string} alt text description of the image
     * @param {SummaryImageOptions} options (optional) addition image attributes
     *
     * @returns {Summary} summary instance
     */
    addImage(src, alt, options) {
        const { width, height } = options || {};
        const attrs = Object.assign(Object.assign({}, (width && { width })), (height && { height }));
        const element = this.wrap('img', null, Object.assign({ src, alt }, attrs));
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML section heading element
     *
     * @param {string} text heading text
     * @param {number | string} [level=1] (optional) the heading level, default: 1
     *
     * @returns {Summary} summary instance
     */
    addHeading(text, level) {
        const tag = `h${level}`;
        const allowedTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)
            ? tag
            : 'h1';
        const element = this.wrap(allowedTag, text);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML thematic break (<hr>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addSeparator() {
        const element = this.wrap('hr', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML line break (<br>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addBreak() {
        const element = this.wrap('br', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML blockquote to the summary buffer
     *
     * @param {string} text quote text
     * @param {string} cite (optional) citation url
     *
     * @returns {Summary} summary instance
     */
    addQuote(text, cite) {
        const attrs = Object.assign({}, (cite && { cite }));
        const element = this.wrap('blockquote', text, attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML anchor tag to the summary buffer
     *
     * @param {string} text link text/content
     * @param {string} href hyperlink
     *
     * @returns {Summary} summary instance
     */
    addLink(text, href) {
        const element = this.wrap('a', text, { href });
        return this.addRaw(element).addEOL();
    }
}
const _summary = new Summary();
/**
 * @deprecated use `core.summary`
 */
exports.markdownSummary = _summary;
exports.summary = _summary;
//# sourceMappingURL=summary.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 5526:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PersonalAccessTokenCredentialHandler = exports.BearerCredentialHandler = exports.BasicCredentialHandler = void 0;
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Bearer ${this.token}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`PAT:${this.token}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;
//# sourceMappingURL=auth.js.map

/***/ }),

/***/ 6255:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/* eslint-disable @typescript-eslint/no-explicit-any */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpClient = exports.isHttps = exports.HttpClientResponse = exports.HttpClientError = exports.getProxyUrl = exports.MediaTypes = exports.Headers = exports.HttpCodes = void 0;
const http = __importStar(__nccwpck_require__(3685));
const https = __importStar(__nccwpck_require__(5687));
const pm = __importStar(__nccwpck_require__(9835));
const tunnel = __importStar(__nccwpck_require__(4294));
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    const proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                let output = Buffer.alloc(0);
                this.message.on('data', (chunk) => {
                    output = Buffer.concat([output, chunk]);
                });
                this.message.on('end', () => {
                    resolve(output.toString());
                });
            }));
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    const parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
        });
    }
    get(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('GET', requestUrl, null, additionalHeaders || {});
        });
    }
    del(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('DELETE', requestUrl, null, additionalHeaders || {});
        });
    }
    post(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('POST', requestUrl, data, additionalHeaders || {});
        });
    }
    patch(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PATCH', requestUrl, data, additionalHeaders || {});
        });
    }
    put(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PUT', requestUrl, data, additionalHeaders || {});
        });
    }
    head(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('HEAD', requestUrl, null, additionalHeaders || {});
        });
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(verb, requestUrl, stream, additionalHeaders);
        });
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    getJson(requestUrl, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            const res = yield this.get(requestUrl, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    postJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.post(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    putJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.put(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    patchJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.patch(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    request(verb, requestUrl, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._disposed) {
                throw new Error('Client has already been disposed.');
            }
            const parsedUrl = new URL(requestUrl);
            let info = this._prepareRequest(verb, parsedUrl, headers);
            // Only perform retries on reads since writes may not be idempotent.
            const maxTries = this._allowRetries && RetryableHttpVerbs.includes(verb)
                ? this._maxRetries + 1
                : 1;
            let numTries = 0;
            let response;
            do {
                response = yield this.requestRaw(info, data);
                // Check if it's an authentication challenge
                if (response &&
                    response.message &&
                    response.message.statusCode === HttpCodes.Unauthorized) {
                    let authenticationHandler;
                    for (const handler of this.handlers) {
                        if (handler.canHandleAuthentication(response)) {
                            authenticationHandler = handler;
                            break;
                        }
                    }
                    if (authenticationHandler) {
                        return authenticationHandler.handleAuthentication(this, info, data);
                    }
                    else {
                        // We have received an unauthorized response but have no handlers to handle it.
                        // Let the response return to the caller.
                        return response;
                    }
                }
                let redirectsRemaining = this._maxRedirects;
                while (response.message.statusCode &&
                    HttpRedirectCodes.includes(response.message.statusCode) &&
                    this._allowRedirects &&
                    redirectsRemaining > 0) {
                    const redirectUrl = response.message.headers['location'];
                    if (!redirectUrl) {
                        // if there's no location to redirect to, we won't
                        break;
                    }
                    const parsedRedirectUrl = new URL(redirectUrl);
                    if (parsedUrl.protocol === 'https:' &&
                        parsedUrl.protocol !== parsedRedirectUrl.protocol &&
                        !this._allowRedirectDowngrade) {
                        throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                    }
                    // we need to finish reading the response before reassigning response
                    // which will leak the open socket.
                    yield response.readBody();
                    // strip authorization header if redirected to a different hostname
                    if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                        for (const header in headers) {
                            // header names are case insensitive
                            if (header.toLowerCase() === 'authorization') {
                                delete headers[header];
                            }
                        }
                    }
                    // let's make the request with the new redirectUrl
                    info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                    response = yield this.requestRaw(info, data);
                    redirectsRemaining--;
                }
                if (!response.message.statusCode ||
                    !HttpResponseRetryCodes.includes(response.message.statusCode)) {
                    // If not a retry code, return immediately instead of retrying
                    return response;
                }
                numTries += 1;
                if (numTries < maxTries) {
                    yield response.readBody();
                    yield this._performExponentialBackoff(numTries);
                }
            } while (numTries < maxTries);
            return response;
        });
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                function callbackForResult(err, res) {
                    if (err) {
                        reject(err);
                    }
                    else if (!res) {
                        // If `err` is not passed, then `res` must be passed.
                        reject(new Error('Unknown error'));
                    }
                    else {
                        resolve(res);
                    }
                }
                this.requestRawWithCallback(info, data, callbackForResult);
            });
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        if (typeof data === 'string') {
            if (!info.options.headers) {
                info.options.headers = {};
            }
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        function handleResult(err, res) {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        }
        const req = info.httpModule.request(info.options, (msg) => {
            const res = new HttpClientResponse(msg);
            handleResult(undefined, res);
        });
        let socket;
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error(`Request timeout: ${info.options.path}`));
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        const parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            for (const handler of this.handlers) {
                handler.prepareRequest(info.options);
            }
        }
        return info;
    }
    _mergeHeaders(headers) {
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers || {}));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        const proxyUrl = pm.getProxyUrl(parsedUrl);
        const useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        // This is `useProxy` again, but we need to check `proxyURl` directly for TypeScripts's flow analysis.
        if (proxyUrl && proxyUrl.hostname) {
            const agentOptions = {
                maxSockets,
                keepAlive: this._keepAlive,
                proxy: Object.assign(Object.assign({}, ((proxyUrl.username || proxyUrl.password) && {
                    proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                })), { host: proxyUrl.hostname, port: proxyUrl.port })
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
            const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
            return new Promise(resolve => setTimeout(() => resolve(), ms));
        });
    }
    _processResponse(res, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const statusCode = res.message.statusCode || 0;
                const response = {
                    statusCode,
                    result: null,
                    headers: {}
                };
                // not found leads to null obj returned
                if (statusCode === HttpCodes.NotFound) {
                    resolve(response);
                }
                // get the result from the body
                function dateTimeDeserializer(key, value) {
                    if (typeof value === 'string') {
                        const a = new Date(value);
                        if (!isNaN(a.valueOf())) {
                            return a;
                        }
                    }
                    return value;
                }
                let obj;
                let contents;
                try {
                    contents = yield res.readBody();
                    if (contents && contents.length > 0) {
                        if (options && options.deserializeDates) {
                            obj = JSON.parse(contents, dateTimeDeserializer);
                        }
                        else {
                            obj = JSON.parse(contents);
                        }
                        response.result = obj;
                    }
                    response.headers = res.message.headers;
                }
                catch (err) {
                    // Invalid resource (contents not json);  leaving result obj null
                }
                // note that 3xx redirects are handled by the http layer.
                if (statusCode > 299) {
                    let msg;
                    // if exception/error in body, attempt to get better error
                    if (obj && obj.message) {
                        msg = obj.message;
                    }
                    else if (contents && contents.length > 0) {
                        // it may be the case that the exception is in the body message as string
                        msg = contents;
                    }
                    else {
                        msg = `Failed request: (${statusCode})`;
                    }
                    const err = new HttpClientError(msg, statusCode);
                    err.result = response.result;
                    reject(err);
                }
                else {
                    resolve(response);
                }
            }));
        });
    }
}
exports.HttpClient = HttpClient;
const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9835:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkBypass = exports.getProxyUrl = void 0;
function getProxyUrl(reqUrl) {
    const usingSsl = reqUrl.protocol === 'https:';
    if (checkBypass(reqUrl)) {
        return undefined;
    }
    const proxyVar = (() => {
        if (usingSsl) {
            return process.env['https_proxy'] || process.env['HTTPS_PROXY'];
        }
        else {
            return process.env['http_proxy'] || process.env['HTTP_PROXY'];
        }
    })();
    if (proxyVar) {
        return new URL(proxyVar);
    }
    else {
        return undefined;
    }
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    const reqHost = reqUrl.hostname;
    if (isLoopbackAddress(reqHost)) {
        return true;
    }
    const noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    const upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (const upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperNoProxyItem === '*' ||
            upperReqHosts.some(x => x === upperNoProxyItem ||
                x.endsWith(`.${upperNoProxyItem}`) ||
                (upperNoProxyItem.startsWith('.') &&
                    x.endsWith(`${upperNoProxyItem}`)))) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;
function isLoopbackAddress(host) {
    const hostLower = host.toLowerCase();
    return (hostLower === 'localhost' ||
        hostLower.startsWith('127.') ||
        hostLower.startsWith('[::1]') ||
        hostLower.startsWith('[0:0:0:0:0:0:0:1]'));
}
//# sourceMappingURL=proxy.js.map

/***/ }),

/***/ 3980:
/***/ (function(module) {

// MIT license (by Elan Shanker).
(function(globals) {
  'use strict';

  var executeSync = function(){
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'function'){
      args[0].apply(null, args.splice(1));
    }
  };

  var executeAsync = function(fn){
    if (typeof setImmediate === 'function') {
      setImmediate(fn);
    } else if (typeof process !== 'undefined' && process.nextTick) {
      process.nextTick(fn);
    } else {
      setTimeout(fn, 0);
    }
  };

  var makeIterator = function (tasks) {
    var makeCallback = function (index) {
      var fn = function () {
        if (tasks.length) {
          tasks[index].apply(null, arguments);
        }
        return fn.next();
      };
      fn.next = function () {
        return (index < tasks.length - 1) ? makeCallback(index + 1): null;
      };
      return fn;
    };
    return makeCallback(0);
  };
  
  var _isArray = Array.isArray || function(maybeArray){
    return Object.prototype.toString.call(maybeArray) === '[object Array]';
  };

  var waterfall = function (tasks, callback, forceAsync) {
    var nextTick = forceAsync ? executeAsync : executeSync;
    callback = callback || function () {};
    if (!_isArray(tasks)) {
      var err = new Error('First argument to waterfall must be an array of functions');
      return callback(err);
    }
    if (!tasks.length) {
      return callback();
    }
    var wrapIterator = function (iterator) {
      return function (err) {
        if (err) {
          callback.apply(null, arguments);
          callback = function () {};
        } else {
          var args = Array.prototype.slice.call(arguments, 1);
          var next = iterator.next();
          if (next) {
            args.push(wrapIterator(next));
          } else {
            args.push(callback);
          }
          nextTick(function () {
            iterator.apply(null, args);
          });
        }
      };
    };
    wrapIterator(makeIterator(tasks))();
  };

  if (typeof define !== 'undefined' && define.amd) {
    define([], function () {
      return waterfall;
    }); // RequireJS
  } else if ( true && module.exports) {
    module.exports = waterfall; // CommonJS
  } else {
    globals.waterfall = waterfall; // <script>
  }
})(this);


/***/ }),

/***/ 7943:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var rawAsap = __nccwpck_require__(3691);
var freeTasks = [];

/**
 * Calls a task as soon as possible after returning, in its own event, with
 * priority over IO events. An exception thrown in a task can be handled by
 * `process.on("uncaughtException") or `domain.on("error")`, but will otherwise
 * crash the process. If the error is handled, all subsequent tasks will
 * resume.
 *
 * @param {{call}} task A callable object, typically a function that takes no
 * arguments.
 */
module.exports = asap;
function asap(task) {
    var rawTask;
    if (freeTasks.length) {
        rawTask = freeTasks.pop();
    } else {
        rawTask = new RawTask();
    }
    rawTask.task = task;
    rawTask.domain = process.domain;
    rawAsap(rawTask);
}

function RawTask() {
    this.task = null;
    this.domain = null;
}

RawTask.prototype.call = function () {
    if (this.domain) {
        this.domain.enter();
    }
    var threw = true;
    try {
        this.task.call();
        threw = false;
        // If the task throws an exception (presumably) Node.js restores the
        // domain stack for the next event.
        if (this.domain) {
            this.domain.exit();
        }
    } finally {
        // We use try/finally and a threw flag to avoid messing up stack traces
        // when we catch and release errors.
        if (threw) {
            // In Node.js, uncaught exceptions are considered fatal errors.
            // Re-throw them to interrupt flushing!
            // Ensure that flushing continues if an uncaught exception is
            // suppressed listening process.on("uncaughtException") or
            // domain.on("error").
            rawAsap.requestFlush();
        }
        // If the task threw an error, we do not want to exit the domain here.
        // Exiting the domain would prevent the domain from catching the error.
        this.task = null;
        this.domain = null;
        freeTasks.push(this);
    }
};



/***/ }),

/***/ 3691:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var domain; // The domain module is executed on demand
var hasSetImmediate = typeof setImmediate === "function";

// Use the fastest means possible to execute a task in its own turn, with
// priority over other events including network IO events in Node.js.
//
// An exception thrown by a task will permanently interrupt the processing of
// subsequent tasks. The higher level `asap` function ensures that if an
// exception is thrown by a task, that the task queue will continue flushing as
// soon as possible, but if you use `rawAsap` directly, you are responsible to
// either ensure that no exceptions are thrown from your task, or to manually
// call `rawAsap.requestFlush` if an exception is thrown.
module.exports = rawAsap;
function rawAsap(task) {
    if (!queue.length) {
        requestFlush();
        flushing = true;
    }
    // Avoids a function call
    queue[queue.length] = task;
}

var queue = [];
// Once a flush has been requested, no further calls to `requestFlush` are
// necessary until the next `flush` completes.
var flushing = false;
// The position of the next task to execute in the task queue. This is
// preserved between calls to `flush` so that it can be resumed if
// a task throws an exception.
var index = 0;
// If a task schedules additional tasks recursively, the task queue can grow
// unbounded. To prevent memory excaustion, the task queue will periodically
// truncate already-completed tasks.
var capacity = 1024;

// The flush function processes all tasks that have been scheduled with
// `rawAsap` unless and until one of those tasks throws an exception.
// If a task throws an exception, `flush` ensures that its state will remain
// consistent and will resume where it left off when called again.
// However, `flush` does not make any arrangements to be called again if an
// exception is thrown.
function flush() {
    while (index < queue.length) {
        var currentIndex = index;
        // Advance the index before calling the task. This ensures that we will
        // begin flushing on the next task the task throws an error.
        index = index + 1;
        queue[currentIndex].call();
        // Prevent leaking memory for long chains of recursive calls to `asap`.
        // If we call `asap` within tasks scheduled by `asap`, the queue will
        // grow, but to avoid an O(n) walk for every task we execute, we don't
        // shift tasks off the queue after they have been executed.
        // Instead, we periodically shift 1024 tasks off the queue.
        if (index > capacity) {
            // Manually shift all values starting at the index back to the
            // beginning of the queue.
            for (var scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
                queue[scan] = queue[scan + index];
            }
            queue.length -= index;
            index = 0;
        }
    }
    queue.length = 0;
    index = 0;
    flushing = false;
}

rawAsap.requestFlush = requestFlush;
function requestFlush() {
    // Ensure flushing is not bound to any domain.
    // It is not sufficient to exit the domain, because domains exist on a stack.
    // To execute code outside of any domain, the following dance is necessary.
    var parentDomain = process.domain;
    if (parentDomain) {
        if (!domain) {
            // Lazy execute the domain module.
            // Only employed if the user elects to use domains.
            domain = __nccwpck_require__(3639);
        }
        domain.active = process.domain = null;
    }

    // `setImmediate` is slower that `process.nextTick`, but `process.nextTick`
    // cannot handle recursion.
    // `requestFlush` will only be called recursively from `asap.js`, to resume
    // flushing after an error is thrown into a domain.
    // Conveniently, `setImmediate` was introduced in the same version
    // `process.nextTick` started throwing recursion errors.
    if (flushing && hasSetImmediate) {
        setImmediate(flush);
    } else {
        process.nextTick(flush);
    }

    if (parentDomain) {
        domain.active = process.domain = parentDomain;
    }
}


/***/ }),

/***/ 9417:
/***/ ((module) => {

"use strict";

module.exports = balanced;
function balanced(a, b, str) {
  if (a instanceof RegExp) a = maybeMatch(a, str);
  if (b instanceof RegExp) b = maybeMatch(b, str);

  var r = range(a, b, str);

  return r && {
    start: r[0],
    end: r[1],
    pre: str.slice(0, r[0]),
    body: str.slice(r[0] + a.length, r[1]),
    post: str.slice(r[1] + b.length)
  };
}

function maybeMatch(reg, str) {
  var m = str.match(reg);
  return m ? m[0] : null;
}

balanced.range = range;
function range(a, b, str) {
  var begs, beg, left, right, result;
  var ai = str.indexOf(a);
  var bi = str.indexOf(b, ai + 1);
  var i = ai;

  if (ai >= 0 && bi > 0) {
    if(a===b) {
      return [ai, bi];
    }
    begs = [];
    left = str.length;

    while (i >= 0 && !result) {
      if (i == ai) {
        begs.push(i);
        ai = str.indexOf(a, i + 1);
      } else if (begs.length == 1) {
        result = [ begs.pop(), bi ];
      } else {
        beg = begs.pop();
        if (beg < left) {
          left = beg;
          right = bi;
        }

        bi = str.indexOf(b, i + 1);
      }

      i = ai < bi && ai >= 0 ? ai : bi;
    }

    if (begs.length) {
      result = [ left, right ];
    }
  }

  return result;
}


/***/ }),

/***/ 3717:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var concatMap = __nccwpck_require__(6891);
var balanced = __nccwpck_require__(9417);

module.exports = expandTop;

var escSlash = '\0SLASH'+Math.random()+'\0';
var escOpen = '\0OPEN'+Math.random()+'\0';
var escClose = '\0CLOSE'+Math.random()+'\0';
var escComma = '\0COMMA'+Math.random()+'\0';
var escPeriod = '\0PERIOD'+Math.random()+'\0';

function numeric(str) {
  return parseInt(str, 10) == str
    ? parseInt(str, 10)
    : str.charCodeAt(0);
}

function escapeBraces(str) {
  return str.split('\\\\').join(escSlash)
            .split('\\{').join(escOpen)
            .split('\\}').join(escClose)
            .split('\\,').join(escComma)
            .split('\\.').join(escPeriod);
}

function unescapeBraces(str) {
  return str.split(escSlash).join('\\')
            .split(escOpen).join('{')
            .split(escClose).join('}')
            .split(escComma).join(',')
            .split(escPeriod).join('.');
}


// Basically just str.split(","), but handling cases
// where we have nested braced sections, which should be
// treated as individual members, like {a,{b,c},d}
function parseCommaParts(str) {
  if (!str)
    return [''];

  var parts = [];
  var m = balanced('{', '}', str);

  if (!m)
    return str.split(',');

  var pre = m.pre;
  var body = m.body;
  var post = m.post;
  var p = pre.split(',');

  p[p.length-1] += '{' + body + '}';
  var postParts = parseCommaParts(post);
  if (post.length) {
    p[p.length-1] += postParts.shift();
    p.push.apply(p, postParts);
  }

  parts.push.apply(parts, p);

  return parts;
}

function expandTop(str) {
  if (!str)
    return [];

  // I don't know why Bash 4.3 does this, but it does.
  // Anything starting with {} will have the first two bytes preserved
  // but *only* at the top level, so {},a}b will not expand to anything,
  // but a{},b}c will be expanded to [a}c,abc].
  // One could argue that this is a bug in Bash, but since the goal of
  // this module is to match Bash's rules, we escape a leading {}
  if (str.substr(0, 2) === '{}') {
    str = '\\{\\}' + str.substr(2);
  }

  return expand(escapeBraces(str), true).map(unescapeBraces);
}

function identity(e) {
  return e;
}

function embrace(str) {
  return '{' + str + '}';
}
function isPadded(el) {
  return /^-?0\d/.test(el);
}

function lte(i, y) {
  return i <= y;
}
function gte(i, y) {
  return i >= y;
}

function expand(str, isTop) {
  var expansions = [];

  var m = balanced('{', '}', str);
  if (!m || /\$$/.test(m.pre)) return [str];

  var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
  var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
  var isSequence = isNumericSequence || isAlphaSequence;
  var isOptions = m.body.indexOf(',') >= 0;
  if (!isSequence && !isOptions) {
    // {a},b}
    if (m.post.match(/,.*\}/)) {
      str = m.pre + '{' + m.body + escClose + m.post;
      return expand(str);
    }
    return [str];
  }

  var n;
  if (isSequence) {
    n = m.body.split(/\.\./);
  } else {
    n = parseCommaParts(m.body);
    if (n.length === 1) {
      // x{{a,b}}y ==> x{a}y x{b}y
      n = expand(n[0], false).map(embrace);
      if (n.length === 1) {
        var post = m.post.length
          ? expand(m.post, false)
          : [''];
        return post.map(function(p) {
          return m.pre + n[0] + p;
        });
      }
    }
  }

  // at this point, n is the parts, and we know it's not a comma set
  // with a single entry.

  // no need to expand pre, since it is guaranteed to be free of brace-sets
  var pre = m.pre;
  var post = m.post.length
    ? expand(m.post, false)
    : [''];

  var N;

  if (isSequence) {
    var x = numeric(n[0]);
    var y = numeric(n[1]);
    var width = Math.max(n[0].length, n[1].length)
    var incr = n.length == 3
      ? Math.abs(numeric(n[2]))
      : 1;
    var test = lte;
    var reverse = y < x;
    if (reverse) {
      incr *= -1;
      test = gte;
    }
    var pad = n.some(isPadded);

    N = [];

    for (var i = x; test(i, y); i += incr) {
      var c;
      if (isAlphaSequence) {
        c = String.fromCharCode(i);
        if (c === '\\')
          c = '';
      } else {
        c = String(i);
        if (pad) {
          var need = width - c.length;
          if (need > 0) {
            var z = new Array(need + 1).join('0');
            if (i < 0)
              c = '-' + z + c.slice(1);
            else
              c = z + c;
          }
        }
      }
      N.push(c);
    }
  } else {
    N = concatMap(n, function(el) { return expand(el, false) });
  }

  for (var j = 0; j < N.length; j++) {
    for (var k = 0; k < post.length; k++) {
      var expansion = pre + N[j] + post[k];
      if (!isTop || isSequence || expansion)
        expansions.push(expansion);
    }
  }

  return expansions;
}



/***/ }),

/***/ 6891:
/***/ ((module) => {

module.exports = function (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        var x = fn(xs[i], i);
        if (isArray(x)) res.push.apply(res, x);
        else res.push(x);
    }
    return res;
};

var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),

/***/ 6863:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = realpath
realpath.realpath = realpath
realpath.sync = realpathSync
realpath.realpathSync = realpathSync
realpath.monkeypatch = monkeypatch
realpath.unmonkeypatch = unmonkeypatch

var fs = __nccwpck_require__(7147)
var origRealpath = fs.realpath
var origRealpathSync = fs.realpathSync

var version = process.version
var ok = /^v[0-5]\./.test(version)
var old = __nccwpck_require__(1734)

function newError (er) {
  return er && er.syscall === 'realpath' && (
    er.code === 'ELOOP' ||
    er.code === 'ENOMEM' ||
    er.code === 'ENAMETOOLONG'
  )
}

function realpath (p, cache, cb) {
  if (ok) {
    return origRealpath(p, cache, cb)
  }

  if (typeof cache === 'function') {
    cb = cache
    cache = null
  }
  origRealpath(p, cache, function (er, result) {
    if (newError(er)) {
      old.realpath(p, cache, cb)
    } else {
      cb(er, result)
    }
  })
}

function realpathSync (p, cache) {
  if (ok) {
    return origRealpathSync(p, cache)
  }

  try {
    return origRealpathSync(p, cache)
  } catch (er) {
    if (newError(er)) {
      return old.realpathSync(p, cache)
    } else {
      throw er
    }
  }
}

function monkeypatch () {
  fs.realpath = realpath
  fs.realpathSync = realpathSync
}

function unmonkeypatch () {
  fs.realpath = origRealpath
  fs.realpathSync = origRealpathSync
}


/***/ }),

/***/ 1734:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var pathModule = __nccwpck_require__(1017);
var isWindows = process.platform === 'win32';
var fs = __nccwpck_require__(7147);

// JavaScript implementation of realpath, ported from node pre-v6

var DEBUG = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);

function rethrow() {
  // Only enable in debug mode. A backtrace uses ~1000 bytes of heap space and
  // is fairly slow to generate.
  var callback;
  if (DEBUG) {
    var backtrace = new Error;
    callback = debugCallback;
  } else
    callback = missingCallback;

  return callback;

  function debugCallback(err) {
    if (err) {
      backtrace.message = err.message;
      err = backtrace;
      missingCallback(err);
    }
  }

  function missingCallback(err) {
    if (err) {
      if (process.throwDeprecation)
        throw err;  // Forgot a callback but don't know where? Use NODE_DEBUG=fs
      else if (!process.noDeprecation) {
        var msg = 'fs: missing callback ' + (err.stack || err.message);
        if (process.traceDeprecation)
          console.trace(msg);
        else
          console.error(msg);
      }
    }
  }
}

function maybeCallback(cb) {
  return typeof cb === 'function' ? cb : rethrow();
}

var normalize = pathModule.normalize;

// Regexp that finds the next partion of a (partial) path
// result is [base_with_slash, base], e.g. ['somedir/', 'somedir']
if (isWindows) {
  var nextPartRe = /(.*?)(?:[\/\\]+|$)/g;
} else {
  var nextPartRe = /(.*?)(?:[\/]+|$)/g;
}

// Regex to find the device root, including trailing slash. E.g. 'c:\\'.
if (isWindows) {
  var splitRootRe = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
} else {
  var splitRootRe = /^[\/]*/;
}

exports.realpathSync = function realpathSync(p, cache) {
  // make p is absolute
  p = pathModule.resolve(p);

  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
    return cache[p];
  }

  var original = p,
      seenLinks = {},
      knownHard = {};

  // current character position in p
  var pos;
  // the partial path so far, including a trailing slash if any
  var current;
  // the partial path without a trailing slash (except when pointing at a root)
  var base;
  // the partial path scanned in the previous round, with slash
  var previous;

  start();

  function start() {
    // Skip over roots
    var m = splitRootRe.exec(p);
    pos = m[0].length;
    current = m[0];
    base = m[0];
    previous = '';

    // On windows, check that the root exists. On unix there is no need.
    if (isWindows && !knownHard[base]) {
      fs.lstatSync(base);
      knownHard[base] = true;
    }
  }

  // walk down the path, swapping out linked pathparts for their real
  // values
  // NB: p.length changes.
  while (pos < p.length) {
    // find the next part
    nextPartRe.lastIndex = pos;
    var result = nextPartRe.exec(p);
    previous = current;
    current += result[0];
    base = previous + result[1];
    pos = nextPartRe.lastIndex;

    // continue if not a symlink
    if (knownHard[base] || (cache && cache[base] === base)) {
      continue;
    }

    var resolvedLink;
    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
      // some known symbolic link.  no need to stat again.
      resolvedLink = cache[base];
    } else {
      var stat = fs.lstatSync(base);
      if (!stat.isSymbolicLink()) {
        knownHard[base] = true;
        if (cache) cache[base] = base;
        continue;
      }

      // read the link if it wasn't read before
      // dev/ino always return 0 on windows, so skip the check.
      var linkTarget = null;
      if (!isWindows) {
        var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
        if (seenLinks.hasOwnProperty(id)) {
          linkTarget = seenLinks[id];
        }
      }
      if (linkTarget === null) {
        fs.statSync(base);
        linkTarget = fs.readlinkSync(base);
      }
      resolvedLink = pathModule.resolve(previous, linkTarget);
      // track this, if given a cache.
      if (cache) cache[base] = resolvedLink;
      if (!isWindows) seenLinks[id] = linkTarget;
    }

    // resolve the link, then start over
    p = pathModule.resolve(resolvedLink, p.slice(pos));
    start();
  }

  if (cache) cache[original] = p;

  return p;
};


exports.realpath = function realpath(p, cache, cb) {
  if (typeof cb !== 'function') {
    cb = maybeCallback(cache);
    cache = null;
  }

  // make p is absolute
  p = pathModule.resolve(p);

  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
    return process.nextTick(cb.bind(null, null, cache[p]));
  }

  var original = p,
      seenLinks = {},
      knownHard = {};

  // current character position in p
  var pos;
  // the partial path so far, including a trailing slash if any
  var current;
  // the partial path without a trailing slash (except when pointing at a root)
  var base;
  // the partial path scanned in the previous round, with slash
  var previous;

  start();

  function start() {
    // Skip over roots
    var m = splitRootRe.exec(p);
    pos = m[0].length;
    current = m[0];
    base = m[0];
    previous = '';

    // On windows, check that the root exists. On unix there is no need.
    if (isWindows && !knownHard[base]) {
      fs.lstat(base, function(err) {
        if (err) return cb(err);
        knownHard[base] = true;
        LOOP();
      });
    } else {
      process.nextTick(LOOP);
    }
  }

  // walk down the path, swapping out linked pathparts for their real
  // values
  function LOOP() {
    // stop if scanned past end of path
    if (pos >= p.length) {
      if (cache) cache[original] = p;
      return cb(null, p);
    }

    // find the next part
    nextPartRe.lastIndex = pos;
    var result = nextPartRe.exec(p);
    previous = current;
    current += result[0];
    base = previous + result[1];
    pos = nextPartRe.lastIndex;

    // continue if not a symlink
    if (knownHard[base] || (cache && cache[base] === base)) {
      return process.nextTick(LOOP);
    }

    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
      // known symbolic link.  no need to stat again.
      return gotResolvedLink(cache[base]);
    }

    return fs.lstat(base, gotStat);
  }

  function gotStat(err, stat) {
    if (err) return cb(err);

    // if not a symlink, skip to the next path part
    if (!stat.isSymbolicLink()) {
      knownHard[base] = true;
      if (cache) cache[base] = base;
      return process.nextTick(LOOP);
    }

    // stat & read the link if not read before
    // call gotTarget as soon as the link target is known
    // dev/ino always return 0 on windows, so skip the check.
    if (!isWindows) {
      var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
      if (seenLinks.hasOwnProperty(id)) {
        return gotTarget(null, seenLinks[id], base);
      }
    }
    fs.stat(base, function(err) {
      if (err) return cb(err);

      fs.readlink(base, function(err, target) {
        if (!isWindows) seenLinks[id] = target;
        gotTarget(err, target);
      });
    });
  }

  function gotTarget(err, target, base) {
    if (err) return cb(err);

    var resolvedLink = pathModule.resolve(previous, target);
    if (cache) cache[base] = resolvedLink;
    gotResolvedLink(resolvedLink);
  }

  function gotResolvedLink(resolvedLink) {
    // resolve the link, then start over
    p = pathModule.resolve(resolvedLink, p.slice(pos));
    start();
  }
};


/***/ }),

/***/ 7625:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

exports.setopts = setopts
exports.ownProp = ownProp
exports.makeAbs = makeAbs
exports.finish = finish
exports.mark = mark
exports.isIgnored = isIgnored
exports.childrenIgnored = childrenIgnored

function ownProp (obj, field) {
  return Object.prototype.hasOwnProperty.call(obj, field)
}

var fs = __nccwpck_require__(7147)
var path = __nccwpck_require__(1017)
var minimatch = __nccwpck_require__(3973)
var isAbsolute = __nccwpck_require__(8714)
var Minimatch = minimatch.Minimatch

function alphasort (a, b) {
  return a.localeCompare(b, 'en')
}

function setupIgnores (self, options) {
  self.ignore = options.ignore || []

  if (!Array.isArray(self.ignore))
    self.ignore = [self.ignore]

  if (self.ignore.length) {
    self.ignore = self.ignore.map(ignoreMap)
  }
}

// ignore patterns are always in dot:true mode.
function ignoreMap (pattern) {
  var gmatcher = null
  if (pattern.slice(-3) === '/**') {
    var gpattern = pattern.replace(/(\/\*\*)+$/, '')
    gmatcher = new Minimatch(gpattern, { dot: true })
  }

  return {
    matcher: new Minimatch(pattern, { dot: true }),
    gmatcher: gmatcher
  }
}

function setopts (self, pattern, options) {
  if (!options)
    options = {}

  // base-matching: just use globstar for that.
  if (options.matchBase && -1 === pattern.indexOf("/")) {
    if (options.noglobstar) {
      throw new Error("base matching requires globstar")
    }
    pattern = "**/" + pattern
  }

  self.silent = !!options.silent
  self.pattern = pattern
  self.strict = options.strict !== false
  self.realpath = !!options.realpath
  self.realpathCache = options.realpathCache || Object.create(null)
  self.follow = !!options.follow
  self.dot = !!options.dot
  self.mark = !!options.mark
  self.nodir = !!options.nodir
  if (self.nodir)
    self.mark = true
  self.sync = !!options.sync
  self.nounique = !!options.nounique
  self.nonull = !!options.nonull
  self.nosort = !!options.nosort
  self.nocase = !!options.nocase
  self.stat = !!options.stat
  self.noprocess = !!options.noprocess
  self.absolute = !!options.absolute
  self.fs = options.fs || fs

  self.maxLength = options.maxLength || Infinity
  self.cache = options.cache || Object.create(null)
  self.statCache = options.statCache || Object.create(null)
  self.symlinks = options.symlinks || Object.create(null)

  setupIgnores(self, options)

  self.changedCwd = false
  var cwd = process.cwd()
  if (!ownProp(options, "cwd"))
    self.cwd = cwd
  else {
    self.cwd = path.resolve(options.cwd)
    self.changedCwd = self.cwd !== cwd
  }

  self.root = options.root || path.resolve(self.cwd, "/")
  self.root = path.resolve(self.root)
  if (process.platform === "win32")
    self.root = self.root.replace(/\\/g, "/")

  // TODO: is an absolute `cwd` supposed to be resolved against `root`?
  // e.g. { cwd: '/test', root: __dirname } === path.join(__dirname, '/test')
  self.cwdAbs = isAbsolute(self.cwd) ? self.cwd : makeAbs(self, self.cwd)
  if (process.platform === "win32")
    self.cwdAbs = self.cwdAbs.replace(/\\/g, "/")
  self.nomount = !!options.nomount

  // disable comments and negation in Minimatch.
  // Note that they are not supported in Glob itself anyway.
  options.nonegate = true
  options.nocomment = true
  // always treat \ in patterns as escapes, not path separators
  options.allowWindowsEscape = false

  self.minimatch = new Minimatch(pattern, options)
  self.options = self.minimatch.options
}

function finish (self) {
  var nou = self.nounique
  var all = nou ? [] : Object.create(null)

  for (var i = 0, l = self.matches.length; i < l; i ++) {
    var matches = self.matches[i]
    if (!matches || Object.keys(matches).length === 0) {
      if (self.nonull) {
        // do like the shell, and spit out the literal glob
        var literal = self.minimatch.globSet[i]
        if (nou)
          all.push(literal)
        else
          all[literal] = true
      }
    } else {
      // had matches
      var m = Object.keys(matches)
      if (nou)
        all.push.apply(all, m)
      else
        m.forEach(function (m) {
          all[m] = true
        })
    }
  }

  if (!nou)
    all = Object.keys(all)

  if (!self.nosort)
    all = all.sort(alphasort)

  // at *some* point we statted all of these
  if (self.mark) {
    for (var i = 0; i < all.length; i++) {
      all[i] = self._mark(all[i])
    }
    if (self.nodir) {
      all = all.filter(function (e) {
        var notDir = !(/\/$/.test(e))
        var c = self.cache[e] || self.cache[makeAbs(self, e)]
        if (notDir && c)
          notDir = c !== 'DIR' && !Array.isArray(c)
        return notDir
      })
    }
  }

  if (self.ignore.length)
    all = all.filter(function(m) {
      return !isIgnored(self, m)
    })

  self.found = all
}

function mark (self, p) {
  var abs = makeAbs(self, p)
  var c = self.cache[abs]
  var m = p
  if (c) {
    var isDir = c === 'DIR' || Array.isArray(c)
    var slash = p.slice(-1) === '/'

    if (isDir && !slash)
      m += '/'
    else if (!isDir && slash)
      m = m.slice(0, -1)

    if (m !== p) {
      var mabs = makeAbs(self, m)
      self.statCache[mabs] = self.statCache[abs]
      self.cache[mabs] = self.cache[abs]
    }
  }

  return m
}

// lotta situps...
function makeAbs (self, f) {
  var abs = f
  if (f.charAt(0) === '/') {
    abs = path.join(self.root, f)
  } else if (isAbsolute(f) || f === '') {
    abs = f
  } else if (self.changedCwd) {
    abs = path.resolve(self.cwd, f)
  } else {
    abs = path.resolve(f)
  }

  if (process.platform === 'win32')
    abs = abs.replace(/\\/g, '/')

  return abs
}


// Return true, if pattern ends with globstar '**', for the accompanying parent directory.
// Ex:- If node_modules/** is the pattern, add 'node_modules' to ignore list along with it's contents
function isIgnored (self, path) {
  if (!self.ignore.length)
    return false

  return self.ignore.some(function(item) {
    return item.matcher.match(path) || !!(item.gmatcher && item.gmatcher.match(path))
  })
}

function childrenIgnored (self, path) {
  if (!self.ignore.length)
    return false

  return self.ignore.some(function(item) {
    return !!(item.gmatcher && item.gmatcher.match(path))
  })
}


/***/ }),

/***/ 1957:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Approach:
//
// 1. Get the minimatch set
// 2. For each pattern in the set, PROCESS(pattern, false)
// 3. Store matches per-set, then uniq them
//
// PROCESS(pattern, inGlobStar)
// Get the first [n] items from pattern that are all strings
// Join these together.  This is PREFIX.
//   If there is no more remaining, then stat(PREFIX) and
//   add to matches if it succeeds.  END.
//
// If inGlobStar and PREFIX is symlink and points to dir
//   set ENTRIES = []
// else readdir(PREFIX) as ENTRIES
//   If fail, END
//
// with ENTRIES
//   If pattern[n] is GLOBSTAR
//     // handle the case where the globstar match is empty
//     // by pruning it out, and testing the resulting pattern
//     PROCESS(pattern[0..n] + pattern[n+1 .. $], false)
//     // handle other cases.
//     for ENTRY in ENTRIES (not dotfiles)
//       // attach globstar + tail onto the entry
//       // Mark that this entry is a globstar match
//       PROCESS(pattern[0..n] + ENTRY + pattern[n .. $], true)
//
//   else // not globstar
//     for ENTRY in ENTRIES (not dotfiles, unless pattern[n] is dot)
//       Test ENTRY against pattern[n]
//       If fails, continue
//       If passes, PROCESS(pattern[0..n] + item + pattern[n+1 .. $])
//
// Caveat:
//   Cache all stats and readdirs results to minimize syscall.  Since all
//   we ever care about is existence and directory-ness, we can just keep
//   `true` for files, and [children,...] for directories, or `false` for
//   things that don't exist.

module.exports = glob

var rp = __nccwpck_require__(6863)
var minimatch = __nccwpck_require__(3973)
var Minimatch = minimatch.Minimatch
var inherits = __nccwpck_require__(4124)
var EE = (__nccwpck_require__(2361).EventEmitter)
var path = __nccwpck_require__(1017)
var assert = __nccwpck_require__(9491)
var isAbsolute = __nccwpck_require__(8714)
var globSync = __nccwpck_require__(9010)
var common = __nccwpck_require__(7625)
var setopts = common.setopts
var ownProp = common.ownProp
var inflight = __nccwpck_require__(2492)
var util = __nccwpck_require__(3837)
var childrenIgnored = common.childrenIgnored
var isIgnored = common.isIgnored

var once = __nccwpck_require__(1223)

function glob (pattern, options, cb) {
  if (typeof options === 'function') cb = options, options = {}
  if (!options) options = {}

  if (options.sync) {
    if (cb)
      throw new TypeError('callback provided to sync glob')
    return globSync(pattern, options)
  }

  return new Glob(pattern, options, cb)
}

glob.sync = globSync
var GlobSync = glob.GlobSync = globSync.GlobSync

// old api surface
glob.glob = glob

function extend (origin, add) {
  if (add === null || typeof add !== 'object') {
    return origin
  }

  var keys = Object.keys(add)
  var i = keys.length
  while (i--) {
    origin[keys[i]] = add[keys[i]]
  }
  return origin
}

glob.hasMagic = function (pattern, options_) {
  var options = extend({}, options_)
  options.noprocess = true

  var g = new Glob(pattern, options)
  var set = g.minimatch.set

  if (!pattern)
    return false

  if (set.length > 1)
    return true

  for (var j = 0; j < set[0].length; j++) {
    if (typeof set[0][j] !== 'string')
      return true
  }

  return false
}

glob.Glob = Glob
inherits(Glob, EE)
function Glob (pattern, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = null
  }

  if (options && options.sync) {
    if (cb)
      throw new TypeError('callback provided to sync glob')
    return new GlobSync(pattern, options)
  }

  if (!(this instanceof Glob))
    return new Glob(pattern, options, cb)

  setopts(this, pattern, options)
  this._didRealPath = false

  // process each pattern in the minimatch set
  var n = this.minimatch.set.length

  // The matches are stored as {<filename>: true,...} so that
  // duplicates are automagically pruned.
  // Later, we do an Object.keys() on these.
  // Keep them as a list so we can fill in when nonull is set.
  this.matches = new Array(n)

  if (typeof cb === 'function') {
    cb = once(cb)
    this.on('error', cb)
    this.on('end', function (matches) {
      cb(null, matches)
    })
  }

  var self = this
  this._processing = 0

  this._emitQueue = []
  this._processQueue = []
  this.paused = false

  if (this.noprocess)
    return this

  if (n === 0)
    return done()

  var sync = true
  for (var i = 0; i < n; i ++) {
    this._process(this.minimatch.set[i], i, false, done)
  }
  sync = false

  function done () {
    --self._processing
    if (self._processing <= 0) {
      if (sync) {
        process.nextTick(function () {
          self._finish()
        })
      } else {
        self._finish()
      }
    }
  }
}

Glob.prototype._finish = function () {
  assert(this instanceof Glob)
  if (this.aborted)
    return

  if (this.realpath && !this._didRealpath)
    return this._realpath()

  common.finish(this)
  this.emit('end', this.found)
}

Glob.prototype._realpath = function () {
  if (this._didRealpath)
    return

  this._didRealpath = true

  var n = this.matches.length
  if (n === 0)
    return this._finish()

  var self = this
  for (var i = 0; i < this.matches.length; i++)
    this._realpathSet(i, next)

  function next () {
    if (--n === 0)
      self._finish()
  }
}

Glob.prototype._realpathSet = function (index, cb) {
  var matchset = this.matches[index]
  if (!matchset)
    return cb()

  var found = Object.keys(matchset)
  var self = this
  var n = found.length

  if (n === 0)
    return cb()

  var set = this.matches[index] = Object.create(null)
  found.forEach(function (p, i) {
    // If there's a problem with the stat, then it means that
    // one or more of the links in the realpath couldn't be
    // resolved.  just return the abs value in that case.
    p = self._makeAbs(p)
    rp.realpath(p, self.realpathCache, function (er, real) {
      if (!er)
        set[real] = true
      else if (er.syscall === 'stat')
        set[p] = true
      else
        self.emit('error', er) // srsly wtf right here

      if (--n === 0) {
        self.matches[index] = set
        cb()
      }
    })
  })
}

Glob.prototype._mark = function (p) {
  return common.mark(this, p)
}

Glob.prototype._makeAbs = function (f) {
  return common.makeAbs(this, f)
}

Glob.prototype.abort = function () {
  this.aborted = true
  this.emit('abort')
}

Glob.prototype.pause = function () {
  if (!this.paused) {
    this.paused = true
    this.emit('pause')
  }
}

Glob.prototype.resume = function () {
  if (this.paused) {
    this.emit('resume')
    this.paused = false
    if (this._emitQueue.length) {
      var eq = this._emitQueue.slice(0)
      this._emitQueue.length = 0
      for (var i = 0; i < eq.length; i ++) {
        var e = eq[i]
        this._emitMatch(e[0], e[1])
      }
    }
    if (this._processQueue.length) {
      var pq = this._processQueue.slice(0)
      this._processQueue.length = 0
      for (var i = 0; i < pq.length; i ++) {
        var p = pq[i]
        this._processing--
        this._process(p[0], p[1], p[2], p[3])
      }
    }
  }
}

Glob.prototype._process = function (pattern, index, inGlobStar, cb) {
  assert(this instanceof Glob)
  assert(typeof cb === 'function')

  if (this.aborted)
    return

  this._processing++
  if (this.paused) {
    this._processQueue.push([pattern, index, inGlobStar, cb])
    return
  }

  //console.error('PROCESS %d', this._processing, pattern)

  // Get the first [n] parts of pattern that are all strings.
  var n = 0
  while (typeof pattern[n] === 'string') {
    n ++
  }
  // now n is the index of the first one that is *not* a string.

  // see if there's anything else
  var prefix
  switch (n) {
    // if not, then this is rather simple
    case pattern.length:
      this._processSimple(pattern.join('/'), index, cb)
      return

    case 0:
      // pattern *starts* with some non-trivial item.
      // going to readdir(cwd), but not include the prefix in matches.
      prefix = null
      break

    default:
      // pattern has some string bits in the front.
      // whatever it starts with, whether that's 'absolute' like /foo/bar,
      // or 'relative' like '../baz'
      prefix = pattern.slice(0, n).join('/')
      break
  }

  var remain = pattern.slice(n)

  // get the list of entries.
  var read
  if (prefix === null)
    read = '.'
  else if (isAbsolute(prefix) ||
      isAbsolute(pattern.map(function (p) {
        return typeof p === 'string' ? p : '[*]'
      }).join('/'))) {
    if (!prefix || !isAbsolute(prefix))
      prefix = '/' + prefix
    read = prefix
  } else
    read = prefix

  var abs = this._makeAbs(read)

  //if ignored, skip _processing
  if (childrenIgnored(this, read))
    return cb()

  var isGlobStar = remain[0] === minimatch.GLOBSTAR
  if (isGlobStar)
    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar, cb)
  else
    this._processReaddir(prefix, read, abs, remain, index, inGlobStar, cb)
}

Glob.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar, cb) {
  var self = this
  this._readdir(abs, inGlobStar, function (er, entries) {
    return self._processReaddir2(prefix, read, abs, remain, index, inGlobStar, entries, cb)
  })
}

Glob.prototype._processReaddir2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {

  // if the abs isn't a dir, then nothing can match!
  if (!entries)
    return cb()

  // It will only match dot entries if it starts with a dot, or if
  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
  var pn = remain[0]
  var negate = !!this.minimatch.negate
  var rawGlob = pn._glob
  var dotOk = this.dot || rawGlob.charAt(0) === '.'

  var matchedEntries = []
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i]
    if (e.charAt(0) !== '.' || dotOk) {
      var m
      if (negate && !prefix) {
        m = !e.match(pn)
      } else {
        m = e.match(pn)
      }
      if (m)
        matchedEntries.push(e)
    }
  }

  //console.error('prd2', prefix, entries, remain[0]._glob, matchedEntries)

  var len = matchedEntries.length
  // If there are no matched entries, then nothing matches.
  if (len === 0)
    return cb()

  // if this is the last remaining pattern bit, then no need for
  // an additional stat *unless* the user has specified mark or
  // stat explicitly.  We know they exist, since readdir returned
  // them.

  if (remain.length === 1 && !this.mark && !this.stat) {
    if (!this.matches[index])
      this.matches[index] = Object.create(null)

    for (var i = 0; i < len; i ++) {
      var e = matchedEntries[i]
      if (prefix) {
        if (prefix !== '/')
          e = prefix + '/' + e
        else
          e = prefix + e
      }

      if (e.charAt(0) === '/' && !this.nomount) {
        e = path.join(this.root, e)
      }
      this._emitMatch(index, e)
    }
    // This was the last one, and no stats were needed
    return cb()
  }

  // now test all matched entries as stand-ins for that part
  // of the pattern.
  remain.shift()
  for (var i = 0; i < len; i ++) {
    var e = matchedEntries[i]
    var newPattern
    if (prefix) {
      if (prefix !== '/')
        e = prefix + '/' + e
      else
        e = prefix + e
    }
    this._process([e].concat(remain), index, inGlobStar, cb)
  }
  cb()
}

Glob.prototype._emitMatch = function (index, e) {
  if (this.aborted)
    return

  if (isIgnored(this, e))
    return

  if (this.paused) {
    this._emitQueue.push([index, e])
    return
  }

  var abs = isAbsolute(e) ? e : this._makeAbs(e)

  if (this.mark)
    e = this._mark(e)

  if (this.absolute)
    e = abs

  if (this.matches[index][e])
    return

  if (this.nodir) {
    var c = this.cache[abs]
    if (c === 'DIR' || Array.isArray(c))
      return
  }

  this.matches[index][e] = true

  var st = this.statCache[abs]
  if (st)
    this.emit('stat', e, st)

  this.emit('match', e)
}

Glob.prototype._readdirInGlobStar = function (abs, cb) {
  if (this.aborted)
    return

  // follow all symlinked directories forever
  // just proceed as if this is a non-globstar situation
  if (this.follow)
    return this._readdir(abs, false, cb)

  var lstatkey = 'lstat\0' + abs
  var self = this
  var lstatcb = inflight(lstatkey, lstatcb_)

  if (lstatcb)
    self.fs.lstat(abs, lstatcb)

  function lstatcb_ (er, lstat) {
    if (er && er.code === 'ENOENT')
      return cb()

    var isSym = lstat && lstat.isSymbolicLink()
    self.symlinks[abs] = isSym

    // If it's not a symlink or a dir, then it's definitely a regular file.
    // don't bother doing a readdir in that case.
    if (!isSym && lstat && !lstat.isDirectory()) {
      self.cache[abs] = 'FILE'
      cb()
    } else
      self._readdir(abs, false, cb)
  }
}

Glob.prototype._readdir = function (abs, inGlobStar, cb) {
  if (this.aborted)
    return

  cb = inflight('readdir\0'+abs+'\0'+inGlobStar, cb)
  if (!cb)
    return

  //console.error('RD %j %j', +inGlobStar, abs)
  if (inGlobStar && !ownProp(this.symlinks, abs))
    return this._readdirInGlobStar(abs, cb)

  if (ownProp(this.cache, abs)) {
    var c = this.cache[abs]
    if (!c || c === 'FILE')
      return cb()

    if (Array.isArray(c))
      return cb(null, c)
  }

  var self = this
  self.fs.readdir(abs, readdirCb(this, abs, cb))
}

function readdirCb (self, abs, cb) {
  return function (er, entries) {
    if (er)
      self._readdirError(abs, er, cb)
    else
      self._readdirEntries(abs, entries, cb)
  }
}

Glob.prototype._readdirEntries = function (abs, entries, cb) {
  if (this.aborted)
    return

  // if we haven't asked to stat everything, then just
  // assume that everything in there exists, so we can avoid
  // having to stat it a second time.
  if (!this.mark && !this.stat) {
    for (var i = 0; i < entries.length; i ++) {
      var e = entries[i]
      if (abs === '/')
        e = abs + e
      else
        e = abs + '/' + e
      this.cache[e] = true
    }
  }

  this.cache[abs] = entries
  return cb(null, entries)
}

Glob.prototype._readdirError = function (f, er, cb) {
  if (this.aborted)
    return

  // handle errors, and cache the information
  switch (er.code) {
    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
    case 'ENOTDIR': // totally normal. means it *does* exist.
      var abs = this._makeAbs(f)
      this.cache[abs] = 'FILE'
      if (abs === this.cwdAbs) {
        var error = new Error(er.code + ' invalid cwd ' + this.cwd)
        error.path = this.cwd
        error.code = er.code
        this.emit('error', error)
        this.abort()
      }
      break

    case 'ENOENT': // not terribly unusual
    case 'ELOOP':
    case 'ENAMETOOLONG':
    case 'UNKNOWN':
      this.cache[this._makeAbs(f)] = false
      break

    default: // some unusual error.  Treat as failure.
      this.cache[this._makeAbs(f)] = false
      if (this.strict) {
        this.emit('error', er)
        // If the error is handled, then we abort
        // if not, we threw out of here
        this.abort()
      }
      if (!this.silent)
        console.error('glob error', er)
      break
  }

  return cb()
}

Glob.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar, cb) {
  var self = this
  this._readdir(abs, inGlobStar, function (er, entries) {
    self._processGlobStar2(prefix, read, abs, remain, index, inGlobStar, entries, cb)
  })
}


Glob.prototype._processGlobStar2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {
  //console.error('pgs2', prefix, remain[0], entries)

  // no entries means not a dir, so it can never have matches
  // foo.txt/** doesn't match foo.txt
  if (!entries)
    return cb()

  // test without the globstar, and with every child both below
  // and replacing the globstar.
  var remainWithoutGlobStar = remain.slice(1)
  var gspref = prefix ? [ prefix ] : []
  var noGlobStar = gspref.concat(remainWithoutGlobStar)

  // the noGlobStar pattern exits the inGlobStar state
  this._process(noGlobStar, index, false, cb)

  var isSym = this.symlinks[abs]
  var len = entries.length

  // If it's a symlink, and we're in a globstar, then stop
  if (isSym && inGlobStar)
    return cb()

  for (var i = 0; i < len; i++) {
    var e = entries[i]
    if (e.charAt(0) === '.' && !this.dot)
      continue

    // these two cases enter the inGlobStar state
    var instead = gspref.concat(entries[i], remainWithoutGlobStar)
    this._process(instead, index, true, cb)

    var below = gspref.concat(entries[i], remain)
    this._process(below, index, true, cb)
  }

  cb()
}

Glob.prototype._processSimple = function (prefix, index, cb) {
  // XXX review this.  Shouldn't it be doing the mounting etc
  // before doing stat?  kinda weird?
  var self = this
  this._stat(prefix, function (er, exists) {
    self._processSimple2(prefix, index, er, exists, cb)
  })
}
Glob.prototype._processSimple2 = function (prefix, index, er, exists, cb) {

  //console.error('ps2', prefix, exists)

  if (!this.matches[index])
    this.matches[index] = Object.create(null)

  // If it doesn't exist, then just mark the lack of results
  if (!exists)
    return cb()

  if (prefix && isAbsolute(prefix) && !this.nomount) {
    var trail = /[\/\\]$/.test(prefix)
    if (prefix.charAt(0) === '/') {
      prefix = path.join(this.root, prefix)
    } else {
      prefix = path.resolve(this.root, prefix)
      if (trail)
        prefix += '/'
    }
  }

  if (process.platform === 'win32')
    prefix = prefix.replace(/\\/g, '/')

  // Mark this as a match
  this._emitMatch(index, prefix)
  cb()
}

// Returns either 'DIR', 'FILE', or false
Glob.prototype._stat = function (f, cb) {
  var abs = this._makeAbs(f)
  var needDir = f.slice(-1) === '/'

  if (f.length > this.maxLength)
    return cb()

  if (!this.stat && ownProp(this.cache, abs)) {
    var c = this.cache[abs]

    if (Array.isArray(c))
      c = 'DIR'

    // It exists, but maybe not how we need it
    if (!needDir || c === 'DIR')
      return cb(null, c)

    if (needDir && c === 'FILE')
      return cb()

    // otherwise we have to stat, because maybe c=true
    // if we know it exists, but not what it is.
  }

  var exists
  var stat = this.statCache[abs]
  if (stat !== undefined) {
    if (stat === false)
      return cb(null, stat)
    else {
      var type = stat.isDirectory() ? 'DIR' : 'FILE'
      if (needDir && type === 'FILE')
        return cb()
      else
        return cb(null, type, stat)
    }
  }

  var self = this
  var statcb = inflight('stat\0' + abs, lstatcb_)
  if (statcb)
    self.fs.lstat(abs, statcb)

  function lstatcb_ (er, lstat) {
    if (lstat && lstat.isSymbolicLink()) {
      // If it's a symlink, then treat it as the target, unless
      // the target does not exist, then treat it as a file.
      return self.fs.stat(abs, function (er, stat) {
        if (er)
          self._stat2(f, abs, null, lstat, cb)
        else
          self._stat2(f, abs, er, stat, cb)
      })
    } else {
      self._stat2(f, abs, er, lstat, cb)
    }
  }
}

Glob.prototype._stat2 = function (f, abs, er, stat, cb) {
  if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
    this.statCache[abs] = false
    return cb()
  }

  var needDir = f.slice(-1) === '/'
  this.statCache[abs] = stat

  if (abs.slice(-1) === '/' && stat && !stat.isDirectory())
    return cb(null, false, stat)

  var c = true
  if (stat)
    c = stat.isDirectory() ? 'DIR' : 'FILE'
  this.cache[abs] = this.cache[abs] || c

  if (needDir && c === 'FILE')
    return cb()

  return cb(null, c, stat)
}


/***/ }),

/***/ 9010:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = globSync
globSync.GlobSync = GlobSync

var rp = __nccwpck_require__(6863)
var minimatch = __nccwpck_require__(3973)
var Minimatch = minimatch.Minimatch
var Glob = (__nccwpck_require__(1957).Glob)
var util = __nccwpck_require__(3837)
var path = __nccwpck_require__(1017)
var assert = __nccwpck_require__(9491)
var isAbsolute = __nccwpck_require__(8714)
var common = __nccwpck_require__(7625)
var setopts = common.setopts
var ownProp = common.ownProp
var childrenIgnored = common.childrenIgnored
var isIgnored = common.isIgnored

function globSync (pattern, options) {
  if (typeof options === 'function' || arguments.length === 3)
    throw new TypeError('callback provided to sync glob\n'+
                        'See: https://github.com/isaacs/node-glob/issues/167')

  return new GlobSync(pattern, options).found
}

function GlobSync (pattern, options) {
  if (!pattern)
    throw new Error('must provide pattern')

  if (typeof options === 'function' || arguments.length === 3)
    throw new TypeError('callback provided to sync glob\n'+
                        'See: https://github.com/isaacs/node-glob/issues/167')

  if (!(this instanceof GlobSync))
    return new GlobSync(pattern, options)

  setopts(this, pattern, options)

  if (this.noprocess)
    return this

  var n = this.minimatch.set.length
  this.matches = new Array(n)
  for (var i = 0; i < n; i ++) {
    this._process(this.minimatch.set[i], i, false)
  }
  this._finish()
}

GlobSync.prototype._finish = function () {
  assert.ok(this instanceof GlobSync)
  if (this.realpath) {
    var self = this
    this.matches.forEach(function (matchset, index) {
      var set = self.matches[index] = Object.create(null)
      for (var p in matchset) {
        try {
          p = self._makeAbs(p)
          var real = rp.realpathSync(p, self.realpathCache)
          set[real] = true
        } catch (er) {
          if (er.syscall === 'stat')
            set[self._makeAbs(p)] = true
          else
            throw er
        }
      }
    })
  }
  common.finish(this)
}


GlobSync.prototype._process = function (pattern, index, inGlobStar) {
  assert.ok(this instanceof GlobSync)

  // Get the first [n] parts of pattern that are all strings.
  var n = 0
  while (typeof pattern[n] === 'string') {
    n ++
  }
  // now n is the index of the first one that is *not* a string.

  // See if there's anything else
  var prefix
  switch (n) {
    // if not, then this is rather simple
    case pattern.length:
      this._processSimple(pattern.join('/'), index)
      return

    case 0:
      // pattern *starts* with some non-trivial item.
      // going to readdir(cwd), but not include the prefix in matches.
      prefix = null
      break

    default:
      // pattern has some string bits in the front.
      // whatever it starts with, whether that's 'absolute' like /foo/bar,
      // or 'relative' like '../baz'
      prefix = pattern.slice(0, n).join('/')
      break
  }

  var remain = pattern.slice(n)

  // get the list of entries.
  var read
  if (prefix === null)
    read = '.'
  else if (isAbsolute(prefix) ||
      isAbsolute(pattern.map(function (p) {
        return typeof p === 'string' ? p : '[*]'
      }).join('/'))) {
    if (!prefix || !isAbsolute(prefix))
      prefix = '/' + prefix
    read = prefix
  } else
    read = prefix

  var abs = this._makeAbs(read)

  //if ignored, skip processing
  if (childrenIgnored(this, read))
    return

  var isGlobStar = remain[0] === minimatch.GLOBSTAR
  if (isGlobStar)
    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar)
  else
    this._processReaddir(prefix, read, abs, remain, index, inGlobStar)
}


GlobSync.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar) {
  var entries = this._readdir(abs, inGlobStar)

  // if the abs isn't a dir, then nothing can match!
  if (!entries)
    return

  // It will only match dot entries if it starts with a dot, or if
  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
  var pn = remain[0]
  var negate = !!this.minimatch.negate
  var rawGlob = pn._glob
  var dotOk = this.dot || rawGlob.charAt(0) === '.'

  var matchedEntries = []
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i]
    if (e.charAt(0) !== '.' || dotOk) {
      var m
      if (negate && !prefix) {
        m = !e.match(pn)
      } else {
        m = e.match(pn)
      }
      if (m)
        matchedEntries.push(e)
    }
  }

  var len = matchedEntries.length
  // If there are no matched entries, then nothing matches.
  if (len === 0)
    return

  // if this is the last remaining pattern bit, then no need for
  // an additional stat *unless* the user has specified mark or
  // stat explicitly.  We know they exist, since readdir returned
  // them.

  if (remain.length === 1 && !this.mark && !this.stat) {
    if (!this.matches[index])
      this.matches[index] = Object.create(null)

    for (var i = 0; i < len; i ++) {
      var e = matchedEntries[i]
      if (prefix) {
        if (prefix.slice(-1) !== '/')
          e = prefix + '/' + e
        else
          e = prefix + e
      }

      if (e.charAt(0) === '/' && !this.nomount) {
        e = path.join(this.root, e)
      }
      this._emitMatch(index, e)
    }
    // This was the last one, and no stats were needed
    return
  }

  // now test all matched entries as stand-ins for that part
  // of the pattern.
  remain.shift()
  for (var i = 0; i < len; i ++) {
    var e = matchedEntries[i]
    var newPattern
    if (prefix)
      newPattern = [prefix, e]
    else
      newPattern = [e]
    this._process(newPattern.concat(remain), index, inGlobStar)
  }
}


GlobSync.prototype._emitMatch = function (index, e) {
  if (isIgnored(this, e))
    return

  var abs = this._makeAbs(e)

  if (this.mark)
    e = this._mark(e)

  if (this.absolute) {
    e = abs
  }

  if (this.matches[index][e])
    return

  if (this.nodir) {
    var c = this.cache[abs]
    if (c === 'DIR' || Array.isArray(c))
      return
  }

  this.matches[index][e] = true

  if (this.stat)
    this._stat(e)
}


GlobSync.prototype._readdirInGlobStar = function (abs) {
  // follow all symlinked directories forever
  // just proceed as if this is a non-globstar situation
  if (this.follow)
    return this._readdir(abs, false)

  var entries
  var lstat
  var stat
  try {
    lstat = this.fs.lstatSync(abs)
  } catch (er) {
    if (er.code === 'ENOENT') {
      // lstat failed, doesn't exist
      return null
    }
  }

  var isSym = lstat && lstat.isSymbolicLink()
  this.symlinks[abs] = isSym

  // If it's not a symlink or a dir, then it's definitely a regular file.
  // don't bother doing a readdir in that case.
  if (!isSym && lstat && !lstat.isDirectory())
    this.cache[abs] = 'FILE'
  else
    entries = this._readdir(abs, false)

  return entries
}

GlobSync.prototype._readdir = function (abs, inGlobStar) {
  var entries

  if (inGlobStar && !ownProp(this.symlinks, abs))
    return this._readdirInGlobStar(abs)

  if (ownProp(this.cache, abs)) {
    var c = this.cache[abs]
    if (!c || c === 'FILE')
      return null

    if (Array.isArray(c))
      return c
  }

  try {
    return this._readdirEntries(abs, this.fs.readdirSync(abs))
  } catch (er) {
    this._readdirError(abs, er)
    return null
  }
}

GlobSync.prototype._readdirEntries = function (abs, entries) {
  // if we haven't asked to stat everything, then just
  // assume that everything in there exists, so we can avoid
  // having to stat it a second time.
  if (!this.mark && !this.stat) {
    for (var i = 0; i < entries.length; i ++) {
      var e = entries[i]
      if (abs === '/')
        e = abs + e
      else
        e = abs + '/' + e
      this.cache[e] = true
    }
  }

  this.cache[abs] = entries

  // mark and cache dir-ness
  return entries
}

GlobSync.prototype._readdirError = function (f, er) {
  // handle errors, and cache the information
  switch (er.code) {
    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
    case 'ENOTDIR': // totally normal. means it *does* exist.
      var abs = this._makeAbs(f)
      this.cache[abs] = 'FILE'
      if (abs === this.cwdAbs) {
        var error = new Error(er.code + ' invalid cwd ' + this.cwd)
        error.path = this.cwd
        error.code = er.code
        throw error
      }
      break

    case 'ENOENT': // not terribly unusual
    case 'ELOOP':
    case 'ENAMETOOLONG':
    case 'UNKNOWN':
      this.cache[this._makeAbs(f)] = false
      break

    default: // some unusual error.  Treat as failure.
      this.cache[this._makeAbs(f)] = false
      if (this.strict)
        throw er
      if (!this.silent)
        console.error('glob error', er)
      break
  }
}

GlobSync.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar) {

  var entries = this._readdir(abs, inGlobStar)

  // no entries means not a dir, so it can never have matches
  // foo.txt/** doesn't match foo.txt
  if (!entries)
    return

  // test without the globstar, and with every child both below
  // and replacing the globstar.
  var remainWithoutGlobStar = remain.slice(1)
  var gspref = prefix ? [ prefix ] : []
  var noGlobStar = gspref.concat(remainWithoutGlobStar)

  // the noGlobStar pattern exits the inGlobStar state
  this._process(noGlobStar, index, false)

  var len = entries.length
  var isSym = this.symlinks[abs]

  // If it's a symlink, and we're in a globstar, then stop
  if (isSym && inGlobStar)
    return

  for (var i = 0; i < len; i++) {
    var e = entries[i]
    if (e.charAt(0) === '.' && !this.dot)
      continue

    // these two cases enter the inGlobStar state
    var instead = gspref.concat(entries[i], remainWithoutGlobStar)
    this._process(instead, index, true)

    var below = gspref.concat(entries[i], remain)
    this._process(below, index, true)
  }
}

GlobSync.prototype._processSimple = function (prefix, index) {
  // XXX review this.  Shouldn't it be doing the mounting etc
  // before doing stat?  kinda weird?
  var exists = this._stat(prefix)

  if (!this.matches[index])
    this.matches[index] = Object.create(null)

  // If it doesn't exist, then just mark the lack of results
  if (!exists)
    return

  if (prefix && isAbsolute(prefix) && !this.nomount) {
    var trail = /[\/\\]$/.test(prefix)
    if (prefix.charAt(0) === '/') {
      prefix = path.join(this.root, prefix)
    } else {
      prefix = path.resolve(this.root, prefix)
      if (trail)
        prefix += '/'
    }
  }

  if (process.platform === 'win32')
    prefix = prefix.replace(/\\/g, '/')

  // Mark this as a match
  this._emitMatch(index, prefix)
}

// Returns either 'DIR', 'FILE', or false
GlobSync.prototype._stat = function (f) {
  var abs = this._makeAbs(f)
  var needDir = f.slice(-1) === '/'

  if (f.length > this.maxLength)
    return false

  if (!this.stat && ownProp(this.cache, abs)) {
    var c = this.cache[abs]

    if (Array.isArray(c))
      c = 'DIR'

    // It exists, but maybe not how we need it
    if (!needDir || c === 'DIR')
      return c

    if (needDir && c === 'FILE')
      return false

    // otherwise we have to stat, because maybe c=true
    // if we know it exists, but not what it is.
  }

  var exists
  var stat = this.statCache[abs]
  if (!stat) {
    var lstat
    try {
      lstat = this.fs.lstatSync(abs)
    } catch (er) {
      if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
        this.statCache[abs] = false
        return false
      }
    }

    if (lstat && lstat.isSymbolicLink()) {
      try {
        stat = this.fs.statSync(abs)
      } catch (er) {
        stat = lstat
      }
    } else {
      stat = lstat
    }
  }

  this.statCache[abs] = stat

  var c = true
  if (stat)
    c = stat.isDirectory() ? 'DIR' : 'FILE'

  this.cache[abs] = this.cache[abs] || c

  if (needDir && c === 'FILE')
    return false

  return c
}

GlobSync.prototype._mark = function (p) {
  return common.mark(this, p)
}

GlobSync.prototype._makeAbs = function (f) {
  return common.makeAbs(this, f)
}


/***/ }),

/***/ 2492:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var wrappy = __nccwpck_require__(2940)
var reqs = Object.create(null)
var once = __nccwpck_require__(1223)

module.exports = wrappy(inflight)

function inflight (key, cb) {
  if (reqs[key]) {
    reqs[key].push(cb)
    return null
  } else {
    reqs[key] = [cb]
    return makeres(key)
  }
}

function makeres (key) {
  return once(function RES () {
    var cbs = reqs[key]
    var len = cbs.length
    var args = slice(arguments)

    // XXX It's somewhat ambiguous whether a new callback added in this
    // pass should be queued for later execution if something in the
    // list of callbacks throws, or if it should just be discarded.
    // However, it's such an edge case that it hardly matters, and either
    // choice is likely as surprising as the other.
    // As it happens, we do go ahead and schedule it for later execution.
    try {
      for (var i = 0; i < len; i++) {
        cbs[i].apply(null, args)
      }
    } finally {
      if (cbs.length > len) {
        // added more in the interim.
        // de-zalgo, just in case, but don't call again.
        cbs.splice(0, len)
        process.nextTick(function () {
          RES.apply(null, args)
        })
      } else {
        delete reqs[key]
      }
    }
  })
}

function slice (args) {
  var length = args.length
  var array = []

  for (var i = 0; i < length; i++) array[i] = args[i]
  return array
}


/***/ }),

/***/ 4124:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

try {
  var util = __nccwpck_require__(3837);
  /* istanbul ignore next */
  if (typeof util.inherits !== 'function') throw '';
  module.exports = util.inherits;
} catch (e) {
  /* istanbul ignore next */
  module.exports = __nccwpck_require__(8544);
}


/***/ }),

/***/ 8544:
/***/ ((module) => {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}


/***/ }),

/***/ 3973:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = minimatch
minimatch.Minimatch = Minimatch

var path = (function () { try { return __nccwpck_require__(1017) } catch (e) {}}()) || {
  sep: '/'
}
minimatch.sep = path.sep

var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {}
var expand = __nccwpck_require__(3717)

var plTypes = {
  '!': { open: '(?:(?!(?:', close: '))[^/]*?)'},
  '?': { open: '(?:', close: ')?' },
  '+': { open: '(?:', close: ')+' },
  '*': { open: '(?:', close: ')*' },
  '@': { open: '(?:', close: ')' }
}

// any single thing other than /
// don't need to escape / when using new RegExp()
var qmark = '[^/]'

// * => any number of characters
var star = qmark + '*?'

// ** when dots are allowed.  Anything goes, except .. and .
// not (^ or / followed by one or two dots followed by $ or /),
// followed by anything, any number of times.
var twoStarDot = '(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?'

// not a ^ or / followed by a dot,
// followed by anything, any number of times.
var twoStarNoDot = '(?:(?!(?:\\\/|^)\\.).)*?'

// characters that need to be escaped in RegExp.
var reSpecials = charSet('().*{}+?[]^$\\!')

// "abc" -> { a:true, b:true, c:true }
function charSet (s) {
  return s.split('').reduce(function (set, c) {
    set[c] = true
    return set
  }, {})
}

// normalizes slashes.
var slashSplit = /\/+/

minimatch.filter = filter
function filter (pattern, options) {
  options = options || {}
  return function (p, i, list) {
    return minimatch(p, pattern, options)
  }
}

function ext (a, b) {
  b = b || {}
  var t = {}
  Object.keys(a).forEach(function (k) {
    t[k] = a[k]
  })
  Object.keys(b).forEach(function (k) {
    t[k] = b[k]
  })
  return t
}

minimatch.defaults = function (def) {
  if (!def || typeof def !== 'object' || !Object.keys(def).length) {
    return minimatch
  }

  var orig = minimatch

  var m = function minimatch (p, pattern, options) {
    return orig(p, pattern, ext(def, options))
  }

  m.Minimatch = function Minimatch (pattern, options) {
    return new orig.Minimatch(pattern, ext(def, options))
  }
  m.Minimatch.defaults = function defaults (options) {
    return orig.defaults(ext(def, options)).Minimatch
  }

  m.filter = function filter (pattern, options) {
    return orig.filter(pattern, ext(def, options))
  }

  m.defaults = function defaults (options) {
    return orig.defaults(ext(def, options))
  }

  m.makeRe = function makeRe (pattern, options) {
    return orig.makeRe(pattern, ext(def, options))
  }

  m.braceExpand = function braceExpand (pattern, options) {
    return orig.braceExpand(pattern, ext(def, options))
  }

  m.match = function (list, pattern, options) {
    return orig.match(list, pattern, ext(def, options))
  }

  return m
}

Minimatch.defaults = function (def) {
  return minimatch.defaults(def).Minimatch
}

function minimatch (p, pattern, options) {
  assertValidPattern(pattern)

  if (!options) options = {}

  // shortcut: comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    return false
  }

  return new Minimatch(pattern, options).match(p)
}

function Minimatch (pattern, options) {
  if (!(this instanceof Minimatch)) {
    return new Minimatch(pattern, options)
  }

  assertValidPattern(pattern)

  if (!options) options = {}

  pattern = pattern.trim()

  // windows support: need to use /, not \
  if (!options.allowWindowsEscape && path.sep !== '/') {
    pattern = pattern.split(path.sep).join('/')
  }

  this.options = options
  this.set = []
  this.pattern = pattern
  this.regexp = null
  this.negate = false
  this.comment = false
  this.empty = false
  this.partial = !!options.partial

  // make the set of regexps etc.
  this.make()
}

Minimatch.prototype.debug = function () {}

Minimatch.prototype.make = make
function make () {
  var pattern = this.pattern
  var options = this.options

  // empty patterns and comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    this.comment = true
    return
  }
  if (!pattern) {
    this.empty = true
    return
  }

  // step 1: figure out negation, etc.
  this.parseNegate()

  // step 2: expand braces
  var set = this.globSet = this.braceExpand()

  if (options.debug) this.debug = function debug() { console.error.apply(console, arguments) }

  this.debug(this.pattern, set)

  // step 3: now we have a set, so turn each one into a series of path-portion
  // matching patterns.
  // These will be regexps, except in the case of "**", which is
  // set to the GLOBSTAR object for globstar behavior,
  // and will not contain any / characters
  set = this.globParts = set.map(function (s) {
    return s.split(slashSplit)
  })

  this.debug(this.pattern, set)

  // glob --> regexps
  set = set.map(function (s, si, set) {
    return s.map(this.parse, this)
  }, this)

  this.debug(this.pattern, set)

  // filter out everything that didn't compile properly.
  set = set.filter(function (s) {
    return s.indexOf(false) === -1
  })

  this.debug(this.pattern, set)

  this.set = set
}

Minimatch.prototype.parseNegate = parseNegate
function parseNegate () {
  var pattern = this.pattern
  var negate = false
  var options = this.options
  var negateOffset = 0

  if (options.nonegate) return

  for (var i = 0, l = pattern.length
    ; i < l && pattern.charAt(i) === '!'
    ; i++) {
    negate = !negate
    negateOffset++
  }

  if (negateOffset) this.pattern = pattern.substr(negateOffset)
  this.negate = negate
}

// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
minimatch.braceExpand = function (pattern, options) {
  return braceExpand(pattern, options)
}

Minimatch.prototype.braceExpand = braceExpand

function braceExpand (pattern, options) {
  if (!options) {
    if (this instanceof Minimatch) {
      options = this.options
    } else {
      options = {}
    }
  }

  pattern = typeof pattern === 'undefined'
    ? this.pattern : pattern

  assertValidPattern(pattern)

  // Thanks to Yeting Li <https://github.com/yetingli> for
  // improving this regexp to avoid a ReDOS vulnerability.
  if (options.nobrace || !/\{(?:(?!\{).)*\}/.test(pattern)) {
    // shortcut. no need to expand.
    return [pattern]
  }

  return expand(pattern)
}

var MAX_PATTERN_LENGTH = 1024 * 64
var assertValidPattern = function (pattern) {
  if (typeof pattern !== 'string') {
    throw new TypeError('invalid pattern')
  }

  if (pattern.length > MAX_PATTERN_LENGTH) {
    throw new TypeError('pattern is too long')
  }
}

// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.
//
// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.
Minimatch.prototype.parse = parse
var SUBPARSE = {}
function parse (pattern, isSub) {
  assertValidPattern(pattern)

  var options = this.options

  // shortcuts
  if (pattern === '**') {
    if (!options.noglobstar)
      return GLOBSTAR
    else
      pattern = '*'
  }
  if (pattern === '') return ''

  var re = ''
  var hasMagic = !!options.nocase
  var escaping = false
  // ? => one single character
  var patternListStack = []
  var negativeLists = []
  var stateChar
  var inClass = false
  var reClassStart = -1
  var classStart = -1
  // . and .. never match anything that doesn't start with .,
  // even when options.dot is set.
  var patternStart = pattern.charAt(0) === '.' ? '' // anything
  // not (start or / followed by . or .. followed by / or end)
  : options.dot ? '(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))'
  : '(?!\\.)'
  var self = this

  function clearStateChar () {
    if (stateChar) {
      // we had some state-tracking character
      // that wasn't consumed by this pass.
      switch (stateChar) {
        case '*':
          re += star
          hasMagic = true
        break
        case '?':
          re += qmark
          hasMagic = true
        break
        default:
          re += '\\' + stateChar
        break
      }
      self.debug('clearStateChar %j %j', stateChar, re)
      stateChar = false
    }
  }

  for (var i = 0, len = pattern.length, c
    ; (i < len) && (c = pattern.charAt(i))
    ; i++) {
    this.debug('%s\t%s %s %j', pattern, i, re, c)

    // skip over any that are escaped.
    if (escaping && reSpecials[c]) {
      re += '\\' + c
      escaping = false
      continue
    }

    switch (c) {
      /* istanbul ignore next */
      case '/': {
        // completely not allowed, even escaped.
        // Should already be path-split by now.
        return false
      }

      case '\\':
        clearStateChar()
        escaping = true
      continue

      // the various stateChar values
      // for the "extglob" stuff.
      case '?':
      case '*':
      case '+':
      case '@':
      case '!':
        this.debug('%s\t%s %s %j <-- stateChar', pattern, i, re, c)

        // all of those are literals inside a class, except that
        // the glob [!a] means [^a] in regexp
        if (inClass) {
          this.debug('  in class')
          if (c === '!' && i === classStart + 1) c = '^'
          re += c
          continue
        }

        // if we already have a stateChar, then it means
        // that there was something like ** or +? in there.
        // Handle the stateChar, then proceed with this one.
        self.debug('call clearStateChar %j', stateChar)
        clearStateChar()
        stateChar = c
        // if extglob is disabled, then +(asdf|foo) isn't a thing.
        // just clear the statechar *now*, rather than even diving into
        // the patternList stuff.
        if (options.noext) clearStateChar()
      continue

      case '(':
        if (inClass) {
          re += '('
          continue
        }

        if (!stateChar) {
          re += '\\('
          continue
        }

        patternListStack.push({
          type: stateChar,
          start: i - 1,
          reStart: re.length,
          open: plTypes[stateChar].open,
          close: plTypes[stateChar].close
        })
        // negation is (?:(?!js)[^/]*)
        re += stateChar === '!' ? '(?:(?!(?:' : '(?:'
        this.debug('plType %j %j', stateChar, re)
        stateChar = false
      continue

      case ')':
        if (inClass || !patternListStack.length) {
          re += '\\)'
          continue
        }

        clearStateChar()
        hasMagic = true
        var pl = patternListStack.pop()
        // negation is (?:(?!js)[^/]*)
        // The others are (?:<pattern>)<type>
        re += pl.close
        if (pl.type === '!') {
          negativeLists.push(pl)
        }
        pl.reEnd = re.length
      continue

      case '|':
        if (inClass || !patternListStack.length || escaping) {
          re += '\\|'
          escaping = false
          continue
        }

        clearStateChar()
        re += '|'
      continue

      // these are mostly the same in regexp and glob
      case '[':
        // swallow any state-tracking char before the [
        clearStateChar()

        if (inClass) {
          re += '\\' + c
          continue
        }

        inClass = true
        classStart = i
        reClassStart = re.length
        re += c
      continue

      case ']':
        //  a right bracket shall lose its special
        //  meaning and represent itself in
        //  a bracket expression if it occurs
        //  first in the list.  -- POSIX.2 2.8.3.2
        if (i === classStart + 1 || !inClass) {
          re += '\\' + c
          escaping = false
          continue
        }

        // handle the case where we left a class open.
        // "[z-a]" is valid, equivalent to "\[z-a\]"
        // split where the last [ was, make sure we don't have
        // an invalid re. if so, re-walk the contents of the
        // would-be class to re-translate any characters that
        // were passed through as-is
        // TODO: It would probably be faster to determine this
        // without a try/catch and a new RegExp, but it's tricky
        // to do safely.  For now, this is safe and works.
        var cs = pattern.substring(classStart + 1, i)
        try {
          RegExp('[' + cs + ']')
        } catch (er) {
          // not a valid class!
          var sp = this.parse(cs, SUBPARSE)
          re = re.substr(0, reClassStart) + '\\[' + sp[0] + '\\]'
          hasMagic = hasMagic || sp[1]
          inClass = false
          continue
        }

        // finish up the class.
        hasMagic = true
        inClass = false
        re += c
      continue

      default:
        // swallow any state char that wasn't consumed
        clearStateChar()

        if (escaping) {
          // no need
          escaping = false
        } else if (reSpecials[c]
          && !(c === '^' && inClass)) {
          re += '\\'
        }

        re += c

    } // switch
  } // for

  // handle the case where we left a class open.
  // "[abc" is valid, equivalent to "\[abc"
  if (inClass) {
    // split where the last [ was, and escape it
    // this is a huge pita.  We now have to re-walk
    // the contents of the would-be class to re-translate
    // any characters that were passed through as-is
    cs = pattern.substr(classStart + 1)
    sp = this.parse(cs, SUBPARSE)
    re = re.substr(0, reClassStart) + '\\[' + sp[0]
    hasMagic = hasMagic || sp[1]
  }

  // handle the case where we had a +( thing at the *end*
  // of the pattern.
  // each pattern list stack adds 3 chars, and we need to go through
  // and escape any | chars that were passed through as-is for the regexp.
  // Go through and escape them, taking care not to double-escape any
  // | chars that were already escaped.
  for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
    var tail = re.slice(pl.reStart + pl.open.length)
    this.debug('setting tail', re, pl)
    // maybe some even number of \, then maybe 1 \, followed by a |
    tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function (_, $1, $2) {
      if (!$2) {
        // the | isn't already escaped, so escape it.
        $2 = '\\'
      }

      // need to escape all those slashes *again*, without escaping the
      // one that we need for escaping the | character.  As it works out,
      // escaping an even number of slashes can be done by simply repeating
      // it exactly after itself.  That's why this trick works.
      //
      // I am sorry that you have to see this.
      return $1 + $1 + $2 + '|'
    })

    this.debug('tail=%j\n   %s', tail, tail, pl, re)
    var t = pl.type === '*' ? star
      : pl.type === '?' ? qmark
      : '\\' + pl.type

    hasMagic = true
    re = re.slice(0, pl.reStart) + t + '\\(' + tail
  }

  // handle trailing things that only matter at the very end.
  clearStateChar()
  if (escaping) {
    // trailing \\
    re += '\\\\'
  }

  // only need to apply the nodot start if the re starts with
  // something that could conceivably capture a dot
  var addPatternStart = false
  switch (re.charAt(0)) {
    case '[': case '.': case '(': addPatternStart = true
  }

  // Hack to work around lack of negative lookbehind in JS
  // A pattern like: *.!(x).!(y|z) needs to ensure that a name
  // like 'a.xyz.yz' doesn't match.  So, the first negative
  // lookahead, has to look ALL the way ahead, to the end of
  // the pattern.
  for (var n = negativeLists.length - 1; n > -1; n--) {
    var nl = negativeLists[n]

    var nlBefore = re.slice(0, nl.reStart)
    var nlFirst = re.slice(nl.reStart, nl.reEnd - 8)
    var nlLast = re.slice(nl.reEnd - 8, nl.reEnd)
    var nlAfter = re.slice(nl.reEnd)

    nlLast += nlAfter

    // Handle nested stuff like *(*.js|!(*.json)), where open parens
    // mean that we should *not* include the ) in the bit that is considered
    // "after" the negated section.
    var openParensBefore = nlBefore.split('(').length - 1
    var cleanAfter = nlAfter
    for (i = 0; i < openParensBefore; i++) {
      cleanAfter = cleanAfter.replace(/\)[+*?]?/, '')
    }
    nlAfter = cleanAfter

    var dollar = ''
    if (nlAfter === '' && isSub !== SUBPARSE) {
      dollar = '$'
    }
    var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast
    re = newRe
  }

  // if the re is not "" at this point, then we need to make sure
  // it doesn't match against an empty path part.
  // Otherwise a/* will match a/, which it should not.
  if (re !== '' && hasMagic) {
    re = '(?=.)' + re
  }

  if (addPatternStart) {
    re = patternStart + re
  }

  // parsing just a piece of a larger pattern.
  if (isSub === SUBPARSE) {
    return [re, hasMagic]
  }

  // skip the regexp for non-magical patterns
  // unescape anything in it, though, so that it'll be
  // an exact match against a file etc.
  if (!hasMagic) {
    return globUnescape(pattern)
  }

  var flags = options.nocase ? 'i' : ''
  try {
    var regExp = new RegExp('^' + re + '$', flags)
  } catch (er) /* istanbul ignore next - should be impossible */ {
    // If it was an invalid regular expression, then it can't match
    // anything.  This trick looks for a character after the end of
    // the string, which is of course impossible, except in multi-line
    // mode, but it's not a /m regex.
    return new RegExp('$.')
  }

  regExp._glob = pattern
  regExp._src = re

  return regExp
}

minimatch.makeRe = function (pattern, options) {
  return new Minimatch(pattern, options || {}).makeRe()
}

Minimatch.prototype.makeRe = makeRe
function makeRe () {
  if (this.regexp || this.regexp === false) return this.regexp

  // at this point, this.set is a 2d array of partial
  // pattern strings, or "**".
  //
  // It's better to use .match().  This function shouldn't
  // be used, really, but it's pretty convenient sometimes,
  // when you just want to work with a regex.
  var set = this.set

  if (!set.length) {
    this.regexp = false
    return this.regexp
  }
  var options = this.options

  var twoStar = options.noglobstar ? star
    : options.dot ? twoStarDot
    : twoStarNoDot
  var flags = options.nocase ? 'i' : ''

  var re = set.map(function (pattern) {
    return pattern.map(function (p) {
      return (p === GLOBSTAR) ? twoStar
      : (typeof p === 'string') ? regExpEscape(p)
      : p._src
    }).join('\\\/')
  }).join('|')

  // must match entire pattern
  // ending in a * or ** will make it less strict.
  re = '^(?:' + re + ')$'

  // can match anything, as long as it's not this.
  if (this.negate) re = '^(?!' + re + ').*$'

  try {
    this.regexp = new RegExp(re, flags)
  } catch (ex) /* istanbul ignore next - should be impossible */ {
    this.regexp = false
  }
  return this.regexp
}

minimatch.match = function (list, pattern, options) {
  options = options || {}
  var mm = new Minimatch(pattern, options)
  list = list.filter(function (f) {
    return mm.match(f)
  })
  if (mm.options.nonull && !list.length) {
    list.push(pattern)
  }
  return list
}

Minimatch.prototype.match = function match (f, partial) {
  if (typeof partial === 'undefined') partial = this.partial
  this.debug('match', f, this.pattern)
  // short-circuit in the case of busted things.
  // comments, etc.
  if (this.comment) return false
  if (this.empty) return f === ''

  if (f === '/' && partial) return true

  var options = this.options

  // windows: need to use /, not \
  if (path.sep !== '/') {
    f = f.split(path.sep).join('/')
  }

  // treat the test path as a set of pathparts.
  f = f.split(slashSplit)
  this.debug(this.pattern, 'split', f)

  // just ONE of the pattern sets in this.set needs to match
  // in order for it to be valid.  If negating, then just one
  // match means that we have failed.
  // Either way, return on the first hit.

  var set = this.set
  this.debug(this.pattern, 'set', set)

  // Find the basename of the path by looking for the last non-empty segment
  var filename
  var i
  for (i = f.length - 1; i >= 0; i--) {
    filename = f[i]
    if (filename) break
  }

  for (i = 0; i < set.length; i++) {
    var pattern = set[i]
    var file = f
    if (options.matchBase && pattern.length === 1) {
      file = [filename]
    }
    var hit = this.matchOne(file, pattern, partial)
    if (hit) {
      if (options.flipNegate) return true
      return !this.negate
    }
  }

  // didn't get any hits.  this is success if it's a negative
  // pattern, failure otherwise.
  if (options.flipNegate) return false
  return this.negate
}

// set partial to true to test if, for example,
// "/a/b" matches the start of "/*/b/*/d"
// Partial means, if you run out of file before you run
// out of pattern, then that's fine, as long as all
// the parts match.
Minimatch.prototype.matchOne = function (file, pattern, partial) {
  var options = this.options

  this.debug('matchOne',
    { 'this': this, file: file, pattern: pattern })

  this.debug('matchOne', file.length, pattern.length)

  for (var fi = 0,
      pi = 0,
      fl = file.length,
      pl = pattern.length
      ; (fi < fl) && (pi < pl)
      ; fi++, pi++) {
    this.debug('matchOne loop')
    var p = pattern[pi]
    var f = file[fi]

    this.debug(pattern, p, f)

    // should be impossible.
    // some invalid regexp stuff in the set.
    /* istanbul ignore if */
    if (p === false) return false

    if (p === GLOBSTAR) {
      this.debug('GLOBSTAR', [pattern, p, f])

      // "**"
      // a/**/b/**/c would match the following:
      // a/b/x/y/z/c
      // a/x/y/z/b/c
      // a/b/x/b/x/c
      // a/b/c
      // To do this, take the rest of the pattern after
      // the **, and see if it would match the file remainder.
      // If so, return success.
      // If not, the ** "swallows" a segment, and try again.
      // This is recursively awful.
      //
      // a/**/b/**/c matching a/b/x/y/z/c
      // - a matches a
      // - doublestar
      //   - matchOne(b/x/y/z/c, b/**/c)
      //     - b matches b
      //     - doublestar
      //       - matchOne(x/y/z/c, c) -> no
      //       - matchOne(y/z/c, c) -> no
      //       - matchOne(z/c, c) -> no
      //       - matchOne(c, c) yes, hit
      var fr = fi
      var pr = pi + 1
      if (pr === pl) {
        this.debug('** at the end')
        // a ** at the end will just swallow the rest.
        // We have found a match.
        // however, it will not swallow /.x, unless
        // options.dot is set.
        // . and .. are *never* matched by **, for explosively
        // exponential reasons.
        for (; fi < fl; fi++) {
          if (file[fi] === '.' || file[fi] === '..' ||
            (!options.dot && file[fi].charAt(0) === '.')) return false
        }
        return true
      }

      // ok, let's see if we can swallow whatever we can.
      while (fr < fl) {
        var swallowee = file[fr]

        this.debug('\nglobstar while', file, fr, pattern, pr, swallowee)

        // XXX remove this slice.  Just pass the start index.
        if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
          this.debug('globstar found match!', fr, fl, swallowee)
          // found a match.
          return true
        } else {
          // can't swallow "." or ".." ever.
          // can only swallow ".foo" when explicitly asked.
          if (swallowee === '.' || swallowee === '..' ||
            (!options.dot && swallowee.charAt(0) === '.')) {
            this.debug('dot detected!', file, fr, pattern, pr)
            break
          }

          // ** swallows a segment, and continue.
          this.debug('globstar swallow a segment, and continue')
          fr++
        }
      }

      // no match was found.
      // However, in partial mode, we can't say this is necessarily over.
      // If there's more *pattern* left, then
      /* istanbul ignore if */
      if (partial) {
        // ran out of file
        this.debug('\n>>> no match, partial?', file, fr, pattern, pr)
        if (fr === fl) return true
      }
      return false
    }

    // something other than **
    // non-magic patterns just have to match exactly
    // patterns with magic have been turned into regexps.
    var hit
    if (typeof p === 'string') {
      hit = f === p
      this.debug('string match', p, f, hit)
    } else {
      hit = f.match(p)
      this.debug('pattern match', p, f, hit)
    }

    if (!hit) return false
  }

  // Note: ending in / means that we'll get a final ""
  // at the end of the pattern.  This can only match a
  // corresponding "" at the end of the file.
  // If the file ends in /, then it can only match a
  // a pattern that ends in /, unless the pattern just
  // doesn't have any more for it. But, a/b/ should *not*
  // match "a/b/*", even though "" matches against the
  // [^/]*? pattern, except in partial mode, where it might
  // simply not be reached yet.
  // However, a/b/ should still satisfy a/*

  // now either we fell off the end of the pattern, or we're done.
  if (fi === fl && pi === pl) {
    // ran out of pattern and filename at the same time.
    // an exact hit!
    return true
  } else if (fi === fl) {
    // ran out of file, but still had pattern left.
    // this is ok if we're doing the match as part of
    // a glob fs traversal.
    return partial
  } else /* istanbul ignore else */ if (pi === pl) {
    // ran out of pattern, still have file left.
    // this is only acceptable if we're on the very last
    // empty segment of a file with a trailing slash.
    // a/* should match a/b/
    return (fi === fl - 1) && (file[fi] === '')
  }

  // should be unreachable.
  /* istanbul ignore next */
  throw new Error('wtf?')
}

// replace stuff like \* with *
function globUnescape (s) {
  return s.replace(/\\(.)/g, '$1')
}

function regExpEscape (s) {
  return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}


/***/ }),

/***/ 7006:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var lib = __nccwpck_require__(4127);
var _require = __nccwpck_require__(4428),
  Environment = _require.Environment,
  Template = _require.Template;
var Loader = __nccwpck_require__(6981);
var loaders = __nccwpck_require__(4395);
var precompile = __nccwpck_require__(7513);
var compiler = __nccwpck_require__(4548);
var parser = __nccwpck_require__(6614);
var lexer = __nccwpck_require__(3158);
var runtime = __nccwpck_require__(1998);
var nodes = __nccwpck_require__(429);
var installJinjaCompat = __nccwpck_require__(6976);

// A single instance of an environment, since this is so commonly used
var e;
function configure(templatesPath, opts) {
  opts = opts || {};
  if (lib.isObject(templatesPath)) {
    opts = templatesPath;
    templatesPath = null;
  }
  var TemplateLoader;
  if (loaders.FileSystemLoader) {
    TemplateLoader = new loaders.FileSystemLoader(templatesPath, {
      watch: opts.watch,
      noCache: opts.noCache
    });
  } else if (loaders.WebLoader) {
    TemplateLoader = new loaders.WebLoader(templatesPath, {
      useCache: opts.web && opts.web.useCache,
      async: opts.web && opts.web.async
    });
  }
  e = new Environment(TemplateLoader, opts);
  if (opts && opts.express) {
    e.express(opts.express);
  }
  return e;
}
module.exports = {
  Environment: Environment,
  Template: Template,
  Loader: Loader,
  FileSystemLoader: loaders.FileSystemLoader,
  NodeResolveLoader: loaders.NodeResolveLoader,
  PrecompiledLoader: loaders.PrecompiledLoader,
  WebLoader: loaders.WebLoader,
  compiler: compiler,
  parser: parser,
  lexer: lexer,
  runtime: runtime,
  lib: lib,
  nodes: nodes,
  installJinjaCompat: installJinjaCompat,
  configure: configure,
  reset: function reset() {
    e = undefined;
  },
  compile: function compile(src, env, path, eagerCompile) {
    if (!e) {
      configure();
    }
    return new Template(src, env, path, eagerCompile);
  },
  render: function render(name, ctx, cb) {
    if (!e) {
      configure();
    }
    return e.render(name, ctx, cb);
  },
  renderString: function renderString(src, ctx, cb) {
    if (!e) {
      configure();
    }
    return e.renderString(src, ctx, cb);
  },
  precompile: precompile ? precompile.precompile : undefined,
  precompileString: precompile ? precompile.precompileString : undefined
};

/***/ }),

/***/ 4548:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var parser = __nccwpck_require__(6614);
var transformer = __nccwpck_require__(3773);
var nodes = __nccwpck_require__(429);
var _require = __nccwpck_require__(4127),
  TemplateError = _require.TemplateError;
var _require2 = __nccwpck_require__(1998),
  Frame = _require2.Frame;
var _require3 = __nccwpck_require__(7007),
  Obj = _require3.Obj;

// These are all the same for now, but shouldn't be passed straight
// through
var compareOps = {
  '==': '==',
  '===': '===',
  '!=': '!=',
  '!==': '!==',
  '<': '<',
  '>': '>',
  '<=': '<=',
  '>=': '>='
};
var Compiler = /*#__PURE__*/function (_Obj) {
  _inheritsLoose(Compiler, _Obj);
  function Compiler() {
    return _Obj.apply(this, arguments) || this;
  }
  var _proto = Compiler.prototype;
  _proto.init = function init(templateName, throwOnUndefined) {
    this.templateName = templateName;
    this.codebuf = [];
    this.lastId = 0;
    this.buffer = null;
    this.bufferStack = [];
    this._scopeClosers = '';
    this.inBlock = false;
    this.throwOnUndefined = throwOnUndefined;
  };
  _proto.fail = function fail(msg, lineno, colno) {
    if (lineno !== undefined) {
      lineno += 1;
    }
    if (colno !== undefined) {
      colno += 1;
    }
    throw new TemplateError(msg, lineno, colno);
  };
  _proto._pushBuffer = function _pushBuffer() {
    var id = this._tmpid();
    this.bufferStack.push(this.buffer);
    this.buffer = id;
    this._emit("var " + this.buffer + " = \"\";");
    return id;
  };
  _proto._popBuffer = function _popBuffer() {
    this.buffer = this.bufferStack.pop();
  };
  _proto._emit = function _emit(code) {
    this.codebuf.push(code);
  };
  _proto._emitLine = function _emitLine(code) {
    this._emit(code + '\n');
  };
  _proto._emitLines = function _emitLines() {
    var _this = this;
    for (var _len = arguments.length, lines = new Array(_len), _key = 0; _key < _len; _key++) {
      lines[_key] = arguments[_key];
    }
    lines.forEach(function (line) {
      return _this._emitLine(line);
    });
  };
  _proto._emitFuncBegin = function _emitFuncBegin(node, name) {
    this.buffer = 'output';
    this._scopeClosers = '';
    this._emitLine("function " + name + "(env, context, frame, runtime, cb) {");
    this._emitLine("var lineno = " + node.lineno + ";");
    this._emitLine("var colno = " + node.colno + ";");
    this._emitLine("var " + this.buffer + " = \"\";");
    this._emitLine('try {');
  };
  _proto._emitFuncEnd = function _emitFuncEnd(noReturn) {
    if (!noReturn) {
      this._emitLine('cb(null, ' + this.buffer + ');');
    }
    this._closeScopeLevels();
    this._emitLine('} catch (e) {');
    this._emitLine('  cb(runtime.handleError(e, lineno, colno));');
    this._emitLine('}');
    this._emitLine('}');
    this.buffer = null;
  };
  _proto._addScopeLevel = function _addScopeLevel() {
    this._scopeClosers += '})';
  };
  _proto._closeScopeLevels = function _closeScopeLevels() {
    this._emitLine(this._scopeClosers + ';');
    this._scopeClosers = '';
  };
  _proto._withScopedSyntax = function _withScopedSyntax(func) {
    var _scopeClosers = this._scopeClosers;
    this._scopeClosers = '';
    func.call(this);
    this._closeScopeLevels();
    this._scopeClosers = _scopeClosers;
  };
  _proto._makeCallback = function _makeCallback(res) {
    var err = this._tmpid();
    return 'function(' + err + (res ? ',' + res : '') + ') {\n' + 'if(' + err + ') { cb(' + err + '); return; }';
  };
  _proto._tmpid = function _tmpid() {
    this.lastId++;
    return 't_' + this.lastId;
  };
  _proto._templateName = function _templateName() {
    return this.templateName == null ? 'undefined' : JSON.stringify(this.templateName);
  };
  _proto._compileChildren = function _compileChildren(node, frame) {
    var _this2 = this;
    node.children.forEach(function (child) {
      _this2.compile(child, frame);
    });
  };
  _proto._compileAggregate = function _compileAggregate(node, frame, startChar, endChar) {
    var _this3 = this;
    if (startChar) {
      this._emit(startChar);
    }
    node.children.forEach(function (child, i) {
      if (i > 0) {
        _this3._emit(',');
      }
      _this3.compile(child, frame);
    });
    if (endChar) {
      this._emit(endChar);
    }
  };
  _proto._compileExpression = function _compileExpression(node, frame) {
    // TODO: I'm not really sure if this type check is worth it or
    // not.
    this.assertType(node, nodes.Literal, nodes.Symbol, nodes.Group, nodes.Array, nodes.Dict, nodes.FunCall, nodes.Caller, nodes.Filter, nodes.LookupVal, nodes.Compare, nodes.InlineIf, nodes.In, nodes.Is, nodes.And, nodes.Or, nodes.Not, nodes.Add, nodes.Concat, nodes.Sub, nodes.Mul, nodes.Div, nodes.FloorDiv, nodes.Mod, nodes.Pow, nodes.Neg, nodes.Pos, nodes.Compare, nodes.NodeList);
    this.compile(node, frame);
  };
  _proto.assertType = function assertType(node) {
    for (var _len2 = arguments.length, types = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      types[_key2 - 1] = arguments[_key2];
    }
    if (!types.some(function (t) {
      return node instanceof t;
    })) {
      this.fail("assertType: invalid type: " + node.typename, node.lineno, node.colno);
    }
  };
  _proto.compileCallExtension = function compileCallExtension(node, frame, async) {
    var _this4 = this;
    var args = node.args;
    var contentArgs = node.contentArgs;
    var autoescape = typeof node.autoescape === 'boolean' ? node.autoescape : true;
    if (!async) {
      this._emit(this.buffer + " += runtime.suppressValue(");
    }
    this._emit("env.getExtension(\"" + node.extName + "\")[\"" + node.prop + "\"](");
    this._emit('context');
    if (args || contentArgs) {
      this._emit(',');
    }
    if (args) {
      if (!(args instanceof nodes.NodeList)) {
        this.fail('compileCallExtension: arguments must be a NodeList, ' + 'use `parser.parseSignature`');
      }
      args.children.forEach(function (arg, i) {
        // Tag arguments are passed normally to the call. Note
        // that keyword arguments are turned into a single js
        // object as the last argument, if they exist.
        _this4._compileExpression(arg, frame);
        if (i !== args.children.length - 1 || contentArgs.length) {
          _this4._emit(',');
        }
      });
    }
    if (contentArgs.length) {
      contentArgs.forEach(function (arg, i) {
        if (i > 0) {
          _this4._emit(',');
        }
        if (arg) {
          _this4._emitLine('function(cb) {');
          _this4._emitLine('if(!cb) { cb = function(err) { if(err) { throw err; }}}');
          var id = _this4._pushBuffer();
          _this4._withScopedSyntax(function () {
            _this4.compile(arg, frame);
            _this4._emitLine("cb(null, " + id + ");");
          });
          _this4._popBuffer();
          _this4._emitLine("return " + id + ";");
          _this4._emitLine('}');
        } else {
          _this4._emit('null');
        }
      });
    }
    if (async) {
      var res = this._tmpid();
      this._emitLine(', ' + this._makeCallback(res));
      this._emitLine(this.buffer + " += runtime.suppressValue(" + res + ", " + autoescape + " && env.opts.autoescape);");
      this._addScopeLevel();
    } else {
      this._emit(')');
      this._emit(", " + autoescape + " && env.opts.autoescape);\n");
    }
  };
  _proto.compileCallExtensionAsync = function compileCallExtensionAsync(node, frame) {
    this.compileCallExtension(node, frame, true);
  };
  _proto.compileNodeList = function compileNodeList(node, frame) {
    this._compileChildren(node, frame);
  };
  _proto.compileLiteral = function compileLiteral(node) {
    if (typeof node.value === 'string') {
      var val = node.value.replace(/\\/g, '\\\\');
      val = val.replace(/"/g, '\\"');
      val = val.replace(/\n/g, '\\n');
      val = val.replace(/\r/g, '\\r');
      val = val.replace(/\t/g, '\\t');
      val = val.replace(/\u2028/g, "\\u2028");
      this._emit("\"" + val + "\"");
    } else if (node.value === null) {
      this._emit('null');
    } else {
      this._emit(node.value.toString());
    }
  };
  _proto.compileSymbol = function compileSymbol(node, frame) {
    var name = node.value;
    var v = frame.lookup(name);
    if (v) {
      this._emit(v);
    } else {
      this._emit('runtime.contextOrFrameLookup(' + 'context, frame, "' + name + '")');
    }
  };
  _proto.compileGroup = function compileGroup(node, frame) {
    this._compileAggregate(node, frame, '(', ')');
  };
  _proto.compileArray = function compileArray(node, frame) {
    this._compileAggregate(node, frame, '[', ']');
  };
  _proto.compileDict = function compileDict(node, frame) {
    this._compileAggregate(node, frame, '{', '}');
  };
  _proto.compilePair = function compilePair(node, frame) {
    var key = node.key;
    var val = node.value;
    if (key instanceof nodes.Symbol) {
      key = new nodes.Literal(key.lineno, key.colno, key.value);
    } else if (!(key instanceof nodes.Literal && typeof key.value === 'string')) {
      this.fail('compilePair: Dict keys must be strings or names', key.lineno, key.colno);
    }
    this.compile(key, frame);
    this._emit(': ');
    this._compileExpression(val, frame);
  };
  _proto.compileInlineIf = function compileInlineIf(node, frame) {
    this._emit('(');
    this.compile(node.cond, frame);
    this._emit('?');
    this.compile(node.body, frame);
    this._emit(':');
    if (node.else_ !== null) {
      this.compile(node.else_, frame);
    } else {
      this._emit('""');
    }
    this._emit(')');
  };
  _proto.compileIn = function compileIn(node, frame) {
    this._emit('runtime.inOperator(');
    this.compile(node.left, frame);
    this._emit(',');
    this.compile(node.right, frame);
    this._emit(')');
  };
  _proto.compileIs = function compileIs(node, frame) {
    // first, we need to try to get the name of the test function, if it's a
    // callable (i.e., has args) and not a symbol.
    var right = node.right.name ? node.right.name.value
    // otherwise go with the symbol value
    : node.right.value;
    this._emit('env.getTest("' + right + '").call(context, ');
    this.compile(node.left, frame);
    // compile the arguments for the callable if they exist
    if (node.right.args) {
      this._emit(',');
      this.compile(node.right.args, frame);
    }
    this._emit(') === true');
  };
  _proto._binOpEmitter = function _binOpEmitter(node, frame, str) {
    this.compile(node.left, frame);
    this._emit(str);
    this.compile(node.right, frame);
  }

  // ensure concatenation instead of addition
  // by adding empty string in between
  ;
  _proto.compileOr = function compileOr(node, frame) {
    return this._binOpEmitter(node, frame, ' || ');
  };
  _proto.compileAnd = function compileAnd(node, frame) {
    return this._binOpEmitter(node, frame, ' && ');
  };
  _proto.compileAdd = function compileAdd(node, frame) {
    return this._binOpEmitter(node, frame, ' + ');
  };
  _proto.compileConcat = function compileConcat(node, frame) {
    return this._binOpEmitter(node, frame, ' + "" + ');
  };
  _proto.compileSub = function compileSub(node, frame) {
    return this._binOpEmitter(node, frame, ' - ');
  };
  _proto.compileMul = function compileMul(node, frame) {
    return this._binOpEmitter(node, frame, ' * ');
  };
  _proto.compileDiv = function compileDiv(node, frame) {
    return this._binOpEmitter(node, frame, ' / ');
  };
  _proto.compileMod = function compileMod(node, frame) {
    return this._binOpEmitter(node, frame, ' % ');
  };
  _proto.compileNot = function compileNot(node, frame) {
    this._emit('!');
    this.compile(node.target, frame);
  };
  _proto.compileFloorDiv = function compileFloorDiv(node, frame) {
    this._emit('Math.floor(');
    this.compile(node.left, frame);
    this._emit(' / ');
    this.compile(node.right, frame);
    this._emit(')');
  };
  _proto.compilePow = function compilePow(node, frame) {
    this._emit('Math.pow(');
    this.compile(node.left, frame);
    this._emit(', ');
    this.compile(node.right, frame);
    this._emit(')');
  };
  _proto.compileNeg = function compileNeg(node, frame) {
    this._emit('-');
    this.compile(node.target, frame);
  };
  _proto.compilePos = function compilePos(node, frame) {
    this._emit('+');
    this.compile(node.target, frame);
  };
  _proto.compileCompare = function compileCompare(node, frame) {
    var _this5 = this;
    this.compile(node.expr, frame);
    node.ops.forEach(function (op) {
      _this5._emit(" " + compareOps[op.type] + " ");
      _this5.compile(op.expr, frame);
    });
  };
  _proto.compileLookupVal = function compileLookupVal(node, frame) {
    this._emit('runtime.memberLookup((');
    this._compileExpression(node.target, frame);
    this._emit('),');
    this._compileExpression(node.val, frame);
    this._emit(')');
  };
  _proto._getNodeName = function _getNodeName(node) {
    switch (node.typename) {
      case 'Symbol':
        return node.value;
      case 'FunCall':
        return 'the return value of (' + this._getNodeName(node.name) + ')';
      case 'LookupVal':
        return this._getNodeName(node.target) + '["' + this._getNodeName(node.val) + '"]';
      case 'Literal':
        return node.value.toString();
      default:
        return '--expression--';
    }
  };
  _proto.compileFunCall = function compileFunCall(node, frame) {
    // Keep track of line/col info at runtime by settings
    // variables within an expression. An expression in javascript
    // like (x, y, z) returns the last value, and x and y can be
    // anything
    this._emit('(lineno = ' + node.lineno + ', colno = ' + node.colno + ', ');
    this._emit('runtime.callWrap(');
    // Compile it as normal.
    this._compileExpression(node.name, frame);

    // Output the name of what we're calling so we can get friendly errors
    // if the lookup fails.
    this._emit(', "' + this._getNodeName(node.name).replace(/"/g, '\\"') + '", context, ');
    this._compileAggregate(node.args, frame, '[', '])');
    this._emit(')');
  };
  _proto.compileFilter = function compileFilter(node, frame) {
    var name = node.name;
    this.assertType(name, nodes.Symbol);
    this._emit('env.getFilter("' + name.value + '").call(context, ');
    this._compileAggregate(node.args, frame);
    this._emit(')');
  };
  _proto.compileFilterAsync = function compileFilterAsync(node, frame) {
    var name = node.name;
    var symbol = node.symbol.value;
    this.assertType(name, nodes.Symbol);
    frame.set(symbol, symbol);
    this._emit('env.getFilter("' + name.value + '").call(context, ');
    this._compileAggregate(node.args, frame);
    this._emitLine(', ' + this._makeCallback(symbol));
    this._addScopeLevel();
  };
  _proto.compileKeywordArgs = function compileKeywordArgs(node, frame) {
    this._emit('runtime.makeKeywordArgs(');
    this.compileDict(node, frame);
    this._emit(')');
  };
  _proto.compileSet = function compileSet(node, frame) {
    var _this6 = this;
    var ids = [];

    // Lookup the variable names for each identifier and create
    // new ones if necessary
    node.targets.forEach(function (target) {
      var name = target.value;
      var id = frame.lookup(name);
      if (id === null || id === undefined) {
        id = _this6._tmpid();

        // Note: This relies on js allowing scope across
        // blocks, in case this is created inside an `if`
        _this6._emitLine('var ' + id + ';');
      }
      ids.push(id);
    });
    if (node.value) {
      this._emit(ids.join(' = ') + ' = ');
      this._compileExpression(node.value, frame);
      this._emitLine(';');
    } else {
      this._emit(ids.join(' = ') + ' = ');
      this.compile(node.body, frame);
      this._emitLine(';');
    }
    node.targets.forEach(function (target, i) {
      var id = ids[i];
      var name = target.value;

      // We are running this for every var, but it's very
      // uncommon to assign to multiple vars anyway
      _this6._emitLine("frame.set(\"" + name + "\", " + id + ", true);");
      _this6._emitLine('if(frame.topLevel) {');
      _this6._emitLine("context.setVariable(\"" + name + "\", " + id + ");");
      _this6._emitLine('}');
      if (name.charAt(0) !== '_') {
        _this6._emitLine('if(frame.topLevel) {');
        _this6._emitLine("context.addExport(\"" + name + "\", " + id + ");");
        _this6._emitLine('}');
      }
    });
  };
  _proto.compileSwitch = function compileSwitch(node, frame) {
    var _this7 = this;
    this._emit('switch (');
    this.compile(node.expr, frame);
    this._emit(') {');
    node.cases.forEach(function (c, i) {
      _this7._emit('case ');
      _this7.compile(c.cond, frame);
      _this7._emit(': ');
      _this7.compile(c.body, frame);
      // preserve fall-throughs
      if (c.body.children.length) {
        _this7._emitLine('break;');
      }
    });
    if (node.default) {
      this._emit('default:');
      this.compile(node.default, frame);
    }
    this._emit('}');
  };
  _proto.compileIf = function compileIf(node, frame, async) {
    var _this8 = this;
    this._emit('if(');
    this._compileExpression(node.cond, frame);
    this._emitLine(') {');
    this._withScopedSyntax(function () {
      _this8.compile(node.body, frame);
      if (async) {
        _this8._emit('cb()');
      }
    });
    if (node.else_) {
      this._emitLine('}\nelse {');
      this._withScopedSyntax(function () {
        _this8.compile(node.else_, frame);
        if (async) {
          _this8._emit('cb()');
        }
      });
    } else if (async) {
      this._emitLine('}\nelse {');
      this._emit('cb()');
    }
    this._emitLine('}');
  };
  _proto.compileIfAsync = function compileIfAsync(node, frame) {
    this._emit('(function(cb) {');
    this.compileIf(node, frame, true);
    this._emit('})(' + this._makeCallback());
    this._addScopeLevel();
  };
  _proto._emitLoopBindings = function _emitLoopBindings(node, arr, i, len) {
    var _this9 = this;
    var bindings = [{
      name: 'index',
      val: i + " + 1"
    }, {
      name: 'index0',
      val: i
    }, {
      name: 'revindex',
      val: len + " - " + i
    }, {
      name: 'revindex0',
      val: len + " - " + i + " - 1"
    }, {
      name: 'first',
      val: i + " === 0"
    }, {
      name: 'last',
      val: i + " === " + len + " - 1"
    }, {
      name: 'length',
      val: len
    }];
    bindings.forEach(function (b) {
      _this9._emitLine("frame.set(\"loop." + b.name + "\", " + b.val + ");");
    });
  };
  _proto.compileFor = function compileFor(node, frame) {
    var _this10 = this;
    // Some of this code is ugly, but it keeps the generated code
    // as fast as possible. ForAsync also shares some of this, but
    // not much.

    var i = this._tmpid();
    var len = this._tmpid();
    var arr = this._tmpid();
    frame = frame.push();
    this._emitLine('frame = frame.push();');
    this._emit("var " + arr + " = ");
    this._compileExpression(node.arr, frame);
    this._emitLine(';');
    this._emit("if(" + arr + ") {");
    this._emitLine(arr + ' = runtime.fromIterator(' + arr + ');');

    // If multiple names are passed, we need to bind them
    // appropriately
    if (node.name instanceof nodes.Array) {
      this._emitLine("var " + i + ";");

      // The object could be an arroy or object. Note that the
      // body of the loop is duplicated for each condition, but
      // we are optimizing for speed over size.
      this._emitLine("if(runtime.isArray(" + arr + ")) {");
      this._emitLine("var " + len + " = " + arr + ".length;");
      this._emitLine("for(" + i + "=0; " + i + " < " + arr + ".length; " + i + "++) {");

      // Bind each declared var
      node.name.children.forEach(function (child, u) {
        var tid = _this10._tmpid();
        _this10._emitLine("var " + tid + " = " + arr + "[" + i + "][" + u + "];");
        _this10._emitLine("frame.set(\"" + child + "\", " + arr + "[" + i + "][" + u + "]);");
        frame.set(node.name.children[u].value, tid);
      });
      this._emitLoopBindings(node, arr, i, len);
      this._withScopedSyntax(function () {
        _this10.compile(node.body, frame);
      });
      this._emitLine('}');
      this._emitLine('} else {');
      // Iterate over the key/values of an object
      var _node$name$children = node.name.children,
        key = _node$name$children[0],
        val = _node$name$children[1];
      var k = this._tmpid();
      var v = this._tmpid();
      frame.set(key.value, k);
      frame.set(val.value, v);
      this._emitLine(i + " = -1;");
      this._emitLine("var " + len + " = runtime.keys(" + arr + ").length;");
      this._emitLine("for(var " + k + " in " + arr + ") {");
      this._emitLine(i + "++;");
      this._emitLine("var " + v + " = " + arr + "[" + k + "];");
      this._emitLine("frame.set(\"" + key.value + "\", " + k + ");");
      this._emitLine("frame.set(\"" + val.value + "\", " + v + ");");
      this._emitLoopBindings(node, arr, i, len);
      this._withScopedSyntax(function () {
        _this10.compile(node.body, frame);
      });
      this._emitLine('}');
      this._emitLine('}');
    } else {
      // Generate a typical array iteration
      var _v = this._tmpid();
      frame.set(node.name.value, _v);
      this._emitLine("var " + len + " = " + arr + ".length;");
      this._emitLine("for(var " + i + "=0; " + i + " < " + arr + ".length; " + i + "++) {");
      this._emitLine("var " + _v + " = " + arr + "[" + i + "];");
      this._emitLine("frame.set(\"" + node.name.value + "\", " + _v + ");");
      this._emitLoopBindings(node, arr, i, len);
      this._withScopedSyntax(function () {
        _this10.compile(node.body, frame);
      });
      this._emitLine('}');
    }
    this._emitLine('}');
    if (node.else_) {
      this._emitLine('if (!' + len + ') {');
      this.compile(node.else_, frame);
      this._emitLine('}');
    }
    this._emitLine('frame = frame.pop();');
  };
  _proto._compileAsyncLoop = function _compileAsyncLoop(node, frame, parallel) {
    var _this11 = this;
    // This shares some code with the For tag, but not enough to
    // worry about. This iterates across an object asynchronously,
    // but not in parallel.

    var i = this._tmpid();
    var len = this._tmpid();
    var arr = this._tmpid();
    var asyncMethod = parallel ? 'asyncAll' : 'asyncEach';
    frame = frame.push();
    this._emitLine('frame = frame.push();');
    this._emit('var ' + arr + ' = runtime.fromIterator(');
    this._compileExpression(node.arr, frame);
    this._emitLine(');');
    if (node.name instanceof nodes.Array) {
      var arrayLen = node.name.children.length;
      this._emit("runtime." + asyncMethod + "(" + arr + ", " + arrayLen + ", function(");
      node.name.children.forEach(function (name) {
        _this11._emit(name.value + ",");
      });
      this._emit(i + ',' + len + ',next) {');
      node.name.children.forEach(function (name) {
        var id = name.value;
        frame.set(id, id);
        _this11._emitLine("frame.set(\"" + id + "\", " + id + ");");
      });
    } else {
      var id = node.name.value;
      this._emitLine("runtime." + asyncMethod + "(" + arr + ", 1, function(" + id + ", " + i + ", " + len + ",next) {");
      this._emitLine('frame.set("' + id + '", ' + id + ');');
      frame.set(id, id);
    }
    this._emitLoopBindings(node, arr, i, len);
    this._withScopedSyntax(function () {
      var buf;
      if (parallel) {
        buf = _this11._pushBuffer();
      }
      _this11.compile(node.body, frame);
      _this11._emitLine('next(' + i + (buf ? ',' + buf : '') + ');');
      if (parallel) {
        _this11._popBuffer();
      }
    });
    var output = this._tmpid();
    this._emitLine('}, ' + this._makeCallback(output));
    this._addScopeLevel();
    if (parallel) {
      this._emitLine(this.buffer + ' += ' + output + ';');
    }
    if (node.else_) {
      this._emitLine('if (!' + arr + '.length) {');
      this.compile(node.else_, frame);
      this._emitLine('}');
    }
    this._emitLine('frame = frame.pop();');
  };
  _proto.compileAsyncEach = function compileAsyncEach(node, frame) {
    this._compileAsyncLoop(node, frame);
  };
  _proto.compileAsyncAll = function compileAsyncAll(node, frame) {
    this._compileAsyncLoop(node, frame, true);
  };
  _proto._compileMacro = function _compileMacro(node, frame) {
    var _this12 = this;
    var args = [];
    var kwargs = null;
    var funcId = 'macro_' + this._tmpid();
    var keepFrame = frame !== undefined;

    // Type check the definition of the args
    node.args.children.forEach(function (arg, i) {
      if (i === node.args.children.length - 1 && arg instanceof nodes.Dict) {
        kwargs = arg;
      } else {
        _this12.assertType(arg, nodes.Symbol);
        args.push(arg);
      }
    });
    var realNames = [].concat(args.map(function (n) {
      return "l_" + n.value;
    }), ['kwargs']);

    // Quoted argument names
    var argNames = args.map(function (n) {
      return "\"" + n.value + "\"";
    });
    var kwargNames = (kwargs && kwargs.children || []).map(function (n) {
      return "\"" + n.key.value + "\"";
    });

    // We pass a function to makeMacro which destructures the
    // arguments so support setting positional args with keywords
    // args and passing keyword args as positional args
    // (essentially default values). See runtime.js.
    var currFrame;
    if (keepFrame) {
      currFrame = frame.push(true);
    } else {
      currFrame = new Frame();
    }
    this._emitLines("var " + funcId + " = runtime.makeMacro(", "[" + argNames.join(', ') + "], ", "[" + kwargNames.join(', ') + "], ", "function (" + realNames.join(', ') + ") {", 'var callerFrame = frame;', 'frame = ' + (keepFrame ? 'frame.push(true);' : 'new runtime.Frame();'), 'kwargs = kwargs || {};', 'if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {', 'frame.set("caller", kwargs.caller); }');

    // Expose the arguments to the template. Don't need to use
    // random names because the function
    // will create a new run-time scope for us
    args.forEach(function (arg) {
      _this12._emitLine("frame.set(\"" + arg.value + "\", l_" + arg.value + ");");
      currFrame.set(arg.value, "l_" + arg.value);
    });

    // Expose the keyword arguments
    if (kwargs) {
      kwargs.children.forEach(function (pair) {
        var name = pair.key.value;
        _this12._emit("frame.set(\"" + name + "\", ");
        _this12._emit("Object.prototype.hasOwnProperty.call(kwargs, \"" + name + "\")");
        _this12._emit(" ? kwargs[\"" + name + "\"] : ");
        _this12._compileExpression(pair.value, currFrame);
        _this12._emit(');');
      });
    }
    var bufferId = this._pushBuffer();
    this._withScopedSyntax(function () {
      _this12.compile(node.body, currFrame);
    });
    this._emitLine('frame = ' + (keepFrame ? 'frame.pop();' : 'callerFrame;'));
    this._emitLine("return new runtime.SafeString(" + bufferId + ");");
    this._emitLine('});');
    this._popBuffer();
    return funcId;
  };
  _proto.compileMacro = function compileMacro(node, frame) {
    var funcId = this._compileMacro(node);

    // Expose the macro to the templates
    var name = node.name.value;
    frame.set(name, funcId);
    if (frame.parent) {
      this._emitLine("frame.set(\"" + name + "\", " + funcId + ");");
    } else {
      if (node.name.value.charAt(0) !== '_') {
        this._emitLine("context.addExport(\"" + name + "\");");
      }
      this._emitLine("context.setVariable(\"" + name + "\", " + funcId + ");");
    }
  };
  _proto.compileCaller = function compileCaller(node, frame) {
    // basically an anonymous "macro expression"
    this._emit('(function (){');
    var funcId = this._compileMacro(node, frame);
    this._emit("return " + funcId + ";})()");
  };
  _proto._compileGetTemplate = function _compileGetTemplate(node, frame, eagerCompile, ignoreMissing) {
    var parentTemplateId = this._tmpid();
    var parentName = this._templateName();
    var cb = this._makeCallback(parentTemplateId);
    var eagerCompileArg = eagerCompile ? 'true' : 'false';
    var ignoreMissingArg = ignoreMissing ? 'true' : 'false';
    this._emit('env.getTemplate(');
    this._compileExpression(node.template, frame);
    this._emitLine(", " + eagerCompileArg + ", " + parentName + ", " + ignoreMissingArg + ", " + cb);
    return parentTemplateId;
  };
  _proto.compileImport = function compileImport(node, frame) {
    var target = node.target.value;
    var id = this._compileGetTemplate(node, frame, false, false);
    this._addScopeLevel();
    this._emitLine(id + '.getExported(' + (node.withContext ? 'context.getVariables(), frame, ' : '') + this._makeCallback(id));
    this._addScopeLevel();
    frame.set(target, id);
    if (frame.parent) {
      this._emitLine("frame.set(\"" + target + "\", " + id + ");");
    } else {
      this._emitLine("context.setVariable(\"" + target + "\", " + id + ");");
    }
  };
  _proto.compileFromImport = function compileFromImport(node, frame) {
    var _this13 = this;
    var importedId = this._compileGetTemplate(node, frame, false, false);
    this._addScopeLevel();
    this._emitLine(importedId + '.getExported(' + (node.withContext ? 'context.getVariables(), frame, ' : '') + this._makeCallback(importedId));
    this._addScopeLevel();
    node.names.children.forEach(function (nameNode) {
      var name;
      var alias;
      var id = _this13._tmpid();
      if (nameNode instanceof nodes.Pair) {
        name = nameNode.key.value;
        alias = nameNode.value.value;
      } else {
        name = nameNode.value;
        alias = name;
      }
      _this13._emitLine("if(Object.prototype.hasOwnProperty.call(" + importedId + ", \"" + name + "\")) {");
      _this13._emitLine("var " + id + " = " + importedId + "." + name + ";");
      _this13._emitLine('} else {');
      _this13._emitLine("cb(new Error(\"cannot import '" + name + "'\")); return;");
      _this13._emitLine('}');
      frame.set(alias, id);
      if (frame.parent) {
        _this13._emitLine("frame.set(\"" + alias + "\", " + id + ");");
      } else {
        _this13._emitLine("context.setVariable(\"" + alias + "\", " + id + ");");
      }
    });
  };
  _proto.compileBlock = function compileBlock(node) {
    var id = this._tmpid();

    // If we are executing outside a block (creating a top-level
    // block), we really don't want to execute its code because it
    // will execute twice: once when the child template runs and
    // again when the parent template runs. Note that blocks
    // within blocks will *always* execute immediately *and*
    // wherever else they are invoked (like used in a parent
    // template). This may have behavioral differences from jinja
    // because blocks can have side effects, but it seems like a
    // waste of performance to always execute huge top-level
    // blocks twice
    if (!this.inBlock) {
      this._emit('(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : ');
    }
    this._emit("context.getBlock(\"" + node.name.value + "\")");
    if (!this.inBlock) {
      this._emit(')');
    }
    this._emitLine('(env, context, frame, runtime, ' + this._makeCallback(id));
    this._emitLine(this.buffer + " += " + id + ";");
    this._addScopeLevel();
  };
  _proto.compileSuper = function compileSuper(node, frame) {
    var name = node.blockName.value;
    var id = node.symbol.value;
    var cb = this._makeCallback(id);
    this._emitLine("context.getSuper(env, \"" + name + "\", b_" + name + ", frame, runtime, " + cb);
    this._emitLine(id + " = runtime.markSafe(" + id + ");");
    this._addScopeLevel();
    frame.set(id, id);
  };
  _proto.compileExtends = function compileExtends(node, frame) {
    var k = this._tmpid();
    var parentTemplateId = this._compileGetTemplate(node, frame, true, false);

    // extends is a dynamic tag and can occur within a block like
    // `if`, so if this happens we need to capture the parent
    // template in the top-level scope
    this._emitLine("parentTemplate = " + parentTemplateId);
    this._emitLine("for(var " + k + " in parentTemplate.blocks) {");
    this._emitLine("context.addBlock(" + k + ", parentTemplate.blocks[" + k + "]);");
    this._emitLine('}');
    this._addScopeLevel();
  };
  _proto.compileInclude = function compileInclude(node, frame) {
    this._emitLine('var tasks = [];');
    this._emitLine('tasks.push(');
    this._emitLine('function(callback) {');
    var id = this._compileGetTemplate(node, frame, false, node.ignoreMissing);
    this._emitLine("callback(null," + id + ");});");
    this._emitLine('});');
    var id2 = this._tmpid();
    this._emitLine('tasks.push(');
    this._emitLine('function(template, callback){');
    this._emitLine('template.render(context.getVariables(), frame, ' + this._makeCallback(id2));
    this._emitLine('callback(null,' + id2 + ');});');
    this._emitLine('});');
    this._emitLine('tasks.push(');
    this._emitLine('function(result, callback){');
    this._emitLine(this.buffer + " += result;");
    this._emitLine('callback(null);');
    this._emitLine('});');
    this._emitLine('env.waterfall(tasks, function(){');
    this._addScopeLevel();
  };
  _proto.compileTemplateData = function compileTemplateData(node, frame) {
    this.compileLiteral(node, frame);
  };
  _proto.compileCapture = function compileCapture(node, frame) {
    var _this14 = this;
    // we need to temporarily override the current buffer id as 'output'
    // so the set block writes to the capture output instead of the buffer
    var buffer = this.buffer;
    this.buffer = 'output';
    this._emitLine('(function() {');
    this._emitLine('var output = "";');
    this._withScopedSyntax(function () {
      _this14.compile(node.body, frame);
    });
    this._emitLine('return output;');
    this._emitLine('})()');
    // and of course, revert back to the old buffer id
    this.buffer = buffer;
  };
  _proto.compileOutput = function compileOutput(node, frame) {
    var _this15 = this;
    var children = node.children;
    children.forEach(function (child) {
      // TemplateData is a special case because it is never
      // autoescaped, so simply output it for optimization
      if (child instanceof nodes.TemplateData) {
        if (child.value) {
          _this15._emit(_this15.buffer + " += ");
          _this15.compileLiteral(child, frame);
          _this15._emitLine(';');
        }
      } else {
        _this15._emit(_this15.buffer + " += runtime.suppressValue(");
        if (_this15.throwOnUndefined) {
          _this15._emit('runtime.ensureDefined(');
        }
        _this15.compile(child, frame);
        if (_this15.throwOnUndefined) {
          _this15._emit("," + node.lineno + "," + node.colno + ")");
        }
        _this15._emit(', env.opts.autoescape);\n');
      }
    });
  };
  _proto.compileRoot = function compileRoot(node, frame) {
    var _this16 = this;
    if (frame) {
      this.fail('compileRoot: root node can\'t have frame');
    }
    frame = new Frame();
    this._emitFuncBegin(node, 'root');
    this._emitLine('var parentTemplate = null;');
    this._compileChildren(node, frame);
    this._emitLine('if(parentTemplate) {');
    this._emitLine('parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);');
    this._emitLine('} else {');
    this._emitLine("cb(null, " + this.buffer + ");");
    this._emitLine('}');
    this._emitFuncEnd(true);
    this.inBlock = true;
    var blockNames = [];
    var blocks = node.findAll(nodes.Block);
    blocks.forEach(function (block, i) {
      var name = block.name.value;
      if (blockNames.indexOf(name) !== -1) {
        throw new Error("Block \"" + name + "\" defined more than once.");
      }
      blockNames.push(name);
      _this16._emitFuncBegin(block, "b_" + name);
      var tmpFrame = new Frame();
      _this16._emitLine('var frame = frame.push(true);');
      _this16.compile(block.body, tmpFrame);
      _this16._emitFuncEnd();
    });
    this._emitLine('return {');
    blocks.forEach(function (block, i) {
      var blockName = "b_" + block.name.value;
      _this16._emitLine(blockName + ": " + blockName + ",");
    });
    this._emitLine('root: root\n};');
  };
  _proto.compile = function compile(node, frame) {
    var _compile = this['compile' + node.typename];
    if (_compile) {
      _compile.call(this, node, frame);
    } else {
      this.fail("compile: Cannot compile node: " + node.typename, node.lineno, node.colno);
    }
  };
  _proto.getCode = function getCode() {
    return this.codebuf.join('');
  };
  return Compiler;
}(Obj);
module.exports = {
  compile: function compile(src, asyncFilters, extensions, name, opts) {
    if (opts === void 0) {
      opts = {};
    }
    var c = new Compiler(name, opts.throwOnUndefined);

    // Run the extension preprocessors against the source.
    var preprocessors = (extensions || []).map(function (ext) {
      return ext.preprocess;
    }).filter(function (f) {
      return !!f;
    });
    var processedSrc = preprocessors.reduce(function (s, processor) {
      return processor(s);
    }, src);
    c.compile(transformer.transform(parser.parse(processedSrc, extensions, opts), asyncFilters, name));
    return c.getCode();
  },
  Compiler: Compiler
};

/***/ }),

/***/ 4428:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var asap = __nccwpck_require__(7943);
var _waterfall = __nccwpck_require__(3980);
var lib = __nccwpck_require__(4127);
var compiler = __nccwpck_require__(4548);
var filters = __nccwpck_require__(9223);
var _require = __nccwpck_require__(4395),
  FileSystemLoader = _require.FileSystemLoader,
  WebLoader = _require.WebLoader,
  PrecompiledLoader = _require.PrecompiledLoader;
var tests = __nccwpck_require__(841);
var globals = __nccwpck_require__(8956);
var _require2 = __nccwpck_require__(7007),
  Obj = _require2.Obj,
  EmitterObj = _require2.EmitterObj;
var globalRuntime = __nccwpck_require__(1998);
var handleError = globalRuntime.handleError,
  Frame = globalRuntime.Frame;
var expressApp = __nccwpck_require__(6548);

// If the user is using the async API, *always* call it
// asynchronously even if the template was synchronous.
function callbackAsap(cb, err, res) {
  asap(function () {
    cb(err, res);
  });
}

/**
 * A no-op template, for use with {% include ignore missing %}
 */
var noopTmplSrc = {
  type: 'code',
  obj: {
    root: function root(env, context, frame, runtime, cb) {
      try {
        cb(null, '');
      } catch (e) {
        cb(handleError(e, null, null));
      }
    }
  }
};
var Environment = /*#__PURE__*/function (_EmitterObj) {
  _inheritsLoose(Environment, _EmitterObj);
  function Environment() {
    return _EmitterObj.apply(this, arguments) || this;
  }
  var _proto = Environment.prototype;
  _proto.init = function init(loaders, opts) {
    var _this = this;
    // The dev flag determines the trace that'll be shown on errors.
    // If set to true, returns the full trace from the error point,
    // otherwise will return trace starting from Template.render
    // (the full trace from within nunjucks may confuse developers using
    //  the library)
    // defaults to false
    opts = this.opts = opts || {};
    this.opts.dev = !!opts.dev;

    // The autoescape flag sets global autoescaping. If true,
    // every string variable will be escaped by default.
    // If false, strings can be manually escaped using the `escape` filter.
    // defaults to true
    this.opts.autoescape = opts.autoescape != null ? opts.autoescape : true;

    // If true, this will make the system throw errors if trying
    // to output a null or undefined value
    this.opts.throwOnUndefined = !!opts.throwOnUndefined;
    this.opts.trimBlocks = !!opts.trimBlocks;
    this.opts.lstripBlocks = !!opts.lstripBlocks;
    this.loaders = [];
    if (!loaders) {
      // The filesystem loader is only available server-side
      if (FileSystemLoader) {
        this.loaders = [new FileSystemLoader('views')];
      } else if (WebLoader) {
        this.loaders = [new WebLoader('/views')];
      }
    } else {
      this.loaders = lib.isArray(loaders) ? loaders : [loaders];
    }

    // It's easy to use precompiled templates: just include them
    // before you configure nunjucks and this will automatically
    // pick it up and use it
    if (typeof window !== 'undefined' && window.nunjucksPrecompiled) {
      this.loaders.unshift(new PrecompiledLoader(window.nunjucksPrecompiled));
    }
    this._initLoaders();
    this.globals = globals();
    this.filters = {};
    this.tests = {};
    this.asyncFilters = [];
    this.extensions = {};
    this.extensionsList = [];
    lib._entries(filters).forEach(function (_ref) {
      var name = _ref[0],
        filter = _ref[1];
      return _this.addFilter(name, filter);
    });
    lib._entries(tests).forEach(function (_ref2) {
      var name = _ref2[0],
        test = _ref2[1];
      return _this.addTest(name, test);
    });
  };
  _proto._initLoaders = function _initLoaders() {
    var _this2 = this;
    this.loaders.forEach(function (loader) {
      // Caching and cache busting
      loader.cache = {};
      if (typeof loader.on === 'function') {
        loader.on('update', function (name, fullname) {
          loader.cache[name] = null;
          _this2.emit('update', name, fullname, loader);
        });
        loader.on('load', function (name, source) {
          _this2.emit('load', name, source, loader);
        });
      }
    });
  };
  _proto.invalidateCache = function invalidateCache() {
    this.loaders.forEach(function (loader) {
      loader.cache = {};
    });
  };
  _proto.addExtension = function addExtension(name, extension) {
    extension.__name = name;
    this.extensions[name] = extension;
    this.extensionsList.push(extension);
    return this;
  };
  _proto.removeExtension = function removeExtension(name) {
    var extension = this.getExtension(name);
    if (!extension) {
      return;
    }
    this.extensionsList = lib.without(this.extensionsList, extension);
    delete this.extensions[name];
  };
  _proto.getExtension = function getExtension(name) {
    return this.extensions[name];
  };
  _proto.hasExtension = function hasExtension(name) {
    return !!this.extensions[name];
  };
  _proto.addGlobal = function addGlobal(name, value) {
    this.globals[name] = value;
    return this;
  };
  _proto.getGlobal = function getGlobal(name) {
    if (typeof this.globals[name] === 'undefined') {
      throw new Error('global not found: ' + name);
    }
    return this.globals[name];
  };
  _proto.addFilter = function addFilter(name, func, async) {
    var wrapped = func;
    if (async) {
      this.asyncFilters.push(name);
    }
    this.filters[name] = wrapped;
    return this;
  };
  _proto.getFilter = function getFilter(name) {
    if (!this.filters[name]) {
      throw new Error('filter not found: ' + name);
    }
    return this.filters[name];
  };
  _proto.addTest = function addTest(name, func) {
    this.tests[name] = func;
    return this;
  };
  _proto.getTest = function getTest(name) {
    if (!this.tests[name]) {
      throw new Error('test not found: ' + name);
    }
    return this.tests[name];
  };
  _proto.resolveTemplate = function resolveTemplate(loader, parentName, filename) {
    var isRelative = loader.isRelative && parentName ? loader.isRelative(filename) : false;
    return isRelative && loader.resolve ? loader.resolve(parentName, filename) : filename;
  };
  _proto.getTemplate = function getTemplate(name, eagerCompile, parentName, ignoreMissing, cb) {
    var _this3 = this;
    var that = this;
    var tmpl = null;
    if (name && name.raw) {
      // this fixes autoescape for templates referenced in symbols
      name = name.raw;
    }
    if (lib.isFunction(parentName)) {
      cb = parentName;
      parentName = null;
      eagerCompile = eagerCompile || false;
    }
    if (lib.isFunction(eagerCompile)) {
      cb = eagerCompile;
      eagerCompile = false;
    }
    if (name instanceof Template) {
      tmpl = name;
    } else if (typeof name !== 'string') {
      throw new Error('template names must be a string: ' + name);
    } else {
      for (var i = 0; i < this.loaders.length; i++) {
        var loader = this.loaders[i];
        tmpl = loader.cache[this.resolveTemplate(loader, parentName, name)];
        if (tmpl) {
          break;
        }
      }
    }
    if (tmpl) {
      if (eagerCompile) {
        tmpl.compile();
      }
      if (cb) {
        cb(null, tmpl);
        return undefined;
      } else {
        return tmpl;
      }
    }
    var syncResult;
    var createTemplate = function createTemplate(err, info) {
      if (!info && !err && !ignoreMissing) {
        err = new Error('template not found: ' + name);
      }
      if (err) {
        if (cb) {
          cb(err);
          return;
        } else {
          throw err;
        }
      }
      var newTmpl;
      if (!info) {
        newTmpl = new Template(noopTmplSrc, _this3, '', eagerCompile);
      } else {
        newTmpl = new Template(info.src, _this3, info.path, eagerCompile);
        if (!info.noCache) {
          info.loader.cache[name] = newTmpl;
        }
      }
      if (cb) {
        cb(null, newTmpl);
      } else {
        syncResult = newTmpl;
      }
    };
    lib.asyncIter(this.loaders, function (loader, i, next, done) {
      function handle(err, src) {
        if (err) {
          done(err);
        } else if (src) {
          src.loader = loader;
          done(null, src);
        } else {
          next();
        }
      }

      // Resolve name relative to parentName
      name = that.resolveTemplate(loader, parentName, name);
      if (loader.async) {
        loader.getSource(name, handle);
      } else {
        handle(null, loader.getSource(name));
      }
    }, createTemplate);
    return syncResult;
  };
  _proto.express = function express(app) {
    return expressApp(this, app);
  };
  _proto.render = function render(name, ctx, cb) {
    if (lib.isFunction(ctx)) {
      cb = ctx;
      ctx = null;
    }

    // We support a synchronous API to make it easier to migrate
    // existing code to async. This works because if you don't do
    // anything async work, the whole thing is actually run
    // synchronously.
    var syncResult = null;
    this.getTemplate(name, function (err, tmpl) {
      if (err && cb) {
        callbackAsap(cb, err);
      } else if (err) {
        throw err;
      } else {
        syncResult = tmpl.render(ctx, cb);
      }
    });
    return syncResult;
  };
  _proto.renderString = function renderString(src, ctx, opts, cb) {
    if (lib.isFunction(opts)) {
      cb = opts;
      opts = {};
    }
    opts = opts || {};
    var tmpl = new Template(src, this, opts.path);
    return tmpl.render(ctx, cb);
  };
  _proto.waterfall = function waterfall(tasks, callback, forceAsync) {
    return _waterfall(tasks, callback, forceAsync);
  };
  return Environment;
}(EmitterObj);
var Context = /*#__PURE__*/function (_Obj) {
  _inheritsLoose(Context, _Obj);
  function Context() {
    return _Obj.apply(this, arguments) || this;
  }
  var _proto2 = Context.prototype;
  _proto2.init = function init(ctx, blocks, env) {
    var _this4 = this;
    // Has to be tied to an environment so we can tap into its globals.
    this.env = env || new Environment();

    // Make a duplicate of ctx
    this.ctx = lib.extend({}, ctx);
    this.blocks = {};
    this.exported = [];
    lib.keys(blocks).forEach(function (name) {
      _this4.addBlock(name, blocks[name]);
    });
  };
  _proto2.lookup = function lookup(name) {
    // This is one of the most called functions, so optimize for
    // the typical case where the name isn't in the globals
    if (name in this.env.globals && !(name in this.ctx)) {
      return this.env.globals[name];
    } else {
      return this.ctx[name];
    }
  };
  _proto2.setVariable = function setVariable(name, val) {
    this.ctx[name] = val;
  };
  _proto2.getVariables = function getVariables() {
    return this.ctx;
  };
  _proto2.addBlock = function addBlock(name, block) {
    this.blocks[name] = this.blocks[name] || [];
    this.blocks[name].push(block);
    return this;
  };
  _proto2.getBlock = function getBlock(name) {
    if (!this.blocks[name]) {
      throw new Error('unknown block "' + name + '"');
    }
    return this.blocks[name][0];
  };
  _proto2.getSuper = function getSuper(env, name, block, frame, runtime, cb) {
    var idx = lib.indexOf(this.blocks[name] || [], block);
    var blk = this.blocks[name][idx + 1];
    var context = this;
    if (idx === -1 || !blk) {
      throw new Error('no super block available for "' + name + '"');
    }
    blk(env, context, frame, runtime, cb);
  };
  _proto2.addExport = function addExport(name) {
    this.exported.push(name);
  };
  _proto2.getExported = function getExported() {
    var _this5 = this;
    var exported = {};
    this.exported.forEach(function (name) {
      exported[name] = _this5.ctx[name];
    });
    return exported;
  };
  return Context;
}(Obj);
var Template = /*#__PURE__*/function (_Obj2) {
  _inheritsLoose(Template, _Obj2);
  function Template() {
    return _Obj2.apply(this, arguments) || this;
  }
  var _proto3 = Template.prototype;
  _proto3.init = function init(src, env, path, eagerCompile) {
    this.env = env || new Environment();
    if (lib.isObject(src)) {
      switch (src.type) {
        case 'code':
          this.tmplProps = src.obj;
          break;
        case 'string':
          this.tmplStr = src.obj;
          break;
        default:
          throw new Error("Unexpected template object type " + src.type + "; expected 'code', or 'string'");
      }
    } else if (lib.isString(src)) {
      this.tmplStr = src;
    } else {
      throw new Error('src must be a string or an object describing the source');
    }
    this.path = path;
    if (eagerCompile) {
      try {
        this._compile();
      } catch (err) {
        throw lib._prettifyError(this.path, this.env.opts.dev, err);
      }
    } else {
      this.compiled = false;
    }
  };
  _proto3.render = function render(ctx, parentFrame, cb) {
    var _this6 = this;
    if (typeof ctx === 'function') {
      cb = ctx;
      ctx = {};
    } else if (typeof parentFrame === 'function') {
      cb = parentFrame;
      parentFrame = null;
    }

    // If there is a parent frame, we are being called from internal
    // code of another template, and the internal system
    // depends on the sync/async nature of the parent template
    // to be inherited, so force an async callback
    var forceAsync = !parentFrame;

    // Catch compile errors for async rendering
    try {
      this.compile();
    } catch (e) {
      var err = lib._prettifyError(this.path, this.env.opts.dev, e);
      if (cb) {
        return callbackAsap(cb, err);
      } else {
        throw err;
      }
    }
    var context = new Context(ctx || {}, this.blocks, this.env);
    var frame = parentFrame ? parentFrame.push(true) : new Frame();
    frame.topLevel = true;
    var syncResult = null;
    var didError = false;
    this.rootRenderFunc(this.env, context, frame, globalRuntime, function (err, res) {
      // TODO: this is actually a bug in the compiled template (because waterfall
      // tasks are both not passing errors up the chain of callbacks AND are not
      // causing a return from the top-most render function). But fixing that
      // will require a more substantial change to the compiler.
      if (didError && cb && typeof res !== 'undefined') {
        // prevent multiple calls to cb
        return;
      }
      if (err) {
        err = lib._prettifyError(_this6.path, _this6.env.opts.dev, err);
        didError = true;
      }
      if (cb) {
        if (forceAsync) {
          callbackAsap(cb, err, res);
        } else {
          cb(err, res);
        }
      } else {
        if (err) {
          throw err;
        }
        syncResult = res;
      }
    });
    return syncResult;
  };
  _proto3.getExported = function getExported(ctx, parentFrame, cb) {
    // eslint-disable-line consistent-return
    if (typeof ctx === 'function') {
      cb = ctx;
      ctx = {};
    }
    if (typeof parentFrame === 'function') {
      cb = parentFrame;
      parentFrame = null;
    }

    // Catch compile errors for async rendering
    try {
      this.compile();
    } catch (e) {
      if (cb) {
        return cb(e);
      } else {
        throw e;
      }
    }
    var frame = parentFrame ? parentFrame.push() : new Frame();
    frame.topLevel = true;

    // Run the rootRenderFunc to populate the context with exported vars
    var context = new Context(ctx || {}, this.blocks, this.env);
    this.rootRenderFunc(this.env, context, frame, globalRuntime, function (err) {
      if (err) {
        cb(err, null);
      } else {
        cb(null, context.getExported());
      }
    });
  };
  _proto3.compile = function compile() {
    if (!this.compiled) {
      this._compile();
    }
  };
  _proto3._compile = function _compile() {
    var props;
    if (this.tmplProps) {
      props = this.tmplProps;
    } else {
      var source = compiler.compile(this.tmplStr, this.env.asyncFilters, this.env.extensionsList, this.path, this.env.opts);
      var func = new Function(source); // eslint-disable-line no-new-func
      props = func();
    }
    this.blocks = this._getBlocks(props);
    this.rootRenderFunc = props.root;
    this.compiled = true;
  };
  _proto3._getBlocks = function _getBlocks(props) {
    var blocks = {};
    lib.keys(props).forEach(function (k) {
      if (k.slice(0, 2) === 'b_') {
        blocks[k.slice(2)] = props[k];
      }
    });
    return blocks;
  };
  return Template;
}(Obj);
module.exports = {
  Environment: Environment,
  Template: Template
};

/***/ }),

/***/ 6548:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var path = __nccwpck_require__(1017);
module.exports = function express(env, app) {
  function NunjucksView(name, opts) {
    this.name = name;
    this.path = name;
    this.defaultEngine = opts.defaultEngine;
    this.ext = path.extname(name);
    if (!this.ext && !this.defaultEngine) {
      throw new Error('No default engine was specified and no extension was provided.');
    }
    if (!this.ext) {
      this.name += this.ext = (this.defaultEngine[0] !== '.' ? '.' : '') + this.defaultEngine;
    }
  }
  NunjucksView.prototype.render = function render(opts, cb) {
    env.render(this.name, opts, cb);
  };
  app.set('view', NunjucksView);
  app.set('nunjucksEnv', env);
  return env;
};

/***/ }),

/***/ 9223:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var lib = __nccwpck_require__(4127);
var r = __nccwpck_require__(1998);
var _exports = module.exports = {};
function normalize(value, defaultValue) {
  if (value === null || value === undefined || value === false) {
    return defaultValue;
  }
  return value;
}
_exports.abs = Math.abs;
function isNaN(num) {
  return num !== num; // eslint-disable-line no-self-compare
}

function batch(arr, linecount, fillWith) {
  var i;
  var res = [];
  var tmp = [];
  for (i = 0; i < arr.length; i++) {
    if (i % linecount === 0 && tmp.length) {
      res.push(tmp);
      tmp = [];
    }
    tmp.push(arr[i]);
  }
  if (tmp.length) {
    if (fillWith) {
      for (i = tmp.length; i < linecount; i++) {
        tmp.push(fillWith);
      }
    }
    res.push(tmp);
  }
  return res;
}
_exports.batch = batch;
function capitalize(str) {
  str = normalize(str, '');
  var ret = str.toLowerCase();
  return r.copySafeness(str, ret.charAt(0).toUpperCase() + ret.slice(1));
}
_exports.capitalize = capitalize;
function center(str, width) {
  str = normalize(str, '');
  width = width || 80;
  if (str.length >= width) {
    return str;
  }
  var spaces = width - str.length;
  var pre = lib.repeat(' ', spaces / 2 - spaces % 2);
  var post = lib.repeat(' ', spaces / 2);
  return r.copySafeness(str, pre + str + post);
}
_exports.center = center;
function default_(val, def, bool) {
  if (bool) {
    return val || def;
  } else {
    return val !== undefined ? val : def;
  }
}

// TODO: it is confusing to export something called 'default'
_exports['default'] = default_; // eslint-disable-line dot-notation

function dictsort(val, caseSensitive, by) {
  if (!lib.isObject(val)) {
    throw new lib.TemplateError('dictsort filter: val must be an object');
  }
  var array = [];
  // deliberately include properties from the object's prototype
  for (var k in val) {
    // eslint-disable-line guard-for-in, no-restricted-syntax
    array.push([k, val[k]]);
  }
  var si;
  if (by === undefined || by === 'key') {
    si = 0;
  } else if (by === 'value') {
    si = 1;
  } else {
    throw new lib.TemplateError('dictsort filter: You can only sort by either key or value');
  }
  array.sort(function (t1, t2) {
    var a = t1[si];
    var b = t2[si];
    if (!caseSensitive) {
      if (lib.isString(a)) {
        a = a.toUpperCase();
      }
      if (lib.isString(b)) {
        b = b.toUpperCase();
      }
    }
    return a > b ? 1 : a === b ? 0 : -1; // eslint-disable-line no-nested-ternary
  });

  return array;
}
_exports.dictsort = dictsort;
function dump(obj, spaces) {
  return JSON.stringify(obj, null, spaces);
}
_exports.dump = dump;
function escape(str) {
  if (str instanceof r.SafeString) {
    return str;
  }
  str = str === null || str === undefined ? '' : str;
  return r.markSafe(lib.escape(str.toString()));
}
_exports.escape = escape;
function safe(str) {
  if (str instanceof r.SafeString) {
    return str;
  }
  str = str === null || str === undefined ? '' : str;
  return r.markSafe(str.toString());
}
_exports.safe = safe;
function first(arr) {
  return arr[0];
}
_exports.first = first;
function forceescape(str) {
  str = str === null || str === undefined ? '' : str;
  return r.markSafe(lib.escape(str.toString()));
}
_exports.forceescape = forceescape;
function groupby(arr, attr) {
  return lib.groupBy(arr, attr, this.env.opts.throwOnUndefined);
}
_exports.groupby = groupby;
function indent(str, width, indentfirst) {
  str = normalize(str, '');
  if (str === '') {
    return '';
  }
  width = width || 4;
  // let res = '';
  var lines = str.split('\n');
  var sp = lib.repeat(' ', width);
  var res = lines.map(function (l, i) {
    return i === 0 && !indentfirst ? l : "" + sp + l;
  }).join('\n');
  return r.copySafeness(str, res);
}
_exports.indent = indent;
function join(arr, del, attr) {
  del = del || '';
  if (attr) {
    arr = lib.map(arr, function (v) {
      return v[attr];
    });
  }
  return arr.join(del);
}
_exports.join = join;
function last(arr) {
  return arr[arr.length - 1];
}
_exports.last = last;
function lengthFilter(val) {
  var value = normalize(val, '');
  if (value !== undefined) {
    if (typeof Map === 'function' && value instanceof Map || typeof Set === 'function' && value instanceof Set) {
      // ECMAScript 2015 Maps and Sets
      return value.size;
    }
    if (lib.isObject(value) && !(value instanceof r.SafeString)) {
      // Objects (besides SafeStrings), non-primative Arrays
      return lib.keys(value).length;
    }
    return value.length;
  }
  return 0;
}
_exports.length = lengthFilter;
function list(val) {
  if (lib.isString(val)) {
    return val.split('');
  } else if (lib.isObject(val)) {
    return lib._entries(val || {}).map(function (_ref) {
      var key = _ref[0],
        value = _ref[1];
      return {
        key: key,
        value: value
      };
    });
  } else if (lib.isArray(val)) {
    return val;
  } else {
    throw new lib.TemplateError('list filter: type not iterable');
  }
}
_exports.list = list;
function lower(str) {
  str = normalize(str, '');
  return str.toLowerCase();
}
_exports.lower = lower;
function nl2br(str) {
  if (str === null || str === undefined) {
    return '';
  }
  return r.copySafeness(str, str.replace(/\r\n|\n/g, '<br />\n'));
}
_exports.nl2br = nl2br;
function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
_exports.random = random;

/**
 * Construct select or reject filter
 *
 * @param {boolean} expectedTestResult
 * @returns {function(array, string, *): array}
 */
function getSelectOrReject(expectedTestResult) {
  function filter(arr, testName, secondArg) {
    if (testName === void 0) {
      testName = 'truthy';
    }
    var context = this;
    var test = context.env.getTest(testName);
    return lib.toArray(arr).filter(function examineTestResult(item) {
      return test.call(context, item, secondArg) === expectedTestResult;
    });
  }
  return filter;
}
_exports.reject = getSelectOrReject(false);
function rejectattr(arr, attr) {
  return arr.filter(function (item) {
    return !item[attr];
  });
}
_exports.rejectattr = rejectattr;
_exports.select = getSelectOrReject(true);
function selectattr(arr, attr) {
  return arr.filter(function (item) {
    return !!item[attr];
  });
}
_exports.selectattr = selectattr;
function replace(str, old, new_, maxCount) {
  var originalStr = str;
  if (old instanceof RegExp) {
    return str.replace(old, new_);
  }
  if (typeof maxCount === 'undefined') {
    maxCount = -1;
  }
  var res = ''; // Output

  // Cast Numbers in the search term to string
  if (typeof old === 'number') {
    old = '' + old;
  } else if (typeof old !== 'string') {
    // If it is something other than number or string,
    // return the original string
    return str;
  }

  // Cast numbers in the replacement to string
  if (typeof str === 'number') {
    str = '' + str;
  }

  // If by now, we don't have a string, throw it back
  if (typeof str !== 'string' && !(str instanceof r.SafeString)) {
    return str;
  }

  // ShortCircuits
  if (old === '') {
    // Mimic the python behaviour: empty string is replaced
    // by replacement e.g. "abc"|replace("", ".") -> .a.b.c.
    res = new_ + str.split('').join(new_) + new_;
    return r.copySafeness(str, res);
  }
  var nextIndex = str.indexOf(old);
  // if # of replacements to perform is 0, or the string to does
  // not contain the old value, return the string
  if (maxCount === 0 || nextIndex === -1) {
    return str;
  }
  var pos = 0;
  var count = 0; // # of replacements made

  while (nextIndex > -1 && (maxCount === -1 || count < maxCount)) {
    // Grab the next chunk of src string and add it with the
    // replacement, to the result
    res += str.substring(pos, nextIndex) + new_;
    // Increment our pointer in the src string
    pos = nextIndex + old.length;
    count++;
    // See if there are any more replacements to be made
    nextIndex = str.indexOf(old, pos);
  }

  // We've either reached the end, or done the max # of
  // replacements, tack on any remaining string
  if (pos < str.length) {
    res += str.substring(pos);
  }
  return r.copySafeness(originalStr, res);
}
_exports.replace = replace;
function reverse(val) {
  var arr;
  if (lib.isString(val)) {
    arr = list(val);
  } else {
    // Copy it
    arr = lib.map(val, function (v) {
      return v;
    });
  }
  arr.reverse();
  if (lib.isString(val)) {
    return r.copySafeness(val, arr.join(''));
  }
  return arr;
}
_exports.reverse = reverse;
function round(val, precision, method) {
  precision = precision || 0;
  var factor = Math.pow(10, precision);
  var rounder;
  if (method === 'ceil') {
    rounder = Math.ceil;
  } else if (method === 'floor') {
    rounder = Math.floor;
  } else {
    rounder = Math.round;
  }
  return rounder(val * factor) / factor;
}
_exports.round = round;
function slice(arr, slices, fillWith) {
  var sliceLength = Math.floor(arr.length / slices);
  var extra = arr.length % slices;
  var res = [];
  var offset = 0;
  for (var i = 0; i < slices; i++) {
    var start = offset + i * sliceLength;
    if (i < extra) {
      offset++;
    }
    var end = offset + (i + 1) * sliceLength;
    var currSlice = arr.slice(start, end);
    if (fillWith && i >= extra) {
      currSlice.push(fillWith);
    }
    res.push(currSlice);
  }
  return res;
}
_exports.slice = slice;
function sum(arr, attr, start) {
  if (start === void 0) {
    start = 0;
  }
  if (attr) {
    arr = lib.map(arr, function (v) {
      return v[attr];
    });
  }
  return start + arr.reduce(function (a, b) {
    return a + b;
  }, 0);
}
_exports.sum = sum;
_exports.sort = r.makeMacro(['value', 'reverse', 'case_sensitive', 'attribute'], [], function sortFilter(arr, reversed, caseSens, attr) {
  var _this = this;
  // Copy it
  var array = lib.map(arr, function (v) {
    return v;
  });
  var getAttribute = lib.getAttrGetter(attr);
  array.sort(function (a, b) {
    var x = attr ? getAttribute(a) : a;
    var y = attr ? getAttribute(b) : b;
    if (_this.env.opts.throwOnUndefined && attr && (x === undefined || y === undefined)) {
      throw new TypeError("sort: attribute \"" + attr + "\" resolved to undefined");
    }
    if (!caseSens && lib.isString(x) && lib.isString(y)) {
      x = x.toLowerCase();
      y = y.toLowerCase();
    }
    if (x < y) {
      return reversed ? 1 : -1;
    } else if (x > y) {
      return reversed ? -1 : 1;
    } else {
      return 0;
    }
  });
  return array;
});
function string(obj) {
  return r.copySafeness(obj, obj);
}
_exports.string = string;
function striptags(input, preserveLinebreaks) {
  input = normalize(input, '');
  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>|<!--[\s\S]*?-->/gi;
  var trimmedInput = trim(input.replace(tags, ''));
  var res = '';
  if (preserveLinebreaks) {
    res = trimmedInput.replace(/^ +| +$/gm, '') // remove leading and trailing spaces
    .replace(/ +/g, ' ') // squash adjacent spaces
    .replace(/(\r\n)/g, '\n') // normalize linebreaks (CRLF -> LF)
    .replace(/\n\n\n+/g, '\n\n'); // squash abnormal adjacent linebreaks
  } else {
    res = trimmedInput.replace(/\s+/gi, ' ');
  }
  return r.copySafeness(input, res);
}
_exports.striptags = striptags;
function title(str) {
  str = normalize(str, '');
  var words = str.split(' ').map(function (word) {
    return capitalize(word);
  });
  return r.copySafeness(str, words.join(' '));
}
_exports.title = title;
function trim(str) {
  return r.copySafeness(str, str.replace(/^\s*|\s*$/g, ''));
}
_exports.trim = trim;
function truncate(input, length, killwords, end) {
  var orig = input;
  input = normalize(input, '');
  length = length || 255;
  if (input.length <= length) {
    return input;
  }
  if (killwords) {
    input = input.substring(0, length);
  } else {
    var idx = input.lastIndexOf(' ', length);
    if (idx === -1) {
      idx = length;
    }
    input = input.substring(0, idx);
  }
  input += end !== undefined && end !== null ? end : '...';
  return r.copySafeness(orig, input);
}
_exports.truncate = truncate;
function upper(str) {
  str = normalize(str, '');
  return str.toUpperCase();
}
_exports.upper = upper;
function urlencode(obj) {
  var enc = encodeURIComponent;
  if (lib.isString(obj)) {
    return enc(obj);
  } else {
    var keyvals = lib.isArray(obj) ? obj : lib._entries(obj);
    return keyvals.map(function (_ref2) {
      var k = _ref2[0],
        v = _ref2[1];
      return enc(k) + "=" + enc(v);
    }).join('&');
  }
}
_exports.urlencode = urlencode;

// For the jinja regexp, see
// https://github.com/mitsuhiko/jinja2/blob/f15b814dcba6aa12bc74d1f7d0c881d55f7126be/jinja2/utils.py#L20-L23
var puncRe = /^(?:\(|<|&lt;)?(.*?)(?:\.|,|\)|\n|&gt;)?$/;
// from http://blog.gerv.net/2011/05/html5_email_address_regexp/
var emailRe = /^[\w.!#$%&'*+\-\/=?\^`{|}~]+@[a-z\d\-]+(\.[a-z\d\-]+)+$/i;
var httpHttpsRe = /^https?:\/\/.*$/;
var wwwRe = /^www\./;
var tldRe = /\.(?:org|net|com)(?:\:|\/|$)/;
function urlize(str, length, nofollow) {
  if (isNaN(length)) {
    length = Infinity;
  }
  var noFollowAttr = nofollow === true ? ' rel="nofollow"' : '';
  var words = str.split(/(\s+)/).filter(function (word) {
    // If the word has no length, bail. This can happen for str with
    // trailing whitespace.
    return word && word.length;
  }).map(function (word) {
    var matches = word.match(puncRe);
    var possibleUrl = matches ? matches[1] : word;
    var shortUrl = possibleUrl.substr(0, length);

    // url that starts with http or https
    if (httpHttpsRe.test(possibleUrl)) {
      return "<a href=\"" + possibleUrl + "\"" + noFollowAttr + ">" + shortUrl + "</a>";
    }

    // url that starts with www.
    if (wwwRe.test(possibleUrl)) {
      return "<a href=\"http://" + possibleUrl + "\"" + noFollowAttr + ">" + shortUrl + "</a>";
    }

    // an email address of the form username@domain.tld
    if (emailRe.test(possibleUrl)) {
      return "<a href=\"mailto:" + possibleUrl + "\">" + possibleUrl + "</a>";
    }

    // url that ends in .com, .org or .net that is not an email address
    if (tldRe.test(possibleUrl)) {
      return "<a href=\"http://" + possibleUrl + "\"" + noFollowAttr + ">" + shortUrl + "</a>";
    }
    return word;
  });
  return words.join('');
}
_exports.urlize = urlize;
function wordcount(str) {
  str = normalize(str, '');
  var words = str ? str.match(/\w+/g) : null;
  return words ? words.length : null;
}
_exports.wordcount = wordcount;
function float(val, def) {
  var res = parseFloat(val);
  return isNaN(res) ? def : res;
}
_exports.float = float;
var intFilter = r.makeMacro(['value', 'default', 'base'], [], function doInt(value, defaultValue, base) {
  if (base === void 0) {
    base = 10;
  }
  var res = parseInt(value, base);
  return isNaN(res) ? defaultValue : res;
});
_exports.int = intFilter;

// Aliases
_exports.d = _exports.default;
_exports.e = _exports.escape;

/***/ }),

/***/ 8956:
/***/ ((module) => {

"use strict";


function _cycler(items) {
  var index = -1;
  return {
    current: null,
    reset: function reset() {
      index = -1;
      this.current = null;
    },
    next: function next() {
      index++;
      if (index >= items.length) {
        index = 0;
      }
      this.current = items[index];
      return this.current;
    }
  };
}
function _joiner(sep) {
  sep = sep || ',';
  var first = true;
  return function () {
    var val = first ? '' : sep;
    first = false;
    return val;
  };
}

// Making this a function instead so it returns a new object
// each time it's called. That way, if something like an environment
// uses it, they will each have their own copy.
function globals() {
  return {
    range: function range(start, stop, step) {
      if (typeof stop === 'undefined') {
        stop = start;
        start = 0;
        step = 1;
      } else if (!step) {
        step = 1;
      }
      var arr = [];
      if (step > 0) {
        for (var i = start; i < stop; i += step) {
          arr.push(i);
        }
      } else {
        for (var _i = start; _i > stop; _i += step) {
          // eslint-disable-line for-direction
          arr.push(_i);
        }
      }
      return arr;
    },
    cycler: function cycler() {
      return _cycler(Array.prototype.slice.call(arguments));
    },
    joiner: function joiner(sep) {
      return _joiner(sep);
    }
  };
}
module.exports = globals;

/***/ }),

/***/ 6976:
/***/ ((module) => {

"use strict";


function installCompat() {
  'use strict';

  /* eslint-disable camelcase */

  // This must be called like `nunjucks.installCompat` so that `this`
  // references the nunjucks instance
  var runtime = this.runtime;
  var lib = this.lib;
  // Handle slim case where these 'modules' are excluded from the built source
  var Compiler = this.compiler.Compiler;
  var Parser = this.parser.Parser;
  var nodes = this.nodes;
  var lexer = this.lexer;
  var orig_contextOrFrameLookup = runtime.contextOrFrameLookup;
  var orig_memberLookup = runtime.memberLookup;
  var orig_Compiler_assertType;
  var orig_Parser_parseAggregate;
  if (Compiler) {
    orig_Compiler_assertType = Compiler.prototype.assertType;
  }
  if (Parser) {
    orig_Parser_parseAggregate = Parser.prototype.parseAggregate;
  }
  function uninstall() {
    runtime.contextOrFrameLookup = orig_contextOrFrameLookup;
    runtime.memberLookup = orig_memberLookup;
    if (Compiler) {
      Compiler.prototype.assertType = orig_Compiler_assertType;
    }
    if (Parser) {
      Parser.prototype.parseAggregate = orig_Parser_parseAggregate;
    }
  }
  runtime.contextOrFrameLookup = function contextOrFrameLookup(context, frame, key) {
    var val = orig_contextOrFrameLookup.apply(this, arguments);
    if (val !== undefined) {
      return val;
    }
    switch (key) {
      case 'True':
        return true;
      case 'False':
        return false;
      case 'None':
        return null;
      default:
        return undefined;
    }
  };
  function getTokensState(tokens) {
    return {
      index: tokens.index,
      lineno: tokens.lineno,
      colno: tokens.colno
    };
  }
  if (process.env.BUILD_TYPE !== 'SLIM' && nodes && Compiler && Parser) {
    // i.e., not slim mode
    var Slice = nodes.Node.extend('Slice', {
      fields: ['start', 'stop', 'step'],
      init: function init(lineno, colno, start, stop, step) {
        start = start || new nodes.Literal(lineno, colno, null);
        stop = stop || new nodes.Literal(lineno, colno, null);
        step = step || new nodes.Literal(lineno, colno, 1);
        this.parent(lineno, colno, start, stop, step);
      }
    });
    Compiler.prototype.assertType = function assertType(node) {
      if (node instanceof Slice) {
        return;
      }
      orig_Compiler_assertType.apply(this, arguments);
    };
    Compiler.prototype.compileSlice = function compileSlice(node, frame) {
      this._emit('(');
      this._compileExpression(node.start, frame);
      this._emit('),(');
      this._compileExpression(node.stop, frame);
      this._emit('),(');
      this._compileExpression(node.step, frame);
      this._emit(')');
    };
    Parser.prototype.parseAggregate = function parseAggregate() {
      var _this = this;
      var origState = getTokensState(this.tokens);
      // Set back one accounting for opening bracket/parens
      origState.colno--;
      origState.index--;
      try {
        return orig_Parser_parseAggregate.apply(this);
      } catch (e) {
        var errState = getTokensState(this.tokens);
        var rethrow = function rethrow() {
          lib._assign(_this.tokens, errState);
          return e;
        };

        // Reset to state before original parseAggregate called
        lib._assign(this.tokens, origState);
        this.peeked = false;
        var tok = this.peekToken();
        if (tok.type !== lexer.TOKEN_LEFT_BRACKET) {
          throw rethrow();
        } else {
          this.nextToken();
        }
        var node = new Slice(tok.lineno, tok.colno);

        // If we don't encounter a colon while parsing, this is not a slice,
        // so re-raise the original exception.
        var isSlice = false;
        for (var i = 0; i <= node.fields.length; i++) {
          if (this.skip(lexer.TOKEN_RIGHT_BRACKET)) {
            break;
          }
          if (i === node.fields.length) {
            if (isSlice) {
              this.fail('parseSlice: too many slice components', tok.lineno, tok.colno);
            } else {
              break;
            }
          }
          if (this.skip(lexer.TOKEN_COLON)) {
            isSlice = true;
          } else {
            var field = node.fields[i];
            node[field] = this.parseExpression();
            isSlice = this.skip(lexer.TOKEN_COLON) || isSlice;
          }
        }
        if (!isSlice) {
          throw rethrow();
        }
        return new nodes.Array(tok.lineno, tok.colno, [node]);
      }
    };
  }
  function sliceLookup(obj, start, stop, step) {
    obj = obj || [];
    if (start === null) {
      start = step < 0 ? obj.length - 1 : 0;
    }
    if (stop === null) {
      stop = step < 0 ? -1 : obj.length;
    } else if (stop < 0) {
      stop += obj.length;
    }
    if (start < 0) {
      start += obj.length;
    }
    var results = [];
    for (var i = start;; i += step) {
      if (i < 0 || i > obj.length) {
        break;
      }
      if (step > 0 && i >= stop) {
        break;
      }
      if (step < 0 && i <= stop) {
        break;
      }
      results.push(runtime.memberLookup(obj, i));
    }
    return results;
  }
  function hasOwnProp(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }
  var ARRAY_MEMBERS = {
    pop: function pop(index) {
      if (index === undefined) {
        return this.pop();
      }
      if (index >= this.length || index < 0) {
        throw new Error('KeyError');
      }
      return this.splice(index, 1);
    },
    append: function append(element) {
      return this.push(element);
    },
    remove: function remove(element) {
      for (var i = 0; i < this.length; i++) {
        if (this[i] === element) {
          return this.splice(i, 1);
        }
      }
      throw new Error('ValueError');
    },
    count: function count(element) {
      var count = 0;
      for (var i = 0; i < this.length; i++) {
        if (this[i] === element) {
          count++;
        }
      }
      return count;
    },
    index: function index(element) {
      var i;
      if ((i = this.indexOf(element)) === -1) {
        throw new Error('ValueError');
      }
      return i;
    },
    find: function find(element) {
      return this.indexOf(element);
    },
    insert: function insert(index, elem) {
      return this.splice(index, 0, elem);
    }
  };
  var OBJECT_MEMBERS = {
    items: function items() {
      return lib._entries(this);
    },
    values: function values() {
      return lib._values(this);
    },
    keys: function keys() {
      return lib.keys(this);
    },
    get: function get(key, def) {
      var output = this[key];
      if (output === undefined) {
        output = def;
      }
      return output;
    },
    has_key: function has_key(key) {
      return hasOwnProp(this, key);
    },
    pop: function pop(key, def) {
      var output = this[key];
      if (output === undefined && def !== undefined) {
        output = def;
      } else if (output === undefined) {
        throw new Error('KeyError');
      } else {
        delete this[key];
      }
      return output;
    },
    popitem: function popitem() {
      var keys = lib.keys(this);
      if (!keys.length) {
        throw new Error('KeyError');
      }
      var k = keys[0];
      var val = this[k];
      delete this[k];
      return [k, val];
    },
    setdefault: function setdefault(key, def) {
      if (def === void 0) {
        def = null;
      }
      if (!(key in this)) {
        this[key] = def;
      }
      return this[key];
    },
    update: function update(kwargs) {
      lib._assign(this, kwargs);
      return null; // Always returns None
    }
  };

  OBJECT_MEMBERS.iteritems = OBJECT_MEMBERS.items;
  OBJECT_MEMBERS.itervalues = OBJECT_MEMBERS.values;
  OBJECT_MEMBERS.iterkeys = OBJECT_MEMBERS.keys;
  runtime.memberLookup = function memberLookup(obj, val, autoescape) {
    if (arguments.length === 4) {
      return sliceLookup.apply(this, arguments);
    }
    obj = obj || {};

    // If the object is an object, return any of the methods that Python would
    // otherwise provide.
    if (lib.isArray(obj) && hasOwnProp(ARRAY_MEMBERS, val)) {
      return ARRAY_MEMBERS[val].bind(obj);
    }
    if (lib.isObject(obj) && hasOwnProp(OBJECT_MEMBERS, val)) {
      return OBJECT_MEMBERS[val].bind(obj);
    }
    return orig_memberLookup.apply(this, arguments);
  };
  return uninstall;
}
module.exports = installCompat;

/***/ }),

/***/ 3158:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var lib = __nccwpck_require__(4127);
var whitespaceChars = " \n\t\r\xA0";
var delimChars = '()[]{}%*-+~/#,:|.<>=!';
var intChars = '0123456789';
var BLOCK_START = '{%';
var BLOCK_END = '%}';
var VARIABLE_START = '{{';
var VARIABLE_END = '}}';
var COMMENT_START = '{#';
var COMMENT_END = '#}';
var TOKEN_STRING = 'string';
var TOKEN_WHITESPACE = 'whitespace';
var TOKEN_DATA = 'data';
var TOKEN_BLOCK_START = 'block-start';
var TOKEN_BLOCK_END = 'block-end';
var TOKEN_VARIABLE_START = 'variable-start';
var TOKEN_VARIABLE_END = 'variable-end';
var TOKEN_COMMENT = 'comment';
var TOKEN_LEFT_PAREN = 'left-paren';
var TOKEN_RIGHT_PAREN = 'right-paren';
var TOKEN_LEFT_BRACKET = 'left-bracket';
var TOKEN_RIGHT_BRACKET = 'right-bracket';
var TOKEN_LEFT_CURLY = 'left-curly';
var TOKEN_RIGHT_CURLY = 'right-curly';
var TOKEN_OPERATOR = 'operator';
var TOKEN_COMMA = 'comma';
var TOKEN_COLON = 'colon';
var TOKEN_TILDE = 'tilde';
var TOKEN_PIPE = 'pipe';
var TOKEN_INT = 'int';
var TOKEN_FLOAT = 'float';
var TOKEN_BOOLEAN = 'boolean';
var TOKEN_NONE = 'none';
var TOKEN_SYMBOL = 'symbol';
var TOKEN_SPECIAL = 'special';
var TOKEN_REGEX = 'regex';
function token(type, value, lineno, colno) {
  return {
    type: type,
    value: value,
    lineno: lineno,
    colno: colno
  };
}
var Tokenizer = /*#__PURE__*/function () {
  function Tokenizer(str, opts) {
    this.str = str;
    this.index = 0;
    this.len = str.length;
    this.lineno = 0;
    this.colno = 0;
    this.in_code = false;
    opts = opts || {};
    var tags = opts.tags || {};
    this.tags = {
      BLOCK_START: tags.blockStart || BLOCK_START,
      BLOCK_END: tags.blockEnd || BLOCK_END,
      VARIABLE_START: tags.variableStart || VARIABLE_START,
      VARIABLE_END: tags.variableEnd || VARIABLE_END,
      COMMENT_START: tags.commentStart || COMMENT_START,
      COMMENT_END: tags.commentEnd || COMMENT_END
    };
    this.trimBlocks = !!opts.trimBlocks;
    this.lstripBlocks = !!opts.lstripBlocks;
  }
  var _proto = Tokenizer.prototype;
  _proto.nextToken = function nextToken() {
    var lineno = this.lineno;
    var colno = this.colno;
    var tok;
    if (this.in_code) {
      // Otherwise, if we are in a block parse it as code
      var cur = this.current();
      if (this.isFinished()) {
        // We have nothing else to parse
        return null;
      } else if (cur === '"' || cur === '\'') {
        // We've hit a string
        return token(TOKEN_STRING, this._parseString(cur), lineno, colno);
      } else if (tok = this._extract(whitespaceChars)) {
        // We hit some whitespace
        return token(TOKEN_WHITESPACE, tok, lineno, colno);
      } else if ((tok = this._extractString(this.tags.BLOCK_END)) || (tok = this._extractString('-' + this.tags.BLOCK_END))) {
        // Special check for the block end tag
        //
        // It is a requirement that start and end tags are composed of
        // delimiter characters (%{}[] etc), and our code always
        // breaks on delimiters so we can assume the token parsing
        // doesn't consume these elsewhere
        this.in_code = false;
        if (this.trimBlocks) {
          cur = this.current();
          if (cur === '\n') {
            // Skip newline
            this.forward();
          } else if (cur === '\r') {
            // Skip CRLF newline
            this.forward();
            cur = this.current();
            if (cur === '\n') {
              this.forward();
            } else {
              // Was not a CRLF, so go back
              this.back();
            }
          }
        }
        return token(TOKEN_BLOCK_END, tok, lineno, colno);
      } else if ((tok = this._extractString(this.tags.VARIABLE_END)) || (tok = this._extractString('-' + this.tags.VARIABLE_END))) {
        // Special check for variable end tag (see above)
        this.in_code = false;
        return token(TOKEN_VARIABLE_END, tok, lineno, colno);
      } else if (cur === 'r' && this.str.charAt(this.index + 1) === '/') {
        // Skip past 'r/'.
        this.forwardN(2);

        // Extract until the end of the regex -- / ends it, \/ does not.
        var regexBody = '';
        while (!this.isFinished()) {
          if (this.current() === '/' && this.previous() !== '\\') {
            this.forward();
            break;
          } else {
            regexBody += this.current();
            this.forward();
          }
        }

        // Check for flags.
        // The possible flags are according to https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
        var POSSIBLE_FLAGS = ['g', 'i', 'm', 'y'];
        var regexFlags = '';
        while (!this.isFinished()) {
          var isCurrentAFlag = POSSIBLE_FLAGS.indexOf(this.current()) !== -1;
          if (isCurrentAFlag) {
            regexFlags += this.current();
            this.forward();
          } else {
            break;
          }
        }
        return token(TOKEN_REGEX, {
          body: regexBody,
          flags: regexFlags
        }, lineno, colno);
      } else if (delimChars.indexOf(cur) !== -1) {
        // We've hit a delimiter (a special char like a bracket)
        this.forward();
        var complexOps = ['==', '===', '!=', '!==', '<=', '>=', '//', '**'];
        var curComplex = cur + this.current();
        var type;
        if (lib.indexOf(complexOps, curComplex) !== -1) {
          this.forward();
          cur = curComplex;

          // See if this is a strict equality/inequality comparator
          if (lib.indexOf(complexOps, curComplex + this.current()) !== -1) {
            cur = curComplex + this.current();
            this.forward();
          }
        }
        switch (cur) {
          case '(':
            type = TOKEN_LEFT_PAREN;
            break;
          case ')':
            type = TOKEN_RIGHT_PAREN;
            break;
          case '[':
            type = TOKEN_LEFT_BRACKET;
            break;
          case ']':
            type = TOKEN_RIGHT_BRACKET;
            break;
          case '{':
            type = TOKEN_LEFT_CURLY;
            break;
          case '}':
            type = TOKEN_RIGHT_CURLY;
            break;
          case ',':
            type = TOKEN_COMMA;
            break;
          case ':':
            type = TOKEN_COLON;
            break;
          case '~':
            type = TOKEN_TILDE;
            break;
          case '|':
            type = TOKEN_PIPE;
            break;
          default:
            type = TOKEN_OPERATOR;
        }
        return token(type, cur, lineno, colno);
      } else {
        // We are not at whitespace or a delimiter, so extract the
        // text and parse it
        tok = this._extractUntil(whitespaceChars + delimChars);
        if (tok.match(/^[-+]?[0-9]+$/)) {
          if (this.current() === '.') {
            this.forward();
            var dec = this._extract(intChars);
            return token(TOKEN_FLOAT, tok + '.' + dec, lineno, colno);
          } else {
            return token(TOKEN_INT, tok, lineno, colno);
          }
        } else if (tok.match(/^(true|false)$/)) {
          return token(TOKEN_BOOLEAN, tok, lineno, colno);
        } else if (tok === 'none') {
          return token(TOKEN_NONE, tok, lineno, colno);
          /*
           * Added to make the test `null is null` evaluate truthily.
           * Otherwise, Nunjucks will look up null in the context and
           * return `undefined`, which is not what we want. This *may* have
           * consequences is someone is using null in their templates as a
           * variable.
           */
        } else if (tok === 'null') {
          return token(TOKEN_NONE, tok, lineno, colno);
        } else if (tok) {
          return token(TOKEN_SYMBOL, tok, lineno, colno);
        } else {
          throw new Error('Unexpected value while parsing: ' + tok);
        }
      }
    } else {
      // Parse out the template text, breaking on tag
      // delimiters because we need to look for block/variable start
      // tags (don't use the full delimChars for optimization)
      var beginChars = this.tags.BLOCK_START.charAt(0) + this.tags.VARIABLE_START.charAt(0) + this.tags.COMMENT_START.charAt(0) + this.tags.COMMENT_END.charAt(0);
      if (this.isFinished()) {
        return null;
      } else if ((tok = this._extractString(this.tags.BLOCK_START + '-')) || (tok = this._extractString(this.tags.BLOCK_START))) {
        this.in_code = true;
        return token(TOKEN_BLOCK_START, tok, lineno, colno);
      } else if ((tok = this._extractString(this.tags.VARIABLE_START + '-')) || (tok = this._extractString(this.tags.VARIABLE_START))) {
        this.in_code = true;
        return token(TOKEN_VARIABLE_START, tok, lineno, colno);
      } else {
        tok = '';
        var data;
        var inComment = false;
        if (this._matches(this.tags.COMMENT_START)) {
          inComment = true;
          tok = this._extractString(this.tags.COMMENT_START);
        }

        // Continually consume text, breaking on the tag delimiter
        // characters and checking to see if it's a start tag.
        //
        // We could hit the end of the template in the middle of
        // our looping, so check for the null return value from
        // _extractUntil
        while ((data = this._extractUntil(beginChars)) !== null) {
          tok += data;
          if ((this._matches(this.tags.BLOCK_START) || this._matches(this.tags.VARIABLE_START) || this._matches(this.tags.COMMENT_START)) && !inComment) {
            if (this.lstripBlocks && this._matches(this.tags.BLOCK_START) && this.colno > 0 && this.colno <= tok.length) {
              var lastLine = tok.slice(-this.colno);
              if (/^\s+$/.test(lastLine)) {
                // Remove block leading whitespace from beginning of the string
                tok = tok.slice(0, -this.colno);
                if (!tok.length) {
                  // All data removed, collapse to avoid unnecessary nodes
                  // by returning next token (block start)
                  return this.nextToken();
                }
              }
            }
            // If it is a start tag, stop looping
            break;
          } else if (this._matches(this.tags.COMMENT_END)) {
            if (!inComment) {
              throw new Error('unexpected end of comment');
            }
            tok += this._extractString(this.tags.COMMENT_END);
            break;
          } else {
            // It does not match any tag, so add the character and
            // carry on
            tok += this.current();
            this.forward();
          }
        }
        if (data === null && inComment) {
          throw new Error('expected end of comment, got end of file');
        }
        return token(inComment ? TOKEN_COMMENT : TOKEN_DATA, tok, lineno, colno);
      }
    }
  };
  _proto._parseString = function _parseString(delimiter) {
    this.forward();
    var str = '';
    while (!this.isFinished() && this.current() !== delimiter) {
      var cur = this.current();
      if (cur === '\\') {
        this.forward();
        switch (this.current()) {
          case 'n':
            str += '\n';
            break;
          case 't':
            str += '\t';
            break;
          case 'r':
            str += '\r';
            break;
          default:
            str += this.current();
        }
        this.forward();
      } else {
        str += cur;
        this.forward();
      }
    }
    this.forward();
    return str;
  };
  _proto._matches = function _matches(str) {
    if (this.index + str.length > this.len) {
      return null;
    }
    var m = this.str.slice(this.index, this.index + str.length);
    return m === str;
  };
  _proto._extractString = function _extractString(str) {
    if (this._matches(str)) {
      this.forwardN(str.length);
      return str;
    }
    return null;
  };
  _proto._extractUntil = function _extractUntil(charString) {
    // Extract all non-matching chars, with the default matching set
    // to everything
    return this._extractMatching(true, charString || '');
  };
  _proto._extract = function _extract(charString) {
    // Extract all matching chars (no default, so charString must be
    // explicit)
    return this._extractMatching(false, charString);
  };
  _proto._extractMatching = function _extractMatching(breakOnMatch, charString) {
    // Pull out characters until a breaking char is hit.
    // If breakOnMatch is false, a non-matching char stops it.
    // If breakOnMatch is true, a matching char stops it.

    if (this.isFinished()) {
      return null;
    }
    var first = charString.indexOf(this.current());

    // Only proceed if the first character doesn't meet our condition
    if (breakOnMatch && first === -1 || !breakOnMatch && first !== -1) {
      var t = this.current();
      this.forward();

      // And pull out all the chars one at a time until we hit a
      // breaking char
      var idx = charString.indexOf(this.current());
      while ((breakOnMatch && idx === -1 || !breakOnMatch && idx !== -1) && !this.isFinished()) {
        t += this.current();
        this.forward();
        idx = charString.indexOf(this.current());
      }
      return t;
    }
    return '';
  };
  _proto._extractRegex = function _extractRegex(regex) {
    var matches = this.currentStr().match(regex);
    if (!matches) {
      return null;
    }

    // Move forward whatever was matched
    this.forwardN(matches[0].length);
    return matches;
  };
  _proto.isFinished = function isFinished() {
    return this.index >= this.len;
  };
  _proto.forwardN = function forwardN(n) {
    for (var i = 0; i < n; i++) {
      this.forward();
    }
  };
  _proto.forward = function forward() {
    this.index++;
    if (this.previous() === '\n') {
      this.lineno++;
      this.colno = 0;
    } else {
      this.colno++;
    }
  };
  _proto.backN = function backN(n) {
    for (var i = 0; i < n; i++) {
      this.back();
    }
  };
  _proto.back = function back() {
    this.index--;
    if (this.current() === '\n') {
      this.lineno--;
      var idx = this.src.lastIndexOf('\n', this.index - 1);
      if (idx === -1) {
        this.colno = this.index;
      } else {
        this.colno = this.index - idx;
      }
    } else {
      this.colno--;
    }
  }

  // current returns current character
  ;
  _proto.current = function current() {
    if (!this.isFinished()) {
      return this.str.charAt(this.index);
    }
    return '';
  }

  // currentStr returns what's left of the unparsed string
  ;
  _proto.currentStr = function currentStr() {
    if (!this.isFinished()) {
      return this.str.substr(this.index);
    }
    return '';
  };
  _proto.previous = function previous() {
    return this.str.charAt(this.index - 1);
  };
  return Tokenizer;
}();
module.exports = {
  lex: function lex(src, opts) {
    return new Tokenizer(src, opts);
  },
  TOKEN_STRING: TOKEN_STRING,
  TOKEN_WHITESPACE: TOKEN_WHITESPACE,
  TOKEN_DATA: TOKEN_DATA,
  TOKEN_BLOCK_START: TOKEN_BLOCK_START,
  TOKEN_BLOCK_END: TOKEN_BLOCK_END,
  TOKEN_VARIABLE_START: TOKEN_VARIABLE_START,
  TOKEN_VARIABLE_END: TOKEN_VARIABLE_END,
  TOKEN_COMMENT: TOKEN_COMMENT,
  TOKEN_LEFT_PAREN: TOKEN_LEFT_PAREN,
  TOKEN_RIGHT_PAREN: TOKEN_RIGHT_PAREN,
  TOKEN_LEFT_BRACKET: TOKEN_LEFT_BRACKET,
  TOKEN_RIGHT_BRACKET: TOKEN_RIGHT_BRACKET,
  TOKEN_LEFT_CURLY: TOKEN_LEFT_CURLY,
  TOKEN_RIGHT_CURLY: TOKEN_RIGHT_CURLY,
  TOKEN_OPERATOR: TOKEN_OPERATOR,
  TOKEN_COMMA: TOKEN_COMMA,
  TOKEN_COLON: TOKEN_COLON,
  TOKEN_TILDE: TOKEN_TILDE,
  TOKEN_PIPE: TOKEN_PIPE,
  TOKEN_INT: TOKEN_INT,
  TOKEN_FLOAT: TOKEN_FLOAT,
  TOKEN_BOOLEAN: TOKEN_BOOLEAN,
  TOKEN_NONE: TOKEN_NONE,
  TOKEN_SYMBOL: TOKEN_SYMBOL,
  TOKEN_SPECIAL: TOKEN_SPECIAL,
  TOKEN_REGEX: TOKEN_REGEX
};

/***/ }),

/***/ 4127:
/***/ ((module) => {

"use strict";


var ArrayProto = Array.prototype;
var ObjProto = Object.prototype;
var escapeMap = {
  '&': '&amp;',
  '"': '&quot;',
  '\'': '&#39;',
  '<': '&lt;',
  '>': '&gt;',
  '\\': '&#92;'
};
var escapeRegex = /[&"'<>\\]/g;
var _exports = module.exports = {};
function hasOwnProp(obj, k) {
  return ObjProto.hasOwnProperty.call(obj, k);
}
_exports.hasOwnProp = hasOwnProp;
function lookupEscape(ch) {
  return escapeMap[ch];
}
function _prettifyError(path, withInternals, err) {
  if (!err.Update) {
    // not one of ours, cast it
    err = new _exports.TemplateError(err);
  }
  err.Update(path);

  // Unless they marked the dev flag, show them a trace from here
  if (!withInternals) {
    var old = err;
    err = new Error(old.message);
    err.name = old.name;
  }
  return err;
}
_exports._prettifyError = _prettifyError;
function TemplateError(message, lineno, colno) {
  var err;
  var cause;
  if (message instanceof Error) {
    cause = message;
    message = cause.name + ": " + cause.message;
  }
  if (Object.setPrototypeOf) {
    err = new Error(message);
    Object.setPrototypeOf(err, TemplateError.prototype);
  } else {
    err = this;
    Object.defineProperty(err, 'message', {
      enumerable: false,
      writable: true,
      value: message
    });
  }
  Object.defineProperty(err, 'name', {
    value: 'Template render error'
  });
  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, this.constructor);
  }
  var getStack;
  if (cause) {
    var stackDescriptor = Object.getOwnPropertyDescriptor(cause, 'stack');
    getStack = stackDescriptor && (stackDescriptor.get || function () {
      return stackDescriptor.value;
    });
    if (!getStack) {
      getStack = function getStack() {
        return cause.stack;
      };
    }
  } else {
    var stack = new Error(message).stack;
    getStack = function getStack() {
      return stack;
    };
  }
  Object.defineProperty(err, 'stack', {
    get: function get() {
      return getStack.call(err);
    }
  });
  Object.defineProperty(err, 'cause', {
    value: cause
  });
  err.lineno = lineno;
  err.colno = colno;
  err.firstUpdate = true;
  err.Update = function Update(path) {
    var msg = '(' + (path || 'unknown path') + ')';

    // only show lineno + colno next to path of template
    // where error occurred
    if (this.firstUpdate) {
      if (this.lineno && this.colno) {
        msg += " [Line " + this.lineno + ", Column " + this.colno + "]";
      } else if (this.lineno) {
        msg += " [Line " + this.lineno + "]";
      }
    }
    msg += '\n ';
    if (this.firstUpdate) {
      msg += ' ';
    }
    this.message = msg + (this.message || '');
    this.firstUpdate = false;
    return this;
  };
  return err;
}
if (Object.setPrototypeOf) {
  Object.setPrototypeOf(TemplateError.prototype, Error.prototype);
} else {
  TemplateError.prototype = Object.create(Error.prototype, {
    constructor: {
      value: TemplateError
    }
  });
}
_exports.TemplateError = TemplateError;
function escape(val) {
  return val.replace(escapeRegex, lookupEscape);
}
_exports.escape = escape;
function isFunction(obj) {
  return ObjProto.toString.call(obj) === '[object Function]';
}
_exports.isFunction = isFunction;
function isArray(obj) {
  return ObjProto.toString.call(obj) === '[object Array]';
}
_exports.isArray = isArray;
function isString(obj) {
  return ObjProto.toString.call(obj) === '[object String]';
}
_exports.isString = isString;
function isObject(obj) {
  return ObjProto.toString.call(obj) === '[object Object]';
}
_exports.isObject = isObject;

/**
 * @param {string|number} attr
 * @returns {(string|number)[]}
 * @private
 */
function _prepareAttributeParts(attr) {
  if (!attr) {
    return [];
  }
  if (typeof attr === 'string') {
    return attr.split('.');
  }
  return [attr];
}

/**
 * @param {string}   attribute      Attribute value. Dots allowed.
 * @returns {function(Object): *}
 */
function getAttrGetter(attribute) {
  var parts = _prepareAttributeParts(attribute);
  return function attrGetter(item) {
    var _item = item;
    for (var i = 0; i < parts.length; i++) {
      var part = parts[i];

      // If item is not an object, and we still got parts to handle, it means
      // that something goes wrong. Just roll out to undefined in that case.
      if (hasOwnProp(_item, part)) {
        _item = _item[part];
      } else {
        return undefined;
      }
    }
    return _item;
  };
}
_exports.getAttrGetter = getAttrGetter;
function groupBy(obj, val, throwOnUndefined) {
  var result = {};
  var iterator = isFunction(val) ? val : getAttrGetter(val);
  for (var i = 0; i < obj.length; i++) {
    var value = obj[i];
    var key = iterator(value, i);
    if (key === undefined && throwOnUndefined === true) {
      throw new TypeError("groupby: attribute \"" + val + "\" resolved to undefined");
    }
    (result[key] || (result[key] = [])).push(value);
  }
  return result;
}
_exports.groupBy = groupBy;
function toArray(obj) {
  return Array.prototype.slice.call(obj);
}
_exports.toArray = toArray;
function without(array) {
  var result = [];
  if (!array) {
    return result;
  }
  var length = array.length;
  var contains = toArray(arguments).slice(1);
  var index = -1;
  while (++index < length) {
    if (indexOf(contains, array[index]) === -1) {
      result.push(array[index]);
    }
  }
  return result;
}
_exports.without = without;
function repeat(char_, n) {
  var str = '';
  for (var i = 0; i < n; i++) {
    str += char_;
  }
  return str;
}
_exports.repeat = repeat;
function each(obj, func, context) {
  if (obj == null) {
    return;
  }
  if (ArrayProto.forEach && obj.forEach === ArrayProto.forEach) {
    obj.forEach(func, context);
  } else if (obj.length === +obj.length) {
    for (var i = 0, l = obj.length; i < l; i++) {
      func.call(context, obj[i], i, obj);
    }
  }
}
_exports.each = each;
function map(obj, func) {
  var results = [];
  if (obj == null) {
    return results;
  }
  if (ArrayProto.map && obj.map === ArrayProto.map) {
    return obj.map(func);
  }
  for (var i = 0; i < obj.length; i++) {
    results[results.length] = func(obj[i], i);
  }
  if (obj.length === +obj.length) {
    results.length = obj.length;
  }
  return results;
}
_exports.map = map;
function asyncIter(arr, iter, cb) {
  var i = -1;
  function next() {
    i++;
    if (i < arr.length) {
      iter(arr[i], i, next, cb);
    } else {
      cb();
    }
  }
  next();
}
_exports.asyncIter = asyncIter;
function asyncFor(obj, iter, cb) {
  var keys = keys_(obj || {});
  var len = keys.length;
  var i = -1;
  function next() {
    i++;
    var k = keys[i];
    if (i < len) {
      iter(k, obj[k], i, len, next);
    } else {
      cb();
    }
  }
  next();
}
_exports.asyncFor = asyncFor;
function indexOf(arr, searchElement, fromIndex) {
  return Array.prototype.indexOf.call(arr || [], searchElement, fromIndex);
}
_exports.indexOf = indexOf;
function keys_(obj) {
  /* eslint-disable no-restricted-syntax */
  var arr = [];
  for (var k in obj) {
    if (hasOwnProp(obj, k)) {
      arr.push(k);
    }
  }
  return arr;
}
_exports.keys = keys_;
function _entries(obj) {
  return keys_(obj).map(function (k) {
    return [k, obj[k]];
  });
}
_exports._entries = _entries;
function _values(obj) {
  return keys_(obj).map(function (k) {
    return obj[k];
  });
}
_exports._values = _values;
function extend(obj1, obj2) {
  obj1 = obj1 || {};
  keys_(obj2).forEach(function (k) {
    obj1[k] = obj2[k];
  });
  return obj1;
}
_exports._assign = _exports.extend = extend;
function inOperator(key, val) {
  if (isArray(val) || isString(val)) {
    return val.indexOf(key) !== -1;
  } else if (isObject(val)) {
    return key in val;
  }
  throw new Error('Cannot use "in" operator to search for "' + key + '" in unexpected types.');
}
_exports.inOperator = inOperator;

/***/ }),

/***/ 6981:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var path = __nccwpck_require__(1017);
var _require = __nccwpck_require__(7007),
  EmitterObj = _require.EmitterObj;
module.exports = /*#__PURE__*/function (_EmitterObj) {
  _inheritsLoose(Loader, _EmitterObj);
  function Loader() {
    return _EmitterObj.apply(this, arguments) || this;
  }
  var _proto = Loader.prototype;
  _proto.resolve = function resolve(from, to) {
    return path.resolve(path.dirname(from), to);
  };
  _proto.isRelative = function isRelative(filename) {
    return filename.indexOf('./') === 0 || filename.indexOf('../') === 0;
  };
  return Loader;
}(EmitterObj);

/***/ }),

/***/ 4395:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


// This file will automatically be rewired to web-loader.js when
// building for the browser
module.exports = __nccwpck_require__(9082);

/***/ }),

/***/ 9082:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/* eslint-disable no-console */



function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var fs = __nccwpck_require__(7147);
var path = __nccwpck_require__(1017);
var Loader = __nccwpck_require__(6981);
var _require = __nccwpck_require__(8957),
  PrecompiledLoader = _require.PrecompiledLoader;
var chokidar;
var FileSystemLoader = /*#__PURE__*/function (_Loader) {
  _inheritsLoose(FileSystemLoader, _Loader);
  function FileSystemLoader(searchPaths, opts) {
    var _this;
    _this = _Loader.call(this) || this;
    if (typeof opts === 'boolean') {
      console.log('[nunjucks] Warning: you passed a boolean as the second ' + 'argument to FileSystemLoader, but it now takes an options ' + 'object. See http://mozilla.github.io/nunjucks/api.html#filesystemloader');
    }
    opts = opts || {};
    _this.pathsToNames = {};
    _this.noCache = !!opts.noCache;
    if (searchPaths) {
      searchPaths = Array.isArray(searchPaths) ? searchPaths : [searchPaths];
      // For windows, convert to forward slashes
      _this.searchPaths = searchPaths.map(path.normalize);
    } else {
      _this.searchPaths = ['.'];
    }
    if (opts.watch) {
      // Watch all the templates in the paths and fire an event when
      // they change
      try {
        chokidar = __nccwpck_require__(561); // eslint-disable-line global-require
      } catch (e) {
        throw new Error('watch requires chokidar to be installed');
      }
      var paths = _this.searchPaths.filter(fs.existsSync);
      var watcher = chokidar.watch(paths);
      watcher.on('all', function (event, fullname) {
        fullname = path.resolve(fullname);
        if (event === 'change' && fullname in _this.pathsToNames) {
          _this.emit('update', _this.pathsToNames[fullname], fullname);
        }
      });
      watcher.on('error', function (error) {
        console.log('Watcher error: ' + error);
      });
    }
    return _this;
  }
  var _proto = FileSystemLoader.prototype;
  _proto.getSource = function getSource(name) {
    var fullpath = null;
    var paths = this.searchPaths;
    for (var i = 0; i < paths.length; i++) {
      var basePath = path.resolve(paths[i]);
      var p = path.resolve(paths[i], name);

      // Only allow the current directory and anything
      // underneath it to be searched
      if (p.indexOf(basePath) === 0 && fs.existsSync(p)) {
        fullpath = p;
        break;
      }
    }
    if (!fullpath) {
      return null;
    }
    this.pathsToNames[fullpath] = name;
    var source = {
      src: fs.readFileSync(fullpath, 'utf-8'),
      path: fullpath,
      noCache: this.noCache
    };
    this.emit('load', name, source);
    return source;
  };
  return FileSystemLoader;
}(Loader);
var NodeResolveLoader = /*#__PURE__*/function (_Loader2) {
  _inheritsLoose(NodeResolveLoader, _Loader2);
  function NodeResolveLoader(opts) {
    var _this2;
    _this2 = _Loader2.call(this) || this;
    opts = opts || {};
    _this2.pathsToNames = {};
    _this2.noCache = !!opts.noCache;
    if (opts.watch) {
      try {
        chokidar = __nccwpck_require__(561); // eslint-disable-line global-require
      } catch (e) {
        throw new Error('watch requires chokidar to be installed');
      }
      _this2.watcher = chokidar.watch();
      _this2.watcher.on('change', function (fullname) {
        _this2.emit('update', _this2.pathsToNames[fullname], fullname);
      });
      _this2.watcher.on('error', function (error) {
        console.log('Watcher error: ' + error);
      });
      _this2.on('load', function (name, source) {
        _this2.watcher.add(source.path);
      });
    }
    return _this2;
  }
  var _proto2 = NodeResolveLoader.prototype;
  _proto2.getSource = function getSource(name) {
    // Don't allow file-system traversal
    if (/^\.?\.?(\/|\\)/.test(name)) {
      return null;
    }
    if (/^[A-Z]:/.test(name)) {
      return null;
    }
    var fullpath;
    try {
      fullpath = require.resolve(name);
    } catch (e) {
      return null;
    }
    this.pathsToNames[fullpath] = name;
    var source = {
      src: fs.readFileSync(fullpath, 'utf-8'),
      path: fullpath,
      noCache: this.noCache
    };
    this.emit('load', name, source);
    return source;
  };
  return NodeResolveLoader;
}(Loader);
module.exports = {
  FileSystemLoader: FileSystemLoader,
  PrecompiledLoader: PrecompiledLoader,
  NodeResolveLoader: NodeResolveLoader
};

/***/ }),

/***/ 429:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var _require = __nccwpck_require__(7007),
  Obj = _require.Obj;
function traverseAndCheck(obj, type, results) {
  if (obj instanceof type) {
    results.push(obj);
  }
  if (obj instanceof Node) {
    obj.findAll(type, results);
  }
}
var Node = /*#__PURE__*/function (_Obj) {
  _inheritsLoose(Node, _Obj);
  function Node() {
    return _Obj.apply(this, arguments) || this;
  }
  var _proto = Node.prototype;
  _proto.init = function init(lineno, colno) {
    var _arguments = arguments,
      _this = this;
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }
    this.lineno = lineno;
    this.colno = colno;
    this.fields.forEach(function (field, i) {
      // The first two args are line/col numbers, so offset by 2
      var val = _arguments[i + 2];

      // Fields should never be undefined, but null. It makes
      // testing easier to normalize values.
      if (val === undefined) {
        val = null;
      }
      _this[field] = val;
    });
  };
  _proto.findAll = function findAll(type, results) {
    var _this2 = this;
    results = results || [];
    if (this instanceof NodeList) {
      this.children.forEach(function (child) {
        return traverseAndCheck(child, type, results);
      });
    } else {
      this.fields.forEach(function (field) {
        return traverseAndCheck(_this2[field], type, results);
      });
    }
    return results;
  };
  _proto.iterFields = function iterFields(func) {
    var _this3 = this;
    this.fields.forEach(function (field) {
      func(_this3[field], field);
    });
  };
  return Node;
}(Obj); // Abstract nodes
var Value = /*#__PURE__*/function (_Node) {
  _inheritsLoose(Value, _Node);
  function Value() {
    return _Node.apply(this, arguments) || this;
  }
  _createClass(Value, [{
    key: "typename",
    get: function get() {
      return 'Value';
    }
  }, {
    key: "fields",
    get: function get() {
      return ['value'];
    }
  }]);
  return Value;
}(Node); // Concrete nodes
var NodeList = /*#__PURE__*/function (_Node2) {
  _inheritsLoose(NodeList, _Node2);
  function NodeList() {
    return _Node2.apply(this, arguments) || this;
  }
  var _proto2 = NodeList.prototype;
  _proto2.init = function init(lineno, colno, nodes) {
    _Node2.prototype.init.call(this, lineno, colno, nodes || []);
  };
  _proto2.addChild = function addChild(node) {
    this.children.push(node);
  };
  _createClass(NodeList, [{
    key: "typename",
    get: function get() {
      return 'NodeList';
    }
  }, {
    key: "fields",
    get: function get() {
      return ['children'];
    }
  }]);
  return NodeList;
}(Node);
var Root = NodeList.extend('Root');
var Literal = Value.extend('Literal');
var _Symbol = Value.extend('Symbol');
var Group = NodeList.extend('Group');
var ArrayNode = NodeList.extend('Array');
var Pair = Node.extend('Pair', {
  fields: ['key', 'value']
});
var Dict = NodeList.extend('Dict');
var LookupVal = Node.extend('LookupVal', {
  fields: ['target', 'val']
});
var If = Node.extend('If', {
  fields: ['cond', 'body', 'else_']
});
var IfAsync = If.extend('IfAsync');
var InlineIf = Node.extend('InlineIf', {
  fields: ['cond', 'body', 'else_']
});
var For = Node.extend('For', {
  fields: ['arr', 'name', 'body', 'else_']
});
var AsyncEach = For.extend('AsyncEach');
var AsyncAll = For.extend('AsyncAll');
var Macro = Node.extend('Macro', {
  fields: ['name', 'args', 'body']
});
var Caller = Macro.extend('Caller');
var Import = Node.extend('Import', {
  fields: ['template', 'target', 'withContext']
});
var FromImport = /*#__PURE__*/function (_Node3) {
  _inheritsLoose(FromImport, _Node3);
  function FromImport() {
    return _Node3.apply(this, arguments) || this;
  }
  var _proto3 = FromImport.prototype;
  _proto3.init = function init(lineno, colno, template, names, withContext) {
    _Node3.prototype.init.call(this, lineno, colno, template, names || new NodeList(), withContext);
  };
  _createClass(FromImport, [{
    key: "typename",
    get: function get() {
      return 'FromImport';
    }
  }, {
    key: "fields",
    get: function get() {
      return ['template', 'names', 'withContext'];
    }
  }]);
  return FromImport;
}(Node);
var FunCall = Node.extend('FunCall', {
  fields: ['name', 'args']
});
var Filter = FunCall.extend('Filter');
var FilterAsync = Filter.extend('FilterAsync', {
  fields: ['name', 'args', 'symbol']
});
var KeywordArgs = Dict.extend('KeywordArgs');
var Block = Node.extend('Block', {
  fields: ['name', 'body']
});
var Super = Node.extend('Super', {
  fields: ['blockName', 'symbol']
});
var TemplateRef = Node.extend('TemplateRef', {
  fields: ['template']
});
var Extends = TemplateRef.extend('Extends');
var Include = Node.extend('Include', {
  fields: ['template', 'ignoreMissing']
});
var Set = Node.extend('Set', {
  fields: ['targets', 'value']
});
var Switch = Node.extend('Switch', {
  fields: ['expr', 'cases', 'default']
});
var Case = Node.extend('Case', {
  fields: ['cond', 'body']
});
var Output = NodeList.extend('Output');
var Capture = Node.extend('Capture', {
  fields: ['body']
});
var TemplateData = Literal.extend('TemplateData');
var UnaryOp = Node.extend('UnaryOp', {
  fields: ['target']
});
var BinOp = Node.extend('BinOp', {
  fields: ['left', 'right']
});
var In = BinOp.extend('In');
var Is = BinOp.extend('Is');
var Or = BinOp.extend('Or');
var And = BinOp.extend('And');
var Not = UnaryOp.extend('Not');
var Add = BinOp.extend('Add');
var Concat = BinOp.extend('Concat');
var Sub = BinOp.extend('Sub');
var Mul = BinOp.extend('Mul');
var Div = BinOp.extend('Div');
var FloorDiv = BinOp.extend('FloorDiv');
var Mod = BinOp.extend('Mod');
var Pow = BinOp.extend('Pow');
var Neg = UnaryOp.extend('Neg');
var Pos = UnaryOp.extend('Pos');
var Compare = Node.extend('Compare', {
  fields: ['expr', 'ops']
});
var CompareOperand = Node.extend('CompareOperand', {
  fields: ['expr', 'type']
});
var CallExtension = Node.extend('CallExtension', {
  init: function init(ext, prop, args, contentArgs) {
    this.parent();
    this.extName = ext.__name || ext;
    this.prop = prop;
    this.args = args || new NodeList();
    this.contentArgs = contentArgs || [];
    this.autoescape = ext.autoescape;
  },
  fields: ['extName', 'prop', 'args', 'contentArgs']
});
var CallExtensionAsync = CallExtension.extend('CallExtensionAsync');

// This is hacky, but this is just a debugging function anyway
function print(str, indent, inline) {
  var lines = str.split('\n');
  lines.forEach(function (line, i) {
    if (line && (inline && i > 0 || !inline)) {
      process.stdout.write(' '.repeat(indent));
    }
    var nl = i === lines.length - 1 ? '' : '\n';
    process.stdout.write("" + line + nl);
  });
}

// Print the AST in a nicely formatted tree format for debuggin
function printNodes(node, indent) {
  indent = indent || 0;
  print(node.typename + ': ', indent);
  if (node instanceof NodeList) {
    print('\n');
    node.children.forEach(function (n) {
      printNodes(n, indent + 2);
    });
  } else if (node instanceof CallExtension) {
    print(node.extName + "." + node.prop + "\n");
    if (node.args) {
      printNodes(node.args, indent + 2);
    }
    if (node.contentArgs) {
      node.contentArgs.forEach(function (n) {
        printNodes(n, indent + 2);
      });
    }
  } else {
    var nodes = [];
    var props = null;
    node.iterFields(function (val, fieldName) {
      if (val instanceof Node) {
        nodes.push([fieldName, val]);
      } else {
        props = props || {};
        props[fieldName] = val;
      }
    });
    if (props) {
      print(JSON.stringify(props, null, 2) + '\n', null, true);
    } else {
      print('\n');
    }
    nodes.forEach(function (_ref) {
      var fieldName = _ref[0],
        n = _ref[1];
      print("[" + fieldName + "] =>", indent + 2);
      printNodes(n, indent + 4);
    });
  }
}
module.exports = {
  Node: Node,
  Root: Root,
  NodeList: NodeList,
  Value: Value,
  Literal: Literal,
  Symbol: _Symbol,
  Group: Group,
  Array: ArrayNode,
  Pair: Pair,
  Dict: Dict,
  Output: Output,
  Capture: Capture,
  TemplateData: TemplateData,
  If: If,
  IfAsync: IfAsync,
  InlineIf: InlineIf,
  For: For,
  AsyncEach: AsyncEach,
  AsyncAll: AsyncAll,
  Macro: Macro,
  Caller: Caller,
  Import: Import,
  FromImport: FromImport,
  FunCall: FunCall,
  Filter: Filter,
  FilterAsync: FilterAsync,
  KeywordArgs: KeywordArgs,
  Block: Block,
  Super: Super,
  Extends: Extends,
  Include: Include,
  Set: Set,
  Switch: Switch,
  Case: Case,
  LookupVal: LookupVal,
  BinOp: BinOp,
  In: In,
  Is: Is,
  Or: Or,
  And: And,
  Not: Not,
  Add: Add,
  Concat: Concat,
  Sub: Sub,
  Mul: Mul,
  Div: Div,
  FloorDiv: FloorDiv,
  Mod: Mod,
  Pow: Pow,
  Neg: Neg,
  Pos: Pos,
  Compare: Compare,
  CompareOperand: CompareOperand,
  CallExtension: CallExtension,
  CallExtensionAsync: CallExtensionAsync,
  printNodes: printNodes
};

/***/ }),

/***/ 7007:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


// A simple class system, more documentation to come
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var EventEmitter = __nccwpck_require__(2361);
var lib = __nccwpck_require__(4127);
function parentWrap(parent, prop) {
  if (typeof parent !== 'function' || typeof prop !== 'function') {
    return prop;
  }
  return function wrap() {
    // Save the current parent method
    var tmp = this.parent;

    // Set parent to the previous method, call, and restore
    this.parent = parent;
    var res = prop.apply(this, arguments);
    this.parent = tmp;
    return res;
  };
}
function extendClass(cls, name, props) {
  props = props || {};
  lib.keys(props).forEach(function (k) {
    props[k] = parentWrap(cls.prototype[k], props[k]);
  });
  var subclass = /*#__PURE__*/function (_cls) {
    _inheritsLoose(subclass, _cls);
    function subclass() {
      return _cls.apply(this, arguments) || this;
    }
    _createClass(subclass, [{
      key: "typename",
      get: function get() {
        return name;
      }
    }]);
    return subclass;
  }(cls);
  lib._assign(subclass.prototype, props);
  return subclass;
}
var Obj = /*#__PURE__*/function () {
  function Obj() {
    // Unfortunately necessary for backwards compatibility
    this.init.apply(this, arguments);
  }
  var _proto = Obj.prototype;
  _proto.init = function init() {};
  Obj.extend = function extend(name, props) {
    if (typeof name === 'object') {
      props = name;
      name = 'anonymous';
    }
    return extendClass(this, name, props);
  };
  _createClass(Obj, [{
    key: "typename",
    get: function get() {
      return this.constructor.name;
    }
  }]);
  return Obj;
}();
var EmitterObj = /*#__PURE__*/function (_EventEmitter) {
  _inheritsLoose(EmitterObj, _EventEmitter);
  function EmitterObj() {
    var _this2;
    var _this;
    _this = _EventEmitter.call(this) || this;
    // Unfortunately necessary for backwards compatibility
    (_this2 = _this).init.apply(_this2, arguments);
    return _this;
  }
  var _proto2 = EmitterObj.prototype;
  _proto2.init = function init() {};
  EmitterObj.extend = function extend(name, props) {
    if (typeof name === 'object') {
      props = name;
      name = 'anonymous';
    }
    return extendClass(this, name, props);
  };
  _createClass(EmitterObj, [{
    key: "typename",
    get: function get() {
      return this.constructor.name;
    }
  }]);
  return EmitterObj;
}(EventEmitter);
module.exports = {
  Obj: Obj,
  EmitterObj: EmitterObj
};

/***/ }),

/***/ 6614:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var lexer = __nccwpck_require__(3158);
var nodes = __nccwpck_require__(429);
var Obj = (__nccwpck_require__(7007).Obj);
var lib = __nccwpck_require__(4127);
var Parser = /*#__PURE__*/function (_Obj) {
  _inheritsLoose(Parser, _Obj);
  function Parser() {
    return _Obj.apply(this, arguments) || this;
  }
  var _proto = Parser.prototype;
  _proto.init = function init(tokens) {
    this.tokens = tokens;
    this.peeked = null;
    this.breakOnBlocks = null;
    this.dropLeadingWhitespace = false;
    this.extensions = [];
  };
  _proto.nextToken = function nextToken(withWhitespace) {
    var tok;
    if (this.peeked) {
      if (!withWhitespace && this.peeked.type === lexer.TOKEN_WHITESPACE) {
        this.peeked = null;
      } else {
        tok = this.peeked;
        this.peeked = null;
        return tok;
      }
    }
    tok = this.tokens.nextToken();
    if (!withWhitespace) {
      while (tok && tok.type === lexer.TOKEN_WHITESPACE) {
        tok = this.tokens.nextToken();
      }
    }
    return tok;
  };
  _proto.peekToken = function peekToken() {
    this.peeked = this.peeked || this.nextToken();
    return this.peeked;
  };
  _proto.pushToken = function pushToken(tok) {
    if (this.peeked) {
      throw new Error('pushToken: can only push one token on between reads');
    }
    this.peeked = tok;
  };
  _proto.error = function error(msg, lineno, colno) {
    if (lineno === undefined || colno === undefined) {
      var tok = this.peekToken() || {};
      lineno = tok.lineno;
      colno = tok.colno;
    }
    if (lineno !== undefined) {
      lineno += 1;
    }
    if (colno !== undefined) {
      colno += 1;
    }
    return new lib.TemplateError(msg, lineno, colno);
  };
  _proto.fail = function fail(msg, lineno, colno) {
    throw this.error(msg, lineno, colno);
  };
  _proto.skip = function skip(type) {
    var tok = this.nextToken();
    if (!tok || tok.type !== type) {
      this.pushToken(tok);
      return false;
    }
    return true;
  };
  _proto.expect = function expect(type) {
    var tok = this.nextToken();
    if (tok.type !== type) {
      this.fail('expected ' + type + ', got ' + tok.type, tok.lineno, tok.colno);
    }
    return tok;
  };
  _proto.skipValue = function skipValue(type, val) {
    var tok = this.nextToken();
    if (!tok || tok.type !== type || tok.value !== val) {
      this.pushToken(tok);
      return false;
    }
    return true;
  };
  _proto.skipSymbol = function skipSymbol(val) {
    return this.skipValue(lexer.TOKEN_SYMBOL, val);
  };
  _proto.advanceAfterBlockEnd = function advanceAfterBlockEnd(name) {
    var tok;
    if (!name) {
      tok = this.peekToken();
      if (!tok) {
        this.fail('unexpected end of file');
      }
      if (tok.type !== lexer.TOKEN_SYMBOL) {
        this.fail('advanceAfterBlockEnd: expected symbol token or ' + 'explicit name to be passed');
      }
      name = this.nextToken().value;
    }
    tok = this.nextToken();
    if (tok && tok.type === lexer.TOKEN_BLOCK_END) {
      if (tok.value.charAt(0) === '-') {
        this.dropLeadingWhitespace = true;
      }
    } else {
      this.fail('expected block end in ' + name + ' statement');
    }
    return tok;
  };
  _proto.advanceAfterVariableEnd = function advanceAfterVariableEnd() {
    var tok = this.nextToken();
    if (tok && tok.type === lexer.TOKEN_VARIABLE_END) {
      this.dropLeadingWhitespace = tok.value.charAt(tok.value.length - this.tokens.tags.VARIABLE_END.length - 1) === '-';
    } else {
      this.pushToken(tok);
      this.fail('expected variable end');
    }
  };
  _proto.parseFor = function parseFor() {
    var forTok = this.peekToken();
    var node;
    var endBlock;
    if (this.skipSymbol('for')) {
      node = new nodes.For(forTok.lineno, forTok.colno);
      endBlock = 'endfor';
    } else if (this.skipSymbol('asyncEach')) {
      node = new nodes.AsyncEach(forTok.lineno, forTok.colno);
      endBlock = 'endeach';
    } else if (this.skipSymbol('asyncAll')) {
      node = new nodes.AsyncAll(forTok.lineno, forTok.colno);
      endBlock = 'endall';
    } else {
      this.fail('parseFor: expected for{Async}', forTok.lineno, forTok.colno);
    }
    node.name = this.parsePrimary();
    if (!(node.name instanceof nodes.Symbol)) {
      this.fail('parseFor: variable name expected for loop');
    }
    var type = this.peekToken().type;
    if (type === lexer.TOKEN_COMMA) {
      // key/value iteration
      var key = node.name;
      node.name = new nodes.Array(key.lineno, key.colno);
      node.name.addChild(key);
      while (this.skip(lexer.TOKEN_COMMA)) {
        var prim = this.parsePrimary();
        node.name.addChild(prim);
      }
    }
    if (!this.skipSymbol('in')) {
      this.fail('parseFor: expected "in" keyword for loop', forTok.lineno, forTok.colno);
    }
    node.arr = this.parseExpression();
    this.advanceAfterBlockEnd(forTok.value);
    node.body = this.parseUntilBlocks(endBlock, 'else');
    if (this.skipSymbol('else')) {
      this.advanceAfterBlockEnd('else');
      node.else_ = this.parseUntilBlocks(endBlock);
    }
    this.advanceAfterBlockEnd();
    return node;
  };
  _proto.parseMacro = function parseMacro() {
    var macroTok = this.peekToken();
    if (!this.skipSymbol('macro')) {
      this.fail('expected macro');
    }
    var name = this.parsePrimary(true);
    var args = this.parseSignature();
    var node = new nodes.Macro(macroTok.lineno, macroTok.colno, name, args);
    this.advanceAfterBlockEnd(macroTok.value);
    node.body = this.parseUntilBlocks('endmacro');
    this.advanceAfterBlockEnd();
    return node;
  };
  _proto.parseCall = function parseCall() {
    // a call block is parsed as a normal FunCall, but with an added
    // 'caller' kwarg which is a Caller node.
    var callTok = this.peekToken();
    if (!this.skipSymbol('call')) {
      this.fail('expected call');
    }
    var callerArgs = this.parseSignature(true) || new nodes.NodeList();
    var macroCall = this.parsePrimary();
    this.advanceAfterBlockEnd(callTok.value);
    var body = this.parseUntilBlocks('endcall');
    this.advanceAfterBlockEnd();
    var callerName = new nodes.Symbol(callTok.lineno, callTok.colno, 'caller');
    var callerNode = new nodes.Caller(callTok.lineno, callTok.colno, callerName, callerArgs, body);

    // add the additional caller kwarg, adding kwargs if necessary
    var args = macroCall.args.children;
    if (!(args[args.length - 1] instanceof nodes.KeywordArgs)) {
      args.push(new nodes.KeywordArgs());
    }
    var kwargs = args[args.length - 1];
    kwargs.addChild(new nodes.Pair(callTok.lineno, callTok.colno, callerName, callerNode));
    return new nodes.Output(callTok.lineno, callTok.colno, [macroCall]);
  };
  _proto.parseWithContext = function parseWithContext() {
    var tok = this.peekToken();
    var withContext = null;
    if (this.skipSymbol('with')) {
      withContext = true;
    } else if (this.skipSymbol('without')) {
      withContext = false;
    }
    if (withContext !== null) {
      if (!this.skipSymbol('context')) {
        this.fail('parseFrom: expected context after with/without', tok.lineno, tok.colno);
      }
    }
    return withContext;
  };
  _proto.parseImport = function parseImport() {
    var importTok = this.peekToken();
    if (!this.skipSymbol('import')) {
      this.fail('parseImport: expected import', importTok.lineno, importTok.colno);
    }
    var template = this.parseExpression();
    if (!this.skipSymbol('as')) {
      this.fail('parseImport: expected "as" keyword', importTok.lineno, importTok.colno);
    }
    var target = this.parseExpression();
    var withContext = this.parseWithContext();
    var node = new nodes.Import(importTok.lineno, importTok.colno, template, target, withContext);
    this.advanceAfterBlockEnd(importTok.value);
    return node;
  };
  _proto.parseFrom = function parseFrom() {
    var fromTok = this.peekToken();
    if (!this.skipSymbol('from')) {
      this.fail('parseFrom: expected from');
    }
    var template = this.parseExpression();
    if (!this.skipSymbol('import')) {
      this.fail('parseFrom: expected import', fromTok.lineno, fromTok.colno);
    }
    var names = new nodes.NodeList();
    var withContext;
    while (1) {
      // eslint-disable-line no-constant-condition
      var nextTok = this.peekToken();
      if (nextTok.type === lexer.TOKEN_BLOCK_END) {
        if (!names.children.length) {
          this.fail('parseFrom: Expected at least one import name', fromTok.lineno, fromTok.colno);
        }

        // Since we are manually advancing past the block end,
        // need to keep track of whitespace control (normally
        // this is done in `advanceAfterBlockEnd`
        if (nextTok.value.charAt(0) === '-') {
          this.dropLeadingWhitespace = true;
        }
        this.nextToken();
        break;
      }
      if (names.children.length > 0 && !this.skip(lexer.TOKEN_COMMA)) {
        this.fail('parseFrom: expected comma', fromTok.lineno, fromTok.colno);
      }
      var name = this.parsePrimary();
      if (name.value.charAt(0) === '_') {
        this.fail('parseFrom: names starting with an underscore cannot be imported', name.lineno, name.colno);
      }
      if (this.skipSymbol('as')) {
        var alias = this.parsePrimary();
        names.addChild(new nodes.Pair(name.lineno, name.colno, name, alias));
      } else {
        names.addChild(name);
      }
      withContext = this.parseWithContext();
    }
    return new nodes.FromImport(fromTok.lineno, fromTok.colno, template, names, withContext);
  };
  _proto.parseBlock = function parseBlock() {
    var tag = this.peekToken();
    if (!this.skipSymbol('block')) {
      this.fail('parseBlock: expected block', tag.lineno, tag.colno);
    }
    var node = new nodes.Block(tag.lineno, tag.colno);
    node.name = this.parsePrimary();
    if (!(node.name instanceof nodes.Symbol)) {
      this.fail('parseBlock: variable name expected', tag.lineno, tag.colno);
    }
    this.advanceAfterBlockEnd(tag.value);
    node.body = this.parseUntilBlocks('endblock');
    this.skipSymbol('endblock');
    this.skipSymbol(node.name.value);
    var tok = this.peekToken();
    if (!tok) {
      this.fail('parseBlock: expected endblock, got end of file');
    }
    this.advanceAfterBlockEnd(tok.value);
    return node;
  };
  _proto.parseExtends = function parseExtends() {
    var tagName = 'extends';
    var tag = this.peekToken();
    if (!this.skipSymbol(tagName)) {
      this.fail('parseTemplateRef: expected ' + tagName);
    }
    var node = new nodes.Extends(tag.lineno, tag.colno);
    node.template = this.parseExpression();
    this.advanceAfterBlockEnd(tag.value);
    return node;
  };
  _proto.parseInclude = function parseInclude() {
    var tagName = 'include';
    var tag = this.peekToken();
    if (!this.skipSymbol(tagName)) {
      this.fail('parseInclude: expected ' + tagName);
    }
    var node = new nodes.Include(tag.lineno, tag.colno);
    node.template = this.parseExpression();
    if (this.skipSymbol('ignore') && this.skipSymbol('missing')) {
      node.ignoreMissing = true;
    }
    this.advanceAfterBlockEnd(tag.value);
    return node;
  };
  _proto.parseIf = function parseIf() {
    var tag = this.peekToken();
    var node;
    if (this.skipSymbol('if') || this.skipSymbol('elif') || this.skipSymbol('elseif')) {
      node = new nodes.If(tag.lineno, tag.colno);
    } else if (this.skipSymbol('ifAsync')) {
      node = new nodes.IfAsync(tag.lineno, tag.colno);
    } else {
      this.fail('parseIf: expected if, elif, or elseif', tag.lineno, tag.colno);
    }
    node.cond = this.parseExpression();
    this.advanceAfterBlockEnd(tag.value);
    node.body = this.parseUntilBlocks('elif', 'elseif', 'else', 'endif');
    var tok = this.peekToken();
    switch (tok && tok.value) {
      case 'elseif':
      case 'elif':
        node.else_ = this.parseIf();
        break;
      case 'else':
        this.advanceAfterBlockEnd();
        node.else_ = this.parseUntilBlocks('endif');
        this.advanceAfterBlockEnd();
        break;
      case 'endif':
        node.else_ = null;
        this.advanceAfterBlockEnd();
        break;
      default:
        this.fail('parseIf: expected elif, else, or endif, got end of file');
    }
    return node;
  };
  _proto.parseSet = function parseSet() {
    var tag = this.peekToken();
    if (!this.skipSymbol('set')) {
      this.fail('parseSet: expected set', tag.lineno, tag.colno);
    }
    var node = new nodes.Set(tag.lineno, tag.colno, []);
    var target;
    while (target = this.parsePrimary()) {
      node.targets.push(target);
      if (!this.skip(lexer.TOKEN_COMMA)) {
        break;
      }
    }
    if (!this.skipValue(lexer.TOKEN_OPERATOR, '=')) {
      if (!this.skip(lexer.TOKEN_BLOCK_END)) {
        this.fail('parseSet: expected = or block end in set tag', tag.lineno, tag.colno);
      } else {
        node.body = new nodes.Capture(tag.lineno, tag.colno, this.parseUntilBlocks('endset'));
        node.value = null;
        this.advanceAfterBlockEnd();
      }
    } else {
      node.value = this.parseExpression();
      this.advanceAfterBlockEnd(tag.value);
    }
    return node;
  };
  _proto.parseSwitch = function parseSwitch() {
    /*
     * Store the tag names in variables in case someone ever wants to
     * customize this.
     */
    var switchStart = 'switch';
    var switchEnd = 'endswitch';
    var caseStart = 'case';
    var caseDefault = 'default';

    // Get the switch tag.
    var tag = this.peekToken();

    // fail early if we get some unexpected tag.
    if (!this.skipSymbol(switchStart) && !this.skipSymbol(caseStart) && !this.skipSymbol(caseDefault)) {
      this.fail('parseSwitch: expected "switch," "case" or "default"', tag.lineno, tag.colno);
    }

    // parse the switch expression
    var expr = this.parseExpression();

    // advance until a start of a case, a default case or an endswitch.
    this.advanceAfterBlockEnd(switchStart);
    this.parseUntilBlocks(caseStart, caseDefault, switchEnd);

    // this is the first case. it could also be an endswitch, we'll check.
    var tok = this.peekToken();

    // create new variables for our cases and default case.
    var cases = [];
    var defaultCase;

    // while we're dealing with new cases nodes...
    do {
      // skip the start symbol and get the case expression
      this.skipSymbol(caseStart);
      var cond = this.parseExpression();
      this.advanceAfterBlockEnd(switchStart);
      // get the body of the case node and add it to the array of cases.
      var body = this.parseUntilBlocks(caseStart, caseDefault, switchEnd);
      cases.push(new nodes.Case(tok.line, tok.col, cond, body));
      // get our next case
      tok = this.peekToken();
    } while (tok && tok.value === caseStart);

    // we either have a default case or a switch end.
    switch (tok.value) {
      case caseDefault:
        this.advanceAfterBlockEnd();
        defaultCase = this.parseUntilBlocks(switchEnd);
        this.advanceAfterBlockEnd();
        break;
      case switchEnd:
        this.advanceAfterBlockEnd();
        break;
      default:
        // otherwise bail because EOF
        this.fail('parseSwitch: expected "case," "default" or "endswitch," got EOF.');
    }

    // and return the switch node.
    return new nodes.Switch(tag.lineno, tag.colno, expr, cases, defaultCase);
  };
  _proto.parseStatement = function parseStatement() {
    var tok = this.peekToken();
    var node;
    if (tok.type !== lexer.TOKEN_SYMBOL) {
      this.fail('tag name expected', tok.lineno, tok.colno);
    }
    if (this.breakOnBlocks && lib.indexOf(this.breakOnBlocks, tok.value) !== -1) {
      return null;
    }
    switch (tok.value) {
      case 'raw':
        return this.parseRaw();
      case 'verbatim':
        return this.parseRaw('verbatim');
      case 'if':
      case 'ifAsync':
        return this.parseIf();
      case 'for':
      case 'asyncEach':
      case 'asyncAll':
        return this.parseFor();
      case 'block':
        return this.parseBlock();
      case 'extends':
        return this.parseExtends();
      case 'include':
        return this.parseInclude();
      case 'set':
        return this.parseSet();
      case 'macro':
        return this.parseMacro();
      case 'call':
        return this.parseCall();
      case 'import':
        return this.parseImport();
      case 'from':
        return this.parseFrom();
      case 'filter':
        return this.parseFilterStatement();
      case 'switch':
        return this.parseSwitch();
      default:
        if (this.extensions.length) {
          for (var i = 0; i < this.extensions.length; i++) {
            var ext = this.extensions[i];
            if (lib.indexOf(ext.tags || [], tok.value) !== -1) {
              return ext.parse(this, nodes, lexer);
            }
          }
        }
        this.fail('unknown block tag: ' + tok.value, tok.lineno, tok.colno);
    }
    return node;
  };
  _proto.parseRaw = function parseRaw(tagName) {
    tagName = tagName || 'raw';
    var endTagName = 'end' + tagName;
    // Look for upcoming raw blocks (ignore all other kinds of blocks)
    var rawBlockRegex = new RegExp('([\\s\\S]*?){%\\s*(' + tagName + '|' + endTagName + ')\\s*(?=%})%}');
    var rawLevel = 1;
    var str = '';
    var matches = null;

    // Skip opening raw token
    // Keep this token to track line and column numbers
    var begun = this.advanceAfterBlockEnd();

    // Exit when there's nothing to match
    // or when we've found the matching "endraw" block
    while ((matches = this.tokens._extractRegex(rawBlockRegex)) && rawLevel > 0) {
      var all = matches[0];
      var pre = matches[1];
      var blockName = matches[2];

      // Adjust rawlevel
      if (blockName === tagName) {
        rawLevel += 1;
      } else if (blockName === endTagName) {
        rawLevel -= 1;
      }

      // Add to str
      if (rawLevel === 0) {
        // We want to exclude the last "endraw"
        str += pre;
        // Move tokenizer to beginning of endraw block
        this.tokens.backN(all.length - pre.length);
      } else {
        str += all;
      }
    }
    return new nodes.Output(begun.lineno, begun.colno, [new nodes.TemplateData(begun.lineno, begun.colno, str)]);
  };
  _proto.parsePostfix = function parsePostfix(node) {
    var lookup;
    var tok = this.peekToken();
    while (tok) {
      if (tok.type === lexer.TOKEN_LEFT_PAREN) {
        // Function call
        node = new nodes.FunCall(tok.lineno, tok.colno, node, this.parseSignature());
      } else if (tok.type === lexer.TOKEN_LEFT_BRACKET) {
        // Reference
        lookup = this.parseAggregate();
        if (lookup.children.length > 1) {
          this.fail('invalid index');
        }
        node = new nodes.LookupVal(tok.lineno, tok.colno, node, lookup.children[0]);
      } else if (tok.type === lexer.TOKEN_OPERATOR && tok.value === '.') {
        // Reference
        this.nextToken();
        var val = this.nextToken();
        if (val.type !== lexer.TOKEN_SYMBOL) {
          this.fail('expected name as lookup value, got ' + val.value, val.lineno, val.colno);
        }

        // Make a literal string because it's not a variable
        // reference
        lookup = new nodes.Literal(val.lineno, val.colno, val.value);
        node = new nodes.LookupVal(tok.lineno, tok.colno, node, lookup);
      } else {
        break;
      }
      tok = this.peekToken();
    }
    return node;
  };
  _proto.parseExpression = function parseExpression() {
    var node = this.parseInlineIf();
    return node;
  };
  _proto.parseInlineIf = function parseInlineIf() {
    var node = this.parseOr();
    if (this.skipSymbol('if')) {
      var condNode = this.parseOr();
      var bodyNode = node;
      node = new nodes.InlineIf(node.lineno, node.colno);
      node.body = bodyNode;
      node.cond = condNode;
      if (this.skipSymbol('else')) {
        node.else_ = this.parseOr();
      } else {
        node.else_ = null;
      }
    }
    return node;
  };
  _proto.parseOr = function parseOr() {
    var node = this.parseAnd();
    while (this.skipSymbol('or')) {
      var node2 = this.parseAnd();
      node = new nodes.Or(node.lineno, node.colno, node, node2);
    }
    return node;
  };
  _proto.parseAnd = function parseAnd() {
    var node = this.parseNot();
    while (this.skipSymbol('and')) {
      var node2 = this.parseNot();
      node = new nodes.And(node.lineno, node.colno, node, node2);
    }
    return node;
  };
  _proto.parseNot = function parseNot() {
    var tok = this.peekToken();
    if (this.skipSymbol('not')) {
      return new nodes.Not(tok.lineno, tok.colno, this.parseNot());
    }
    return this.parseIn();
  };
  _proto.parseIn = function parseIn() {
    var node = this.parseIs();
    while (1) {
      // eslint-disable-line no-constant-condition
      // check if the next token is 'not'
      var tok = this.nextToken();
      if (!tok) {
        break;
      }
      var invert = tok.type === lexer.TOKEN_SYMBOL && tok.value === 'not';
      // if it wasn't 'not', put it back
      if (!invert) {
        this.pushToken(tok);
      }
      if (this.skipSymbol('in')) {
        var node2 = this.parseIs();
        node = new nodes.In(node.lineno, node.colno, node, node2);
        if (invert) {
          node = new nodes.Not(node.lineno, node.colno, node);
        }
      } else {
        // if we'd found a 'not' but this wasn't an 'in', put back the 'not'
        if (invert) {
          this.pushToken(tok);
        }
        break;
      }
    }
    return node;
  }

  // I put this right after "in" in the operator precedence stack. That can
  // obviously be changed to be closer to Jinja.
  ;
  _proto.parseIs = function parseIs() {
    var node = this.parseCompare();
    // look for an is
    if (this.skipSymbol('is')) {
      // look for a not
      var not = this.skipSymbol('not');
      // get the next node
      var node2 = this.parseCompare();
      // create an Is node using the next node and the info from our Is node.
      node = new nodes.Is(node.lineno, node.colno, node, node2);
      // if we have a Not, create a Not node from our Is node.
      if (not) {
        node = new nodes.Not(node.lineno, node.colno, node);
      }
    }
    // return the node.
    return node;
  };
  _proto.parseCompare = function parseCompare() {
    var compareOps = ['==', '===', '!=', '!==', '<', '>', '<=', '>='];
    var expr = this.parseConcat();
    var ops = [];
    while (1) {
      // eslint-disable-line no-constant-condition
      var tok = this.nextToken();
      if (!tok) {
        break;
      } else if (compareOps.indexOf(tok.value) !== -1) {
        ops.push(new nodes.CompareOperand(tok.lineno, tok.colno, this.parseConcat(), tok.value));
      } else {
        this.pushToken(tok);
        break;
      }
    }
    if (ops.length) {
      return new nodes.Compare(ops[0].lineno, ops[0].colno, expr, ops);
    } else {
      return expr;
    }
  }

  // finds the '~' for string concatenation
  ;
  _proto.parseConcat = function parseConcat() {
    var node = this.parseAdd();
    while (this.skipValue(lexer.TOKEN_TILDE, '~')) {
      var node2 = this.parseAdd();
      node = new nodes.Concat(node.lineno, node.colno, node, node2);
    }
    return node;
  };
  _proto.parseAdd = function parseAdd() {
    var node = this.parseSub();
    while (this.skipValue(lexer.TOKEN_OPERATOR, '+')) {
      var node2 = this.parseSub();
      node = new nodes.Add(node.lineno, node.colno, node, node2);
    }
    return node;
  };
  _proto.parseSub = function parseSub() {
    var node = this.parseMul();
    while (this.skipValue(lexer.TOKEN_OPERATOR, '-')) {
      var node2 = this.parseMul();
      node = new nodes.Sub(node.lineno, node.colno, node, node2);
    }
    return node;
  };
  _proto.parseMul = function parseMul() {
    var node = this.parseDiv();
    while (this.skipValue(lexer.TOKEN_OPERATOR, '*')) {
      var node2 = this.parseDiv();
      node = new nodes.Mul(node.lineno, node.colno, node, node2);
    }
    return node;
  };
  _proto.parseDiv = function parseDiv() {
    var node = this.parseFloorDiv();
    while (this.skipValue(lexer.TOKEN_OPERATOR, '/')) {
      var node2 = this.parseFloorDiv();
      node = new nodes.Div(node.lineno, node.colno, node, node2);
    }
    return node;
  };
  _proto.parseFloorDiv = function parseFloorDiv() {
    var node = this.parseMod();
    while (this.skipValue(lexer.TOKEN_OPERATOR, '//')) {
      var node2 = this.parseMod();
      node = new nodes.FloorDiv(node.lineno, node.colno, node, node2);
    }
    return node;
  };
  _proto.parseMod = function parseMod() {
    var node = this.parsePow();
    while (this.skipValue(lexer.TOKEN_OPERATOR, '%')) {
      var node2 = this.parsePow();
      node = new nodes.Mod(node.lineno, node.colno, node, node2);
    }
    return node;
  };
  _proto.parsePow = function parsePow() {
    var node = this.parseUnary();
    while (this.skipValue(lexer.TOKEN_OPERATOR, '**')) {
      var node2 = this.parseUnary();
      node = new nodes.Pow(node.lineno, node.colno, node, node2);
    }
    return node;
  };
  _proto.parseUnary = function parseUnary(noFilters) {
    var tok = this.peekToken();
    var node;
    if (this.skipValue(lexer.TOKEN_OPERATOR, '-')) {
      node = new nodes.Neg(tok.lineno, tok.colno, this.parseUnary(true));
    } else if (this.skipValue(lexer.TOKEN_OPERATOR, '+')) {
      node = new nodes.Pos(tok.lineno, tok.colno, this.parseUnary(true));
    } else {
      node = this.parsePrimary();
    }
    if (!noFilters) {
      node = this.parseFilter(node);
    }
    return node;
  };
  _proto.parsePrimary = function parsePrimary(noPostfix) {
    var tok = this.nextToken();
    var val;
    var node = null;
    if (!tok) {
      this.fail('expected expression, got end of file');
    } else if (tok.type === lexer.TOKEN_STRING) {
      val = tok.value;
    } else if (tok.type === lexer.TOKEN_INT) {
      val = parseInt(tok.value, 10);
    } else if (tok.type === lexer.TOKEN_FLOAT) {
      val = parseFloat(tok.value);
    } else if (tok.type === lexer.TOKEN_BOOLEAN) {
      if (tok.value === 'true') {
        val = true;
      } else if (tok.value === 'false') {
        val = false;
      } else {
        this.fail('invalid boolean: ' + tok.value, tok.lineno, tok.colno);
      }
    } else if (tok.type === lexer.TOKEN_NONE) {
      val = null;
    } else if (tok.type === lexer.TOKEN_REGEX) {
      val = new RegExp(tok.value.body, tok.value.flags);
    }
    if (val !== undefined) {
      node = new nodes.Literal(tok.lineno, tok.colno, val);
    } else if (tok.type === lexer.TOKEN_SYMBOL) {
      node = new nodes.Symbol(tok.lineno, tok.colno, tok.value);
    } else {
      // See if it's an aggregate type, we need to push the
      // current delimiter token back on
      this.pushToken(tok);
      node = this.parseAggregate();
    }
    if (!noPostfix) {
      node = this.parsePostfix(node);
    }
    if (node) {
      return node;
    } else {
      throw this.error("unexpected token: " + tok.value, tok.lineno, tok.colno);
    }
  };
  _proto.parseFilterName = function parseFilterName() {
    var tok = this.expect(lexer.TOKEN_SYMBOL);
    var name = tok.value;
    while (this.skipValue(lexer.TOKEN_OPERATOR, '.')) {
      name += '.' + this.expect(lexer.TOKEN_SYMBOL).value;
    }
    return new nodes.Symbol(tok.lineno, tok.colno, name);
  };
  _proto.parseFilterArgs = function parseFilterArgs(node) {
    if (this.peekToken().type === lexer.TOKEN_LEFT_PAREN) {
      // Get a FunCall node and add the parameters to the
      // filter
      var call = this.parsePostfix(node);
      return call.args.children;
    }
    return [];
  };
  _proto.parseFilter = function parseFilter(node) {
    while (this.skip(lexer.TOKEN_PIPE)) {
      var name = this.parseFilterName();
      node = new nodes.Filter(name.lineno, name.colno, name, new nodes.NodeList(name.lineno, name.colno, [node].concat(this.parseFilterArgs(node))));
    }
    return node;
  };
  _proto.parseFilterStatement = function parseFilterStatement() {
    var filterTok = this.peekToken();
    if (!this.skipSymbol('filter')) {
      this.fail('parseFilterStatement: expected filter');
    }
    var name = this.parseFilterName();
    var args = this.parseFilterArgs(name);
    this.advanceAfterBlockEnd(filterTok.value);
    var body = new nodes.Capture(name.lineno, name.colno, this.parseUntilBlocks('endfilter'));
    this.advanceAfterBlockEnd();
    var node = new nodes.Filter(name.lineno, name.colno, name, new nodes.NodeList(name.lineno, name.colno, [body].concat(args)));
    return new nodes.Output(name.lineno, name.colno, [node]);
  };
  _proto.parseAggregate = function parseAggregate() {
    var tok = this.nextToken();
    var node;
    switch (tok.type) {
      case lexer.TOKEN_LEFT_PAREN:
        node = new nodes.Group(tok.lineno, tok.colno);
        break;
      case lexer.TOKEN_LEFT_BRACKET:
        node = new nodes.Array(tok.lineno, tok.colno);
        break;
      case lexer.TOKEN_LEFT_CURLY:
        node = new nodes.Dict(tok.lineno, tok.colno);
        break;
      default:
        return null;
    }
    while (1) {
      // eslint-disable-line no-constant-condition
      var type = this.peekToken().type;
      if (type === lexer.TOKEN_RIGHT_PAREN || type === lexer.TOKEN_RIGHT_BRACKET || type === lexer.TOKEN_RIGHT_CURLY) {
        this.nextToken();
        break;
      }
      if (node.children.length > 0) {
        if (!this.skip(lexer.TOKEN_COMMA)) {
          this.fail('parseAggregate: expected comma after expression', tok.lineno, tok.colno);
        }
      }
      if (node instanceof nodes.Dict) {
        // TODO: check for errors
        var key = this.parsePrimary();

        // We expect a key/value pair for dicts, separated by a
        // colon
        if (!this.skip(lexer.TOKEN_COLON)) {
          this.fail('parseAggregate: expected colon after dict key', tok.lineno, tok.colno);
        }

        // TODO: check for errors
        var value = this.parseExpression();
        node.addChild(new nodes.Pair(key.lineno, key.colno, key, value));
      } else {
        // TODO: check for errors
        var expr = this.parseExpression();
        node.addChild(expr);
      }
    }
    return node;
  };
  _proto.parseSignature = function parseSignature(tolerant, noParens) {
    var tok = this.peekToken();
    if (!noParens && tok.type !== lexer.TOKEN_LEFT_PAREN) {
      if (tolerant) {
        return null;
      } else {
        this.fail('expected arguments', tok.lineno, tok.colno);
      }
    }
    if (tok.type === lexer.TOKEN_LEFT_PAREN) {
      tok = this.nextToken();
    }
    var args = new nodes.NodeList(tok.lineno, tok.colno);
    var kwargs = new nodes.KeywordArgs(tok.lineno, tok.colno);
    var checkComma = false;
    while (1) {
      // eslint-disable-line no-constant-condition
      tok = this.peekToken();
      if (!noParens && tok.type === lexer.TOKEN_RIGHT_PAREN) {
        this.nextToken();
        break;
      } else if (noParens && tok.type === lexer.TOKEN_BLOCK_END) {
        break;
      }
      if (checkComma && !this.skip(lexer.TOKEN_COMMA)) {
        this.fail('parseSignature: expected comma after expression', tok.lineno, tok.colno);
      } else {
        var arg = this.parseExpression();
        if (this.skipValue(lexer.TOKEN_OPERATOR, '=')) {
          kwargs.addChild(new nodes.Pair(arg.lineno, arg.colno, arg, this.parseExpression()));
        } else {
          args.addChild(arg);
        }
      }
      checkComma = true;
    }
    if (kwargs.children.length) {
      args.addChild(kwargs);
    }
    return args;
  };
  _proto.parseUntilBlocks = function parseUntilBlocks() {
    var prev = this.breakOnBlocks;
    for (var _len = arguments.length, blockNames = new Array(_len), _key = 0; _key < _len; _key++) {
      blockNames[_key] = arguments[_key];
    }
    this.breakOnBlocks = blockNames;
    var ret = this.parse();
    this.breakOnBlocks = prev;
    return ret;
  };
  _proto.parseNodes = function parseNodes() {
    var tok;
    var buf = [];
    while (tok = this.nextToken()) {
      if (tok.type === lexer.TOKEN_DATA) {
        var data = tok.value;
        var nextToken = this.peekToken();
        var nextVal = nextToken && nextToken.value;

        // If the last token has "-" we need to trim the
        // leading whitespace of the data. This is marked with
        // the `dropLeadingWhitespace` variable.
        if (this.dropLeadingWhitespace) {
          // TODO: this could be optimized (don't use regex)
          data = data.replace(/^\s*/, '');
          this.dropLeadingWhitespace = false;
        }

        // Same for the succeeding block start token
        if (nextToken && (nextToken.type === lexer.TOKEN_BLOCK_START && nextVal.charAt(nextVal.length - 1) === '-' || nextToken.type === lexer.TOKEN_VARIABLE_START && nextVal.charAt(this.tokens.tags.VARIABLE_START.length) === '-' || nextToken.type === lexer.TOKEN_COMMENT && nextVal.charAt(this.tokens.tags.COMMENT_START.length) === '-')) {
          // TODO: this could be optimized (don't use regex)
          data = data.replace(/\s*$/, '');
        }
        buf.push(new nodes.Output(tok.lineno, tok.colno, [new nodes.TemplateData(tok.lineno, tok.colno, data)]));
      } else if (tok.type === lexer.TOKEN_BLOCK_START) {
        this.dropLeadingWhitespace = false;
        var n = this.parseStatement();
        if (!n) {
          break;
        }
        buf.push(n);
      } else if (tok.type === lexer.TOKEN_VARIABLE_START) {
        var e = this.parseExpression();
        this.dropLeadingWhitespace = false;
        this.advanceAfterVariableEnd();
        buf.push(new nodes.Output(tok.lineno, tok.colno, [e]));
      } else if (tok.type === lexer.TOKEN_COMMENT) {
        this.dropLeadingWhitespace = tok.value.charAt(tok.value.length - this.tokens.tags.COMMENT_END.length - 1) === '-';
      } else {
        // Ignore comments, otherwise this should be an error
        this.fail('Unexpected token at top-level: ' + tok.type, tok.lineno, tok.colno);
      }
    }
    return buf;
  };
  _proto.parse = function parse() {
    return new nodes.NodeList(0, 0, this.parseNodes());
  };
  _proto.parseAsRoot = function parseAsRoot() {
    return new nodes.Root(0, 0, this.parseNodes());
  };
  return Parser;
}(Obj); // var util = require('util');
// var l = lexer.lex('{%- if x -%}\n hello {% endif %}');
// var t;
// while((t = l.nextToken())) {
//     console.log(util.inspect(t));
// }
// var p = new Parser(lexer.lex('hello {% filter title %}' +
//                              'Hello madam how are you' +
//                              '{% endfilter %}'));
// var n = p.parseAsRoot();
// nodes.printNodes(n);
module.exports = {
  parse: function parse(src, extensions, opts) {
    var p = new Parser(lexer.lex(src, opts));
    if (extensions !== undefined) {
      p.extensions = extensions;
    }
    return p.parseAsRoot();
  },
  Parser: Parser
};

/***/ }),

/***/ 1524:
/***/ ((module) => {

"use strict";


function precompileGlobal(templates, opts) {
  var out = '';
  opts = opts || {};
  for (var i = 0; i < templates.length; i++) {
    var name = JSON.stringify(templates[i].name);
    var template = templates[i].template;
    out += '(function() {' + '(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})' + '[' + name + '] = (function() {\n' + template + '\n})();\n';
    if (opts.asFunction) {
      out += 'return function(ctx, cb) { return nunjucks.render(' + name + ', ctx, cb); }\n';
    }
    out += '})();\n';
  }
  return out;
}
module.exports = precompileGlobal;

/***/ }),

/***/ 7513:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var fs = __nccwpck_require__(7147);
var path = __nccwpck_require__(1017);
var _require = __nccwpck_require__(4127),
  _prettifyError = _require._prettifyError;
var compiler = __nccwpck_require__(4548);
var _require2 = __nccwpck_require__(4428),
  Environment = _require2.Environment;
var precompileGlobal = __nccwpck_require__(1524);
function match(filename, patterns) {
  if (!Array.isArray(patterns)) {
    return false;
  }
  return patterns.some(function (pattern) {
    return filename.match(pattern);
  });
}
function precompileString(str, opts) {
  opts = opts || {};
  opts.isString = true;
  var env = opts.env || new Environment([]);
  var wrapper = opts.wrapper || precompileGlobal;
  if (!opts.name) {
    throw new Error('the "name" option is required when compiling a string');
  }
  return wrapper([_precompile(str, opts.name, env)], opts);
}
function precompile(input, opts) {
  // The following options are available:
  //
  // * name: name of the template (auto-generated when compiling a directory)
  // * isString: input is a string, not a file path
  // * asFunction: generate a callable function
  // * force: keep compiling on error
  // * env: the Environment to use (gets extensions and async filters from it)
  // * include: which file/folders to include (folders are auto-included, files are auto-excluded)
  // * exclude: which file/folders to exclude (folders are auto-included, files are auto-excluded)
  // * wrapper: function(templates, opts) {...}
  //       Customize the output format to store the compiled template.
  //       By default, templates are stored in a global variable used by the runtime.
  //       A custom loader will be necessary to load your custom wrapper.

  opts = opts || {};
  var env = opts.env || new Environment([]);
  var wrapper = opts.wrapper || precompileGlobal;
  if (opts.isString) {
    return precompileString(input, opts);
  }
  var pathStats = fs.existsSync(input) && fs.statSync(input);
  var precompiled = [];
  var templates = [];
  function addTemplates(dir) {
    fs.readdirSync(dir).forEach(function (file) {
      var filepath = path.join(dir, file);
      var subpath = filepath.substr(path.join(input, '/').length);
      var stat = fs.statSync(filepath);
      if (stat && stat.isDirectory()) {
        subpath += '/';
        if (!match(subpath, opts.exclude)) {
          addTemplates(filepath);
        }
      } else if (match(subpath, opts.include)) {
        templates.push(filepath);
      }
    });
  }
  if (pathStats.isFile()) {
    precompiled.push(_precompile(fs.readFileSync(input, 'utf-8'), opts.name || input, env));
  } else if (pathStats.isDirectory()) {
    addTemplates(input);
    for (var i = 0; i < templates.length; i++) {
      var name = templates[i].replace(path.join(input, '/'), '');
      try {
        precompiled.push(_precompile(fs.readFileSync(templates[i], 'utf-8'), name, env));
      } catch (e) {
        if (opts.force) {
          // Don't stop generating the output if we're
          // forcing compilation.
          console.error(e); // eslint-disable-line no-console
        } else {
          throw e;
        }
      }
    }
  }
  return wrapper(precompiled, opts);
}
function _precompile(str, name, env) {
  env = env || new Environment([]);
  var asyncFilters = env.asyncFilters;
  var extensions = env.extensionsList;
  var template;
  name = name.replace(/\\/g, '/');
  try {
    template = compiler.compile(str, asyncFilters, extensions, name, env.opts);
  } catch (err) {
    throw _prettifyError(name, false, err);
  }
  return {
    name: name,
    template: template
  };
}
module.exports = {
  precompile: precompile,
  precompileString: precompileString
};

/***/ }),

/***/ 8957:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var Loader = __nccwpck_require__(6981);
var PrecompiledLoader = /*#__PURE__*/function (_Loader) {
  _inheritsLoose(PrecompiledLoader, _Loader);
  function PrecompiledLoader(compiledTemplates) {
    var _this;
    _this = _Loader.call(this) || this;
    _this.precompiled = compiledTemplates || {};
    return _this;
  }
  var _proto = PrecompiledLoader.prototype;
  _proto.getSource = function getSource(name) {
    if (this.precompiled[name]) {
      return {
        src: {
          type: 'code',
          obj: this.precompiled[name]
        },
        path: name
      };
    }
    return null;
  };
  return PrecompiledLoader;
}(Loader);
module.exports = {
  PrecompiledLoader: PrecompiledLoader
};

/***/ }),

/***/ 1998:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var lib = __nccwpck_require__(4127);
var arrayFrom = Array.from;
var supportsIterators = typeof Symbol === 'function' && Symbol.iterator && typeof arrayFrom === 'function';

// Frames keep track of scoping both at compile-time and run-time so
// we know how to access variables. Block tags can introduce special
// variables, for example.
var Frame = /*#__PURE__*/function () {
  function Frame(parent, isolateWrites) {
    this.variables = Object.create(null);
    this.parent = parent;
    this.topLevel = false;
    // if this is true, writes (set) should never propagate upwards past
    // this frame to its parent (though reads may).
    this.isolateWrites = isolateWrites;
  }
  var _proto = Frame.prototype;
  _proto.set = function set(name, val, resolveUp) {
    // Allow variables with dots by automatically creating the
    // nested structure
    var parts = name.split('.');
    var obj = this.variables;
    var frame = this;
    if (resolveUp) {
      if (frame = this.resolve(parts[0], true)) {
        frame.set(name, val);
        return;
      }
    }
    for (var i = 0; i < parts.length - 1; i++) {
      var id = parts[i];
      if (!obj[id]) {
        obj[id] = {};
      }
      obj = obj[id];
    }
    obj[parts[parts.length - 1]] = val;
  };
  _proto.get = function get(name) {
    var val = this.variables[name];
    if (val !== undefined) {
      return val;
    }
    return null;
  };
  _proto.lookup = function lookup(name) {
    var p = this.parent;
    var val = this.variables[name];
    if (val !== undefined) {
      return val;
    }
    return p && p.lookup(name);
  };
  _proto.resolve = function resolve(name, forWrite) {
    var p = forWrite && this.isolateWrites ? undefined : this.parent;
    var val = this.variables[name];
    if (val !== undefined) {
      return this;
    }
    return p && p.resolve(name);
  };
  _proto.push = function push(isolateWrites) {
    return new Frame(this, isolateWrites);
  };
  _proto.pop = function pop() {
    return this.parent;
  };
  return Frame;
}();
function makeMacro(argNames, kwargNames, func) {
  return function macro() {
    for (var _len = arguments.length, macroArgs = new Array(_len), _key = 0; _key < _len; _key++) {
      macroArgs[_key] = arguments[_key];
    }
    var argCount = numArgs(macroArgs);
    var args;
    var kwargs = getKeywordArgs(macroArgs);
    if (argCount > argNames.length) {
      args = macroArgs.slice(0, argNames.length);

      // Positional arguments that should be passed in as
      // keyword arguments (essentially default values)
      macroArgs.slice(args.length, argCount).forEach(function (val, i) {
        if (i < kwargNames.length) {
          kwargs[kwargNames[i]] = val;
        }
      });
      args.push(kwargs);
    } else if (argCount < argNames.length) {
      args = macroArgs.slice(0, argCount);
      for (var i = argCount; i < argNames.length; i++) {
        var arg = argNames[i];

        // Keyword arguments that should be passed as
        // positional arguments, i.e. the caller explicitly
        // used the name of a positional arg
        args.push(kwargs[arg]);
        delete kwargs[arg];
      }
      args.push(kwargs);
    } else {
      args = macroArgs;
    }
    return func.apply(this, args);
  };
}
function makeKeywordArgs(obj) {
  obj.__keywords = true;
  return obj;
}
function isKeywordArgs(obj) {
  return obj && Object.prototype.hasOwnProperty.call(obj, '__keywords');
}
function getKeywordArgs(args) {
  var len = args.length;
  if (len) {
    var lastArg = args[len - 1];
    if (isKeywordArgs(lastArg)) {
      return lastArg;
    }
  }
  return {};
}
function numArgs(args) {
  var len = args.length;
  if (len === 0) {
    return 0;
  }
  var lastArg = args[len - 1];
  if (isKeywordArgs(lastArg)) {
    return len - 1;
  } else {
    return len;
  }
}

// A SafeString object indicates that the string should not be
// autoescaped. This happens magically because autoescaping only
// occurs on primitive string objects.
function SafeString(val) {
  if (typeof val !== 'string') {
    return val;
  }
  this.val = val;
  this.length = val.length;
}
SafeString.prototype = Object.create(String.prototype, {
  length: {
    writable: true,
    configurable: true,
    value: 0
  }
});
SafeString.prototype.valueOf = function valueOf() {
  return this.val;
};
SafeString.prototype.toString = function toString() {
  return this.val;
};
function copySafeness(dest, target) {
  if (dest instanceof SafeString) {
    return new SafeString(target);
  }
  return target.toString();
}
function markSafe(val) {
  var type = typeof val;
  if (type === 'string') {
    return new SafeString(val);
  } else if (type !== 'function') {
    return val;
  } else {
    return function wrapSafe(args) {
      var ret = val.apply(this, arguments);
      if (typeof ret === 'string') {
        return new SafeString(ret);
      }
      return ret;
    };
  }
}
function suppressValue(val, autoescape) {
  val = val !== undefined && val !== null ? val : '';
  if (autoescape && !(val instanceof SafeString)) {
    val = lib.escape(val.toString());
  }
  return val;
}
function ensureDefined(val, lineno, colno) {
  if (val === null || val === undefined) {
    throw new lib.TemplateError('attempted to output null or undefined value', lineno + 1, colno + 1);
  }
  return val;
}
function memberLookup(obj, val) {
  if (obj === undefined || obj === null) {
    return undefined;
  }
  if (typeof obj[val] === 'function') {
    return function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      return obj[val].apply(obj, args);
    };
  }
  return obj[val];
}
function callWrap(obj, name, context, args) {
  if (!obj) {
    throw new Error('Unable to call `' + name + '`, which is undefined or falsey');
  } else if (typeof obj !== 'function') {
    throw new Error('Unable to call `' + name + '`, which is not a function');
  }
  return obj.apply(context, args);
}
function contextOrFrameLookup(context, frame, name) {
  var val = frame.lookup(name);
  return val !== undefined ? val : context.lookup(name);
}
function handleError(error, lineno, colno) {
  if (error.lineno) {
    return error;
  } else {
    return new lib.TemplateError(error, lineno, colno);
  }
}
function asyncEach(arr, dimen, iter, cb) {
  if (lib.isArray(arr)) {
    var len = arr.length;
    lib.asyncIter(arr, function iterCallback(item, i, next) {
      switch (dimen) {
        case 1:
          iter(item, i, len, next);
          break;
        case 2:
          iter(item[0], item[1], i, len, next);
          break;
        case 3:
          iter(item[0], item[1], item[2], i, len, next);
          break;
        default:
          item.push(i, len, next);
          iter.apply(this, item);
      }
    }, cb);
  } else {
    lib.asyncFor(arr, function iterCallback(key, val, i, len, next) {
      iter(key, val, i, len, next);
    }, cb);
  }
}
function asyncAll(arr, dimen, func, cb) {
  var finished = 0;
  var len;
  var outputArr;
  function done(i, output) {
    finished++;
    outputArr[i] = output;
    if (finished === len) {
      cb(null, outputArr.join(''));
    }
  }
  if (lib.isArray(arr)) {
    len = arr.length;
    outputArr = new Array(len);
    if (len === 0) {
      cb(null, '');
    } else {
      for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        switch (dimen) {
          case 1:
            func(item, i, len, done);
            break;
          case 2:
            func(item[0], item[1], i, len, done);
            break;
          case 3:
            func(item[0], item[1], item[2], i, len, done);
            break;
          default:
            item.push(i, len, done);
            func.apply(this, item);
        }
      }
    }
  } else {
    var keys = lib.keys(arr || {});
    len = keys.length;
    outputArr = new Array(len);
    if (len === 0) {
      cb(null, '');
    } else {
      for (var _i = 0; _i < keys.length; _i++) {
        var k = keys[_i];
        func(k, arr[k], _i, len, done);
      }
    }
  }
}
function fromIterator(arr) {
  if (typeof arr !== 'object' || arr === null || lib.isArray(arr)) {
    return arr;
  } else if (supportsIterators && Symbol.iterator in arr) {
    return arrayFrom(arr);
  } else {
    return arr;
  }
}
module.exports = {
  Frame: Frame,
  makeMacro: makeMacro,
  makeKeywordArgs: makeKeywordArgs,
  numArgs: numArgs,
  suppressValue: suppressValue,
  ensureDefined: ensureDefined,
  memberLookup: memberLookup,
  contextOrFrameLookup: contextOrFrameLookup,
  callWrap: callWrap,
  handleError: handleError,
  isArray: lib.isArray,
  keys: lib.keys,
  SafeString: SafeString,
  copySafeness: copySafeness,
  markSafe: markSafe,
  asyncEach: asyncEach,
  asyncAll: asyncAll,
  inOperator: lib.inOperator,
  fromIterator: fromIterator
};

/***/ }),

/***/ 841:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var SafeString = (__nccwpck_require__(1998).SafeString);

/**
 * Returns `true` if the object is a function, otherwise `false`.
 * @param { any } value
 * @returns { boolean }
 */
function callable(value) {
  return typeof value === 'function';
}
exports.callable = callable;

/**
 * Returns `true` if the object is strictly not `undefined`.
 * @param { any } value
 * @returns { boolean }
 */
function defined(value) {
  return value !== undefined;
}
exports.defined = defined;

/**
 * Returns `true` if the operand (one) is divisble by the test's argument
 * (two).
 * @param { number } one
 * @param { number } two
 * @returns { boolean }
 */
function divisibleby(one, two) {
  return one % two === 0;
}
exports.divisibleby = divisibleby;

/**
 * Returns true if the string has been escaped (i.e., is a SafeString).
 * @param { any } value
 * @returns { boolean }
 */
function escaped(value) {
  return value instanceof SafeString;
}
exports.escaped = escaped;

/**
 * Returns `true` if the arguments are strictly equal.
 * @param { any } one
 * @param { any } two
 */
function equalto(one, two) {
  return one === two;
}
exports.equalto = equalto;

// Aliases
exports.eq = exports.equalto;
exports.sameas = exports.equalto;

/**
 * Returns `true` if the value is evenly divisible by 2.
 * @param { number } value
 * @returns { boolean }
 */
function even(value) {
  return value % 2 === 0;
}
exports.even = even;

/**
 * Returns `true` if the value is falsy - if I recall correctly, '', 0, false,
 * undefined, NaN or null. I don't know if we should stick to the default JS
 * behavior or attempt to replicate what Python believes should be falsy (i.e.,
 * empty arrays, empty dicts, not 0...).
 * @param { any } value
 * @returns { boolean }
 */
function falsy(value) {
  return !value;
}
exports.falsy = falsy;

/**
 * Returns `true` if the operand (one) is greater or equal to the test's
 * argument (two).
 * @param { number } one
 * @param { number } two
 * @returns { boolean }
 */
function ge(one, two) {
  return one >= two;
}
exports.ge = ge;

/**
 * Returns `true` if the operand (one) is greater than the test's argument
 * (two).
 * @param { number } one
 * @param { number } two
 * @returns { boolean }
 */
function greaterthan(one, two) {
  return one > two;
}
exports.greaterthan = greaterthan;

// alias
exports.gt = exports.greaterthan;

/**
 * Returns `true` if the operand (one) is less than or equal to the test's
 * argument (two).
 * @param { number } one
 * @param { number } two
 * @returns { boolean }
 */
function le(one, two) {
  return one <= two;
}
exports.le = le;

/**
 * Returns `true` if the operand (one) is less than the test's passed argument
 * (two).
 * @param { number } one
 * @param { number } two
 * @returns { boolean }
 */
function lessthan(one, two) {
  return one < two;
}
exports.lessthan = lessthan;

// alias
exports.lt = exports.lessthan;

/**
 * Returns `true` if the string is lowercased.
 * @param { string } value
 * @returns { boolean }
 */
function lower(value) {
  return value.toLowerCase() === value;
}
exports.lower = lower;

/**
 * Returns `true` if the operand (one) is less than or equal to the test's
 * argument (two).
 * @param { number } one
 * @param { number } two
 * @returns { boolean }
 */
function ne(one, two) {
  return one !== two;
}
exports.ne = ne;

/**
 * Returns true if the value is strictly equal to `null`.
 * @param { any }
 * @returns { boolean }
 */
function nullTest(value) {
  return value === null;
}
exports["null"] = nullTest;

/**
 * Returns true if value is a number.
 * @param { any }
 * @returns { boolean }
 */
function number(value) {
  return typeof value === 'number';
}
exports.number = number;

/**
 * Returns `true` if the value is *not* evenly divisible by 2.
 * @param { number } value
 * @returns { boolean }
 */
function odd(value) {
  return value % 2 === 1;
}
exports.odd = odd;

/**
 * Returns `true` if the value is a string, `false` if not.
 * @param { any } value
 * @returns { boolean }
 */
function string(value) {
  return typeof value === 'string';
}
exports.string = string;

/**
 * Returns `true` if the value is not in the list of things considered falsy:
 * '', null, undefined, 0, NaN and false.
 * @param { any } value
 * @returns { boolean }
 */
function truthy(value) {
  return !!value;
}
exports.truthy = truthy;

/**
 * Returns `true` if the value is undefined.
 * @param { any } value
 * @returns { boolean }
 */
function undefinedTest(value) {
  return value === undefined;
}
exports.undefined = undefinedTest;

/**
 * Returns `true` if the string is uppercased.
 * @param { string } value
 * @returns { boolean }
 */
function upper(value) {
  return value.toUpperCase() === value;
}
exports.upper = upper;

/**
 * If ES6 features are available, returns `true` if the value implements the
 * `Symbol.iterator` method. If not, it's a string or Array.
 *
 * Could potentially cause issues if a browser exists that has Set and Map but
 * not Symbol.
 *
 * @param { any } value
 * @returns { boolean }
 */
function iterable(value) {
  if (typeof Symbol !== 'undefined') {
    return !!value[Symbol.iterator];
  } else {
    return Array.isArray(value) || typeof value === 'string';
  }
}
exports.iterable = iterable;

/**
 * If ES6 features are available, returns `true` if the value is an object hash
 * or an ES6 Map. Otherwise just return if it's an object hash.
 * @param { any } value
 * @returns { boolean }
 */
function mapping(value) {
  // only maps and object hashes
  var bool = value !== null && value !== undefined && typeof value === 'object' && !Array.isArray(value);
  if (Set) {
    return bool && !(value instanceof Set);
  } else {
    return bool;
  }
}
exports.mapping = mapping;

/***/ }),

/***/ 3773:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var nodes = __nccwpck_require__(429);
var lib = __nccwpck_require__(4127);
var sym = 0;
function gensym() {
  return 'hole_' + sym++;
}

// copy-on-write version of map
function mapCOW(arr, func) {
  var res = null;
  for (var i = 0; i < arr.length; i++) {
    var item = func(arr[i]);
    if (item !== arr[i]) {
      if (!res) {
        res = arr.slice();
      }
      res[i] = item;
    }
  }
  return res || arr;
}
function walk(ast, func, depthFirst) {
  if (!(ast instanceof nodes.Node)) {
    return ast;
  }
  if (!depthFirst) {
    var astT = func(ast);
    if (astT && astT !== ast) {
      return astT;
    }
  }
  if (ast instanceof nodes.NodeList) {
    var children = mapCOW(ast.children, function (node) {
      return walk(node, func, depthFirst);
    });
    if (children !== ast.children) {
      ast = new nodes[ast.typename](ast.lineno, ast.colno, children);
    }
  } else if (ast instanceof nodes.CallExtension) {
    var args = walk(ast.args, func, depthFirst);
    var contentArgs = mapCOW(ast.contentArgs, function (node) {
      return walk(node, func, depthFirst);
    });
    if (args !== ast.args || contentArgs !== ast.contentArgs) {
      ast = new nodes[ast.typename](ast.extName, ast.prop, args, contentArgs);
    }
  } else {
    var props = ast.fields.map(function (field) {
      return ast[field];
    });
    var propsT = mapCOW(props, function (prop) {
      return walk(prop, func, depthFirst);
    });
    if (propsT !== props) {
      ast = new nodes[ast.typename](ast.lineno, ast.colno);
      propsT.forEach(function (prop, i) {
        ast[ast.fields[i]] = prop;
      });
    }
  }
  return depthFirst ? func(ast) || ast : ast;
}
function depthWalk(ast, func) {
  return walk(ast, func, true);
}
function _liftFilters(node, asyncFilters, prop) {
  var children = [];
  var walked = depthWalk(prop ? node[prop] : node, function (descNode) {
    var symbol;
    if (descNode instanceof nodes.Block) {
      return descNode;
    } else if (descNode instanceof nodes.Filter && lib.indexOf(asyncFilters, descNode.name.value) !== -1 || descNode instanceof nodes.CallExtensionAsync) {
      symbol = new nodes.Symbol(descNode.lineno, descNode.colno, gensym());
      children.push(new nodes.FilterAsync(descNode.lineno, descNode.colno, descNode.name, descNode.args, symbol));
    }
    return symbol;
  });
  if (prop) {
    node[prop] = walked;
  } else {
    node = walked;
  }
  if (children.length) {
    children.push(node);
    return new nodes.NodeList(node.lineno, node.colno, children);
  } else {
    return node;
  }
}
function liftFilters(ast, asyncFilters) {
  return depthWalk(ast, function (node) {
    if (node instanceof nodes.Output) {
      return _liftFilters(node, asyncFilters);
    } else if (node instanceof nodes.Set) {
      return _liftFilters(node, asyncFilters, 'value');
    } else if (node instanceof nodes.For) {
      return _liftFilters(node, asyncFilters, 'arr');
    } else if (node instanceof nodes.If) {
      return _liftFilters(node, asyncFilters, 'cond');
    } else if (node instanceof nodes.CallExtension) {
      return _liftFilters(node, asyncFilters, 'args');
    } else {
      return undefined;
    }
  });
}
function liftSuper(ast) {
  return walk(ast, function (blockNode) {
    if (!(blockNode instanceof nodes.Block)) {
      return;
    }
    var hasSuper = false;
    var symbol = gensym();
    blockNode.body = walk(blockNode.body, function (node) {
      // eslint-disable-line consistent-return
      if (node instanceof nodes.FunCall && node.name.value === 'super') {
        hasSuper = true;
        return new nodes.Symbol(node.lineno, node.colno, symbol);
      }
    });
    if (hasSuper) {
      blockNode.body.children.unshift(new nodes.Super(0, 0, blockNode.name, new nodes.Symbol(0, 0, symbol)));
    }
  });
}
function convertStatements(ast) {
  return depthWalk(ast, function (node) {
    if (!(node instanceof nodes.If) && !(node instanceof nodes.For)) {
      return undefined;
    }
    var async = false;
    walk(node, function (child) {
      if (child instanceof nodes.FilterAsync || child instanceof nodes.IfAsync || child instanceof nodes.AsyncEach || child instanceof nodes.AsyncAll || child instanceof nodes.CallExtensionAsync) {
        async = true;
        // Stop iterating by returning the node
        return child;
      }
      return undefined;
    });
    if (async) {
      if (node instanceof nodes.If) {
        return new nodes.IfAsync(node.lineno, node.colno, node.cond, node.body, node.else_);
      } else if (node instanceof nodes.For && !(node instanceof nodes.AsyncAll)) {
        return new nodes.AsyncEach(node.lineno, node.colno, node.arr, node.name, node.body, node.else_);
      }
    }
    return undefined;
  });
}
function cps(ast, asyncFilters) {
  return convertStatements(liftSuper(liftFilters(ast, asyncFilters)));
}
function transform(ast, asyncFilters) {
  return cps(ast, asyncFilters || []);
}

// var parser = require('./parser');
// var src = 'hello {% foo %}{% endfoo %} end';
// var ast = transform(parser.parse(src, [new FooExtension()]), ['bar']);
// nodes.printNodes(ast);

module.exports = {
  transform: transform
};

/***/ }),

/***/ 1223:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var wrappy = __nccwpck_require__(2940)
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}


/***/ }),

/***/ 8714:
/***/ ((module) => {

"use strict";


function posix(path) {
	return path.charAt(0) === '/';
}

function win32(path) {
	// https://github.com/nodejs/node/blob/b3fcc245fb25539909ef1d5eaa01dbf92e168633/lib/path.js#L56
	var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
	var result = splitDeviceRe.exec(path);
	var device = result[1] || '';
	var isUnc = Boolean(device && device.charAt(1) !== ':');

	// UNC paths are always absolute
	return Boolean(result[2] || isUnc);
}

module.exports = process.platform === 'win32' ? win32 : posix;
module.exports.posix = posix;
module.exports.win32 = win32;


/***/ }),

/***/ 4294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(4219);


/***/ }),

/***/ 4219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var net = __nccwpck_require__(1808);
var tls = __nccwpck_require__(4404);
var http = __nccwpck_require__(3685);
var https = __nccwpck_require__(5687);
var events = __nccwpck_require__(2361);
var assert = __nccwpck_require__(9491);
var util = __nccwpck_require__(3837);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 5840:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "v1", ({
  enumerable: true,
  get: function () {
    return _v.default;
  }
}));
Object.defineProperty(exports, "v3", ({
  enumerable: true,
  get: function () {
    return _v2.default;
  }
}));
Object.defineProperty(exports, "v4", ({
  enumerable: true,
  get: function () {
    return _v3.default;
  }
}));
Object.defineProperty(exports, "v5", ({
  enumerable: true,
  get: function () {
    return _v4.default;
  }
}));
Object.defineProperty(exports, "NIL", ({
  enumerable: true,
  get: function () {
    return _nil.default;
  }
}));
Object.defineProperty(exports, "version", ({
  enumerable: true,
  get: function () {
    return _version.default;
  }
}));
Object.defineProperty(exports, "validate", ({
  enumerable: true,
  get: function () {
    return _validate.default;
  }
}));
Object.defineProperty(exports, "stringify", ({
  enumerable: true,
  get: function () {
    return _stringify.default;
  }
}));
Object.defineProperty(exports, "parse", ({
  enumerable: true,
  get: function () {
    return _parse.default;
  }
}));

var _v = _interopRequireDefault(__nccwpck_require__(8628));

var _v2 = _interopRequireDefault(__nccwpck_require__(6409));

var _v3 = _interopRequireDefault(__nccwpck_require__(5122));

var _v4 = _interopRequireDefault(__nccwpck_require__(9120));

var _nil = _interopRequireDefault(__nccwpck_require__(5332));

var _version = _interopRequireDefault(__nccwpck_require__(1595));

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),

/***/ 4569:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('md5').update(bytes).digest();
}

var _default = md5;
exports["default"] = _default;

/***/ }),

/***/ 5332:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = '00000000-0000-0000-0000-000000000000';
exports["default"] = _default;

/***/ }),

/***/ 2746:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

var _default = parse;
exports["default"] = _default;

/***/ }),

/***/ 814:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports["default"] = _default;

/***/ }),

/***/ 807:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = rng;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;

function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    _crypto.default.randomFillSync(rnds8Pool);

    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/***/ }),

/***/ 5274:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('sha1').update(bytes).digest();
}

var _default = sha1;
exports["default"] = _default;

/***/ }),

/***/ 8950:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default = stringify;
exports["default"] = _default;

/***/ }),

/***/ 8628:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0, _stringify.default)(b);
}

var _default = v1;
exports["default"] = _default;

/***/ }),

/***/ 6409:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _md = _interopRequireDefault(__nccwpck_require__(4569));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports["default"] = _default;

/***/ }),

/***/ 5998:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = _default;
exports.URL = exports.DNS = void 0;

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;

function _default(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0, _stringify.default)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),

/***/ 5122:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  options = options || {};

  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.default)(rnds);
}

var _default = v4;
exports["default"] = _default;

/***/ }),

/***/ 9120:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _sha = _interopRequireDefault(__nccwpck_require__(5274));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports["default"] = _default;

/***/ }),

/***/ 6900:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _regex = _interopRequireDefault(__nccwpck_require__(814));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default = validate;
exports["default"] = _default;

/***/ }),

/***/ 1595:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

var _default = version;
exports["default"] = _default;

/***/ }),

/***/ 2940:
/***/ ((module) => {

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}


/***/ }),

/***/ 4103:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

const CATEGORIES = __nccwpck_require__(9528);

const categorize = (resources) => {
  const categorizedResources = {};
  resources.forEach((resource) => {
    if (typeof resource === "string") {
      [type, name] = resource.split(".");
      resource = { type, name };
    }
    const category = CATEGORIES["resources"][resource.type];
    if (category) {
      if (!categorizedResources[category]) {
        categorizedResources[category] = [];
      }
      categorizedResources[category].push(resource);
    }
  });
  // Sort the resources by type
  Object.keys(categorizedResources).forEach((category) => {
    categorizedResources[category].sort((a, b) => {
      if (a.type < b.type) {
        return -1;
      }
      if (a.type > b.type) {
        return 1;
      }
      return 0;
    });
  });

  // Sort the categories
  const sortedCategories = {};
  Object.keys(categorizedResources)
    .sort()
    .forEach((category) => {
      sortedCategories[category] = categorizedResources[category];
    });

  return sortedCategories;
};

exports.categorize = categorize;


/***/ }),

/***/ 4666:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

const nunjucks = __nccwpck_require__(7006);

const template = `

## Resource list
{% for category, resources in resourceList %}- [{{ category }}](#{{ category | lower | replace(" ", "-") | replace("(", "") | replace(")", "") }})
{% endfor %}

***

{% for category, resources in resourceList %}
### <a id="{{ category | lower | replace(" ", "-") | replace("(", "") | replace(")", "") }}"></a>{{ category }}
| Type | Name |
| --- | --- |
{% for resource in resources %}| {{ resource.type }} | {{ resource.name }} |
{% endfor %}
{% endfor %}
`;

const markdown = (resourceList) => {
  const env = new nunjucks.Environment();
  return env.renderString(template, { resourceList });
};

exports.markdown = markdown;


/***/ }),

/***/ 3087:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

const fs = __nccwpck_require__(7147);
const glob = __nccwpck_require__(1957);

const terraformDir = (path) => {
  // Get all files in the path recursively that end with .tf
  const files = getFilesInDir(path, ".tf");

  // Call terraformFile on each file
  const resources = files.reduce((acc, file) => {
    const fileResources = terraformFile(file);
    fileResources.forEach((fileResource) => {
      acc.add(fileResource);
    });
    return acc;
  }, new Set());
  return resources;
};

const terraformFile = (path) => {
  const lines = loadLinesInFile(path);
  return lines.reduce((acc, line) => {
    const matches = line.match(/^resource "([^"]+)" "([^"]+)" {$/);
    if (matches) {
      acc.add(matches[1] + "." + matches[2]);
    }
    return acc;
  }, new Set());
};

const terraformGraphFile = (path) => {
  const lines = loadLinesInFile(path);
  return lines.reduce((acc, line) => {
    const matches = line.match(/aws_[^ ,"']*\.[^ ,"']*(?!,)/g);
    if (matches) {
      matches.forEach((match) => {
        acc.add(match);
      });
    }
    return acc;
  }, new Set());
};

const terraformStateFile = (path) => {
  const json = loadJSONFile(path);
  return json.resources.reduce((acc, resource) => {
    acc.add(resource.type + "." + resource.name);
    return acc;
  }, new Set());
};

const getFilesInDir = (path, extension) => {
  // Get all files in the path recursively that end with the extension
  let files = [];
  try {
    glob.sync(path + "/**/*" + extension).forEach((file) => {
      files.push(file);
    });
  } catch (err) {
    console.error(err);
  }
  return files;
};

const loadLinesInFile = (path) => {
  // Load the file and parse it into lines synchronously
  let lines = [];
  try {
    if (fs.existsSync(path)) {
      // check if file exists
      const fileData = fs.readFileSync(path, "utf-8");
      lines = fileData.split("\n");
    }
  } catch (err) {
    console.error(err);
  }
  return lines;
};

const loadJSONFile = (path) => {
  // Load the file and parse the JSON synchronously
  let json = {};
  try {
    if (fs.existsSync(path)) {
      // check if file exists
      const fileData = fs.readFileSync(path, "utf-8");
      json = JSON.parse(fileData);
    }
  } catch (err) {
    console.error(err);
  }
  return json;
};

exports.terraformDir = terraformDir;
exports.terraformGraphFile = terraformGraphFile;
exports.terraformStateFile = terraformStateFile;


/***/ }),

/***/ 561:
/***/ ((module) => {

module.exports = eval("require")("chokidar");


/***/ }),

/***/ 9491:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 6113:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ 3639:
/***/ ((module) => {

"use strict";
module.exports = require("domain");

/***/ }),

/***/ 2361:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 7147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 3685:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 5687:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 1808:
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ 2037:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 1017:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 4404:
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ 3837:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ 9528:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"version":"v4.56.0","resources":{"aws_opsworks_static_web_layer":"OpsWorks","aws_elastic_beanstalk_environment":"Elastic Beanstalk","aws_gamelift_alias":"GameLift","aws_network_interface_sg_attachment":"VPC (Virtual Private Cloud)","aws_vpc_ipam_resource_discovery_association":"VPC IPAM (IP Address Manager)","aws_waf_regex_pattern_set":"WAF Classic","aws_imagebuilder_component":"EC2 Image Builder","aws_lambda_event_source_mapping":"Lambda","aws_location_place_index":"Location","aws_security_group":"VPC (Virtual Private Cloud)","aws_transfer_user":"Transfer Family","aws_codedeploy_app":"CodeDeploy","aws_apigatewayv2_model":"API Gateway V2","aws_ssm_activation":"SSM (Systems Manager)","aws_sqs_queue_redrive_policy":"SQS (Simple Queue)","aws_devicefarm_device_pool":"Device Farm","aws_appconfig_extension_association":"AppConfig","aws_ssm_default_patch_baseline":"SSM (Systems Manager)","aws_amplify_domain_association":"Amplify","aws_route53_query_log":"Route 53","aws_vpn_gateway":"VPN (Site-to-Site)","aws_transfer_tag":"Transfer Family","aws_globalaccelerator_accelerator":"Global Accelerator","aws_ec2_local_gateway_route":"Outposts (EC2)","aws_neptune_parameter_group":"Neptune","aws_kendra_thesaurus":"Kendra","aws_pinpoint_apns_voip_channel":"Pinpoint","aws_kinesisanalyticsv2_application":"Kinesis Analytics V2","aws_ivs_channel":"IVS (Interactive Video)","aws_dax_cluster":"DynamoDB Accelerator (DAX)","aws_emr_studio":"EMR","aws_storagegateway_gateway":"Storage Gateway","aws_networkmanager_customer_gateway_association":"Network Manager","aws_appsync_api_cache":"AppSync","aws_devicefarm_instance_profile":"Device Farm","aws_db_proxy_endpoint":"RDS (Relational Database)","aws_storagegateway_file_system_association":"Storage Gateway","aws_macie2_member":"Macie","aws_s3_object_copy":"S3 (Simple Storage)","aws_opsworks_application":"OpsWorks","aws_networkfirewall_rule_group":"Network Firewall","aws_eip_association":"EC2 (Elastic Compute Cloud)","aws_ecr_repository":"ECR (Elastic Container Registry)","aws_fsx_windows_file_system":"FSx","aws_lightsail_container_service":"Lightsail","aws_resourceexplorer2_index":"Resource Explorer","aws_neptune_event_subscription":"Neptune","aws_msk_scram_secret_association":"Managed Streaming for Kafka","aws_redshift_authentication_profile":"Redshift","aws_appautoscaling_target":"Application Auto Scaling","aws_iot_indexing_configuration":"IoT Core","aws_cognito_user_pool_domain":"Cognito IDP (Identity Provider)","aws_route53recoveryreadiness_readiness_check":"Route 53 Recovery Readiness","aws_imagebuilder_container_recipe":"EC2 Image Builder","aws_ebs_snapshot_import":"EBS (EC2)","aws_appstream_fleet_stack_association":"AppStream 2.0","aws_sagemaker_human_task_ui":"SageMaker","aws_redshift_partner":"Redshift","aws_mskconnect_connector":"Managed Streaming for Kafka Connect","aws_iot_policy":"IoT Core","aws_cognito_user_pool_ui_customization":"Cognito IDP (Identity Provider)","aws_servicecatalog_principal_portfolio_association":"Service Catalog","aws_cloudfront_field_level_encryption_config":"CloudFront","aws_ivs_playback_key_pair":"IVS (Interactive Video)","aws_guardduty_organization_admin_account":"GuardDuty","aws_redshiftserverless_namespace":"Redshift Serverless","aws_transfer_access":"Transfer Family","aws_waf_rule":"WAF Classic","aws_ce_anomaly_subscription":"CE (Cost Explorer)","aws_sesv2_email_identity_mail_from_attributes":"SESv2 (Simple Email V2)","aws_api_gateway_documentation_version":"API Gateway","aws_ecs_task_set":"ECS (Elastic Container)","aws_autoscaling_lifecycle_hook":"Auto Scaling","aws_quicksight_group_membership":"QuickSight","aws_placement_group":"EC2 (Elastic Compute Cloud)","aws_imagebuilder_image":"EC2 Image Builder","aws_appconfig_extension":"AppConfig","aws_acm_certificate":"ACM (Certificate Manager)","aws_iam_group_policy":"IAM (Identity & Access Management)","aws_schemas_registry":"EventBridge Schemas","aws_codepipeline_webhook":"CodePipeline","aws_kms_custom_key_store":"KMS (Key Management)","aws_ecrpublic_repository_policy":"ECR Public","aws_emr_instance_group":"EMR","aws_sagemaker_endpoint_configuration":"SageMaker","aws_cur_report_definition":"Cost and Usage Report","aws_redshiftserverless_usage_limit":"Redshift Serverless","aws_imagebuilder_distribution_configuration":"EC2 Image Builder","aws_amplify_app":"Amplify","aws_route53_delegation_set":"Route 53","aws_gamelift_game_server_group":"GameLift","aws_route53recoverycontrolconfig_safety_rule":"Route 53 Recovery Control Config","aws_redshift_subnet_group":"Redshift","aws_cloudwatch_metric_alarm":"CloudWatch","aws_lambda_function_event_invoke_config":"Lambda","aws_shield_protection_health_check_association":"Shield","aws_glue_dev_endpoint":"Glue","aws_ce_cost_allocation_tag":"CE (Cost Explorer)","aws_route53recoverycontrolconfig_control_panel":"Route 53 Recovery Control Config","aws_efs_mount_target":"EFS (Elastic File System)","aws_cloudfront_distribution":"CloudFront","aws_codecommit_repository":"CodeCommit","aws_sagemaker_feature_group":"SageMaker","aws_ec2_managed_prefix_list_entry":"VPC (Virtual Private Cloud)","aws_codestarconnections_connection":"CodeStar Connections","aws_egress_only_internet_gateway":"VPC (Virtual Private Cloud)","aws_lb_target_group_attachment":"ELB (Elastic Load Balancing)","aws_ecs_cluster":"ECS (Elastic Container)","aws_ivs_recording_configuration":"IVS (Interactive Video)","aws_wafregional_byte_match_set":"WAF Classic Regional","aws_keyspaces_keyspace":"Keyspaces (for Apache Cassandra)","aws_ec2_client_vpn_network_association":"VPN (Client)","aws_db_proxy_target":"RDS (Relational Database)","aws_iot_logging_options":"IoT Core","aws_networkfirewall_logging_configuration":"Network Firewall","aws_lightsail_lb_https_redirection_policy":"Lightsail","aws_ebs_encryption_by_default":"EBS (EC2)","aws_appconfig_environment":"AppConfig","aws_appsync_api_key":"AppSync","aws_ebs_default_kms_key":"EBS (EC2)","aws_redshiftserverless_snapshot":"Redshift Serverless","aws_cloudformation_stack_set_instance":"CloudFormation","aws_ec2_transit_gateway_multicast_domain_association":"Transit Gateway","aws_dynamodb_table_replica":"DynamoDB","aws_vpc_security_group_ingress_rule":"VPC (Virtual Private Cloud)","aws_organizations_organization":"Organizations","aws_sesv2_dedicated_ip_assignment":"SESv2 (Simple Email V2)","aws_ssm_maintenance_window":"SSM (Systems Manager)","aws_neptune_cluster_snapshot":"Neptune","aws_route53_cidr_collection":"Route 53","aws_default_network_acl":"VPC (Virtual Private Cloud)","aws_connect_lambda_function_association":"Connect","aws_accessanalyzer_archive_rule":"IAM Access Analyzer","aws_ec2_network_insights_analysis":"VPC (Virtual Private Cloud)","aws_ec2_transit_gateway_multicast_domain":"Transit Gateway","aws_ec2_tag":"EC2 (Elastic Compute Cloud)","aws_sagemaker_app_image_config":"SageMaker","aws_redshift_scheduled_action":"Redshift","aws_sagemaker_device_fleet":"SageMaker","aws_datasync_location_hdfs":"DataSync","aws_docdb_cluster":"DocDB (DocumentDB)","aws_apigatewayv2_integration_response":"API Gateway V2","aws_ami_from_instance":"EC2 (Elastic Compute Cloud)","aws_ram_resource_share_accepter":"RAM (Resource Access Manager)","aws_xray_sampling_rule":"X-Ray","aws_codestarnotifications_notification_rule":"CodeStar Notifications","aws_opsworks_mysql_layer":"OpsWorks","aws_macie2_organization_admin_account":"Macie","aws_ec2_transit_gateway_policy_table":"Transit Gateway","aws_sqs_queue_policy":"SQS (Simple Queue)","aws_cloudfront_function":"CloudFront","aws_sagemaker_space":"SageMaker","aws_wafregional_ipset":"WAF Classic Regional","aws_lambda_provisioned_concurrency_config":"Lambda","aws_pinpoint_apns_sandbox_channel":"Pinpoint","aws_db_snapshot":"RDS (Relational Database)","aws_detective_member":"Detective","aws_iot_thing_type":"IoT Core","aws_cloudtrail_event_data_store":"CloudTrail","aws_ses_domain_identity_verification":"SES (Simple Email)","aws_ecs_cluster_capacity_providers":"ECS (Elastic Container)","aws_sagemaker_app":"SageMaker","aws_rds_cluster_endpoint":"RDS (Relational Database)","aws_emrcontainers_virtual_cluster":"EMR Containers","aws_appsync_type":"AppSync","aws_glue_schema":"Glue","aws_sagemaker_notebook_instance_lifecycle_configuration":"SageMaker","aws_athena_named_query":"Athena","aws_glue_crawler":"Glue","aws_connect_user_hierarchy_structure":"Connect","aws_appmesh_gateway_route":"App Mesh","aws_api_gateway_vpc_link":"API Gateway","aws_kms_external_key":"KMS (Key Management)","aws_s3control_access_point_policy":"S3 Control","aws_acmpca_certificate":"ACM PCA (Certificate Manager Private Certificate Authority)","aws_directory_service_shared_directory_accepter":"DS (Directory Service)","aws_db_proxy_default_target_group":"RDS (Relational Database)","aws_elasticache_global_replication_group":"ElastiCache","aws_lakeformation_permissions":"Lake Formation","aws_connect_instance_storage_config":"Connect","aws_rds_cluster":"RDS (Relational Database)","aws_cloudcontrolapi_resource":"Cloud Control API","aws_prometheus_workspace":"AMP (Managed Prometheus)","aws_securityhub_standards_subscription":"Security Hub","aws_cloudwatch_log_metric_filter":"CloudWatch Logs","aws_iam_role_policy":"IAM (Identity & Access Management)","aws_vpc_ipam_pool_cidr_allocation":"VPC IPAM (IP Address Manager)","aws_vpc_ipam_pool_cidr":"VPC IPAM (IP Address Manager)","aws_dx_hosted_public_virtual_interface_accepter":"Direct Connect","aws_apigatewayv2_authorizer":"API Gateway V2","aws_dx_connection_confirmation":"Direct Connect","aws_efs_replication_configuration":"EFS (Elastic File System)","aws_ses_configuration_set":"SES (Simple Email)","aws_sns_topic_subscription":"SNS (Simple Notification)","aws_ec2_serial_console_access":"EC2 (Elastic Compute Cloud)","aws_opensearch_outbound_connection":"OpenSearch","aws_s3control_multi_region_access_point":"S3 Control","aws_ivschat_room":"IVS (Interactive Video) Chat","aws_s3control_bucket_policy":"S3 Control","aws_redshift_endpoint_authorization":"Redshift","aws_macie2_custom_data_identifier":"Macie","aws_wafv2_regex_pattern_set":"WAF","aws_lightsail_database":"Lightsail","aws_transfer_ssh_key":"Transfer Family","aws_vpc_security_group_egress_rule":"VPC (Virtual Private Cloud)","aws_autoscaling_attachment":"Auto Scaling","aws_opsworks_ecs_cluster_layer":"OpsWorks","aws_s3_bucket_ownership_controls":"S3 (Simple Storage)","aws_lambda_invocation":"Lambda","aws_wafv2_rule_group":"WAF","aws_codedeploy_deployment_config":"CodeDeploy","aws_default_security_group":"VPC (Virtual Private Cloud)","aws_transfer_server":"Transfer Family","aws_vpc_ipam_preview_next_cidr":"VPC IPAM (IP Address Manager)","aws_gamelift_build":"GameLift","aws_iam_group":"IAM (Identity & Access Management)","aws_athena_database":"Athena","aws_dx_lag":"Direct Connect","aws_rds_export_task":"RDS (Relational Database)","aws_mq_configuration":"MQ","aws_organizations_delegated_administrator":"Organizations","aws_location_map":"Location","aws_batch_job_queue":"Batch","aws_ssoadmin_instance_access_control_attributes":"SSO Admin","aws_chime_voice_connector_group":"Chime","aws_route53_zone_association":"Route 53","aws_appsync_resolver":"AppSync","aws_apigatewayv2_vpc_link":"API Gateway V2","aws_cloudwatch_log_subscription_filter":"CloudWatch Logs","aws_ses_receipt_rule_set":"SES (Simple Email)","aws_kendra_experience":"Kendra","aws_waf_size_constraint_set":"WAF Classic","aws_networkmanager_core_network_policy_attachment":"Network Manager","aws_servicecatalog_constraint":"Service Catalog","aws_cognito_resource_server":"Cognito IDP (Identity Provider)","aws_vpc_dhcp_options":"VPC (Virtual Private Cloud)","aws_cloudfront_response_headers_policy":"CloudFront","aws_codeartifact_repository_permissions_policy":"CodeArtifact","aws_lambda_function":"Lambda","aws_backup_selection":"Backup","aws_identitystore_group_membership":"SSO Identity Store","aws_glue_job":"Glue","aws_identitystore_group":"SSO Identity Store","aws_wafregional_xss_match_set":"WAF Classic Regional","aws_imagebuilder_image_recipe":"EC2 Image Builder","aws_wafregional_web_acl":"WAF Classic Regional","aws_medialive_input_security_group":"Elemental MediaLive","aws_storagegateway_nfs_file_share":"Storage Gateway","aws_api_gateway_request_validator":"API Gateway","aws_securityhub_organization_admin_account":"Security Hub","aws_ec2_network_insights_path":"VPC (Virtual Private Cloud)","aws_rds_cluster_instance":"RDS (Relational Database)","aws_elasticache_user_group_association":"ElastiCache","aws_elastic_beanstalk_application_version":"Elastic Beanstalk","aws_networkmanager_transit_gateway_peering":"Network Manager","aws_datasync_location_fsx_openzfs_file_system":"DataSync","aws_networkmanager_vpc_attachment":"Network Manager","aws_opsworks_rails_app_layer":"OpsWorks","aws_amplify_branch":"Amplify","aws_s3_bucket_inventory":"S3 (Simple Storage)","aws_efs_backup_policy":"EFS (Elastic File System)","aws_appstream_user":"AppStream 2.0","aws_lakeformation_resource_lf_tags":"Lake Formation","aws_vpc_endpoint_service_allowed_principal":"VPC (Virtual Private Cloud)","aws_signer_signing_job":"Signer","aws_neptune_global_cluster":"Neptune","aws_datasync_location_efs":"DataSync","aws_cloudformation_stack_set":"CloudFormation","aws_dynamodb_tag":"DynamoDB","aws_s3_bucket_logging":"S3 (Simple Storage)","aws_default_vpc_dhcp_options":"VPC (Virtual Private Cloud)","aws_sagemaker_flow_definition":"SageMaker","aws_ses_domain_mail_from":"SES (Simple Email)","aws_kinesis_video_stream":"Kinesis Video","aws_appconfig_configuration_profile":"AppConfig","aws_instance":"EC2 (Elastic Compute Cloud)","aws_gamelift_game_session_queue":"GameLift","aws_iam_policy_attachment":"IAM (Identity & Access Management)","aws_lb_listener":"ELB (Elastic Load Balancing)","aws_api_gateway_api_key":"API Gateway","aws_spot_datafeed_subscription":"EC2 (Elastic Compute Cloud)","aws_medialive_input":"Elemental MediaLive","aws_backup_vault_policy":"Backup","aws_route53_resolver_firewall_domain_list":"Route 53 Resolver","aws_apigatewayv2_stage":"API Gateway V2","aws_redshift_hsm_client_certificate":"Redshift","aws_db_event_subscription":"RDS (Relational Database)","aws_acmpca_certificate_authority_certificate":"ACM PCA (Certificate Manager Private Certificate Authority)","aws_transcribe_language_model":"Transcribe","aws_lightsail_disk":"Lightsail","aws_s3control_multi_region_access_point_policy":"S3 Control","aws_route53_resolver_firewall_rule_group_association":"Route 53 Resolver","aws_wafregional_rule_group":"WAF Classic Regional","aws_db_subnet_group":"RDS (Relational Database)","aws_licensemanager_license_configuration":"License Manager","aws_workspaces_ip_group":"WorkSpaces","aws_connect_security_profile":"Connect","aws_api_gateway_stage":"API Gateway","aws_sagemaker_workforce":"SageMaker","aws_elasticache_subnet_group":"ElastiCache","aws_serverlessapplicationrepository_cloudformation_stack":"Serverless Application Repository","aws_directory_service_shared_directory":"DS (Directory Service)","aws_security_group_rule":"VPC (Virtual Private Cloud)","aws_globalaccelerator_listener":"Global Accelerator","aws_ebs_volume":"EBS (EC2)","aws_iam_access_key":"IAM (Identity & Access Management)","aws_cloudsearch_domain":"CloudSearch","aws_fsx_file_cache":"FSx","aws_codebuild_source_credential":"CodeBuild","aws_dx_hosted_connection":"Direct Connect","aws_emr_cluster":"EMR","aws_db_instance_automated_backups_replication":"RDS (Relational Database)","aws_appstream_stack":"AppStream 2.0","aws_api_gateway_deployment":"API Gateway","aws_cloudfront_key_group":"CloudFront","aws_load_balancer_backend_server_policy":"ELB Classic","aws_codebuild_resource_policy":"CodeBuild","aws_servicecatalog_provisioning_artifact":"Service Catalog","aws_iam_user_ssh_key":"IAM (Identity & Access Management)","aws_dlm_lifecycle_policy":"DLM (Data Lifecycle Manager)","aws_ssm_service_setting":"SSM (Systems Manager)","aws_pinpoint_baidu_channel":"Pinpoint","aws_guardduty_member":"GuardDuty","aws_ebs_snapshot_copy":"EBS (EC2)","aws_api_gateway_integration_response":"API Gateway","aws_elasticache_user":"ElastiCache","aws_cloudtrail":"CloudTrail","aws_sagemaker_model_package_group_policy":"SageMaker","aws_cloudfront_realtime_log_config":"CloudFront","aws_opensearch_inbound_connection_accepter":"OpenSearch","aws_elasticsearch_domain_policy":"Elasticsearch","aws_vpc_ipam_scope":"VPC IPAM (IP Address Manager)","aws_route53_resolver_query_log_config":"Route 53 Resolver","aws_vpc_peering_connection":"VPC (Virtual Private Cloud)","aws_redshift_usage_limit":"Redshift","aws_chime_voice_connector_termination":"Chime","aws_cloudfront_origin_access_identity":"CloudFront","aws_ssm_resource_data_sync":"SSM (Systems Manager)","aws_cloudwatch_dashboard":"CloudWatch","aws_memorydb_acl":"MemoryDB for Redis","aws_rds_cluster_activity_stream":"RDS (Relational Database)","aws_service_discovery_http_namespace":"Cloud Map","aws_transcribe_vocabulary":"Transcribe","aws_neptune_cluster":"Neptune","aws_sagemaker_endpoint":"SageMaker","aws_connect_hours_of_operation":"Connect","aws_dx_public_virtual_interface":"Direct Connect","aws_api_gateway_documentation_part":"API Gateway","aws_s3_bucket_public_access_block":"S3 (Simple Storage)","aws_route53_resolver_firewall_config":"Route 53 Resolver","aws_cloudwatch_composite_alarm":"CloudWatch","aws_securityhub_invite_accepter":"Security Hub","aws_cloudwatch_log_destination_policy":"CloudWatch Logs","aws_lambda_layer_version":"Lambda","aws_transcribe_medical_vocabulary":"Transcribe","aws_iam_account_alias":"IAM (Identity & Access Management)","aws_s3_object":"S3 (Simple Storage)","aws_api_gateway_method":"API Gateway","aws_timestreamwrite_database":"Timestream Write","aws_emr_managed_scaling_policy":"EMR","aws_chime_voice_connector_streaming":"Chime","aws_macie2_account":"Macie","aws_api_gateway_base_path_mapping":"API Gateway","aws_elasticache_cluster":"ElastiCache","aws_efs_file_system_policy":"EFS (Elastic File System)","aws_glacier_vault":"S3 Glacier","aws_service_discovery_service":"Cloud Map","aws_api_gateway_gateway_response":"API Gateway","aws_signer_signing_profile_permission":"Signer","aws_datasync_location_smb":"DataSync","aws_location_tracker":"Location","aws_volume_attachment":"EBS (EC2)","aws_iam_group_policy_attachment":"IAM (Identity & Access Management)","aws_apigatewayv2_route":"API Gateway V2","aws_glacier_vault_lock":"S3 Glacier","aws_codecommit_trigger":"CodeCommit","aws_location_tracker_association":"Location","aws_acmpca_policy":"ACM PCA (Certificate Manager Private Certificate Authority)","aws_dms_event_subscription":"DMS (Database Migration)","aws_ec2_subnet_cidr_reservation":"VPC (Virtual Private Cloud)","aws_chime_voice_connector_origination":"Chime","aws_ssoadmin_permission_set_inline_policy":"SSO Admin","aws_evidently_launch":"CloudWatch Evidently","aws_ecs_task_definition":"ECS (Elastic Container)","aws_config_organization_managed_rule":"Config","aws_amplify_backend_environment":"Amplify","aws_kms_alias":"KMS (Key Management)","aws_servicecatalog_product":"Service Catalog","aws_quicksight_data_source":"QuickSight","aws_pinpoint_apns_channel":"Pinpoint","aws_opsworks_permission":"OpsWorks","aws_network_interface_attachment":"VPC (Virtual Private Cloud)","aws_glue_catalog_table":"Glue","aws_iam_saml_provider":"IAM (Identity & Access Management)","aws_kendra_query_suggestions_block_list":"Kendra","aws_lambda_layer_version_permission":"Lambda","aws_config_conformance_pack":"Config","aws_iot_thing_principal_attachment":"IoT Core","aws_eks_addon":"EKS (Elastic Kubernetes)","aws_network_acl_rule":"VPC (Virtual Private Cloud)","aws_servicecatalog_portfolio_share":"Service Catalog","aws_fsx_ontap_storage_virtual_machine":"FSx","aws_networkmanager_transit_gateway_connect_peer_association":"Network Manager","aws_devicefarm_test_grid_project":"Device Farm","aws_cognito_user_in_group":"Cognito IDP (Identity Provider)","aws_fsx_lustre_file_system":"FSx","aws_customer_gateway":"VPN (Site-to-Site)","aws_servicecatalog_budget_resource_association":"Service Catalog","aws_qldb_stream":"QLDB (Quantum Ledger Database)","aws_cloudwatch_log_data_protection_policy":"CloudWatch Logs","aws_datasync_location_fsx_windows_file_system":"DataSync","aws_codecommit_approval_rule_template":"CodeCommit","aws_devicefarm_network_profile":"Device Farm","aws_iot_provisioning_template":"IoT Core","aws_redshiftserverless_resource_policy":"Redshift Serverless","aws_iam_role_policy_attachment":"IAM (Identity & Access Management)","aws_datapipeline_pipeline":"Data Pipeline","aws_apprunner_observability_configuration":"App Runner","aws_nat_gateway":"VPC (Virtual Private Cloud)","aws_s3control_object_lambda_access_point_policy":"S3 Control","aws_workspaces_workspace":"WorkSpaces","aws_cognito_identity_pool_roles_attachment":"Cognito Identity","aws_dax_subnet_group":"DynamoDB Accelerator (DAX)","aws_opsworks_memcached_layer":"OpsWorks","aws_ses_identity_policy":"SES (Simple Email)","aws_rolesanywhere_trust_anchor":"Roles Anywhere","aws_auditmanager_assessment":"Audit Manager","aws_grafana_workspace":"Managed Grafana","aws_fsx_backup":"FSx","aws_vpc_ipam":"VPC IPAM (IP Address Manager)","aws_networkmanager_connect_attachment":"Network Manager","aws_lightsail_lb":"Lightsail","aws_vpc_endpoint_security_group_association":"VPC (Virtual Private Cloud)","aws_vpc_peering_connection_accepter":"VPC (Virtual Private Cloud)","aws_config_aggregate_authorization":"Config","aws_macie_s3_bucket_association":"Macie Classic","aws_detective_graph":"Detective","aws_appmesh_virtual_node":"App Mesh","aws_appconfig_deployment_strategy":"AppConfig","aws_cloudfront_monitoring_subscription":"CloudFront","aws_redshift_cluster_iam_roles":"Redshift","aws_appsync_domain_name":"AppSync","aws_api_gateway_resource":"API Gateway","aws_fsx_openzfs_file_system":"FSx","aws_cloudwatch_log_resource_policy":"CloudWatch Logs","aws_cloudfront_origin_request_policy":"CloudFront","aws_ses_template":"SES (Simple Email)","aws_servicecatalog_organizations_access":"Service Catalog","aws_iot_topic_rule":"IoT Core","aws_vpc_ipam_resource_discovery":"VPC IPAM (IP Address Manager)","aws_memorydb_user":"MemoryDB for Redis","aws_appmesh_route":"App Mesh","aws_inspector_assessment_template":"Inspector","aws_dx_transit_virtual_interface":"Direct Connect","aws_service_discovery_private_dns_namespace":"Cloud Map","aws_glue_workflow":"Glue","aws_dms_replication_instance":"DMS (Database Migration)","aws_api_gateway_usage_plan_key":"API Gateway","aws_vpn_connection_route":"VPN (Site-to-Site)","aws_iam_openid_connect_provider":"IAM (Identity & Access Management)","aws_s3_bucket_object_lock_configuration":"S3 (Simple Storage)","aws_ecs_capacity_provider":"ECS (Elastic Container)","aws_opensearch_domain_policy":"OpenSearch","aws_appmesh_virtual_router":"App Mesh","aws_config_organization_conformance_pack":"Config","aws_networkmanager_link_association":"Network Manager","aws_api_gateway_client_certificate":"API Gateway","aws_ec2_transit_gateway":"Transit Gateway","aws_cloudwatch_event_rule":"EventBridge","aws_networkmanager_core_network":"Network Manager","aws_redshiftdata_statement":"Redshift Data","aws_s3_bucket_metric":"S3 (Simple Storage)","aws_inspector2_delegated_admin_account":"Inspector V2","aws_pinpoint_adm_channel":"Pinpoint","aws_pinpoint_apns_voip_sandbox_channel":"Pinpoint","aws_kms_ciphertext":"KMS (Key Management)","aws_main_route_table_association":"VPC (Virtual Private Cloud)","aws_lightsail_domain_entry":"Lightsail","aws_iot_thing_group":"IoT Core","aws_ami":"EC2 (Elastic Compute Cloud)","aws_comprehend_entity_recognizer":"Comprehend","aws_ec2_transit_gateway_route_table_association":"Transit Gateway","aws_evidently_feature":"CloudWatch Evidently","aws_storagegateway_cache":"Storage Gateway","aws_gamelift_fleet":"GameLift","aws_scheduler_schedule":"EventBridge Scheduler","aws_eks_identity_provider_config":"EKS (Elastic Kubernetes)","aws_docdb_event_subscription":"DocDB (DocumentDB)","aws_inspector2_organization_configuration":"Inspector V2","aws_connect_quick_connect":"Connect","aws_dx_gateway":"Direct Connect","aws_auditmanager_framework_share":"Audit Manager","aws_media_convert_queue":"Elemental MediaConvert","aws_datasync_location_object_storage":"DataSync","aws_dx_gateway_association_proposal":"Direct Connect","aws_lb_ssl_negotiation_policy":"ELB Classic","aws_iot_certificate":"IoT Core","aws_opsworks_ganglia_layer":"OpsWorks","aws_route53_resolver_rule_association":"Route 53 Resolver","aws_appconfig_application":"AppConfig","aws_appconfig_hosted_configuration_version":"AppConfig","aws_waf_rate_based_rule":"WAF Classic","aws_ec2_capacity_reservation":"EC2 (Elastic Compute Cloud)","aws_dx_hosted_private_virtual_interface":"Direct Connect","aws_kinesis_stream":"Kinesis","aws_cloudwatch_log_stream":"CloudWatch Logs","aws_vpc_endpoint_policy":"VPC (Virtual Private Cloud)","aws_ecr_registry_scanning_configuration":"ECR (Elastic Container Registry)","aws_qldb_ledger":"QLDB (Quantum Ledger Database)","aws_key_pair":"EC2 (Elastic Compute Cloud)","aws_mwaa_environment":"MWAA (Managed Workflows for Apache Airflow)","aws_api_gateway_account":"API Gateway","aws_secretsmanager_secret_rotation":"Secrets Manager","aws_storagegateway_stored_iscsi_volume":"Storage Gateway","aws_ssm_association":"SSM (Systems Manager)","aws_dms_s3_endpoint":"DMS (Database Migration)","aws_chime_voice_connector_termination_credentials":"Chime","aws_route53recoveryreadiness_recovery_group":"Route 53 Recovery Readiness","aws_evidently_segment":"CloudWatch Evidently","aws_cloudhsm_v2_hsm":"CloudHSM","aws_config_delivery_channel":"Config","aws_auditmanager_framework":"Audit Manager","aws_lightsail_domain":"Lightsail","aws_chime_voice_connector_logging":"Chime","aws_athena_workgroup":"Athena","aws_pinpoint_email_channel":"Pinpoint","aws_apigatewayv2_domain_name":"API Gateway V2","aws_ec2_transit_gateway_connect":"Transit Gateway","aws_sagemaker_image":"SageMaker","aws_wafv2_ip_set":"WAF","aws_inspector2_enabler":"Inspector V2","aws_wafregional_regex_pattern_set":"WAF Classic Regional","aws_glue_catalog_database":"Glue","aws_iam_virtual_mfa_device":"IAM (Identity & Access Management)","aws_vpn_gateway_attachment":"VPN (Site-to-Site)","aws_iot_thing":"IoT Core","aws_vpc_dhcp_options_association":"VPC (Virtual Private Cloud)","aws_ec2_transit_gateway_peering_attachment_accepter":"Transit Gateway","aws_rds_cluster_parameter_group":"RDS (Relational Database)","aws_dx_hosted_transit_virtual_interface_accepter":"Direct Connect","aws_ecs_service":"ECS (Elastic Container)","aws_msk_serverless_cluster":"Managed Streaming for Kafka","aws_iam_policy":"IAM (Identity & Access Management)","aws_vpn_gateway_route_propagation":"VPN (Site-to-Site)","aws_ec2_transit_gateway_route_table":"Transit Gateway","aws_codestarconnections_host":"CodeStar Connections","aws_proxy_protocol_policy":"ELB Classic","aws_kinesis_analytics_application":"Kinesis Analytics","aws_wafregional_regex_match_set":"WAF Classic Regional","aws_apigatewayv2_deployment":"API Gateway V2","aws_cognito_user":"Cognito IDP (Identity Provider)","aws_app_cookie_stickiness_policy":"ELB Classic","aws_elasticache_security_group":"ElastiCache","aws_s3_access_point":"S3 Control","aws_directory_service_radius_settings":"DS (Directory Service)","aws_pinpoint_app":"Pinpoint","aws_cloudwatch_event_bus_policy":"EventBridge","aws_dax_parameter_group":"DynamoDB Accelerator (DAX)","aws_sesv2_dedicated_ip_pool":"SESv2 (Simple Email V2)","aws_ses_domain_identity":"SES (Simple Email)","aws_wafregional_rate_based_rule":"WAF Classic Regional","aws_ec2_traffic_mirror_filter":"VPC (Virtual Private Cloud)","aws_networkfirewall_firewall":"Network Firewall","aws_cognito_identity_provider":"Cognito IDP (Identity Provider)","aws_storagegateway_cached_iscsi_volume":"Storage Gateway","aws_cognito_user_pool":"Cognito IDP (Identity Provider)","aws_sagemaker_image_version":"SageMaker","aws_opsworks_haproxy_layer":"OpsWorks","aws_lb_cookie_stickiness_policy":"ELB Classic","aws_batch_scheduling_policy":"Batch","aws_wafregional_geo_match_set":"WAF Classic Regional","aws_autoscaling_group":"Auto Scaling","aws_guardduty_invite_accepter":"GuardDuty","aws_waf_regex_match_set":"WAF Classic","aws_location_route_calculator":"Location","aws_transfer_workflow":"Transfer Family","aws_autoscaling_schedule":"Auto Scaling","aws_ec2_traffic_mirror_session":"VPC (Virtual Private Cloud)","aws_lambda_permission":"Lambda","aws_vpc_peering_connection_options":"VPC (Virtual Private Cloud)","aws_licensemanager_association":"License Manager","aws_route53_zone":"Route 53","aws_docdb_global_cluster":"DocDB (DocumentDB)","aws_macie2_findings_filter":"Macie","aws_route_table":"VPC (Virtual Private Cloud)","aws_securityhub_action_target":"Security Hub","aws_ecr_replication_configuration":"ECR (Elastic Container Registry)","aws_glue_ml_transform":"Glue","aws_directory_service_conditional_forwarder":"DS (Directory Service)","aws_apigatewayv2_api_mapping":"API Gateway V2","aws_sns_topic":"SNS (Simple Notification)","aws_redshift_snapshot_schedule_association":"Redshift","aws_devicefarm_upload":"Device Farm","aws_appsync_function":"AppSync","aws_lakeformation_data_lake_settings":"Lake Formation","aws_lightsail_certificate":"Lightsail","aws_ecr_lifecycle_policy":"ECR (Elastic Container Registry)","aws_s3_bucket_website_configuration":"S3 (Simple Storage)","aws_rum_app_monitor":"CloudWatch RUM","aws_athena_data_catalog":"Athena","aws_iam_service_linked_role":"IAM (Identity & Access Management)","aws_ec2_host":"EC2 (Elastic Compute Cloud)","aws_detective_invitation_accepter":"Detective","aws_dx_bgp_peer":"Direct Connect","aws_guardduty_detector":"GuardDuty","aws_vpc":"VPC (Virtual Private Cloud)","aws_s3control_object_lambda_access_point":"S3 Control","aws_dynamodb_table":"DynamoDB","aws_quicksight_group":"QuickSight","aws_elasticsearch_domain_saml_options":"Elasticsearch","aws_ec2_transit_gateway_multicast_group_member":"Transit Gateway","aws_lakeformation_resource":"Lake Formation","aws_acm_certificate_validation":"ACM (Certificate Manager)","aws_ec2_client_vpn_authorization_rule":"VPN (Client)","aws_fsx_data_repository_association":"FSx","aws_elastic_beanstalk_configuration_template":"Elastic Beanstalk","aws_grafana_license_association":"Managed Grafana","aws_sns_platform_application":"SNS (Simple Notification)","aws_cognito_risk_configuration":"Cognito IDP (Identity Provider)","aws_iam_user_policy_attachment":"IAM (Identity & Access Management)","aws_lightsail_container_service_deployment_version":"Lightsail","aws_dynamodb_kinesis_streaming_destination":"DynamoDB","aws_elastictranscoder_pipeline":"Elastic Transcoder","aws_appmesh_virtual_gateway":"App Mesh","aws_ec2_transit_gateway_vpc_attachment":"Transit Gateway","aws_backup_global_settings":"Backup","aws_fsx_ontap_file_system":"FSx","aws_controltower_control":"Control Tower","aws_memorydb_cluster":"MemoryDB for Redis","aws_vpc_endpoint_route_table_association":"VPC (Virtual Private Cloud)","aws_lightsail_lb_attachment":"Lightsail","aws_lightsail_key_pair":"Lightsail","aws_ssm_maintenance_window_task":"SSM (Systems Manager)","aws_connect_contact_flow":"Connect","aws_datasync_location_fsx_lustre_file_system":"DataSync","aws_ssm_document":"SSM (Systems Manager)","aws_securityhub_account":"Security Hub","aws_ec2_traffic_mirror_target":"VPC (Virtual Private Cloud)","aws_redshiftserverless_workgroup":"Redshift Serverless","aws_ec2_managed_prefix_list":"VPC (Virtual Private Cloud)","aws_connect_user":"Connect","aws_secretsmanager_secret_policy":"Secrets Manager","aws_lightsail_lb_certificate_attachment":"Lightsail","aws_snapshot_create_volume_permission":"EBS (EC2)","aws_sagemaker_device":"SageMaker","aws_dms_replication_subnet_group":"DMS (Database Migration)","aws_cloud9_environment_membership":"Cloud9","aws_codebuild_report_group":"CodeBuild","aws_mskconnect_worker_configuration":"Managed Streaming for Kafka Connect","aws_service_discovery_public_dns_namespace":"Cloud Map","aws_appstream_user_stack_association":"AppStream 2.0","aws_media_package_channel":"Elemental MediaPackage","aws_lambda_alias":"Lambda","aws_datasync_task":"DataSync","aws_api_gateway_method_settings":"API Gateway","aws_dynamodb_global_table":"DynamoDB","aws_auditmanager_account_registration":"Audit Manager","aws_s3_bucket_acl":"S3 (Simple Storage)","aws_glue_trigger":"Glue","aws_redshift_event_subscription":"Redshift","aws_emrserverless_application":"EMR Serverless","aws_ses_active_receipt_rule_set":"SES (Simple Email)","aws_connect_queue":"Connect","aws_ram_resource_share":"RAM (Resource Access Manager)","aws_sns_topic_policy":"SNS (Simple Notification)","aws_mq_broker":"MQ","aws_sagemaker_workteam":"SageMaker","aws_api_gateway_method_response":"API Gateway","aws_servicecatalog_product_portfolio_association":"Service Catalog","aws_lb_target_group":"ELB (Elastic Load Balancing)","aws_kms_grant":"KMS (Key Management)","aws_eks_fargate_profile":"EKS (Elastic Kubernetes)","aws_codepipeline":"CodePipeline","aws_acmpca_permission":"ACM PCA (Certificate Manager Private Certificate Authority)","aws_internet_gateway_attachment":"VPC (Virtual Private Cloud)","aws_ssoadmin_managed_policy_attachment":"SSO Admin","aws_securityhub_product_subscription":"Security Hub","aws_route53_hosted_zone_dnssec":"Route 53","aws_route53_traffic_policy_instance":"Route 53","aws_networkmanager_site_to_site_vpn_attachment":"Network Manager","aws_appconfig_deployment":"AppConfig","aws_connect_routing_profile":"Connect","aws_config_configuration_aggregator":"Config","aws_rolesanywhere_profile":"Roles Anywhere","aws_iot_role_alias":"IoT Core","aws_ecs_account_setting_default":"ECS (Elastic Container)","aws_cloudsearch_domain_service_access_policy":"CloudSearch","aws_sagemaker_model":"SageMaker","aws_default_route_table":"VPC (Virtual Private Cloud)","aws_cloudfront_origin_access_control":"CloudFront","aws_securityhub_finding_aggregator":"Security Hub","aws_iam_user":"IAM (Identity & Access Management)","aws_service_discovery_instance":"Cloud Map","aws_codebuild_webhook":"CodeBuild","aws_xray_encryption_config":"X-Ray","aws_organizations_organizational_unit":"Organizations","aws_s3control_storage_lens_configuration":"S3 Control","aws_dx_macsec_key_association":"Direct Connect","aws_s3control_bucket_lifecycle_configuration":"S3 Control","aws_wafregional_rule":"WAF Classic Regional","aws_neptune_subnet_group":"Neptune","aws_ssoadmin_permissions_boundary_attachment":"SSO Admin","aws_ec2_local_gateway_route_table_vpc_association":"Outposts (EC2)","aws_flow_log":"VPC (Virtual Private Cloud)","aws_vpc_endpoint_connection_notification":"VPC (Virtual Private Cloud)","aws_auditmanager_assessment_delegation":"Audit Manager","aws_msk_cluster":"Managed Streaming for Kafka","aws_kms_replica_external_key":"KMS (Key Management)","aws_gamelift_script":"GameLift","aws_connect_vocabulary":"Connect","aws_lightsail_lb_stickiness_policy":"Lightsail","aws_codecommit_approval_rule_template_association":"CodeCommit","aws_ssm_parameter":"SSM (Systems Manager)","aws_iam_instance_profile":"IAM (Identity & Access Management)","aws_launch_template":"EC2 (Elastic Compute Cloud)","aws_elasticache_parameter_group":"ElastiCache","aws_datapipeline_pipeline_definition":"Data Pipeline","aws_db_snapshot_copy":"RDS (Relational Database)","aws_appmesh_mesh":"App Mesh","aws_s3_bucket_object":"S3 (Simple Storage)","aws_ses_receipt_filter":"SES (Simple Email)","aws_spot_instance_request":"EC2 (Elastic Compute Cloud)","aws_ec2_client_vpn_endpoint":"VPN (Client)","aws_cloudwatch_log_group":"CloudWatch Logs","aws_route53_key_signing_key":"Route 53","aws_s3_bucket_server_side_encryption_configuration":"S3 (Simple Storage)","aws_s3_bucket":"S3 (Simple Storage)","aws_memorydb_subnet_group":"MemoryDB for Redis","aws_config_remediation_configuration":"Config","aws_ssm_patch_baseline":"SSM (Systems Manager)","aws_sfn_state_machine":"SFN (Step Functions)","aws_db_parameter_group":"RDS (Relational Database)","aws_servicecatalog_tag_option":"Service Catalog","aws_macie2_classification_export_configuration":"Macie","aws_ssoadmin_customer_managed_policy_attachment":"SSO Admin","aws_opsworks_php_app_layer":"OpsWorks","aws_rum_metrics_destination":"CloudWatch RUM","aws_dx_hosted_private_virtual_interface_accepter":"Direct Connect","aws_wafregional_web_acl_association":"WAF Classic Regional","aws_inspector_resource_group":"Inspector","aws_redshift_security_group":"Redshift","aws_cloudwatch_log_destination":"CloudWatch Logs","aws_neptune_cluster_endpoint":"Neptune","aws_guardduty_organization_configuration":"GuardDuty","aws_waf_geo_match_set":"WAF Classic","aws_ebs_snapshot":"EBS (EC2)","aws_s3_bucket_lifecycle_configuration":"S3 (Simple Storage)","aws_batch_job_definition":"Batch","aws_waf_xss_match_set":"WAF Classic","aws_redshift_parameter_group":"Redshift","aws_neptune_cluster_parameter_group":"Neptune","aws_cloudwatch_query_definition":"CloudWatch Logs","aws_fsx_openzfs_snapshot":"FSx","aws_kinesisanalyticsv2_application_snapshot":"Kinesis Analytics V2","aws_glue_user_defined_function":"Glue","aws_networkmanager_device":"Network Manager","aws_dx_connection_association":"Direct Connect","aws_dynamodb_contributor_insights":"DynamoDB","aws_redshift_cluster":"Redshift","aws_glue_partition":"Glue","aws_codebuild_project":"CodeBuild","aws_schemas_schema":"EventBridge Schemas","aws_servicecatalog_service_action":"Service Catalog","aws_apprunner_custom_domain_association":"App Runner","aws_vpc_ipam_organization_admin_account":"VPC IPAM (IP Address Manager)","aws_iam_role":"IAM (Identity & Access Management)","aws_api_gateway_rest_api":"API Gateway","aws_dx_connection":"Direct Connect","aws_networkmanager_transit_gateway_registration":"Network Manager","aws_s3_bucket_cors_configuration":"S3 (Simple Storage)","aws_appflow_connector_profile":"AppFlow","aws_db_cluster_snapshot":"RDS (Relational Database)","aws_batch_compute_environment":"Batch","aws_kinesis_stream_consumer":"Kinesis","aws_cloudformation_type":"CloudFormation","aws_vpc_endpoint":"VPC (Virtual Private Cloud)","aws_ses_identity_notification_topic":"SES (Simple Email)","aws_dx_hosted_transit_virtual_interface":"Direct Connect","aws_ec2_transit_gateway_connect_peer":"Transit Gateway","aws_media_store_container":"Elemental MediaStore","aws_guardduty_filter":"GuardDuty","aws_db_security_group":"RDS (Relational Database)","aws_backup_vault":"Backup","aws_ses_domain_dkim":"SES (Simple Email)","aws_iam_service_specific_credential":"IAM (Identity & Access Management)","aws_prometheus_rule_group_namespace":"AMP (Managed Prometheus)","aws_glue_connection":"Glue","aws_cloudfront_cache_policy":"CloudFront","aws_cognito_identity_pool":"Cognito Identity","aws_docdb_subnet_group":"DocDB (DocumentDB)","aws_sagemaker_domain":"SageMaker","aws_cloud9_environment_ec2":"Cloud9","aws_api_gateway_domain_name":"API Gateway","aws_dataexchange_revision":"Data Exchange","aws_globalaccelerator_endpoint_group":"Global Accelerator","aws_codeartifact_domain_permissions_policy":"CodeArtifact","aws_opensearch_domain":"OpenSearch","aws_servicequotas_service_quota":"Service Quotas","aws_appsync_domain_name_api_association":"AppSync","aws_networkmanager_transit_gateway_route_table_attachment":"Network Manager","aws_wafregional_size_constraint_set":"WAF Classic Regional","aws_dms_certificate":"DMS (Database Migration)","aws_waf_rule_group":"WAF Classic","aws_s3_bucket_analytics_configuration":"S3 (Simple Storage)","aws_config_config_rule":"Config","aws_connect_bot_association":"Connect","aws_db_instance_role_association":"RDS (Relational Database)","aws_networkfirewall_firewall_policy":"Network Firewall","aws_appstream_image_builder":"AppStream 2.0","aws_ec2_client_vpn_route":"VPN (Client)","aws_apprunner_service":"App Runner","aws_glue_resource_policy":"Glue","aws_sesv2_configuration_set":"SESv2 (Simple Email V2)","aws_lightsail_instance":"Lightsail","aws_sagemaker_user_profile":"SageMaker","aws_auditmanager_organization_admin_account_registration":"Audit Manager","aws_ami_copy":"EC2 (Elastic Compute Cloud)","aws_ecrpublic_repository":"ECR Public","aws_lightsail_static_ip":"Lightsail","aws_worklink_fleet":"WorkLink","aws_imagebuilder_image_pipeline":"EC2 Image Builder","aws_synthetics_canary":"CloudWatch Synthetics","aws_organizations_account":"Organizations","aws_resourcegroups_group":"Resource Groups","aws_fsx_ontap_volume":"FSx","aws_emr_studio_session_mapping":"EMR","aws_route53_resolver_firewall_rule":"Route 53 Resolver","aws_dms_endpoint":"DMS (Database Migration)","aws_vpc_endpoint_subnet_association":"VPC (Virtual Private Cloud)","aws_sns_sms_preferences":"SNS (Simple Notification)","aws_grafana_workspace_api_key":"Managed Grafana","aws_elasticache_replication_group":"ElastiCache","aws_redshift_endpoint_access":"Redshift","aws_cloudwatch_event_target":"EventBridge","aws_ec2_transit_gateway_peering_attachment":"Transit Gateway","aws_msk_configuration":"Managed Streaming for Kafka","aws_cloudfront_field_level_encryption_profile":"CloudFront","aws_apigatewayv2_api":"API Gateway V2","aws_ce_cost_category":"CE (Cost Explorer)","aws_connect_contact_flow_module":"Connect","aws_ec2_transit_gateway_route":"Transit Gateway","aws_cognito_user_pool_client":"Cognito IDP (Identity Provider)","aws_apigatewayv2_route_response":"API Gateway V2","aws_sesv2_configuration_set_event_destination":"SESv2 (Simple Email V2)","aws_chime_voice_connector":"Chime","aws_xray_group":"X-Ray","aws_scheduler_schedule_group":"EventBridge Scheduler","aws_grafana_role_association":"Managed Grafana","aws_signer_signing_profile":"Signer","aws_codeartifact_repository":"CodeArtifact","aws_redshift_snapshot_schedule":"Redshift","aws_autoscaling_notification":"Auto Scaling","aws_elb_attachment":"ELB Classic","aws_lex_bot":"Lex Model Building","aws_lightsail_lb_certificate":"Lightsail","aws_glue_data_catalog_encryption_settings":"Glue","aws_opsworks_java_app_layer":"OpsWorks","aws_ce_anomaly_monitor":"CE (Cost Explorer)","aws_backup_report_plan":"Backup","aws_route53recoveryreadiness_resource_set":"Route 53 Recovery Readiness","aws_applicationinsights_application":"CloudWatch Application Insights","aws_api_gateway_authorizer":"API Gateway","aws_config_configuration_recorder_status":"Config","aws_route53_health_check":"Route 53","aws_eks_cluster":"EKS (Elastic Kubernetes)","aws_config_organization_custom_rule":"Config","aws_cloudhsm_v2_cluster":"CloudHSM","aws_macie2_invitation_accepter":"Macie","aws_ssoadmin_permission_set":"SSO Admin","aws_worklink_website_certificate_authority_association":"WorkLink","aws_iam_user_group_membership":"IAM (Identity & Access Management)","aws_storagegateway_tape_pool":"Storage Gateway","aws_media_store_container_policy":"Elemental MediaStore","aws_glue_registry":"Glue","aws_comprehend_document_classifier":"Comprehend","aws_storagegateway_working_storage":"Storage Gateway","aws_dms_replication_task":"DMS (Database Migration)","aws_backup_plan":"Backup","aws_s3_bucket_replication_configuration":"S3 (Simple Storage)","aws_db_proxy":"RDS (Relational Database)","aws_lightsail_bucket":"Lightsail","aws_ec2_transit_gateway_route_table_propagation":"Transit Gateway","aws_autoscaling_policy":"Auto Scaling","aws_ec2_transit_gateway_prefix_list_reference":"Transit Gateway","aws_opsworks_instance":"OpsWorks","aws_autoscaling_group_tag":"Auto Scaling","aws_route_table_association":"VPC (Virtual Private Cloud)","aws_ssm_maintenance_window_target":"SSM (Systems Manager)","aws_s3control_bucket":"S3 Control","aws_lb_listener_rule":"ELB (Elastic Load Balancing)","aws_apprunner_connection":"App Runner","aws_appsync_datasource":"AppSync","aws_memorydb_parameter_group":"MemoryDB for Redis","aws_route53_vpc_association_authorization":"Route 53","aws_prometheus_alert_manager_definition":"AMP (Managed Prometheus)","aws_storagegateway_upload_buffer":"Storage Gateway","aws_securityhub_insight":"Security Hub","aws_route53recoverycontrolconfig_cluster":"Route 53 Recovery Control Config","aws_pinpoint_gcm_channel":"Pinpoint","aws_kendra_index":"Kendra","aws_sagemaker_studio_lifecycle_config":"SageMaker","aws_acmpca_certificate_authority":"ACM PCA (Certificate Manager Private Certificate Authority)","aws_route":"VPC (Virtual Private Cloud)","aws_codepipeline_custom_action_type":"CodePipeline","aws_ec2_availability_zone_group":"EC2 (Elastic Compute Cloud)","aws_load_balancer_policy":"ELB Classic","aws_docdb_cluster_snapshot":"DocDB (DocumentDB)","aws_lambda_function_url":"Lambda","aws_workspaces_directory":"WorkSpaces","aws_directory_service_region":"DS (Directory Service)","aws_medialive_channel":"Elemental MediaLive","aws_opensearch_domain_saml_options":"OpenSearch","aws_dx_gateway_association":"Direct Connect","aws_location_geofence_collection":"Location","aws_iam_user_policy":"IAM (Identity & Access Management)","aws_lightsail_static_ip_attachment":"Lightsail","aws_cognito_user_group":"Cognito IDP (Identity Provider)","aws_lightsail_disk_attachment":"Lightsail","aws_swf_domain":"SWF (Simple Workflow)","aws_s3_bucket_policy":"S3 (Simple Storage)","aws_transcribe_vocabulary_filter":"Transcribe","aws_ec2_transit_gateway_vpc_attachment_accepter":"Transit Gateway","aws_ses_receipt_rule":"SES (Simple Email)","aws_networkmanager_site":"Network Manager","aws_sagemaker_servicecatalog_portfolio_status":"SageMaker","aws_s3outposts_endpoint":"S3 on Outposts","aws_route53recoverycontrolconfig_routing_control":"Route 53 Recovery Control Config","aws_cloudwatch_metric_stream":"CloudWatch","aws_dx_hosted_public_virtual_interface":"Direct Connect","aws_route53_resolver_config":"Route 53 Resolver","aws_storagegateway_smb_file_share":"Storage Gateway","aws_networkmanager_connect_peer":"Network Manager","aws_route53recoveryreadiness_cell":"Route 53 Recovery Readiness","aws_evidently_project":"CloudWatch Evidently","aws_sqs_queue_redrive_allow_policy":"SQS (Simple Queue)","aws_subnet":"VPC (Virtual Private Cloud)","aws_route53_resolver_firewall_rule_group":"Route 53 Resolver","aws_cognito_identity_pool_provider_principal_tag":"Cognito Identity","aws_elasticache_user_group":"ElastiCache","aws_config_configuration_recorder":"Config","aws_vpc_endpoint_connection_accepter":"VPC (Virtual Private Cloud)","aws_secretsmanager_secret":"Secrets Manager","aws_glue_security_configuration":"Glue","aws_identitystore_user":"SSO Identity Store","aws_pinpoint_event_stream":"Pinpoint","aws_iam_group_membership":"IAM (Identity & Access Management)","aws_schemas_discoverer":"EventBridge Schemas","aws_appsync_graphql_api":"AppSync","aws_iot_thing_group_membership":"IoT Core","aws_api_gateway_usage_plan":"API Gateway","aws_kms_key":"KMS (Key Management)","aws_servicecatalog_tag_option_resource_association":"Service Catalog","aws_api_gateway_model":"API Gateway","aws_sagemaker_model_package_group":"SageMaker","aws_vpc_ipv6_cidr_block_association":"VPC (Virtual Private Cloud)","aws_ec2_instance_state":"EC2 (Elastic Compute Cloud)","aws_pinpoint_sms_channel":"Pinpoint","aws_waf_ipset":"WAF Classic","aws_waf_web_acl":"WAF Classic","aws_redshift_hsm_configuration":"Redshift","aws_datasync_location_nfs":"DataSync","aws_auditmanager_assessment_report":"Audit Manager","aws_ec2_transit_gateway_policy_table_association":"Transit Gateway","aws_ssoadmin_account_assignment":"SSO Admin","aws_backup_framework":"Backup","aws_accessanalyzer_analyzer":"IAM Access Analyzer","aws_waf_sql_injection_match_set":"WAF Classic","aws_connect_user_hierarchy_group":"Connect","aws_vpn_connection":"VPN (Site-to-Site)","aws_memorydb_snapshot":"MemoryDB for Redis","aws_appflow_flow":"AppFlow","aws_keyspaces_table":"Keyspaces (for Apache Cassandra)","aws_ivschat_logging_configuration":"IVS (Interactive Video) Chat","aws_network_acl":"VPC (Virtual Private Cloud)","aws_directory_service_log_subscription":"DS (Directory Service)","aws_macie2_classification_job":"Macie","aws_network_acl_association":"VPC (Virtual Private Cloud)","aws_sesv2_email_identity_feedback_attributes":"SESv2 (Simple Email V2)","aws_imagebuilder_infrastructure_configuration":"EC2 Image Builder","aws_iam_server_certificate":"IAM (Identity & Access Management)","aws_api_gateway_integration":"API Gateway","aws_codedeploy_deployment_group":"CodeDeploy","aws_networkmanager_global_network":"Network Manager","aws_appintegrations_event_integration":"AppIntegrations","aws_opsworks_rds_db_instance":"OpsWorks","aws_kms_replica_key":"KMS (Key Management)","aws_s3_bucket_request_payment_configuration":"S3 (Simple Storage)","aws_backup_vault_notifications":"Backup","aws_medialive_multiplex":"Elemental MediaLive","aws_eip":"EC2 (Elastic Compute Cloud)","aws_docdb_cluster_parameter_group":"DocDB (DocumentDB)","aws_lightsail_bucket_access_key":"Lightsail","aws_lakeformation_lf_tag":"Lake Formation","aws_budgets_budget":"Web Services Budgets","aws_securityhub_standards_control":"Security Hub","aws_sagemaker_notebook_instance":"SageMaker","aws_secretsmanager_secret_version":"Secrets Manager","aws_iam_account_password_policy":"IAM (Identity & Access Management)","aws_lightsail_instance_public_ports":"Lightsail","aws_lb_listener_certificate":"ELB (Elastic Load Balancing)","aws_ecs_tag":"ECS (Elastic Container)","aws_apprunner_auto_scaling_configuration_version":"App Runner","aws_cloudwatch_event_archive":"EventBridge","aws_eks_node_group":"EKS (Elastic Kubernetes)","aws_medialive_multiplex_program":"Elemental MediaLive","aws_mskconnect_custom_plugin":"Managed Streaming for Kafka Connect","aws_macie_member_account_association":"Macie Classic","aws_iam_signing_certificate":"IAM (Identity & Access Management)","aws_vpc_endpoint_service":"VPC (Virtual Private Cloud)","aws_sesv2_email_identity":"SESv2 (Simple Email V2)","aws_ec2_carrier_gateway":"Wavelength","aws_api_gateway_rest_api_policy":"API Gateway","aws_networkmanager_link":"Network Manager","aws_vpc_ipv4_cidr_block_association":"VPC (Virtual Private Cloud)","aws_appautoscaling_scheduled_action":"Application Auto Scaling","aws_route53_resolver_query_log_config_association":"Route 53 Resolver","aws_cloudwatch_event_api_destination":"EventBridge","aws_organizations_policy_attachment":"Organizations","aws_ram_resource_association":"RAM (Resource Access Manager)","aws_dynamodb_table_item":"DynamoDB","aws_cloudwatch_event_permission":"EventBridge","aws_budgets_budget_action":"Web Services Budgets","aws_ses_email_identity":"SES (Simple Email)","aws_datasync_agent":"DataSync","aws_lex_slot_type":"Lex Model Building","aws_elastic_beanstalk_application":"Elastic Beanstalk","aws_dataexchange_data_set":"Data Exchange","aws_internet_gateway":"VPC (Virtual Private Cloud)","aws_ses_event_destination":"SES (Simple Email)","aws_neptune_cluster_instance":"Neptune","aws_sfn_activity":"SFN (Step Functions)","aws_lambda_code_signing_config":"Lambda","aws_ssm_patch_group":"SSM (Systems Manager)","aws_elb":"ELB Classic","aws_dx_private_virtual_interface":"Direct Connect","aws_servicecatalog_portfolio":"Service Catalog","aws_opsworks_user_profile":"OpsWorks","aws_codeartifact_domain":"CodeArtifact","aws_s3_bucket_intelligent_tiering_configuration":"S3 (Simple Storage)","aws_appstream_fleet":"AppStream 2.0","aws_simpledb_domain":"SDB (SimpleDB)","aws_waf_byte_match_set":"WAF Classic","aws_backup_region_settings":"Backup","aws_securityhub_organization_configuration":"Security Hub","aws_apigatewayv2_integration":"API Gateway V2","aws_elastictranscoder_preset":"Elastic Transcoder","aws_vpc_network_performance_metric_subscription":"VPC (Virtual Private Cloud)","aws_ecr_repository_policy":"ECR (Elastic Container Registry)","aws_apprunner_vpc_connector":"App Runner","aws_backup_vault_lock_configuration":"Backup","aws_route53_traffic_policy":"Route 53","aws_s3_bucket_accelerate_configuration":"S3 (Simple Storage)","aws_spot_fleet_request":"EC2 (Elastic Compute Cloud)","aws_kendra_data_source":"Kendra","aws_kinesis_firehose_delivery_stream":"Kinesis Firehose","aws_rds_global_cluster":"RDS (Relational Database)","aws_quicksight_user":"QuickSight","aws_lex_intent":"Lex Model Building","aws_ec2_transit_gateway_multicast_group_source":"Transit Gateway","aws_iot_authorizer":"IoT Core","aws_auditmanager_control":"Audit Manager","aws_route53_resolver_dnssec_config":"Route 53 Resolver","aws_emr_instance_fleet":"EMR","aws_route53_resolver_endpoint":"Route 53 Resolver","aws_apprunner_vpc_ingress_connection":"App Runner","aws_directory_service_directory":"DS (Directory Service)","aws_opsworks_nodejs_app_layer":"OpsWorks","aws_route53_cidr_location":"Route 53","aws_redshiftserverless_endpoint_access":"Redshift Serverless","aws_ec2_fleet":"EC2 (Elastic Compute Cloud)","aws_redshift_snapshot_copy_grant":"Redshift","aws_ecr_registry_policy":"ECR (Elastic Container Registry)","aws_organizations_policy":"Organizations","aws_resourceexplorer2_view":"Resource Explorer","aws_emr_security_configuration":"EMR","aws_rds_reserved_instance":"RDS (Relational Database)","aws_network_interface":"VPC (Virtual Private Cloud)","aws_cloudfront_public_key":"CloudFront","aws_schemas_registry_policy":"EventBridge Schemas","aws_opsworks_custom_layer":"OpsWorks","aws_sagemaker_project":"SageMaker","aws_wafv2_web_acl":"WAF","aws_cloudformation_stack":"CloudFormation","aws_appstream_directory_config":"AppStream 2.0","aws_lb":"ELB (Elastic Load Balancing)","aws_fsx_openzfs_volume":"FSx","aws_shield_protection_group":"Shield","aws_ecr_pull_through_cache_rule":"ECR (Elastic Container Registry)","aws_s3_bucket_versioning":"S3 (Simple Storage)","aws_appmesh_virtual_service":"App Mesh","aws_shield_protection":"Shield","aws_default_vpc":"VPC (Virtual Private Cloud)","aws_elasticsearch_domain":"Elasticsearch","aws_opsworks_stack":"OpsWorks","aws_route53_resolver_rule":"Route 53 Resolver","aws_timestreamwrite_table":"Timestream Write","aws_route53_record":"Route 53","aws_amplify_webhook":"Amplify","aws_db_option_group":"RDS (Relational Database)","aws_load_balancer_listener_policy":"ELB Classic","aws_s3_bucket_notification":"S3 (Simple Storage)","aws_cloudwatch_event_bus":"EventBridge","aws_vpc_ipam_pool":"VPC IPAM (IP Address Manager)","aws_route53domains_registered_domain":"Route 53 Domains","aws_connect_phone_number":"Connect","aws_db_instance":"RDS (Relational Database)","aws_efs_file_system":"EFS (Elastic File System)","aws_servicecatalog_provisioned_product":"Service Catalog","aws_appautoscaling_policy":"Application Auto Scaling","aws_efs_access_point":"EFS (Elastic File System)","aws_wafregional_sql_injection_match_set":"WAF Classic Regional","aws_securityhub_member":"Security Hub","aws_networkfirewall_resource_policy":"Network Firewall","aws_fis_experiment_template":"FIS (Fault Injection Simulator)","aws_ami_launch_permission":"EC2 (Elastic Compute Cloud)","aws_grafana_workspace_saml_configuration":"Managed Grafana","aws_glue_partition_index":"Glue","aws_networkmanager_attachment_accepter":"Network Manager","aws_devicefarm_project":"Device Farm","aws_cloudwatch_event_connection":"EventBridge","aws_docdb_cluster_instance":"DocDB (DocumentDB)","aws_account_alternate_contact":"Account Management","aws_fms_admin_account":"FMS (Firewall Manager)","aws_glue_classifier":"Glue","aws_wafv2_web_acl_association":"WAF","aws_iot_policy_attachment":"IoT Core","aws_connect_instance":"Connect","aws_s3_account_public_access_block":"S3 Control","aws_launch_configuration":"Auto Scaling","aws_sagemaker_code_repository":"SageMaker","aws_datasync_location_s3":"DataSync","aws_ram_principal_association":"RAM (Resource Access Manager)","aws_default_subnet":"VPC (Virtual Private Cloud)","aws_fms_policy":"FMS (Firewall Manager)","aws_sqs_queue":"SQS (Simple Queue)","aws_inspector_assessment_target":"Inspector","aws_autoscalingplans_scaling_plan":"Auto Scaling Plans","aws_lex_bot_alias":"Lex Model Building","aws_networkmanager_connection":"Network Manager","aws_ec2_traffic_mirror_filter_rule":"VPC (Virtual Private Cloud)","aws_iam_user_login_profile":"IAM (Identity & Access Management)","aws_kendra_faq":"Kendra","aws_iot_topic_rule_destination":"IoT Core","aws_wafv2_web_acl_logging_configuration":"WAF","aws_rds_cluster_role_association":"RDS (Relational Database)"}}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
const categorize = __nccwpck_require__(4103);
const formatters = __nccwpck_require__(4666);
const lexers = __nccwpck_require__(3087);

const core = __nccwpck_require__(2186);

const main = () => {
  const dotFilePath = core.getInput("dot-file-path");
  const terraformDirPath = core.getInput("terraform-dir-path");
  const terraformStatePath = core.getInput("terraform-state-path");

  const outPutFormat = core.getInput("output-format");

  let categorizedResources = {};

  if (dotFilePath) {
    const resources = lexers.terraformGraphFile(dotFilePath);
    categorizedResources = categorize.categorize(resources);
  } else if (terraformDirPath) {
    const resources = lexers.terraformDir(terraformDirPath);
    categorizedResources = categorize.categorize(resources);
  } else if (terraformStatePath) {
    const resources = lexers.terraformStateFile(terraformStatePath);
    categorizedResources = categorize.categorize(resources);
  } else {
    core.setFailed("No input provided");
  }

  if (outPutFormat === "markdown") {
    core.setOutput(
      "categorized-resources",
      formatters.markdown(categorizedResources)
    );
  } else {
    core.setOutput(
      "categorized-resources",
      JSON.stringify(categorizedResources)
    );
  }
};

main();

exports.main = main;

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.js.map
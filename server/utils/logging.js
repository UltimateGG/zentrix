const fs = require('fs');

let currentLogFile = `./logs/${getDate().replace(/\//g, '-')}.log`;
let lastLogTime = Date.now();

// Create logs folder if it doesn't exist
if (!fs.existsSync('./logs')) fs.mkdirSync('./logs');

// Every 5 min check to make a new log
setInterval(() => {
  currentLogFile = `./logs/${getDate().replace(/\//g, '-')}.log`;
}, 5 * 60 * 1000);

const logInfo = async (msg, ...args) => pipeLog('INFO', msg, ...args);
const logWarn = async (msg, ...args) => pipeLog('WARN', msg, ...args);
const logError = async (msg, ...args) => pipeLog('ERROR/FATAL', msg, ...args);

const pipeLog = (prefix, msg, ...args) => {
  let callStack = new Error().stack.split('\n');
  let caller = callStack[3];

  // Check for linux, on windows paths have \s
  if (process.env.NODE_ENV !== 'DEVELOPMENT')
    caller = caller.replace(/\//g, '\\');

  let anonCaller = caller.split('\\')[caller.split('\\').length - 1].replace(/:[0-9]*(\)|)$/, '');
  console[getFunc(prefix)](`[${prefix}] [${anonCaller}]: ${msg}`, ...args);
  writeToLog(`[${prefix}] [${anonCaller}]: ${msg}`, ...args);
  callStack = caller = anonCaller = null;
}

const getFunc = (type) => {
  switch (type) {
    case 'INFO': return 'log';
    case 'WARN': return 'warn';
    case 'ERROR/FATAL': return 'error';
    default: return 'log';
  }
}

const writeToLog = (log, ...args) => {
  const diff = Math.round((Date.now() - (lastLogTime)) / 1000);

  fs.appendFileSync(currentLogFile, `[${getTimestamp()} D: ${diff > 60 ? Math.round(diff / 60)+'m' : diff+'s'}] ${log} ${args.map(formatArg).join(' ')}\n`);
  lastLogTime = Date.now();
}

const formatArg = (arg) => {
  if (arg instanceof Error) return arg.stack;
  if (typeof arg === 'object') return '\n' + JSON.stringify(arg, null, 2);
  return arg;
}


const getTimestamp = () => {
  const date = new Date();
  const time = String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0') + ':' + String(date.getSeconds()).padStart(2, '0');

  return `${getDate()} at ${time}`;
}

function getDate() {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  let yyyy = today.getFullYear();

  today = mm + '/' + dd + '/' + yyyy;
  return today;
}


module.exports = {
  logInfo,
  logWarn,
  logError,
  getTimestamp,
  getDate,
};

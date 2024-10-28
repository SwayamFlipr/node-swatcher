#!/usr/bin/env node

import fs from "fs";
import { spawn } from "child_process";
import parseArgs from "./parsers/cli.parser.js";
import { colorLog } from "./utils.js";
import { COLORS } from "./constants.js";

const args = process.argv.slice(2);

let currentProcess = null;
let debounceTimer = null;

const startDevelopmentServer = (namedArgs, file) => {
  if (currentProcess) {
    currentProcess.kill();
  }
  const command = namedArgs.com;
  currentProcess = spawn(command, [file], { stdio: "inherit" });
  const serverErrMsg = namedArgs?.sve ?? `Server Stopped Due To Some Error`;
  currentProcess.on("close", (exitCode) => {
    if (exitCode == 0)
      return colorLog(
        COLORS.FgGreen,
        "execution successful , waiting for changes....."
      );
    colorLog(COLORS.BgRed, `${serverErrMsg} : exitCode`);
  });
};

const chokidarBano = (namedArgs, file) => {
  fs.watch(file, (eventType, fileName) => {
    if (fileName && eventType === "change") {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        colorLog(COLORS.BgYellow, `File Changed : ${fileName}`);
        startDevelopmentServer(namedArgs, file);
      }, 1000);
    }
  });
};

const init = (namedArgs, file, flags) => {
  startDevelopmentServer(namedArgs, file);
  chokidarBano(namedArgs, file);
};

try {
  const { namedArgs, flags, file } = parseArgs(args);
  init(namedArgs, file, flags);
} catch (error) {
  colorLog(COLORS.BgRed, error.message);
}

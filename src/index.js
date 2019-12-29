#!/usr/bin/env node

const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const shell = require("shelljs");
const chalk = require("chalk");

const CURR_DIR = process.cwd();

const TEMPLATES = fs.readdirSync(path.resolve(__dirname, "../templates"));

const SKIP_FILES = [
  "node_modules",
  "bower_components",
  "yarn.lock",
  "package-lock.json",
  ".git"
];

const QUESTIONS = [
  {
    name: "project-template",
    type: "list",
    message: "Project template:",
    choices: TEMPLATES
  },
  {
    name: "project-name",
    type: "input",
    message: "Project name:",
    validate: (input) => {
      if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
      else return "Project name may only include letters, numbers, underscores and hashes.";
    }
  },
  {
    name: "install-packages",
    type: "input",
    message: "Install packages (Y/n):",
    validate: (input) => {
      if (/^(Yes|yes|Y|y|No|no|N|n)?$/.test(input)) return true;
      else return "Invalid input.";
    }
  }
]

inquirer.prompt(QUESTIONS)
  .then((answers) => {
    const projectTemplate = answers["project-template"];
    const projectName = answers["project-name"];
    const installPackages = (/^(Yes|yes|Y|y)?$/.test(answers["install-packages"])) ? true : false;
    const templatePath = path.resolve(__dirname, "../templates", projectTemplate);

    fs.mkdirSync(`${CURR_DIR}/${projectName}`);

    createNewProject(templatePath, projectName);

    installPackages && postProcess(templatePath, projectName);
  })

function createNewProject(templatePath, newProjectPath) {
  projectFiles = fs.readdirSync(templatePath);

  projectFiles.forEach(file => {
    if (SKIP_FILES.indexOf(file) > -1) return;

    const origFilePath = `${templatePath}/${file}`;
    const stats = fs.statSync(origFilePath);

    if (stats.isFile()) {
      const contents = fs.readFileSync(origFilePath, "utf8");
      const writePath = `${CURR_DIR}/${newProjectPath}/${file}`;

      fs.writeFileSync(writePath, contents, "utf8");
    } else if (stats.isDirectory()) {
      fs.mkdirSync(`${CURR_DIR}/${newProjectPath}/${file}`);

      createNewProject(`${templatePath}/${file}`, `${newProjectPath}/${file}`);
    }
  })
}

function postProcess(templatePath, projectName) {
  if (isPackageJson(templatePath)) {
    const targetPath = `${CURR_DIR}/${projectName}`;
    shell.cd(targetPath);
    let cmd = "";
    if (shell.which("yarn")) {
      cmd = "yarn";
    } else if (shell.which("npm")) {
      cmd = "npm install";
    }

    if (cmd) {
      const result = shell.exec(cmd);
    } else {
      console.log(chalk.red("No yarn or npm found. Cannot run installation."));
    }
  }
}

function isPackageJson(templatePath) {
  return fs.existsSync(`${templatePath}/package.json`);
}

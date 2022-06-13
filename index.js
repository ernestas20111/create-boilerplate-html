#!/usr/bin/env node
const fs = require('fs');
const inquirer = require('inquirer');
const path = require('path');

const encoding = 'utf8';
const internalFolderName = 'files';
const projectTypesMap = new Map([
  ['HTML', 'html'],
  ['HTML, CSS', 'html-css'],
  ['HTML, CSS, JS', 'html-css-js']
]);

const getInternalPath = (name) => {
  return path.join(__dirname, `${internalFolderName}/${name}`);
};

const getExternalPath = (name) => {
  return path.resolve(name);
};

const exitWithErrorMessage = (
  errorMessage = "Error occurred while creating a project's folder."
) => {
  console.error(errorMessage);
  process.exit(1);
};

const getFolderFilesNames = (folderName) => {
  try {
    return fs.readdirSync(getInternalPath(folderName));
  } catch (error) {
    exitWithErrorMessage('Unable to scan directory: ' + error);
  }
};

const createFolder = (folderName) => {
  try {
    fs.mkdirSync(getExternalPath(folderName));
  } catch (error) {
    if (error.code === 'EEXIST')
      exitWithErrorMessage("Project's folder with such name already exists.");
    else exitWithErrorMessage();
  }
};

const readFile = (filePath) => {
  return fs.readFileSync(getInternalPath(filePath), encoding);
};

const writeFile = (filePath, file) => {
  fs.writeFileSync(getExternalPath(filePath), file);
};

const createFile = (sourceFolderName, destinationFolderName, fileName) => {
  const sourceFilePath = `${sourceFolderName}/${fileName}`;
  const writeFilePath = `${destinationFolderName}/${fileName}`;
  const file = readFile(sourceFilePath);
  writeFile(writeFilePath, file);
};

const createFiles = (projectName, projectType) => {
  const folderName = projectTypesMap.get(projectType);
  const fileNames = getFolderFilesNames(folderName);
  for (const fileName of fileNames) {
    createFile(folderName, projectName, fileName);
  }
};

const projectTypePrompt = (projectName) => {
  const projectTypes = Array.from(projectTypesMap.keys());
  inquirer
    .prompt([
      {
        type: 'list',
        message: "Project's type: ",
        name: 'projectType',
        choices: projectTypes
      }
    ])
    .then(({ projectType }) => {
      createFolder(projectName);
      createFiles(projectName, projectType);
    })
    .catch(() => exitWithErrorMessage());
};

const projectNamePrompt = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        message: "Project's name: ",
        name: 'projectName',
        default: 'project'
      }
    ])
    .then(({ projectName }) => projectTypePrompt(projectName))
    .catch(() => exitWithErrorMessage());
};

projectNamePrompt();

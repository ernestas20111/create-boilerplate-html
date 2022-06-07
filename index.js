const fs = require('fs');
const inquirer = require('inquirer');
const path = require('path');

const encoding = 'utf8';
const internalFolderName = 'files';
const htmlFileName = 'index.html';
const cssFileName = 'index.css';
const jsFileName = 'index.js';
const projectTypes = ['HTML', 'HTML, CSS', 'HTML, CSS, JS'];

const getInternalPath = (name) => {
  return path.join(__dirname, name);
};

const getExternalPath = (name) => {
  return path.resolve(name);
};

const createFolder = (name) => {
  fs.mkdir(getExternalPath(name), (error) => {
    if (error.code === 'EEXIST') {
      console.error("Project's folder with such name already exists.");
      process.exit(1);
    } else {
      console.error("Error occurred while creating a project's folder.");
      process.exit(1);
    }
  });
};

const createFile = (folderName, fileName) => {
  const file = fs.readFileSync(
    getInternalPath(`${internalFolderName}/${fileName}`),
    encoding
  );
  fs.writeFileSync(getExternalPath(`${folderName}/${fileName}`), file);
};

const projectTypePrompt = (projectName) => {
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
      createFile(projectName, htmlFileName);
      if (projectTypes[1] === projectType || projectTypes[2] === projectType) {
        createFile(projectName, cssFileName);
      }
      if (projectType === projectTypes[2]) {
        createFile(projectName, jsFileName);
      }
    })
    .catch(() => {
      console.error('Error occurred while creating a project.');
      process.exit(1);
    });
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
    .then(({ projectName }) => {
      createFolder(projectName);
      projectTypePrompt(projectName);
    })
    .catch(() => {
      console.error('Error occurred while creating a project.');
      process.exit(1);
    });
};

projectNamePrompt();

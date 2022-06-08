const fs = require('fs');
const inquirer = require('inquirer');
const path = require('path');

const encoding = 'utf8';
const internalFolderName = 'files';
const htmlFileName = 'index.html';
const cssFileName = 'index.css';
const jsFileName = 'index.js';
const cssFileTag = '<link rel="stylesheet" type="text/css" href="index.css">';
const jsFileTag = '<script src="index.js"></script>';
const projectTypes = ['HTML', 'HTML, CSS', 'HTML, CSS, JS'];

const getInternalPath = (name) => {
  return path.join(__dirname, name);
};

const getExternalPath = (name) => {
  return path.resolve(name);
};

const exitWithErrorMessage = (errorMessage = "Error occurred while creating a project's folder.") => {
  console.error(errorMessage);
  process.exit(1);
}

const createFolder = (folderName) => {
  try {
		fs.mkdirSync(getExternalPath(folderName));
	} 
	catch(error) {
		if (error.code === 'EEXIST') exitWithErrorMessage("Project's folder with such name already exists.");
    exitWithErrorMessage();
	}
};

const readFile = (fileName) => {
  return fs.readFileSync(
    getInternalPath(`${internalFolderName}/${fileName}`),
    encoding
  );
};

const writeFile = (folderName, fileName, file) => {
  fs.writeFileSync(getExternalPath(`${folderName}/${fileName}`), file);
}

const createFile = (folderName, fileName) => {
  const file = readFile(fileName);
  writeFile(folderName, fileName, file);
};

const addTagToFile = (file, closingTagToInsertBefore, tagToBeInserted) => {
  return file.replace(closingTagToInsertBefore, '  ' + tagToBeInserted + '\n  $&');
};

const createFiles = (folderName, projectType) => {
  let htmlFile = readFile(htmlFileName);
  if (projectTypes[1] === projectType || projectTypes[2] === projectType) {
    createFile(folderName, cssFileName);
    htmlFile = addTagToFile(htmlFile, '</head>', cssFileTag);
  }
  if (projectTypes[2] === projectType) {
    createFile(folderName, jsFileName);
    htmlFile = addTagToFile(htmlFile, '</body>', jsFileTag);
  }
  writeFile(folderName, htmlFileName, htmlFile);
}

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

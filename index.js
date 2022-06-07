const fs = require('fs');
const path = require('path');

const encoding = 'utf8';
const internalFolderName = 'files';
const htmlFileName = 'index.html';
const cssFileName = 'index.css';
const jsFileName = 'index.js';

const getInternalPath = (name) => {
	return path.join(__dirname, name);
}

const createFolder = (name) => {
	fs.mkdir(getInternalPath(name), (error) => {
		if (error) {
			console.error(error);
		}
	});
}

const createFile = (folderName, fileName) => {
	const file = fs.readFileSync(getInternalPath(`${internalFolderName}/${fileName}`), encoding)
	fs.writeFileSync(getInternalPath(`${folderName}/${fileName}`), file);
}

const createFiles = (folderName) => {
	createFile(folderName, htmlFileName);
	createFile(folderName, cssFileName);
	createFile(folderName, jsFileName);
}

const projectName = 'project';
createFolder(projectName);
createFiles(projectName);
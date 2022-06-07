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

const getExternalPath = (name) => {
	return path.resolve(name);
}

const createFolder = (name) => {
	try {
		fs.mkdirSync(getExternalPath(name));
	} 
	catch(error) {
		if (error.code !== 'EEXIST') {
			throw error;
		}
	}
	
}

const createFile = (folderName, fileName) => {
	const file = fs.readFileSync(getInternalPath(`${internalFolderName}/${fileName}`), encoding)
	fs.writeFileSync(getExternalPath(`${folderName}/${fileName}`), file);
}

const createFiles = (folderName) => {
	createFile(folderName, htmlFileName);
	createFile(folderName, cssFileName);
	createFile(folderName, jsFileName);
}

const projectName = 'project';
createFolder(projectName);
createFiles(projectName);
const fs = require('fs');
const path = require('path');	

const createDirectory = () => {
	fs.mkdir(path.join(__dirname, 'project'), (error) => {
		if (error) {
			console.error(error);
		}
	});
}

const createFiles = () => {
	const htmlFile = fs.readFileSync('files/index.html', 'utf8')
	fs.writeFileSync('project/index.html', htmlFile)
	const cssFile = fs.readFileSync('files/index.css', 'utf8')
	fs.writeFileSync('project/index.css', cssFile)
	const jsFile = fs.readFileSync('files/index.js', 'utf8')
	fs.writeFileSync('project/index.js', jsFile)	
}

createDirectory();
createFiles();
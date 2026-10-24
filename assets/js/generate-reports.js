// This is a script that automatically genereated JSON list of the reports based on files already in ./assets/reports
//This script prevents from manually typing the whole JSON file.

const fs = require('fs'); //Require (import) the file-system module (helps with reading directories, read/write files, etc...)

const reports = fs.readdirSync('./assets/reports'); //Read the contents of ./assets/reports directory, returns list of file names.

const list = reports.map(f => { //map returns a new array (list of file metadata objects) based on the files found in the directory with readdirSync.
    const s = fs.statSync('./assets/reports/'+f); //statSync gets metadata of each file in reports such as size, etc...
    return { //Return an object with following fields
        'title': f.replace('.pdf', '').replace(/[-_]/g, ' '), //Format how file titles will be displayed
        'file': './assets/reports/'+f, //Field that displays where report is located
        'size': s.size //File size
    };
});

fs.writeFileSync('./assets/reports.json', JSON.stringify(list, null, 2));
console.log(list);
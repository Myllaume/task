const fs = require('fs')
    , moment = require('moment')
    , yamlEditor = require('js-yaml')
    , config = require('./verifconfig').config
    , readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout }) // activate terminal questionnaire
    , validStages = config.stages;

(async () => {
    let metas = {};

    // questions :
    
    try {
        metas.title = await new Promise((resolve, reject) => {
            rl.question('title (obligatory) ? ', (answer) => {
                if (answer === '') {
                    reject('Title is obligatory'); }

                resolve(answer);
            })
        })
    
        metas.stage = await new Promise((resolve, reject) => {
            rl.question('stage (default = ' + validStages[0] + ') ? ', (answer) => {
                if (answer === '') {
                    answer = validStages[0]; }
                else if (validStages.indexOf(answer) === -1) {
                    reject('Unknown type. Add it to config.yml beforehand.'); }

                resolve(answer);
            })
        })
    
        metas.category = await new Promise((resolve, reject) => {
            rl.question('category (obligatory) ? ', (answer) => {
                if (answer === '') {
                    reject('Category is obligatory'); }

                resolve(answer);
            })
        })
    
        metas.end_date = await new Promise((resolve, reject) => {
            rl.question('end date (format AAAA-MM-DD) ? ', (answer) => {
                resolve(answer);
            })
        })
    
        genMdFile(metas);
    } catch(err) {
        console.error('\x1b[31m', 'Err.', '\x1b[0m', err);
    }
    
    rl.close()
})();

function genMdFile(metas) {
    metas.id = Number(moment().format('YYYYMMDDHHmmss'));
    let content = yamlEditor.safeDump(metas);

    content = '---\n' + content + '---\n\n';

    const fileName = `${metas.category} - ${metas.title} - ${metas.id}`;

    fs.writeFile(config.files_origin + fileName + '.md', content, (err) => {
        if (err) { return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'register record file : ' + err) }
        console.log('\x1b[32m', 'record saved', '\x1b[0m', `: ${fileName}.md`);

        require('./modelize');
    });
}
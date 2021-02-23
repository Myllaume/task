const fs = require('fs')
    , yamlFrontmatter = require('yaml-front-matter')
    , moment = require('moment')
    , path = require('path')
    , config = require('./verifconfig').config;

let content = '';

const requiredMetas = ['id', 'title', 'stage', 'category', 'end_date']
    , validStages = config.stages
    , files = fs.readdirSync(config.files_origin, 'utf8') // files name list
    .filter(fileName => path.extname(fileName) === '.md') // throw no .md file
    .map(function(file) { // file analysis
        const fileName = file;

        file = fs.readFileSync(config.files_origin + file, 'utf8');
        // yamlfontmater extract = file metas
        file = yamlFrontmatter.loadFront(file);
        // file content extract
        delete file.__content;
        let metas = file;

        metas.fileName = fileName;
        metas.end_date = ((!metas.end_date) ? 'ND' : moment(metas.end_date).format('YYYY-MM-DD'));

        return metas;
    })
    .filter(function(file) {
        for (const metaName of requiredMetas) {
            if (!file[metaName]) {
                return console.error('\x1b[33m', 'Warn.', '\x1b[0m', `File ${file.fileName} throw out : no valid ${metaName}`);
            }
        }

        if (validStages.indexOf(file.stage) === -1) {
            return console.error('\x1b[33m', 'Warn.', '\x1b[0m', `File ${file.fileName} throw out : no valid stage`);
        }

        return true;
    });

for (const stage of validStages) {
    content += `# ${stage}\n`

    let currentStageFiles = files
        .filter(file => file.stage === stage)
        .sort(function(a, b) {
            if (a.end_date > b.end_date) {
                return 1;
            }
            if (a.end_date < b.end_date) {
                return -1;
            }
        })

    for (const file of currentStageFiles) {
        content += `\n- [[${file.id}]] *${file.title}* ‹${file.category}› ${file.end_date}`;
    }

    content += '\n\n';
}

fs.writeFile(config.files_origin + '_index.md', content, (err) => { // Export in import folder
    if (err) {return console.error('Err.', '\x1b[0m', 'write Task file : ' + err)}
    console.log('\x1b[34m', 'Task generated', '\x1b[0m', `(${files.length} tasks)`)
});
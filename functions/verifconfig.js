const fs = require('fs')
    , yamlEditor = require('js-yaml');

// Write config file if not exist

const baseConfig = {
    files_origin: '',
    stages: ['à faire', 'en cours', 'terminé']
};

if (!fs.existsSync('config.yml')){

    const configYml = yamlEditor.safeDump(baseConfig); // JSON -> YAML

    console.log('\x1b[32m', 'Create config.yml file', '\x1b[0m');

    fs.writeFileSync('config.yml', configYml, (err) => {
        if (err) { return console.error('\x1b[31m', 'Err.', '\x1b[0m', 'write config.yml file : ' + err) }
    });

    process.exit();
}

// Read config

const config = yamlEditor.safeLoad(fs.readFileSync('config.yml', 'utf8'));

// Valid config values

let errors = [];

for (const prop in baseConfig) {
    if (config[prop] === undefined || config[prop] === null || config[prop] === '') {
        errors.push(prop);
    }
}

if (errors.length !== 0) {
    // error listing
    console.error('\x1b[31m', 'Err.', '\x1b[0m', 'The config is not complete. Check or delete.');
    console.error('\x1b[37m', 'About props : ' + errors.join(', '), '\x1b[0m');
    process.exit();
}

if (!fs.existsSync(config.files_origin)) {
    console.error('\x1b[31m', 'Err.', '\x1b[0m', 'You must specify a valid folder path to your Markdown files database in config file.');
    process.exit();
}

exports.config = config;
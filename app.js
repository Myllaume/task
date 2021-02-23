require('./functions/verifconfig');

const args = process.argv.slice(2);

switch (args[0]) {
    case 'add':
        require('./functions/record');
    break;

    case undefined:
        require('./functions/modelize');
    break;

    default:
        console.log('Unknow command "' + args.join(' ') + '"');
    break;
}
#!/usr/bin/env node
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
const shell = require('shelljs');

function changeNameInPhpFiles({slug,rootNamespace}){
    let slugWithUnderscore = slug.replace('-', '_' );
    let originalNamespace = 'WordPressPlugin';
    function sed(file) {
        shell.sed('-i',  originalNamespace, rootNamespace, file);
        shell.sed( '-i', "wordpress-plugin",  slug ,file);
        shell.sed( '-i', "wordpress_plugin",  slugWithUnderscore ,file);
    }
    shell.mv( 'wordpress-plugin.php', `${slug}.php` );
    sed(`${slug}.php`);
    shell.sed('-i', originalNamespace, rootNamespace, 'composer.json');
    shell.ls('**/*.php').forEach(sed);
}

function readme(){

}


readline.question(`What is your plugin's slug? Used for translation domain, main file name, etc.`, slug => {
    slug = slug.replace(/\W/g, '');
    readline.question(`Root Namespace`, rootNamespace => {
        changeNameInPhpFiles({slug,rootNamespace});
        readme();
        readline.close()
    });

});
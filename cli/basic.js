#!/usr/bin/env node
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
const shell = require('shelljs');
const mdSedFactory = require( './lib/mdSedFactory');
const phpSedFactory = require( './lib/phpSedFactory');

readline.question(`What is your plugin's slug? Used for translation domain, main file name, etc.`, slug => {
    slug = slug.replace(/\W/g, '').toLowerCase();
    readline.question(`Plugin name?`, pluginName => {
        readline.question(`Github username?`, githubUserName => {
            const mdSed = mdSedFactory({pluginName,slug,githubUserName});
            let phpSed = phpSedFactory({slug})
            //Copy everything in pages to new dir
            shell.cp( '-R', 'pages', slug );
            //Copy readme basic in place of package README
            shell.cp( '_README_BASIC.md', `${slug}/README.md`);
            //And rename things.
            mdSed( `${slug}/README.md` );
            //Copy main plugin file
            shell.cp( 'wordpress-plugin.php', `${slug}/${slug}.php`);
            //And rename things.
            phpSed( `${slug}/${slug}.php` );
            shell.sed('-i', "PLUGIN_NAME", pluginName,  `${slug}/${slug}.php`);
            shell.mkdir( `${slug}/.github`);
            shell.mkdir( `${slug}/.github/workflows`);
            //Copy JS test action
            shell.cp( '.github/workflows/test-js.yml', `${slug}/.github/workflows/test-js.yml`);
            //Replace slug in entry point
            shell.sed('-i', "wordpress-plugin", slug,  `${slug}/admin/index.js`);
            //Build in the right directory
            shell.sed('-i', "../build", "/build",  `${slug}/webpack.config.js`);
            //delete import test
            shell.rm( `${slug}/__tests__/test-import.js` );
            readline.close()
        });
    });
});
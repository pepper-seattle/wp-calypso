/**
 **** WARNING: No ES6 modules here. Not transpiled! ****
 */
/* eslint-disable import/no-nodejs-modules */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */

const runAll = require( 'npm-run-all' );

const args = process.argv.slice( 2 );

const argsToCommands = {
	'--build': 'build:*',
	'--dev': 'dev:*',
	'--sync': 'wpcom-sync',
};

const commands = args.map( arg => argsToCommands[ arg ] ).filter( val => !! val );

console.log( `Running the following commands: ${ commands.toString() }` );

runAll( commands, { parallel: true } ).then( () => {
	'Finished running commands!';
} );

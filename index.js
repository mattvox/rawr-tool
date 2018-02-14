#!/usr/bin/env node

const execSync = require('child_process').execSync
const program = require('commander')

// TO BE REMOVED, SOURCE WILL BE SET BY USER IN CONFIG
const source = 'git@github.com:mattvox/rawr-template-redux.git'

program
  .version('0.1.0')
  .description('Rawr easily and quickly bootstraps new React projects from customized templates')

program
  .command('create <appName>')
  .alias('-c')
  .description('Create a new React project from template')
  .action((appName) => {
    createApp(source, appName)
  })

program.parse(process.argv)


/* Actions */

function createApp (source, dest) {
  cloneTemplate(source, dest).then(installNodeModules(dest))
}

function cloneTemplate (source, dest) {
  return new Promise(function (resolve, reject) {
    execSync(`git clone ${source} ${dest}`, { stdio: [0, 1, 2] })
  })
}

function installNodeModules (appPath) {
  execSync(`npm install --prefix ${appPath}/`, { stdio: [0, 1, 2] })
}

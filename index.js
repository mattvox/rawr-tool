#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');
const program = require('commander');
const inquirer = require('inquirer');
const jsonfile = require('jsonfile');

const CURRENT_DIR = process.cwd();
const CONFIG_FILE = jsonfile.readFileSync(`${CURRENT_DIR}/config.json`);
const CHOICES = CONFIG_FILE.templates;

const QUESTIONS = [
  {
    name: 'template-choice',
    type: 'list',
    message: 'Which project template would you like to generate?',
    choices: CHOICES,
  },
  {
    name: 'project-name',
    type: 'input',
    message: 'Project name:',
    validate: input => (
      /^([A-Za-z\-_\d])+$/.test(input) || 'Project name may only include letters, numbers, underscores and hashes.'
    ),
  },
];

program
  .version('0.1.0')
  .description('Rawr easily and quickly bootstraps new React projects from customized templates');

program
  .command('create')
  .alias('-c')
  .description('Create a new React project from template')
  .action(() => {
    inquirer.prompt(QUESTIONS)
      .then((answers) => {
        const source = answers['template-choice'];
        const name = answers['project-name'];
        console.log(name);
        const path = `${CURRENT_DIR}/${name}`;
        console.log(path);

        createApp(source, path, name);
      });
  });

program.parse(process.argv);


/* Actions */

function createApp(source, path, name) {
  cloneTemplate(source, name)
    // .then(installNodeModules(path))
    .then(removeFilesNotNeededFromTemplate(path))
    .catch(reason => console.log(reason.message));
}

function cloneTemplate(source, name) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(name)) {
      reject(new Error('Folder already exists'));
    }

    else {
      try {
        execSync(`git clone ${source} ${name}`, { stdio: [0, 1, 2] });
        resolve(console.log('Repo cloned successfully!'));
      }

      catch (error) {
        reject(new Error('An error occurred', error));
      }
    }
  });
}

function removeFilesNotNeededFromTemplate(appPath) {
  if (fs.existsSync(`${appPath}/.git`)) {
    execSync(`rm -rf ${appPath}/.git`, { stdio: [0, 1, 2] });
  }

  if (fs.existsSync(`${appPath}/yarn.lock`)) {
    execSync(`rm ${appPath}/yarn.lock`, { stdio: [0, 1, 2] });
  }

  if (fs.existsSync(`${appPath}/package-lock.json`)) {
    execSync(`rm ${appPath}/package-lock.json`, { stdio: [0, 1, 2] });
  }
}

// function installNodeModules(appPath) {
//   execSync(`npm install --prefix ${appPath}/`, { stdio: [0, 1, 2] });
// }

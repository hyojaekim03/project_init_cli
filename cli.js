#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const shell = require('shelljs');
const fs = require('fs');

const program = new Command();

program
  .name('init-boilerplate')
  .description('CLI to generate backend and frontend boilerplates')
  .version('1.0.0');

program
  .command('create')
  .description('Create new frontend and backend boilerplate')
  .option('-f, --frontend', 'Create React + TypeScript frontend')
  .option('-b, --backend', 'Create Flask backend')
  .action((options) => {
    if (options.frontend) {
      console.log(chalk.blue('Creating Frontend...'));
      createFrontend();
    }

    if (options.backend) {
      console.log(chalk.green('Creating Backend...'));
      createBackend();
    }

    if (!options.frontend && !options.backend) {
      console.log(chalk.yellow('No option provided. Use --frontend or --backend'));
    }
  });

program.parse(process.argv);

function createFrontend() {
  if (fs.existsSync('frontend')) {
    console.log(chalk.red('Frontend directory already exists.'));
    return;
  }

  shell.exec('npx create-react-app frontend --template typescript');
  console.log(chalk.green('Frontend initialized successfully!'));
}

function createBackend() {
  if (fs.existsSync('backend')) {
    console.log(chalk.red('Backend directory already exists.'));
    return;
  }

  shell.mkdir('backend');
  shell.cd('backend');
  shell.exec('python -m venv venv');
  shell.exec('source venv/bin/activate && pip install flask');
  fs.writeFileSync(
    'app.py',
    `from flask import Flask
    
app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello, world!'

if __name__ == '__main__':
    app.run(debug=True)
`
  );

  console.log(chalk.green('Backend initialized successfully!'));
}

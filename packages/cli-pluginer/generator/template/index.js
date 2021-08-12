const inquirer = require('inquirer');
let promptOptions = require('./prompt.js');
const ejs = require('ejs')
const fs = require('fs')
module.exports = async (api) => {
  let answer = await inquirer.prompt(promptOptions)
  api.render(`./template/${answer.name}/`)
}
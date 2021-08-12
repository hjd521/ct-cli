const inquirer = require('inquirer');
let promptOptions = require('./prompt.js');
const ejs = require('ejs')
const fs = require('fs')
module.exports = async (api) => {
  let answer = await inquirer.prompt(promptOptions)
  console.log(answer)
  answer = JSON.parse(JSON.stringify(answer))
  api.render(`./template/`, answer)
}

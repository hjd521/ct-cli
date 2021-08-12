const inquirer = require('inquirer');
let promptOptions = require('./prompt.js');
module.exports = async (api) => {
  let answer = await inquirer.prompt(promptOptions)
  api.render(`./template/${answer.name}/`)
}

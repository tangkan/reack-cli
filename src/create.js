
import axios from 'axios'
// 交互式命令inquirer
import inquirer from 'inquirer';
import path from 'path';
import degit from 'degit'
import fs from 'fs-extra'
import { spinFn } from './utils.js';

// 项目模板列表名
// 目前仅支持react的模板
const REPOLISTNAME = ['react-template']

// 获取项目列表
const fetchRepoList = async () => {
  const { data } = await axios.get('https://api.github.com/users/tangkan/repos');
  return data.map(item => item.name) || [];
}

// clone repo
const downloadRepo = (repoName, projectName) => {
  // git@github.com:tangkan/react-template.git
  const targetDir = path.join(process.cwd(), projectName)
  const emitter = degit(`https://github.com/tangkan/${repoName}`)
  emitter.clone(targetDir).then(() => {
    console.log('  Done Now run:')
    console.log(`  cd ${projectName}`)
    console.log(`  pnpm i`)
    console.log(`  pnpm run dev`)
  }).catch(() => {
    console.log('  download failed please try again...')
  }).finally(() => {
  })
}

export default async (projectName) => {
  // 获取项目的所有模板
  const repos = await spinFn(fetchRepoList, 'Loading...')();
  const { repo } = await inquirer.prompt({
    name: 'repo', // 选择后的项目名
    type: 'list',
    message: 'please choise a template to create project',
    choices: repos.filter(name => REPOLISTNAME.includes(name))
  })

  // 判断是否有相同的项目名存在
  if (fs.existsSync(projectName)) {
    // 询问用户是否覆盖
    const { action } = await inquirer.prompt({
      name: 'action',
      type: 'list',
      message: 'Target directory already exists Pink an action:',
      choices: [
        { name: 'Overwrite', value: true },
        { name: 'Cancel', value: false },
      ]
    })

    if (action) {
      // 删除后再做下载操作
      await fs.remove(projectName);
      downloadRepo(repo, projectName)
    } else {
      console.log('Operation cancelled')
    }
  } else {
    downloadRepo(repo, projectName)
  }
}
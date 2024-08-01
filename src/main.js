
// 指令集
import { Command } from 'commander';
// 路径
import path from 'path';
import { cyan } from 'kolorist';
import { fileURLToPath, pathToFileURL } from 'url';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const program = new Command();

const helpMessage = `\
Usage: create-vite [OPTION]... [DIRECTORY]

Create a new Vite project in TypeScript.
With no arguments, start the CLI in interactive mode.

Options:
  -t, --template NAME        use a specific template

Available templates:
${cyan('react-template       react+ts')}`

export const main = () => {
  // 定义命令集
  const mapActions = {
    create: {
      alias: 'c',
      description: 'create a new project',
    },
    config: {
      alias: 'conf',
      description: 'config project variable',
    },
    '*': {
      alias: '',
      description: 'command not found',
    }
  }

  // 配置命令
  Reflect.ownKeys(mapActions).forEach(action => {
    program.command(action)
      .alias(mapActions[action].alias)
      .description(mapActions[action].description)
      .action(async () => {
        // 访问不到对应的命令
        if (action === '*') {
          console.log(mapActions[action].description)
        } else {
          const commandDir = pathToFileURL(path.join(__dirname, `${action}.js`))
          import(commandDir).then(module => {
            module.default(...process.argv.slice(3));
          });
        }
      })
  });


  // 监听用户help事件
  program.on('--help', () => {
    console.log(helpMessage);
  })

  // program.version(version).parse();
  program.parse();
}
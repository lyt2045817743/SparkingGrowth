const { exec } = require('child_process');
const { projects } = require('./constant/index.cjs')

// 启动每个项目
function startProject(project) {
  return new Promise((resolve, reject) => {
    exec(`cd packages/${project.name} && pnpm serve`, (error, stdout, stderr) => {
      if (error) {
        reject(`Error starting ${project.name}: ${error.message}`);
        return;
      }
      console.log(`Started ${project.name}`);
      resolve();
    });
  });
}

// 安装每个项目的依赖
function installProject(project) {
  return new Promise((resolve, reject) => {
    exec(`cd packages/${project.name} && pnpm install`, (error, stdout, stderr) => {
      if (error) {
        reject(`Error installing dependencies for ${project.name}: ${error.message}`);
        return;
      }
      console.log(`Dependencies installed for ${project.name}`);
      resolve();
    });
  });
}

// 顺序执行安装和启动
async function installAndStartProjects() {
  const args = process.argv;
  const isInstallBeforeStart = args.includes('--install');

  try {
    if (isInstallBeforeStart) {
      // 依次安装每个项目
      for (const project of projects) {
        console.log(`start installing dependencies for ${project.name}...`);
        await installProject(project);
      }
      console.log("all projects' dependencies installed");
    }

    // 依次启动每个项目
    for (const project of projects) {
      console.log(`starting the ${project.name}...`);
      Promise.all(
        projects.map((project) => startProject(project))
      )
        .then(() => {
          console.log('All projects started successfully!');
        })
        .catch((error) => {
          console.error(error);
        });
    }

  } catch (error) {
    console.error(error);
  }
}

// 执行安装和启动
installAndStartProjects();
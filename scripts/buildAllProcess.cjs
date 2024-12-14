const { exec } = require('child_process');
const { projects } = require('./constant/index.cjs')

// 构建每个项目
function buildProject(project) {
  return new Promise((resolve, reject) => {
    exec(`cd packages/${project.name} && pnpm build`, (error, stdout, stderr) => {
      if (error) {
        reject(`Error building ${project.name}: ${error.message}`);
        return;
      }
      console.log(`build ${project.name} finish!`);
      resolve();
    });
  });
}

async function buildProjects() {
  try {
    // 依次构建每个项目
    for (const project of projects) {
      console.log(`start to build ${project.name}...`);
      Promise.all(
        projects.map((project) => buildProject(project))
      )
        .then(() => {
          console.log('All projects has built successfully!');
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
buildProjects();
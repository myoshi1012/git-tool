const git = require("simple-git/promise");
const fs = require("fs");
const path = require("path");

const config = require("../config");
const localPath = process.env.REPO_PATH;

const clone = (cli, repoName, baseURL) =>
  cli.clone(baseURL + repoName, path.join(localPath, repoName));

const main = () => {
  if (!localPath) {
    console.log("REPO_PATHを設定してね");
  }
  if (!fs.existsSync(localPath)) {
    fs.mkdirSync(localPath, { recursive: true });
  }
  const repos = config.repos.filter(
    repo => !fs.existsSync(path.join(localPath, repo))
  );
  const cli = git(localPath);
  const promises = repos.map(repo => clone(cli, repo, config.baseURL));
  Promise.allSettled(promises)
    .then(repo => console.log(repo, "clone finished"))
    .finally(() => console.log("done"));
};

main();

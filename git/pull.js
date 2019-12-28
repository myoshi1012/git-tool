const git = require('simple-git/promise')
const path = require('path')
const config = require('../config')

const localPath = process.env.REPO_PATH

const pull = localRepo =>
  new Promise((resolve, reject) => {
    const cli = git(localRepo)
    cli
      .pull()
      .then(() => resolve(localRepo))
      .catch(err => reject(err, localRepo))
  })

const resetHard = localRepo =>
  new Promise((resolve, reject) => {
    const cli = git(localRepo)
    cli
      .reset('hard')
      .then(() => resolve(localRepo))
      .catch(err => reject(err, localRepo))
  })

const main = () => {
  if (!localPath) {
    console.log('REPO_PATHを設定してね')
  }

  const localRepos = config.repos.map(repo => path.join(localPath, repo))
  const promises = localRepos.map(repo => resetHard(repo).then(localRepo => pull(localRepo)))
  Promise.allSettled(promises).then(data => console.log(data))
}

main()

# CI/CD: 利用 GitHub Actions 完成持续集成与持续交付

CI/CD 是 continuous integration and continuous delivery 的缩写，中文意思为持续集成与持续交付。持续集成指的是，在代码发生变动时，自动构建代码，执行编译、测试等命令；而持续交付意味着代码的变动自动地交付到用户端。 CI/CD 在现代软件开发过程中扮演着非常重要的角色，一方面强制性的构建和测试可以保证代码的可靠性，而自动化的过程则可以将程序员从机械性的手动构建和测试中解放出来，使得我们只需要把注意力集中在编写代码上；另一方面，持续交付可以把变动更快地展现出来，便于更快的迭代，符合敏捷开发的理念。

常用的 CI/CD 工具有 [Travis](https://travis-ci.com), [Jenkins](https://jenkins.io/zh/)，他们一般都会和 GitHub 紧密地合作来完成 CI/CD 。其基本原理是，当检测到代码仓库发生变动时，如有新的 pull request 或者发生了分支合并，自动地拉取代码然后在配置好的环境中执行预先设定的一系列命令，然后把执行结果反馈到对应的 issue 中去。不过最近 GitHub 开始公开测试其官方的 CI/CD 工具，[GitHub Actions](https://github.com/features/actions)，这方面的中文教程还比较匮乏，因此在这里我将借用给 FDU-MSC/forum 配置 CI/CD 的机会分享一下 GitHub Actions 的使用方法。

为了使用 GitHub Actions ，你首先需要为你的代码仓库开启这项功能（目前因为是试用状态），戳 [Sign up for the beta](https://github.com/features/actions)，然后根据指示操作，完成之后你会发现项目标签栏中出现了 Actions 一栏。点进去就可以开始配置了。

其实整个配置就只有一个文件：`deploy_master.yml`，放在根目录下的 `.github/workflows` 文件夹下。该文件构成一个 workflow，即在满足特定条件下运行的一系列脚本，其内容如下：

```yml
name: CI
on:
    push:
    branches:
    - master

jobs:
    build:
    runs-on: ubuntu-18.04
    steps:
    - uses: actions/checkout@v1
    - name: Show python version
        run: |
        python3 --version
        pip3 --version
        alias python=python3
        alias pip=pip3
    - name: Install mkdocs and theme
        run: |
        sudo apt-get install python3-setuptools
        pip3 install wheel
        pip3 install mkdocs
        pip3 install mkdocs-material
    - name: Build site
        run: python3 -m mkdocs build
    - name: Deploy
        uses: peaceiris/actions-gh-pages@v2.4.0
        env:
            PERSONAL_TOKEN: ${{ secrets.PERSONAL_TOKEN }}
            PUBLISH_BRANCH: gh-pages
            PUBLISH_DIR: ./docs
```

该文件的描述基于 `yml` 语法。

首先，这个 workflow 的名字为 `CI`。

`on` 用于描述触发条件，这里可以看到，触发条件被设置为当 `master` 分支上有 `push` 发生时，可以理解为 `master` 上有更新。

随后，`jobs` 用来描述一些并发的工作，他们会在 workflow 被触发后同时运行。在本 workflow 中只有一个 job 需要被执行，其名字为 `build`。

进入 `build` 这个 job，第一件事情是指定这个 `job` 的运行环境，Github Actions 提供了 Windows/MacOS/Ubuntu 的环境可供选择，这里我们使用 `ubuntu-18.04`。CI 本质上就是在条件满足后自动地执行某些命令，因此指定环境是必要的。

`steps` 描述完成一个 job 所需的步骤，顾名思义是一个接一个完成的步骤。

1. 第一个步骤是 `uses: actions/checkout@v1`。这是 GitHub Actions 官方提供的一个操作，功能是 checkout 当前代码仓库的代码到执行环境中（记得前面设置了 ubuntu 作为执行环境）
2. 然后是 `Show python version`，这里展示如何运行 `bash` 命令
3. 随后是 `Install mkdocs and theme` 安装 mkdocs 和我们使用的主题
4. `Build site` 构建站点
5. 最后一步是把构建结果推送到 GitHub Pages 上去，从而更新网页，这里使用了 peaceiris 开源的一个发布工具。和使用官方提供的 checkout 一样，只需要用 `uses` 指明使用的 actions 的名字和版本就可以了。下面的 `env` 用来配置一些参数，具体可以看这个 actions 的文档。

以上就完成了配置。每当 master 更新时，该 workflow 便会自动触发，重新构建本网站，然后发布到 github pages 上去，从而可以在网页上看到更新的结果。

更高阶的 GitHub Actions 的使用。可以配置一个 Docker 镜像，然后每次拉取镜像来执行构建，这样一来 GitHub Actions 做的事情便没有任何限制了。这部分内容请自行查阅文档~

修改。
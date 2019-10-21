
# 如何贡献本站

## 注册 github 帐号参与讨论

Github 是一个托管由 git 管理的项目的地方。

众所周知程序开发过程中会经历很多次的版本迭代和代码改动，因此我们需要一个工具来帮忙记录程序变动，git 便是一个这样的软件版本控制软件（fun facts: git 和 Linux 操作系统共享一个爸爸——Linus）。

而 GitHub 便是目前最大的项目托管平台，是代码开源运动的主力战场。很多程序员都愿意把自己的项目开源在 github 上以吸♂引其他程序员的围观和合作。

本站也不例外，虽然主要是以内容为主的静态站点，但内容都通过 MIT License 开源在 github 上。

当你注册好 github 帐号后，你就可以在本站下方的评论区留言啦！参与讨论是贡献本站最简单的方式~

## 提交 Pull Request 帮助修改文章

如果你发现网站上的文章存在

* 错别字（ typo ）
* 描述不清楚
* 内容不完善
* 等其他你认为可以被改善的地方

你可以点击页面右上角的「铅笔」符号从而编辑修改文章内容。注意本站点的文章都是使用 markdown 语法书写，在改动之前你可能需要[学习一下 markdown 写作规范]([$base_url$]/markdown)。

### 在 github 上协作的基本流程

一般而言你需要先在你的帐号创建本代码仓库的一个副本，因为只有仓库拥有者才能直接修改仓库内容（出于安全考虑）。当你点击上面的修改符号的时候，github 会为你自动创建本代码仓库的一个副本。

然后你可以尽情地在你自己创建的代码仓库下做修改，修改之后通过名为 `commit` 的操作把你的修改提交到 git 历史中去。这时，你修改后的代码仓库会比我们管理的代码仓库有所更新，这个时候你就可以发起一次 pull request。

所谓 pull request 就是请求将你的改动合并到我们管理的代码仓库中去，随后我们会阅读你的改动，如果我们认为你的改动有效我们就会同意你的请求，将你的 pull request 合并到主代码仓库中来，随后自动构建和自动部署会被触发，你的改动就会被呈现在网站上！

这样你就完成了一次有分量的贡献，感谢！

### 使用 git 在本地进行修改

如果你要作出较大规模的改动，仅仅在网页端编辑就有些捉襟见肘，我们推荐把本网站的源代码下载到本地，安装配置编译环境，并使用 VSCode 对本站进行编辑，然后使用 git 将你的改动提交到上游来。

下载本网站代码以及在本地构建的方法，请参考 [mkdocs 简介]([$base_url$]/build/mkdocs-intro)。

### 改动历史冲突的解决方法

使用 git 进行多人协作时，想象这样一个场景。A 和 B 一同在为本站贡献内容，在某一时刻他们都 fork 了原仓库，获得了各自的两个副本，这时这两个副本仓库的历史是同步的。

然而可能由于 A 的改动较少，比 B 先提交了 pull request 并且她的提交被并入了主代码库，这时 B 的副本历史就落后于主代码库了。

当 B 完成了她的修改，准备提交 pull request 时，问题就来了， B 的改动中并没有反映出 A 的改动，这样一来 B 的副本库的历史与主代码库的历史就不兼容了。特别是当 A 和 B 改动了同一个文件，甚至是同一段内容时，这个问题就更加严重。

解决方案是，B 在提交 pull request 的时候再次拉取主仓库代码，将此时的主代码的改动历史并入到她的副本中去，解决掉冲突，然后再次提交修改，这样就相当于把 B 的改动接在 A 的后面。

具体在实践中遇到的问题可能会更加复杂，如果有遇到任何问题，欢迎在评论区留言。

TODO: 我们会尽快完善这一部分内容，提供命令和图片解释。如果你知道怎么做，欢迎贡献这部分内容！

## 提交建议

如果你对网站的内容、结构、形式等任何地方有建议，可以在本站的 [issue 区](https://github.com/fdu-msc/forum/issues)提交一个 issue 。如果你有能力去实现这个建议，我们会更加欢迎你的贡献的！
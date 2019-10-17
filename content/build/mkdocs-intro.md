
mkdocs 是用 python 编写的文档生成器，我们也可以使用它来构建静态网站，用来分享信息。同时利用 [utterance](https://github.com/utterance/utterances) 我们可以为网站页面添加评论功能，从而可以实现讨论的功能。

## 环境搭建

为了使用 `mkdocs` 构建本站，你需要配置好 python 环境，并安装 `mkdocs`。

推荐使用 `anaconda` 来管理环境。

!!! note "python 环境配置"
    TODO: 添加 python 安装的教程，包括配置清华源

在配置好 python 环境后，你就可以安装 `mkdocs` 和对应的主题了，

```bash
conda create -n mkdocs
conda activate mkdocs
conda install pip
# 上述三步是可选的，用 anaconda 新建一个名为 mkdocs 的环境，并激活它，然后为其安装 pip （ python 的包管理器）
pip install mkdocs
pip install mkdocs-material
```

这两步完成后（对的，实际上就只有两步，安装 `mkdocs` 和 `mkdocs-material` 就行了），你就可以构建本网站了。

如果遇到任何问题或者想知道更多，可以参考 mkdocs 的[文档](https://www.mkdocs.org/#installation)。

## 构建本站并在本地预览

首先你需要把网站的源代码从 GitHub 上扒到你的电脑上。本网站的所有内容都开源在 GitHub 上：https://github.com/fdu-msc/forum

```
git clone https://github.com/fdu-msc/forum.git
```

扒到本地之后，你就可以在本地构建了

```
cd forum
mkdocs serve -a localhost:9999
```

然后网站就会 host 在你本地的服务器上，通过 [http://localhost:9999](http://localhost:9999) 即可访问。

当你作出任何改动之后，在提交之前，请确保你改动之后的结果能在本地通过编译，即运行 `mkdocs build` 不出现报错信息。



## mkdocs 主题

我们使用 [mkdocs-material](https://squidfunk.github.io/mkdocs-material/) 作为网站的主题。关于该主题的配置与使用，请参考[链接](https://squidfunk.github.io/mkdocs-material/)

## 文件结构

mkdocs 的配置文件为 `/mkdocs.yaml`, 本网站使用非默认的配置，所有的内容文档存放在 `/content/` 文件夹下，内容文档使用 [`markdown` 语法]([$base_url$]/share/markdown)进行编写。




## 安装 git

请参考

* [官网下载](https://git-scm.com/downloads)
* [廖雪峰：安装 Git](https://www.liaoxuefeng.com/wiki/896043488029600/896067074338496)

安装好 git 之后必须完成的两步

1. 配置好你的用户名和邮箱，用来 identify 改动的作者
    ```bash
    $ git config --global user.name "Your Name"
    $ git config --global user.email "email@example.com"
    ```
2. 使用密钥访问 GitHub，在把代码 push 到 GitHub 上时验证你的身份
   1. 虽然你可以用 https 途径每次输入用户名和密码来验证，但是比较麻烦（除非你比较能忍）
   2. 更推荐的方法是配置 ssh 访问，
      2. 官方说明：[Connecting to GitHub with SSH](https://help.github.com/en/articles/connecting-to-github-with-ssh)

## 配置 ssh 密钥访问 GitHub

MacOS 和 Linux 一般都自带 `ssh-keygen`，因此可以直接输入此命令生成密钥，然后连续三次回车即可。对于 Windows 平台，在按上面的步骤安装好 git 后会自带一个 git bash ，似乎在 git bash 中也带有 `ssh-keygen` ，请 windows 用户帮忙验证这一点（疯狂暗示 contribute ）。

这个命令会在 `~/.ssh/` 目录下生成两个文件，我们关心的是 `~/.ssh/id_rsa.pub` 的内容，这个文件的内容可以用来验证你的身份（好奇的话，可以搜索**非对称加密**），我们需要把这个文件添加到 GitHub 中去。

请参考[这篇文章](https://juejin.im/post/5ac0a382f265da238533012d)的后半部分，完成添加。

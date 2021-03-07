# fdxk开发环境配置

## 总览

- 熟悉terminal
- 工具安装
- 下载代码
- 前端配置
- 后端配置
- 配置成功
- 可能遇到的问题
- 结尾

## 熟悉Terminal

terminal是配置非常重要的工具，下面是terminal的一些操作（不是cmd）

- 目录操作: ls cd pwd rm
- 文件操作: touch   cat   mv   rm
- 进程操作: top显示进程

### ls 列出当前文件夹下的所有文件和文件夹

```
ls
ls -a
ls -l
```

### pwd 显示当前文件夹

```jsx
pwd
```

### cd 进入文件夹

```jsx
cd /
cd ~
cd ..
```

### cat 显示文件内容

```
cat hello.txt
```

### clear

清空终端中存在的已经执行过的命令

（`history`仍然可以查看）

### mkdir

在当前目录下创建文件夹

### touch

在当前目录下创建文件（一般这么创建的文件是文本文件）

### rm

移除某个文件（注意不是移动到废纸篓）

移除某个文件夹`rm -d Directory`

强制删除`rm -rf Directory`

### mv、cp

移动文件与复制文件

移动文件到原地相当于重命名

### open 打开文件或者文件夹

```
open foo.
open .
```

### 管道

`|`: 上一个命令（程序）的输出作为下一个命令的输入history
history | grep "mkdir"

### nano 打开文件

```jsx
nano [文件名]
```

### chmod

修改文件权限。

如果你希望一个文件有可执行权限：

```
chmod a+x <file>
```

## 工具安装

在开始配置fdxk的开发环境之前，请先安装以下的开发工具，它们是配置fdxk环境所必须的

- terminal
    - linux式的命令终端
- npm、yarn、pip(python)
    - 包管理工具
    - 根据不同的操作系统安装，在terminal中安装
- git
    - 版本管理工具
    - [https://guides.github.com/introduction/flow/](https://guides.github.com/introduction/flow/)
- docker，docker-compose
    - 让程序在轻量化虚拟机中运行
    - 安装与系统环境匹配的版本
    - 执行docker -v 检测是否在命令行中安装，并检查版本
    - pip3 install docker-compose
- typescript
    - npm install typescript
    - npx tsc -v 检测是否安装成功，并检查版本
- nestjs
    - 前往官网教程
    - https://docs.nestjs.com

## 下载代码

### 从GitHub下载代码

- 可以使用GitHub Desktop → Clone → 保存到目标目录

### 下载两个仓库

- 前端：https://github.com/CLDXiang/today-frontend
- 后端：https://github.com/ichn-hu/today-backend
- 均为private仓库，需要权限

## 前端配置

### 概览

fdxk采用前后端分离的开发方式，前端负责向浏览器传输html文件等前端文件，后端专门处理操作请求，如数据的查找、删除等。

前端使用的技术栈为

- PWA
- Vue
- 目前 UI 框架为 Vuetify，计划逐渐迁移到由 tailwindcss 构建的原生 UI 组件

### 配置

前端使用了yarn来配置环境，进入 /today-frontend 目录后输入下面的代码，yarn会读取package.json并下载全部的依赖包，并开始运行

```jsx
yarn install
yarn dev
```

## 后端配置

### 概览

后端使用的技术栈为

- Typescript
- nestjs
- mysql

### 配置

后端的环境配置需要使用docker和docker-compose。后端会运行三个docker：nestjs、mysql、redis，而docker-compose可以把三个docker联合运行，就不用手动启动三次docker了

运行以下命令构建docker-compose

```jsx
**docker-compose -f docker-compose.yml build**
```

运行以下命令以运行docker-compose

```jsx
docker-compose -f docker-compose-dev.yml up
```

输入以下命令显示docker正在运行的项目

```jsx
docker ps
```

下一步，进入api所在的docker(从上一条命令中查看today-backend_api所对应的container id)

```jsx
docker exec -it 4cdbb6187be3 /bin/sh
```

进入容器后，所在目录为 /app，执行以下命令创建配置文件

```jsx
cp ormconfig.json.example ormconfig.json
```

最后，执行下面的命令执行migration

```jsx
npx typeorm migration:run
```

## 配置成功

在浏览器中访问 [localhost:8080](http://localhost:8080) 会得到如下页面

![配置成功](../static/assets/fdxk-env-set.png)

点击底部最右侧登陆选项可以进行注册，获取验证码可以在mysql数据库中查看，如果联网能收到邮件验证码

执行以下命令可以看到在后端服务器中的mysql数据信息（[docker_mysql]需替换）

第一行docker会执行mysql虚拟机中/bin/sh的虚拟机，也就是mysql所在系统的命令行

第二行输入mysql的用户名，密码需要手动输入password

第三行会显示所有的数据库

第四行进入today数据库

第五行进入mail数据表

第六行显示mail数据表，数据表最右面的一列六位数就是验证码

```jsx
docker exec -it [docker_mysql] /bin/sh
mysql -u root -p
show databases
use today
show tables
select * from mail
```

## 可能遇到的问题

### 无法下载问题

使用以下命令来查看连接公网的ip地址

```jsx
curl ip.sb
```

使用以下命令在命令行中开启代理

```jsx
export http_proxy=http://127.0.0.1:1087;export https_proxy=http://127.0.0.1:1087;
```

### docker安装时出现问题

可能的解决方案：

```jsx
export DOCKER_BUILDKIT=0
export COMPOSE_DOCKER_CLI_BUILD=0
```

### 系统不支持mysql8.0

docker-compose中修改mysql:image

```jsx
image:"mysql/mysql-server:8.0.23"
```

### 后端mysql跑不起来，提示ip地址没有权限

```jsx
CREATE USER 'root'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON *. * TO 'root'@'%';
```

## 结尾

感谢@ichn-hu的指导，不然我可能搞一周环境都起不来hhh

如果有任何问题请在https://github.com/FDUCSLG/fducslg下issue中提出，我(@Depetrol)会尽快修改

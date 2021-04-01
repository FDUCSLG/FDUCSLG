
!!! note

    [fdxk.info](https://fdxk.info) 是 FDUCSLG（Fudan Unniversity Computer Science Lovers Group）旗下的网站，由复旦大学的计算机相关专业的技术爱好者们开发和维护，旨在解决复旦缺少校内信息交流渠道的问题，目前两大功能为课表、评课，后续会加入更多功能服务校内同学。
    
    目前该项目还处在积极开发之中，如果你对此感兴趣，欢迎联系我们！

# docker 在 fdxk.info 后端中的应用与优化

# 背景介绍

[fdxk.info](http://fdxk.info) 后端服务采用 nestjs + typescript 构建，并通过 docker 和 docker-compose 进行部署，本文将介绍 docker 在后端中的应用，以及我们针对 nodejs 构建的后端服务对 dockerfile 进行的优化。

## 什么是 docker

docker 是基于容器技术实现的环境隔离的运行时。所谓的容器（container）可以理解成非常轻量级的虚拟机（但不是），底层采用 linux kernel 提供的 namespace、cgroup 等技术实现资源隔离，让用户的进程可以跑在 kernel 的原生进程上，从而可以提供几乎零损失的隔离抽象（相比于虚拟机的译码执行或者对硬件的模拟），并且可以快速地启动大量容器。

更详细的关于 docker 历史以及 docker 和虚拟机的对比，可以参考[什么是 docker](https://yeasy.gitbook.io/docker_practice/introduction/what) 、[为什么要用 Docker](https://yeasy.gitbook.io/docker_practice/introduction/why) 。

关于安装 docker 和配置，可以参考[安装 docker](https://yeasy.gitbook.io/docker_practice/install) 和[镜像加速器](https://yeasy.gitbook.io/docker_practice/install/mirror)。

## 基本概念与基本操作

关于 docker 有一些基本的概念需要清楚。

docker image 类似虚拟机镜像，一个 image 严格定义了一个 docker 容器的环境。我们可以方便地从 docker hub 等 registry 服务提供商下载别人定义好的 docker image，譬如 `docker pull mysql:8.0` 就可以从官方的 docker hub 拉取 mysql 8.0 镜像。

我们也可以通过编写 Dockerfile 来自定义 docker image。Dockerfile 就像菜谱一样，描述了一个 image 是如何被构建出来的。譬如

```docker
FROM node:14-alpine
# install the myslq-client so that we could run scripts in the api container
RUN apk update && \
    apk add mysql-client
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node package*.json ./
USER node
RUN npm config set registry http://registry.npm.taobao.org/
RUN npm install --verbose
COPY --chown=node:node . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

这便是 fdxk 现在的后端所使用的 docker image 的 Dockerfile 文件。第一行 `FROM node:14-alpine` 指明了一个基础镜像，在构建的时候从 registry 拉取，后续的操作将在该镜像上进行；第二行是在这个镜像内安装必要的软件（mysql-client，这一步取决于基础镜像是什么），往后的每一步都会以在 docker 中执行一些操作（如复制文件进入 docker 或者运行指令），docker 会对每一步操作进行缓存，在未来如果前面的步骤的副作用没有发生改变（如复制的文件没改变），那么就可以直接使用缓存继续构建，从而大大加快构建速度。这也是后文会提到的优化之处的原理。

获得镜像之后，我们便可以实例化一个镜像运行起来。运行着的镜像被称为容器（container）。以 MySQL 举例。

1. 首先通过 `docker pull mysql:8.0` 获取镜像
2. 运行容器

    ```docker
    # -e 指明提供给容器的环境变量，这里指明了 MySQL root 的密码
    # -p 指明了端口转发，把容器内的 3306 端口转发到 host 的 3306 端口
    # -d 让容器以 detach 的状态运行在背景中
    docker run -e MYSQL_ROOT_PASSWORD=xxxx -p 3306:3306 -d mysql:8.0
    ```

3. 运行后，通过 `docker ps` 查看现有的容器，结果如下所示

    ```docker
    $ docker ps
    CONTAINER ID   IMAGE       COMMAND                  CREATED         STATUS         PORTS                               NAMES
    b29267fcd1c2   mysql:8.0   "docker-entrypoint.s…"   2 minutes ago   Up 2 minutes   0.0.0.0:3306->3306/tcp, 33060/tcp   laughing_goldstine
    ```

4. 获取到 CONTAINER ID 后（这里为 `b29267fcd1c2`），通过 `docker exec -it b29267fcd1c2 /bin/sh` 命令，可以进入到容器之中，并执行容器中的 shell 交互
5. 在新进入的交互命令行中输入 `mysql -uroot -p` 然后输入你创建容器时通过 `-e MYSQL_ROOT_PASSWORD=xxxx` 指定的密码，即可操作 MySQL
6. 如果你本地有 MySQL client，那么你不需要进入容器也能操作 MySQL，因为容器内的 MySQL 监听的 3306 端口已经通过 docker 转发到你宿主操作系统上的 3306 端口，因此你可以直接在 host 的命令行中执行 `mysql -uroot --protocol=tcp -p` 即可操作容器中的 MySQL
7. 当你不需要这个 MySQL 容器的时候，你可以通过 `docker down b29267fcd1c2` 关闭它，然后在 `docker ps -a` 中看到关闭的容器列表。然后你可通过 `docker rm xxx` 删除 CONTAINER ID 为 xxx 的容器。

如果从 host 通过 mysqljs 访问 docker 内的 MySQL 遇到下述报错：

`ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client`

你需要进入 MySQL 给你的用户添加 `native_password` 的支持。方法为首先进入 MySQL container

`docker exec -it CONTAINER_ID /bin/sh`

然后以 root 的身份进入 MySQL

`mysql --user=root --password`

再通过下述命令重新指明密码

`ALTER USER 'root' IDENTIFIED WITH mysql_native_password BY 'password';`

更多关于 docker 的内容，强烈建议读者参考《[Docker —— 从入门到实践](https://yeasy.gitbook.io/docker_practice/)》一书。

## 为什么用 docker

[fdxk.info](http://fdxk.info) 使用 docker 主要有两个原因

1. 获得本地和线上一致的运行环境，降低测试、部署的难度。譬如上例中的 MySQL 容器，在安装好 docker 后可以轻易地运行起来，而且所有人的版本、环境都是一致的。
2. 通过 docker-compose 可以方便地启动和管理多个后端组件，现在已经使用的有 API server（即我们自行开发的服务端）、MySQL 以及 Redis，未来还可能会加入 elastic search 等组件。

# Dockerfile 优化

终于进入到正题！

[fdxk.info](http://fdxk.info) 的后端服务使用 docker 进行部署，因此需要为之编写 Dockerfile 来描述镜像。上文提到的 Dockerfile 镜像就是之前 fdxk.info 所使用的镜像文件。

我们从第三行开始逐行讲解每一行的用意。

```docker
FROM node:14-alpine
# install the myslq-client so that we could run scripts in the api container
RUN apk update && \
    apk add mysql-client
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node package*.json ./
USER node
RUN npm config set registry http://registry.npm.taobao.org/
RUN npm install --verbose
COPY --chown=node:node . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

- `RUN` 是在 docker 中执行命令，后面的 `mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app` 便是希望被执行的命令，它创建了 `/home/node/app/node_modules` 目录，并且把 `/home/node/app` 的权限修改为 node 用户组所有。之前提到过，Dockerfile 中的每一行都会在 image 中创建新的一层，这里用 `&&` 来连接两个命令，目的就是为了减少 docker 的层数。
- `WORKDIR /home/node/app` 指定之后的工作目录，所有的操作都以 `/home/node/app` 为当前目录。
- `COPY --chown=node:node package*.json ./` 把 `package*.json` 文件复制到 docker 内的当前目录。这里的 `package*.json` 采用了通配符，表示以 `package` 开头，`.json` 结尾的所有文件。注意到，执行这个命令的视角是在构建 docker image，所以这里匹配的文件是在 Dockerfile 所在的宿主机器的文件夹内的，而复制到 `./` 则是在 docker image 内。
- `USER node` 切换用户为 `node`
- `RUN npm config set registry [http://registry.npm.taobao.org/](http://registry.npm.taobao.org/)` 因为 [fdxk.info](http://fdxk.info) 后端采用 nodejs，所以需要使用 npm 安装依赖，而考虑到在国内网络的问题，这里配置使用淘宝镜像
- `RUN npm install --verbose` 依据之前复制到镜像内的 `package*.json` 文件安装依赖，额外采用 `—verbose` 可以在安装的时候输出更多日志，方便知道安装的进度
- `COPY --chown=node:node . .` 再次复制，把宿主机器上 Dockerfile 所在的文件夹里的所有文件都复制到 docker 镜像中的工作目录，这一步才真正复制源代码到镜像内
- `RUN npm run build` 编译、构建后端服务
- `EXPOSE 3000` 声明暴露 3000 端口给宿主，因为后端服务启动的时候监听的是 3000 端口，所以必须暴露到宿主才能访问
- `CMD ["npm", "run", "start:prod"]` 指定运行镜像时默认执行的命令，即启动后端服务

这个 Dockerfile 实际上已经进行了不少优化，譬如先复制 `package*.json` 文件，安装完依赖再复制源代码进行构建。因为依赖的变动不那么频繁，所以复制源代码前的步骤都是可以被缓存下来的，只要宿主文件夹里的 `package*.json` 没有变动（docker 可以根据时间戳等信息判断），那么前面的步骤都不需要重新执行。这个优化可以把费事费力的安装依赖的代价消除掉，只在不得不需要重新安装的时候执行。

不过这样的优化还不够。

因为使用这个 Dockerfile 打包出来的镜像有 492MB 大。

```docker
➜  today-backend git:(shrink-docker) docker image ls
REPOSITORY          TAG         IMAGE ID       CREATED          SIZE
backend-large       latest      12c829332187   12 minutes ago   492MB
```

我们通过

```docker
➜  today-backend git:(shrink-docker) docker history --human --format "{{.CreatedBy}}: {{.Size}}" backend-large
CMD ["npm" "run" "start:prod"]: 0B
EXPOSE map[3000/tcp:{}]: 0B
RUN /bin/sh -c npm run build # buildkit: 1.12MB
COPY . . # buildkit: 1.21MB
RUN /bin/sh -c npm install --verbose # build…: 339MB
RUN /bin/sh -c npm config set registry http:…: 96B
USER node: 0B
COPY package*.json ./ # buildkit: 486kB
WORKDIR /home/node/app: 0B
RUN /bin/sh -c mkdir -p /home/node/app/node_…: 0B
RUN /bin/sh -c apk update &&     apk add mys…: 33.9MB
/bin/sh -c #(nop)  CMD ["node"]: 0B
/bin/sh -c #(nop)  ENTRYPOINT ["docker-entry…: 0B
/bin/sh -c #(nop) COPY file:238737301d473041…: 116B
/bin/sh -c apk add --no-cache --virtual .bui…: 7.62MB
/bin/sh -c #(nop)  ENV YARN_VERSION=1.22.5: 0B
/bin/sh -c addgroup -g 1000 node     && addu…: 103MB
/bin/sh -c #(nop)  ENV NODE_VERSION=14.16.0: 0B
/bin/sh -c #(nop)  CMD ["/bin/sh"]: 0B
/bin/sh -c #(nop) ADD file:7eeea546ecde7a036…: 5.61MB
```

可以看到 docker 镜像中每一层的大小，可以发现最大的层在安装依赖。

实际上并不是所有的依赖都需要在生产中被使用，因为有很多包是构建的依赖，而不是运行时的依赖。我们可以在构建完成后剔除那些依赖。

优化之后的 Dockerfile 长这样：

```docker
FROM node:14-alpine AS BUILD_IMAGE
RUN apk update && \
    apk add curl bash
RUN curl -sf https://gobinaries.com/tj/node-prune | sh
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node package*.json ./
USER node
RUN npm config set registry http://registry.npm.taobao.org/ && npm ci --verbose
COPY --chown=node:node . .
RUN npm run build
RUN npm prune --production && node-prune
FROM node:14-alpine
WORKDIR /home/node/app
USER node
COPY --from=BUILD_IMAGE /home/node/app/views ./views
COPY --from=BUILD_IMAGE /home/node/app/dist ./dist
COPY --from=BUILD_IMAGE /home/node/app/node_modules ./node_modules
EXPOSE 3000
ENV env=production
CMD ["node", "./dist/main.js"]
```

- 首先是第三步，安装了 `[node-prune](http://node-prune.sh)` 这个工具，用来剔除依赖
- 然后在 `RUN npm prune --production && node-prune` ，执行剔除
- 最后我们重新使用基本镜像 `FROM node:14-alpine` ，这个技巧被称为多阶段构建（multi-stage build）。这样的目的在于区分构建时的镜像和运行时的镜像，因为我们在使用这个镜像的时候，只需要其运行时的内容，而其他构建时创建的内容则可以抛弃（譬如构建的日志文件）。
- 在这个重新使用的基本镜像中，我们复制那些运行时必不可少的内容，如 views 文件中时不参与构建的静态内容、dist 是构建的目标文件夹、node_modules 是已经剔除掉非必须依赖的依赖文件夹。

这样我们就可以拿到一个非常整洁的 docker 镜像。

```docker
➜  today-backend git:(shrink-docker) ✗ docker image ls
REPOSITORY          TAG         IMAGE ID       CREATED             SIZE
backend-small       latest      02449f947941   5 seconds ago       195MB
```

新构建的镜像只有 195MB，相比于原来的 492MB 缩减了将近 300MB 的空间。

## docker-compose

在 docker 的基础上，我们使用 docker-compose 来启动多个服务（mysql 和 redis），但鉴于篇幅的原因，我们将在之后再进行分享。感兴趣的同学可以看 [https://github.com/docker/awesome-compose](https://github.com/docker/awesome-compose) 了解 docker-compose 是如何使用的。

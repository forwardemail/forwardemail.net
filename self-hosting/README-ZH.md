# 自托管版本 {#self-hosted-releases}

本节记录了 ForwardEmail 自托管解决方案的 CI/CD 工作流程，解释了如何构建、发布和部署 Docker 镜像。

## 目录 {#table-of-contents}

* [概述](#overview)
* [CI/CD 工作流程](#cicd-workflow)
  * [GitHub Actions 工作流程](#github-actions-workflow)
  * [Docker 镜像结构](#docker-image-structure)
* [部署过程](#deployment-process)
  * [安装](#installation)
  * [Docker Compose配置](#docker-compose-configuration)
* [维护特点](#maintenance-features)
  * [自动更新](#automatic-updates)
  * [备份和还原](#backup-and-restore)
  * [证书续订](#certificate-renewal)
* [版本控制](#versioning)
* [访问图像](#accessing-images)
* [贡献](#contributing)

## 概览 {#overview}

ForwardEmail 的自托管解决方案使用 GitHub Actions 在新版本发布时自动构建和发布 Docker 镜像。用户可以使用提供的安装脚本将这些镜像部署到自己的服务器上。

> \[!NOTE]
> 我们还有 [自托管博客](https://forwardemail.net/blog/docs/self-hosted-solution) 和 [自托管开发者指南](https://forwardemail.net/self-hosted)
>
> 如需更详细的分步版本，请参阅基于 [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) 或 [Debian](https://forwardemail.net/guides/selfhosted-on-debian) 的指南。

## CI/CD 工作流程 {#cicd-workflow}

### GitHub Actions 工作流程 {#github-actions-workflow}

自托管 Docker 镜像的构建和发布流程在 `.github/workflows/docker-image-build-publish.yml` 中定义。此工作流程：

1. **触发器**：在新的 GitHub 版本发布时自动运行
2. **环境**：在 Ubuntu 上运行，使用 Node.js 18.20.4
3. **构建过程**：
* 检出代码仓库
* 设置 Docker Buildx 进行多平台构建
* 登录 GitHub 容器镜像仓库 (GHCR)
* 更新自托管部署的架构
* 使用 `self-hosting/Dockerfile-selfhosted` 构建 Docker 镜像
* 使用发布版本号和 `latest` 标记镜像
* 将镜像推送到 GitHub 容器镜像仓库

```yaml
# Key workflow steps
name: Build and Publish Self-Hosted Docker Image

on:
  release:
    types: [published]  # Trigger on new releases

jobs:
  build-and-publish:
    runs-on: ubuntu-latest
    steps:
      # Setup steps...

      # Build and publish Docker image
      - name: Build / Publish Docker image to GitHub Container Registry
        run: |
          IMAGE_NAME=ghcr.io/${{ github.repository }}-selfhosted:${{ github.ref_name }}
          docker build -f self-hosting/Dockerfile-selfhosted -t $IMAGE_NAME .
          docker tag $IMAGE_NAME ghcr.io/${{ github.repository }}-selfhosted:latest
          docker push $IMAGE_NAME
          docker push ghcr.io/${{ github.repository }}-selfhosted:latest
```

### Docker 镜像结构 {#docker-image-structure}

Docker 镜像是使用 `self-hosting/Dockerfile-selfhosted` 中定义的多阶段方法构建的：

1. **构建器阶段**：
* 使用 Node.js 20 作为基础镜像
* 设置 `SELF_HOSTED=true` 环境变量
* 使用 pnpm 安装依赖项
* 在生产模式下构建应用程序

2. **最终阶段**：
* 使用更精简的 Node.js 20 镜像
* 仅安装必要的系统依赖项
* 创建数据存储所需的目录
* 从构建器阶段复制已构建的应用程序

这种方法可确保最终图像的尺寸和安全性得到优化。

## 部署过程 {#deployment-process}

### 安装 {#installation}

用户可以使用提供的安装脚本部署自托管解决方案：

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/refs/heads/master/self-hosting/setup.sh)
```

此脚本：

1. 克隆代码库
2. 设置环境
3. 配置 DNS 和防火墙设置
4. 生成 SSL 证书
5. 拉取最新的 Docker 镜像
6. 使用 Docker Compose 启动服务

### Docker Compose 配置 {#docker-compose-configuration}

`docker-compose-self-hosted.yml` 文件定义了自托管解决方案所需的所有服务：

* **Web**：主 Web 界面
* **API**：用于编程访问的 API 服务器
* **SMTP**：电子邮件发送服务
* **IMAP/POP3**：电子邮件检索服务
* **MX**：邮件交换服务
* **CalDAV**：日历服务
* **CardDAV**：联系人服务
* **MongoDB**：用于存储用户数据的数据库
* **Redis**：内存数据存储
* **SQLite**：用于存储电子邮件的数据库

每个服务使用相同的 Docker 镜像但具有不同的入口点，从而实现模块化架构并简化维护。

## 维护功能 {#maintenance-features}

自托管解决方案包括几个维护功能：

### 自动更新 {#automatic-updates}

用户可以启用自动更新，以便：

* 每晚拉取最新的 Docker 镜像
* 使用更新后的镜像重启服务
* 记录更新过程

```bash
# Setup auto-updates (runs at 1 AM daily)
0 1 * * * docker compose -f /path/to/docker-compose-self-hosted.yml pull && docker compose -f /path/to/docker-compose-self-hosted.yml up -d >> /var/log/autoupdate.log 2>&1
```

### 备份和恢复 {#backup-and-restore}

该设置提供以下选项：

* 配置定期备份到 S3 兼容存储
* 备份 MongoDB、Redis 和 SQLite 数据
* 发生故障时从备份恢复

### 证书续订 {#certificate-renewal}

SSL 证书自动管理，具有以下选项：

* 在设置过程中生成新证书
* 根据需要更新证书
* 配置 DKIM 进行电子邮件身份验证

## 版本控制 {#versioning}

每个 GitHub 版本都会创建一个新的 Docker 镜像，标签如下：

1. 具体的发布版本（例如 `v1.0.0`）
2. 最新版本的 `latest` 标签

用户可以选择使用特定版本以确保稳定性，或者使用 `latest` 标签以始终获得最新功能。

## 访问图片 {#accessing-images}

Docker 镜像可在以下位置公开获取：

* `ghcr.io/forwardemail/forwardemail.net-selfhosted:latest`
* `ghcr.io/forwardemail/forwardemail.net-selfhosted:v1.0.0`（示例版本标签）

无需身份验证即可提取这些图像。

## 贡献 {#contributing}

为自托管解决方案做出贡献：

1. 修改 `self-hosting` 目录中的相关文件
2. 使用提供的 `setup.sh` 脚本在本地或基于 Ubuntu 的 VPS 上进行测试
3. 提交拉取请求
4. 合并并创建新版本后，CI 工作流将自动构建并发布更新的 Docker 镜像
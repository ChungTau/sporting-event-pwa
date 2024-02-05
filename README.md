# Sporting Event Progressive Web App

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://github.com/ChungTau/sporting-event-pwa/tree/master)

\[master]: 出街 (其實係 release branch 嚟)
\[develop]: 開發中
\[feature]: 功能

每做完一個 feature 就 push 去 feature branch
feature 無問題就會 merge 去 develop

## Connect MySQL Database Remotely

1. Install Cloudflared CLI in Powershell
   `winget install --id Cloudflare.cloudflared` (For Win10)
   `brew install cloudflared` (For MacOS)
2. To access the tunnel remotely, run:
   `cloudflared access tcp --hostname db.chungtau.com --url localhost:3366`

## View the MySQL with GUI

1. Install SQLectron
   [Click here to Download](https://github.com/sqlectron/sqlectron-gui/releases/download/v1.38.0/sqlectron-Setup-1.38.0.exe)
2. Run before connect MYSQL database remotely
3. Input fields
   a. Name: FYP
   b. Database Type: MySQL
   c. Server Address: localhost
   d. Port 3366
   e. User: fyp
   f. Password: FYP_gib5

## Common Git Command Tutorial

##### 切換 Branch

> `git checkout <branch>`

##### 將 File (or folder) 加入版本控制

> `git add <file>`\
> `git add .` //可以加入全部

##### 提交剛才 add 的更動, 並說明

> `git commit -m "說明內容"`

##### 將 commit 左既野上傳到 Repository

> `git push origin <branch>`\
> `git push origin feature` //示範

##### 從 Repository 提取 Branch 的 file

> `git pull origin <branch>`\
> `git pull origin develop` //示範

##### 建立 Branch

> `git branch <name>`

##### 建立 Sub-branch

> `git branch <branch>/<sub-branch>`\
> `git branch feature/navigation-bar` //示範\
> `git branch feature/header` //示範

## Feature Life-cycle

### # _命名規則_

- 由 feature 作為 prefix
- 然後以功能所在的 page 作為 infix
- 最後以功能名稱作為 postfix
- Example:
  - /feature/main/plan/mapview
  - /feature/main/header
  - /feature/signin/authentication

### # _提取 develop branch 的最新版本, 並在 develop branch 中創建 feature branch_

```sh
  git checkout develop
  git pull
  git checkout -b feature/main/header
```

### # _合併更新_

定期從 develop branch 更新

```sh
  git checkout feature/main/header
  git merge develop
```

### # _完成 feature 後合併_

當完成好你現有的 feature 後, 可以找 Edward,
等待他進行 merge branches

## Installation

```sh
git remote add origin https://github.com/ChungTau/sporting-event-pwa.git
git pull origin develop
```

```sh
npm i
```

## Start

```sh
npm start
```

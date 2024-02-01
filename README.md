# Sporting Event Progressive Web App

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://github.com/ChungTau/sporting-event-pwa/tree/master)

\[master]: 出街 (其實係release branch嚟)
\[develop]: 開發中
\[feature]: 功能

每做完一個feature就push去feature branch
feature無問題就會merge去develop

## Connect MySQL Database Remotely 
1. Install Cloudflared CLI in Powershell
`winget install --id Cloudflare.cloudflared`
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

##### 切換Branch
>`git checkout <branch>`


##### 將File (or folder) 加入版本控制
>`git add <file>`\
>`git add .` //可以加入全部

##### 提交剛才add的更動, 並說明
>`git commit -m "說明內容"`

##### 將commit左既野上傳到Repository
>`git push origin <branch>`\
>`git push origin feature` //示範

##### 從Repository提取Branch的file
>`git pull origin <branch>`\
>`git pull origin develop` //示範

##### 建立Branch
> `git branch <name>`

##### 建立Sub-branch
> `git branch <branch>/<sub-branch>`\
> `git branch feature/navigation-bar` //示範\
> `git branch feature/header` //示範


## Feature Life-cycle
### # *命名規則*
  - 由feature作為prefix
  - 然後以功能所在的page作為infix
  - 最後以功能名稱作為postfix
  - Example:
    - /feature/main/plan/mapview
    - /feature/main/header
    - /feature/signin/authentication
   

### # *提取develop branch的最新版本, 並在develop branch中創建feature branch*
```sh
  git checkout develop
  git pull
  git checkout -b feature/main/header
```
### # *合併更新*
定期從develop branch更新
```sh
  git checkout feature/main/header
  git merge develop
```

### # *完成feature後合併*
當完成好你現有的feature後, 可以找Edward,
等待他進行merge branches

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


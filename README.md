# push-merge
推送代码并发起合并请求

## 指令
### 配置Gitlab账号密码及分支前缀信息
```shell
pm config
```
或者
```shell
pm c
```

### 推送代码并发起合并请求
```shell
pm m
```
或者
```shell
pm
```

### 仅推送代码
```shell
pm s
```

### 同步二开仓库
```shell
pf l
```
或者
```shell
pf
```

## 用法

### 推送代码并发起合并请求
1. 切换到对应分支，如V8R4C110
2. 写代码
3. git add .
4. git commit -m "for example"
5. git pull
6. pm

### 同步二开仓库
1. fork一个自己的二开仓库
2. 当自己的二开仓库落后于原仓库时，使用指令 `pf`
3. 等待同步完成，若差异较大，可能等候时间较长
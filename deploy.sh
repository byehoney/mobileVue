#!/bin/bash
VERSION=$(date +%Y%m%d%H%M%S)
PROJECT_DIR=/opt/project/view/mobile.new
DEPLOY_RELEASE_DIR=/opt/sites/view/mobile/release
DEPLOY_DIR=/opt/sites/view/mobile
DEPLOY_ENV=build
DEPLOY_BRANCH=master

show_usage="args:[-b ,-e,-p]\[--env,--branch,--port]"
#-o表示短选项，两个冒号表示该选项有一个可选参数，可选参数必须紧贴选项
#如-carg 而不能是-c arg
#--long表示长选项
#"$@"在上面解释过
# -n:出错时的信息

GETOPT_ARGS=`getopt -o b:e: -al branch:,env: -- "$@"`
eval set -- "$GETOPT_ARGS"
while [ -n "$1" ]
do
        case "$1" in
                -b|--branch) DEPLOY_BRANCH=$2; shift 2;;
                -e|--env) DEPLOY_ENV=$2; shift 2;;
                --) break ;;
                *) echo $1,$2,$show_usage; break ;;
        esac
done

echo 发布版本为:$VERSION

echo $VERSION > $DEPLOY_RELEASE_DIR/CURRENT_VERSION

if [ ! -d $DEPLOY_RELEASE_DIR ];then
    mkdir -p $DEPLOY_RELEASE_DIR
fi

cd $PROJECT_DIR

echo 同步代码

git fetch origin

echo 选择发布分支$DEPLOY_BRANCH

git checkout $DEPLOY_BRANCH

echo 获取最新代码

git pull origin $DEPLOY_BRANCH

echo 执行运行环境

yarn install

echo 编译发布包

npm run $DEPLOY_ENV

echo 移动发布包到发布目录

mv $PROJECT_DIR/dist $DEPLOY_RELEASE_DIR/$VERSION

echo 进入发布目录

cd $DEPLOY_DIR

echo 发布目录的软连接

ln -sfn $DEPLOY_RELEASE_DIR/$VERSION/ $DEPLOY_DIR/current

echo 部署完成

#!/usr/bin/env bash

function release_ios() {
    echo "releasing ios of version: " $1
    current_version=`code-push deployment ls ppk-ios |grep "App Version" | gsed -s 's/.*\(App Version: \)\([^ ]*\).*/\2/g'`
    if [ ${#current_version} -eq 0 ]; then
        exit -1
    fi
    new_version=`echo ${current_version} | awk -F. '{printf("%d.%d.%d", $1, $2, $3+1)}'`
    if [ $# -ge 1 ]; then
        new_version=$1
    fi
    echo "current version:" ${current_version} "; new version:" ${new_version}
    if [ ${#new_version} -eq 0 ]; then
        echo "release ios failed, new version nil"
        exit -1
    fi
    npm run bundle-ios
     if [ $? -ne 0 ] ; then
        echo "release ios, bundle failed"
     fi
    code-push release ppk-ios ./release/ios ${new_version}
    if [ $? -ne 0 ] ; then
        echo "release ios failed"
    fi
}

function release_android() {
    echo "releasing android of version: " $1
    new_version=`echo ${current_version} | awk -F. '{printf("%d.%d.%d", $1, $2, $3+1)}'`
    if [ $# -ge 1 ]; then
        new_version=$1
    fi
    echo "current version:" ${current_version} "; new version:" ${new_version}
    if [ ${#new_version} -eq 0 ]; then
        echo "release android failed, new version nil"
        exit -1
    fi
    npm run bundle-android
    if [ $? -ne 0 ] ; then
        echo "release android, bundle failed"
    fi
    code-push release ppk-android ./release/android ${new_version}
    if [ $? -ne 0 ] ; then
        echo "release android, release failed"
    fi
}

case $1 in
    "releaseios") release_ios  $2;;
    "releaseandroid") release_android $2;;
esac


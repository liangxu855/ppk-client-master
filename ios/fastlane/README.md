fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew cask install fastlane`

# Available Actions
### release
```
fastlane release
```
Deploy a new version to the App Store
### submit
```
fastlane submit
```
Submit for review
### git_hook
```
fastlane git_hook
```
git hook
### config_dev
```
fastlane config_dev
```
配置开发环境的的bundleid, teamid, provision_profile, code_sign_identify并下载相应的证书
如果看到需要让你输入passphrase的话，重复两次输入shandiangou

### config_prod
```
fastlane config_prod
```
配置生产环境的的bundleid, teamid, provision_profile, code_sign_identify并下载相应的证书
如果看到需要让你输入passphrase的话，重复两次输入shandiangou

### add_device
```
fastlane add_device
```


----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).

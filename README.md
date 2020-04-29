# Redmine Noticer
## 简介
redmine-noticer是一款面向研发&测试的Chrome扩展程序,旨在及时通知开发人员最新的issue,帮助那些需要频繁修改Redmine中issue状态的用户一键标记解决/关闭/指派当前issue,简化操作流程.

## 背景
Redmine是一款很强大的开源项目管理软件,大部分用Redmine的企业目前仅仅是简单部署最原始的核心功能,并不会为Redmine配置邮件/钉钉/微信通知等插件以及更现代化的主题,研发redmine-noticer这款扩展程序就是为了解决这样的痛点.现在你无需为了查看和标记一个issue状态频繁打开Redmine的Web页面,并且你会及时收到指定issue的桌面通知,提高研发/测试的工作效率.

## 安装和使用
1. 下载zip并解压(最好是解压到一般不会变更和误删除的路径下,以免造成扩展被误删除)
2. 打开Chrome-更多工具-扩展程序,打开扩展程序页面右上角'开发者模式'选项
3. 点击页面左上角'加载已解压的扩展程序',选择第一步中解压到的文件路径
4. 安装完成后,可以点击扩展程序页面Redmine Noticer-详细信息-扩展程序选项,或者Chrome新增的Redmine Noticer图标上右键选择选项,进入Redmine Noticer配置页面
5. 配置你的Redmine URL(如http://192.168.0.162  注意不要以/结尾)和API Key即可开始使用本扩展

或者您也可以从[Chrome 网上应用店](https://chrome.google.com/webstore/detail/jgponcomcacmaahanelanminhdkkhahl/publish-accepted?authuser=1&hl=zh-CN)直接点击"添加至Chrome"即可.

## 如何获取API Key
登录您的Redmine Web页面后,点击右上角'我的账号',您可以在页面右侧看到'API访问键',点击'显示'即可查看您的API Key.您也可以点击'重置'来重新创建一个.其他说明您可以参照[官方文档](https://www.redmine.org/boards/2/topics/53956).
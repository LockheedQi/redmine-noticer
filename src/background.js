global.browser = require('webextension-polyfill')
import store from './store'

// alert(`Hello ${store.getters.foo}!`)
/*
  定时轮询API 获取issue列表,通过和本地存储的通知状态字典进行交叉比对
  - issue列表中存在,通知状态字典中不存在的代表新激活的任务/bug,发送通知.
  - issue列表中已经不存在,通知状态字典中还存在的,覆盖最新的issue列表到通知状态字典
*/
var redmineUrl = ''
var accessKey = ''
var noticedIssuesDic = {}

chrome.storage.sync.get({ redmineUrl: "", accessKey: ""}, (items) => {
  if (items.redmineUrl && items.accessKey) {
    redmineUrl = items.redmineUrl;
    accessKey = items.accessKey;
  } else {
    console.log("请配置RedmineUrl和accessKey");
  }
});
// 每隔指定时间轮询API 更新issue列表,角标,发送通知后更新通知状态
setInterval(() => {

  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  fetch(redmineUrl + "/issues.json?key=" + accessKey + '&assigned_to_id=me&status_id=1', requestOptions)
    .then(response => response.json())
    .then(result => {
      chrome.storage.sync.get({ noticeDic: {} }, (items) => {

        // 更新角标
        window.chrome.browserAction.setBadgeText({text: result.issues ? result.issues.length + '' : ''});
        window.chrome.browserAction.setBadgeBackgroundColor({color: [102, 205, 170, 255]});
        noticedIssuesDic = items.noticeDic
        var newNoticedDic = {}
        for (var i = 0; i < result.issues.length; i++){
          let issue = result.issues[i]
          let issueId = issue.id + ''
          if (noticedIssuesDic[issueId]) {// 已经通知
              
          } else {
            chrome.notifications.create(null,{
              type: 'basic',
              iconUrl: '../../../icons/logo.png',
              title: issue.subject,
              message: issue.description,
            });
          }
          newNoticedDic[issueId] = 'noticed'
        }
        // 保存数据
        chrome.storage.sync.set({noticeDic: newNoticedDic}, ()=>{
            
        });
      });
    })
    .catch(error => console.log('error', error));

}, 60000);


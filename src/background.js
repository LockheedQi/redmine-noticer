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
var openNotice = true
var issue_statuses = null
var trackers = null
var assign_to = 'me'
var interval = 1 
var timer = null

window.reloadConfig = function () {
  clearInterval(timer)
  getConfig()
}

getConfig()

function getConfig() {
  // 获取配置信息
  chrome.storage.sync.get({ redmineUrl: "", accessKey: "", openNotice: true, issue_statuses: null, trackers: null, assign_to: 'me', interval: 1}, (items) => {
    if (items.redmineUrl && items.accessKey) {
      redmineUrl = items.redmineUrl;
      accessKey = items.accessKey;
      openNotice = items.openNotice;
      assign_to = items.assign_to;
      interval = items.interval;
      issue_statuses = items.issue_statuses ? JSON.parse(items.issue_statuses) : null;
      trackers = items.trackers ? JSON.parse(items.trackers) : null;
      getIssues()
      startInterval()
    } else {
      console.log("请配置RedmineUrl和accessKey");
    }
  });
}

function startInterval(){
  // 每隔指定时间轮询API 更新issue列表,角标,发送通知后更新通知状态
  timer = setInterval(() => {
    getIssues()
  }, 1000 * interval);

}

function getIssues() {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  let assigned_to_id = ''
  if (assign_to != '') {
    assigned_to_id = '&assigned_to_id=' + assign_to
  }

  let status_id = ''
  if (issue_statuses) {
    issue_statuses.forEach(function (item, index) {
      if (item.checked) {
        status_id += item.id + '|'
      }
    })
    status_id = status_id != '' ? '&status_id=' + status_id : status_id
  }

  let tracker_id = ''
  if (trackers) {
    trackers.forEach(function (item, index) {
      if (item.checked) {
        tracker_id += item.id + '|'
      }
    })
    tracker_id = tracker_id != '' ? '&tracker_id=' + tracker_id : tracker_id
  }
  fetch(redmineUrl + "/issues.json?key=" + accessKey + assigned_to_id + status_id + tracker_id, requestOptions)
    .then(response => response.json())
    .then(result => {
      chrome.storage.local.get({ noticeDic: {} }, (items) => {

        // 更新角标
        window.chrome.browserAction.setBadgeText({text: result.total_count ? result.total_count + '' : ''});
        window.chrome.browserAction.setBadgeBackgroundColor({color: [102, 205, 170, 255]});
        noticedIssuesDic = items.noticeDic
        var newNoticedDic = {}
        for (var i = 0; i < result.issues.length; i++){
          let issue = result.issues[i]
          let issueId = issue.id + ''
          if (noticedIssuesDic[issueId]) {// 已经通知
              
          } else {
            if (openNotice) {
              chrome.notifications.create(null,{
                type: 'basic',
                iconUrl: '../../../icons/logo.png',
                title: issue.subject,
                message: issue.description,
              });
            }
          }
          if (openNotice) {
            newNoticedDic[issueId] = 'noticed'
          }
          
        }
        // 保存数据
        chrome.storage.local.set({noticeDic: newNoticedDic}, ()=>{

        });
      });
    })
    .catch(error => console.log('error', error));
}



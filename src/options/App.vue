<template>
  <div class="content flex-center">
    <div class="login-content flex-center" v-if="!showSettings">
      <img class="logo" src="../icons/logo.png" alt />
      <div class="url flex-center">
        <div class="title">Redmine URL</div>
        <el-input placeholder="请输入Redmine地址" v-model="redmineUrl" clearable></el-input>
        <el-tooltip class="item" effect="dark" placement="top-start" transition="el-zoom-in-bottom" :open-delay=300>
          <div slot="content">您的Redmine访问地址或域名<br/>如http://192.168.0.162</div>
          <span class="el-icon-info url-info"></span>
        </el-tooltip>
      </div>
      <div class="url flex-center">
        <div class="title">API Key</div>
        <el-input placeholder="请输入API access key" v-model="accessKey"></el-input>
        <el-tooltip class="item" effect="dark" placement="top-start" transition="el-zoom-in-bottom" :open-delay=300>
          <div slot="content">1.登录您的Redmine 原始Web页面<br>2.点击右上角'我的账号'<br>3.在页面右侧找到'API访问键'<br>4.点击'显示'即可查看您的API Key</div>
          <span class="el-icon-info url-info"></span>
        </el-tooltip>
      </div>
      <el-button class="next-step" type="primary" @click="next">下一步</el-button>
    </div>
    <div class="settings-content" v-else>
      <img class="settings-icon" src="../icons/settings.png" alt />
      <div class="options-content">
        <div class="options-item">
          <div class="options-title">开启通知:</div>
          <el-switch v-model="openNotice" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </div>
        <div class="options-item">
          <div class="options-title">状态:</div>
          <div class="options-value">
            <el-checkbox
              v-for="item in this.issue_statuses"
              v-model="item.checked"
              :key="item.id"
              :label="item.name"
              border
              size="small"
            ></el-checkbox>
          </div>
        </div>
        <div class="options-item">
          <div class="options-title">跟踪类型:</div>
          <div class="options-value">
            <el-checkbox
              v-for="item in this.trackers"
              :key="item.id"
              v-model="item.checked"
              :label="item.name"
              border
              size="small"
            ></el-checkbox>
          </div>
        </div>
        <div class="options-item">
          <div class="options-title">指派给:</div>
          <div class="options-value">
            <el-select v-model="assign_to" placeholder="请选择" size="small">
              <el-option
                v-for="item in assigns"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="options-item">
          <div class="options-title">刷新间隔:</div>
          <div class="options-value">
            <el-select v-model="interval" placeholder="请选择" size="small">
              <el-option
                v-for="item in reloadIntervals"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="buttons-content">
          <el-button class="button button-back" type="success" size="medium" @click="goBack">上一步</el-button>
          <el-button class="button" type="primary" size="medium" @click="saveConfig">保存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  props: ["isComponent"],
  data() {
    return {
      redmineUrl: "",
      accessKey: "",
      showSettings: true, //是否显示配置页面
      openNotice: true, //是否开启通知
      checked: true,
      issue_statuses: [],
      trackers: [],
      assigns: [
        {
          value: "me",
          label: "我"
        },
        {
          value: "",
          label: "不限"
        }
      ],
      assign_to: "me",
      reloadIntervals: [
        {
          value: 1,
          label: "1秒"
        },
        {
          value: 60,
          label: "1分钟"
        },
        {
          value: 600,
          label: "10分钟"
        }
      ],
      interval: 1
    };
  },
  methods: {
    next() {
      // 保存数据
      chrome.storage.sync.set(
        { redmineUrl: this.redmineUrl, accessKey: this.accessKey },
        () => {
          this.getSettings()
          // 保存成功
          this.showSettings = true;
        }
      );
    },
    goBack() {
      this.showSettings = false;
    },
    // 保存用户配置
    saveConfig() {
      chrome.storage.sync.set(
        { openNotice: this.openNotice, issue_statuses: JSON.stringify(this.issue_statuses), trackers: JSON.stringify(this.trackers), assign_to: this.assign_to, interval: this.interval},
        () => {
          this.$message({
            message: '已保存',
            type: 'success'
          });
          // 保存成功
          if (this.isComponent) {
            this.$emit("getSettings");
          }
          chrome.extension.getBackgroundPage().reloadConfig()
          chrome.extension.sendMessage({msg: "reloadConfig"});

        }
      );
    },
    getStatuses(config) {
      this.$api({
        method: "get",
        url: this.redmineUrl + "/issue_statuses.json",
        params: {
          key: this.accessKey
        }
      })
        .then(res => {
          this.issue_statuses = res.data.issue_statuses.map(item => {
            if (config){
              config.forEach(function(temp,index){
                if (temp.id == item.id){
                  item.checked = temp.checked
                }
              })
            }else{
              item.checked = true;
            }
            return item;
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    getTrackers(config) {
      this.$api({
        method: "get",
        url: this.redmineUrl + "/trackers.json",
        params: {
          key: this.accessKey
        }
      })
        .then(res => {
          this.trackers = res.data.trackers.map(item => {
            if (config){
              config.forEach(function(temp,index){
                if (temp.id == item.id){
                  item.checked = temp.checked
                }
              })
            }else{
              item.checked = true;
            }
            return item;
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    getSettings(){
      // 获取配置信息
      chrome.storage.sync.get({ redmineUrl: "", accessKey: "", openNotice: true, issue_statuses: null, trackers: null, assign_to: 'me', interval: 1}, items => {
        if (items.redmineUrl && items.accessKey) {
          this.redmineUrl = items.redmineUrl;
          this.accessKey = items.accessKey;
          this.openNotice = items.openNotice;
          this.assign_to = items.assign_to;
          this.interval = items.interval;
          this.getStatuses(items.issue_statuses ? JSON.parse(items.issue_statuses) : null);
          this.getTrackers(items.trackers ? JSON.parse(items.trackers) : null);
        }else{
          this.showSettings = false
        }
      });
    }
  },
  mounted() {
    this.getSettings()
  },
  
};
</script>

<style lang="scss" scoped>
.content {
  width: 700px;
  height: 500px;

  .login-content {
    width: 520px;
    height: 290px;
    margin: 0 auto;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 1);
    text-align: center;
    box-shadow: 0px 4px 20px 2px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0);
    flex-direction: column;

    .logo {
      width: 50px;
      height: 50px;
      margin-top: 20px;
    }

    .url {
      margin-top: 24px;

      .title {
        width: 100px;
        height: 40px;
        line-height: 40px;
        white-space: nowrap;
        color: rgba(16, 16, 16, 1);
        font-size: 14px;
        text-align: right;
        font-family: SourceHanSansSC-regular;
      }
      .el-input {
        margin-left: 10px;
        width: 340px;
        // border: 1px solid rgba(220, 223, 230, 1);
      }
      .url-info{
        width: 15px;
        font-size: 15px;
        margin-left: 10px;
        color: #bebebe;
        &:hover{
          color: #5cb6ff;
        }
      }
    }
    .next-step {
      margin-top: 20px;
      width: 120px;
    }
  }
}
.flex-center {
  display: flex;
  align-items: center;
}
.settings-content {
  width: 100%;
  height: 100%;
  .settings-icon {
    display: block;
    margin: 20px auto;
    animation: turn 5s linear infinite;
  }
  @keyframes turn {
    0% {
      -webkit-transform: rotate(0deg);
    }
    25% {
      -webkit-transform: rotate(90deg);
    }
    50% {
      -webkit-transform: rotate(180deg);
    }
    75% {
      -webkit-transform: rotate(270deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }
  .options-content {
    width: 100%;
    min-height: 200px;
    margin-top: 20px;
    .options-item,
    .buttons-content {
      display: flex;
      align-items: center;
      min-height: 50px;
      line-height: 50px;
      font-size: 14px;
      color: #222831;
      .options-title {
        width: 100px;
        text-align: right;
        margin-right: 30px;
        flex-shrink: 0;
      }
    }
    .buttons-content {
      margin-top: 80px;
      justify-content: center;
      .button {
        width: 84px;
      }
      .button-back {
        margin-right: 20px;
      }
    }
  }
}
</style>

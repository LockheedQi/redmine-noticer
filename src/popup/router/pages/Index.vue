<template>
  <div class="popup-content">
    <el-table v-if="this.redmineUrl && this.accessKey" ref="issuesTable" v-loading="loading" @expand-change='expandChange' @row-click='selectRow' element-loading-text="加载中" :data="tableData" style="width: 100%" :cell-class-name="cellClass" @row-contextmenu='rightClick'>
      <el-table-column prop="id" label="#" width="66"></el-table-column>
      <el-table-column prop="tracker.name" label="跟踪" width="60">
        <template slot-scope="scope">
          <div class="tracker-icon">
            <!-- 任务 -->
            <img v-if="scope.row.tracker.id == 5" class="tracker" src="../../../icons/task.png" alt />
            <!-- BUG -->
            <img
              v-else-if="scope.row.tracker.id == 6"
              class="tracker"
              src="../../../icons/bug.png"
              alt
            />
            <!-- 需求 -->
            <img
              v-else-if="scope.row.tracker.id == 8"
              class="tracker"
              src="../../../icons/works.png"
              alt
            />
            <!-- 工单 -->
            <img
              v-else-if="scope.row.tracker.id == 9"
              class="tracker"
              src="../../../icons/workOrder.png"
              alt
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="project.name" label="项目" width="120"></el-table-column>
      <el-table-column prop="status.name" label="状态" width="90"></el-table-column>
      <el-table-column prop="subject" label="主题"></el-table-column>
      <el-table-column prop="updated_on" :formatter="formatter" label="更新于" width="98"></el-table-column>
      <el-table-column width="20" type="expand">
        <!-- row展开的内容 -->
        <template slot-scope="scope">
          <div class="expand-content">
            <!-- issue信息 -->
            <div class="issue-info">
              <span class="info-title">优先级:</span>
              <img v-if="scope.row.priority.name == '低'" class="issue-priority" src="../../../icons/low_priority.png" alt="">
              <img v-if="scope.row.priority.name == '普通'" class="issue-priority" src="../../../icons/medium_priority.png" alt="">
              <img v-else class="issue-priority" src="../../../icons/high_priority.png" alt="">
              <span class="info-value">{{scope.row.priority.name}}</span>
              <!-- bug类型 严重程度 板块 等属性 -->
              <template v-for="(item) in scope.row.custom_fields">
                <span class="info-title" :key='"info-title" + item.id'>{{item.name}}:</span>
                <span class="info-value" :key='"info-value" + item.id'>{{item.multiple ? item.value.join() : item.value}}</span>
              </template>
              <!-- 作者 -->
              <div class="author">
                <i class="el-icon-s-custom"></i>
                <span class="info-value">{{scope.row.author.name}}</span>
              </div>
              <!-- 淡入淡出动画 -->
              <transition name="el-fade-in-linear"> 
                <div class="operation-buttons" v-if="scope.row.showEdit">
                  <!-- 关闭 -->
                  <el-tooltip class="item" effect="dark" content="标记已关闭" placement="top-start" transition="el-zoom-in-bottom" :open-delay=800>
                    <el-button v-if="scope.row.couldClose" type="danger" icon="el-icon-switch-button"  circle size="mini" @click="update(scope.row,5)"></el-button>
                  </el-tooltip>
                  <!-- 不需要解决 -->
                  <el-tooltip class="item" effect="dark" content="不需要解决" placement="top-start" transition="el-zoom-in-bottom" :open-delay=800>
                    <el-button v-if="scope.row.notNeedFix" type="info" icon="el-icon-close"  circle size="mini" @click="update(scope.row,6)"></el-button>
                  </el-tooltip>
                  <!-- 编辑 -->
                  <el-tooltip class="item" effect="dark" content="编辑" placement="top-start" transition="el-zoom-in-bottom" :open-delay=800>
                    <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="toEdit(scope.row.id)"></el-button>
                  </el-tooltip>
                  <!-- 指派给 -->
                  <el-dropdown v-if="scope.row.assignToArr && scope.row.assignToArr.count > 0" class="dropdown" trigger="click" size="small" @command="handleCommand">
                    <el-tooltip class="item" effect="dark" content="指派给" placement="top-start" transition="el-zoom-in-bottom" :open-delay=800>
                      <el-button type="warning" icon="el-icon-thumb" circle size="mini"></el-button>
                    </el-tooltip>
                    <el-dropdown-menu slot="dropdown" class="dropdown-menu">
                      <el-dropdown-item v-for="(item,index) in scope.row.assignToArr" :key="index" :command=[item.userID,scope.row]>{{item.userName}}</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <!-- 已解决 -->
                  <el-tooltip class="item" effect="dark" content="标记已解决" placement="top-start" transition="el-zoom-in-bottom" :open-delay=800>
                    <el-button type="success" icon="el-icon-check" circle size="mini" :disabled="scope.row.status.id == 3" :loading="resolvedLoading" @click="update(scope.row,3)"></el-button>
                  </el-tooltip>
                  
                </div>
              </transition>
              
            </div>
            <!-- issue描述 -->
            <div class="issue-description" v-if="scope.row.description && scope.row.description.length > 0">
              <span class="info-title">描述:</span>
              <span class="info-description">{{scope.row.description}}</span>
            </div>
            <!-- 附件 -->
            <div class="issue-attachments" v-if="scope.row.attachments && scope.row.attachments.length > 0">
              <span class="info-title">附件:</span>
              <template>
                <div @mousewheel.prevent class="attachments-img-content">
                  <el-image 
                    fit="contain"
                    v-for="(item,index) in scope.row.attachments" :key="index"
                    style="width: 100px; height: 100px;margin-right: 10px;"
                    :src="item.content_url"
                    :preview-src-list="scope.row.attachments.map(obj => {return obj.content_url})">
                  </el-image>
                </div>
              </template>
            </div>
            <!-- 历史记录 -->
            <div class="issue-journals">
              <span class="info-title">历史:</span>
              <el-timeline v-if="scope.row.journals" :reverse='true'>
                <el-timeline-item
                  v-for="(activity, index) in scope.row.journals"
                  :key="index"
                  type="primary"
                  color="#0bbd87"
                  :timestamp="activity.user.name + ' ' + dateFormatter(activity.created_on)">
                  <slot name="dot">
                    <!-- 属性变化 -->
                    <div v-for="(item,index) in activity.details" :key="index">
                      <span v-if="item.name == 'status_id'">状态: {{getStatusName(item.old_value)}} ---> <strong>{{getStatusName(item.new_value)}}</strong></span>
                      <span v-else-if="item.name == 'assigned_to_id'">指派给: {{usersInfo[item.old_value]}} ---> <strong>{{usersInfo[item.new_value]}}</strong></span>
                      <span v-else-if="item.name == 'subject'">主题: {{item.old_value}} ---> <strong>{{item.new_value}}</strong></span>
                      <span v-else-if="item.name == 'copied_from'">复制于: <strong>#{{item.new_value}}</strong></span>
                      <span v-else-if="item.name == 'done_ratio'">完成百分比:{{item.old_value}} ---> <strong>{{item.new_value}}</strong></span>
                      <span v-else-if="item.name == 'start_date'">开始日期:{{item.old_value}} ---> <strong>{{item.new_value}}</strong></span>
                      <span v-else-if="item.name == 'due_date'">计划完成日期:{{item.old_value}} ---> <strong>{{item.new_value}}</strong></span>
                    </div>
                    <!-- 备注 -->
                    <div v-if="activity.notes">备注: {{activity.notes}}</div>
                  </slot>
                </el-timeline-item>
              </el-timeline>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div v-else class="options-content">
      <options @getSettings='getSettings' :isComponent="true"></options>
    </div>
    <div class="page-content">
      <el-pagination
        :hide-on-single-page="hidePage"
        :total="total"
        :page-size="pageLimit"
        layout="prev, pager, next"
        @current-change="pageChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { log } from "util";
import moment from "moment";
import options from '../../../options/App'
export default {
  data() {
    return {
      redmineUrl: "",
      accessKey: "",
      tableData: [],
      loading: true,
      usersInfo: {},
      resolvedLoading:false,
      hidePage:true,
      pageLimit:25,
      total:0,
      assigned_to_id: '',
      status_id: '',
      tracker_id: ''
    };
  },
  components: {
    options,
  },
  mounted() {
    this.getSettings()
    var that = this
    chrome.extension.onMessage.addListener(
      function(request, sender, sendResponse) {
        if (request.msg && request.msg == 'reloadConfig'){
          that.getSettings()
        }
      }
    );
  },
  methods: {
    getSettings(){
      this.status_id = ''
      this.assigned_to_id = ''
      this.tracker_id = ''
      var that = this
      chrome.storage.sync.get({ redmineUrl: "", accessKey: "", issue_statuses: null, trackers: null, assign_to: 'me' }, (items) => {
        if (items.redmineUrl && items.accessKey) {
          this.redmineUrl = items.redmineUrl;
          this.accessKey = items.accessKey;
          if (items.assign_to != '') {
            this.assigned_to_id = '&assigned_to_id=' + items.assign_to
          }
          if (items.issue_statuses) {
            JSON.parse(items.issue_statuses).forEach(function (item, index) {
              if (item.checked) {
                that.status_id += item.id + '|'
              }
            })
            this.status_id = this.status_id != '' ? '&status_id=' + this.status_id : this.status_id
          }
          if (items.trackers) {
            JSON.parse(items.trackers).forEach(function (item, index) {
              if (item.checked) {
                that.tracker_id += item.id + '|'
              }
            })
            this.tracker_id = this.tracker_id != '' ? '&tracker_id=' + this.tracker_id : this.tracker_id
          }
          this.getIssues();
        } else {
          console.log("请配置RedmineUrl和accessKey");
        }
      });
    },
    getIssues(page) {
      this.$api({
          method: 'get',
          url: this.redmineUrl + '/issues.json?key=' + this.accessKey + this.assigned_to_id + this.status_id + this.tracker_id,
          params: {
            page: page ? page : 0,
          }
        }).then(res => {
          this.loading = false
          //添加默认值,以便Vue可以监听属性变化
          this.tableData = res.data.issues.map(item => {
            item.attachments = []
            item.couldClose = false//是否有权限关闭
            item.notNeedFix = false//是否有权限不需要解决
            item.assignToArr = []//可指派到的用户
            item.showEdit = false
            return item
          })
          this.total = res.data.total_count
          this.hidePage = res.data.total_count < this.pageLimit
          window.chrome.browserAction.setBadgeText({text: res.data.total_count ? res.data.total_count + '' : ''});
          window.chrome.browserAction.setBadgeBackgroundColor({color: [102, 205, 170, 255]});          
        }).catch(err => {
          this.loading = false
          console.log(err)
      })
    },
    cellClass({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 4 || columnIndex == 5) {
        return columnIndex == 4 ? "subject text-left" : "subject";
      }
    },
    formatter(row, column, cellValue, index) {
      return this.dateFormatter(cellValue)
    },
    dateFormatter(val){
      return moment(val).format("YYYY-MM-DD HH:mm:ss");
    },
    selectRow(row, column, event){
      this.$refs.issuesTable.toggleRowExpansion(row);
    },
    expandChange(row,expandedRows){
      // 展开row
      if (expandedRows.indexOf(row) != -1){
        this.getIssueDetail(row)
      }
    },
    // 获取issue详情
    getIssueDetail(row){
      this.$api({
          method: 'get',
          url: this.redmineUrl + '/issues/' + row.id + '.json',
          params: {
            key: this.accessKey,
            include: 'attachments,journals'
          }
        }).then(res => {
          row.attachments = res.data.issue.attachments
          row.journals = res.data.issue.journals
          this.getUsers(row.journals)
        }).catch(err => {
          console.log(err)
      })
      //获取编辑页面
      this.getIssueEdit(row)
    },
    getStatusName(statusId){
      switch(statusId){
        case '1':
          return '激活'
        case '3':
          return '已解决'
        case '5':
          return '已关闭'
        case '6':
          return '不需要解决'
        case '7':
          return '后期优化解决'
        default:
          return ''
      }
    },
    getUsers(journals){
      journals.map(item => {
        if (item.details[0] && item.details[0].name == 'assigned_to_id'){
          let userIdOld = item.details[0].old_value
          let userIdNew = item.details[0].new_value
          this.getUserInfo(userIdOld)
          this.getUserInfo(userIdNew)
        }
        return item
      })
    },
    // 获取编辑页面
    getIssueEdit(row){
      this.$api({
        method:'get',
        url: this.redmineUrl + '/issues/' + row.id + '/edit',
        params: {
          key: this.accessKey
        }
      }).then(res => {
        // 遍历option 如果存在'已关闭'且value为5的话,显示关闭按钮
        var el = document.createElement( 'html' );
        el.innerHTML = res.data
        el.getElementsByTagName('select').forEach(function(item,index){
          // 状态
          if (item.name == 'issue[status_id]'){
            item.getElementsByTagName('option').forEach(function(option,index){
              if (option.innerHTML == '已关闭'){
                row.couldClose = true
              }else if (option.innerHTML == '不需要解决'){
                row.notNeedFix = true
              }
            })
          }
          // 指派给
          else if (item.name == 'issue[assigned_to_id]'){
            row.assignToArr = []
            item.getElementsByTagName('option').forEach(function(option,index){
              if (option.innerHTML.indexOf('&') == -1){
                row.assignToArr.push({
                  userName:option.innerHTML,
                  userID:option.value
                })
              }
            })
          }
        })
        row.showEdit = true
      }).catch(err => {
        row.showEdit = true
      })
    },
    // 获取用户资料
    getUserInfo(userId){
      this.$api({
          method: 'get',
          url: this.redmineUrl + '/users/' + userId + '.json',
          params: {
            key: this.accessKey
          }
        }).then(res => {
          this.usersInfo = Object.assign({},this.usersInfo,{
            [userId]: res.data.user.lastname + res.data.user.firstname
          })
          console.log(this.usersInfo)
        }).catch(err => {
          console.log(err)
      })
    },
    //点击"指派给"下拉菜单选项
    handleCommand(values){
      let userID = values[0]
      let row = values[1]
      this.update(row,row.status.id,userID)
    },
    rightClick(row, column, event){
      event.preventDefault()
    },
    // 进入redmine编辑页面
    toEdit(issueId){
      chrome.tabs.create({url: this.redmineUrl + '/issues/' + issueId});
    },
    // 更新issue row:所在行的数据 status_id:状态 assigned_to_id:指派给
    update(row,status_id,assigned_to_id){
      this.resolvedLoading = true
      this.$api({
        method: 'put',
        headers: {
          'Content-Type':'application/json'
        },
        url: this.redmineUrl + '/issues/' + row.id + '.json',
        params: {
          key: this.accessKey
        },
        data: JSON.stringify({
          "issue": {
            "status_id": status_id,
            "assigned_to_id": assigned_to_id ? assigned_to_id : row.assigned_to.id
          }
        })
      }).then(res => {
        this.resolvedLoading = false
        this.$message({
          message: status_id == 3 ? '已标记解决' : '已关闭',
          type: 'success'
        });
        this.getIssues()
        
      }).catch(err => {
        this.resolvedLoading = false
        this.$message.error(err);
    })
    },
    // 切换分页
    pageChange(page){
      this.getIssues(page)
      window.scrollTo(0,0);
    }
  }
};
</script>

<style lang="scss" scoped>
.popup-content {
  width: 760px;
  margin-bottom: 20px;
  .tracker-icon {
    display: flex;
    height: 100%;
    align-items: center;
    img {
      margin: auto;
      width: 20px;
      height: 20px;
    }
  }
  .options-content{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .expand-content{
    padding-bottom: 20px;
    background-color: #eef5f9;
  }
  .issue-info,.issue-description,.issue-attachments,.issue-journals{
    display: flex;
    align-items: center;
    .issue-priority{
      width: 18px;
      margin-left: 5px;
    }
    .info-title{
      font-size: 13px;
      color: #aaa;
      margin-left: 10px;
    }
    .info-value{
      font-size: 13px;
      color: #101010;
      margin-left: 4px;
      font-weight: bold;
      color: #08b9ff;
    }
    .operation-buttons{
      margin-right: 10px;
      position: absolute;
      right: 0;
      .dropdown{
        margin: 0 10px;
      }
    }
    .author{
      margin-left: 10px;
      .info-value{
        margin-left: 0;
        color: gray;
        font-size: 10px;
        font-weight: normal;
      }
    }
  }
  .issue-info{
    height: 40px;
  }
  .issue-description{
    margin-top: 10px;
    .info-title{
      flex-shrink: 0;
    }
    .info-description{
      text-align: left;
      margin-left: 15px;
      margin-right: 10px;
    }
  }
  .issue-attachments{
    margin-top: 10px;
    .attachments-img-content{
      margin-left: 15px;
    }
  }
  .issue-journals{
    text-align: left;
    margin-top: 10px;
    .info-title{
      flex-shrink: 0;
    }
    div,span{
      font-size: 12px;
    }
  }
  .page-content{
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
  }
}
</style>

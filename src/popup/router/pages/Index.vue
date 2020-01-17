<template>
  <div class="popup-content">
    <el-table v-if="this.redmineUrl && this.accessKey" ref="issuesTable" v-loading="loading" @row-click='selectRow' element-loading-text="加载中" :data="tableData" style="width: 100%" :cell-class-name="cellClass">
      <el-table-column prop="id" label="#" width="66"></el-table-column>
      <el-table-column prop="tracker.name" label="跟踪" width="60">
        <template slot-scope="scope">
          <div class="tracker-icon">
            <img v-if="scope.row.tracker.id == 5" class="tracker" src="../../../icons/task.png" alt />
            <img
              v-else-if="scope.row.tracker.id == 6"
              class="tracker"
              src="../../../icons/bug.png"
              alt
            />
            <img
              v-else-if="scope.row.tracker.id == 8"
              class="tracker"
              src="../../../icons/works.png"
              alt
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="project.name" label="项目" width="120"></el-table-column>
      <el-table-column prop="status.name" label="状态" width="90"></el-table-column>
      <el-table-column prop="subject" label="主题"></el-table-column>
      <el-table-column prop="updated_on" :formatter="dateFormatter" label="更新于" width="98"></el-table-column>
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
              <template v-for="(item) in scope.row.custom_fields">
                <span class="info-title" :key='item.id'>{{item.name}}:</span>
                <span class="info-value" :key='item.id'>{{item.multiple ? item.value.join() : item.value}}</span>
              </template>
            </div>
            <!-- issue描述 -->
            <div class="issue-description">
              <span class="info-title">描述:</span>
              <span class="info-description">{{scope.row.description}}</span>
            </div>
            <div class="issue-journals"></div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div v-else class="options-content">
      <options @getSettings='getSettings'></options>
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
      loading: true
    };
  },
  components: {
    options,
  },
  mounted() {
    this.getSettings()
  },
  methods: {
    getSettings(){
      chrome.storage.sync.get({ redmineUrl: "", accessKey: "" }, (items) => {
        if (items.redmineUrl && items.accessKey) {
          this.redmineUrl = items.redmineUrl;
          this.accessKey = items.accessKey;
          
          this.getIssues();
        } else {
          console.log("请配置RedmineUrl和accessKey");
        }
      });
    },
    getIssues() {
      this.$api({
          method: 'get',
          url: this.redmineUrl + '/issues.json',
          params: {
            key: this.accessKey
          }
        }).then(res => {
          this.loading = false
          this.tableData = res.data.issues
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
    dateFormatter(row, column, cellValue, index) {
      return moment(cellValue).format("YYYY-MM-DD HH:mm:ss");
    },
    selectRow(row, column, event){
      this.$refs.issuesTable.toggleRowExpansion(row);
    },
  }
};
</script>

<style lang="scss" scoped>
.popup-content {
  width: 770px;
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
  .issue-info,.issue-description{
    display: flex;
    height: 30px;
    align-items: center;
    background-color: #eef5f9;
    .issue-priority{
      width: 18px;
      margin-left: 2px;
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
  }
  .issue-description{
    height: auto;
    .info-title{
      flex-shrink: 0;
    }
    .info-description{
      text-align: left;
    }
  }
}
</style>

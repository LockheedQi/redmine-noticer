<template>
  <div class="popup-content">
    <el-table :data="tableData" style="width: 100%" :cell-class-name="cellClass">
      <el-table-column prop="id" label="#" width="66"></el-table-column>
      <el-table-column prop="tracker.name" label="跟踪" width="60"></el-table-column>
      <el-table-column prop="project.name" label="项目" width="120"></el-table-column>
      <el-table-column prop="status.name" label="状态" width="90"></el-table-column>
      <el-table-column prop="description" label="主题"></el-table-column>
      <el-table-column prop="updated_on" :formatter="dateFormatter" label="更新于" width="92"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { log } from "util";
import moment from "moment";
export default {
  data() {
    return {
      tableData: [
        {
          id: 16994,
          project: {
            id: 19,
            name: "在线教育"
          },
          tracker: {
            id: 5,
            name: "任务"
          },
          status: {
            id: 1,
            name: "激活"
          },
          priority: {
            id: 2,
            name: "普通"
          },
          author: {
            id: 14,
            name: "祁兴辉"
          },
          assigned_to: {
            id: 14,
            name: "祁兴辉"
          },
          subject: "2020年1月工作任务",
          description:
            "【星火英语-线上问题】主观题自判，未选择评分标准或未全部选择时，点击确认答案，提示信息白色和页面背景一致，不容易看出错误信息",
          start_date: "2020-01-01",
          due_date: "2020-01-30",
          done_ratio: 40,
          estimated_hours: 100.0,
          custom_fields: [
            {
              id: 5,
              name: "任务隶属",
              value: "计划"
            }
          ],
          created_on: "2020-01-04T05:19:17Z",
          updated_on: "2020-01-11T05:43:51Z"
        },
        {
          id: 16994,
          project: {
            id: 19,
            name: "在线教育"
          },
          tracker: {
            id: 6,
            name: "BUG"
          },
          status: {
            id: 1,
            name: "激活"
          },
          priority: {
            id: 2,
            name: "普通"
          },
          author: {
            id: 14,
            name: "祁兴辉"
          },
          assigned_to: {
            id: 14,
            name: "祁兴辉"
          },
          subject: "2020年1月工作任务",
          description: "我是一个bug",
          start_date: "2020-01-01",
          due_date: "2020-01-30",
          done_ratio: 40,
          estimated_hours: 100.0,
          custom_fields: [
            {
              id: 5,
              name: "任务隶属",
              value: "计划"
            }
          ],
          created_on: "2020-01-04T05:19:17Z",
          updated_on: "2020-01-11T05:43:51Z"
        }
      ]
    };
  },
  methods: {
    cellClass({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 4 || columnIndex == 5) {
        return "description";
      }
    },
    dateFormatter(row, column, cellValue, index) {
      return (this.tableData[0].updated_on = moment(cellValue).format(
        "YYYY-MM-DD HH:mm:ss"
      ));
    }
  }
};
</script>

<style lang="scss" scoped>
.popup-content {
  width: 780px;
  background: red;

  .cellClass {
    background: red;
  }
}
</style>

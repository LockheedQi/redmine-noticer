<template>
  <div class="content flex-center">
    <div class="login-content flex-center">
      <img class="logo" src="../icons/logo.png" alt />
      <div class="url flex-center">
        <div class="title">Redmine URL</div>
        <el-input
          placeholder="请输入Redmine地址"
          v-model="redmineUrl">
        </el-input>
      </div>
      <div class="url flex-center">
        <div class="title">API Key</div>
        <el-input
          placeholder="请输入API access key"
          v-model="accessKey">
        </el-input>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data(){
    return{
      redmineUrl:'',
      accessKey:''
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  width: 700px;
  height: 500px;

  .login-content {
    width: 510px;
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

    .url{
      margin-top: 24px;
      
      .title{
        width: 100px;
        height: 40px;
        line-height: 40px;
        white-space: nowrap;
        color: rgba(16, 16, 16, 1);
        font-size: 14px;
        text-align: right;
        font-family: SourceHanSansSC-regular;
      }
      .el-input{
        margin-left: 28px;
        width: 313px;
        // border: 1px solid rgba(220, 223, 230, 1);
      }
    }
  }
}
.flex-center {
  display: flex;
  align-items: center;
}
</style>

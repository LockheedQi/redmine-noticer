<template>
  <div class="content flex-center">
    <div class="login-content flex-center">
      <img class="logo" src="../icons/logo.png" alt />
    </div>
  </div>
</template>

<script>
export default {
  name: "App"
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
  }
}
.flex-center {
  display: flex;
  align-items: center;
}
</style>

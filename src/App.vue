<template>
  <div id="app">
      <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>


<style lang="scss">

html,
body {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;

  #app {
    width: 100%;
    height: 100%;
}
}

.el-select-dropdown .popper__arrow {
  display: none;
}
.el-popper[x-placement^=bottom] {
   margin-top: 1px;
}
.el-form-item__content{
  line-height:0;
}
.el-loading-mask{
  // background-color: rgba(0, 0, 0, 0)
}
.el-dialog__body {
    padding: 14px 20px 0 20px;
}
.el-dialog__footer {
    padding: 0px 15px 14px;
}
.el-input-group--append .el-input__inner, .el-input-group__prepend {
    box-shadow: 0 0 8.7px 0.3px rgba(153, 179, 193, 0.26);
    outline:none;
}
.el-form--label-top .el-form-item__label {
    padding: 0 0 0px;
}
.el-checkbox-button--mini .el-checkbox-button__inner {
    padding: 7px 11px;
}

.el-dialog__wrapper .el-form-item {
    margin-bottom: 0px;
}
.el-dialog__header {
    display: none;
}
.el-checkbox-button:first-child .el-checkbox-button__inner {
    border-radius: 0;
}
.el-checkbox-button:last-child .el-checkbox-button__inner {
    border-radius: 0;
}
.el-checkbox-button--mini .el-checkbox-button__inner {
    padding: 7px 8px;
}
.el-checkbox-button__inner{
     border-left: 1px solid #dcdfe6;
}
.el-checkbox-button, .el-checkbox-button__inner {
    margin: 1px 1px;
}
</style>

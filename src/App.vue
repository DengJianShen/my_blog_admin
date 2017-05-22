<template>
  <div id="app" class="app">
    <el-row>
      <!--侧边栏-->
      <el-col :xs="24" :sm="4" :md="4" :lg="4">
        <div class="grid-content bg-purple-dark">
          <RoleBox :role="role"></RoleBox>
          <el-menu default-active="start" @select="togglePage">
            <el-menu-item index="start"><i class="iconfont">&#xe604;</i>首页</el-menu-item>
            <el-menu-item index="tag"><i class="iconfont">&#xe60f;</i>标签管理</el-menu-item>
            <el-menu-item index="article"><i class="iconfont">&#xe633;</i>文章管理</el-menu-item>
            <el-menu-item index="notice"><i class="iconfont">&#xe66e;</i>公告管理</el-menu-item>
            <el-menu-item index="comment"><i class="iconfont">&#xe69d;</i>评论管理</el-menu-item>
            <el-menu-item index="message"><i class="iconfont">&#xe61d;</i>留言管理</el-menu-item>
          </el-menu>
        </div>
      </el-col>
      <!--内容栏-->
      <el-col :xs="24" :sm="20" :md="20" :lg="20">
        <div class="grid-content bg-purple-light">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import RoleBox from './components/RoleBox'
  export default {
    data() {
      return {
        'role': {
          'name': 'JameDeng',
          'role': '超级管理员'
        }
      }
    },
    mounted() {
      this.$router.push({
        path: '/signin'
      });
    },
    methods: {
      togglePage(index) {
        this.$router.push({
          path: "/" + index
        });
      }
    },
    components: {
      RoleBox
    }
  }
</script>

<style>
  * {
    margin: 0;
    padding: 0;
  }
  
  html,
  body,
  .app {
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    width: 100%;
    height: 100%;
  }
  
  @font-face {
    font-family: 'iconfont';
    /* project id 296082 */
    src: url('//at.alicdn.com/t/font_erkl49dzt98jjor.eot');
    src: url('//at.alicdn.com/t/font_erkl49dzt98jjor.eot?#iefix') format('embedded-opentype'), url('//at.alicdn.com/t/font_erkl49dzt98jjor.woff') format('woff'), url('//at.alicdn.com/t/font_erkl49dzt98jjor.ttf') format('truetype'), url('//at.alicdn.com/t/font_erkl49dzt98jjor.svg#iconfont') format('svg');
  }
  
  .iconfont {
    font-family: "iconfont";
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
  }
  
  .app .bg-purple-dark {
    background-color: #2f4050;
  }
  
  .app .bg-purple {
    background-color: #d3dce6;
  }
  
  .app .bg-purple-light {
    background-color: #f3f3f4;
  }
  
  .app .grid-content {
    height: 100vh;
    overflow: scroll;
  }
  
  .app .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  
  .app .el-menu {
    background-color: transparent !important;
  }
  
  .app .el-menu-item {
    color: #a7b1c2;
  }
  
  .app .el-menu-item.is-active {
    color: #fff;
    background-color: #293846;
  }
  
  .app .el-menu-item.is-active:after {
    content: '';
    display: block;
    height: 100%;
    width: 4px;
    position: absolute;
    right: 0;
    background-color: #19aa8d;
    top: 0;
  }
  
  .app .el-menu-item:hover {
    color: #fff;
    background-color: #293846;
  }
  
  .app .el-menu-item .iconfont {
    margin-right: 10px;
  }
  
  .app .el-pagination {
    text-align: center;
    padding: 15px 0;
  }
  
  .app .el-form-item {
    margin-bottom: 0;
  }
  
  .app .edit-form .edit-form__btn-group,
  .app .edit-form .edit-form__input {
    margin: 0;
    width: 100%;
    margin-top: 15px;
  }
  
  .app .edit-form .edit-form__btn-group .el-form-item__content {
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: space-between;
    justify-content: space-between;
  }
</style>

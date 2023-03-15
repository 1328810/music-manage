<template>
  <div class="header">
    <!-- 折叠图片 -->
    <div class="collapse-btn" @click="collpaseChange">
      <i class="el-icon-menu"></i>
    </div>
    <div class="logo">音乐后台管理系统</div>
    <div class="header-right">
      <div class="btn-fullscreen" @click="handleFullScreen">
        <el-tooltip :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
          <i class="el-icon-rank"></i>
        </el-tooltip>
      </div>
      <div class="user-avator">
        <img src="../assets/img/user-avator-001.png" alt="">
      </div>
      <el-dropdown class="user-name" trigger="click" @command="hadleCommand">
        <span class="el-dropdown-link">
          {{userName}}
          <i class="el-icon-caret-bottom"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import bus from "../assets/js/bus"

export default {
  data() {
    return{
      collpase:false,
      fullscreen:false
    }
  },
  computed:{
    userName(){
      return localStorage.getItem('userName')
    }
  },  
  methods:{
    // 侧边栏折叠
    collpaseChange(){
      this.collpase = !this.collpase;
      bus.$emit('collapse',this.collpase)
    },
    // 全屏事件
    handleFullScreen(){
      // 浏览器的兼容问题
      if(this.fullscreen){
        if(document.exitFullscreen){
          document.exitFullscreen()
        }else if(document.webitCancelFullScreen){
          document.webitCancelFullScreen();
        }else if(document.mozCancelFullScreen){
          document.mozCancelFullScreen()
        }else if(document.msExitFullScreen){
          document.msExitFullScreen()
        }
      }else{
        let element = document.documentElement;
        if(element.requestFullscreen){
          element.requestFullscreen();
        }else if(element.webitCancelFullScreen){
          element.webitCancelFullScreen()
        }else if(element.mozCancelFullScreen){
          element.mozCancelFullScreen()
        }else if(msExitFullScreen){
          document.msExitFullScreen()
        }
      }
      this.fullscreen = !this.fullscreen
    },
    hadleCommand(command){
      if(command == "logout"){
        localStorage.removeItem("userName")
        this.$router.push("/")
      }
    }
  }
}
</script>

<style scoped>
.header {
  position: relative;
  background-color: #253041;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
}
.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}
.header .logo {
  float: left;
  line-height: 70px;
}
.header-right {
  float: right;
  padding-right:50px ;
  display: flex;
  height: 70px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.user-name {
  margin-left: 10px;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
</style>
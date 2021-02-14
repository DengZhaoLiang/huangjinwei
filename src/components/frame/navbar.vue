<template>
  <el-container>
    <el-header>
      <el-row align="middle" class="nav" type="flex">
        <el-col :lg="5" :md="5" :sm="2" :xs="0" class="box hidden-xs-only"><img @click="toHome()"
                                                                                class="image"
                                                                                src="../../../static/logo.png" alt=""></el-col>
        <el-col :lg="8" :md="10" :sm="13" :xs="16">
          <el-menu :default-active="$route.path" active-text-color="#4F6E9D" mode="horizontal" :router=true>
            <el-menu-item index="/home">首页</el-menu-item>
            <el-menu-item index="/category">书籍分类</el-menu-item>
          </el-menu>
        </el-col>
        <el-col :lg="4" :md="2" :sm="2" :xs="0" class="box hidden-md-and-down">
          <el-input @confirm="toSearch()" active-text-color="#4F6E9D" class="search1 search2 search3"
                    placeholder="输入书名搜索书籍"
                    prefix-icon="el-icon-search" size="small" v-model="input">
          </el-input>
        </el-col>

        <el-col :lg="3" :md="2" :sm="3" :xs="0" class="box hidden-xs-only">
          <div v-if="this.$cookies.get('status') === 'unlogin' || !this.$cookies.get('status')">
            <el-button @click="toLogin()" circle class="myButton el-icon-user"></el-button>
          </div>

          <div v-if="this.$cookies.get('status') === 'logined'">
            <el-dropdown>
              <el-avatar :src="this.$cookies.get('Avatar')" @error="errorHandler"></el-avatar>

              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-setting"><label @click="setting()">个人中心</label></el-dropdown-item>
                <el-dropdown-item icon="el-icon-circle-close"><label @click="exit()">退出登录</label></el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-col>

        <el-col :lg="4" :md="5" :sm="4" :xs="8">
          <div style="display: flex;">
            <div @click="toCart()" class="cart"><i class="el-icon-s-goods cartIcon"></i>购物车</div>
            <div @click="toOrder()" class="order"><i class="el-icon-s-order orderIcon"></i>订单</div>
          </div>
        </el-col>
      </el-row>
    </el-header>

    <el-main>
      <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in">
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
      </transition>
      <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in">
        <router-view v-if="!$route.meta.keepAlive"></router-view>
      </transition>
    </el-main>

    <el-footer class="footer" height="220px" v-show="$route.name!=='login' && $route.name!=='register'">
      <el-row>
        <el-col :span="10" style="text-align: center;">
          <div class="logo">
            <img class="favicon" src="../../../static/favicon.png" alt="">
            SMALLFROG
          </div>
          <p class="description">What books are you looking for? SMALLFROG is a bookstore for book lovers to read and
            buy the books they are fond of.</p>
          <div style="display: inline-block;">
            <img class="socialImg" src="../../../static/social-facebook.png" alt="">
            <img class="socialImg" src="../../../static/social-instagram.png" alt="">
            <img class="socialImg" src="../../../static/social-twitter.png" alt="">
          </div>
        </el-col>
        <el-col :span="14">
          <div class="right">
            <dl>
              <dd>关于我们</dd>
              <dd>联系我们</dd>
              <dd>用户协议</dd>
            </dl>
            <dl>
              <dd>加入我们</dd>
              <dd>友情链接</dd>
              <dd>隐私政策</dd>
            </dl>
            <dl>
              <dd>购物指南</dd>
              <dd>帮助中心</dd>
              <dd>书店地址</dd>
            </dl>
          </div>
          <el-link href="http://www.beian.miit.gov.cn">桂ICP备20001659号</el-link>
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
</template>

<script>
  import 'element-ui/lib/theme-chalk/display.css'

  export default {
    inject: ['reload'],
    data () {
      return {
        input: ''
      }
    },
    methods: {
      toSearch () {

      },
      toLogin () {
        this.$router.push({
          path: '/login'
        })
      },
      toHome () {
        this.$router.push({
          path: '/'
        })
      },
      toCart () {
        if (this.$cookies.get('status') === 'logined') {
          this.$router.push({
            path: '/shopping/cart'
          })
        } else {
          this.$confirm('您尚未登录！', 'smallFrog', {
            confirmButtonText: '去登陆',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$router.push({
              path: '/login'
            })
          })
        }
      },
      toOrder () {
        if (this.$cookies.get('status') === 'logined') {
          this.$router.push({
            path: '/order'
          })
        } else {
          this.$confirm('您尚未登录！', 'smallFrog', {
            confirmButtonText: '去登陆',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$router.push({
              path: '/login'
            })
          })
        }
      },
      setting () {
        this.$router.push({
          path: '/setting'
        })
      },
      exit () {
        this.$cookies.set('status', 'unlogin')
        this.$cookies.remove('user_ID')
        this.$cookies.remove('Avatar')
        this.reload()
      },
      errorHandler () {
        return true
      }
    }
  }
</script>

<style>
  .nav {
    top: 0;
    left: 0;
    right: 0;
    background-color: #FFFFFF;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    position: fixed;
    z-index: 999;
  }
  .nav .box {
    background-color: #FFFFFF;
    text-align: center;
    color: #4F6E9D;
    font-size: 20px;
    cursor: pointer;
  }

  .nav .box .image {
    width: 200px;
    margin-left: 15px;
  }

  .nav .box .myButton:focus,
  .nav .box .myButton:hover {
    color: #FFFFFF;
    border-color: #7E9DCA;
    background-color: #7E9DCA;
  }

  .nav .box .myButton:active {
    color: #FFFFFF;
    border-color: #7E9DCA;
    outline: 0;
  }

  .nav .cart {
    width: 50%;
    height: 60px;
    line-height: 60px;
    text-align: center;
    color: #F5f5f5;
    background-color: #4F6E9D;
    font-size: 15px;
    cursor: pointer;
    /* box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); */
  }

  .nav .cart:hover {
    background-color: #7E9DCA;
  }

  .nav .cartIcon {
    font-size: 18px;
    margin-right: 10px;
  }

  .nav .order {
    width: 50%;
    height: 60px;
    line-height: 60px;
    text-align: center;
    color: #F5f5f5;
    background-color: #4F6E9D;
    font-size: 15px;
    cursor: pointer;
    /* box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); */
  }

  .nav .order:hover {
    background-color: #7E9DCA;
  }

  .nav .orderIcon {
    font-size: 18px;
    margin-right: 10px;
  }

  .footer {
    background-color: #F2F6FC;
    text-align: center;
  }

  .footer .logo {
    margin-top: 30px;
    font-size: 22px;
    font-weight: 600;
    color: #303133;
  }

  .footer .logo .favicon {
    width: 35px;
    margin-right: 10px;
  }

  .footer .description {
    text-align: justify;
    width: 70%;
    margin-left: 100px;
    color: #303133;
  }

  .footer .socialImg {
    width: 25px;
    margin-left: 10px;
    margin-right: 10px;
  }

  .footer .right {
    display: flex;
  }

  .footer dl {
    margin-top: 30px;
    margin-left: 120px;
    line-height: 40px;
    color: #303133;
  }
</style>

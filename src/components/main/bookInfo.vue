<template>
  <div>
    <div class="pageHeader">
      <el-page-header @back="goBack" content="书籍详情"></el-page-header>
    </div>
    <div class="bookInfo" v-loading="loading">
      <el-card class="box-card leftInfo">
        <img :src="bookInfo.image" alt="" style="height: 310px;">
        <div style="display: flex; margin-top: 20px; align-items: center;">
          <div style="color: #606266;">推荐程度：</div>
          <el-rate disabled style="margin-top: 4px;" v-model="bookInfo.commend"></el-rate>
        </div>
      </el-card>
      <div class="rightInfo" style="position: relative;">
        <div class="bookName">{{ bookInfo.name }}</div>
        <div class="authorName">{{ bookInfo.author }}</div>
        <div style="display: flex; margin-top: 50px; align-items: center;">
          <div style="color: #606266;">售价：</div>
          <div class="bookPrice">¥ {{ bookInfo.price }}</div>
        </div>
        <div style="display: flex; margin-top: 50px; align-items: flex-end;">
          <div style="color: #606266;">库存数量：</div>
          <div>{{ bookInfo.inventory }}</div>
        </div>
        <div style="position: absolute; bottom: 0;">
          <div style="display: flex; align-items: center;">
            <div style="color: #606266;">数量：</div>
            <el-input-number :max="bookInfo.inventory" :min="1" v-model="num"></el-input-number>
          </div>
          <div style="display: flex; margin-top: 40px;">
            <el-button @click="addToCart(bookInfo)" class="buyButton1">加入购物车</el-button>
            <el-button @click="toSettle(bookInfo)" class="buyButton2" style="margin-left: 30px;">立即购买</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import request from '../../utils/request'

  export default {
    data () {
      return {
        loading: true,
        bookInfo: {},
        num: 1,
        cart: [[]]
      }
    },
    created () {
      this.getInfo()
    },
    methods: {
      getInfo () {
        request.get(`/api/book/${this.$route.query.id}`)
          .then(res => {
            if (res.status === 200) {
              this.bookInfo = res.data
            } else {
              this.$message.error(res.message)
            }
          })
        this.loading = false
      },
      goBack () {
        this.$router.go(-1)
      },
      addToCart (book) {
        if (this.$cookies.get('userInfo')) {

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
      setCart () {
        this.cart[0]['userId'] = this.$cookies.get('userInfo').id
        this.cart[0]['bookId'] = this.bookInfo.id
        this.cart[0]['bookName'] = this.bookInfo.name
        this.cart[0]['bookImage'] = this.bookInfo.image
        this.cart[0]['bookPrice'] = this.bookInfo.price
        this.cart[0]['count'] = this.num
      },
      toSettle () {
        if (this.$cookies.get('userInfo')) {
          this.setCart()

          this.$router.push({
            path: '/shopping/settle',
            query: {
              cart: this.cart
            }
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
      }
    }
  }
</script>

<style>
  .bookInfo {
    justify-content: center;
    margin-top: 50px;
    margin-bottom: 80px;
    display: flex;
  }

  .leftInfo {
    margin-left: 0;
    height: 400px;
  }

  .rightInfo {
    width: 400px;
    height: 400px;
    margin-left: 150px;
    padding-left: 30px;
  }

  .bookName {
    font-size: 23px;
    font-weight: 600;
  }

  .authorName {
    margin-top: 20px;
    color: #909399;
  }

  .bookPrice {
    color: #c00000;
    font-size: 23px;
    font-weight: 600;
  }

  .buyButton1 {
    width: 150px;
    background-color: #4F6E9D;
    color: #FFFFFF;
    outline: none;
    border-color: #4F6E9D;
    border-radius: 0;
  }

  .buyButton1:focus,
  .buyButton1:hover {
    background-color: #7e9dca;
    border-color: #7e9dca;
    color: #FFFFFF;
    outline: none;
  }

  .buyButton2 {
    width: 150px;
    outline: none;
    border-radius: 0;
    color: #4f6e9d;
  }

  .buyButton2:focus,
  .buyButton2:hover {
    background-color: #7e9dca;
    border-color: #7e9dca;
    color: #FFFFFF;
    outline: none;
  }
</style>

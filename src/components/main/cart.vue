<template>
  <div>
    <el-row align="middle" type="flex">
      <el-col :span="4">
        <img alt="" class="bannerLogo" src="../../../static/shoppingCart.jpg">
      </el-col>
      <el-col :span="20">
        <div class="banner">
          <div class="prompt_a">购物车</div>
          <div class="prompt_b">温馨提示：产品是否购买成功，以最终下单为准哦，请尽快结算</div>
        </div>
      </el-col>
    </el-row>
    <div class="cart_line"></div>

    <div>
      <div :style="this.carts.length < 3 ? 'height: 455px' : ''" class="list" v-if="this.carts.length !== 0">
        <el-row align="middle" type="flex">
          <el-col :span="3" class="title">商品图片</el-col>
          <el-col :span="9" class="title">商品名称</el-col>
          <el-col :span="3" class="title">单价</el-col>
          <el-col :span="3" class="title">数量</el-col>
          <el-col :span="3" class="title">小计</el-col>
          <el-col :span="3" class="title">操作</el-col>
        </el-row>

        <div :key="index" v-for="(cart, index) in carts">
          <el-row align="middle" type="flex">
            <el-col :span="3" class="bookRow">
              <img :src="cart.book.image" alt="" class="bookImg">
            </el-col>
            <el-col :span="9" class="bookRow">{{ cart.book.name }}</el-col>
            <el-col :span="3" class="bookRow">{{ cart.book.price }}</el-col>
            <el-col :span="3" class="bookRow">{{ cart.purchaseNum }}</el-col>
            <el-col :span="3" class="bookRow">{{ cart.book.price * cart.purchaseNum }}</el-col>
            <el-col :span="3" class="bookRow">
              <el-button @click="cartDelete(cart.book, index)" circle icon="el-icon-delete" type="danger"></el-button>
            </el-col>
          </el-row>
        </div>

        <div class="summary">
          <el-row align="middle" type="flex">
            <el-col :span="6">
              <div class="number">共 {{ count }} 件商品</div>
            </el-col>
            <el-col :span="14">
              <div class="price">合计（不含运费）：{{ totalPrice }} 元</div>
            </el-col>
            <el-col :span="4" class="settlement">
              <div @click="toSettle()">结算</div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>

    <div style="height: 455px" v-if="this.carts.length === 0">
      <div class="list">
        <el-row align="middle" type="flex">
          <el-col :span="3" class="title">商品图片</el-col>
          <el-col :span="9" class="title">商品名称</el-col>
          <el-col :span="3" class="title">单价</el-col>
          <el-col :span="3" class="title">数量</el-col>
          <el-col :span="3" class="title">小计</el-col>
          <el-col :span="3" class="title">操作</el-col>
        </el-row>

        <el-row align="middle" type="flex">
          <el-col :span="24" class="title">暂无商品噢，赶紧去添加吧！</el-col>
        </el-row>
      </div>

      <div class="summary">
        <el-row align="middle" type="flex">
          <el-col :span="6">
            <div class="number">共 0 件商品</div>
          </el-col>
          <el-col :span="14">
            <div class="price">合计（不含运费）：0 元</div>
          </el-col>
          <el-col :span="4" class="settlement">
            <div @click="toSettle()">结算</div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    inject: ['reload'],
    data () {
      return {
        carts: [],
        count: 0,
        totalPrice: 0
      }
    },
    created () {
      // 获取购物车数据
      let carts = this.$cookies.get('carts') ? JSON.parse(this.$cookies.get('carts')) : []
      console.log(carts)
      this.carts = carts
      // 计算商品数量已经总价格
      this.count = this.carts.length
      let total = 0
      carts.forEach(cart => {
        total += cart.book.price * cart.purchaseNum
      })
      this.totalPrice = total
    },
    methods: {
      cartDelete (book, index) {
        let carts = this.carts
        carts.splice(index, 1)
        this.$cookies.set('carts', JSON.stringify(carts))
        console.log('删除成功')
        this.$message({
          showClose: true,
          message: '删除成功！',
          type: 'success',
          center: true
        })
        this.reload()
      },
      toSettle () {
        if (this.carts.length === 0) {
          this.$message({
            showClose: true,
            message: '购物车里还没有商品噢！',
            type: 'warning',
            center: true
          })
        } else {
          this.$router.push({
            path: '/shopping/settle'
          })
        }
      }
    }
  }
</script>

<style scoped>
  .bannerLogo {
    width: 60%;
    margin-left: 100px;
    margin-top: -25px;
  }

  .banner {
    width: 100%;
    height: 80px;
    display: flex;
    margin-bottom: 20px;
  }

  .banner .prompt_a {
    height: 80px;
    line-height: 80px;
    font-weight: bold;
    font-size: 24px;
    margin-left: 40px;
  }

  .banner .prompt_b {
    height: 80px;
    line-height: 90px;
    font-size: 14px;
    color: #777;
    margin-left: 40px;
  }

  .cart_line {
    width: 100%;
    height: 2px;
    background: #4f6e9d;
  }

  .list {
    width: 85%;
    margin: 0 auto;
    background-color: #f5f5f5;
    text-align: center;
  }

  .list .title {
    height: 100px;
    line-height: 100px;
    font-weight: bold;
  }

  .list .bookRow {
    height: 120px;
    line-height: 90px;
  }

  .list .bookRow .bookImg {
    width: 60px;
  }

  .summary {
    width: 85%;
    margin: 0 auto;
    height: 60px;
    line-height: 60px;
    background-color: #f5f5f5;
    text-align: center;
    margin-top: 20px;
  }

  .summary .number {
    color: #4f6e9d;
  }

  .summary .price {
    margin-right: 40px;
    float: right;
  }

  .summary .settlement {
    height: 60px;
    background-color: #4f6e9d;
    color: #ffffff;
    cursor: pointer;
  }

  .summary .settlement:hover {
    background-color: #7E9DCA;
  }
</style>

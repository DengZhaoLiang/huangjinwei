<template>
  <div>
    <div class="settle">
      <div class="viewBox">
        <div class="title">
          <div class="slogan">填写并核对订单信息</div>
        </div>
        <el-divider></el-divider>

        <el-row align="middle" type="flex">
          <el-col :span="4">
            <el-button @click="goBack(-1)" class="back" icon="el-icon-caret-left">上一步</el-button>
          </el-col>
          <el-col :span="20">
            <el-steps :active="step" finish-status="success" simple>
              <el-step @click="toCart()" icon="el-icon-s-goods" title="购物车"></el-step>
              <el-step icon="el-icon-s-claim" title="收货地址"></el-step>
              <el-step icon="el-icon-s-finance" title="付款"></el-step>
              <el-step icon="el-icon-s-home" title="订单状态"></el-step>
            </el-steps>
          </el-col>
          <el-col :span="4" style="margin-left: 50px">
            <el-button @click="goBack(1)" class="back" icon="el-icon-caret-right">下一步</el-button>
          </el-col>
        </el-row>

        <el-divider></el-divider>

        <div class="commodity" v-if="step === 0">
          <el-row align="middle" type="flex">
            <el-col :span="3" class="cTitle">商品图片</el-col>
            <el-col :span="9" class="cTitle">商品名称</el-col>
            <el-col :span="6" class="cTitle">单价</el-col>
            <el-col :span="6" class="cTitle">数量</el-col>
          </el-row>
        </div>

        <div v-if="this.carts.length !== 0 && step === 0">
          <div :key="index" class="commodity" v-for="(cart, index) in carts">
            <el-row align="middle" type="flex">
              <el-col :span="3">
                <img :src="cart.book.image" alt="" class="bookImg">
              </el-col>
              <el-col :span="9">{{ cart.book.name }}</el-col>
              <el-col :span="6">{{ cart.book.price }}</el-col>
              <el-col :span="6">{{ cart.purchaseNum }}</el-col>
            </el-row>
          </div>
          <el-divider></el-divider>

          <div class="settleFooter">
            <div class="leftImg"><img alt="" class="settleImg" src="../../../static/orderConfirm.png"></div>
            <div class="total">
              <div class="postage">商品总额：{{ totalPrice }} 元</div>
              <div class="payPrice">应付金额：{{ totalPrice }} 元</div>
            </div>
          </div>
        </div>

        <div style="height: 335px" v-if="address.length !== 0 && step === 1 && !addAddress">
          <div class="left">
            <template>
              <el-table :data="address" style="width: 100%">
                <el-table-column label="选项" width="160">
                  <template slot-scope="scope">
                    <el-radio :label="scope.$index" @change.native="getCurrentRow(scope.$index)" v-model="radio">
                      &nbsp;
                    </el-radio>
                  </template>
                </el-table-column>
                <el-table-column label="姓名" prop="name" width="160"></el-table-column>
                <el-table-column label="电话" prop="phone" width="160"></el-table-column>
                <el-table-column label="地址" prop="detail"></el-table-column>
              </el-table>
            </template>
          </div>
        </div>

        <div v-if="this.carts.length === 0 && step === 1">
          <el-row align="middle" type="flex">
            <el-col :span="24" style="text-align: center;">暂无商品</el-col>
          </el-row>
          <el-divider></el-divider>

          <div class="settleFooter">
            <div class="leftImg"><img alt="" class="settleImg" src="../../../static/orderConfirm.png"></div>
            <div class="total">
              <div class="postage">商品总额：0 元</div>
              <div class="payPrice">应付金额：0 元</div>
            </div>
          </div>
        </div>

        <div class="orderInfo" style="height: 165px" v-if="address.length === 0 && step === 1 && !addAddress">
          <div class="left">
            <div class="infoTitle">收货地址：无</div>
          </div>
        </div>

        <el-button @click="insertAddress()" style="float: right" type="primary" v-if="step === 1 && !addAddress">新增地址
        </el-button>
        <div v-if="addAddress">
          <el-form :model="addressTable" label-width="80px">
            <el-form-item label="姓名">
              <el-input v-model="addressTable.name"></el-input>
            </el-form-item>
            <el-form-item label="电话">
              <el-input type="number" v-model="addressTable.phone"></el-input>
            </el-form-item>
            <el-form-item label="地址">
              <el-input v-model="addressTable.detail"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="onSubmit" type="primary">立即创建</el-button>
              <el-button @click="onCancel">取消</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div style="height: 335px" v-if="step === 2">
          <div ref="alipay" v-html="alipayWap" v-show="false"></div>
        </div>

        <div v-if="step === 4">
          <c-order-success :is-payed='isPayed' :order-id='this.orderSn' :total-amount='this.totalPrice'/>
        </div>

      </div>
    </div>
  </div>
</template>

<script>

  import request from '../../utils/request'
  import COrderSuccess from './c-order-success'

  export default {
    components: {COrderSuccess},
    inject: ['reload'],
    data () {
      return {
        input: '',
        userInfo: [],
        carts: [],
        count: 0,
        totalPrice: 0,
        editVisible: false,
        step: 0,
        address: [],
        radio: false,
        addressId: '',
        alipayWap: '',
        orderSn: '',
        isPayed: false,
        clearCarts: false,
        addAddress: false,
        addressTable: {}
      }
    },
    created () {
      /** 获取用户信息 */
      this.userInfo = this.$cookies.get('userInfo')
      let buy = this.$cookies.get('buyNow')
      if (buy) {
        this.carts.push(buy)
      } else {
        let carts = this.$cookies.get('carts') ? JSON.parse(this.$cookies.get('carts')) : []
        if (carts.length !== 0) {
          this.carts = carts
          this.clearCarts = true
        }
      }
      console.log(this.carts)

      // 计算应付金额
      let total = 0
      this.carts.forEach(cart => {
        total += cart.book.price * cart.purchaseNum
      })
      this.totalPrice = total
    },
    methods: {
      goBack (num) {
        let to = this.step + num
        // 如果已付款
        if (this.orderSn !== '') {
          request.post(`/api/order/payed/${this.orderSn}`)
            .then(res => {
              if (res.status === 200) {
                if (res.data === true) {
                  this.step = 4
                }
              } else {
                this.$message.error(res.message)
              }
            })
        }
        // 如果是选择地址
        if (to === 1) {
          // 校验购物车
          if (this.carts.length === 0) {
            this.$message.error('没有选择商品')
            return
          }
          request.get(`/api/address/user/${this.userInfo.id}`)
            .then(res => {
              if (res.status === 200) {
                this.address = res.data
              } else {
                this.$message.error(res.message)
              }
            })
        }
        // 如果是付款
        if (to === 2) {
          if (this.addressId === '') {
            this.$message.error('请先选择地址')
            return
          }
          let books = this.carts
          let map = books.map(it => {
            return {
              bookId: it.book.id,
              purchaseNum: it.purchaseNum
            }
          })
          request.post(`/api/order/buy`, {
            userId: this.userInfo.id,
            addressId: this.addressId,
            books: map
          }).then(res => {
            if (res.status === 200) {
              if (this.clearCarts) {
                this.$cookies.remove('carts')
              }
              let response = res.data
              this.orderSn = response.orderSn
              console.log(response.totalPrice)
              this.alipayWap = response.response
              setTimeout(() => {
                if (!this.isPayed) {
                  this.$nextTick(() => {
                    this.$refs.alipay.children[0].submit()
                  })
                }
              }, 1000)
            } else {
              to = 1
              this.$message.error(res.message)
            }
          })
        }
        if (to >= 0 && to < 4) {
          this.step = to
        }
      },
      toCart () {
        this.$router.push({
          path: '/shopping/cart'
        })
      },
      getCurrentRow (num) {
        this.addressId = this.address[num].id
      },
      // 新增地址
      insertAddress () {
        this.addAddress = true
      },
      onSubmit () {
        this.addressTable.userId = this.userInfo.id
        request.post(`/api/address`, this.addressTable)
          .then(res => {
            if (res.status === 200) {
              this.$message.success('新增地址成功')
              this.addAddress = false
              request.get(`/api/address/user/${this.userInfo.id}`)
                .then(res => {
                  if (res.status === 200) {
                    this.address = res.data
                  } else {
                    this.$message.error(res.message)
                  }
                })
            }
          })
      },
      onCancel () {
        this.addAddress = false
      }
    },
    mounted () {
      let orderSn = this.$route.query.orderSn
      let totalPrice = this.$route.query.totalPrice
      if (orderSn && totalPrice) {
        this.orderSn = orderSn
        this.totalPrice = totalPrice
        if ((typeof this.orderSn !== 'undefined' && this.orderSn !== '') &&
          (typeof this.totalPrice !== 'undefined' && this.totalPrice !== 0)) {
          this.step = 2
          /* eslint-disable */
          request.post(`/api/order/buy`, {
            orderSn: this.orderSn,
            totalPrice: this.totalPrice
          }).then(res => {
            if (res.status === 200) {
              let response = res.data
              this.orderSn = response.orderSn
              console.log(response.totalPrice)
              this.alipayWap = response.response
              setTimeout(() => {
                if (!this.isPayed) {
                  this.$nextTick(() => {
                    this.$refs.alipay.children[0].submit()
                  })
                }
              }, 1000)
            } else {
              this.step = 1
              this.$message.error(res.message)
            }
          })
        }
      }
      let step = this.$route.query.step
      if (step === '4') {
        this.orderSn = this.$route.query.out_trade_no
        this.totalPrice = this.$route.query.total_amount
        if ((typeof this.orderSn !== 'undefined' && this.orderSn !== '') &&
          (typeof this.totalPrice !== 'undefined' && this.totalPrice !== 0)) {
          request.get(`/api/alipay/notify?orderSn=${this.orderSn}`)
          this.isPayed = true
          setTimeout(() => {
            this.step = 4
          }, 500)
        }
      }
    },
    beforeDestroy () {
      this.$cookies.remove('buyNow')
    }
  }
</script>

<style scoped>
  .settle {
    width: 80%;
    margin: 0 auto;
    /* background-color: #f5f5f5; */
  }

  .settle .viewBox {
    width: 80%;
    margin: 0 auto;
  }

  .settle .viewBox .title {
    height: 100px;
    display: flex;
    align-items: center;
  }

  .settle .viewBox .title .slogan {
    width: 90%;
    height: 100px;
    line-height: 100px;
    font-size: 24px;
    color: #303133;
    float: left;
  }

  .settle .viewBox .back {
    width: 100px;
    border-radius: 0;
  }

  .settle .viewBox .commodity {
    width: 80%;
    text-align: center;
    margin: 0 auto 10px;
  }

  .settle .viewBox .commodity .cTitle {
    height: 60px;
    line-height: 40px;
    font-weight: bold;
  }

  .settle .viewBox .commodity .bookImg {
    width: 60px;
  }

  .settle .viewBox .orderInfo {
    height: 180px;
    display: flex;
    align-items: center;
  }

  .settle .viewBox .orderInfo .left {
    width: 90%;
    height: 180px;
    line-height: 180px;
    font-size: 18px;
    color: #606266;
  }

  .settle .viewBox .orderInfo .left .infoTitle {
    width: 90%;
    height: 30px;
    line-height: 30px;
    font-size: 22px;
    color: #303133;
    margin-bottom: 30px;
  }

  .settle .viewBox .settleFooter {
    width: 100%;
    display: flex;
  }

  .settle .viewBox .settleFooter .leftImg {
    width: 80%;
    /* float: left; */
  }

  .settle .viewBox .settleFooter .settleImg {
    width: 150px;
    float: left;
  }

  .settle .viewBox .settleFooter .total {
    width: 20%;
    height: 150px;
    align-items: center;
  }

  .settle .viewBox .settleFooter .total .postage {
    margin-bottom: 10px;
    float: right;
  }

  .settle .viewBox .settleFooter .total .payPrice {
    margin-top: 30px;
    font-size: 20px;
    color: #4f6e9d;
    float: right;
  }
</style>

<template>
  <div>
    <div class="settle">
      <div class="viewBox">
        <div class="title">
          <div class="slogan">填写并核对订单信息</div>
          <el-button @click="toPay(userInfo)" class="submit" type="danger">提交订单</el-button>
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
              <el-step icon="el-icon-s-home" title="出库"></el-step>
              <el-step icon="el-icon-success" title="成功交易"></el-step>
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
              <div class="postage">运费：包邮</div>
              <div class="payPrice">应付金额：{{ totalPrice }} 元</div>
            </div>
          </div>
        </div>

        <div style="height: 335px" v-if="address.length !== 0 && step === 1">
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

          <div class="orderInfo" style="height: 335px" v-if="address.length === 0 && step === 1">
            <div class="left">
              <div class="infoTitle">收货地址：无</div>
            </div>
          </div>
          <el-divider></el-divider>

          <div class="settleFooter">
            <div class="leftImg"><img alt="" class="settleImg" src="../../../static/orderConfirm.png"></div>
            <div class="total">
              <div class="postage">商品总额：0 元</div>
              <div class="postage">运费：包邮</div>
              <div class="payPrice">应付金额：0 元</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 收货信息编辑弹出框 -->
      <el-dialog :visible.sync="editVisible" title="修改收货信息" width="35%">
        <el-form :model="userInfo" label-position="left" label-width="100px" ref="userInfo">
          <el-form-item label="名字" prop="Logname">
            <el-input v-model.number="userInfo.Logname"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="Phone">
            <el-input v-model.number="userInfo.Phone"></el-input>
          </el-form-item>
          <el-form-item label="收货地址" prop="Address">
            <el-input type="textarea" v-model="userInfo.Address"></el-input>
          </el-form-item>
        </el-form>

        <div class="dialog-footer" slot="footer">
          <el-button @click="modify('userInfo')" plain type="primary">修改</el-button>
          <el-button @click="editVisible = false" plain type="danger">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>

  import request from '../../utils/request'

  export default {
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
        addressId: ''
      }
    },
    created () {
      /** 获取用户信息 */
      this.userInfo = this.$cookies.get('userInfo')
      let buy = this.$cookies.get('buyNow')
      if (buy) {
        this.carts.push(buy)
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
        }
        if (to >= 0 && to < 3) {
          this.step = to
        }
      },
      toCart () {
        this.$router.push({
          path: '/shopping/cart'
        })
      },
      modify (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('修改成功！')
            this.$message({
              showClose: true,
              message: '修改成功！',
              type: 'success',
              center: true
            })
            this.editVisible = false
          } else {
            console.log('error!')
            return false
          }
        })
      },
      toPay (e) {
        if (this.carts.length === 0) {
          this.$message({
            showClose: true,
            message: '无订单信息！',
            type: 'warning',
            center: true
          })
        } else {
          this.$router.push({
            path: '/shopping/pay',
            query: {
              User_name: e.ID,
              User_tel: e.Phone,
              User_address: e.Address
            }
          })
        }
      },
      getCurrentRow (num) {
        this.addressId = this.address[num].id
      }
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

  .settle .viewBox .title .submit {
    width: 150px;
    height: 50px;
    border-radius: 0;
    font-size: 16px;
  }

  .settle .viewBox .back {
    width: 100px;
    border-radius: 0;
  }

  .settle .viewBox .commodity {
    width: 80%;
    margin: 0 auto;
    text-align: center;
    margin-bottom: 10px;
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

  .settle .viewBox .orderInfo .left .info {
    width: 90%;
    height: 40px;
    line-height: 40px;
    font-size: 17px;
    color: #606266;
  }

  .settle .viewBox .orderInfo .modify {
    width: 100px;
    height: 40px;
    border-radius: 0;
    font-size: 16px;
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

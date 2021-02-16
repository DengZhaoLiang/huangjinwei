<template>
  <div class='c-order-item'>
    <div :class="orderItem.status === 2 ? '' : 'components-blue-header'" class='order-header'>
      <el-row class='y-center'>
        <el-col :span='16'>
          <div class='order y-center'>
            <span class='date'>{{ formatInstant(orderItem.createdAt) }}</span>
            <span>订单号：{{ orderItem.orderSn }}</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <div :class="orderItem.status === 2 ? '' : 'components-blue-container'" class='order-container'>
      <el-row class='y-center'>
        <el-col :span='16'>
          <div ref='left'>
            <el-row :class="[{'products-blue-item': orderItem.status !== 2},
                                {'none-bottom-border': index === orderItem.books.length - 1}]"
                    :key='index'
                    class='y-center products-item'
                    v-for='(item, index) in orderItem.books'>
              <el-col :span='12'>
                <div class='products-info x-center'>
                  <div class='master-img-div'>
                    <img :src='item.bookImage' @click="goToDetail(item.bookId)" alt="">
                  </div>
                  <div @click="goToDetail(item.bookId)">
                    <span>{{ item.bookName }}</span>
                  </div>
                </div>
              </el-col>
              <el-col :span='6' class='yx-center'>
                <div class='yx-center'>
                  <c-money :money='item.bookPrice' size='sm' style="height: 100%; align-items: center"></c-money>
                </div>
              </el-col>
              <el-col :span='6' class='xy-center'>
                <span style="height: 100%; align-items: center">{{ item.quantity }}</span>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span='8' class='order-right'>
          <div ref='right'>
            <el-row align="center" class='order-right-row' justify="center" style="height: 100%">
              <el-col :class="orderItem.status === 2 ? '' : 'components-col-blue-item'"
                      :span='12'
                      class='xy-center order-col-item'>
                <c-money :money='orderItem.totalPrice' size='sm' style="height: 100%; align-items: center"></c-money>
              </el-col>
              <el-col :span='12' class='xy-center order-col-item' style="padding-top: 15%; padding-left: 8%">
                <div>
                  <div style="margin-bottom: 10px" v-if="orderItem.status !== 2">
                    <el-tag type="warn">未支付</el-tag>
                  </div>
                  <div style="margin-bottom: 10px" v-if="orderItem.status !== 2">
                    <el-button @click='goToOrder' class='to-pay-btn' type='primary'>去支付</el-button>
                  </div>
                  <div style="margin-bottom: 10px" v-if="orderItem.status === 2">
                    <el-tag type="success">已支付</el-tag>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import {formatDate} from '../../utils/date'
  import CMoney from './c-money'

  export default {
    name: 'COrderItem',
    components: {
      CMoney
    },
    props: {
      orderItem: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    data () {
      return {}
    },
    methods: {
      goToDetail (booksId) {
        this.$router.push({
          path: '/bookInfo',
          query: {
            id: booksId
          }
        })
      },
      goToOrder () {
        this.$router.push(`/shopping/settle?orderSn=${this.orderItem.orderSn}&totalPrice=${this.orderItem.totalPrice}`)
      },
      // 格式化时间戳
      formatInstant (val) {
        let date = new Date(val * 1000)
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      }
    },
    mounted () {
      console.log(this.$refs.left.offsetHeight)
      this.$refs.right.style.height = this.$refs.left.offsetHeight + 'px'
    }
  }
</script>

<style scoped>
  .c-order-item {
    width: 878px;
    margin-top: 10px;
  }

  .order-header {
    width: 858px;
    padding: 5px 10px;
    /*margin-top: 10px;*/
    height: 26px;
    justify-content: space-between;
    background: #f5f5f5;
    font-size: 12px;
    color: #666666;
  }

  .order-header .y-center {
    height: 100%;
  }

  .order-header .order {
    font-size: 13px;
    font-weight: 300;
  }

  .order-header .order .date {
    font-size: 15px;
    color: #333;
    font-weight: bold;
    margin: 0 20px 0 10px;
  }

  .order-container {
    font-size: 18px;
    border: 1px solid #f0f0f0;
  }

  .order-container .products-info {
    margin: 10px 0;
  }

  .order-container .products-info .master-img-div {
    width: 100px;
    height: 100px;
    margin-left: 20px;
  }

  .order-container .products-info .master-img-div img {
    width: 100px;
    height: 100px;
  }

  .order-container .products-info div {
    margin-left: 10px;
    font-size: 14px;
    color: #666;
  }

  .order-container .products-info div span:nth-child(1) {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-right: 10px;
  }

  .order-container .products-item {
    border-bottom: 1px solid #f0f0f0;
    border-right: 1px solid #f0f0f0;
  }

  .order-container .order-col-item {
    height: 100% !important;
    border-right: 1px solid #f0f0f0;
  }

  .order-container .order-col-item-right {
    border-right: 0;
    font-size: 16px;
  }

  .order-container .order-col-item-right .state-item span:hover {
    color: #ff4400;
    padding-bottom: 2px;
    border-bottom: 1px solid #ff4400;
  }

  .order-container .order-col-item-right .to-pay-btn {
    width: 86px;
    margin-left: 5px;
    margin-top: 5px;
    padding: 6px 0;
  }

  .order-container .order-right-row {
    height: 100%;
  }
</style>

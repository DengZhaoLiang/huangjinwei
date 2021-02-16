<template>
  <div class='c-order-container'>
    <el-row class='order-title'>
      <el-col :span='8' class='x-center'>宝贝</el-col>
      <el-col :span='4' class='x-center'>单价</el-col>
      <el-col :span='4' class='x-center'>数量</el-col>
      <el-col :span='4' class='x-center'>实付款</el-col>
      <el-col :span='4' class='x-center'>订单状态</el-col>
    </el-row>
    <c-order-item :key='index' :order-item='item' v-for='(item,index) in orderList'/>
    <div class='none-data yx-center' v-if='!load && !orderList.length'>
      <span>暂无订单数据，赶快去下单吧~</span>
    </div>
    <div class='load-infinite infinite-list' infinite-scroll-disabled='busy'
         infinite-scroll-distance='10' v-infinite-scroll='loadMore'>
    </div>
  </div>
</template>

<script>
  import request from '../../utils/request'
  import COrderItem from './c-order-item'

  export default {
    name: 'COrderContainer',
    components: {
      COrderItem
    },
    data () {
      return {
        orderList: [],
        loading: false,
        busy: false,
        load: true,
        userId: '',
        query: {
          page: 1,
          size: 5
        }
      }
    },
    methods: {
      fetchOrderList () {
        request.get(`/api/order/${this.userId}`, this.query)
          .then(res => {
            if (res.status === 200) {
              let orders = res.data.content
              if (orders.length) {
                this.orderList = this.orderList.concat(orders)
              } else {
                this.load = false
              }
            }
            console.log(this.orderList)
          }).catch(err => {
          console.log(err)
          this.load = false
        })
        this.loading = false
        this.busy = false
      },
      loadMore () {
        if (this.load) {
          this.busy = true
          this.loading = true
          setTimeout(() => {
            this.query.page++
            this.fetchOrderList()
          }, 500)
        }
      }
    },
    mounted () {
      this.userId = this.$cookies.get('userInfo').id
      this.fetchOrderList()
    },
    destroyed () {
    }
  }
</script>

<style scoped>
  .c-order-container {
    width: 880px;
  }

  .c-order-container .order-title {
    background: #f5f5f5;
    color: #333;
    font-size: 16px;
    padding: 8px 0;
    margin-bottom: 10px;
  }

  .load-infinite img {
    width: 50px;
    height: 50px;
  }

  .none-data {
    margin-top: 80px;
  }

  .none-data span {
    margin-top: 20px;
    font-size: 16px;
    color: #aaa;
    font-weight: 300;
  }
</style>

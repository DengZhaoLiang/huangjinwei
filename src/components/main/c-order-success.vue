<template>
  <div class='c-order-success' style="height: 335px">
    <img alt="" src='../../../static/order-success.png'/>
    <div id="yx-center">
      <span>恭喜您！</span>
      <span>{{ isPayed ? '您已成功支付' : '您已成功下单,请支付' }}</span>
    </div>
    <div id="money">
      <span>订单号：</span>
      <span>{{ orderId }}</span>
      <span>{{ isPayed ? '已支付:' : '待支付:' }}</span>
      <c-money :money=Number(totalAmount) style="display: inline-block"/>
    </div>
  </div>
</template>

<script>

  import CMoney from './c-money'

  export default {
    name: 'COrderSuccess',
    components: {
      CMoney
    },
    props: ['orderId', 'totalAmount', 'isPayed'],
    data () {
      return {
        payed: this.isPayed
      }
    }
  }
</script>

<style scoped>
  .c-order-success {
    text-align: center;
  }

  .c-order-success img {
    width: 151px;
    height: 166px;
    margin-bottom: 28px;
  }

  #yx-center {
    font-size: 28px;
    font-weight: bold;
    color: #ff4400;
    margin: 10px auto;
    text-align: center;
    align-items: center;
  }

  #money {
    margin: 0 auto;
    text-align: center;
    align-items: center;
    color: #919191;
    font-size: 28px;
  }
</style>

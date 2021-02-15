<template>
  <div :class='size' class='money'>
    <span :style='setColor' class='money-text'>¥{{ money }}</span>
  </div>
</template>

<script>
  export default {
    name: 'CMoney',
    props: {
      money: {
        type: Number,
        default: 0
      },
      size: String,
      color: {
        type: String,
        default: '#DD524D'
      }
    },
    computed: {
      setColor () {
        return {
          color: this.color
        }
      }
    }
  }
</script>

<style scoped>
  .money {
    display: flex;
    align-items: center;
  }

  .money span {
    color: #DD524D;
    padding: 0;
    display: block;
  }

  .money .money-text {
    font-size: 30px;
  }

  .md .money-text {
    font-size: 28px;
  }

  .xs .money-text {
    font-size: 20px;
  }

  /*删除线*/
  .d-xs span {
    font-size: 20px !important;
    margin-right: 0 !important;
    color: #999999 !important;
    text-decoration: line-through;
  }
</style>

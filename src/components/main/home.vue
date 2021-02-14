<template>
  <div>
    <el-container>
      <div style="display: flex; margin-top: 40px;">
        <div>
          <h1 class="homeTitle">SMALLFROG 书店</h1>
          <p class="content">我希望政通人和，使大家能安安静静坐下来，想一点事，读一点书，写一点文章。</p>
          <el-button @click="toCate()" class="startBtn">SHOPPING</el-button>
        </div>
        <div>
          <img alt="" class="indexImg" src="../../../static/background.png">
        </div>
      </div>
    </el-container>

    <div class="recommend">
      <h1 class="recommendTitle">为您推荐</h1>
      <div :key="index" class="recLine" data-wow-duration="2s" v-for="(books, index) in transRecBooks">
        <div :key="index" v-for="(book, index) in books">
          <el-card :body-style="{ padding: '0px' }" class="wow slideInUp card" slot="reference">
            <img :src="book.image" @click="toInfo(book)" alt="" class="img">
            <div class="mask">
              <el-link :underline="false" @click="toInfo(book)" class="name">
                <i class="el-icon-reading readIcon"></i>
                {{ book.name }}
              </el-link>
              <el-rate class="rate" disabled v-model.number='book.commend'></el-rate>
            </div>

          </el-card>
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
        recBooks: [],
        transRecBooks: []
      }
    },
    created () {
      request.get('/api/book/recommend')
        .then(res => {
          if (res.status === 200) {
            console.log(res.data)
            this.recBooks = res.data // 获取数据
            this.transRec()
          }
        })
    },
    methods: {
      transRec () {
        const Arr = []
        for (let i = 0, idx = -1; i < this.recBooks.length; i++) {
          i % 4 === 0 && idx++
          if (Object.prototype.toString.call(Arr[idx]) !== '[object Array]') {
            Arr[idx] = []
          }
          Arr[idx].push(this.recBooks[i])
        }
        this.transRecBooks = Arr
      },
      toInfo (book) {
        this.$router.push({
          path: '/bookInfo',
          query: {
            id: book.id
          }
        })
      },
      toCate () {
        this.$router.push({
          path: '/category'
        })
      }
    }
  }
</script>

<style scoped>
  .homeTitle {
    width: 400px;
    color: #333333;
    font-size: 40px;
    font-weight: 600;
    text-align: left;
    margin-left: 200px;
  }

  .indexImg {
    width: 500px;
    margin-left: 200px;
  }

  .content {
    width: 400px;
    color: #333333;
    font-size: 18px;
    line-height: 35px;
    text-align: left;
    margin-left: 200px;
  }

  .startBtn {
    width: 180px;
    height: 50px;
    margin-left: 200px;
    margin-top: 80px;
    border-radius: 0;
    font-size: 16px;
    border: 0;
    outline: 0;
    background-color: #4F6E9D;
    color: #FFFFFF;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  }

  .startBtn:focus,
  .startBtn:hover {
    color: #FFFFFF;
    border-color: #7E9DCA;
    background-color: #7E9DCA;
  }

  .recommend {
    margin-top: 30px;
    padding-top: 30px;
    padding-bottom: 50px;
    /* background-color: #f8f9fb; */
    /* background-image: linear-gradient(#FFFFFF, #F2F2F7); */
  }

  .recommend .recommendTitle {
    color: #333333;
    text-align: center;
    font-size: 30px;
    font-weight: 600;
    margin-bottom: 50px;
  }

  .recommend .recLine {
    justify-content: center;
    display: flex;
  }

  .recommend .recLine .card {
    width: 200px;
    margin: 20px 40px;
    /* border-radius: 15px; */
    position: relative;
    text-align: justify;
  }

  .recommend .recLine .card .img {
    width: 80%;
    display: block;
    cursor: pointer;
    margin: 0 auto;
    padding-top: 20px;
  }

  .recommend .recLine .card .mask {
    width: 100%;
    margin-top: 20px;
    background-color: #f8fafc;
  }

  .recommend .recLine .card .mask .name {
    padding: 14px 20px;
    font-size: 16px;
  }

  .recommend .recLine .card .mask .rate {
    text-align: center;
    padding: 0 10px 14px 10px;
  }
</style>

<template>
  <div>
    <el-row justify="space-around" type="flex">
      <el-col :span="7">
        <div class="colBack">
          <el-card :key="index" class="newCard" v-for="(book, index) in newPcBooks">
            <el-image :src="'https://www.xiaoqw.online/smallFrog-bookstore/img/' + book.img" @click="toInfo(book)"
                      class="newImg"></el-image>
          </el-card>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="colBack">
          <el-card :key="index" class="newCard" v-for="(book, index) in newEnBooks">
            <el-image :src="'https://www.xiaoqw.online/smallFrog-bookstore/img/' + book.img" @click="toInfo(book)"
                      class="newImg"></el-image>
          </el-card>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="colBack">
          <el-card :key="index" class="newCard" v-for="(book, index) in newOtherBooks">
            <el-image :src="'https://www.xiaoqw.online/smallFrog-bookstore/img/' + book.img" @click="toInfo(book)"
                      class="newImg"></el-image>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    data () {
      return {
        newPcBooks: [],
        newEnBooks: [],
        newOtherBooks: [],
      }
    },
    created () {
      const address = 'https://www.xiaoqw.online/smallFrog-bookstore/server/newBooks.php'

      axios.post(address, 1).then(res => {
        this.newPcBooks = res.data //获取数据
        console.log('success')
        console.log(this.newPcBooks)
      }),
        axios.post(address, 2).then(res => {
          this.newEnBooks = res.data //获取数据
          console.log('success')
          console.log(this.newEnBooks)
        }),
        axios.post(address, 3).then(res => {
          this.newOtherBooks = res.data //获取数据
          console.log('success')
          console.log(this.newOtherBooks)
        })
    },
    methods: {
      toInfo (e) {
        this.$router.push({
          path: '/bookInfo',
          query: {
            ID: e.ID
          }
        })
      },
    },
  }
</script>

<style>
  .colBack {
    padding: 25px;
    background-color: #f8f9fb;
  }

  .newCard {
    margin-top: 20px;
  }

  .newImg {
    width: 80px;
  }
</style>

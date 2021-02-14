<template>
  <div>

    <el-container>
      <el-aside width="250px">
        <el-card class="leftNav">
          <img alt="" class="leftImg" src="../../../static/cateNav.png"/>
          <div :class="index === showCategoryIndex ? 'cur' : ''" :key="index" @click="showCategory(index)"
               class="navItem" v-for="(item, index) in navItems">{{ item }}
          </div>
          <div @click="toTop()" class="navItem"><i class="el-icon-arrow-up" style="font-size: 23px;"></i></div>
        </el-card>
      </el-aside>

      <el-main element-loading-background="#FFFFFF" v-loading.fullscreen.lock="loading">
        <div style="height: 480px" v-if="this.books.length === 0"></div>
        <el-row>
          <el-card :body-style="{ padding: '0px' }"
                   :key="index"
                   class="row"
                   v-for="(book, index) in books">
            <img :src="book.image" @click="toInfo(book)"
                 alt="" class="img">
            <el-link :underline="false" @click="toInfo(book)" class="name">
              <i class="el-icon-reading readIcon"></i>
              {{ book.name }}
            </el-link>
            <div class="author">{{ book.author }}</div>

            <div style="position: absolute; bottom: 0;">
              <el-row align="middle" type="flex">
                <el-col :span="12" class="price">¥ {{ book.price }}</el-col>
                <el-col :span="12">
                  <button @click="addToCart(book)" class="shop">
                    <i class="el-icon-shopping-bag-1 icon"></i>
                  </button>
                </el-col>
              </el-row>
              <el-rate class="rate" disabled v-model="book.commend"></el-rate>
            </div>
          </el-card>
        </el-row>

        <el-row class="page">
          <el-pagination :current-page="this.query.page" :page-size="this.query.size" :total="this.total"
                         @current-change="handleCurrentChange" background>
          </el-pagination>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import request from '../../utils/request'

  export default {
    data () {
      return {
        loading: true,
        scroll: 0, // 第一步：定义初始滚动高度
        activeIndex: '1',
        bookPath: 1,
        showCategoryIndex: 0,
        navItems: [],
        books: [],
        total: 0,
        query: {
          page: 1,
          size: 20,
          bookName: '', // 书名
          categoryName: '' // 类别
        }
      }
    },
    // 第二步：mounted中的方法代表dom已经加载完毕
    mounted: function () {
      this.$bus.$on('search', res => {
        this.query.bookName = res
        this.query.categoryName = ''
        this.query.page = 1
        this.loading = true
        request.get(`/api/book`, this.query)
          .then(res => {
            if (res.status === 200) {
              this.books = res.data.content
              this.total = res.data.totalElements
            } else {
              this.$message.error(res.message)
            }
          })
        this.loading = false
      })
    },
    created () {
      request.get(`/api/category`)
        .then(res => {
          if (res.status === 200) {
            this.navItems = res.data
          } else {
            this.$message.error(res.message)
          }
        })
      request.get(`/api/book`, this.query)
        .then(res => {
          if (res.status === 200) {
            this.books = res.data.content
            this.total = res.data.totalElements
          } else {
            this.$message.error(res.message)
          }
        })
      this.loading = false
    },
    methods: {
      handleCurrentChange: function (currentPage) {
        this.loading = true
        this.query.page = currentPage
        request.get(`/api/book`, this.query)
          .then(res => {
            if (res.status === 200) {
              this.books = res.data.content
              this.total = res.data.totalElements
            } else {
              this.$message.error(res.message)
            }
          })
        this.loading = false
      },
      toTop () {
        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0
      },
      toInfo (book) {
        this.$router.push({
          path: '/bookInfo',
          query: {
            id: book.id
          }
        })
      },
      showCategory (index) {
        this.showCategoryIndex = index
        this.query.categoryName = this.navItems[index]
        this.query.page = 1
        this.loading = true
        request.get(`/api/book`, this.query)
          .then(res => {
            if (res.status === 200) {
              this.books = res.data.content
              this.total = res.data.totalElements
            } else {
              this.$message.error(res.message)
            }
          })
        this.loading = false
      },
      addToCart (e) {
        this.$confirm('确定将此书加入购物车?', 'smallFrog', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '成功加入购物车！'
          })
        })
      }
    }
  }
</script>

<style scoped>

  /* main里的样式 */
  .leftNav {
    top: 50%;
    width: 150px;
    height: 410px;
    margin-top: -180px;
    margin-left: 60px;
    position: fixed;
    border-radius: 20px;
    background-color: #4f6e9d;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  }

  .leftNav .leftImg {
    width: 100%;
    margin-bottom: 20px;
    color: #ffffff;
    position: relative;
    border-radius: 12px;
  }

  .leftNav .navItem {
    text-align: center;
    height: 60px;
    cursor: pointer;
    color: #ffffff;
    position: relative;
  }

  .leftNav .navItem:hover {
    transform: scale(1.05);
  }

  .row {
    width: 160px;
    height: 400px;
    margin: 20px 30px;
    display: inline-block;
    position: relative;
  }

  .row .img {
    width: 100%;
    height: 200px;
    /* display: block; */
    cursor: pointer;
    transition: all 0.6s;
  }

  .row .img:hover {
    transform: scale(1.1);
  }

  .row .name {
    padding-top: 14px;
    padding-left: 15px;
    padding-right: 15px;
    font-size: 16px;
  }

  .row .readIcon {
    text-align: left;
    padding-right: 5px;
  }

  .row .author {
    text-align: left;
    color: #909399;
    padding-top: 14px;
    padding-left: 15px;
    padding-right: 15px;
    font-size: 15px;
  }

  .row .price {
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 15px;
    padding-left: 15px;
    padding-top: 4px;
  }

  .row .shop {
    margin-top: 10px;
    margin-bottom: 10px;
    border: none;
    outline: none;
    background-color: #ffffff;
    font-size: 20px;
    float: right;
    padding-right: 15px;
  }

  .row .shop .icon {
    color: #4f6e9d;
    cursor: pointer;
    transition: all 0.3s;
  }

  .row .shop .icon:hover {
    transform: scale(1.1);
  }

  .row .rate {
    text-align: center;
    padding: 0 10px 14px 10px;
  }

  .page {
    margin-top: 30px;
    text-align: center;
  }
</style>

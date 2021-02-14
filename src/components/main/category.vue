<template>
  <div>

    <el-container>
      <el-aside width="250px">
        <el-card class="leftNav">
          <img class="leftImg" src="../../../static/cateNav.png" alt=""/>
          <div :class="index === showCategoryIndex ? 'cur' : ''" :key="index" @click="showCategory(index)"
               class="navItem" v-for="(item, index) in navItems">{{ item }}
          </div>
          <div @click="toTop()" class="navItem"><i class="el-icon-arrow-up" style="font-size: 23px;"></i></div>
        </el-card>
      </el-aside>

      <el-main element-loading-background="#FFFFFF" v-loading.fullscreen.lock="loading">
        <el-row>
          <el-card :body-style="{ padding: '0px' }"
                   :key="index"
                   class="row"
                   v-for="(book, index) in Books[showCategoryIndex].slice((currentPage-1)*pagesize,currentPage*pagesize)">
            <img :src="'https://www.xiaoqw.online/smallFrog-bookstore/img/' + book.img" @click="toInfo(book)"
                 class="img" alt="">
            <el-link :underline="false" @click="toInfo(book)" class="name">
              <i class="el-icon-reading readIcon"></i>
              {{ book.Name }}
            </el-link>
            <div class="author">{{ book.Author }}</div>

            <div style="position: absolute; bottom: 0;">
              <el-row align="middle" type="flex">
                <el-col :span="12" class="price">¥ {{ book.Price }}</el-col>
                <el-col :span="12">
                  <button @click="addToCart(book)" class="shop">
                    <i class="el-icon-shopping-bag-1 icon"></i>
                  </button>
                </el-col>
              </el-row>
              <el-rate class="rate" disabled v-model="book.Commend"></el-rate>
            </div>
          </el-card>
        </el-row>

        <el-row class="page">
          <el-pagination :current-page="currentPage" :page-size="pagesize" :total="Books[showCategoryIndex].length"
                         @current-change="handleCurrentChange" background>
          </el-pagination>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    data () {
      return {
        loading: true,
        scroll: 0, //第一步：定义初始滚动高度
        activeIndex: '1',
        bookPath: 1,
        searchText: '', //搜索关键字
        showCategoryIndex: 0,
        navItems: ['全部书籍', '计算机类', '英语类', '其他类'],
        Books: [
          []
        ],
        currentPage: 1,
        pagesize: 20
      }
    },
    //第二步：mounted中的方法代表dom已经加载完毕
    mounted: function () {
      window.addEventListener('scroll', this.handleScroll)
    },
    created () {
      const address1 = 'https://www.xiaoqw.online/smallFrog-bookstore/server/allBooks.php'
      const address2 = 'https://www.xiaoqw.online/smallFrog-bookstore/server/pcBooks.php'
      const address3 = 'https://www.xiaoqw.online/smallFrog-bookstore/server/enBooks.php'
      const address4 = 'https://www.xiaoqw.online/smallFrog-bookstore/server/otherBooks.php'

      axios.post(address1).then(res => {
        res.data.forEach(data => {
          data.Commend = Number(data.Commend)
        })
        this.Books[0] = res.data //获取数据
        console.log('success')
      }),
        axios.post(address2).then(res => {
          res.data.forEach(data => {
            data.Commend = Number(data.Commend)
          })
          this.Books[1] = res.data //获取数据
          console.log('success')
        }),
        axios.post(address3).then(res => {
          res.data.forEach(data => {
            data.Commend = Number(data.Commend)
          })
          this.Books[2] = res.data //获取数据
          console.log('success')
        }),
        axios.post(address4).then(res => {
          res.data.forEach(data => {
            data.Commend = Number(data.Commend)
          })
          this.Books[3] = res.data //获取数据
          console.log('success')
          this.loading = false
        })
    },
    methods: {
      handleCurrentChange: function (currentPage) {
        this.currentPage = currentPage
      },
      //第三步：用于存放页面函数
      handleScroll () {
        this.scroll = $(window).height() + $(document).scrollTop()
      },
      toTop () {
        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0
      },
      toInfo (e) {
        this.$router.push({
          path: '/bookInfo',
          query: {
            ID: e.ID
          }
        })
      },
      showCategory (index) {
        this.showCategoryIndex = index
      },
      addToCart (e) {
        this.$confirm('确定将此书加入购物车?', 'smallFrog', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            const address = 'https://www.xiaoqw.online/smallFrog-bookstore/server/addToCart.php'

            axios.post(address, {
              user_ID: this.$cookies.get('user_ID'),
              book_ID: e.ID,
              book_Img: e.img,
              book_Name: e.Name,
              unit_Price: e.Price,
              count: 1
            }).then(() => {
              console.log('success')
            })

            this.$message({
              type: 'success',
              message: '成功加入购物车！'
            })
          })
          .catch(() => {
          })
      }
    },
    //第四步：当再次进入（前进或者后退）时，只触发activated（注：只有在keep-alive加载时调用）
    activated () {
      if (this.scroll > 0) {
        window.scrollTo(0, this.scroll)
        window.addEventListener('scroll', this.handleScroll)
      }
    },
    //第五步：deactivated 页面退出时关闭事件 防止其他页面出现问题
    deactivated () {
      window.removeEventListener('scroll', this.handleScroll)
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

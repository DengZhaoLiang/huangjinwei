<template>
  <div style="margin: 0 20% 0 20%; height: 600px">
    <el-tabs @tab-click="handleClick" v-model="activeName">
      <el-tab-pane label="我的信息" name="first">
        <el-form :model="userInfo" label-width="80px" ref="form">
          <el-form-item label="昵称">
            <el-input v-model="userInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="电话号码">
            <el-input v-model="userInfo.phone"></el-input>
          </el-form-item>
          <el-form-item label="头像">
            <c-upload :avatar-url="userInfo.avatar"></c-upload>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="onSubmit" type="primary">确认修改</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="我的地址" name="second">
        <el-table
          :data="addresses"
          stripe
          style="width: 100%">
          <el-table-column
            label="姓名"
            prop="name"
            width="180">
          </el-table-column>
          <el-table-column
            label="电话"
            prop="phone"
            width="180">
          </el-table-column>
          <el-table-column
            label="地址"
            prop="detail">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="handleDelete(scope.row, scope.$index)" size="small" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import CUpload from './c-upload'
  import request from '../../utils/request'

  export default {
    data () {
      return {
        activeName: 'first',
        password: '',
        userInfo: {},
        addresses: []
      }
    },
    components: {
      CUpload
    },
    methods: {
      handleClick () {
        if (this.activeName === 'first') {
          let userInfo = this.$cookies.get('userInfo')
          if (userInfo === null) {
            this.$message.error('请先登录')
            this.$router.push({
              path: '/login'
            })
          } else {
            this.userInfo = userInfo
          }
        }
        if (this.activeName === 'second') {
          request.get(`/api/address/user/${this.userInfo.id}`)
            .then(res => {
              if (res.status === 200) {
                this.addresses = res.data
              } else {
                this.$message.error(res.message)
              }
            })
        }
      },
      onSubmit () {
        if (this.password !== '') {
          this.userInfo.password = this.password
        }
        request.put(`/api/user`, this.userInfo)
          .then(res => {
            if (res.status === 200) {
              this.userInfo = res.data
              this.$cookies.set('userInfo', res.data)
              this.password = ''
              this.$message.success('修改个人资料成功')
              setTimeout(() => {
                window.location.reload()
              }, 1000)
            } else {
              this.$message.error(res.message)
            }
          })
      },
      handleDelete (address, index) {
        request.delete(`/api/address/${address.id}`)
          .then(res => {
            if (res.status === 200) {
              this.$message.success('删除地址成功')
              this.addresses.splice(index, 1)
            } else {
              this.$message.error(res.message)
            }
          })
      }
    },
    created () {
      if (this.activeName === 'first') {
        let userInfo = this.$cookies.get('userInfo')
        if (userInfo === null) {
          this.$message.error('请先登录')
          this.$router.push({
            path: '/login'
          })
        } else {
          this.userInfo = userInfo
        }
      }
    },
    mounted () {
      this.$bus.$on('onUpload', res => {
        console.log(res)
        this.userInfo.avatar = res
      })
    }
  }
</script>

<style>
</style>

<template>
  <div>
    <el-row>
      <el-col :span="12">
        <img alt="" class="loginImg" src="../../../static/left.jpg">
      </el-col>

      <el-col :span="12">
        <div class="title"><img alt="" class="head" src="../../../static/head1.gif"></div>
        <el-form :model="ruleForm" :rules="rules" label-width="0" ref="ruleForm" status-icon>
          <div class="myInput username1">
            <el-form-item prop="tel">
              <el-input :clearable=true class="search1 search2 search3" placeholder="请输入手机号"
                        prefix-icon="el-icon-user" v-model="ruleForm.tel"></el-input>
            </el-form-item>
          </div>
          <div class="myInput password">
            <el-form-item prop="pass">
              <el-input class="search1 search2 search3" placeholder="请输入密码" prefix-icon="el-icon-magic-stick"
                        show-password v-model="ruleForm.pass"></el-input>
            </el-form-item>
          </div>

          <div class="login">
            <el-form-item>
              <el-button @click="submitForm('ruleForm')" class="logBtn">登录</el-button>
            </el-form-item>
          </div>
        </el-form>
        <div class="link">
          <el-link @click="toReg()" type="info">没有账号?去注册!</el-link>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>

  import request from '../../utils/request'

  export default {
    data () {
      // <!--验证手机号是否合法-->
      let checkTel = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(' '))
        } else if (!this.checkMobile(value)) {
          callback(new Error(' '))
        } else {
          callback()
        }
      }
      // <!--验证密码-->
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(' '))
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass')
          }
          callback()
        }
      }

      return {
        ruleForm: {
          pass: '',
          tel: ''
        },
        rules: {
          pass: [{
            validator: validatePass,
            trigger: 'change'
          }],
          tel: [{
            validator: checkTel,
            trigger: 'change'
          }]
        }
      }
    },
    methods: {
      // 验证手机号
      checkMobile (str) {
        let re = /^1\d{10}$/
        return re.test(str)
      },
      // <!--提交登录-->
      submitForm (formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            request.post('/api/user/login', {
              phone: this.ruleForm.tel,
              password: this.ruleForm.pass
            }).then(res => {
              if (res.status === 200) {
                console.log(res.data)
                this.$message({
                  showClose: true,
                  message: '登录成功！',
                  type: 'success',
                  center: true
                })
                this.$cookies.set('userInfo', res.data)

                this.$router.push({
                  path: '/home'
                })
              } else {
                this.$message.error(res.message)
              }
            })
          }
        })
      },
      toReg () {
        this.$router.push({
          path: '/register'
        })
      }
    }
  }
</script>

<style>
  .loginImg {
    width: 700px;
    margin: 0 auto;
    float: right;
  }

  .title {
    margin-top: 5%;
    width: 100%;
    text-align: center;
  }

  .head {
    width: 350px;
  }

  .username1 {
    width: 40%;
    margin-top: 10%;
    margin-left: auto;
    margin-right: auto;
  }

  .password {
    width: 40%;
    margin-top: 30px;
    margin-left: auto;
    margin-right: auto;
  }

  .login {
    margin-top: 8%;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }

  .logBtn {
    width: 150px;
    height: 40px;
    border-radius: 25px;
    border: none;
    outline: none;
    background-color: #4F6E9D;
    color: #FFFFFF;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  }

  .logBtn:focus,
  .logBtn:hover {
    color: #FFFFFF;
    border-color: #7E9DCA;
    background-color: #7E9DCA;
  }

  .logBtn:active {
    color: #FFFFFF;
    border-color: #7E9DCA;
    outline: 0;
  }

  .link {
    margin-top: 10%;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }
</style>

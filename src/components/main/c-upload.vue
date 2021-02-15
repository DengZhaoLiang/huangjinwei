<template>
  <div :style='getStyle' class='c-upload'>
    <el-upload
      :action='uploadUrl'
      :before-upload='beforeAvatarUpload'
      :headers='headers'
      :on-success='handleAvatarSuccess'
      :show-file-list='false'
      class='avatar-uploader'
      name='file'>
      <img :src='imageUrl' class='avatar' v-if='imageUrl'>
      <i class='el-icon-loading avatar-uploader-icon' v-if='isUploading'></i>
    </el-upload>
  </div>
</template>

<script>

  export default {
    name: 'CUpload',
    data () {
      return {
        imageUrl: '',
        isUploading: false,
        uploadUrl: 'http://localhost:9527/api/supplier/upload',
        headers: {
          'Authorization': ''
        }
      }
    },
    props: ['avatarUrl'],
    computed: {
      getStyle () {
        if (!this.imageUrl) {
          return ''
        }
        return {
          'background-image': `url(${this.imageUrl}) !important`
        }
      }
    },
    watch: {
      avatarUrl (val) {
        console.log(val)
        this.imageUrl = val
      }
    },
    methods: {
      handleAvatarSuccess (res) {
        this.imageUrl = res
        this.isUploading = false
        this.$bus.$emit('onUpload', res)
      },
      beforeAvatarUpload (file) {
        if (this.$cookies.get('userInfo').avatar === this.imageUrl) {
          return file
        }
        // console.log(file.type)
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        this.isUploading = true
        return isJPG && isLt2M
      }
    },
    mounted () {
      this.imageUrl = this.avatarUrl
    }
  }
</script>

<style>
  .c-upload {
    width: 187px !important;
    height: 187px !important;
    background-size: 187px 187px;
    border-radius: 8px;
    background-position: center;
    background-repeat: no-repeat;
  }

  .avatar-uploader .el-upload {
    /*border: 1px dashed #d9d9d9;*/
    border-radius: 8px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    background: rgba(211, 211, 211, 1);
    width: 187px !important;
    height: 187px !important;
    opacity: 0.76;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    width: 60px !important;
    height: 60px !important;
    position: absolute;
    font-size: 60px;
    color: #fff;
    z-index: 10;
  }

  .avatar {
    width: 187px !important;
    height: 187px !important;
    display: block;
  }
</style>

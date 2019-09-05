<template>
  <div class="user-login">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >
      <a-form-item>
          <a-input
            size="large"
            type="text"
            placeholder="用户名"
            v-decorator="[
              'username',
              {rules: [{ required: true, message: '请输入帐户名' }], validateTrigger: 'blur'}
            ]"
          >
            <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            size="large"
            type="password"
            autocomplete="false"
            placeholder="密码"
            @key.enter="handleSubmit"
            v-decorator="[
              'password',
              {rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}
            ]"
          >
            <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
          </a-input>
        </a-form-item>
        <a-row :gutter="16">
            <a-col class="gutter-row" :span="15">
              <a-form-item>
                <a-input size="large" type="text" placeholder="验证码" v-decorator="['verifyCode', {rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}]">
                  <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                </a-input>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" :span="9">
              <a-button
                class="getCaptcha"
                size="large"
                :disabled="verifyCodeLoading"
                :loading="verifyCodeLoading"
                @click.stop.prevent="getVerifyCode"
              >
                <img :src="verifyCodeDate.img" v-if="verifyCodeDate.img" alt="验证码" />
              </a-button>
            </a-col>
          </a-row>
        <a-form-item style="margin-top:24px">
          <a-button
            size="large"
            block
            type="primary"
            htmlType="submit"
            class="login-button"
            :loading="loginLoading"
            :disabled="loginLoading"
          >确定</a-button>
        </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { mapState,mapActions } from 'vuex';
export default {
  name: 'user-login',
  data() {
    return {
      form: this.$form.createForm(this),
      verifyCodeDate:{ },
    };
  },
  created() {
    this.getVerifyCode();
  },
  computed: {
    ...mapState({
      loginLoading: state => state.loading.actions.login,
      verifyCodeLoading: state => state.loading.actions.verifyCode,
    })
  },
  methods: {
    ...mapActions(['login','verifyCode']),
    async handleSubmit(e) {
      e.preventDefault();
      const { form: { validateFields } } = this;
      validateFields((err,values) => {
        if(!err){
          this.loginAction(values);
        }
      });
    },
    async loginAction(data){
      const res = await this.login({
          ...data,
          vid: this.verifyCodeDate.id,
      });
      if( res && res.code === 0){
        this.$notification.success({message:'登录成功'});
        setTimeout(() => {
          this.$router.push('/');
        },1000)
      }else if(res.code === 408){
        this.getVerifyCode();
      }
    },
    async getVerifyCode(){
      const { data } = await this.verifyCode();
      this.verifyCodeDate = data;
    }
  },
};

</script>

<style lang="less" scoped>
  .user-login{
    width: 400px;
    margin: 0 auto;
    .ant-form-explain,.ant-form-split{
      text-align: left;
    }
  }
</style>

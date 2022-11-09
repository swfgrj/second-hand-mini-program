<template>
  <view>
    <view class="login" >
      <image src="../../static/logout.png" class="logout-img"  @click="logOut"></image>
      <image :src="userinfo.avatarUrl" class="login-img" @click="getUserProfile"></image>
      <view class="name">{{userinfo.nickName}}</view>
    </view>
    <view class="userinfo">
      <navigator class="history" url="../../subpkg2/history/history">
        <view class="inner-box">
          <image src="../../static/history.png" class="img"></image>
          <text>历史</text>
        </view>
        <uni-icons type="right" size="20" color="rgb(204,204,204)"></uni-icons>
      </navigator> 
      <view class="info" @click="gotoInfo">
        <view class="inner-box">
          <image src="../../static/info.png" class="img"></image>
          <text>我的信息</text>
        </view>
        <uni-icons type="right" size="20" color="rgb(204,204,204)"></uni-icons>
      </view>
      <view class="save" @click="gotoCollect">
        <view class="inner-box">
          <image src="../../static/save.png" class="img"></image>
        <text>收藏</text>
        </view>
        <uni-icons type="right" size="20" color="rgb(204,204,204)"></uni-icons>
      </view>
      <navigator class="about-us" url="../../subpkg2/about/about">
        <view class="inner-box">
            <image src="../../static/about.png" class="img"></image>
            <text>关于</text>
        </view>
        <uni-icons type="right" size="20" color="rgb(204,204,204)"></uni-icons>
      </navigator>
      <view class="myPublish" @click="gotoMyPublish">
        <view class="inner-box">
            <image src="../../static/myPublish.png" class="img"></image>
            <text>我的发布</text>
        </view>
        <uni-icons type="right" size="20" color="rgb(204,204,204)"></uni-icons>
      </view>
    </view>
  
    <view>
      <tab-bar pagePath="pages/ my/ my"></tab-bar>
    </view>
  </view>
</template>

<script>
  import {mapMutations,mapState} from 'vuex'
  
  export default {
    data() {
      return {
        openid:JSON.parse(uni.getStorageSync('openid')||'')
      };
    },
    computed:{
      ...mapState('m_user',['userinfo']),
    },
    methods:{
      ...mapMutations('m_user',['updateUserInfo']),
      gotoInfo(){
        if(Object.keys(this.userinfo).length===0){
          uni.showToast({
            title:'您还未完成登录!',
            duration:600,
            icon:'error'
          })
           return
        }
      },
      gotoCollect(){
        if(Object.keys(this.userinfo).length===0){
          uni.showToast({
            title:'您还未完成登录!',
            duration:600,
            icon:'error'
          })
           return
        }
        uni.navigateTo({
          url:'/subpkg2/collect/collect'
        })
      },
      gotoMyPublish(){
        if(Object.keys(this.userinfo).length===0){
          uni.showToast({
            title:'您还未完成登录!',
            duration:600,
            icon:'error'
          })
           return
        }
        uni.navigateTo({
          url:"/subpkg2/myPublish/myPublish?openid="+this.openid
        })
      },
      //用户授权后，获取用户基本信息
      getUserProfile(){
        //如果不为空对象就返回
        if(Object.keys(this.userinfo).length!==0) return
        uni.getUserProfile({
          desc:"获取你的昵称、头像、地区及性别",
          success:(res)=>{
            this.updateUserInfo(res.userInfo)
            let openid=JSON.parse(uni.getStorageSync('openid')||'')
            let that=this
            setTimeout(function(){
              wx.cloud.database().collection('user')
              .where({
                    _openid:openid
              })
              .get()
              .then(res=>{
                     console.log(that.userinfo.avatarUrl)
                     console.log(that.userinfo.nickName)
                    if(res.data.length==0){
                           wx.cloud.database().collection('user')
                           .add({
                                  data:{
                                    avatarUrl:that.userinfo.avatarUrl,
                                    nickName:that.userinfo.nickName,
                                    collect:[]
                                  }
                            })
                            .then(addResult=>{
                            })
                    }
                    else{//更新头像和昵称
                          wx.cloud.database().collection('user').doc(res.data[0]._id)
                           .update({
                                  data:{
                                      avatarUrl:that.userinfo.avatarUrl,
                                      nickName:that.userinfo.nickName,
                                  }
                            })
                            .then(updateResult=>{
                              console.log(updateResult)
                            })
                     }
              })
            },2000)
          },
          fail:()=>{
            uni.showToast({
              title:'您取消了登录授权',
              duration:500,
              icon:'none'
            })
          }
        })
      },
      logOut(){
        this.userinfo=={}
        this.updateUserInfo({})
      }
    }
  }
</script>

<style lang="scss">
.login{
  width: 100%;
  height: 30vh;
  position: relative;
  background: rgba(167, 209, 146, 0.2);
  .logout-img{
    position: absolute;
    top:30rpx;
    right:30rpx;
    width:50rpx;
    height:50rpx;
  }
  .login-img{
    width: 10vh;
    height: 10vh;
    position: absolute;
    top:14vh;
    left:8vw;
    border-radius: 50%;
    box-shadow: 4px 5px 6px 0px rgba(0, 0, 0, 0.25);
  }
  
  .name{
    position: absolute;
    top:18vh;
    right:48vw;
    font-size: 20px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
  }
}
.userinfo{
  position: relative;
  top:-20px;
  left:0;
  width: 96%;
  height:54vh;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 20px;
  padding-top: 10px;
  .history,
  .info,
  .save,
  .about-us,
  .myPublish{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width:80%;
    height:8vh;
    border-radius: 20px;
    box-shadow: 0px 1px 4px 0px rgba(34, 41, 43, 0.25);
    margin: 10px auto;
    background-color: #fff;
    padding-right: 5px;
  }
}
.inner-box{
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-around;
    align-items: center;
    width: 60%;
    height: 90%;
    .img{
    width: 70rpx;
    height: 70rpx;
    vertical-align: middle;
  }
}
.info .inner-box{
  width: 70%;
}
</style>

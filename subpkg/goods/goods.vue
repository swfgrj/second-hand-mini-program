<template>
  <view>
    <view class="good-item">
      <swiper :indicator-dots="true" :autoplay="true" :interval="2000" :duration="1000" :circular="true" class="swiper-container">
        <swiper-item v-for="(item,index) in content.photo">
          <image :src="item" style="width: 100%;height: 100%;" mode="aspectFill"></image>
        </swiper-item>
      </swiper>
      <view class="box1">
        <view class="box1-son1">
          <view class="price">￥{{content.price}}</view>
          <view class="self-info">
            <image :src="content.avatarUrl" class="img" :data-openid="content._openid" @click="gotoMyPublish"></image>
            <text class="text">{{content.nickName}}</text>
          </view>
        </view>
        <view class="box1-son2">
          <input type="text" :placeholder="content.title" placeholder-class="ph" disabled="true"/>
          <text style="text-overflow: ellipsis;font-size: 17px;">{{content.note}}</text>
        </view>
      </view>
      <view class="box2">
        <view class="good-detail">
          <input type="text" placeholder="物品详情" placeholder-class="ph" disabled="true"/>
          <textarea class="text">{{content.detail}}</textarea>
        </view>
        <view class="location">
          <image src="../../static/location.png" style="width: 30px;height: 30px;margin-right: 15px;"></image>
          <text>{{content.location}}</text>
        </view>
      </view>
    </view>
    
    
    
    <view class="bottom-box">
      <view class="save" @click="collectGood">
        <image :src="isCollected===true?'../../static/collect.png':'../../static/uncollect.png'" class="img"></image>
        <text>收藏</text>
      </view>
      <view class="communication" @click="chatWithOwner">
        <image src="../../static/communication.png" class="img"></image>
        <text>沟通</text>
      </view>
    </view>
  </view>
</template>

<script>
   import {mapMutations,mapState} from 'vuex'
  
  export default {
    data() {
      return {
        content:'',
        isCollected:false,
        isLoading:false
      };
    },
    computed:{
      ...mapState('m_user',['userinfo']),
    },
    onLoad(options) {
      this.content=JSON.parse(options.content)
      
      let that=this
      let openid=JSON.parse(uni.getStorageSync('openid')||'')
      if(Object.keys(this.userinfo).length!==0){
        wx.cloud.callFunction({
          name:'getUser',
          data:{
            openid:openid
          }
        }).then(res=>{
          if(res.result.data[0].collect.indexOf(that.content._id)===-1){
            that.isCollected=false
          }
          else{
            that.isCollected=true
          }
        })
      }
    },
    //分享给朋友
    onShareAppMessage(){
          return {
              title:this.content.title,
              path:'/subpkg/goods/goods?content='+JSON.stringify(this.content),
              imageUrl:this.content.photo[0]
        }
    },
    
    //分享到朋友圈
    onShareTimeline(){
          return{
                  title:this.content.title,
                  query:{
                       id:this.content._id
                  },
                  imageUrl:this.content.photo[0]
           }
    },
    methods:{
      gotoMyPublish(e){
        let openid=e.currentTarget.dataset.openid
        console.log(openid)
        uni.navigateTo({
          url:"/subpkg2/myPublish/myPublish?openid="+openid
        })
      },
      collectGood(){
        if(Object.keys(this.userinfo).length===0){
          uni.showModal({
            content:'您还未登录!',
            success(res) {
              if(res.confirm){
                uni.switchTab({
                  url:'/pages/ my/ my'
                })
              }else{
                return
              }
            }
          })
        }
        else{
             let that=this
             let openid=JSON.parse(uni.getStorageSync('openid')||'')
             if(that.isLoading)  return
             that.isLoading=true
             that.isCollected=!that.isCollected
             wx.cloud.callFunction({
               name:'getUser',
               data:{
                 openid:openid
               }
             }).then(res=>{ 
                 let collect=[]
                 collect=res.result.data[0].collect
                 let index=collect.indexOf(that.content._id)
                 if(that.isCollected){
                   if(index===-1){
                     collect.unshift(that.content._id)
                   }
                 }
                 else{
                   if(index!==-1){
                     collect.splice(index,1)
                   }
                 }
                 wx.cloud.database().collection('user').doc(res.result.data[0]._id).update({
                   data:{
                     collect:collect
                   }
                 }).then(updateResult=>{
                   that.isLoading=false
                 })
             })
        }
      },
      chatWithOwner(){
        if(Object.keys(this.userinfo).length===0){
          uni.showModal({
            content:'您还未登录!',
            success(res) {
              if(res.confirm){
                uni.switchTab({
                  url:'/pages/ my/ my'
                })
              }else{
                return
              }
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss">
.good-item{
  width: 96%;
  height: 74vh;
  margin: 0 auto;
  border-radius: 25px;
  opacity: 0.8;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  .swiper-container{
    width:100%;
    height:30vh;
  }
  .box1{
    width: 100%;
    height: 14vh;
    border-bottom: 2px solid #efefef;
    padding:10px;
    .box1-son1{
      display: flex;
      justify-content: space-between;
      flex-wrap: nowrap;
      align-items: center;
      padding: 0 5px;
      width: 100%;
      height: 40%;
      .price{
        width: 50%;
        height: 100%;
        color: #C00000;
        opacity: 0.9;
        font-size: 25px;
      }
      .self-info{
        width: 60%;
        height: 100%;
        font-size: 14px;
        font-weight: 400;
        display: flex;
        flex-wrap: nowrap;
        justify-content: center;
        align-items: center;
        .img{
          width:50px;
          height:50px;
          border-radius:50%;
          margin-right: 10px;
        }
     }
    }
    .box1-son2{
      width:100%;
      height:50%;
      color: rgba(0, 0, 0, 1);
      .ph{
         font-size: 24px;
         font-weight: 700;
        color: rgba(0, 0, 0, 1);
      }
    }
  }
  .box2{
    width: 100%;
    height: 28vh;
    display: flex;
    flex-direction: column;
    position: relative;
    padding-top: 20rpx;
    .good-detail{
      width: 96%;
      height: 80%;
      font-size: 22px;
      margin: 0 auto;
      .ph{
       font-size: 44rpx;
       font-weight: 700;
       color: rgba(0, 0, 0, 1);
      }
      .text{
        display: block;
        width: 100%;
        height: 80%;
        margin-top: 10rpx;
        word-break: break-all;
        overflow: scroll;
        text-overflow: ellipsis;
      }
    }
    .location{
      position:absolute;
      bottom:5px;
      left:6px;
      display: flex;
      align-items: center;
      font-size: 14px;
      color:aquamarine;
    }
  }
}
.bottom-box{
  position:fixed;
  bottom: 0;
  width: 100%;
  height: 8vh;
  background: rgba(255, 255, 255, 1);
  border-radius: 0 0 20px 20px;
  box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  align-items: center;
  .save{
    width: 50%;
    height: 80%;
    display: flex;
    justify-content: center;
    align-items: center;
    .img{
      width: 20%;
      height: 60%;
      margin-right: 20rpx;
    }
  }
  .communication{
    width: 50%;
    height: 100%;
    background: rgba(176, 81, 81, 1);
    border-radius:0 0 20px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    .img{
      width: 20%;
      height: 60%;
      margin-right: 20rpx;
    }
  }
}
</style>

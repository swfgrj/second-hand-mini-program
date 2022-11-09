<template>
  <view @click="gotoGoodDetail">
    <image :src="info.photo[0]" class="img"></image>
    <view class="text">#{{info.title}}#</view>
    <view class="tag-container">
      <block v-for="(item,index) in info.tag">
        <view class="tag">{{item}}</view>
      </block>
    </view>
    <view class="box">
      <view class="number">
         <view class="rmb">￥</view>
         <view class="price">{{info.price}}</view>
      </view>
      <view class="photo-box">
        <image src='/static/browse.png' class="img"></image>
        <view class="browse-number">{{info.browse}}</view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name:"my-good",
    props:{
      info:Object
    },
    data() {
      return {
        
      };
    },
    methods:{
      gotoGoodDetail(e){
        console.log(e);
        uni.navigateTo({
          url:'/subpkg/goods/goods?content='+JSON.stringify(this.info)
        })
      }
    }
  }
</script>

<style lang="scss">
  .img{
    width: 100%;
    height: 270rpx;
  }
  .text{
     width:100%;
     height:80rpx;
     font-size: 16px;
     margin-bottom: 10rpx;
     overflow:hidden;
     text-overflow:ellipsis;
     /*弹性伸缩和字模型显示*/
     -webkit-line-clamp:2;
     /*设置或检索伸缩盒对象的子元素的排列方式*/
     -webkit-box-orient:vertical;
  }
  .tag-container{
    width:100%;
    height:40rpx;
    white-space: nowrap;
    overflow: hidden;
    margin-bottom: 4rpx;
    .tag{
        display: inline-block;
        height:14rpx;
        border: 1px solid #f77847;
        color:#f72904;
        text-align: center;
        font-size: 11px;
        font-family: 'Times New Roman', Times, serif;
        padding: 2rpx 8rpx;
        padding-bottom: 10rpx;
        border-radius: 0 12rpx 0 12rpx;
        margin-left: 6rpx;
    }
  }
  
  .box{
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
    height: 38rpx;
    .number{
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      width:50%;
      height:38rpx;
      .rmb{
        color: #C00000;
        font-size: 16px;
        font-weight: 300;
        margin-top: 4px;
      }
      .price{
        color: #C00000;
        font-size: 20px;
        font-weight: 400;
      }
    }
    .photo-box{
      width:50%;
      height:38rpx;
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      .img{
        width: 20px;
        height: 20px;
        margin-left: 38rpx;
      }
      .browse-number{
        color: lightgray;
      }
    }
  }
</style>
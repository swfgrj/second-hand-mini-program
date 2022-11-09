<template>
  <view>
    <view>
      <swiper :indicator-dots="true" :autoplay="true" :interval="2500" :duration="1000" :circular="true" class="swiper-container" >
        <block v-for="(item,index) in swiperList">
           <swiper-item class="swiper-item">
            <image :src="item.swiperImg" class="img" mode="aspectFill"></image>
           </swiper-item>
        </block>
      </swiper>
    </view> 
    
    <view class="search-container" @click="gotoSearch">
       <input type="text" placeholder="搜索二手物品的名称或相关标签" placeholder-class="ph" style="display: block;width: 270px;" disabled="true">
        <uni-icons type="search" size="30" class="icon"></uni-icons>
      </view>
    
   <view class="nav">
      <scroll-view scroll-x="true" class="type" scroll-with-animation="true">
        <view class="type-item" v-for="(item,index) in typeList">
          <view class="type-content" :data-typeName="item.typeName" :data-typeIndex="index" @click="changeType">
            <image :src="item.typeImg" class="img"></image>
            <text :class="typeIndex===index?'type-text click-type':'type-text'">{{item.typeName}}</text>
          </view>
        </view>
      </scroll-view>
      <view class="nav-typeList">
        <image :src="isShowTypeList===true? '/static/showmenu.png':'/static/menu.png'"  @click="showTypeList" class="img"></image>
      </view>
      <view class="hidden-list" v-if="isShowTypeList">
        <block v-for="(item,index) in typeList">
          <view :class="typeIndex===index?'hidden-list-item click-type':'hidden-list-item'" :data-typeName="item.typeName" :data-typeIndex="index" @click="changeType">{{item.typeName}}</view>
        </block>
      </view>
    </view>
    

    <scroll-view scroll-y="true" enable-flex="true" class="goods-list" @scroll="scrollHandler" :scroll-top="scrollTop"
    refresher-enabled="true" :refresher-triggered="triggered" :refresher-threshold="100" refresher-background="lightgreen" @refresherpulling="onpulling" @refresherrefresh="onrefresh" @refresherrestore="onstore" @refresherabort="onabort">
      <block v-for="(item,index) in goodList[typeIndex]">
        <view class="goods-container">
          <view :data-content="item" :data-index="index" @click="tapGood">
            <my-good :info="item">
            </my-good>
          </view>
        </view>
      </block>
    </scroll-view>
    
    <view class="upLoad" @click="goTop">
      <image src="../../static/upload.png" class="img"></image>
    </view>
    
    <view>
       <tab-bar pagePath="pages/home/home"></tab-bar>
    </view>
   
  </view>
</template>

<script>
  export default {
    data() {
      return {
        swiperList:[],
        typeIndex:0,
        typeName:'全部',
        isShowTypeList:false,
        typeList:[],
        goodList:[[],[],[],[],[],[],[],[]],
        scrollTop:0,
        old: {
        			 scrollTop: 0
        		},
        triggered:false
      };
    },
    onLoad(){
        this.getTypes()
        this.getSwipers()
    },
    onShow(){
      this.getGoods()
    },
    methods:{
      onabort(){
        
      },
      onstore(){
      },
      onpulling(e){
        console.log(e)
      },
      onrefresh(){
        let that=this
        if(this.triggered)
          return
        this.triggered=true
       uni.showLoading({
          title:'正在刷新中...'
        })
        setTimeout(function(){
          uni.hideLoading()
          if(that.typeName==='全部'){
            that.getGoods()
          }
          else{
            that.getEachType()
          }
          that.triggered=false
        },2000)
      },
      scrollHandler(e) {
         this.old.scrollTop = e.detail.scrollTop
      },
      goTop(){
        // 解决view层不同步的问题
        this.scrollTop = this.old.scrollTop
        this.$nextTick(function() {
          this.scrollTop = 0
        });
      },
      getSwipers(){
        wx.cloud.callFunction({
          name:'getSwiperList',
        }).then(res=>{
          this.swiperList=res.result.data
        })
      },
      getGoods(){
        let that=this
        wx.cloud.callFunction({
          name:'getGoodList',
        }).then(res=>{
          if(res.result.data.length===0){
            return
          }
          that.goodList[0].splice(0,that.goodList[0].length)
          that.goodList[0].push(...res.result.data)
          console.log(that.goodList[0])
        })
      },
      getEachType(){
        let that=this
        wx.cloud.callFunction({
          name:'getEachTypeList',
          data:{
            typeName:this.typeName
          }
        }).then(res=>{
          if(res.result.data.length===0){
            return
          }
          that.goodList[that.typeIndex].splice(0,that.goodList[that.typeIndex].length)
          that.goodList[that.typeIndex].push(...res.result.data)
          console.log(that.goodList[that.typeIndex])
        })
      },
      changeType(e){
        this.typeName=e.currentTarget.dataset.typename,
        this.typeIndex=e.currentTarget.dataset.typeindex
        if(this.typeName==='全部'){
          this.getGoods()
        }
        else{
          this.getEachType()
        }
      },
      getTypes(){
        wx.cloud.callFunction({
          name:'getTypeList'
        }).then(res=>{
          this.typeList=res.result.data
        })
      },
      gotoSearch(){  
        uni.navigateTo({
          url:'/subpkg/search/search'
        })
      },
       tapGood(e){
        let content=e.currentTarget.dataset.content
        let index=e.currentTarget.dataset.index
        let browseGood=JSON.parse(uni.getStorageSync('browseGood')||'[]')
        this.goodList[this.typeIndex][index].browse++
        for(let i=0;i<browseGood.length;i++){
          if(browseGood[i]._id===content._id){
            browseGood.splice(i,1)
            break
          }
        }
        browseGood.unshift(this.goodList[this.typeIndex][index])
        uni.setStorageSync('browseGood',JSON.stringify(browseGood))
        wx.cloud.callFunction({
          name:'incBrowse',
          data:{
            id:content._id
          }
        }).then(res=>{
        })
      },
      showTypeList(){
        this.isShowTypeList=!this.isShowTypeList
      }
    }
  }
</script>

<style lang="scss">
.swiper-container{
   width: 100%;
   height: 29vh;
  .swiper-item{
   width: 100%;
   height:30vh;
   .img{
     width:100%;
     height:100%;
   }
  }
}
.wx-swiper-dots{//设置小圆点的位置，这个为小圆点的父类
  position: absolute;
  top:21vh;
  z-index:998;
}
.search-container{
  position:absolute;
  top:23vh;
  left:50%;
  transform: translate(-50%,0);
  z-index: 998;
  width: 560rpx;
  height: 5vh;
  border-radius: 48rpx;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 3px 4px 0px rgba(76, 88, 94, 0.25);
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
}

.click-type{
  color: chartreuse;
  opacity: 0.9;
  border-bottom: 2px solid yellow;
}

.nav{
  width:100%;
  height:7vh;  
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  margin-top: 1vh;
  background-color: white;
  position: relative;
  .type{
    white-space: nowrap;
    width:90%; 
    height:100%;
    .type-item{
      display: inline-block;
      width:25%;
      height: 100%;
      .type-content{
        width:100%;
        height:100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        .img{
          width:50%;
          height:56%;
        }
        .type-text{
          font-size:13px;
        }
      }
    }
  }
  
  .nav-typeList{
    width:10%;
    height:100%;
    display: flex;
    align-items: center;
    .img{
      width:80%;
      height:80%;
    }
  }
  .hidden-list{
      position: absolute;
      top:100%;
      right:0;
      z-index: 998;
      width:100%;
      height:12vh;
      background-color: white;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-around;
      .hidden-list-item{
        width:21%;
        height:30%;
        font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
        text-align: center;
        border:2px solid #eee;
      }
  }
}
.goods-list{
  width: 100%;
  height: 55vh;
  margin-bottom: 1vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.upLoad{
  position: fixed;
  bottom: 11vh;
  right:2vw;
  z-index: 998;
  background-color: mistyrose;
  width:80rpx;
  height:80rpx;
  .img{
    width:100%;
    height:100%;
  }
}


.goods-container{
  width: 340rpx;
  height: 460rpx;
  background: rgba(255, 255, 255, 1);
  border-radius: 20rpx;
  margin: 12rpx auto;
}
</style>

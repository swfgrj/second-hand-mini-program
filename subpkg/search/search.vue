<template>
  <view>
    <view class="search-container">
       <input type="text" placeholder="搜索二手物品的名称或相关标签"  style="display: block;width: 270px;" @input="inputHandler" :value="inputValue">
       <uni-icons type="search" size="35" class="icon" @click="clickHanlder"></uni-icons>
    </view>
  
  <view class="history-box" v-if="isShowHistory">
    <view class="tip">
      <input placeholder="搜索历史" placeholder-class="ph" disabled="true"/>
      <view class="del">
        <image src="../../static/delete.png" class="img" @click="clearHistory"></image>
        <view class="text">
          <text style="color: rgba(138,138,128,1);">|</text>
          <text style="color: rgba(128,128,128,0.6);" @click="clickDelText">{{isShowDelSign===true?'取消删除':'删除'}}</text>
        </view>
      </view>
    </view>
    <block v-for="(item,index) in history.slice(0,6)">
      <view class="history-item">
        <view class="history-text" :data-value="item" @click="inputHistoryText">{{item}}</view>
        <image src="../../static/erase.png" class="little-del":data-index="index" @click="delItem" v-if="isShowDelSign"></image>
      </view>
    </block>
  </view>
  
  <scroll-view scroll-y="true" enable-flex="true" class="goods-list">
    <block v-for="(item,index) in searchResult">
      <view class="goods-container">
        <view :data-content="item" :data-index="index" @click="tapGood">
           <my-good :info="item"></my-good>
        </view>
      </view>
    </block>
  </scroll-view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        inputValue:'',//保存搜索框的内容
        old:{
          inputValue:''
        },
        history:JSON.parse(uni.getStorageSync('history')||'[]'),
        isShowHistory:true,
        isShowDelSign:false,
        searchResult:[]
      };
    },
    onLoad() {
      if(this.history.length===0){
        this.isShowHistory=false
      }
    },
    onShow(){
      this.getsearchResult()
    },
    methods:{
      inputHistoryText(e){
        let value=e.currentTarget.dataset.value
        this.inputValue=value
      },
      clickDelText(){
        this.isShowDelSign=!this.isShowDelSign
      },
      delItem(e){
        let index=e.currentTarget.dataset.index
        this.history.splice(index,1)
        if(this.history.length===0){
          this.isShowHistory=false
          this.isShowDelSign=false
        }
        uni.setStorageSync('history',JSON.stringify(this.history))
      },
      clearHistory(){
        let that=this
        uni.showModal({
          title:'清空历史记录',
          content:'确定要清空所有搜索历史吗?',
          success(res) {
            if(res.confirm){
                console.log(res)
                that.isShowHistory=false
                that.history=[]
                uni.setStorageSync('history',JSON.stringify([]))
                console.log(that.isShowHistory);
                console.log(that.history);
            }
            else{
              return
            }
            
          }
        })
      },
      removeDuplicate(arr) {
        const newArr = []
        arr.forEach(item => {
          if (newArr.indexOf(item) === -1) {
            newArr.push(item)
          }
        })
        return newArr // 返回一个新数组
      },
      getsearchResult(){
        wx.cloud.callFunction({
          name:'getSearchList',
          data:{
            value:this.inputValue
          }
        }).then(res=>{
          if(res.result.data.length===0) 
          {
            uni.showToast({
              title:'搜索结果为空',
              duration:800,
              icon:'error'
            })
             return
          }
          this.searchResult=res.result.data
        })
      },
      clickHanlder(){
        if(this.inputValue==='')
        {
          uni.showToast({
            title:'您输入的搜索内容为空',
            duration:500,
            icon:'none'
          })
          return
        }
        this.old.inputValue=this.inputValue
        if(this.history.length===0){
          this.isShowHistory=true
        }
        this.history.unshift(this.old.inputValue)
        this.history=this.removeDuplicate(this.history)
        uni.setStorageSync('history',JSON.stringify(this.history))
        this.searchResult=[]
        this.getsearchResult()
        this.inputValue=''
      },
      inputHandler(e){
        console.log(e)
        this.inputValue=e.detail.value
      },
      tapGood(e){
        let content=e.currentTarget.dataset.content
        let index=e.currentTarget.dataset.index
        let browseGood=JSON.parse(uni.getStorageSync('browseGood')||'[]')
        this.searchResult[index].browse++
        for(let i=0;i<browseGood.length;i++){
          if(browseGood[i]._id===content._id){
            browseGood.splice(i,1)
            break
          }
        }
        browseGood.unshift(this.searchResult[index])
        uni.setStorageSync('browseGood',JSON.stringify(browseGood))
        wx.cloud.callFunction({
          name:'incBrowse',
          data:{
            id:content._id
          }
        }).then(res=>{
        })
      }
    }
  }
</script>

<style lang="scss">
.search-container{
  margin: 30rpx auto;
  width: 640rpx;
  height: 6vh;
  border-radius: 64rpx;
  background: rgba(169,169,169,0.2);
  box-shadow: 0px 3px 4px 0px rgba(76, 88, 94, 0.25);
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
}


.ph{
    color: black;
    font-size: 1.1em;
}

.history-box{
  width:94%;
  margin: 0 auto;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  .tip{
    width:100%;
    height:3vh;
    margin-bottom: 6rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .del{
      width:20%;
      height:100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      .img{
        width:38%;
        height:100%;
        display: flex;
        align-items: center;
      }
      .text{
        width:46%;
        height:100%;
        font-size: 0.8em;
        text-align: center;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
  
  .history-item{
    position: relative;
    width:auto;
    heigth:2vh;
    .history-text{
      height: 100%;
      font-size:0.8em;
      font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
      background-color:rgba(128,128,128,0.1);
      text-align: center;
      border-radius:10rpx;
      margin:4rpx 12rpx;
      padding:16rpx 26rpx;
      box-sizing: border-box;
      overflow:hidden;
      white-space: nowrap;
      text-overflow:ellipsis;
      /*弹性伸缩和字模型显示*/
      -webkit-line-clamp:1; 
    }
   .little-del{
      width:40rpx;
      height: 40rpx;
      position: absolute;
      top:-6%;
      right:0;
    }
  }
}

.goods-container{
  width: 340rpx;
  height: 460rpx;
  background: rgba(255, 255, 255, 1);
  border-radius: 20rpx;
  margin: 12rpx auto;
}

.goods-list{
  width: 100%;
  height: 68vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
}
</style>

<template>
  <view>
    <uni-section title="商品标题" type="line" padding>
    	<uni-easyinput  :styles="styles" :placeholderStyle="placeholderStyle" placeholder="请输入内容"  @input="inputTitle" :value="title"></uni-easyinput>
    </uni-section>
    
    <uni-section title="商品详情"  type="line" padding>
    			<uni-easyinput type="textarea"  placeholder="请输入内容" @input="inputDetail" :value="detail"></uni-easyinput>
    </uni-section>
    
    <view class="price-box">
      <view>
        <uni-section title="价格" type="line" padding></uni-section>
      </view>
      <view class="number-box">
        <view class="subtract" @click="subtractPrice">-</view>
        <input type="number" class="digit" placeholder-class="ph" @input="inputPrice" :value="price"/>
        <view class="plus" @click="plusPrice">+</view>
      </view>
    </view>
    
    <uni-section title="商品照片(最多可选3张)" type="line" padding></uni-section>
    <view class="photo-box">
      <image src="../../static/Plus.png" class="img" @click="selectPhoto"></image>
    </view>
  
    <view  class="img-box" v-if="imgPath.length!==0">
      <block v-for="(item,index) in imgPath">
        <view class="img-item">
           <image class="img" :src="item"></image>
           <view class="del" :data-index="index" @click="delPhoto">x</view>
        </view>
      </block>
    </view>
    
      <uni-section title="分类" type="line">
      <uni-data-select
        v-model="value"
        :localdata="range"
        @change="changeType"
      ></uni-data-select>
    </uni-section>
  
    <uni-section title="备注" subTitle="(可选)" type="line" padding :value="note">
    	<uni-easyinput  :styles="styles" :placeholderStyle="placeholderStyle" placeholder="请输入内容"  @input="inputNote"></uni-easyinput>
    </uni-section>
    
    <view class="tag-box">
      <uni-section title="标签" subTitle="(可选)(最多3个)" type="line" padding></uni-section>
      <view class="right">
        <view class="input-box">
          <input placeholder="输入标签内容" class="tag-input" @input="inputTag"/>
          <view class="plus" @click="plusTag">+</view>
        </view>
        <view class="tag">
          <block v-for="(item,index) in tag">
              <view class="tag-item">
                <uni-tag :inverted="true" :text="item" type="error" />
                <view class="del" :data-index="index" @click="delTag">X</view>
              </view>
          </block>
        </view>
      </view>
    </view>
    
    <view class="publish">
      <image src="../../static/publish.png" class="img" @click="publish"></image>
    </view>
  </view>
</template>

<script>
  import {mapMutations,mapState} from 'vuex'
  import amap from '@/amap-wx.130.js'
  
  export default {
    data() {
      return {
        address: "", //当前地址
        amapPlugin: null,
        key: 'f1090fd027ed4ff5c416812eaff1aa77',//高德key
        
        title:'',
        
        placeholderStyle: "color:#2979FF;font-size:14px",
        styles: {
          color: '#2979FF',
          borderColor: '#2979FF'
        },
        
        detail:'',
        price:0,
        imgPath:[],
        
        value: 6,
        range: [
          { value: 0, text: "图书文具" },
          { value: 1, text: "日用品" },
          { value: 2, text: "数码" },
          { value: 3,text:"化妆品"},
          { value: 4,text:"运动器材"},
          { value: 5,text:"衣服"},
          { value: 6,text:"其它"},
        ],
        
        type:'',
        note:'',
        tempTag:'',
        tag:[],
        isLoading:false,
      };
    },
    computed:{
      ...mapState('m_user',['userinfo']),
    },
    onLoad() {
      if(Object.keys(this.userinfo).length===0){
        uni.showModal({
          content:'您还未登录!',
          success(res) {
            if(res.confirm){
              uni.switchTab({
                url:'/pages/ my/ my'
              })
            }else{
              uni.navigateBack({
                delta:1
              })
            }
          }
        })
      }
      
      //获取地理位置
      this.getAddress()
    },
    methods:{
      		getAddress(){
      				const _this = this;
      				_this.amapPlugin = new amap.AMapWX({
      					key: _this.key
      				});
      				uni.showLoading({
      					title: '获取信息中'
      				});
      				// 成功获取位置
      				_this.amapPlugin.getRegeo({
      					success: (data) => {
      						console.log(data, '当前定位')
      						_this.address = `${data[0].regeocodeData.addressComponent.city}${data[0].regeocodeData.addressComponent.district}`;
                  console.log(_this.address)
      						uni.hideLoading();
      					},
      					// 获取位置失败
      					fail: (err) => {
      						uni.showToast({
      							title:"获取位置失败",
      							icon:"error"
      						})
      					}
      				});
      },
            
      inputTitle(e){
        this.title=e
      },
      inputDetail(e){
        this.detail=e
      },
      subtractPrice(){
        if(this.price===0)
          return
        this.price--
      },
      inputPrice(e){
        this.price=e.detail.value
      },
      plusPrice(){
        this.price++
      },
      selectPhoto(){
        let that=this
        that.imgPath=[]
        uni.chooseImage({
        	count: 3, //默认9
        	sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        	sourceType: ['album'], //从相册选择
        	success: function (res) {
             that.imgPath=res.tempFilePaths.slice(0,3)
        	}
        });
      },
      delPhoto(e){
        let index=e.currentTarget.dataset.index
        this.imgPath.splice(index,1)
      },
      changeType(e){
        this.type=this.range[e].text
        console.log(this.type)
      },
      inputNote(e){
        this.note=e
      },
      inputTag(e){
        this.tempTag=e.detail.value
      },
      plusTag(){
        if(this.tag.length===3){
          return
        }
        this.tag.push(this.tempTag)
      },
      delTag(e){
        let index=e.currentTarget.dataset.index
        this.tag.splice(index,1)
      },
      addGood(){
        let date=new Date()
        let that=this
        let images=[]
        that.isLoading=true
        uni.showLoading({
          title:'商品正在发布'
        })
        for(let i=0;i<that.imgPath.length;i++){
            wx.cloud.uploadFile({
                // 指定上传到的云路径
                cloudPath: '_cloud_'+new Date().getTime()+Math.floor(Math.random()*10000)+'.jpg',
                // 指定要上传的文件的小程序临时文件路径
                filePath: that.imgPath[i],
                // 成功回调
               success(res){
                 images.push(res.fileID)
                 if(images.length===that.imgPath.length){
                   uni.hideLoading()
                   uni.showToast({
                     title:'商品发布成功!',
                     icon:'success',
                     duration:800
                   })
                   wx.cloud.database().collection('good').add({
                     data:{
                       title:that.title,
                       detail:that.detail,
                       photo:images,
                       price:that.price,
                       type:that.type,
                       note:that.note,
                       tag:that.tag,
                       //location:'广州',
                       nickName:that.userinfo.nickName,
                       avatarUrl:that.userinfo.avatarUrl,
                       date:date,
                       browse:0
                     }
                   }).then(res=>{
                   })
                   that.title=''
                   that.detail=''
                   that.note=''
                   that.imgPath=[]
                   that.isLoading=false
                 }
               }
          })
        }
        
      },
      publish(){
        if(this.title===''){
          uni.showToast({
            title:'标题不能为空!',
            duration:500,
            icon:'error'
          })
          return
        }
        if(this.detail===''){
          uni.showToast({
            title:'物品详情不能为空!',
            duration:500,
            icon:'error'
          })
          return
        }
        if(this.imgPath.length===0){
          uni.showToast({
            title:'至少选择一张图片!',
            duration:500,
            icon:'error'
          })
          return
        }
        if(this.isLoading)
           return
        if(this.type===''){
          this.type='其它'
        }
       this.addGood()
      }
    }
  }
</script>

<style lang="scss">
 page{
      background: #f6f7fa;
}

.price-box{
  width:100%;
  height:4vh;
  background-color: white;
  border-bottom: 1px solid #c8c9cc;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  .number-box{
    width:30%;
    height:100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .subtract{
      width:16%;
      height:80%;
      background-color: #c8c9cc;
    }
    .digit{
      width:60%;
      height:80%;
      .ph{
      background-color: #c8c9cc;
      }
    }
    .plus{
      width:16%;
      height:80%;
      text-align: center;
      background-color: #c8c9cc;
    }
  }
}

.photo-box{
  width:100%;
  height:8vh;
  border-bottom: 1px solid #c8c9cc;
  background-color: #fff;
  padding-left: 50rpx;
  display: flex;
  flex-direction: column;
  .img{
    width:6vh;
    height:6vh;
  }
}

.img-box{
  width:100%;
  height:16vh;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  .img-item{
    width: 25%;
    height: 8vh;
    position: relative;
    .img{
      width:100%;
      height:100%;
    }
    .del{ 
      position: absolute;
      top:0;
      right:0;
      width:50rpx;
      height:38rpx;
      color: white;
      font-size: 0.8em;
      text-align: center;
      background-color: gray;
      opacity: 0.6;
    }
  }
}

.tag-box{
  width:100%;
  height:4vh;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  .right{
    width:80%;
    height:100%;
    display: flex;
    flex-direction: column;
    .input-box{
      width:100%;
      height:50%;
      margin-bottom: 20rpx;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      .tag-input{
        width:60%;
        height:100%;
      }
      .plus{
        width:20%;
        height:100%;
        font-size: 0.8em;
        display: flex;
        justify-content: center;
        align-items: center;
        color: black;
        background-color: rgba(200,201,204,0.8);
      }
    }
    
    .tag{
      width:100%;
      height:40%;
      display: flex;
      flex-direction: row;
      .tag-item{
        position: relative;
        .del{ 
          position: absolute;
          top:-10%;
          right:0;
          width:28rpx;
          height:20rpx;
          font-size:0.5em;
          text-align: center;
          color: white;
          background-color: red;
          opacity: 0.5;
        }
      }
    }
  }
}

.publish{
  position: fixed;
  bottom: 3vh;
  right: 2vh;
  z-index: 998;
  width:6vh;
  height:6vh;
  .img{
    width:100%;
    height:100%;
  }
}
</style>

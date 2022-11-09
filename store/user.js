export default{
  //开启命名空间
  namespaced:true,
  //数据
  state:()=>({
    //用户的信息对象
    userinfo:JSON.parse(uni.getStorageSync('userinfo')||'{}'),
  }),
  //方法
  mutations:{
    updateUserInfo(state,userinfo){
      state.userinfo=userinfo
      this.commit('m_user/saveUserInfoToStorage')
    },
    saveUserInfoToStorage(state){
      uni.setStorageSync('userinfo',JSON.stringify(state.userinfo))
    }
  },
  
  getters:{
    
  }
}
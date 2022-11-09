// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()
const _=db.command
const $=_.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  let value=event.value
   return await db.collection('good').where(_.or({
     title:db.RegExp({
       regexp:value,
       options:'i'
     })
  },
  {
    tag:_.all([value])
  },
  {
    type:value
  })
).limit(18).orderBy('date','desc').get()
}
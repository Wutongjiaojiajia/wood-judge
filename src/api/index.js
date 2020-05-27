import req from "./req";


export default {
    // 查询价格维护列表信息
    queryPriceMaintainListInfo:(data)=>req({
        baseUrl:'wood',
        url:'',
        method:'get',
        params:data,
        isOriginalGET:true
    }),
    // 新增or编辑价格维护信息
    updatePriceMaintainInfo:(data)=>req({
        baseUrl:'wood',
        url:'',
        method:'post',
        params:data,
        isOriginalGET:true
    }),
    // 删除价格维护信息
    deletePriceMaintainInfo:(data)=>req({
        baseUrl:'wood',
        url:'',
        method:'post',
        params:data,
        isOriginalGET:true
    })
}
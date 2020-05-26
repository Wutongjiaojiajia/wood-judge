<template>
    <div class="m-views-priceMaintain">
        <div class="m-priceMaintain-grid">
            <van-row class="m-grid-thead">
                <van-col :span="2"></van-col>
                <van-col :span="8">录入日期</van-col>
                <van-col :span="10">填入内容</van-col>
                <van-col :span="4">得分</van-col>
            </van-row>
            <div class="m-grid-tbody">
                <van-list
                    class="m-tbody-info"
                    v-model="pullupLoading"
                    :finished="finished"
                    finished-text="没有更多了"
                    :error.sync="pullupError"
                    error-text="请求失败，点击重新加载"
                    @load="pullupLoadList()">
                    <van-row
                        v-for="(item,index) in formData"
                        :key="index"
                        class="m-info-row"
                        @click="selectRowToTick(index)">
                        <van-cell-group>
                            <van-col :span="2">
                                <van-checkbox 
                                    v-model="item.checked"
                                    checked-color="#3071F2"
                                    shape="square"
                                    icon-size="15px">
                                </van-checkbox>
                            </van-col>
                            <van-col :span="8">{{item.updateTime.substr(0,10)}}</van-col>
                            <van-col :span="10">{{item.fillContent}}</van-col>
                            <van-col :span="4">{{item.score}}</van-col>
                        </van-cell-group>
                    </van-row>
                </van-list>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:'priceMaintain',
    data () {
        return {
            // 列表内容
            formData:[],
            
            selectRowIndex:null,    //选中行下标

            pullupLoading:false,  //上拉加载状态
            finished:true, //是否已经结束调用接口
            pullupError:false,  //上拉加载错误

            totalPage:0,  //总页数
            pageNumber:0,    //第x页
            pageSize:30    //每次查询数量
        }
    },
    methods: {
        // 初始化列表信息
        initList(){
            let obj = {
                current:this.pageNumber+1,  //第x页
                size:this.pageSize, //每页大小
                entity:{
                    quotaId:this.$route.query.id,   //积分项id
                    companyCode:this.$route.query.companyCode, //公司代码
                    agencyCode:this.$utils.getStorage('userInfo').agencyCode,   //经销商编号
                }
            };
            this.$http.queryQuotaScoreDetails(obj)
            .then(res=>{
                let { data } = res;
                if(data.code === 1 && data.total > 0){
                    let originData = data.rows.splice(0);
                    // this.formData = this.handleRowData(originData);    //列表数据
                    this.formData = originData;
                    let totalPage = Math.floor(data.total/this.pageSize);
                    this.totalPage = data.total%this.pageSize === 0?totalPage:totalPage+1;  //实际总页数
                    if(this.totalPage > 1){
                        this.pageNumber += 1;
                        this.finished = false;  // 未结束调用接口
                    }
                }else{
                    this.formData = []; //列表数据
                    this.totalPage = 1; //实际总页数
                }
            })
            .catch(err=>{
                this.formData = []; //列表数据
                this.totalPage = 1; //实际总页数
            })
        },
        // 刷新列表
        refreshList(){
            this.pageNumber = 0;    //第x页
            this.totalPage = 0; //实际页数
            this.initList();    //重新初始化列表数据
        },
        // 上拉加载列表
        pullupLoadList(){
            let obj = {
                current:this.pageNumber+1,  //第x页
                size:this.pageSize, //每页大小
                entity:{
                    quotaId:this.$route.query.id,   //积分项id
                    companyCode:this.$route.query.companySelect, //公司代码
                    agencyCode:this.$utils.getStorage('userInfo').agencyCode,   //经销商编号
                }
            };
            this.pullupLoading = true;  //上拉加载状态
            this.$http.queryQuotaScoreDetails(obj)
            .then(res=>{
                this.pullupLoading = false; //上拉加载状态
                let { data } = res;
                if(data.code === 1 && data.total > 0){
                    let originData = data.rows.splice(0);
                    this.formData = this.formData.concat(this.handleRowData(originData));    //合并列表数据
                    this.pageNumber += 1;
                    if(this.pageNumber >= this.totalPage){
                        this.finished = true;
                    }
                }
            })
            .catch(err=>{
                this.pullupLoading = false; //上拉加载状态
                this.pullupError = true;
            })
        },
    }
}
</script>

<style lang="less">
.m-views-priceMaintain{
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    overflow-y: auto;
    .m-priceMaintain-grid{
        background-color: #FFF;
        padding-top: 10px;
        margin-bottom: 90px;
        .m-grid-thead{
            margin:0 10px;
            color: #2E3033;
            font-weight: 600;
            padding: 10px 5px;
            background-color: #F2F3F5;
            border-bottom: 1px solid #EEEEEE;
            text-align: left;
            font-size: 14px;
            .van-col{
                padding: 0 5px;
            }
        }
        .m-grid-tbody{
            margin: 0 10px 10px;
            .m-info-row{
                color: #2E3033;
                font-size: 14px;
                border: 1px solid #eee;
                border-top: 0px;
                border-bottom: 0px;
                text-align: center;
                word-wrap:break-word;
                background-color: #fff;
                position: relative;
                .van-cell-group {
                    overflow: hidden;
                    display: flex;
                    display: -webkit-flex;
                    flex-flow: row wrap;
                    justify-content: space-between;
                    align-items: center;
                    .van-col{
                        text-align: left;
                        padding: 10px 5px;
                    }
                }
                .van-cell-group:active{
                    background:linear-gradient( rgba(98, 98, 98, 0.1), rgba(98, 98, 98, 0.1) );
                }
            }
            .m-info-row:nth-last-child(1){
                border-bottom: none;
            }
        }
    }
}
</style>
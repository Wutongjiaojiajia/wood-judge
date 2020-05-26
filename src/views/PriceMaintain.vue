<template>
    <div class="m-views-priceMaintain">
        <van-nav-bar title="板价维护">
            <template #left>
                <van-icon 
                    name="arrow-left" 
                    size="20" 
                    color="#999999"
                    @click="backToHome()"/>
            </template>
            <template #right>
                <van-icon 
                    name="plus" 
                    size="20" 
                    color="#999999"
                    @click="showPopup({type:'add',data:null})"/>
            </template>
        </van-nav-bar>
        <div class="m-priceMaintain-grid">
            <van-row class="m-grid-thead">
                <van-col :span="6">厚度</van-col>
                <van-col :span="6">AA</van-col>
                <van-col :span="6">AB</van-col>
                <van-col :span="6">CC</van-col>
            </van-row>
            <div class="m-grid-tbody">
                <van-pull-refresh 
                    v-model="pullDownLoading" 
                    @refresh="refreshList">
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
                                class="m-info-row">
                                <van-swipe-cell
                                    :before-close="deleteWoodPriceRow">
                                    <van-cell-group
                                        @click="showPopup({type:'edit',data:item})">
                                        <van-col :span="6">{{item.thickness}}</van-col>
                                        <van-col :span="6">{{item.A}}</van-col>
                                        <van-col :span="6">{{item.B}}</van-col>
                                        <van-col :span="6">{{item.C}}</van-col>
                                    </van-cell-group>
                                    <template #right>
                                        <van-button 
                                            square text="删除" 
                                            type="danger" 
                                            class="delete-button"
                                            @click="selectDeleteRow(index)"/>
                                    </template>
                                </van-swipe-cell>
                            </van-row>
                    </van-list>
                </van-pull-refresh>
            </div>
        </div>
        <van-popup
            class="m-popup-addOrEdit"
            v-model="popupShow" 
            round
            position="bottom"
            safe-area-inset-bottom 
            :style="{ height: '70%' }">
            <van-nav-bar :title="popupTitle"></van-nav-bar>
            <van-cell-group>
                <van-field 
                    v-model="thickness" 
                    label="厚度(mm)*" 
                    placeholder="请输入拼板厚度"
                    clearable
                    type="number">
                </van-field>
            </van-cell-group>
            <van-cell-group>
                <van-field 
                    v-model="APrice" 
                    label="AA(元/m³)*" 
                    placeholder="请输入对应厚度AA板价钱"
                    clearable
                    type="number">
                </van-field>
                <van-field 
                    v-model="BPrice" 
                    label="AB(元/m³)*" 
                    placeholder="请输入对应厚度AB板价钱"
                    clearable
                    type="number">
                </van-field>
                <van-field 
                    v-model="CPrice"
                    label="CC(元/m³)*" 
                    placeholder="请输入对应厚度CC板价钱"
                    clearable
                    type="number">
                </van-field>
            </van-cell-group>
            <div class="m-bottom">
                <van-button
                    size="large"
                    type="info"
                    class="m-bottom-button"
                    @click="confirmInfo()">确定
                </van-button>
            </div> 
        </van-popup>
    </div>
</template>

<script>
export default {
    name:'priceMaintain',
    data () {
        return {
            // 列表内容
            formData:[
                {thickness:16,A:3400,B:3100,C:2250},
                {thickness:17,A:3450,B:2950,C:2100},
                {thickness:18,A:3350,B:2950,C:2100},
                {thickness:20,A:3150,B:2700,C:2000},
                {thickness:22,A:3200,B:2700,C:2000}
            ],
            /** 关于加载的参数 */
            pullDownLoading:false,  //下拉刷新状态
            pullupLoading:false,  //上拉加载状态
            finished:true, //是否已经结束调用接口
            pullupError:false,  //上拉加载错误
            totalPage:0,  //总页数
            pageNumber:0,    //第x页
            pageSize:30,    //每次查询数量
            /** 关于加载的参数 */

            /** 表格参数 */
            rowDeleteState:false,   //行删除状态
            selectRowIndex:null,    //选中行
            /** 表格参数结束 */

            /** 弹框参数 */
            popupShow:false, //弹框显示与否
            popupType:'',   //弹框类型
            popupTitle:'',  //弹框标题

            thickness:'',   //拼板厚度
            APrice:'',   //AA板价钱
            BPrice:'',   //AB板价钱
            CPrice:'',   //CC板价钱
        }
    },
    methods: {
        // 返回首页
        backToHome(){
            this.$router.push({
                path:`/home`
            })
        },
        // 弹出弹框
        showPopup(info){
            let { type,data } = info;
            switch (type) {
                case 'add':
                    this.popupTitle = '新增板价';
                    this.thickness = '';    //厚度
                    this.APrice = '';    //AA价
                    this.BPrice = '';    //AB价
                    this.CPrice = '';    //CC价
                    break;
                case 'edit':
                    this.popupTitle = '编辑板价';
                    this.thickness = data.thickness;    //厚度
                    this.APrice = data.A;    //AA价
                    this.BPrice = data.B;    //AB价
                    this.CPrice = data.C;    //CC价
                    break;
            }
            this.popupType = type;
            this.popupShow = true;
        },
        // 初始化列表信息
        initList(){
            let obj = {
                current:this.pageNumber+1,  //第x页
                size:this.pageSize, //每页大小
            };
            this.pullDownLoading = true;
            this.$http.queryQuotaScoreDetails(obj)
            .then(res=>{
                let { data } = res;
                this.pullDownLoading = false;
                if(data.code === 1 && data.total > 0){
                    let originData = data.rows.splice(0);
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
                this.pullDownLoading = false;
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
        // 删除表格行数据
        deleteWoodPriceRow({ position, instance }){
            switch (position) {
                case 'left':
                case 'cell':
                    instance.close();
                    break;
                case 'outside':
                    if(!this.rowDeleteState){
                        instance.close();
                    }
                    break;
                case 'right':
                    this.$dialog.confirm({
                        message: '确定删除吗？',
                        className:'m-alertDialog'
                    })
                    .then(() => {
                        this.formData.splice(this.selectRowIndex,1);
                        instance.close();
                        this.rowDeleteState = false;
                    })
                    .catch(()=>{
                        instance.close();
                        this.rowDeleteState = false;
                    })
                    break;
            }
        },
        // 选中需要删除行
        selectDeleteRow(index){
            this.selectRowIndex = index;
            this.rowDeleteState = true;
        },
        /** 弹框方法 */
        // 点击确认按钮
        confirmInfo(){
            let msg = "";
            switch (true) {
                case this.thickness === "":
                    msg = "请输入拼板厚度";
                    break;
                case this.APrice === "":
                    msg = "请输入对应厚度AA板的价钱";
                    break;
                case this.BPrice === "":
                    msg = "请输入对应厚度AB板的价钱";
                    break;
                case this.CPrice === "":
                    msg = "请输入对应厚度CC板的价钱";
                    break;
            }
            if(msg!==""){
                this.$utils.failTip(msg);
                return;
            }
            this.popupShow = false;
        },
        // 新增板价
        addThicknessAndPrice(){

        },
        // 编辑板价
        editThicknessAndPrice(){

        }
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
    .van-nav-bar{
        .van-nav-bar__title{
            font-weight: bolder;
        }
    }
    .m-priceMaintain-grid{
        background-color: #FFF;
        padding-top: 10px;
        .m-grid-thead{
            margin:0 10px;
            color: #2E3033;
            font-weight: 600;
            padding: 10px 5px;
            background-color: #F2F3F5;
            border-bottom: 1px solid #EEEEEE;
            text-align: left;
            font-size: 16px;
            .van-col{
                padding: 0 5px;
                text-align: center;
            }
        }
        .m-grid-tbody{
            position: absolute;
            top: 95px;
            right: 0;
            left: 0;
            bottom: 0;
            margin: 0 10px 10px;
            .van-pull-refresh{
                height: 100%;
                .van-pull-refresh__track{
                    .m-info-row{
                        color: #2E3033;
                        font-size: 16px;
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
                                text-align: center;
                                padding: 15px 5px;
                            }
                        }
                        .van-cell-group:active{
                            background:linear-gradient( rgba(98, 98, 98, 0.1), rgba(98, 98, 98, 0.1) );
                        }
                        .van-swipe-cell__right{
                            .van-button{
                                line-height: 38px;
                            }
                        }
                    }
                    .m-info-row:nth-last-child(1){
                        border-bottom: none;
                    }
                    .delete-button{
                        height: 100%;
                    }
                }
            }
        }
    }
    .m-popup-addOrEdit{
        background: #F7F7F7;
        .van-cell-group{
            margin-top: 10px;
        }
        .m-bottom{
            position: absolute;
            height: 60px;
            left: 0px;
            right: 0px;
            bottom: 0px;
            background-color: #F7F7F7;
            border-top: 1px solid #F7F7F7;
            .m-bottom-button{
                padding: 0 70px;
                margin-top: 8px;
                height: 40px;
                border-radius: 10px;
                line-height: 30px;
                width: 50%;
                left: 25%;
                background: rgb(51, 136, 255);
                span{
                    display: inline-block;
                    width: 48px;
                }
            }
        }
    }
}
</style>
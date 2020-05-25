<template>
    <div class="m-view-calculate">
        <van-nav-bar title="计算木材"/>
        <van-steps
            active-color="#38f"
            :active="stepsActive" 
            class="m-steps"
            :class="{'m-stepsCircle-active':stepsActive === 1}">
            <van-step>信息记录</van-step>
            <van-step>计算结果</van-step>
        </van-steps>
        <div v-show="stepsActive === 0">
            <div ref="content" class="m-content">
                <div class="tagStyle">
                    <van-tag type="primary">成本</van-tag>
                </div>
                <van-cell-group>    
                    <van-field
                        class="m-longtitle"
                        label="木材成本(元/m³)*" 
                        clearable 
                        placeholder="请输入木材成本"
                        type="number"
                        v-model="woodCost">
                    </van-field>
                    <van-field
                        class="m-longtitle"
                        label="固定成本(元/m³)*" 
                        clearable 
                        placeholder="请输入固定成本"
                        type="number"
                        v-model="fixedCost">
                    </van-field>
                    <van-field
                        label="刨花(元/m³)*" 
                        clearable 
                        placeholder="请输入刨花价钱"
                        type="number"
                        v-model="shavingPrice">
                    </van-field>
                </van-cell-group>
                <div class="tagStyle">
                    <van-tag type="primary">木材等级</van-tag>
                </div>
                <div class="m-woodLevel">
                    <van-dropdown-menu>
                        <van-dropdown-item
                            v-model="level" 
                            :options="levelList"/>
                    </van-dropdown-menu>
                </div>
                <div class="tagStyle m-tag-icon">
                    <van-tag type="primary">木材厚度统计</van-tag>
                    <van-icon name="plus" size="16px" color="#999999"/>
                </div>
                <!-- 循环生成列表（木材厚度） -->
                <div 
                    class="m-dropDownMenuWithInput"
                    v-for="(item,index) in thicknessStatistics" 
                    :key="index">
                    <van-dropdown-menu>
                        <van-dropdown-item
                            v-model="$data.thicknessStatistics[index].thickness" 
                            :options="thicknessList"
                            @change="woodThicknessSelectChange({value:item.thickness,index:index})"/>
                    </van-dropdown-menu>
                    <van-cell title="测试">
                        <template>
                            <van-stepper 
                                v-model="$data.thicknessStatistics[index].total" 
                                integer 
                                input-width="64px"
                                min="0"
                                default-value="0"/>
                        </template>
                    </van-cell>
                    <van-divider />
                </div>
                <div class="tagStyle">
                    <van-tag type="primary">木材质量统计</van-tag>
                </div>
                <van-cell-group>
                    <van-cell class="m-quality-input"
                        v-for="(item,index) in qualityStatustics"
                        :key="index"
                        :title="item.recordTitle">
                        <template>
                            <van-stepper 
                                v-model="item.total" 
                                integer 
                                input-width="64px"
                                min="0"
                                default-value="0"/>
                        </template>
                    </van-cell>
                </van-cell-group>
            </div>
            <div class="m-bottom">
                <van-button
                    size="large"
                    type="info"
                    class="m-bottom-nextStep"
                    @click="goToNextPage()">下一步
                </van-button>
            </div> 
        </div>
        <div v-show="stepsActive === 1">
            <div class="m-content">
                <div class="tagStyle">
                    <van-tag
                        type="primary">出材率
                    </van-tag>
                    <van-cell-group>
                        <van-cell title="出材率" :value="percentOfOutput" />
                    </van-cell-group>
                    <van-tag
                        type="primary">质量统计
                    </van-tag>
                    <van-cell-group>
                        <van-cell
                            v-for="(item,index) in qualityStatustics"
                            :key="index"
                            :title="item.resultTitle" 
                            :value="item.percent">
                        </van-cell>
                    </van-cell-group>
                    <van-tag
                        type="primary">厚度统计
                    </van-tag>
                    <van-cell-group>
                        <van-cell
                            v-for="(item,index) in thicknessStatistics"
                            :key="index"
                            :title="item.resultTitle" 
                            :value="item.percent">
                        </van-cell>
                    </van-cell-group>
                    <van-tag
                        type="primary">价格分析
                    </van-tag>
                    <van-cell-group >
                        <van-cell
                            title="成本(元/m³)" 
                            :value="productCost">
                        </van-cell>
                        <van-cell
                            title="出厂价(元/m³)" 
                            :value="productPrice">
                        </van-cell>
                        <van-cell
                            title="利润(元/m³)" 
                            :value="profit">
                        </van-cell>
                    </van-cell-group>
                </div>
            </div>
            <div class="m-bottom">
                <van-button
                    size="large"
                    type="info"
                    class="m-bottom-nextStep">返回
                </van-button>
            </div> 
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            /** 步骤条 */
            stepsActive:1,
            /** 信息记录开始 */
            /** 木材成本 */
            woodCost:'',    // 木材成本
            fixedCost:'700',    //固定成本
            shavingPrice:'130',    //刨花价钱
            /** 木材等级 */
            level:'0.95',   //木材等级
            levelList:[
                { text: 'AB(0.95)', value:'0.95' },
                { text: 'C(0.92)', value:'0.92' }
            ],  //等级列表
            /** 木材厚度列表 */
            thicknessList:[
                { text: '16mm', value: 16 },
                { text: '17mm', value: 17 },
                { text: '18mm', value: 18 },
                { text: '20mm', value: 20 },
                { text: '22mm', value: 22 }
            ],  // 厚度列表
            thicknessStatistics:[
                {thickness:18,resultTitle:'18mm',total:0,percent:'0',percentDisplay:'0%'},
                {thickness:20,resultTitle:'20mm',total:0,percent:'0',percentDisplay:'0%'},
                {thickness:22,resultTitle:'22mm',total:0,percent:'0',percentDisplay:'0%'}
            ],  // 厚度统计
            /** 木材质量统计 */
            qualityStatustics:[
                {recordTitle:'A(条)',resultTitle:'A(%)',quality:'A',total:0,percent:'0%',percentDisplay:'0%'},
                {recordTitle:'B(条)',resultTitle:'B(%)',quality:'B',total:0,percent:'0%',percentDisplay:'0%'},
                {recordTitle:'C(条)',resultTitle:'C(%)',quality:'C',total:0,percent:'0%',percentDisplay:'0%'}
            ],  // 质量统计
            /** 信息记录结束 */

            /** 计算结果开始 */
            percentOfOutput:'', //出材率

            productCost:'', //每立方米木材成本
            productPrice:'',    //每立方米木材出厂价
            profit:'',  //利润
            /** 计算结果结束 */
        }
    },
    created () {
        
    },
    methods: {
        /** 信息记录 */
        // 木材厚度选择变化
        woodThicknessSelectChange(info){
            let { value,index } = info;
            this.thicknessStatistics[index].resultTitle = `${value}mm`;
        },
        
        // 跳转到下一页
        goToNextPage(){
            // 条件判断
            let msg = "";
            switch (true) {
                case this.woodCost === "":
                    msg = "请输入木材成本";
                    break;
                case this.fixedCost === "":
                    msg = "请输入固定成本";
                    break;
                case this.shavingPrice === "":
                    msg = "请输入刨花价钱";
                    break;
            }
            if(msg!==""){
                this.$utils.failTip(msg);
                return;
            }
            let thicknessStatisticsTotal = 0;
            this.thicknessStatistics.forEach(item => {
                thicknessStatisticsTotal += item.total;
            });
            if(thicknessStatisticsTotal === 0){
                this.$utils.failTip("请完善木材厚度统计信息");
                return;
            }
            let qualityStatusticsTotal = 0;
            this.qualityStatustics.forEach(item => {
                qualityStatusticsTotal += item.total;
            });
            if(qualityStatusticsTotal === 0){
                this.$utils.failTip("请完善木材质量统计信息");
                return;
            }
        },

        /** 计算结果 */
        // 计算厚度百分比
        calculatePercentOfThickness(){
            let statisticsTotal = 0;
            this.thicknessStatistics.forEach(item => {
                let total = Number(item.total);
                statisticsTotal += total;
            });
            this.thicknessStatistics.forEach(element => {
                let total = Number(item.total);
                let 
            });
        },
        // 计算出材率
        calculatePercentOfOutput(){
            let averageThickness = 0;
            this.thicknessStatistics.forEach(item => {
                let 
            });
        }

    }
}
</script>

<style lang="less">
.m-view-calculate{
    overflow-y: hidden;
    .m-steps{
        background: #F7F7F7;
        padding: 10px 50px 0;
        .van-step__circle-container{
            background: #F7F7F7;
        }
    }
    .m-stepsCircle-active{    
        .van-step__circle{
            background: rgb(51, 136, 255);
        }
    }
	.m-content{
		position: absolute;
        top: 105px ;
        left: 0;
        right: 0;
        bottom: 60px;
        overflow-y: auto;
        overflow-x: hidden;
        background-color: #F7F7F7;
        // 信息记录样式
        .m-longtitle{
            font-size: 12px;
        }
        .m-woodLevel{
            .van-dropdown-menu__bar{
                height: 44px;
                .van-dropdown-menu__title{
                    .van-ellipsis{
                        font-weight: bolder;
                    }
                }
            }
        }
        .m-tag-icon{
            display: flex;
            justify-content: space-between;
            align-items: center;
            .van-icon{
                margin-right: 15px;
            }
        }
        .m-dropDownMenuWithInput{
            position: relative;
            .van-dropdown-menu__bar{
                position: absolute;
                top: 0;
                height: 44px;
                box-shadow: none;
                width: 125px;
                z-index: 2;
                .van-dropdown-menu__title{
                    .van-ellipsis{
                        font-weight: bolder;
                    }
                }
                .van-dropdown-menu__item{
                    flex:1;
                }
            }
            .van-cell{
                .van-cell__value{
                    text-align: center;
                }
            }
            .van-divider{
                margin: 0;
                border-color: #F7F7F7;
            }
        }
        .m-quality-input{
            .van-cell__title{
                text-align: center;
            }
            .van-cell__value{
                text-align: center;
            }
        }
    }
    .m-bottom{
        position: absolute;
        height: 60px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        background-color: #F7F7F7;
        border-top: 1px solid #F7F7F7;
        .m-bottom-nextStep{
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
</style>
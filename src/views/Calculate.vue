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
                <div class="tagStyle m-tag-icon">
                    <van-tag type="primary">木材质量统计</van-tag>
                    <van-icon 
                        name="exchange" 
                        size="16px" 
                        color="#999999"
                        @click="changeQualityStatisticsState()"/>
                </div>
                <van-cell-group v-show="qualityStatisticsState === 0">
                    <van-cell class="m-quality-stepper"
                        v-for="(item,index) in qualityStatistics"
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
                <van-cell-group v-show="qualityStatisticsState === 1">
                    <van-field class="m-quality-input"
                        v-for="(item,index) in qualityStatistics"
                        :key="index"
                        :label="item.resultTitle"
                        clearable 
                        :placeholder="'请输入'+item.quality+'质量占比'"
                        type="number"
                        v-model="item.percentDisplay"
                        @change="exchangeQualityPercent({percentDisplay:item.percentDisplay,index:index})">
                    </van-field>
                </van-cell-group>
            </div>
            <div class="m-bottom">
                <van-button
                    size="large"
                    type="info"
                    class="m-bottom-button"
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
                            v-for="(item,index) in qualityStatistics"
                            :key="index"
                            :title="item.resultTitle" 
                            :value="item.percentDisplay+'%'">
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
                            :value="item.percentDisplay+'%'">
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
                    class="m-bottom-button"
                    @click="backToRecord()">返回
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
            stepsActive:0,
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
                // thickness resultTitle随着选择而改变
                {thickness:18,resultTitle:'18mm',total:0,percent:'',percentDisplay:''},
                {thickness:20,resultTitle:'20mm',total:0,percent:'',percentDisplay:''},
                {thickness:22,resultTitle:'22mm',total:0,percent:'',percentDisplay:''}
            ],  // 厚度统计
            /** 木材质量统计 */
            qualityStatisticsState:0,   //0-条数统计 1-百分比统计
            qualityStatistics:[
                {recordTitle:'A(条)',resultTitle:'A(%)',quality:'A',total:0,percent:'',percentDisplay:''},
                {recordTitle:'B(条)',resultTitle:'B(%)',quality:'B',total:0,percent:'',percentDisplay:''},
                {recordTitle:'C(条)',resultTitle:'C(%)',quality:'C',total:0,percent:'',percentDisplay:''}
            ],  // 质量统计
            /** 信息记录结束 */
            /** 计算结果开始 */
            percentOfOutput:'', //出材率
            productCost:'', //每立方米木材成本
            productPrice:'',    //每立方米木材出厂价
            profit:'',  //利润
            /** 计算结果结束 */
            /** 板材价钱 */
            panelPrice:[
                {thickness:16,A:3400,B:3100,C:2250},
                {thickness:17,A:3450,B:2950,C:2100},
                {thickness:18,A:3350,B:2950,C:2100},
                {thickness:20,A:3150,B:2700,C:2000},
                {thickness:22,A:3200,B:2700,C:2000}
            ]
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
        // 切换质量统计方式
        changeQualityStatisticsState(){
            this.qualityStatisticsState = this.qualityStatisticsState === 0?1:0;
            this.qualityStatistics.forEach(item => {
                item.total = 0;
                item.percent = '';
                item.percentDisplay = '';
            });
        },
        // 质量百分比输入变化
        exchangeQualityPercent(info){
            let { percentDisplay,index } = info;
            let percent = '';
            if(percentDisplay !== ""){
                percent = Number(percentDisplay) / 100;
            }
            this.qualityStatistics[index].percent = percent;
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
            switch (this.qualityStatisticsState) {
                case 0: // 数量统计
                    let qualityStatusticsTotal = 0;
                    this.qualityStatistics.forEach(item => {
                        qualityStatusticsTotal += item.total;
                    });
                    if(qualityStatusticsTotal === 0){
                        msg = "请完善木材质量统计信息";
                    }
                    break;
                case 1: //百分比统计
                    let qualityStatusticsPercentTotal = 0;
                    for(let i = 0;i < this.qualityStatistics.length;i++){
                        let item = this.qualityStatistics[i];
                        if(item.percentDisplay === ""){
                            msg = `请完善木材质量统计信息`;
                            break;
                        }
                        qualityStatusticsPercentTotal += Number(item.percentDisplay);
                        if(i === this.qualityStatistics.length - 1){
                            if(qualityStatusticsPercentTotal !== 100){
                                msg = `木材ABC质量百分比相加不为100`;
                            }
                        }
                    }
                    break;
            }
            if(msg!==""){
                this.$utils.failTip(msg);
                return;
            }
            this.calculatePercentOfThicknessOrQuality(this.thicknessStatistics);    // 计算厚度各占百分比
            switch (this.qualityStatisticsState) {
                case 0:
                    this.calculatePercentOfThicknessOrQuality(this.qualityStatistics);  // 计算ABC各占百分比
                    break;
                case 1:
                    this.exchangePercentOfThicknessOrQuality(this.qualityStatistics);   //切换小数位
                    break;
            }
            this.calculatePercentOfOutput();    //计算出材率
            this.calculateProductCost();    //计算成本
            this.calculateProductPrice();   //计算出厂价
            this.calculateProfit(); //计算利润
            this.stepsActive = 1;
        },
        /** 计算结果 */
        // 计算厚度或质量百分比
        calculatePercentOfThicknessOrQuality(arr){
            let statisticsTotal = 0;
            arr.forEach(item => {
                let total = Number(item.total);
                statisticsTotal += total;
            });
            arr.forEach(item => {
                let total = Number(item.total);
                item.percent = (total / statisticsTotal).toFixed(4);
                item.percentDisplay = `${(item.percent*100).toFixed(2)}`;
            });
        },
        // 切换厚度或质量百分比
        exchangePercentOfThicknessOrQuality(arr){
            arr.forEach(item => {
                item.percent = Number(item.percent).toFixed(4);
                item.percentDisplay = Number(item.percentDisplay).toFixed(2);
            });
        },
        // 计算出材率
        calculatePercentOfOutput(){
            let averageThickness = 0;
            this.thicknessStatistics.forEach(item => {
                let thickness = Number(item.thickness) * Number(item.percent);
                averageThickness += thickness;
            });
            this.percentOfOutput = ((averageThickness / 12.7) * Number(this.level)).toFixed(4);
        },
        // 计算成本
        calculateProductCost(){
            this.productCost = ((Number(this.woodCost) / Number(this.percentOfOutput)) + Number(this.fixedCost)).toFixed(2);
        },
        // 计算出厂价
        calculateProductPrice(){
            let thicknessPerPrice = {};
            this.thicknessStatistics.forEach(item => {
                let panel = this.panelPrice.filter(pItem=>pItem.thickness === item.thickness);
                let perPanelPrice = panel[0];
                thicknessPerPrice[item.thickness] = (Number(perPanelPrice.A) * Number(this.qualityStatistics[0].percent) + Number(perPanelPrice.B) * Number(this.qualityStatistics[1].percent) + Number(perPanelPrice.C) * Number(this.qualityStatistics[2].percent))*Number(item.percent);
            });
            let totalPrice = 0;
            for(let key in thicknessPerPrice){
                totalPrice += Number(thicknessPerPrice[key]);
            }
            this.productPrice = (totalPrice + Number(this.shavingPrice)).toFixed(2);
        },
        // 计算利润
        calculateProfit(){
            this.profit = (Number(this.productPrice) - Number(this.productCost)).toFixed(2);
        },
        // 返回记录页
        backToRecord(){
            this.stepsActive = 0;
            this.percentOfOutput = ''; //出材率
            this.productCost = ''; //每立方米木材成本
            this.productPrice = '';    //每立方米木材出厂价
            this.profit = '';  //利润
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
        .m-quality-stepper{
            padding:8px 16px;
            .van-cell__title{
                text-align: center;
            }
            .van-cell__value{
                text-align: center;
            }
        }
        .m-quality-input{
            .van-cell__title{
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
</style>
<template>
    <div class="m-view-calculate">
        <van-nav-bar title="木材计算">
            <template #left>
                <van-icon 
                    name="arrow-left" 
                    size="20" 
                    color="#999999"
                    @click="backToHome()"/>
            </template>
        </van-nav-bar>
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
                    <van-tag type="primary">木材规格</van-tag>
                </div>
                <div class="m-woodLevel">
                    <van-dropdown-menu>
                        <van-dropdown-item
                            v-model="standard" 
                            :options="standardList"/>
                    </van-dropdown-menu>
                </div>
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
                    <div>
                        <van-icon 
                            name="plus" 
                            size="16px" 
                            color="#999999"
                            @click="addWoodThicknessRow()"/>
                        <van-icon 
                            name="exchange" 
                            size="16px" 
                            color="#999999"
                            @click="changeThicknessStatisticsState()" />
                    </div>
                </div>
                <div v-show="thicknessStatisticsState === 0">
                    <!-- 循环生成列表（木材厚度） -->
                    <div 
                        class="m-dropDownMenuWithInput"
                        v-for="(item,index) in thicknessStatistics" 
                        :key="index">
                        <van-dropdown-menu>
                            <van-dropdown-item
                                v-model="item.thickness" 
                                :options="thicknessList"
                                @change="woodThicknessSelectChange({value:item.thickness,index:index})"/>
                        </van-dropdown-menu>
                        <van-swipe-cell
                            :before-close="deleteWoodThicknessRow">
                            <van-cell title="测试">
                                <template>
                                    <van-stepper 
                                        v-model="item.total" 
                                        integer 
                                        input-width="64px"
                                        min="0"
                                        default-value="0"/>
                                </template>
                            </van-cell>
                            <template #right>
                                <van-button 
                                    square text="删除" 
                                    type="danger" 
                                    class="delete-button"
                                    @click="selectDeleteRow(index)"/>
                            </template>
                        </van-swipe-cell>
                    </div>
                </div>
                <div v-show="thicknessStatisticsState === 1">
                    <div
                        class="m-dropDownMenuWithInput"
                        v-for="(item,index) in thicknessStatistics" 
                        :key="index">
                        <van-dropdown-menu>
                            <van-dropdown-item
                                v-model="item.thickness" 
                                :options="thicknessList"
                                @change="woodThicknessSelectChange({value:item.thickness,index:index})"/>
                        </van-dropdown-menu>
                        <van-swipe-cell
                            :before-close="deleteWoodThicknessRow">
                            <van-field
                                label="测试" 
                                clearable 
                                placeholder="请输入木材厚度占比"
                                type="number"
                                v-model="item.percentDisplay"
                                @change="exchangeThicknessPercent({percentDisplay:item.percentDisplay,index:index})">
                            </van-field>
                            <template #right>
                                <van-button 
                                    square text="删除" 
                                    type="danger" 
                                    class="delete-button"
                                    @click="selectDeleteRow(index)"/>
                            </template>
                        </van-swipe-cell>
                    </div>
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
                </div>
                <van-cell-group>
                    <van-cell title="出材率" :value="percentOfOutput" />
                </van-cell-group>
                <div class="tagStyle">
                    <van-tag
                        type="primary">质量统计
                    </van-tag>
                </div>
                <van-cell-group>
                    <van-cell
                        v-for="(item,index) in qualityStatistics"
                        :key="index"
                        :title="item.resultTitle" 
                        :value="item.percentDisplay+'%'">
                    </van-cell>
                </van-cell-group>
                <div class="tagStyle">
                    <van-tag
                        type="primary">厚度统计
                    </van-tag>
                </div>
                <van-cell-group>
                    <van-cell
                        v-for="(item,index) in thicknessStatistics"
                        :key="index"
                        :title="item.resultTitle" 
                        :value="item.percentDisplay+'%'">
                    </van-cell>
                </van-cell-group>
                <div class="tagStyle">
                    <van-tag
                        type="primary">价格分析
                    </van-tag>
                </div>
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
            /** 木材规格 */
            standard:'0.5',    //木材规格选中
            standardList:[
                { text: '4/8', value:'0.5' },
                { text: '5/8', value:'0.625' },
                { text: '6/8', value:'0.75' },
                { text: '7/8', value:'0.875' },
            ],    //木材规格列表
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
            thicknessStatisticsState:0, //0-条数统计 1-百分比统计
            selectThicknessRowIndex:null,   //选中的厚度行
            thicknessDeleteState:false, //厚度统计是否进入删除状态
            thicknessList:[],  // 厚度列表
            thicknessStatistics:[
                // thickness resultTitle随着选择而改变
                // {thickness:18,resultTitle:'18mm',total:0,percent:'',percentDisplay:''},
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
            panelPrice:[]
        }
    },
    created () {
        this.queryThicknessListInfo();
    },
    methods: {
        /** 信息记录 */
        backToHome(){
            this.saveInfoRecordPage();  //保存页面信息
            this.$router.push({
                path:`/home`
            })
        },
        // 查询有记录的木材厚度数据
        queryThicknessListInfo(){
            let obj = {
                orderBy:'thickness',    //厚度升序
            };
            this.$toast.loading({
                message: '查询中...',
                forbidClick: true,
                overlay:true
            });
            this.$http.queryPriceMaintainListInfo(obj)
            .then(res=>{
                let { data } = res;
                this.$toast.clear();
                if(data.code === 1 && data.total > 0){
                    let originData = data.rows.splice(0);
                    originData.forEach(item => {
                        let thicknessObj = {
                            text:`${item.thickness}mm`,
                            value:Number(item.thickness)
                        };
                        this.thicknessList.push(thicknessObj);  //厚度列表
                    });
                    this.panelPrice = originData;   //价格数据
                    this.getSettingsFromStorage();  //获取页面设置
                }else{
                    this.thicknessList = [];    //厚度列表
                    this.panelPrice = []; //价格数据
                }
            })
            .catch(err=>{
                this.$toast.clear();
                this.thicknessList = [];    //厚度列表
                this.panelPrice = []; //价格数据
            })
        },
        /** 木材厚度开始 */
        // 切换厚度统计方式
        changeThicknessStatisticsState(){
            this.thicknessStatisticsState = this.thicknessStatisticsState === 0?1:0;
            this.thicknessStatistics.forEach(item=>{
                item.total = 0;
                item.percent = '';
                item.percentDisplay = '';
            })
        },
        // 木材百分比输入变化
        exchangeThicknessPercent(info){
            let { percentDisplay,index } = info;
            let percent = '';
            if(percentDisplay !== ""){
                percent = Number(percentDisplay) / 100;
            }
            this.thicknessStatistics[index].percent = percent;
        },
        // 木材厚度选择变化
        woodThicknessSelectChange(info){
            let { value,index } = info;
            this.thicknessStatistics[index].resultTitle = `${value}mm`;
        },
        // 添加木材厚度统计行
        addWoodThicknessRow(){
            // 判断是否能继续新增行
            if(this.thicknessStatistics.length+1 > this.thicknessList.length){
                this.$dialog.alert({
                    message:"当前不能继续新增行\n因为厚度统计行大于厚度记录行",
                    className:'m-alertDialog'
                }).then(()=>{

                })
                return;
            }
            let recordArr = []; // 获取thicknessList的value
            let statisticsArr = [];    // 获取thicknessStatistics的thickness
            this.thicknessList.forEach(item => {
                recordArr.push(item.value);
            })
            this.thicknessStatistics.forEach(item => {
                statisticsArr.push(item.thickness);
            });
            //差集=并集-交集  去除两个数组相同的元素
            let differenceArr=recordArr.filter(item=>!statisticsArr.includes(item))
            let obj = {
                thickness:differenceArr[0],
                resultTitle:`${differenceArr[0]}mm`,
                total:0,
                percent:'',
                percentDisplay:''
            };
            this.thicknessStatistics.push(obj);
        },
        // 删除木材厚度统计行
        deleteWoodThicknessRow({ position, instance }){
            switch (position) {
                case 'left':
                case 'cell':
                    instance.close();
                    break;
                case 'outside':
                    if(!this.thicknessDeleteState){
                        instance.close();
                    }
                    break;
                case 'right':
                    this.$dialog.confirm({
                        message: '确定删除吗？',
                        className:'m-alertDialog'
                    })
                    .then(() => {
                        this.thicknessStatistics.splice(this.selectThicknessRowIndex,1);
                        instance.close();
                        this.thicknessDeleteState = false;
                    })
                    .catch(()=>{
                        instance.close();
                        this.thicknessDeleteState = false;
                    })
                break;
            }
        },
        // 选中需要删除行
        selectDeleteRow(index){
            this.selectThicknessRowIndex = index;
            this.thicknessDeleteState = true;
        },
        // 存储信息记录页面的信息
        saveInfoRecordPage(){
            this.thicknessStatistics.forEach(item => {
                item.total = 0;
                item.percent = '';
                item.percentDisplay = '';
            });
            let obj = {
                standard:this.standard, //木材规格
                fixedCost:this.fixedCost,   //固定成本
                shavingPrice:this.shavingPrice, //刨花
                thicknessStatisticsState:this.thicknessStatisticsState, //木材厚度统计状态
                thicknessStatistics:this.thicknessStatistics,   //木材厚度统计列表
                qualityStatisticsState:this.qualityStatisticsState, //质量统计状态
            }
            this.$utils.saveStorage('personalRecordInfo',obj);
        },
        // 获取页面设置
        getSettingsFromStorage(){
            let info = this.$utils.getStorage('personalRecordInfo');
            if(Object.keys(info).length !== 0){
                this.standard = info.standard;  //木材规格
                this.fixedCost = info.fixedCost;   //固定成本
                this.shavingPrice = info.shavingPrice; //刨花
                this.thicknessStatisticsState = info.thicknessStatisticsState; //木材厚度统计状态 
                this.qualityStatisticsState = info.qualityStatisticsState; //质量统计状态
                this.thicknessStatistics = [];
                let recordArr = []; // 获取thicknessList的value
                let statisticsArr = [];    // 获取info.thicknessStatistics的thickness
                this.thicknessList.forEach(item => {
                    recordArr.push(item.value);
                })
                info.thicknessStatistics.forEach(item => {
                    statisticsArr.push(item.thickness);
                });
                let intersectArr = recordArr.filter(item=>statisticsArr.includes(item));    // 求交集
                intersectArr.forEach(item => {
                    let obj = {
                        thickness:item,
                        resultTitle:`${item}mm`,
                        total:0,
                        percent:'',
                        percentDisplay:''
                    };
                    this.thicknessStatistics.push(obj); // 木材厚度统计列表
                });
            }
        },
        /** 木材厚度结束 */

        /** 木材质量开始 */
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
        /** 木材质量结束 */
        // 跳转到下一页
        goToNextPage(){
            // 条件判断
            let msg = "";
            switch (true) {
                case this.standard === "":
                    msg = "请选择木材规格";
                    break;
                case this.woodCost === "":
                    msg = "请输入木材成本";
                    break;
                case !this.$utils.validateCorrectMoney(Number(this.woodCost)):
                    msg = "请输入正确的木材成本";
                    break;
                case this.fixedCost === "":
                    msg = "请输入固定成本";
                    break;
                case !this.$utils.validateCorrectMoney(Number(this.fixedCost)):
                    msg = "请输入正确的固定成本";
                    break;
                case this.shavingPrice === "":
                    msg = "请输入刨花价钱";
                    break;
                case !this.$utils.validateCorrectMoney(Number(this.shavingPrice)):
                    msg = "请输入正确的刨花价钱";
                    break;
                case this.level === "":
                    msg = "请选择木材等级";
                    break;
                case this.thicknessStatistics.length === 0:
                    msg = "木材厚度统计至少要有一条记录";
                    break;
            }
            if(msg!==""){
                this.$utils.failTip(msg);
                return;
            }
            switch (this.thicknessStatisticsState) {
                case 0: //数量统计
                    let thicknessStatisticsTotal = 0;
                    this.thicknessStatistics.forEach(item => {
                        thicknessStatisticsTotal += item.total;
                    });
                    if(thicknessStatisticsTotal === 0){
                        msg = "请完善木材厚度统计信息";
                    }
                    break;
                case 1: // 百分比统计
                    let thicknessStatusticsPercentTotal = 0;
                    for(let i = 0;i < this.thicknessStatistics.length;i++){
                        let item = this.thicknessStatistics[i];
                        if(item.percentDisplay === ""){
                            msg = `请完善木材厚度统计信息`;
                            break;
                        }
                        thicknessStatusticsPercentTotal += Number(item.percentDisplay);
                        if(i === this.qualityStatistics.length - 1){
                            if(thicknessStatusticsPercentTotal !== 100){
                                msg = `木材厚度百分比相加不为100`;
                            }
                        }
                    }
                    break;
            }
            if(msg!==""){
                this.$utils.failTip(msg);
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
            switch (this.thicknessStatisticsState) {
                case 0:
                    this.calculatePercentOfThicknessOrQuality(this.thicknessStatistics);    // 计算厚度各占百分比
                    break;
                case 1:
                    this.exchangePercentOfThicknessOrQuality(this.thicknessStatistics);   //切换小数位
                    break;
            }
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
            this.percentOfOutput = ((averageThickness / (25.4 * Number(this.standard))) * Number(this.level)).toFixed(4);
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
    .van-nav-bar{
        .van-nav-bar__title{
            font-weight: bolder;
        }
    }
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
        bottom: 0;
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
                box-shadow: none;
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
                height: 43px;
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
                height: 44px;
                .van-cell__value{
                    text-align: center;
                    height: 28px;

                }
            }
            .van-swipe-cell__right{
                .delete-button{
                    height: 100%;
                }
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
        .m-bottom-button{
            padding: 0 70px;
            margin: 10px 0px;
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
<template>
  	<div class="m-view-home">
		<van-nav-bar title="计算木材"/>
		<div ref="content" class="m-content">
			<div class="tagStyle">
				<van-tag type="primary">木材标准信息</van-tag>
			</div>
			<van-cell
                title="标准长(米)*" 
                is-link 
                :value="standardLength"
                arrow-direction="down" 
                @click="showPopup(0)">
            </van-cell>
			<van-cell
                title="标准宽(英寸)*" 
                is-link 
                :value="standardWidth"
                arrow-direction="down" 
                @click="showPopup(1)">
            </van-cell>
			<van-cell
                title="标准高(英寸)*" 
                is-link 
                :value="standardHeight"
                arrow-direction="down" 
                @click="showPopup(2)">
            </van-cell>
			<div class="tagStyle">
				<van-tag type="primary">木材实际信息(整体)</van-tag>
			</div>
			<van-field 
				label="实际长(厘米)*"
				clearable 
				placeholder="请输入木材整体长度"
				v-model="actualLength"
				@change="validActualData({data:actualLength,type:'length'})"
				@clear="validActualData({data:actualLength,type:'length'})">
			</van-field>
			<van-field 
				label="实际宽(厘米)*" 
				clearable 
				placeholder="请输入木材整体宽度"
				v-model="actualWidth"
				@change="validActualData({data:actualWidth,type:'width'})"
				@clear="validActualData({data:actualWidth,type:'width'})">
			</van-field>
			<van-field 
				label="实际高(厘米)*" 
				clearable 
				placeholder="请输入木材整体高度"
				v-model="actualHeight"
				@change="validActualData({data:actualHeight,type:'height'})"
				@clear="validActualData({data:actualHeight,type:'height'})">
			</van-field>
			<van-field 
				label="实际条数(条)*" 
				clearable 
				placeholder="请输入木材实际条数"
				type="tel"
				novalidate="novalidate"
				pattern="[0-9]*"
				v-model="actualNumber"
				@change="validActualData({data:actualNumber,type:'number'})"
				@clear="validActualData({data:actualNumber,type:'number'})">
			</van-field>
			<van-field 
				label="价钱(元/m³)*" 
				clearable 
				placeholder="请输入木材价钱"
				type="tel"
				novalidate="novalidate"
				pattern="[0-9]*"
				v-model="pricePerM3"
				@change="calculateActualVolumeAndRate()"
				@clear="calculateActualVolumeAndRate()">
			</van-field>
			<div class="tagStyle">
				<van-tag type="primary">木材实际信息(统计)</van-tag>
			</div>
			<van-field name="standardProductThicknessArr" label="出材厚度(mm)">
				<template #input>
					<van-checkbox-group 
						v-model="standardProductThicknessArr" 
						direction="horizontal"
						@change="filterProductPercent({specsArr:standardProductThicknessArr,measureStr:actualThicknessStatistics,type:'height'})">
						<van-checkbox :name="18">18</van-checkbox>
						<van-checkbox :name="20">20</van-checkbox>
						<van-checkbox :name="22">22</van-checkbox>
					</van-checkbox-group>
				</template>
			</van-field>
			<van-field
				v-model="actualThicknessStatistics"
				rows="1"
				autosize
				label="厚度统计(mm)"
				type="textarea"
				placeholder="请统计厚度"
				clearable
				@change="filterProductPercent({specsArr:standardProductThicknessArr,measureStr:actualThicknessStatistics,type:'height'})"
				@clear="filterProductPercent({specsArr:standardProductThicknessArr,measureStr:actualThicknessStatistics,type:'height'})"/>
			<van-field name="standardProductWidthArr" label="出材宽度(mm)">
				<template #input>
					<van-checkbox-group 
						v-model="standardProductWidthArr" 
						direction="horizontal"
						@change="filterProductPercent({specsArr:standardProductWidthArr,measureStr:actualWidthStatistics,type:'width'})">
						<van-checkbox :name="56">56</van-checkbox>
						<van-checkbox :name="55">55</van-checkbox>
						<van-checkbox :name="54">54</van-checkbox>
						<van-checkbox :name="52">52</van-checkbox>
					</van-checkbox-group>
				</template>
			</van-field>
			<van-field
				v-model="actualWidthStatistics"
				rows="1"
				autosize
				label="宽度统计(mm)"
				type="textarea"
				placeholder="请统计宽度"
				clearable
				@change="filterProductPercent({specsArr:standardProductWidthArr,measureStr:actualWidthStatistics,type:'width'})"
				@clear="filterProductPercent({specsArr:standardProductWidthArr,measureStr:actualWidthStatistics,type:'width'})"/>
			<div class="tagStyle">
				<van-tag type="primary">拼板市场价格(仅针对AA)</van-tag>
			</div>
			<van-field 
				label="拼板长(mm)" 
				clearable 
				placeholder="请输入拼板长度"
				v-model="panelLength"
				@change="calculatePanelPricePerM3({height:'18',price:panel18Price}),calculatePanelPricePerM3({height:'20',price:panel20Price}),calculatePanelPricePerM3({height:'22',price:panel22Price})"
				@clear="calculatePanelPricePerM3({height:'18',price:panel18Price}),calculatePanelPricePerM3({height:'20',price:panel20Price}),calculatePanelPricePerM3({height:'22',price:panel22Price})">
			</van-field>
			<van-field 
				label="拼板宽(mm)" 
				clearable 
				placeholder="请输入拼板宽度"
				v-model="panelWidth"
				@change="calculatePanelPricePerM3({height:'18',price:panel18Price}),calculatePanelPricePerM3({height:'20',price:panel20Price}),calculatePanelPricePerM3({height:'22',price:panel22Price})"
				@clear="calculatePanelPricePerM3({height:'18',price:panel18Price}),calculatePanelPricePerM3({height:'20',price:panel20Price}),calculatePanelPricePerM3({height:'22',price:panel22Price})">
			</van-field>
			<van-field 
				label="18厘(块/元)*" 
				clearable 
				placeholder="请输入价钱"
				v-model="panel18Price"
				@change="calculatePanelPricePerM3({height:'18',price:panel18Price})"
				@clear="calculatePanelPricePerM3({height:'18',price:panel18Price})">
			</van-field>
			<van-field 
				label="20厘(块/元)*" 
				clearable 
				placeholder="请输入价钱"
				v-model="panel20Price"
				@change="calculatePanelPricePerM3({height:'20',price:panel20Price})"
				@clear="calculatePanelPricePerM3({height:'20',price:panel20Price})">
			</van-field>
			<van-field 
				label="22厘(块/元)*" 
				clearable 
				placeholder="请输入价钱"
				v-model="panel22Price"
				@change="calculatePanelPricePerM3({height:'22',price:panel22Price})"
				@clear="calculatePanelPricePerM3({height:'22',price:panel22Price})">
			</van-field>
			<van-field 
				label="刨花价格(元/吨)*" 
				clearable 
				placeholder="请输入刨花价钱"
				v-model="shavingsPricePerTon"
				@change="calculateShavingsPricePerM3()"
				@clear="calculateShavingsPricePerM3()">
			</van-field>
			<div class="tagStyle">
				<van-tag type="primary">木材实际信息分析</van-tag>
			</div>
			<van-field 
				label="标准体积(m³/条)"
				readonly  
				v-model="standardVolume">
			</van-field>
			<van-field
				label="实际体积(m³/条)"
				readonly  
				v-model="actualVolume">
			</van-field>
			<van-field 
				label="附送率(%)"
				readonly  
				v-model="deliveryRate">
			</van-field>
			<van-field 
				label="实际价钱(元/m³)"
				readonly  
				v-model="actualPricePerM3">
			</van-field>
			<van-field 
				label="损耗比(%)"
				readonly  
				v-model="shavingsPercent">
			</van-field>
			<van-field 
				label="出材率(%)"
				readonly  
				v-model="productPercent">
			</van-field>
			<van-field 
				label="18厘(m³/元)*" 
				readonly
				v-model="panel18PricePerM3">
			</van-field>
			<van-field 
				label="20厘(m³/元)*" 
				readonly
				v-model="panel20PricePerM3">
			</van-field>
			<van-field 
				label="22厘(m³/元)*" 
				readonly
				v-model="panel22PricePerM3">
			</van-field>
			<van-field 
				label="刨花价格(元/m³)"
				readonly  
				v-model="shavingsPricePerM3">
			</van-field>
			<van-field 
				label="最终售价(元/m³)"
				readonly  
				v-model="finalPrice">
			</van-field>
			<van-field 
				label="实际售价(元/m³)"
				readonly  
				v-model="ActualPriceWithShaving">
			</van-field>
		</div>
		<van-popup
            v-model="popupShow" 
            position="bottom"
            @click-overlay="clickOverlay">
            <van-picker
                show-toolbar
                :title="popupTitle"
                :columns="popupColumn"
                @confirm="popupSelectConfirm"
                @cancel="popupSelectCancel">
            </van-picker>
        </van-popup>
  	</div>
</template>

<script>
import utils from "@/public/public";
export default {
	data () {
		return {
			/** 木材标准信息 */
			standardLength:'',	//标准长度
			standardLengthArr:[0.25,0.90,1.00,1.10,1.30],	//标准长度范围
			standardWidth:'',	//标准宽度
			standardWidthArr:[1.75,2,2.5,3,4],	//标准宽度范围
			standardHeight:'',	//标准高度
			standardHeightArr:[0.5,0.625,0.75,0.875],	//标准高度范围

			/** 木材实际信息 */
			actualLength:'112',	//实际长度
			actualWidth:'107',	//实际宽度
			actualHeight:'117',	//实际高度
			actualNumber:'810',	//实际条数
			pricePerM3:'3700',	//商家每立方价钱

			/** 木材统计信息 */
			standardProductThicknessArr:[18,20,22],	//出材厚度标准
			actualThicknessStatistics:'26/26.51/23.06/24.52/24.07/22.53/23.64/20.92/23.44/25.71/24.86/23.91/24.46/24.11/24.59/25.36/22.07/21.96/23.45/21.88/24.47/22.11/23.82',	//实际厚度统计
			standardProductWidthArr:[56,55,54,52],	//出材宽度标准
			actualWidthStatistics:'56.04/57.86/57.93/52.16/59.51/56.11/57.53/52.16/56.3/57.93/58.12/58.87/58.81/57.34/58.42/59.3/59.48/58.42/57.01/56.75/57.23/56.89',	//实际宽度统计

			/** 拼板规格and价格 */
			panelLength:'2440',	//拼板长度
			panelWidth:'1220',	//拼板宽度
			panel18Price:'185',	//拼板18mm价格
			panel20Price:'195',	//拼板20mm价格
			panel22Price:'213',	//拼板22mm价格
			
			shavingsPricePerTon:'500',	//刨花每吨价格

			/** 木材实际信息分析 */
			actualVolume:'',	//实际体积
			standardVolume:'',	//标准体积
			deliveryRate:'',	//实际附送率
			actualPricePerM3:'',	//实际每立方价钱
			averageThickness:'',	//平均厚度
			averageWidth:'',	// 平均宽度
			averageCutThickness:'',	//平均裁掉的厚度
			averageCutWidth:'',	//平均裁掉的宽度
			shavingsVolume:'',	//损耗体积
			shavingsPercent:'',	//损耗比
			productPercent:'',	//出材率
			panel18PricePerM3:'',	//拼板18mm价格/m³
			panel20PricePerM3:'',	//拼板20mm价格/m³
			panel22PricePerM3:'',	//拼板22mm价格/m³
			averageWidthStatics:{},	//各范围平均宽度统计
			averageWidthPercentStatics:{},	//各范围宽度占比统计
			averageThicknessStatics:{},	//各范围平均厚度统计
			averageThicknessPercentStatics:{},	//各范围厚度占比统计
			shavingsPricePerM3:'',	//刨花每立方米售价
			finalPrice:'',	//最终售价
			totalPrice:'',	//测试售价
			ActualPriceWithShaving:'',	//真实售价

			itemShow:"",    //弹出框显示
			popupShow:false,    //弹出框列表显示
            popupTitle:"",  //弹出框菜单
            popupColumn:[], //弹出框列表
            closeOnOverlay:true,    //是否点击蒙层关闭
		}
	},
	created () {
		this.standardLength = this.standardLengthArr[3];
		this.standardWidth = this.standardWidthArr[1];
		this.standardHeight = this.standardHeightArr[0];
		this.calculateStandardVolume();

		// 测试
		this.calculateActualVolumeAndRate();
		this.filterProductPercent({specsArr:this.standardProductThicknessArr,measureStr:this.actualThicknessStatistics,type:'height'});
		this.filterProductPercent({specsArr:this.standardProductWidthArr,measureStr:this.actualWidthStatistics,type:'width'});
		this.calculatePanelPricePerM3({height:'18',price:this.panel18Price});
		this.calculatePanelPricePerM3({height:'20',price:this.panel20Price});
		this.calculatePanelPricePerM3({height:'22',price:this.panel22Price});
		this.calculateShavingsPricePerM3();
		this.calculateFinalPrice();

		console.log("测试CI部署111111111");
	},
	methods: {
		// 计算标准体积
		calculateStandardVolume(){
			let volume = this.standardLength * (this.standardWidth*2.54*0.01) * (this.standardHeight*2.54*0.01);
			this.standardVolume = volume;
		},
		// 验证必填项
		validActualData({data,type}){
			let msg = "";
			if(type === 'length'){
				switch (true) {
					case data === "":
						msg = "请输入实际长度";
						break;
					case isNaN(data):
						msg = "实际长度只能为数字";
						break;
				}
			}else if(type === 'width'){
				switch (true) {
					case data === "":
						msg = "请输入实际宽度";
						break;
					case isNaN(data):
						msg = "实际宽度只能为数字";
						break;
				}
			}else if(type === 'height'){
				switch (true) {
					case data === "":
						msg = "请输入实际高度";
						break;
					case isNaN(data):
						msg = "实际高度只能为数字";
						break;
				}
			}else if(type === 'number'){
				switch (true) {
					case data === "":
						msg = "请输入实际条数";
						break;
					case isNaN(data):
						msg = "实际条数只能为数字";
						break;
				}
			}
			if(msg !== ""){
				this.$notify({
                    message:msg,
                    duration:2000,
                    background:'#FF4444'
				});
				switch (type) {
					case 'length':
						this.actualLength = "";
						break;
					case 'width':
						this.actualWidth = "";
						break;
					case 'height':
						this.actualHeight = "";
						break;
					case 'number':
						this.actualNumber = "";
						break;
				}
				return;
			}
			this.calculateActualVolumeAndRate();
		},
		// 计算实际体积 和 附送率
		calculateActualVolumeAndRate(){
			if(this.actualLength!=="" && this.actualWidth!=="" && this.actualHeight!=="" && this.actualNumber!==""){
				let volume = (this.actualLength*0.01) * (this.actualWidth*0.01) * (this.actualHeight*0.01) / this.actualNumber;
				this.actualVolume = volume;
				this.deliveryRate = ((this.actualVolume / this.standardVolume)*100).toFixed(2);
				this.calculateActualPricePerM3();
			}else{
				this.actualVolume = "";
				this.deliveryRate = "";
				this.actualPricePerM3 = "";
			}
		},
		// 计算实际价钱
		calculateActualPricePerM3(){
			this.actualPricePerM3 = "";
			if(this.pricePerM3!=="" && this.deliveryRate!==""){
				let perM3 = (this.pricePerM3 / (this.deliveryRate/100)).toFixed(2);
				this.actualPricePerM3 = perM3;
			}
		},
		// 估算木材高度或宽度出材
		filterProductPercent({specsArr,measureStr,type}){
			if(specsArr.length!==0 && measureStr!==""){
				let errorHeight = 0;
				let measureArr = measureStr.split("/");
				switch (type) {
					case 'width':
						errorHeight = 1.5;
						break;
					case 'height':
						errorHeight = 2.7;
						break;
				}
				// 从大到小排序
				specsArr = this.sortArr(specsArr);
				let tempObj = {};   // 属于当前范围的数
				specsArr.forEach(item => {
					tempObj[item] = [];
				});
				let total = 0;
				for (let i = 0; i < measureArr.length; i++) {
					let mItem = measureArr[i];
					total += Number(mItem);
					// 循环规定的厚度
					for(let j = 0;j < specsArr.length; j++){
						let sItem = specsArr[j];
						if(sItem + errorHeight <= mItem){
							tempObj[sItem].push(mItem);
							break;
						}
					}
				}
				/** 总计的平均值 */
				let average = total / measureArr.length;
				// 计算出各自占比
				let percentObj = {};	//当前范围的占比
				let averageObj = {};	//当前范围的平均值
				for (let key in tempObj) {
					percentObj[key] = tempObj[key].length / measureArr.length;
					let subTotal = 0;
					tempObj[key].forEach(item => {
						subTotal += Number(item);
					});
					if(tempObj[key].length !== 0){
						averageObj[key] = subTotal / tempObj[key].length;
					}else{
						averageObj[key] = 0;
					}
				}
				// 赋值平均宽度或厚度
				switch (type) {
					case 'width':
						this.averageWidth = average;
						this.averageCutWidth = this.calculateAverageCutData({
							averageObj:averageObj,
							percentObj:percentObj
						});
						this.averageWidthStatics = averageObj;
						this.averageWidthPercentStatics = percentObj;
						break;
					case 'height':
						this.averageThickness = average;
						this.averageCutThickness = this.calculateAverageCutData({
							averageObj:averageObj,
							percentObj:percentObj
						});
						this.averageThicknessStatics = averageObj;
						this.averageThicknessPercentStatics = percentObj;
						break;
				}
				if(this.averageWidth!=="" && this.averageCutWidth!=="" && this.averageThickness!=="" && this.averageCutThickness!==""){
					this.calculateShavingsVolume();
					this.calculateFinalPrice();
				}
			}else{
				switch (type) {
					case 'width':
						this.averageWidth = "";
						this.averageCutWidth = "";
						break;
					case 'height':
						this.averageThickness = "";
						this.averageCutThickness = "";
						break;
				}
				this.shavingsVolume = "";
			}
		},
		// 计算平均需要裁掉的厚度与宽度
		calculateAverageCutData({averageObj,percentObj}){
			let totalCut = 0;
			for (let key in averageObj) {
				let singleCut = (Number(averageObj[key])-Number(key))*(Number(percentObj[key]));
				totalCut += singleCut;
			}
			return totalCut;
		},
		// 计算至少损耗体积
		calculateShavingsVolume(){
			let average = ((this.averageWidth*0.001) * (this.averageThickness*0.001));
			let averageCut = ((this.averageWidth - this.averageCutWidth)*0.001)*((this.averageThickness - this.averageCutThickness)*0.001);
			this.shavingsVolume = (average - averageCut)*(this.actualLength*0.01);
			this.shavingsPercent = ((Number(this.shavingsVolume)/Number(this.actualVolume))*100).toFixed(2);
			this.calculateProductPercent();
		},
		// 计算出材率
		calculateProductPercent(){
			this.productPercent = (((Number(this.actualVolume) - Number(this.shavingsVolume))  / Number(this.actualVolume)) * 100).toFixed(2); 
		},
		// 数组从大到小排序
		sortArr(arr){
			let maxStr = "";
			for (let i = 0; i < arr.length; i++) {
				//外层循环一次，就拿arr[i] 和 内层循环arr.legend次的 arr[j] 做对比
				for (let j = i; j < arr.length; j++) {
					if (arr[i] < arr[j]) {
						//如果arr[j]大就把此时的值赋值给最大值变量max
						maxStr = arr[j];
						arr[j] = arr[i];
						arr[i] = maxStr;
					}
				};
			};
			return arr;
		},
		// 计算拼板价格/m³
		calculatePanelPricePerM3({height,price}){
			let pricePerM3 = "";
			if(this.panelLength!==""&&this.panelWidth!==""&&price!==""){
				let volume = (Number(this.panelLength)*0.001) * (Number(this.panelWidth)*0.001) * (Number(height)*0.001);
				pricePerM3 = (Number(price) / volume).toFixed(2);
			}
			switch (height) {
				case '18':
					this.panel18PricePerM3 = pricePerM3;
					break;
				case '20':
					this.panel20PricePerM3 = pricePerM3;
					break;
				case '22':
					this.panel22PricePerM3 = pricePerM3;
					break;
			}
			this.calculateFinalPrice();
		},
		// 计算刨花每立方米价格
		calculateShavingsPricePerM3(){
			if(this.shavingsPricePerTon!==""){
				this.shavingsPricePerM3 = Number(this.shavingsPricePerTon)*0.6;
			}else{
				this.shavingsPricePerM3 = "";
			}
			this.calculateFinalPrice();
		},
		// 计算木材最终售价
		calculateFinalPrice(){
			if(this.shavingsPricePerM3!==""){
				let totalPrice = 0;
				for(let key in this.averageThicknessPercentStatics){
					let price = 0;
					switch (key) {
						case '18':
							price = Number(this.panel18PricePerM3)*Number(this.averageThicknessPercentStatics[key])
							break;
						case '20':
							price = Number(this.panel20PricePerM3)*Number(this.averageThicknessPercentStatics[key])
							break;
						case '22':
							price = Number(this.panel22PricePerM3)*Number(this.averageThicknessPercentStatics[key])
							break;
					}
					totalPrice += price;
				}
				this.totalPrice = totalPrice;
				this.finalPrice = ((totalPrice*(Number(this.productPercent)/100))+(Number(this.shavingsPricePerM3)*(Number(this.shavingsPercent)/100))).toFixed(2);
				this.calculateActualPriceWithShaving();
			}else{
				this.finalPrice = "";
				this.ActualPriceWithShaving = "";
			}
		},
		// 计算木材真实售价
		calculateActualPriceWithShaving(){
			let productPercentWithStandard = 1.4;
			let productVolume = Number(this.standardVolume)*productPercentWithStandard;
			let productPercent = productVolume/Number(this.actualVolume);
			this.ActualPriceWithShaving = ((this.totalPrice*productPercent)+(Number(this.shavingsPricePerM3)*(1 - productPercent))).toFixed(2);
		},
		// 显示弹出框
		showPopup(type){
			switch (type) {
				// 标准长度
				case 0:
					this.popupTitle="标准长度范围";
                    this.popupColumn=utils.deepCopy(this.standardLengthArr);
					break;
				// 标准宽度
				case 1:
					this.popupTitle="标准宽度范围";
					this.popupColumn=utils.deepCopy(this.standardWidthArr);
					break;
				// 标准高度
				case 2:
					this.popupTitle="标准高度范围";
					this.popupColumn=utils.deepCopy(this.standardHeightArr);
					break;
			}
			this.itemShow=type;
            this.popupShow=true;
		},
		// 弹出框确认选择
		popupSelectConfirm(value,index){
			switch (this.itemShow) {
				// 长度
				case 0:
					this.standardLength = value;
					break;
				// 宽度
				case 1:
					this.standardWidth = value;
					break;
				// 高度
				case 2:
					this.standardHeight = value;
					break;
			}
			this.calculateStandardVolume();
			this.calculateActualVolumeAndRate();
            this.popupShow=false;
		},
		//弹出框取消选择
        popupSelectCancel(){
            this.popupShow=false;

            this.itemShow="";
		},
		//点击蒙层事件
        clickOverlay(){
            this.itemShow="";
        },
	}
}
</script>

<style lang="less">
.m-view-home{
	overflow-y: hidden;
	.m-content{
		position: absolute;
        top: 46px ;
        left: 0;
        right: 0;
        bottom: 0px;
        overflow-y: auto;
        overflow-x: hidden;
		background-color: #F7F7F7;
		.tagStyle{
            .van-tag{
                background-color:transparent !important;
                color:#999999;
                font-size: 14px;
                margin-top: 7px;
                margin-left: 15px;
                margin-bottom: 7px;
            }
		}
		.van-cell__title{
            width: 125px;
            flex: initial;
            font-weight: bolder;
        }
        .van-cell__value{
            text-align: left;
            color: #323233;
            .van-field__body{
				height: 100%;
				.van-checkbox--horizontal{
					margin-bottom: 10px;
				}
            }
        }
	}
}
</style>

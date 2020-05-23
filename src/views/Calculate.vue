<template>
    <div class="m-view-calculate">
        <van-nav-bar title="计算木材"/>
        <div ref="content" class="m-content">
            <div class="tagStyle">
				<van-tag type="primary">木材成本</van-tag>
			</div>
            <van-field 
                label="价钱(元/m³)*" 
                clearable 
                placeholder="请输入木材成本"
                type="number"
                v-model="woodCost">
            </van-field>
            <div class="tagStyle m-tag-icon">
				<van-tag type="primary">木材厚度统计</van-tag>
                <van-icon name="plus" size="16px" color="#999999"/>
			</div>
            <div 
                class="m-dropDownMenuWithInput"
                v-for="(item,index) in thicknessStatistics" 
                :key="index">
                <van-dropdown-menu>
                    <van-dropdown-item
                        v-model="$data.thicknessStatistics[index].thickness" 
                        :options="thicknessArr"/>
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
        </div>   
    </div>
</template>

<script>
export default {
    data () {
        return {
            woodCost:'',    // 木材成本

            // 厚度列表
            thicknessArr:[
                { text: 16, value: 16 },
                { text: 17, value: 17 },
                { text: 18, value: 18 },
                { text: 20, value: 20 },
                { text: 22, value: 22 }
            ],  // 厚度列表

            // 厚度
            thicknessStatistics:[
                {thickness:18,total:0},
                {thickness:20,total:0},
                {thickness:22,total:0},
            ],

            test:"",
            value:''
        }
    }
}
</script>

<style lang="less">
.m-view-calculate{
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
    }
}
</style>
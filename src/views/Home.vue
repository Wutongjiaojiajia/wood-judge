<template>
    <div class="m-home-selectpage">
        <div 
            class="m-selectpage-list" 
            v-for="(item,index) in list" 
            :key="index"
            :style="{'height':(100/list.length)+'%'}"
            @click="routeJump(item.route)">
            <icon-svg :icon-class="item.icon" @click="routeJump(item.route)"/>
            <p class="m-list-title">{{item.name}}</p>
        </div>
    </div>
</template>

<script>
export default {
    created () {

    },
    data () {
        return {
            // 页面配置
            list:[
                { name:'木材计算',icon:'calculate',route:'calculate'},
                { name:'板价维护',icon:'priceMaintain',route:'priceMaintain'}
            ]
        }
    },
    methods: {
        // 点击跳转路由
        routeJump(route){
            this.$router.push({
                path:`/${route}`,
                query:{}    //参数传递
            })
        }
    }
}
</script>

<style lang="less">
.m-home-selectpage{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column; 
    justify-content: space-between;
    .m-selectpage-list{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid #ebedf0;
        .m-list-title{
			font-size: 16px;
            font-weight:bold;
            // -webkit-user-select:none;
            // -moz-user-select:none;
            // -ms-user-select:none;
            // user-select:none;
        }
    }
    .m-selectpage-list:nth-last-child(1){
        border-bottom: none;
    }
    .m-selectpage-list:active{
        background:linear-gradient( rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1) )
	}
	.m-selectpage-list:nth-child(1){
		.svg-icon{
			font-size:170px
		}
	}
	.m-selectpage-list:nth-child(2){
		.svg-icon{
			font-size:126px;
			margin-bottom:12px;
		}
	}
}
</style>

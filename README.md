# wood-judge项目说明

### 安装依赖

```
npm install
```

### 项目运行

```
npm start
```

### 项目打包

```
npm run build
```

### 项目结构说明

```
.
├── LICENSE   
├── README.md  项目简介
├── babel.config.js  语法解析转换生成
├── favicon.ico  网站图标
├── package-lock.json  
├── package.json  项目描述文件
├── public
│   ├── favicon.ico  网站图标
│   ├── icon.css  图标样式
│   ├── iconfont.js  svg文件
│   └── index.html  应用入口页面
├── src
│   ├── App.vue  根组件
│   ├── api  
│   │   ├── appenv.js  环境切换
│   │   ├── env.js  服务器地址
│   │   ├── http.js  请求方法封装
│   │   ├── index.js  接口列表
│   │   └── req.js  请求方法二次封装
│   ├── components  全局组件
│   │   └── icon-component.vue  svg组件
│   ├── main.js  入口文件
│   ├── public 公共工具包
│   │   ├── public.js	
│   │   └── utils.js
│   ├── router	路由
│   │   └── index.js	路由配置文件
│   ├── store  Vuex
│   │   └── index.js	
│   ├── style
│   │   ├── index.less  样式初始化页面
│   │   └── public.less  公共样式
│   └── views
│       ├── Calculate.vue  利润计算页面
│       ├── Home.vue  首页
│       └── PriceMaintain.vue  价格维护页面
└── vue.config.js  webpack配置
```

### 修改要点

* `src/api/appenv.js`的 `appenv`变量决定调用的后端地址

  

  

<img src="https://github.com/anjoy8/Blog.Admin/blob/master/src/assets/logoall.png" width="350"  />


      注意node >= v18.13.0+  
      C:\Users\laozh>npm -v  
      8.19.3  
      C:\Users\laozh>node -v  
      v18.13.0  


      
      
一个基于 Vue.js 的后台管理系统项目，基于vue2版本的Blog.Admin，进行升级vue3，后端代码是BlogCore，拥有丰富功能的RBAC按钮级别的权限管理后台系统。  


这里仅仅是vue项目，api接口工程，请查看 [Blog.Core](https://github.com/anjoy8/Blog.Core)




## 给个星星! ⭐️
如果你喜欢这个项目或者它帮助你, 请给 Star~ 

*********************************************************
### 项目下载后，首先安装依赖包
```
npm install
```

### 安装成功后，运行即可
```
npm run dev
```
然后你就可以直接访问 http://localhost:5173


## Tips：



```
默认代理的是BlogCore的9291后端接口，（如果后端配置了 CORS 跨域，这里就不用配置了）：

     server: {
        proxy: {
        '/api': {
            target: 'http://localhost:9291',  // 请替换为你的后端服务器地址
            changeOrigin: true,  // 是否改变源
            // rewrite: (path) => path.replace(/^\/api/, ''),  // 重写路径
        },
        }
    }

```

### 如果要部署，先执行bulid
```
npm run build
```




## 加入我们
目前群聊先对贡献者开放，提交代码PR后，加我QQ：3143422472



*****************************************************
### 视频教程

https://www.bilibili.com/video/BV1zVSzY3EkE/?spm_id_from=333.1387.homepage.video_card.click

### 文字教程

 

<div class="allindex">
<h1 id="allindex">目录</h1>


https://mp.weixin.qq.com/s/S8VxZ2DUz28sE65iE0r6zQ
 
《第一课：项目初始化与核心知识点说明》  
《第二课：基于泛型基类封装Axios请求》  
《第三课：封装Axios拦截器》  
《第四课：登录页设计》  
《第五课：获取用户信息》  
《第六课：获取动态菜单接口》  
《第七课：基于布局模式实现动态菜单渲染》  
《第八课：丰富面包屑组件》  
《第九课：实现tabs标签栏》  
《第十课：个人中心模块》  
《第十一课：基于总线实现框架多种布局样式》  
《第十二课：渲染动态权限按钮》  
 

 

</div>
******************************
 







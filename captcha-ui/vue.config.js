let proxyObj = {}

proxyObj['/'] = {
    // websocket
    ws: false,
    // 后端目标地址
    target:'http://localhost:8008',
    // 发送请求头host会被设置成target
    changeOrigin:true,
    // 不重写请求地址
    pathRewrite:{
        '^/':'/'
    }

}



module.export={
    devServer:{
        host:'localhost',
        port:8080,
        proxy:proxyObj
    }
}

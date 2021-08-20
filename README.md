# springboot-captcha
Java之Springboot实现Kaptcha生成验证码、Graphics 2D随机验证码(两种样式) | 通过Vue显示到前端页面

# 技术选型
- java 1.8
- java Graphics 2D
- springboot
- vue2
- element-ui

# 效果预览
postman 接口测试：
![20210608213109778](https://user-images.githubusercontent.com/65069676/130268042-8e326784-4455-4d3a-bfc8-938763fb9192.png)
![20210608213910472](https://user-images.githubusercontent.com/65069676/130268048-85b074bd-484b-4773-8435-a5e5b730f800.png)

## 前端效果
![20210608211157807](https://user-images.githubusercontent.com/65069676/130268066-ec3efa51-9297-43f5-a202-2288c914d9a9.png)
![20210608211147387](https://user-images.githubusercontent.com/65069676/130268058-bbffcc57-e47d-4699-8263-eeabac7bb985.png)

# 实现过程
# 一、kaptcha实现代码

## 1. 引入坐标依赖

首先在Springboot项目下的`pom`下加入依赖坐标：

```java
  <!-- 验证码 -->
   <dependency>
       <groupId>com.github.axet</groupId>
       <artifactId>kaptcha</artifactId>
       <version>0.0.9</version>
   </dependency>     
```
## 2. CaptchaConfig
CaptchaConfig 用来配置验证码信息：

```java
package com.example.demo.util;

import com.google.code.kaptcha.impl.DefaultKaptcha;
import com.google.code.kaptcha.util.Config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @Description: 通过开源kaptcha配置验证码
 * @Author: liyingxia
 * @CreateDate: 2021/08/21 1:00:04
 */

import java.util.Properties;

@Configuration
public class CaptchaConfig {
    @Bean
    public DefaultKaptcha getDefaultCaptcha() {
        //验证码生成器
        DefaultKaptcha defaultKaptcha = new DefaultKaptcha();
        //配置
        Properties properties = new Properties();
        //是否有边框
        properties.setProperty("kaptcha.border", "yes");
        //设置边框颜色
        properties.setProperty("kaptcha.border.color", "105,179,90");
        //验证码
        properties.setProperty("kaptcha.session.key", "code");
        //验证码文本字符颜色 默认为黑色
        properties.setProperty("kaptcha.textproducer.font.color", "blue");
        //设置字体样式
        properties.setProperty("kaptcha.textproducer.font.names", "宋体,楷体,微软雅黑");
        //字体大小 默认40
        properties.setProperty("kaptcha.textproducer.font.size", "30");
        //验证码文本字符内容范围 默认为abced23456789gfynmnpwx
        properties.setProperty("kaptcha.textproducer.char.string", "");
        //字符长度 默认为5
        properties.setProperty("kaptcha.textproducer.char.length", "4");
        //字符间距 默认为2
        properties.setProperty("kaptcha.textproducer.char.space", "4");
        //验证码图片宽度 默认为200
        properties.setProperty("kaptcha.image.width", "100");
        //验证码图片高度 默认为40
        properties.setProperty("kaptcha.image.height", "40");
        Config config = new Config(properties);
        defaultKaptcha.setConfig(config);
        return defaultKaptcha;
    }
}
```
## 3. CaptchaController
contoller层控制页面访问

```java
package com.example.demo.controller;

import com.google.code.kaptcha.impl.DefaultKaptcha;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.imageio.ImageIO;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.BufferedImage;
import java.io.IOException;

/**
 * @Description: 验证码类型1
 * @Author: liyingxia
 * @CreateDate: 2021/08/21 1:00:04
 */


@RestController
public class CaptchaController {
    @Autowired
    private DefaultKaptcha defaultKaptcha;

    /*--------------获取验证码-------------*/
    @GetMapping(value = "/captcha", produces = "image/jpeg")
    public void captcha(HttpServletRequest request, HttpServletResponse response) {
        // 定义response输出类型为image/jpeg
        response.setDateHeader("Expires", 0);
        // 设置http标准
        response.setHeader("Cache-Control", "no-store,no-cache,must-revalidate");
        // 设置请求头
        response.addHeader("Cache-Control", "post-check=0,pre-check=0");
        response.setHeader("Pragma", "no-cache");
        // 响应返回的是image/jpeg类型
        response.setContentType("image/jpeg");


        /*--------------生成验证码-------------*/
        String text = defaultKaptcha.createText();  // 获取验证码文本内容
        System.out.println("验证码为" + text);
        // 将验证码文本内容放入session
        request.getSession().setAttribute("captcha", text);
        // 根据文本验证码内容创建图形验证码
        BufferedImage image = defaultKaptcha.createImage(text);
        try (ServletOutputStream outputStream = response.getOutputStream()) {
            // 输出流输出文件格式为jpg
            ImageIO.write(image, "jpg", outputStream);
            outputStream.flush();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

```
## 4. 配置端口

```java
# 端口
server.port=8008

# 数据库
spring.datasource.url=jdbc:mysql://localhost:3306/my-sys?useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai
spring.datasource.username=root
spring.datasource.password=root123456
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

```

## 5. 应用程序启动入口
CaptchaApplication：

```java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CaptchaApplication {

    public static void main(String[] args) {
        SpringApplication.run(CaptchaApplication.class, args);
        System.out.println("=========项目启动成功=========");
    }
}

```
启动运行CaptchaApplication，成功运行后，通过postman测试验证码，输入`http://localhost:8008/captcha`，即可获取返回的验证码：
![图片](https://user-images.githubusercontent.com/65069676/130268829-88787071-ec6c-437c-b8d7-2a4bdf4382e3.png)


# 二、Graphics 2D实现
## CaptchaConfig2

```java
package com.example.demo.util;


import java.awt.*;
import java.util.Random;

/**
 * @Description: Graphics2D配置验证码
 * @Author: liyingxia
 * @CreateDate: 2021/08/21 45:00:04
 */

public class CaptchaConfig2 {
    public static final int WIDTH = 150;//生成的图片的宽度
    public static final int HEIGHT = 38;//生成的图片的高度

    /**
     * 设置字体
     */
    public static Font font[] = {
            new Font("宋体", Font.BOLD, 24),
            new Font("宋体", Font.BOLD, 24)
    };

    /**
     * 设置背景颜色
     * @param g
     */
    public static void setBackGround(Graphics g) {
        // 设置颜色
        g.setColor(Color.WHITE);
        // 填充区域
        g.fillRect(0, 0, WIDTH, HEIGHT);
    }

    /**
     * 设置图片的边框
     * @param g
     */
    public static void setBorder(Graphics g) {
        // 设置边框颜色
        g.setColor(Color.WHITE);
        // 边框区域
        g.drawRect(1, 1, WIDTH - 2, HEIGHT - 2);
    }

    /**
     * 设置随机干扰线条
     * @param g
     */
    public static void drawRandomLine(Graphics g) {
        // 设置线条个数并画线
        for (int i = 0; i < 3; i++) {
            // 设置颜色
            g.setColor(getRandColorCode());
            int x1 = new Random().nextInt(WIDTH / 2);
            int y1 = new Random().nextInt(HEIGHT / 2);
            int x2 = new Random().nextInt(WIDTH) + WIDTH / 2;
            int y2 = new Random().nextInt(HEIGHT) + HEIGHT / 2;
            Graphics2D g2 = (Graphics2D) g;
            // 设置笔画的属性，设置线条的粗细
            g2.setStroke(new BasicStroke(2.5f));
            g2.drawLine(x1, y1, x2, y2);
        }
    }

    /**
     * 生成随机字符
     *
     * @param g
     * @param baseChar
     * @return 随机字符
     */
    public static String createRandomChar(Graphics2D g, String baseChar) {
        StringBuffer stringBuffer = new StringBuffer();
        int x = 15;
        String ch = "";
        // 设置生成字数
        for (int i = 0; i < 4; i++) {
            g.setFont(font[new Random().nextInt(font.length - 1)]);
            g.setColor(getRandColorCode());
            // 设置字体旋转角度
            int degree = new Random().nextInt() % 30;
            ch = baseChar.charAt(new Random().nextInt(baseChar.length())) + "";
            stringBuffer.append(ch);
            // 正向角度
            g.rotate(degree * Math.PI / 180, x, 33);
            g.drawString(ch, x, 33);
            // 反向角度
            g.rotate(-degree * Math.PI / 180, x, 33);
            x += 25;
        }
        return stringBuffer.toString();
    }

    /**
     * 随机颜色
     * @return
     */
    public static Color getRandColorCode() {
        int r, g, b;
        Random random = new Random();
        r = random.nextInt(256);
        g = random.nextInt(256);
        b = random.nextInt(256);
        Color color = new Color(r, g, b);
        return color;
    }

    /**
     * 画随机字符
     * @param g
     * @param createTypeFlag
     * @return String
     */
    public static String drawRandomNum(Graphics2D g, String... createTypeFlag) {
        // 设置颜色
        g.setColor(Color.RED);
        // 设置字体
        g.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 24));
        // 常用的中国汉字
        String baseChineseChar = "\u7684\u4e00\u4e86\u662f\u6211\u4e0d\u5728\u4eba\u4eec\u6709\u6765\u4ed6\u8fd9\u4e0a\u7740\u4e2a\u5730\u5230\u5927\u91cc\u8bf4\u5c31\u53bb\u5b50\u5f97\u4e5f\u548c\u90a3\u8981\u4e0b\u770b\u5929\u65f6\u8fc7\u51fa\u5c0f\u4e48\u8d77\u4f60\u90fd\u628a\u597d\u8fd8\u591a\u6ca1\u4e3a\u53c8\u53ef\u5bb6\u5b66\u53ea\u4ee5\u4e3b\u4f1a\u6837\u5e74\u60f3\u751f\u540c\u8001\u4e2d\u5341\u4ece\u81ea\u9762\u524d\u5934\u9053\u5b83\u540e\u7136\u8d70\u5f88\u50cf\u89c1\u4e24\u7528\u5979\u56fd\u52a8\u8fdb\u6210\u56de\u4ec0\u8fb9\u4f5c\u5bf9\u5f00\u800c\u5df1\u4e9b\u73b0\u5c71\u6c11\u5019\u7ecf\u53d1\u5de5\u5411\u4e8b\u547d\u7ed9\u957f\u6c34\u51e0\u4e49\u4e09\u58f0\u4e8e\u9ad8\u624b\u77e5\u7406\u773c\u5fd7\u70b9\u5fc3\u6218\u4e8c\u95ee\u4f46\u8eab\u65b9\u5b9e\u5403\u505a\u53eb\u5f53\u4f4f\u542c\u9769\u6253\u5462\u771f\u5168\u624d\u56db\u5df2\u6240\u654c\u4e4b\u6700\u5149\u4ea7\u60c5\u8def\u5206\u603b\u6761\u767d\u8bdd\u4e1c\u5e2d\u6b21\u4eb2\u5982\u88ab\u82b1\u53e3\u653e\u513f\u5e38\u6c14\u4e94\u7b2c\u4f7f\u5199\u519b\u5427\u6587\u8fd0\u518d\u679c\u600e\u5b9a\u8bb8\u5feb\u660e\u884c\u56e0\u522b\u98de\u5916\u6811\u7269\u6d3b\u90e8\u95e8\u65e0\u5f80\u8239\u671b\u65b0\u5e26\u961f\u5148\u529b\u5b8c\u5374\u7ad9\u4ee3\u5458\u673a\u66f4\u4e5d\u60a8\u6bcf\u98ce\u7ea7\u8ddf\u7b11\u554a\u5b69\u4e07\u5c11\u76f4\u610f\u591c\u6bd4\u9636\u8fde\u8f66\u91cd\u4fbf\u6597\u9a6c\u54ea\u5316\u592a\u6307\u53d8\u793e\u4f3c\u58eb\u8005\u5e72\u77f3\u6ee1\u65e5\u51b3\u767e\u539f\u62ff\u7fa4\u7a76\u5404\u516d\u672c\u601d\u89e3\u7acb\u6cb3\u6751\u516b\u96be\u65e9\u8bba\u5417\u6839\u5171\u8ba9\u76f8\u7814\u4eca\u5176\u4e66\u5750\u63a5\u5e94\u5173\u4fe1\u89c9\u6b65\u53cd\u5904\u8bb0\u5c06\u5343\u627e\u4e89\u9886\u6216\u5e08\u7ed3\u5757\u8dd1\u8c01\u8349\u8d8a\u5b57\u52a0\u811a\u7d27\u7231\u7b49\u4e60\u9635\u6015\u6708\u9752\u534a\u706b\u6cd5\u9898\u5efa\u8d76\u4f4d\u5531\u6d77\u4e03\u5973\u4efb\u4ef6\u611f\u51c6\u5f20\u56e2\u5c4b\u79bb\u8272\u8138\u7247\u79d1\u5012\u775b\u5229\u4e16\u521a\u4e14\u7531\u9001\u5207\u661f\u5bfc\u665a\u8868\u591f\u6574\u8ba4\u54cd\u96ea\u6d41\u672a\u573a\u8be5\u5e76\u5e95\u6df1\u523b\u5e73\u4f1f\u5fd9\u63d0\u786e\u8fd1\u4eae\u8f7b\u8bb2\u519c\u53e4\u9ed1\u544a\u754c\u62c9\u540d\u5440\u571f\u6e05\u9633\u7167\u529e\u53f2\u6539\u5386\u8f6c\u753b\u9020\u5634\u6b64\u6cbb\u5317\u5fc5\u670d\u96e8\u7a7f\u5185\u8bc6\u9a8c\u4f20\u4e1a\u83dc\u722c\u7761\u5174\u5f62\u91cf\u54b1\u89c2\u82e6\u4f53\u4f17\u901a\u51b2\u5408\u7834\u53cb\u5ea6\u672f\u996d\u516c\u65c1\u623f\u6781\u5357\u67aa\u8bfb\u6c99\u5c81\u7ebf\u91ce\u575a\u7a7a\u6536\u7b97\u81f3\u653f\u57ce\u52b3\u843d\u94b1\u7279\u56f4\u5f1f\u80dc\u6559\u70ed\u5c55\u5305\u6b4c\u7c7b\u6e10\u5f3a\u6570\u4e61\u547c\u6027\u97f3\u7b54\u54e5\u9645\u65e7\u795e\u5ea7\u7ae0\u5e2e\u5566\u53d7\u7cfb\u4ee4\u8df3\u975e\u4f55\u725b\u53d6\u5165\u5cb8\u6562\u6389\u5ffd\u79cd\u88c5\u9876\u6025\u6797\u505c\u606f\u53e5\u533a\u8863\u822c\u62a5\u53f6\u538b\u6162\u53d4\u80cc\u7ec6";
        //数字和字母的组合
        String baseNumLetter = "0123456789ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        //纯数字
        String baseNum = "0123456789";
        //纯字母
        String baseLetter = "ABCDEFGHJKLMNOPQRSTUVWXYZ";
        if (createTypeFlag.length > 0 && null != createTypeFlag[0]) {
            if (createTypeFlag[0].equals("ch")) {
                // 截取汉字
                return createRandomChar(g, baseChineseChar);
            } else if (createTypeFlag[0].equals("nl")) {
                // 截取数字和字母的组合
                return createRandomChar(g, baseNumLetter);
            } else if (createTypeFlag[0].equals("n")) {
                // 截取数字
                return createRandomChar(g, baseNum);
            } else if (createTypeFlag[0].equals("l")) {
                // 截取字母
                return createRandomChar(g, baseLetter);
            }
        } else {
            // 默认截取数字和字母的组合
            return createRandomChar(g, baseNumLetter);
        }
        return "";
    }

}

```
## Captcha2Controller

```java
package com.example.demo.controller;


import com.example.demo.util.CaptchaConfig2;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletResponse;
import java.awt.*;
import java.awt.image.BufferedImage;

/**
 * @Description: 验证码类型2
 * @Author: liyingxia
 * @CreateDate: 2021/08/21 1:00:04
 */

@Controller
public class Captcha2Controller {
    @RequestMapping(value = "/captcha2", method = RequestMethod.GET)
    public void identifyPicture(HttpServletResponse response) {
        //1.创建一张图片
        BufferedImage bi = new BufferedImage(CaptchaConfig2.WIDTH, CaptchaConfig2.HEIGHT, BufferedImage.TYPE_INT_RGB);
        //2.获取图片
        Graphics g = bi.getGraphics();
        //3.设置图片的背影色
        CaptchaConfig2.setBackGround(g);
        //4.设置图片的边框
        CaptchaConfig2.setBorder(g);
        //5.设置图片画干扰线
        CaptchaConfig2.drawRandomLine(g);
        //6.设置图片上的随机数
        //根据客户端传递的 createTypeFlag标识生成验证码图片 createTypeFlag = ch /n1 /n /1
        String random = CaptchaConfig2.drawRandomNum((Graphics2D) g, "nl");
        System.out.println(random);

        /* ---------将随机数存在session中------------- */
        //8.设置响应头通知浏览器以图片的形式打开
        response.setContentType("image/jpeg");
        //9.设置响应头控制浏览器不要缓存
        response.setDateHeader("expries", -1);
        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("Pragma", "no-cache");
        //10.将图片写给浏览器
        try {
            ImageIO.write(bi, "jpg", response.getOutputStream());
        } catch (Exception e) {
        }
    }
}

```
接下来测试访问：`http://localhost:8008/captcha2`,如下：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210608213910472.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80Mzg1Mzc0Ng==,size_16,color_FFFFFF,t_70)
至此，验证码的逻辑就实现了，接下来我们把它显示到前端页面上

# 三、前端 Vue项目
这里通过vue-cli搭建：
## Login.vue
```javascript
<template>
  <div class="formBg">
    <el-form :rules="rules" ref="loginForm" :model="loginForm" class="loginContainer">
      <h3 class="formTitle">系统登陆</h3>
      <el-form-item prop="username">
        <el-input type="text" auto-complete="false" v-model="loginForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" auto-complete="false" v-model="loginForm.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item prop="code" class="el-form-item__content">
        <el-input style="width: 250px" type="text" auto-complete="false" v-model="loginForm.code" placeholder="点击图片更换验证码"></el-input>
        <img :src="captchaUrl" @click="getCaptcha" title="点击更换">
      </el-form-item>
      <el-checkbox v-model="checked" class="formCheck">记住我</el-checkbox>
      <el-button type="primary" style="width: 100%" @click="submitForm">登录</el-button>
    </el-form>
  </div>
</template>

<script>
  import {getCodeImg, postRequest,getRequest} from '../utils/api'

export default {
  name: 'Login',
  data () {
    return {//'/captcha?time='+new Date(),
      captchaUrl: 'http://localhost:8008/captcha',
      captchaLoad: true,
      loginForm: {
        username: 'admin',
        password: '123',
        code: '',
        uuid: ''
      },
      checked: true,
      //整个页面加载
      loading: false,
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    // 加载验证码
    this.getCaptcha();
  },
  methods: {
    // 获取验证码
    getCaptcha() {
      this.getRequest('/captcha2?time=' + new Date()).then(resp => {
        if (resp) {
          this.captchaUrl = resp.captcha2;
        }
      })
    },
    submitForm() {
     this.$refs.loginForm.validate((valid) => {
        if (valid) {
          postRequest('/login',this.loginForm).then(resp => {
            if (resp) {
              const tokenStr = resp.obj.tokenHead + resp.obj.token;
              window.sessionStorage.getItem('tokenStr',tokenStr);
              // 跳转首页
              this.$router.replace('/home');
            }
          })
        } else {
          this.$message.error('请输入正确的信息！')
          return false
        }
      })
    }
  }
}
</script>
<style scoped>
  .formBg{
    height: 900px;
    width: 100%;
    display: flex;
    justify-content: center;
    background: url('../assets/images/y1.jpg');
  }
  .loginContainer{
    border-radius: 15px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 440px;
    height: 380px;
    padding: 15px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  .formTitle{
    margin: 0px auto 40px auto;
  }
  .formCheck{
    margin: 5px 0px 15px 0px;
  }
  .el-form-item__content{
    display: flex;
    align-items: center;
  }
</style>

```
## vue.config.js
跨域代理：

```javascript
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

```


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
 * @CreateDate: 2021/6/08 12:58
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

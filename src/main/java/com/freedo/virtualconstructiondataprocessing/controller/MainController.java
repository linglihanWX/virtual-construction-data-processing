package com.freedo.virtualconstructiondataprocessing.controller;

import com.freedo.virtualconstructiondataprocessing.common.WebSecurityConfig;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Controller
public class MainController {
    @GetMapping("/")
    public String index(@SessionAttribute(WebSecurityConfig.SESSION_KEY) String account, Model model, HttpServletRequest request) {
        model.addAttribute("name", account);
        model.addAttribute("baseContextPath",request.getContextPath());
        //System.out.println(request.getScheme()+request.getServerName()+request.getServerPort()+request.getContextPath());
        return "index";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @PostMapping("/loginPost")
    public @ResponseBody Map<String, Object> loginPost(String account, String password, HttpSession session) {
        Map<String, Object> map = new HashMap<>();
        /*if (!"123456".equals(password)) {
            map.put("success", false);
            map.put("message", "密码错误");
            return map;
        }*/
        // 设置session
        session.setAttribute(WebSecurityConfig.SESSION_KEY, account);
        map.put("now", new Date().getTime());
        map.put("success", true);
        map.put("message", "登录成功");
        return map;
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        // 移除session
        session.removeAttribute(WebSecurityConfig.SESSION_KEY);
        return "redirect:/login";
    }

}

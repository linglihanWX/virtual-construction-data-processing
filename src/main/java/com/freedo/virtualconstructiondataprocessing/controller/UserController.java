package com.freedo.virtualconstructiondataprocessing.controller;

import com.freedo.virtualconstructiondataprocessing.model.UserDomain;
import com.freedo.virtualconstructiondataprocessing.service.user.PlanService;
import com.freedo.virtualconstructiondataprocessing.service.user.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


@Controller
@RequestMapping(value = "/user")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private PlanService planService;
    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @ResponseBody
    @PostMapping("/add")
    public int addUser(UserDomain user){
        logger.info("hello world");
        return userService.addUser(user);
    }

    @ResponseBody
    @GetMapping("/all")
    public Object findAllUser(
            @RequestParam(name = "pageNum", required = false, defaultValue = "1")
                    int pageNum,
            @RequestParam(name = "pageSize", required = false, defaultValue = "10")
                    int pageSize){
        logger.info("hello world");
        return userService.findAllUser(pageNum,pageSize);
    }
}

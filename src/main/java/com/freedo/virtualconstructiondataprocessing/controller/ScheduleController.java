package com.freedo.virtualconstructiondataprocessing.controller;

import com.freedo.virtualconstructiondataprocessing.model.PlanModel;
import com.freedo.virtualconstructiondataprocessing.service.user.PlanService;
import com.google.gson.Gson;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


@Controller
@RequestMapping("/plan")
public class ScheduleController {
    @Autowired
    private PlanService planService;

    @RequestMapping("/form")
    public String index(@Param("id") String id,String modelId , Model model){
        model.addAttribute("id",id);
        model.addAttribute("bimModelID",modelId);
        /*int searchId = Integer.parseInt(id);
        List<PlanModel> findPlans = planService.findPlanById(searchId);
        model.addAttribute("gridData",findPlans);*/
        return "planTable/planFormData";
    }

    @RequestMapping("/allplanform")
    public String allplanform(String id,Model model){
        model.addAttribute("id",id);
        return "planTable/allPlanFormData";
    }

    @ResponseBody
    @RequestMapping("/getallplan")
    public Object findAllPlan (){
        return planService.findAllPlan();
    }

    @ResponseBody
    @RequestMapping("/getplanbyid")
    public Object findPlanByID(@Param("id") String id){
        int searchId = Integer.parseInt(id);
        return planService.findPlanById(searchId);
    }

    @ResponseBody
    @RequestMapping("/getplanbycid")
    public Object findPlanByCID(@Param("cid") String cid , HttpServletRequest request){
        //int searchId = Integer.parseInt(id);
        System.out.println(cid);
        return planService.findPlanByCId(cid);
    }

    @ResponseBody
    @RequestMapping("/getplanbybcid")
    public Object findPlanByBCID(String cid,String bid){
        return planService.findPlanByBCID(bid,cid);
    }

    @ResponseBody
    @RequestMapping(value = "/insertorupdata",method = RequestMethod.POST)
    public Object insertorupdataPlan(HttpServletRequest request){
        String shuju =  request.getParameter("mydata");
        List<PlanModel> myDatas = new ArrayList<>();
        Gson gson = new Gson();
        myDatas =  gson.fromJson(shuju,myDatas.getClass());
        return planService.insertOrUpdatePlan(myDatas);
    }

    @ResponseBody
    @RequestMapping("/planinsert")
    public Object insertPlan(){
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        PlanModel ceshi = new PlanModel();
        ceshi.setEndDate(simpleDateFormat.format(new Date()));
        ceshi.setStartDate(simpleDateFormat.format(new Date()));
        ceshi.setType(0);
        ceshi.setPlanId(2);
        ceshi.setBimId("saweqwe");
        ceshi.setComponentID("dasdas");
        List<PlanModel> myList = new ArrayList<>();
        myList.add(ceshi);
        planService.insertOrUpdatePlan(myList);
        return 1;
    }

    @ResponseBody
    @RequestMapping("/removebypbc")
    public Object removeByPBC(String planId,String bimId,String componentID){
        return planService.removeByPBC(planId,bimId,componentID);
    }
}

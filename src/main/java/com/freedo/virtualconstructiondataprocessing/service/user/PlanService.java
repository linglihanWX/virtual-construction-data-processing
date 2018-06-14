package com.freedo.virtualconstructiondataprocessing.service.user;

import com.freedo.virtualconstructiondataprocessing.model.PlanModel;

import java.util.List;

public interface PlanService {

    int addPlan(PlanModel plan);

    List<PlanModel> findAllPlan();

    List<PlanModel> findPlanById(int id);

    List<PlanModel> findPlanByCId(String cid);

    List<PlanModel> findPlanByBCID( String bid, String cid);

    int insertOrUpdatePlan (List<PlanModel> record);

    int removeByPBC(String planId,String bimId,String componentId);
}

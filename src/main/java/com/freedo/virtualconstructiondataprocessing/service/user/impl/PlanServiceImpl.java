package com.freedo.virtualconstructiondataprocessing.service.user.impl;

import com.freedo.virtualconstructiondataprocessing.dao.PlanDao;
import com.freedo.virtualconstructiondataprocessing.model.PlanModel;
import com.freedo.virtualconstructiondataprocessing.service.user.PlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service(value = "planService")
public class PlanServiceImpl implements PlanService {
    @Autowired
    private PlanDao planDao;//这里会报错，但是并不会影响

    @Override
    public int addPlan(PlanModel plan) {
        return planDao.insert(plan);
    }

    @Override
    public List<PlanModel> findAllPlan() {
        List<PlanModel> planData = planDao.selectAllPlan();
        return planData;
    }

    @Override
    public List<PlanModel> findPlanById(int id) {
        return planDao.selectPlanById(id);
    }

    @Override
    public List<PlanModel> findPlanByCId(String cid) {
        List<PlanModel> tempData =  planDao.selectPlanByCID(cid);
        for (int i = 0; i < tempData.size(); i++) {
            
        }
        return planDao.selectPlanByCID(cid);
    }

    @Override
    public List<PlanModel> findPlanByBCID(String bid, String cid) {
        return planDao.selectPlanByBCID(bid, cid);
    }

    @Override
    public int insertOrUpdatePlan(List<PlanModel> record) {
        return planDao.insertOrUpdate(record);
    }

    @Override
    public int removeByPBC(String planId, String bimId, String componentId) {
        return planDao.removeByPBC(planId,bimId,componentId);
    }
}

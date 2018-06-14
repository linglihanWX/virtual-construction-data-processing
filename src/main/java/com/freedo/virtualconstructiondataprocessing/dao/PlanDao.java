package com.freedo.virtualconstructiondataprocessing.dao;

import com.freedo.virtualconstructiondataprocessing.model.PlanModel;
import org.apache.ibatis.annotations.Param;

import javax.print.DocFlavor;
import java.util.List;

public interface PlanDao {

    int insert (PlanModel record);

    List<PlanModel> selectPlanById(int id);

    List<PlanModel> selectAllPlan();

    List<PlanModel> selectPlanByCID(String cid);

    List<PlanModel> selectPlanByBCID(@Param("bid") String bid,@Param("cid") String cid);

    int insertOrUpdate (List<PlanModel> record);

    int removeByPBC(@Param("planId") String planId,@Param("bimId") String bimId,@Param("componentId") String componentId);
}

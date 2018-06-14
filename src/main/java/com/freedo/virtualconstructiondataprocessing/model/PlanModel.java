package com.freedo.virtualconstructiondataprocessing.model;

//进度计划实体对象
public class PlanModel {
    //计划ID
    private Integer  planId ;
    //BIM模型资源的ID
    private String bimId;
    //BIM构建ID
    private String componentID;
    //建造类型，拆除0、建造1
    private Integer type;
    //开工日期
    private String startDate;
    //竣工日期
    private String endDate;

    public Integer getPlanId() {
        return planId;
    }

    public void setPlanId(Integer planId) {
        this.planId = planId;
    }

    public String getBimId() {
        return bimId;
    }

    public void setBimId(String bimId) {
        this.bimId = bimId;
    }

    public String getComponentID() {
        return componentID;
    }

    public void setComponentID(String componentID) {
        this.componentID = componentID;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }
}

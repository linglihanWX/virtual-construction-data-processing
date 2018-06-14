package com.freedo.virtualconstructiondataprocessing.dao;

import com.freedo.virtualconstructiondataprocessing.model.UserDomain;

import java.util.List;

public interface UserDao {
    int insert(UserDomain record );

    List<UserDomain> selectUsers( );
}

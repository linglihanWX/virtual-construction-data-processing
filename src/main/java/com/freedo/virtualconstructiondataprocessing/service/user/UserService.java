package com.freedo.virtualconstructiondataprocessing.service.user;

import com.freedo.virtualconstructiondataprocessing.model.UserDomain;
import com.github.pagehelper.PageInfo;

public interface UserService {
    int addUser(UserDomain user);

    PageInfo<UserDomain> findAllUser(int pageNum, int pageSize);
}

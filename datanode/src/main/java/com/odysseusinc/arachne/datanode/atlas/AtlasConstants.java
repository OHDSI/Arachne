package com.odysseusinc.arachne.datanode.atlas;

import com.odysseusinc.arachne.commons.utils.ComparableVersion;

public interface AtlasConstants {

    String INFO = "/info";
    String LOGIN_DB = "/user/login/db";
    String LOGIN_LDAP = "/user/login/ldap";
    String COHORT_DEFINITION = "/cohortdefinition";

    ComparableVersion ATLAS_2_7_VERSION = new ComparableVersion("2.7.0");
}

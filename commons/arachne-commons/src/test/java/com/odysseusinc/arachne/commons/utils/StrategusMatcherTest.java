package com.odysseusinc.arachne.commons.utils;

import com.odysseusinc.arachne.commons.utils.strategus.StrategusMatcher;
import org.apache.commons.io.IOUtils;
import org.junit.Test;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamSource;

import java.io.IOException;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.equalTo;

public class StrategusMatcherTest {

    @Test
    public void shouldDetectStrategusType() throws IOException {
        StrategusMatcher matcher = new StrategusMatcher();
        String contentType = matcher.getContentType("strategusStudy.json", getResource("/strategus/strategusStudy.json"));
        assertThat(contentType, is(equalTo(CommonFileUtils.TYPE_STRATEGUS_JSON)));
    }

    private InputStreamSource getResource(String path) throws IOException {
        return new ByteArrayResource(IOUtils.resourceToByteArray(path));
    }
}

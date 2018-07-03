/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Maria Pozhidaeva
 * Created: May 23, 2018
 *
 */

package com.odysseusinc.arachne.nohandlerfoundexception;

import java.io.IOException;
import java.util.Collections;
import java.util.function.Consumer;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.servlet.resource.ResourceHttpRequestHandler;

@Component
public class NoHandlerFoundExceptionUtils {

    private static final String STATIC_CONTENT_FOLDER = "public";
    private static final String INDEX_FILE = STATIC_CONTENT_FOLDER + "/index.html";

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    public NoHandlerFoundExceptionUtils(WebApplicationContext webApplicationContext) {

        this.webApplicationContext = webApplicationContext;
    }

    public void handleNotFoundError(HttpServletRequest request, HttpServletResponse response) throws Exception {

        handleNotFoundError(request, response, null);
    }

    public void handleNotFoundError(HttpServletRequest request, HttpServletResponse response, Consumer<HttpServletResponse> addCookie)
            throws Exception {

        ResourceHttpRequestHandler handler = new ResourceHttpRequestHandler() {
            @Override
            protected Resource getResource(HttpServletRequest request) throws IOException {

                String requestPath = request.getRequestURI().substring(request.getContextPath().length());

                ClassPathResource resource = new ClassPathResource(STATIC_CONTENT_FOLDER + requestPath);
                if (!resource.exists()) {
                    resource = new ClassPathResource(INDEX_FILE);
                }
                if (addCookie != null) {
                    addCookie.accept(response);
                }
                return resource;
            }
        };

        handler.setServletContext(webApplicationContext.getServletContext());
        handler.setLocations(Collections.singletonList(new ClassPathResource("classpath:/" + STATIC_CONTENT_FOLDER + "/")));
        handler.afterPropertiesSet();
        handler.handleRequest(request, response);
    }

}

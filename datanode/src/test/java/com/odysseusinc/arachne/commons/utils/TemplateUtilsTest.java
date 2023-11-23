package com.odysseusinc.arachne.commons.utils;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;

import com.github.jknack.handlebars.Template;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import org.junit.Test;

/**
 * @author vkoulakov
 * @since 6/14/19.
 */
public class TemplateUtilsTest {

	@Test
	public void loadTemplate() throws IOException {

		Template template = TemplateUtils.loadTemplate("/test.handlebars");
		Map<String, Object> context = new HashMap<>();
		context.put("name", "Handlebars");
		String result = template.apply(context);
		assertThat(result, is(equalTo("Hello, Handlebars")));
	}
}
package com.odysseusinc.arachne.commons.utils;

import com.google.gson.stream.JsonReader;
import com.odysseusinc.arachne.commons.utils.annotations.OptionalField;
import com.odysseusinc.arachne.commons.utils.cohortcharacterization.CohortCharacterizationMatcher;
import java.io.IOException;
import java.io.InputStreamReader;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Function;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.InputStreamSource;

public abstract class JsonMatcher {
    private static final Logger log = LoggerFactory.getLogger(CohortCharacterizationMatcher.class);
    private final Function<? super Field, ? extends String> FIELD_OPTIONALS_MAP_FUNC = f -> {
        String result;
        OptionalField optional = f.getAnnotation(OptionalField.class);
        if (Objects.isNull(optional)) {
            result = f.getName();
        } else {
            result = "(" + f.getName() + ")*";
        }
        return result;
    };
    protected Map<String, String> docTypeStrings = new HashMap<>();
    Comparator<? super String> FIELD_COMPARATOR = Comparator.comparing(s -> s.replaceAll("[\\(\\)\\.]", ""));

    private boolean hasOptionals = false;

    protected abstract boolean satisfy(String fileName);

    public String getContentType(String fileName, InputStreamSource inputStreamSource) {

        String docType = null;
        if (satisfy(fileName)) {
            try {
                final JsonReader jsonReader = new JsonReader(new InputStreamReader(inputStreamSource.getInputStream()));
                List<String> names = new ArrayList<>();
                jsonReader.beginObject();
                while (jsonReader.hasNext()) {
                    names.add(jsonReader.nextName());
                    jsonReader.skipValue();
                }
                final String fieldString = names.stream().sorted().collect(Collectors.joining());
                docType = docTypeStrings.get(fieldString);
                if (hasOptionals && Objects.isNull(docType)) {
                    Optional<String> match = docTypeStrings.keySet().stream()
                            .filter(key -> Pattern.compile(key).matcher(fieldString).matches()).findFirst();
                    if (match.isPresent()) {
                        docType = docTypeStrings.get(match.get());
                    }
                }
            } catch (IOException e) {
                log.error(e.getMessage());
            }
        }
        return docType;
    }

    protected void putToMap(String docType, Class<? extends CommonObjectJson> aClass) {

        final Field[] declaredFields = aClass.getDeclaredFields();

        final String fields = Arrays.stream(declaredFields)
                .map(FIELD_OPTIONALS_MAP_FUNC)
                .sorted(FIELD_COMPARATOR)
                .collect(Collectors.joining());
        docTypeStrings.put(fields, docType);
        hasOptionals |= fields.contains("*");
    }
}

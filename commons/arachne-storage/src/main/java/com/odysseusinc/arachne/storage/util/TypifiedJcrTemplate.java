package com.odysseusinc.arachne.storage.util;

import org.springframework.dao.DataAccessException;
import org.springmodules.jcr.JcrCallback;
import org.springmodules.jcr.JcrTemplate;

public class TypifiedJcrTemplate extends JcrTemplate {

    public <T> T exec(JcrCallback<T> callback) throws DataAccessException {
        return (T) execute(callback, isExposeNativeSession());
    }
}

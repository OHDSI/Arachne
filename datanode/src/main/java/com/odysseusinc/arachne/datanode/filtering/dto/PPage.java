package com.odysseusinc.arachne.datanode.filtering.dto;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;

public class PPage<T> extends PageImpl<T> {
    private final List<String> actions;

    public static<T> PPage<T> of(List<String> actions, Page<T> page) {
        return of(actions, page.getContent(), page.getPageable(), page.getTotalElements());
    }

    public static<T> PPage<T> of(List<String> actions, List<T> content) {
        return new PPage<>(actions, content);
    }

    public static<T> PPage<T> of(List<String> actions, List<T> content, Pageable pageable, long total) {
        return new PPage<>(actions, content, pageable, total);
    }

    public PPage(List<String> actions, List<T> content, Pageable pageable, long total) {
        super(content, pageable, total);
        this.actions = actions;
    }

    public PPage(List<String> actions, List<T> content) {
        super(content);
        this.actions = actions;
    }
}
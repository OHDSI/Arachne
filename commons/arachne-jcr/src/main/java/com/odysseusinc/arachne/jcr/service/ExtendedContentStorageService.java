package com.odysseusinc.arachne.jcr.service;

interface ExtendedContentStorageService extends ContentStorageService {

    void deleteByPath(String identifier);
}

package com.odysseusinc.arachne.storage.model;

import java.io.InputStream;

public class ArachneFileSourced extends ArachneFileMetaImpl implements ArachneFileMeta {

    public ArachneFileSourced() {

    }

    public ArachneFileSourced(ArachneFileMeta arachneFileMeta) {

        super(
                arachneFileMeta.getUuid(),
                arachneFileMeta.getPath(),
                arachneFileMeta.getCreated(),
                arachneFileMeta.getCreatedBy(),
                arachneFileMeta.getUpdated(),
                arachneFileMeta.getContentType()
        );
    }

    protected InputStream inputStream;

    public InputStream getInputStream() {
        return this.inputStream;
    }

    public void setInputStream(InputStream inputStream) {

        this.inputStream = inputStream;
    }
}

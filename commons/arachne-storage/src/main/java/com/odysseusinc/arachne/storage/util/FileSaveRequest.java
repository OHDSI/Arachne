package com.odysseusinc.arachne.storage.util;

import java.io.File;

public class FileSaveRequest {

    private File file;

    // Folder + file name
    private String destinationFilepath;

    public File getFile() {

        return file;
    }

    public void setFile(File file) {

        this.file = file;
    }

    public String getDestinationFilepath() {

        return destinationFilepath;
    }

    public void setDestinationFilepath(String destinationFilepath) {

        this.destinationFilepath = destinationFilepath;
    }
}

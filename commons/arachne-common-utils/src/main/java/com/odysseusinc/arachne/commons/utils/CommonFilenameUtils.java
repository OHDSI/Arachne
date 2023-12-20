/*******************************************************************************
 * Copyright 2023 Odysseus Data Services, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *        http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *******************************************************************************/
package com.odysseusinc.arachne.commons.utils;

import java.util.Objects;

public class CommonFilenameUtils {

    private static final String POSIX_RESERVED_CHARS = "[/\u0000]";
    private static final String WIN_ILLEGAL_CHARS = "[<>:\"/\\\\|?*\\u0000]";

    private CommonFilenameUtils() {}

    /**
     * Strict sanitization of given filename both valid for Windows and *nix systems.
     * <p></p>Filters most of characters enumerated by the Microsoft's
     * <a href="https://docs.microsoft.com/ru-ru/windows/win32/fileio/naming-a-file">Naming conventions</a>
     * </p>
     * @param filename
     * @return
     */
    public static String sanitizeFilename(String filename) {

        return Objects.requireNonNull(filename).replaceAll(WIN_ILLEGAL_CHARS,"");
    }

    /**
     * Sanitize filename according to POSIX filename limitations.
     * Reserved symbols are / and null
     * @param filename
     * @return
     */
    public static String sanitizeFilenamePosix(String filename) {

        return Objects.requireNonNull(filename).replaceAll(POSIX_RESERVED_CHARS, "");
    }
}

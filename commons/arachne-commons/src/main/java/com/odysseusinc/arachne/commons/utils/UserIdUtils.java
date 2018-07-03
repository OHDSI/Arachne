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
 * Authors: Pavel Grafkin, Alexandr Ryabokon, Vitaly Koulakov, Anton Gackovka, Maria Pozhidaeva, Mikhail Mironov
 * Created: January 31, 2018
 *
 */

package com.odysseusinc.arachne.commons.utils;

import java.nio.ByteBuffer;
import java.nio.CharBuffer;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import org.apache.commons.net.util.Base64;

public class UserIdUtils {

    public static List<Long> uuidsToIds(Collection<String > uuids) {

        return uuids.stream().map(UserIdUtils::uuidToId).collect(Collectors.toList());
    }

    public static String idToUuid(Long id) {

        if (id == null) {
            return null;
        }
        Long hashedId = reversibleHash(id);
        byte[] bytes = stringToBytes(hashedId.toString());
        return Base64.encodeBase64String(bytes, false);
    }

    public static Long uuidToId(String hash) {

        if (hash == null) {
            return null;
        }
        byte[] bytes = Base64.decodeBase64(hash);
        String fromBytes = bytesToString(bytes);
        Long hashedId = Long.parseLong(fromBytes);
        return reversibleHash(hashedId);
    }

    private static long reversibleHash(long id) {

        return ((0x0000FFFF & id) << 16) + ((0xFFFF0000 & id) >> 16);
    }

    private static byte[] stringToBytes(String str) {

        char[] buffer = str.toCharArray();
        byte[] bytes = new byte[buffer.length << 1];
        CharBuffer cBuffer = ByteBuffer.wrap(bytes).asCharBuffer();
        for (char aBuffer : buffer) {
            cBuffer.put(aBuffer);
        }
        return bytes;
    }

    private static String bytesToString(byte[] bytes) {

        return ByteBuffer.wrap(bytes).asCharBuffer().toString();
    }

}

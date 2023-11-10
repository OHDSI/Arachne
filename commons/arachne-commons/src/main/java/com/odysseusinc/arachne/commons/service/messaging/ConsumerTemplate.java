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
 * Created: July 11, 2017
 *
 */

package com.odysseusinc.arachne.commons.service.messaging;

import javax.jms.Destination;
import javax.jms.JMSException;
import javax.jms.MessageConsumer;
import javax.jms.ObjectMessage;
import javax.jms.Session;
import org.springframework.jms.core.SessionCallback;
import org.springframework.jms.support.JmsUtils;
import org.springframework.jms.support.destination.DestinationResolver;

public class ConsumerTemplate implements SessionCallback<ObjectMessage> {

    private final DestinationResolver destinationResolver;

    private final String queue;
    private final Long responseTimeout;
    private final String correlationId;

    public ConsumerTemplate(DestinationResolver destinationResolver, String queue, Long responseTimeout) {

        this(destinationResolver, queue, responseTimeout, null);
    }

    public ConsumerTemplate(DestinationResolver destinationResolver, String queue, Long responseTimeout, String correlationId) {

        this.destinationResolver = destinationResolver;
        this.queue = queue;
        this.responseTimeout = responseTimeout;
        this.correlationId = correlationId;
    }

    public ObjectMessage doInJms(final Session session) throws JMSException {

        MessageConsumer consumer = null;

        try {
            final Destination queueDestination =
                    destinationResolver.resolveDestinationName(session, queue, false);
            String filter = null;
            if (correlationId != null) {
                filter = "JMSCorrelationID = '" + correlationId + "'";
            }
            consumer = session.createConsumer(queueDestination, filter);
            return (ObjectMessage) consumer.receive(responseTimeout);
        } finally {
            JmsUtils.closeMessageConsumer(consumer);
        }
    }
}

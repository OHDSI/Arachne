/*
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
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

import static com.odysseusinc.arachne.commons.service.messaging.MessagingUtils.generateCorrelationId;

import java.io.Serializable;
import javax.jms.DeliveryMode;
import javax.jms.Destination;
import javax.jms.JMSException;
import javax.jms.MessageConsumer;
import javax.jms.MessageProducer;
import javax.jms.ObjectMessage;
import javax.jms.Session;
import org.springframework.jms.core.SessionCallback;
import org.springframework.jms.support.JmsUtils;
import org.springframework.jms.support.destination.DestinationResolver;

public class ProducerConsumerTemplate implements SessionCallback<ObjectMessage> {

    private static int MESSAGE_PRIORITY = 1;
    private final DestinationResolver destinationResolver;

    private final Serializable message;
    private final String queueBase;
    private final Long responseTimeout;
    private Long timeToLive = 0L;

    public ProducerConsumerTemplate(DestinationResolver destinationResolver, Serializable message, String queueBase, Long responseTimeout) {

        this(destinationResolver, message, queueBase, responseTimeout, 0L);
    }

    public ProducerConsumerTemplate(
            DestinationResolver destinationResolver,
            Serializable message,
            String queueBase,
            Long responseTimeout,
            Long timeToLive) {

        this.destinationResolver = destinationResolver;
        this.message = message;
        this.queueBase = queueBase;
        this.responseTimeout = responseTimeout;
        this.timeToLive = timeToLive;
    }

    public void setTimeToLive(Long timeToLive) {

        this.timeToLive = timeToLive;
    }

    public ObjectMessage doInJms(final Session session) throws JMSException {

        MessageConsumer consumer = null;
        MessageProducer producer = null;

        try {
            final String correlationId = generateCorrelationId();
            final Destination requestQueue =
                    destinationResolver.resolveDestinationName(session, MessagingUtils.getRequestQueueName(queueBase), false);
            final Destination replyQueue =
                    destinationResolver.resolveDestinationName(session, MessagingUtils.getResponseQueueName(queueBase), false);
            // Create the consumer first
            consumer = session.createConsumer(replyQueue, "JMSCorrelationID = '" + correlationId + "'");
            final ObjectMessage jmsMessage = session.createObjectMessage(message);
            jmsMessage.setJMSCorrelationID(correlationId);
            jmsMessage.setJMSReplyTo(replyQueue);
            // Send the request second
            producer = session.createProducer(requestQueue);
            producer.send(jmsMessage, DeliveryMode.PERSISTENT, MESSAGE_PRIORITY, timeToLive);
            // Block on receiving the response with a timeout
            return (ObjectMessage) consumer.receive(responseTimeout);
        } finally {
            JmsUtils.closeMessageConsumer(consumer);
            JmsUtils.closeMessageProducer(producer);
        }
    }

}

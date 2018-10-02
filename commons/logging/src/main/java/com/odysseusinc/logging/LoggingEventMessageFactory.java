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
 * Authors: Anastasiia Klochkova
 * Created: August 28, 2018
 *
 */

package com.odysseusinc.logging;

import com.odysseusinc.logging.event.*;

import java.util.Arrays;
import java.util.List;
import java.util.function.BiFunction;
import java.util.function.Supplier;

public class LoggingEventMessageFactory {

    private final static List<Class> supportedEvents = Arrays.asList(
            AddDataSourceEvent.class,
            AddPermissionEvent.class,
            AddRoleEvent.class,
            AddUserEvent.class,
            AssignRoleEvent.class,
            ChangeDataSourceEvent.class,
            ChangeRoleEvent.class,
            DeleteDataSourceEvent.class,
            DeletePermissionEvent.class,
            DeleteRoleEvent.class,
            DeleteUserEvent.class,
            FailedDbConnectEvent.class,
            FailedLogoffEvent.class,
            FailedLogonEvent.class,
            LockoutStartEvent.class,
            LockoutStopEvent.class,
            SuccessLogoffEvent.class,
            SuccessLogonEvent.class,
            UnassignRoleEvent.class);

    private BiFunction<String, Supplier<Object[]>, String> format = (t, e) -> String.format(t, e.get());

    public String getMessage(LoggingEvent event) {

        String message = "";

        if (event instanceof AddDataSourceEvent) {
            message = dataSourceAdded((AddDataSourceEvent) event);
        } else if (event instanceof AddPermissionEvent) {
            message = permissionAdded((AddPermissionEvent) event);
        } else if (event instanceof AddRoleEvent) {
            message = roleAdded((AddRoleEvent) event);
        } else if (event instanceof AddUserEvent) {
            message = userAdded((AddUserEvent) event);
        } else if (event instanceof AssignRoleEvent) {
            message = roleAssigned((AssignRoleEvent) event);
        } else if (event instanceof ChangeDataSourceEvent) {
            message = dataSourceChanged((ChangeDataSourceEvent) event);
        } else if (event instanceof ChangeRoleEvent) {
            message = roleChanged((ChangeRoleEvent) event);
        } else if (event instanceof DeleteDataSourceEvent) {
            message = dataSourceDeleted((DeleteDataSourceEvent) event);
        } else if (event instanceof DeletePermissionEvent) {
            message = permissionDeleted((DeletePermissionEvent) event);
        } else if (event instanceof DeleteRoleEvent) {
            message = roleDeleted((DeleteRoleEvent) event);
        } else if (event instanceof DeleteUserEvent) {
            message = userDeleted((DeleteUserEvent) event);
        } else if (event instanceof FailedDbConnectEvent) {
            message = ((FailedDbConnectEvent) event).getException();
        } else if (event instanceof FailedLogoffEvent) {
            message = logoffFailed((FailedLogoffEvent) event);
        } else if (event instanceof FailedLogonEvent) {
            message = logonFailed((FailedLogonEvent) event);
        } else if (event instanceof LockoutStartEvent) {
            message = lockoutStarted((LockoutStartEvent) event);
        } else if (event instanceof LockoutStopEvent) {
            message = lockoutStopped((LockoutStopEvent) event);
        } else if (event instanceof SuccessLogoffEvent) {
            message = logoffSucceded((SuccessLogoffEvent) event);
        } else if (event instanceof SuccessLogonEvent) {
            message = logonSucceeded((SuccessLogonEvent) event);
        } else if (event instanceof UnassignRoleEvent) {
            message = roleUnassigned((UnassignRoleEvent) event);
        }
        return message;
    }

    private String roleUnassigned(UnassignRoleEvent event) {
        return format.apply("Role id = %d was unassigned from user id = %d", () -> new Object[]{event.getRoleId(), event.getUserId()});
    }

    private String logonSucceeded(SuccessLogonEvent event) {
        return format.apply("User login = %s was logged in", () -> new Object[]{event.getLogin()});
    }

    private String logoffSucceded(SuccessLogoffEvent event) {
        return format.apply("User login = %s was logged off", () -> new Object[]{event.getLogin()});
    }

    private String lockoutStopped(LockoutStopEvent event) {
        return format.apply("Lockout stopped for user login = %s", () -> new Object[]{event.getLogin()});
    }

    private String lockoutStarted(LockoutStartEvent event) {
        return format.apply("Lockout started for user login = %s", () -> new Object[]{event.getLogin()});
    }

    private String logonFailed(FailedLogonEvent event) {
        return format.apply("Logon failed for user login = %s", () -> new Object[]{event.getLogin()});
    }

    private String logoffFailed(FailedLogoffEvent event) {
        return format.apply("Logoff failed for user login = %s", () -> new Object[]{event.getLogin()});
    }

    private String userDeleted(DeleteUserEvent event) {
        return format.apply("User id = %d, login = %s was deleted", () -> new Object[]{event.getId(), event.getLogin()});
    }

    private String roleDeleted(DeleteRoleEvent event) {
        return format.apply("Role id = %d was deleted", () -> new Object[]{event.getId()});
    }

    private String permissionDeleted(DeletePermissionEvent event) {
        return format.apply("Permission id = %d was removed from role id = %d", () -> new Object[]{event.getPermissionId(), event.getRoleId()});
    }

    private String dataSourceDeleted(DeleteDataSourceEvent event) {
        return format.apply("Data source id = %d, name = %s was deleted", () -> new Object[]{event.getId(), event.getName()});
    }

    private String roleChanged(ChangeRoleEvent event) {
        return format.apply("Role id = %d, name = %s was changed", () -> new Object[]{event.getId(), event.getName()});
    }

    private String dataSourceChanged(ChangeDataSourceEvent event) {
        return format.apply("Data source id = %d, name = %s was changed", () -> new Object[]{event.getId(), event.getName()});
    }

    private String roleAssigned(AssignRoleEvent event) {
        return format.apply("Role id = %d was assigned to user id = %d", () -> new Object[]{event.getRoleId(), event.getUserId()});
    }

    private String userAdded(AddUserEvent event) {
        return format.apply("User id = %d, login = %s was created", () -> new Object[]{event.getId(), event.getLogin()});
    }

    private String roleAdded(AddRoleEvent event) {
        return format.apply("Role id = %d, name = %s was created", () -> new Object[]{event.getId(), event.getName()});
    }

    private String dataSourceAdded(AddDataSourceEvent event) {
        return format.apply("Data source id = %d, name = %s was created", () -> new Object[]{event.getId(), event.getName()});
    }

    private String permissionAdded(AddPermissionEvent event) {
        return format.apply("Permission id = %d was added to role id = %d", () -> new Object[]{event.getPermissionId(), event.getRoleId()});
    }

    public List<Class> getSupportedEventTypes() {
        return supportedEvents;
    }
}

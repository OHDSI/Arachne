/*
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
 * Authors: Anton Gackovka
 * Created: August 7, 2018
 */

package com.odysseusinc.arachne.commons.config.flyway;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Map;
import org.flywaydb.core.api.FlywayException;
import org.flywaydb.core.api.MigrationType;
import org.flywaydb.core.api.MigrationVersion;
import org.flywaydb.core.api.migration.MigrationChecksumProvider;
import org.flywaydb.core.api.migration.MigrationInfoProvider;
import org.flywaydb.core.api.migration.spring.SpringJdbcMigration;
import org.flywaydb.core.api.resolver.MigrationResolver;
import org.flywaydb.core.api.resolver.ResolvedMigration;
import org.flywaydb.core.internal.resolver.MigrationInfoHelper;
import org.flywaydb.core.internal.resolver.ResolvedMigrationComparator;
import org.flywaydb.core.internal.resolver.ResolvedMigrationImpl;
import org.flywaydb.core.internal.util.ClassUtils;
import org.flywaydb.core.internal.util.Pair;
import org.flywaydb.core.internal.util.StringUtils;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.context.ApplicationContext;

/**
 * Migration resolver for {@link ApplicationContextAwareSpringMigration}s which are registered in the given {@link ApplicationContext}.
 * This resolver provides the ability to use other beans registered in the {@link ApplicationContext} and reference
 * them via Spring's dependency injection facility inside the {@link SpringJdbcMigration}s.
 */
public class ApplicationContextAwareSpringJdbcMigrationResolver implements MigrationResolver {

    private final ApplicationContext applicationContext;

    /**
     * Creates a new instance.
     *
     * @param applicationContext The Spring application context to load the {@link SpringJdbcMigration}s from.
     */
    public ApplicationContextAwareSpringJdbcMigrationResolver(ApplicationContext applicationContext) {

        this.applicationContext = applicationContext;
    }

    @SuppressWarnings("unchecked")
    @Override
    public Collection<ResolvedMigration> resolveMigrations() {

        String[] springJdbcMigrationBeanNames = this.applicationContext.getBeanNamesForType(ApplicationContextAwareSpringMigration.class);

        ArrayList<ResolvedMigration> resolvedMigrations = new ArrayList<ResolvedMigration>();
        // resolve the migration and populate it with the migration info
        for (String springJdbcMigrationBeanName : springJdbcMigrationBeanNames) {
            BeanDefinition beanDefinition = ((BeanDefinitionRegistry) this.applicationContext).getBeanDefinition(springJdbcMigrationBeanName);

            ResolvedMigrationImpl resolvedMigration = extractMigrationInfo(beanDefinition);
            resolvedMigration.setExecutor(new ApplicationContextAwareSpringJdbcMigrationExecutor(this.applicationContext, springJdbcMigrationBeanName));

            resolvedMigrations.add(resolvedMigration);
        }

        Collections.sort(resolvedMigrations, new ResolvedMigrationComparator());
        return resolvedMigrations;
    }

    /**
     * Extracts the migration info from this migration.
     *
     * @param springJdbcMigration The migration to analyse.
     * @return The migration info.
     */
    ResolvedMigrationImpl extractMigrationInfo(BeanDefinition springJdbcMigration) {

        Integer checksum = null;
        if (springJdbcMigration instanceof MigrationChecksumProvider) {
            MigrationChecksumProvider checksumProvider = (MigrationChecksumProvider) springJdbcMigration;
            checksum = checksumProvider.getChecksum();
        }

        MigrationVersion version;
        String description;
        if (springJdbcMigration instanceof MigrationInfoProvider) {
            MigrationInfoProvider infoProvider = (MigrationInfoProvider) springJdbcMigration;
            version = infoProvider.getVersion();
            description = infoProvider.getDescription();
            if (!StringUtils.hasText(description)) {
                throw new FlywayException("Missing description for migration " + version);
            }
        } else {
            Class<?> beanClass;
            try {
                beanClass = Class.forName(springJdbcMigration.getBeanClassName());
            } catch (ClassNotFoundException e) {
                throw new FlywayException("Cannot find bean by class name : " + springJdbcMigration.getBeanClassName());
            }
            String shortName = ClassUtils.getShortName(beanClass);
            String prefix;
            boolean repeatable = shortName.startsWith("R");
            if (shortName.startsWith("V") || repeatable) {
                prefix = shortName.substring(0, 1);
            } else {
                throw new FlywayException("Invalid Spring migration class name: " + springJdbcMigration.getClass().getName()
                        + " => ensure it starts with V or R," +
                        " or implement org.flywaydb.core.api.migration.MigrationInfoProvider for non-default naming");
            }
            Pair<MigrationVersion, String> info = MigrationInfoHelper.extractVersionAndDescription(shortName, prefix, "__", "", repeatable);
            version = info.getLeft();
            description = info.getRight();
        }

        ResolvedMigrationImpl resolvedMigration = new ResolvedMigrationImpl();
        resolvedMigration.setVersion(version);
        resolvedMigration.setDescription(description);
        resolvedMigration.setScript(springJdbcMigration.getClass().getName());
        resolvedMigration.setChecksum(checksum);
        resolvedMigration.setType(MigrationType.SPRING_JDBC);
        return resolvedMigration;
    }
}
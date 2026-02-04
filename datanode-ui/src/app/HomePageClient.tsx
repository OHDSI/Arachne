/*
 * Copyright 2023 Odysseus Data Services, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * See the License for the specific language governing permissions and limitations.
 */

"use client";

import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { SpinnerWidgetContainer } from "../libs/components";
import { PrivateRoute } from "../components";
import { StudyRepositoryApp } from "../studyRepository/StudyRepositoryApp";
import { LayoutSpinner } from "../App.styled";

export default function HomePageClient() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  if (isLoading) {
    return (
      <SpinnerWidgetContainer>
        <LayoutSpinner size={70} />
      </SpinnerWidgetContainer>
    );
  }

  return (
    <Routes>
      <Route path="/*" element={<PrivateRoute />}>
        <Route path="*" element={<StudyRepositoryApp />} />
      </Route>
    </Routes>
  );
}

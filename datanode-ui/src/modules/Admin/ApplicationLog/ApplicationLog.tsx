import React, {useEffect} from "react";
import {Grid, Paper} from "@mui/material";
import {useTranslation} from "react-i18next";
import {CodeEditor} from "../../../libs/components";
import {useDispatch} from "react-redux";
import {setBreadcrumbs} from "../../../store/modules";
import {useApplicationLog} from "../../../libs/hooks";

export const ApplicationLog: React.FC = () => {
    const {logs, loading, error} = useApplicationLog();
    const dispatch = useDispatch();
    const {t} = useTranslation();

    useEffect(() => {
        dispatch(
            setBreadcrumbs([
                {
                    name: t("breadcrumbs.admin"),
                    path: "/administration",
                },
                {
                    name: t("breadcrumbs.application_log"),
                    path: "/application-log",
                },
            ])
        );
    }, [dispatch, t]);

    return (
        <Paper elevation={0} sx={{p: 2, width:'100%'}}>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div>{error}</div>
            ) : logs ? (
                <CodeEditor
                    data={logs || ""}
                    height={"73vh"}
                    containerStyles={{padding: 0}}
                    enableDownload={true}
                    enableCopy
                    readOnly
                    consoleMode
                />
            ) : (
                <Grid item xs={12}>
                    <div>No available logs</div>
                </Grid>
            )}
        </Paper>
    );
};
import { useState, useEffect } from 'react';
import { getApplicationLog } from "../../../api/admin";
import { useInterval } from '../useInterval';

export const useApplicationLog = () => {
    const [logs, setLogs] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLogs = async () => {
        try {
            const response = await getApplicationLog();
            setLogs(response);
            setError(null);
        } catch (err) {
            setError('Error fetching logs');
        } finally {
            setLoading(false);
        }
    };

    useInterval(() => {
        fetchLogs();
    }, 10000);

    useEffect(() => {
        fetchLogs();
    }, []);

    return { logs, loading, error };
};


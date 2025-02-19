import { getAuthOptions } from "../../api/auth";
import { Status } from "../../libs/enums";
import { AuthProviders } from '../../libs/types/api';
import { useEffect, useState } from 'react';

export const useLoginOptions = () => {
  const [state, setState] = useState<AuthProviders>({});
  const [status, setStatus] = useState(Status.INITIAL);

  const getOptions = async () => {
    setStatus(Status.IN_PROGRESS);
    try {
      const result = await getAuthOptions();
      setState(result);
      setStatus(Status.SUCCESS);
    } catch (err) {
      console.error(err);
      setStatus(Status.ERROR);
    }
  };

  useEffect(() => {
    getOptions();
  }, []);
  return {
    loginOptions: state,
    status,
    getLoginOptions: getOptions,
  };
};

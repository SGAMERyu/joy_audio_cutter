import { ref, reactive, toRefs } from "@vue/composition-api";

interface ApiProps {
  url: string;
  manual?: boolean;
  onSuccess?: (val: Response) => void;
  onError?: (val: any) => void;
}

interface ResultProps {
  loading: boolean;
  data: any;
  error: any;
}

const defaultApiProps = {
  manual: true
};

export default function useApi(props: ApiProps) {
  const { url, onSuccess, onError } = Object.assign(defaultApiProps, props);
  const state = reactive<ResultProps>({
    loading: true,
    data: null,
    error: null
  });
  async function run() {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("network is not ok");
      state.data = res;
      state.loading = false;
      if (onSuccess) onSuccess(state.data);
    } catch (error) {
      state.error = error;
      if (onError) onError(state.error);
    }
  }
  return {
    state: toRefs(state),
    run
  };
}

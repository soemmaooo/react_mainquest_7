import { createAsyncMessage } from '../slice/messageSlice';
import { useDispatch } from 'react-redux';
function useMessage() {
  const dispatch = useDispatch();
  const showSuccess = (message) => {
    dispatch(
      createAsyncMessage({
        success: true,
        message: message,
      }),
    );
  };
  const showError = (message) => {
    dispatch(
      createAsyncMessage({
        success: false,
        message: message,
      }),
    );
  };
  return {
    showError,
    showSuccess,
  };
}

export default useMessage;

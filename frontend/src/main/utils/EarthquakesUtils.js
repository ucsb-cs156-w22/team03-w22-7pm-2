import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export function onDeleteSuccess(message) {
  console.log(message);
  toast(message);
}

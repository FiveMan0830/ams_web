import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

export default styled(Button)({
  border: '2px solid #8FC6E9',
  color: '#8FC6E9',
  fontSize: '1.05rem',
  '&:hover': {
    color: '#2d4654',
    backgroundColor: '#8FC6E9',
    border: '2px solid #6389A1',
  },
})
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';

export default styled(Link)({
  color: 'inherit',
  'textDecoration': 'none',
  '&:focus, &:hover, &:visited, &:link, &:active': {
    'textDecoration': 'none'
  }
})
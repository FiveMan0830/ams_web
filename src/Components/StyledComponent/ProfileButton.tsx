import { Button } from '@mui/material'
import { styled } from '@mui/material/styles'

export default styled(Button)({
  background: 'rgb(126, 148, 0)',
  color: 'white',
  '&:hover': {
    background: 'rgb(84, 99, 0)'
  }
})
import { IconButton } from '@mui/material';
import { AddOutlined } from '@mui/icons-material';

import { UsersLayout } from '../layout/UsersLayout';
import { UsersSelectedView } from '../views';

export const UsersPage = () => {
  return (
    <UsersLayout>
      
      {/* <Typography>Sint id officia amet velit do aliqua aliqua est ea velit minim voluptate duis laboris. Esse esse consectetur ullamco excepteur ullamco amet. Mollit est nostrud nisi irure magna dolor eiusmod aliquip aliqua nostrud incididunt enim. Velit ipsum laborum Lorem anim laboris aute ullamco ipsum do adipisicing irure.</Typography> */}

      <UsersSelectedView />
      {/* <NoteView /> */}


    </UsersLayout>
  )
}

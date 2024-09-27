import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { useTypeContext } from '../context/TypeContext';
export default function MenuPopupState() {


  const {type,setType} = useTypeContext();


  const selectUserType = (type, popupState) => {
      setType(type);
      popupState.close();
  }

  return (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <>
          <Button style={{marginBottom: '10px'}} variant="contained" {...bindTrigger(popupState)}>
            {type}
          </Button>
          <Menu {...bindMenu(popupState)}>
            <MenuItem onClick={() => selectUserType('Tourist', popupState)}>Tourist</MenuItem>
            <MenuItem onClick={() => selectUserType('Guide', popupState)}>Guide</MenuItem>
            <MenuItem onClick={() => selectUserType('Seller', popupState)}>Seller</MenuItem>
            <MenuItem onClick={() => selectUserType('Advertiser', popupState)}>Advertiser</MenuItem>
          </Menu>
        </>
      )}
    </PopupState>
  );
}

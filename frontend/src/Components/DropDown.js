import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import newType from "../App.js";
import FormSection from './FormSection.js';
export default function MenuPopupState() {
  return (
    <PopupState variant ="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <React.Fragment>
          <Button variant="contained" style={{marginBottom:"15px"}} {...bindTrigger(popupState)}>
            Sign Up As
          </Button>
          <Menu  {...bindMenu(popupState)}>
            <MenuItem onClick={signUpDisplay("Tourist",popupState)}>Tourist</MenuItem>
            <MenuItem onClick={signUpDisplay("Tour Guide",popupState)}>Tour Guide</MenuItem>
            <MenuItem onClick={signUpDisplay("Advertiser",popupState)}>Advertiser</MenuItem>
            <MenuItem onClick={signUpDisplay("Seller",popupState)}>Seller</MenuItem>
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  );
}

function signUpDisplay(type , popupState)
{
popupState.close();
return FormSection(type);

  
  
  

}

'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { nunito } from '@/libs/fonts';

export default function DropdownMenu({
  buttonComponent, // Custom button component
  menuItems = [], // Array of menu items
  children,
  onModal = ''
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Use the custom button component if provided, otherwise default to Dashboard button
  const renderButton = buttonComponent || (
    <Button
      id="basic-button"
      aria-controls={open ? 'basic-menu' : undefined}
      aria-haspopup="true"
      aria-expanded={open ? 'true' : undefined}
      onClick={handleClick}
    >
      Dashboard
    </Button>
  );

  return (
    <div>
      {React.cloneElement(renderButton, { onClick: handleClick })}

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        disablePortal={true}

      >
        <div className="px-4">
            {children}
        </div>
        {children ? <hr className='my-2' /> : ''}
        {menuItems.map((item, index) => (
          <MenuItem className={`${nunito.className}`} key={index} onClick={() => {
            handleClose();
            item.onClick?.();
          }}>
            <div className={`flex items-center ${item.className}`}>
              {item.icon && (
                <span className="mr-2">
                  {item.icon}
                </span>
              )}
              <div>
                <p className={`${nunito.className} text-sm`}>
                  {item.label}
                </p>
                {item.sublabel && (
                  <p className={`${nunito.className} text-xs font-light`}>
                    {item.sublabel}
                  </p>
                )}
              </div>
            </div>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
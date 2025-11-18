import React from 'react';
import { Avatar } from '@mui/material';

const UserAvatar = ({ 
  firstName, 
  lastName, 
  size = 40, 
  src = null,
  sx = {}
}) => {
  const getInitials = () => {
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return `${first}${last}`;
  };

  return (
    <Avatar
      src={src}
      sx={{
        width: size,
        height: size,
        backgroundColor: '#667eea',
        fontSize: size * 0.4,
        fontWeight: 600,
        ...sx
      }}
    >
      {getInitials()}
    </Avatar>
  );
};

export default UserAvatar;
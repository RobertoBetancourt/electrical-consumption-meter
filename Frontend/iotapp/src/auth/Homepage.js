import React from 'react';
import PropTypes from 'prop-types';
import Profile from '../components/Profile';

export default function Homepage() {
  let user = { id: 1, type:1 }
  
    return (
      <div>
         <Profile user_id={"1"} />
      </div>
  
    );
  }
  
  Homepage.propTypes = {
      user: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }),
    };
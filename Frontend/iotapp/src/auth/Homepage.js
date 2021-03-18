import React from 'react';
import PropTypes from 'prop-types';
import Profile from '../components/Profile';

export default function Homepage({ user: { id, type } }) {

  
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
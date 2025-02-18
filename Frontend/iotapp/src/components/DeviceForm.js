import React from "react";
import PropTypes from "prop-types";
import DeviceFormName from "./DeviceFormName";
import DeviceFormType from "./DeviceFormType";

export default function DeviceForm({ device_id, device_name, device_type }) {
  return (
    <div className="device-complete-form">
      <DeviceFormName />
      <DeviceFormType />
    </div>
  );
}

DeviceForm.propTypes = {
  deviceForm: PropTypes.shape({
    device_id: PropTypes.string,
    device_name: PropTypes.string,
    device_type: PropTypes.string,
    state: PropTypes.string.isRequired,
  }),
  modify: PropTypes.func,
  deletee: PropTypes.func,
};

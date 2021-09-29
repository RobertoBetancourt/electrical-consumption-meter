import React from "react";
import { storiesOf } from "@storybook/react";

import DeviceFormType from "./DeviceFormType";

export const actions = {};

storiesOf("Form add: Type", module).add("default", () => <DeviceFormType />);

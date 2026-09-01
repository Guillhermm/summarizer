export type ConfigForm = {
  submit: {
    label: string;
  };
  validation: {
    apiChecking: string;
    apiInvalid: string;
    apiUnreachable: string;
    apiValid: string;
    empty: string;
    minNumber: string;
  };
};

export type ConfigFormOption = {
  label: string;
  placeholder?: string;
  text?: string;
  textHelper?: string;
  type: string;
};

export type ConfigOptions = {
  apiKey: ConfigFormOption;
};

export type ConfigModal = {
  name: string;
};

export type ConfigPopup = {
  name: string;
  toggle: {
    label: string;
  };
  action: {
    label: string;
  };
};

export type ConfigForm = {
  submit: {
    label: string;
  };
  validation: {
    apiInvalid: string;
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
  maxLength: ConfigFormOption;
  minChars: ConfigFormOption;
  minWords: ConfigFormOption;
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

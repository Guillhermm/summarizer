export type ConfigForm = {
  validation: {
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

export type ConfigPopup = {
  name: string;
  toggle: {
    label: string;
  };
  action: {
    label: string;
  };
};

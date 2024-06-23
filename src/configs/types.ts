export type ConfigFormOption = {
  label: string;
  placeholder?: string;
  text?: string;
  type: string;
};

export type ConfigOptions = {
  apiKey: ConfigFormOption;
  maxLength: ConfigFormOption;
  minChars: ConfigFormOption;
  minWords: ConfigFormOption;
  validation: {
    empty: string;
  };
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

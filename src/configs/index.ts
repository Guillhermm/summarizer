import form from './form.json';
import options from './options.json';
import popup from './popup.json';
import { ConfigForm, ConfigOptions, ConfigPopup } from './types';

export const configs: {
  form: ConfigForm;
  options: ConfigOptions;
  popup: ConfigPopup;
} = {
  form,
  options,
  popup,
};

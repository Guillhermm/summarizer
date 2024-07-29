import form from './form.json';
import modal from './modal.json';
import options from './options.json';
import popup from './popup.json';
import { ConfigForm, ConfigModal, ConfigOptions, ConfigPopup } from './types';

export const configs: {
  form: ConfigForm;
  modal: ConfigModal;
  options: ConfigOptions;
  popup: ConfigPopup;
} = {
  form,
  modal,
  options,
  popup,
};

import Vue from 'vue'
import BreadCrumb from '@components/BreadCrumb';
import VeeCheckbox from '@components/VeeCheckbox';
import VeeRadio from '@components/VeeRadio';
import VeeInput from '@components/VeeInput';
import VeeSelect from '@components/VeeSelect';
import VeeDatePicker from '@components/VeeDatePicker';
import MyMessage from '@components/MyMessage/index.js';

Vue.prototype.$MyMessageBox = MyMessage.install;//用到引用

export default {
  install (Vue) {
    Vue.component('bread-crumb', BreadCrumb);
    Vue.component('vee-checkbox', VeeCheckbox);
    Vue.component('vee-input', VeeInput);
    Vue.component('vee-select', VeeSelect);
    Vue.component('vee-radio', VeeRadio);
    Vue.component('vee-date-picker', VeeDatePicker);
  }
}
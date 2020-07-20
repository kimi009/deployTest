<template>
  <ValidationProvider :vid="vid" :name="$attrs.errorMessage?$attrs.errorMessage:$attrs.label" :rules="rules" v-slot="{ errors }">
    <el-form-item :error="errors[0]" :label="$attrs.label+''" :rules="[{ required: $attrs.require}]">
      <el-input 
        v-bind="$attrs" 
        :type="!showPassword?'password':'text'" 
        :style="{width: $attrs.innerWidth || ''}"
        @blur="veeBlurEvent($event)"
        v-model="innerValue"
      >
        <i 
          slot="suffix" 
          @click="showHideEyeIcon" 
          :class="showPassword?'el-input__icon iconfont icon-view pwd-icon':'el-input__icon iconfont icon-view-off pwd-icon'"
        ></i>
      </el-input>
      <slot name="innerAfter"></slot>
    </el-form-item>
  </ValidationProvider>
</template>

<script>
  import {ValidationProvider} from "vee-validate";

  export default {
    components: {
      ValidationProvider
    },
    props: {
      vid: {
        type: String
      },
      trimDisable: {
        type: Boolean,
        default: () => true
      },
      rules: {
        type: [Object, String],
        default: ""
      },
      // must be included in props
      value: {
        type: null
      }
    },
    data: () => ({
      innerValue: "",
      showPassword:false,
    }),
    watch: {
      // Handles internal model changes.
      innerValue(newVal) {
        this.$emit("input", newVal);
      },
      // Handles external model changes.
      value(newVal) {
        this.innerValue = newVal;
      }
    },
    created() {
      if (this.value) {
        this.innerValue = this.value;
      }
    },
    methods: {
      veeBlurEvent(event) {
        if (this.trimDisable && this.innerValue) {
          this.innerValue = this.innerValue.toString().trim();
        }
      },
      showHideEyeIcon() {
        console.log('this.showPassword is '+this.showPassword);
        this.showPassword = !this.showPassword;
        return false
      }
    }
  };
</script>
<style lang="scss">
.pwd-icon{
  color:#6D7383;
}
</style>



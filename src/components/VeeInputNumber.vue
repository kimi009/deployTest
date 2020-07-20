<template>
  <ValidationProvider :vid="vid" :name="$attrs.label" :rules="newRules" v-slot="{ errors }">
    <el-form-item
      :error="errors[0]"
      :label="$attrs.label+''"
      :rules="[{ required: $attrs.require}]"
      class="input-number-form-item"
    >
      <el-input-number v-bind="$attrs" v-model="innerValue"></el-input-number>
    </el-form-item>
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from "vee-validate";
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
      type: String,
      default: ""
    },
    value: {
      type: Number,
      default: () => 1
    },
    min: {
      type: Number,
      default: () => 1
    },
    max: {
      type: Number,
      default: () => 100
    }
  },
  data() {
    return {
      newRules: null,
      innerValue: 0
    };
  },
  watch: {
    innerValue(newVal) {
      setTimeout(() => {
        try {
          let cur = Number(newVal);
          if (cur < this.min) {
            this.innerValue = this.min;
          } else if (cur > this.max) {
            this.innerValue = this.max;
          }
        } catch (error) {
          this.innerValue = this.min;
        }
      }, 850);
      this.$emit("input", newVal);
    },
    value(newVal) {
      this.innerValue = newVal;
    }
  },
  created() {
    let dm = `decimalLeval:${this.min},${this.max}`;
    this.newRules = this.rules ? `${this.rules}|${dm}` : `${dm}`;
    if (this.value) {
      this.innerValue = this.value;
    }
  }
};
</script>


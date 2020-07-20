import workerOrderApi from "@workerOrder/manager/services";

/**
 * 紧急度枚举值
 */
export const EmergencyEnum = {
  data() {
    return {
      /**
       * 紧急度
       */
      emergencyEnumList: Object.freeze([])
    };
  },
  created() {
    this.queryEemergency();
  },
  methods: {
    async queryEemergency() {
      let { result, obj } = await workerOrderApi.queryEmergency();
      if (result) {
        this.emergencyEnumList = obj.map(item => {
          return {
            code: item.emergencyCode,
            name: item.emergencyName
          };
        });
      }
    }
  }
};

/**
 * 优先级枚举值
 */
export const PriorityEnum = {
  data() {
    return {
      /**
       * 优先级
       */
      priorityEnumList: Object.freeze([])
    };
  },
  created() {
    this.queryPriorityList();
  },
  methods: {
    async queryPriorityList() {
      let { result, obj } = await workerOrderApi.queryPriorityList();
      if (result) {
        this.priorityEnumList = obj.map(item => {
          return {
            code: item.priorityCode,
            name: item.priorityName
          };
        });
      }
    }
  }
};
/**
 * sla指标
 */
export const SlaEnum = {
  data() {
    return {
      /**
       * sla指标
       */
      slaEnumList: [
        {
          code: "0",
          name: "响应时长"
        },
        {
          code: "1",
          name: "解决时长"
        }
      ]
    };
  }
};
/**
 * 问题分类
 */
export const ProductIssueEnum = {
  data() {
    return {
      /**
       * 问题分类
       */
      issueCategoryEnumList: Object.freeze([]),
      /**
       * 产品分类
       */
      productCategoryEnum: Object.freeze([])
    };
  },
  created() {
    this.queryIssueCategory();
  },
  methods: {
    async queryIssueCategory() {
      let { result, obj } = await workerOrderApi.getServerCategoryTree();
      if (result && obj) {
        let temp = obj[0].children;
        this.productCategoryEnum = temp.map(item => {
          return {
            code: item.serviceTypeCode,
            name: item.serviceTypeName
          };
        });
        let issueArr = [];
        temp.forEach(item => {
          issueArr = [...issueArr, ...item.children];
        });
        issueArr = issueArr.map(item => {
          return {
            code: item.serviceTypeCode,
            name: item.serviceTypeName
          };
        });
        this.issueCategoryEnumList = issueArr;
      }
    }
  }
};

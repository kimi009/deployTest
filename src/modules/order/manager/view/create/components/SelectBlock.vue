<template>
    <div>
        <div class="page-content-box"  >
            <div @click="choice(i,index)" :class="(clickChoice==index?'type-list-choice':'content-box-type-list')" v-for="(i,index) in typeData" :key="index">
                {{i.serviceTypeName}}
                <table-button v-if="clickChoice==index" :content='content' :icon-class="iconClass"></table-button>
            </div> 
            <no-data v-if="typeData.length===0"></no-data>
        </div>
    </div>
</template>

<script>
import TableButton   from "@components/TableButton"
import NoData   from "./NoData"
export default {
    components:{
        TableButton,
        NoData
    },
    props: {
        typeData:{
            type:Array
        },
        content:{
            type:String
        },
        iconClass:{
            type:String
        }
    },
    data() {
        return {
            title:"",
            clickChoice:undefined
        }
    },
    methods: {
        choice(i,index){
            this.$emit('passCode',i)
            this.clickChoice=index
        }
    },
}
</script>

<style lang='scss' scoped>
    .page-content-box{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        .content-box-type-list{
            width:270px;
            height:40px;
            background:rgba(244,247,252,1);
            margin-bottom: 20px;
            margin-right: 20px;
            font-size:12px;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(33,42,64,1);
            line-height: 40px;
            padding-left: 16px;
            padding-right: 16px;
            justify-content: space-between;
            display: flex;
            position: relative;
        }
        .type-list-choice{
            width:270px;
            height:40px;
            margin-bottom: 20px;
            margin-right: 20px;
            font-size:12px;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(33,42,64,1);
            line-height: 40px;
            padding-left: 16px;
            background:rgba(255,255,255,1);
            box-shadow:0px 2px 8px 0px rgba(33,76,217,0.2);
            position: relative;
            padding-right: 16px;
            justify-content: space-between;
            display: flex;
            border-left:4px solid #3369FF ;
        }
        
    }
</style>
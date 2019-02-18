<template>
  <div class="big-con">
    <div class="title">
      <p>香薰开关调节</p>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="week"
        label=" "
        align="center">
      </el-table-column>
      <el-table-column
        label="起始时间">
        <template slot-scope="scope">
          <el-time-picker
            :disabled="scope.row.canEdit"
            v-model="scope.row.start"
            :picker-options="{selectableRange: '00:00:00 - 23:59:59'}"
            placeholder="任意时间点">
          </el-time-picker>
        </template>
      </el-table-column>
      <el-table-column
        label="结束时间">
        <template slot-scope="scope">
          <el-time-picker
            :disabled="scope.row.canEdit"
            v-model="scope.row.end"
            :picker-options="{selectableRange: '00:00:00 - 23:59:59'}"
            placeholder="任意时间点">
          </el-time-picker>
        </template>
      </el-table-column>
      <el-table-column
        label="间隔时间">
        <template slot-scope="scope">
          <el-select v-model="scope.row.value1" placeholder="请选择" :disabled="scope.row.canEdit">
            <el-option
              v-for="item in options1"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        label="持续时间">
        <template slot-scope="scope">
          <el-select v-model="scope.row.value2" placeholder="请选择" :disabled="scope.row.canEdit">
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            v-show="scope.row.canEdit == true"
            size="mini"
            type="danger"
            @click="change(scope.$index, scope.row)">编辑
          </el-button>
          <el-button
            v-show="scope.row.canEdit == false"
            size="mini"
            type="success"
            @click="finish(scope.$index, scope.row)">完成
          </el-button>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
  export default {
    name: 'Index',
    data () {
      return {
        tableData: [
          {week: '周一', start: new Date(2016, 9, 10, 18, 40), end: new Date(2016, 9, 10, 18, 40),canEdit: true, value1:'', value2:''},
          {week: '周二', start: new Date(2016, 9, 10, 18, 40), end: new Date(2016, 9, 10, 18, 40),canEdit: true, value1:'', value2:''},
          {week: '周三', start: new Date(2016, 9, 10, 18, 40), end: new Date(2016, 9, 10, 18, 40),canEdit: true, value1:'', value2:''},
          {week: '周四', start: new Date(2016, 9, 10, 18, 40), end: new Date(2016, 9, 10, 18, 40),canEdit: true, value1:'', value2:''},
          {week: '周五', start: new Date(2016, 9, 10, 18, 40), end: new Date(2016, 9, 10, 18, 40),canEdit: true, value1:'', value2:''},
          {week: '周六', start: new Date(2016, 9, 10, 18, 40), end: new Date(2016, 9, 10, 18, 40),canEdit: true, value1:'', value2:''},
          {week: '周日', start: new Date(2016, 9, 10, 18, 40), end: new Date(2016, 9, 10, 18, 40),canEdit: true, value1:'', value2:''},
        ],
        options1: [{
          value: '选项1',
          label: '40s'
        }, {
          value: '选项2',
          label: '40s'
        }, {
          value: '选项3',
          label: '40s'
        }, {
          value: '选项4',
          label: '40s'
        }, {
          value: '选项5',
          label: '40s'
        }],
        options2: [{
          value: '选项1',
          label: '1'
        }, {
          value: '选项2',
          label: '2'
        }, {
          value: '选项3',
          label: '3'
        }, {
          value: '选项4',
          label: '4'
        }, {
          value: '选项5',
          label: '5'
        }],
        value3: ''
      }

    },
    methods: {
      change(index,row){
        row.canEdit = false;
      },
      finish(index,row){
        row.canEdit = true;
        console.log(row)
      }
    }
  }
</script>

<style scoped>
  .el-button+.el-button{
    margin-left: 0;
  }
  .big-con{
    padding: 20px;
  }
  .title{
    background: white;
    line-height: 50px;
    border-radius: 5px;
    padding: 0 10px;
  }
  .el-table{
    border-radius: 5px;

  }
</style>

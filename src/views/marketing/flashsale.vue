<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        创建秒杀
      </el-button>
    </div>
     <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    > 
      <el-table-column label="拼团内容" width="800px" align="center">
        <template slot-scope="{row}">
          <div style="display:flex">
            <img :src='row.value.cover' style="height:51px">
            <div style=" margin-left:10px">
               <div style="margin-left:10px;">{{ row.value.title }}</div>
               <div style="margin-top:5px;color:red"> 起始价格:￥{{ row.price }}</div>
               <div style="margin-top:5px;color:red">拼团价格:￥{{ row.price }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="限制人数" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.s_num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已使用人数" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.used_num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="秒杀状态" width="150px" class-name="status-col" align="center">
        <template slot-scope="{row}"     >
          <el-tag  type="row.status === 1 ? 'success' : 'danger' " >
            {{ row.status === 1 ? '秒杀中' : '已下架' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="330" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!=1" size="mini" type="danger"  :disabled='true'  @click="handleModifyStatus(row,1)">
            下架
          </el-button>
          <el-button v-if="row.status!=0" size="mini" type="danger"   @click="handleModifyStatus(row,0)">
            下架
          </el-button>
        </template>
      </el-table-column>
    </el-table> 
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" fullscreen:true>
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="类型">
          <el-input v-model="temp.type" />
        </el-form-item>

        <el-form-item label="拼团价格">
           <el-input-number v-model="temp.price"  :min="1"  label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item label="拼团人数">
           <el-input-number v-model="temp.p_num"  :min="1"  label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item label="是否开启凑团">
            <el-radio-group v-model="temp.status">
              <el-radio :label="0">下架</el-radio>
              <el-radio :label="1">上架</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="拼团活动开启时间-结束时间" >
          <!-- <markdown-editor v-model="content" /> -->
            <div class="block">
                <span class="demonstration">默认</span>
                <el-date-picker
                v-model="value1"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
                </el-date-picker>
            </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog> 
  </div>
</template>

<script>
// import {fetchList} from '@/api/user'
import { fetchFlashsale,  fetchPv, createFlashsale, updateFlashsale } from '@/api/marketing'

import { fetchUserComment, fetchUserHistory, fetchUserColumn, fetchUserOrder  ,  fetchUserCourse} from '@/api/user'


import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]


// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      activeName: 'course',
      userList:[],
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      value1: [],
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '添加'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      dialogTableVisible:false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchFlashsale(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        console.log(this.list)
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createFlashsale(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateFlashsale(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    // handleFetchPv(pv) {
    //   fetchPv(pv).then(response => {
    //     this.pvData = response.data.pvData
    //     this.dialogPvVisible = true
    //   })
    // },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },


    handleClick(tab, event) {
        console.log(tab.name);
        let name = tab.name;
        if( name === "course" ){
           fetchUserCourse(this.listQuery).then(response => {
              // console.log(response.data.items)
              this.userList =response.data.items
              this.total = response.data.total

        })
        } if(name === "column"){
            fetchUserColumn(this.listQuery).then(response => {
                // console.log(response.data.items)
                this.userList =response.data.items
                this.total = response.data.total
            
            })
        } if(name === "order"){
               fetchUserOrder(this.listQuery).then(response => {
                  // console.log(response.data.items)
                  this.userList =response.data.items
                  this.total = response.data.total
            
            })
        } if(name === "history"){
               fetchUserHistory(this.listQuery).then(response => {
                  // console.log(response.data.items)
                  this.userList =response.data.items
                  this.total = response.data.total
            
            })
        } if(name === "comment"){
               fetchUserComment(this.listQuery).then(response => {
                  console.log(response.data.items)
                  this.userList =response.data.items
                  this.total = response.data.total
            
            })
        } 
        // console.log(this.activeName);
      },




    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>

<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增图文
      </el-button>
      <el-button v-waves class="filter-item" style="float:right" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-input v-model="listQuery.title" placeholder="标题" style="width: 200px; float:right" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.importance" placeholder="商品状态" clearable style="width: 90px; float:right" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
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

     <el-table-column type="selection" align="center" />
     <el-table-column label="用户" prop="id" sortable="custom"  width="800px" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
            <div style="display:flex">
                <img :src="row.user.avatar" alt="" style="height:50px">
                <div style="margin-top:20px; margin-left:10px">{{ row.user.username }}</div>
            </div>
        </template>
      </el-table-column>
      <el-table-column label="消费金额" width="100px" align="center" >
        <template slot-scope="{row}">
           <span>{{ row.total_consume }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.created_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="330" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            详情
          </el-button>
          
          <el-button v-if="row.status!='deleted'" size="mini" type="success" >
            联系用户
          </el-button>
        </template>
      </el-table-column>
    </el-table> 
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    

    <el-dialog   :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" fullscreen:true>
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left"  style="width: 800px; margin-left:50px;">
               <el-form-item>
                   ID:<span> {{ temp.user.id }} </span> 
                   用户名：<span> {{ temp.user.username }}</span>
                   昵称:<span> {{ temp.user.nickname === '' ? "未设置" : temp.user.nickname }} </span>
                   手机号:<span> {{ temp.user.phone }} </span>
               </el-form-item>
               <el-form-item >
                   锁定:<span>{{ temp.no_access ? "是": "否" }} </span>
                   会员:<span>{{ temp.user.user_level }}</span>
                   会员到期时间:<span>{{ temp.user.user_level_expire }}</span>
                   注册时间:<span>{{ temp.user.created_time }}</span>
               </el-form-item>
               <el-form-item>
                     <el-tabs tab-position="top" style="height: 500px;" @tab-click="handleClick">
                        <el-tab-pane label="课程订阅" name="course">
                            <el-table :data="userList">
                                <el-table-column label="课程标题">
                                     <template slot-scope="{row}">
                                        {{ row.title}}
                                     </template>
                                </el-table-column>
                                <el-table-column label="购买价格">
                                    <template slot-scope="{row}">
                                        {{ row.price }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="购买时间">
                                   <template slot-scope="{row}">
                                      {{ row.created_time }}
                                   </template>
                                </el-table-column>
                            </el-table>  
                        </el-tab-pane>
                        <el-tab-pane label="专栏记录" name="column">
                            <el-table :data="userList">
                                <el-table-column label="专栏标题">
                                     <template slot-scope="{row}">
                                        {{ row.title}}
                                     </template>
                                </el-table-column>
                                <el-table-column label="购买价格">
                                     <template slot-scope="{row}">
                                        {{ row.price}}
                                     </template>
                                </el-table-column>
                                <el-table-column label="购买时间">
                                     <template slot-scope="{row}">
                                        {{ row.created_time}}
                                     </template>
                                </el-table-column>
                            </el-table>  
                        </el-tab-pane>
                        <el-tab-pane label="订单记录" name="order">
                            <el-table :data="userList">
                                <el-table-column label="ID">
                                   <template slot-scope="{row}">
                                        {{ row.id}}
                                     </template>
                                </el-table-column>
                                <el-table-column label="订单号">
                                     <template slot-scope="{row}">
                                        {{ row.no}}
                                     </template>
                                </el-table-column>
                                <el-table-column label="购买价格">
                                     <template slot-scope="{row}">
                                        {{ row.price}}
                                     </template>
                                </el-table-column>
                                <el-table-column label="状态">
                                     <template slot-scope="{row}">
                                        {{ row.status ==="fail" ? "已下架" : "已上架"  }}
                                     </template>
                                </el-table-column>
                                <el-table-column label="商品">
                                     <template slot-scope="{row}">
                                        {{ row.title}}
                                     </template>
                                </el-table-column>
                                <el-table-column label="购买时间">
                                     <template slot-scope="{row}">
                                        {{ row.created_time}}
                                     </template>
                                </el-table-column>
                            </el-table>  
                        </el-tab-pane >
                        <el-tab-pane label="观看历史" name="history">
                            <el-table :data="userList">
                                <el-table-column label="课程标题">
                                    <template slot-scope="{row}">
                                        {{ row.title}}
                                     </template>
                                </el-table-column>
                                <el-table-column label="课程类型">
                                     <template slot-scope="{row}">
                                        {{ row.type}}
                                     </template>
                                </el-table-column>
                                <el-table-column label="学习时长">
                                    <template slot-scope="{row}">
                                        {{ row.total_time}}
                                     </template>
                                </el-table-column>
                            </el-table>  
                        </el-tab-pane>
                        <el-tab-pane label="用户评论" name="comment">
                            <el-table :data="userList">
                                <el-table-column label="评论内容">
                                     <template slot-scope="{row}">
                                        {{ row.content}}
                                     </template>
                                </el-table-column>
                                <el-table-column label="评论时间">
                                      <template slot-scope="{row}">
                                        {{ row.created_time}}
                                      </template>
                                </el-table-column>
                                <el-table-column label="课程标题">
                                      <template slot-scope="{row}">
                                        {{ row.title}}
                                      </template>
                                </el-table-column>
                                <el-table-column label="类型">
                                      <template slot-scope="{row}">
                                        {{ row.type}}
                                      </template>
                                </el-table-column>
                            </el-table>  
                        </el-tab-pane>
                    </el-tabs>
               </el-form-item>
           <!-- <span> {{ temp.username }} </span>
           <span>{{ temp.nickname === '' ? "未设置" : temp.nickname }}</span> -->

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

    <el-dialog     :visible.sync="dialogPvVisible" title="Reading statistics">
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
import { fetchList, fetchUserComment, fetchUserHistory, fetchUserColumn, fetchUserOrder  ,  fetchUserCourse, createMedia, updateMedia } from '@/api/user'

import Tinymce from '@/components/Tinymce/index'

import MarkdownEditor from '@/components/MarkdownEditor'

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
  components: { Pagination,Tinymce ,MarkdownEditor},
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
      userList:[],
      activeName: 'course',
      tableKey: 0,
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
        status: 'published',
        user:{
            id:undefined,
            username:'',
            nickname:'',
            phone:''
        }
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
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        // console.log(this.list)


        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
      fetchUserCourse(this.listQuery).then(response => {
              // console.log(response.data.items)
              this.userList =response.data.items
              this.total = response.data.total

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
          createMedia(this.temp).then(() => {
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
          updateMedia(tempData).then(() => {
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
        
      }
  }
}
</script>

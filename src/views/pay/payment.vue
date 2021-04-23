<template>
    <div class="app-container">
          <div class="filter-container">
            <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
                新增图文
            </el-button>
          </div>
          <el-table
            v-loading="listLoading"
            :data="list"
            border
            fit
            highlight-current-row
            style="width: 100%;"
          > 
            <el-table-column label="提款账号" width="600px" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.account }}</span>
                </template>
            </el-table-column>
            <el-table-column label="开户人" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="开户行" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.path }}</span>
                </template>
            </el-table-column>
            <el-table-column label="Actions" align="center" width="330" class-name="small-padding fixed-width">
                <template slot-scope="{row,$index}">
                <el-button type="primary" size="mini" @click="handleUpdate(row)">
                    编辑
                </el-button>
                <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
                    删除
                </el-button>
                </template>
            </el-table-column>
          </el-table>
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
            <el-dialog  :visible.sync="dialogFormVisible" >
                <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
                    <el-form-item label="账户">
                        <el-input v-model="temp.account" />
                    </el-form-item>
                    <el-form-item label="省市区">
                      <city></city>
                    </el-form-item>
                    <el-form-item label="详细地址">
                        <el-input v-model="temp.path" />
                    </el-form-item>
                    <el-form-item label="省市区">
                        <el-select  v-model="temp"  placeholder="所属银行">
                            <el-option :value="temp.bank" :label="temp.bank"> 
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="姓名">
                        <el-input v-model="temp.name" />
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
    </div>
 
</template>

<script>
import { fetchPayments,updatePayment, createPayment } from '@/api/pay'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

import city from "@/components/city/city"

export default {
  name: 'SelectExcel',
  components: { Pagination,city},
  data() {
    return {
      list: null,
      total: 0,
      num: 1,
      listLoading: true,
      multipleSelection: [],
      downloadLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      filename: '',
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchPayments(this.listQuery).then(response => {
        console.log(response)
        this.list = response.data.items
        this.listLoading = false
        this.total = response.data.total

      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
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

    handleDelete(scrope,index){
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
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

    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updatePayment(tempData).then(() => {
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

    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createPayment(this.temp).then(() => {
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

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>

<style scoped >
.clearfix{
    height: 60px;
    line-height: 60px;
}
</style>
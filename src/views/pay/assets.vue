<template>
    <div class="app-container">
        <div style="display:flex">
            <div style="flex:25%; margin-right:20px">
                <el-card class="box-card" >
                    <div slot="header" class="clearfix">
                        <span>可用余额(元)</span>
                        <el-button style="float: right; padding: 10px 0" type="primary" @click="handleCreate">申请提现</el-button>
                    </div>
                    <div> 
                        {{ list[0].price}}  
                    </div>
                </el-card>    
            </div>
            <div style="flex:25%; margin-right:20px">
                <el-card class="box-card" >
                    <div slot="header" class="clearfix">
                        <span>累计收入(元)</span>
                    </div>
                    <div >
                        {{ list[0].price}}
                    </div>
                </el-card>    
            </div>
            <div style="flex:25%; margin-right:20px">
                <el-card class="box-card" >
                    <div slot="header" class="clearfix">
                        <span>待结算金额(元)</span>
                    </div>
                    <div >
                        {{ list[0].price}}
                    </div>
                </el-card>    
            </div>
            <div style="flex:25%; margin-right:20px">
                <el-card class="box-card" >
                    <div slot="header" class="clearfix">
                        <span>冻结金额(元)</span>
                    </div>
                    <div >
                        {{ list[0].price }}
                    </div>
                </el-card>    
            </div>
        </div>
        <div style="margin-top:30px">
          <el-table
            v-loading="listLoading"
            :data="list"
            border
            fit
            highlight-current-row
            style="width: 100%;"
          > 
            <el-table-column label="交易时间" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.created_time }}</span>
                </template>
            </el-table-column>
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
            <el-table-column label="提现金额" align="center">
                <template slot-scope="{row}">
                    <span>￥{{ row.price }}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.status === '0' ? '审核中': "提现成功" }}</span>
                </template>
            </el-table-column>
          </el-table>
        </div>
            <el-dialog  :visible.sync="dialogFormVisible" >
                <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
                   <el-form-item label="提现金额">
                       <el-input-number v-model="num"  :min="1"  >0</el-input-number>
                   </el-form-item>
                    <el-form-item label="提现账户">
                         <el-select  v-model="temp"  placeholder="请选择">
                            <el-option :value="temp.account" :label="temp.account"> 
                            </el-option>
                        </el-select>
                   </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">
                    Cancel
                    </el-button>
                </div>
            </el-dialog>
    </div>
 
</template>

<script>
import { fetchAssets } from '@/api/pay'

export default {
  name: 'SelectExcel',
  data() {
    return {
      list: null,
      num: 1,
      listLoading: true,
      multipleSelection: [],
      downloadLoading: false,
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
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      fetchAssets(this.listQuery).then(response => {
        console.log(response)
        this.list = response.data.items
        this.listLoading = false
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
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

    handleDownload() {
      if (this.multipleSelection.length) {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['订单号', '商品名称', '订单类型', '订单状态', '原价/实付(元)',"支付方式","创建/支付时间"]
          const filterVal = ['id', 'title', 'author', 'pageviews', 'display_time']
          const list = this.multipleSelection
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.filename
          })
          this.$refs.multipleTable.clearSelection()
          this.downloadLoading = false
        })
      } else {
        this.$message({
          message: 'Please select at least one item',
          type: 'warning'
        })
      }
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
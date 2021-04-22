<template>
  <div class="app-container">
    <el-button :loading="downloadLoading" style="margin-bottom:20px" type="primary"  @click="handleDownload">
      导出选中
    </el-button>
    <el-button  class="filter-item" style="float:right" type="primary" icon="el-icon-search" >
    搜索
    </el-button>
    <el-input  placeholder="标题" style="width: 200px; float:right" class="filter-item"  />

    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :data="list"
      element-loading-text="拼命加载中"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" />
      <el-table-column align="center" label="订单号" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="商品名称">
        <template slot-scope="scope">
          {{ scope.row.goods[0].title }}
        </template>
      </el-table-column>
      <el-table-column label="订单类型"  width="115" align="center">
        <template >
           {{ "普通" }}
        </template>
      </el-table-column>
      <el-table-column label="订单状态"  width="115" align="center">
        <template slot-scope="scope">
            {{ scope.row.status === "success" ? "成功" :"失败"}}
        </template>
      </el-table-column>
      <el-table-column label="原价/实付(元)" width="110" align="center">
        <template slot-scope="scope">
           <span>{{scope.row.total_price }}</span>/<span style="color:red">{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付方式" width="115" align="center">
        <template slot-scope="scope">
          {{ scope.row.pay_method === "wechat" ? "微信支付" : "其他" }}
        </template>
      </el-table-column>
      <el-table-column label="创建/支付时间" width="160" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.created_time }}</div>
          <div>{{ scope.row.updated_time }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="220">
        <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="handleDelete(scope,$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchOrder } from '@/api/pay'

export default {
  name: 'SelectExcel',
  data() {
    return {
      list: null,
      listLoading: true,
      multipleSelection: [],
      downloadLoading: false,
      filename: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      fetchOrder(this.listQuery).then(response => {
        console.log(response.data.items)
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

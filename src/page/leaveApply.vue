<template>
  <div>
    <el-container>
      <el-header class="header">
        <Header></Header>
      </el-header>
      <el-container>
        <el-aside width="220px">
          <NavMenu></NavMenu>
        </el-aside>
        <el-container>
          <el-main>
            <template>
              <el-col :span="24" class="">
                <el-form :inline="true" class="demo-form-inline">
                  <el-form-item>
                    <el-badge :value="tbdNum" :max="20">
                      <el-button size="small" @click="getleaveRequestTBD" plain>待处理</el-button>
                    </el-badge>
                  </el-form-item>
                  <el-form-item>
                    <el-badge :value="approvedNum" :max="20">
                      <el-button size="small" @click="getleaveRequestApproved" plain>已批准</el-button>
                    </el-badge>
                  </el-form-item>
                  <el-form-item>
                    <el-badge :value="rejectedNum" :max="20">
                      <el-button size="small" @click="getleaveRequestRejected" plain>已拒绝</el-button>
                    </el-badge>
                  </el-form-item>
                </el-form>
              </el-col>

              <el-table :data="leaveRequest" highlight-current-row v-loading="listLoading"
                        :default-sort = "{prop: 'id', order: 'descending'}" style="width: 100%">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                      <el-form-item label="申请人：">
                        <span>{{ props.row.user_id }}</span>
                      </el-form-item>
                      <el-form-item label="申请时间：">
                        <span>{{ props.row.request_time }}</span>
                      </el-form-item>
                      <el-form-item label="申请状态：">
                        <span>{{ props.row.status }}</span>
                      </el-form-item>
                      <el-form-item label="申请原因：">
                        <span>{{ props.row.text }}</span>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column
                  label="申请ID"
                  prop="id" sortable width="150">
                </el-table-column>
                <el-table-column
                  label="申请人"
                  prop="user_id" width="220">
                </el-table-column>
                <el-table-column
                  label="申请状态"
                  prop="status" sortable>
                </el-table-column>
                <div v-if="tbd">
                  <el-table-column fixed="right" label="操作" width="150">
                    <template slot-scope="scope">
                      <el-button @click="handleApprove(scope.$index, scope.row)" type="primary" size="small" plain>批准</el-button>
                      <el-button @click="handleReject(scope.$index, scope.row)" type="danger" size="small" plain>拒绝</el-button>
                    </template>
                  </el-table-column>
                </div>
              </el-table>
            </template>
          </el-main>
        </el-container>
      </el-container>
      <el-footer>
        <Footer></Footer>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
  import NavMenu from '@/components/NavMenu'
  import Header from '@/components/Header'
  import Footer from '@/components/Footer'
  import { getRequest,editRequest } from "../api/api";

  export default {
    name: "leaveApply",
    components: {
      NavMenu,
      Header,
      Footer
    },
    data() {
      return {
        listLoading: false,
        leaveRequest: [],
        leaveRequestTBD:[],
        leaveRequestApproved: [],
        leaveRequestRejected: [],
        tbd: false
        //tbdNum: 0,
        //approvedNum: 0
      }
    },
    created() {
      document.title = '请假申请'
    },
    mounted: function() {
      let initParams = {
        'Request.request_type': 'TYPE_LEAVE'
      };
      this.listLoading = true;
      getRequest(initParams).then((res) => {
        this.leaveRequest = res.data.Request;
        this.listLoading = false;
      });
      let tbdParams = {
        'Request.request_type': 'TYPE_LEAVE',
        'Request.status': 'STATUS_TBD'
      };
      getRequest(tbdParams).then((res) => {
        this.leaveRequestTBD = res.data.Request;
        console.log(this.leaveRequestTBD);
        /*
        if(this.leaveRequestTBD != null) {
          this.tbdNum = this.leaveRequestTBD.length;
        }
        */
      });
      let approvedParams = {
        'Request.request_type': 'TYPE_LEAVE',
        'Request.status': 'STATUS_APPROVED'
      };
      getRequest(approvedParams).then((res) => {
        this.leaveRequestApproved = res.data.Request;
        console.log(this.leaveRequestApproved);
        /*
        if(this.leaveRequestApproved != null) {
          this.approvedNum = this.leaveRequestApproved.length;
        }
        */
        let rejectedParams = {
          'Request.request_type': 'TYPE_SCHOLAR',
          'Request.status': 'STATUS_REJECTED'
        };
        getRequest(rejectedParams).then((res) => {
          this.leaveRequestRejected = res.data.Request;
        });
      });

    },
    computed: {
      tbdNum: function() {
        return typeof(this.leaveRequestTBD) === 'undefined' ? 0 : this.leaveRequestTBD.length;
      },
      approvedNum: function() {
        return typeof(this.leaveRequestApproved) === 'undefined' ? 0 : this.leaveRequestApproved.length;
      },
      rejectedNum: function() {
        return typeof(this.leaveRequestRejected) === 'undefined' ? 0: this.leaveRequestRejected.length;
      }
    },
    methods: {
      getleaveRequestTBD() {
        let tbdParams = {
          'Request.request_type': 'TYPE_LEAVE',
          'Request.status': 'STATUS_TBD'
        };
        this.listLoading = true;
        getRequest(tbdParams).then((res) => {
          this.leaveRequestTBD = res.data.Request;
          this.leaveRequest = this.leaveRequestTBD;
          this.listLoading = false;
          console.log(this.leaveRequest);
        });
        this.tbd = true;
      },
      getleaveRequestApproved() {
        let approvedParams = {
          'Request.request_type': 'TYPE_LEAVE',
          'Request.status': 'STATUS_APPROVED'
        };
        this.listLoading = true;
        getRequest(approvedParams).then((res) => {
          this.leaveRequestApproved = res.data.Request;
          this.leaveRequest = this.leaveRequestApproved;
          this.listLoading = false;
          console.log(this.leaveRequest);
        });
        this.tbd = false;
      },
      getleaveRequestRejected() {
        let rejectedParams = {
          'Request.request_type': 'TYPE_LEAVE',
          'Request.status': 'STATUS_REJECTED'
        };
        this.listLoading = true;
        getRequest(rejectedParams).then((res) => {
          this.leaveRequestRejected = res.data.Request;
          this.leaveRequest = this.leaveRequestRejected;
          this.listLoading = false;
          console.log(this.leaveRequest);
        });
        this.tbd = false;
      },
      handleApprove: function(index, row) {
        this.$confirm('确认批准吗？', '确认', {}).then(() => {
          let editParams = Object.assign({}, row);
          editParams.status = 'STATUS_APPROVED';
          console.log(editParams);
          editRequest(editParams).then(() => {
            this.$message({
              message: '批准成功',
              type: 'success'
            });
            this.getleaveRequestTBD();
          });
        });
      },
      handleReject: function(index, row) {
        this.$confirm('确认拒绝吗？', '确认', {}).then(() => {
          let editParams = Object.assign({}, row);
          editParams.status = 'STATUS_REJECTED';
          editRequest(editParams).then(() => {
            this.$message({
              message: '拒绝成功',
              type: 'success'
            });
            this.getleaveRequestTBD();
          })
        });
      }
    }
  }
</script>

<style scoped>

</style>

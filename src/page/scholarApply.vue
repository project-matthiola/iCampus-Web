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
                        <el-button size="small" @click="getScholarRequestTBD" plain>待处理</el-button>
                      </el-badge>
                    </el-form-item>
                    <el-form-item>
                      <el-badge :value="approvedNum" :max="20">
                        <el-button size="small" @click="getScholarRequestApproved" plain>已批准</el-button>
                      </el-badge>
                    </el-form-item>
                    <el-form-item>
                      <el-badge :value="rejectedNum" :max="20">
                        <el-button size="small" @click="getScholarRequestRejected" plain>已拒绝</el-button>
                      </el-badge>
                    </el-form-item>
                  </el-form>
                </el-col>

                <el-table :data="scholarRequest" highlight-current-row v-loading="listLoading"
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
    name: "scholarApply",
    components: {
      NavMenu,
      Header,
      Footer
    },
    data() {
      return {
        listLoading: false,
        scholarRequest: [],
        scholarRequestTBD:[],
        scholarRequestApproved: [],
        scholarRequestRejected: [],
        tbd: false
        //tbdNum: 0,
        //approvedNum: 0
      }
    },
    created() {
      document.title = '奖学金申请'
    },
    mounted: function() {
      let initParams = {
        'Request.request_type': 'TYPE_SCHOLAR'
      };
      this.listLoading = true;
      getRequest(initParams).then((res) => {
        this.scholarRequest = res.data.Request;
        this.listLoading = false;
      });
      let tbdParams = {
        'Request.request_type': 'TYPE_SCHOLAR',
        'Request.status': 'STATUS_TBD'
      };
      getRequest(tbdParams).then((res) => {
        this.scholarRequestTBD = res.data.Request;
        console.log(this.scholarRequestTBD);
        /*
        if(this.scholarRequestTBD != null) {
          this.tbdNum = this.scholarRequestTBD.length;
        }
        */
      });
      let approvedParams = {
        'Request.request_type': 'TYPE_SCHOLAR',
        'Request.status': 'STATUS_APPROVED'
      };
      getRequest(approvedParams).then((res) => {
        this.scholarRequestApproved = res.data.Request;
        console.log(this.scholarRequestApproved);
        /*
        if(this.scholarRequestApproved != null) {
          this.approvedNum = this.scholarRequestApproved.length;
        }
        */
        let rejectedParams = {
          'Request.request_type': 'TYPE_SCHOLAR',
          'Request.status': 'STATUS_REJECTED'
        };
        getRequest(rejectedParams).then((res) => {
          this.scholarRequestRejected = res.data.Request;
        });
      });

    },
    computed: {
      tbdNum: function() {
        return typeof(this.scholarRequestTBD) === 'undefined' ? 0 : this.scholarRequestTBD.length;
      },
      approvedNum: function() {
        return typeof(this.scholarRequestApproved) === 'undefined' ? 0 : this.scholarRequestApproved.length;
      },
      rejectedNum: function() {
        return typeof(this.scholarRequestRejected) === 'undefined' ? 0: this.scholarRequestRejected.length;
      }
    },
    methods: {
      getScholarRequestTBD() {
        let tbdParams = {
          'Request.request_type': 'TYPE_SCHOLAR',
          'Request.status': 'STATUS_TBD'
        };
        this.listLoading = true;
        getRequest(tbdParams).then((res) => {
          this.scholarRequestTBD = res.data.Request;
          this.scholarRequest = this.scholarRequestTBD;
          this.listLoading = false;
          console.log(this.scholarRequest);
        });
        this.tbd = true;
      },
      getScholarRequestApproved() {
        let approvedParams = {
          'Request.request_type': 'TYPE_SCHOLAR',
          'Request.status': 'STATUS_APPROVED'
        };
        this.listLoading = true;
        getRequest(approvedParams).then((res) => {
          this.scholarRequestApproved = res.data.Request;
          this.scholarRequest = this.scholarRequestApproved;
          this.listLoading = false;
          console.log(this.scholarRequest);
        });
        this.tbd = false;
      },
      getScholarRequestRejected() {
        let rejectedParams = {
          'Request.request_type': 'TYPE_SCHOLAR',
          'Request.status': 'STATUS_REJECTED'
        };
        this.listLoading = true;
        getRequest(rejectedParams).then((res) => {
          this.scholarRequestRejected = res.data.Request;
          this.scholarRequest = this.scholarRequestRejected;
          this.listLoading = false;
          console.log(this.scholarRequest);
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
            this.getScholarRequestTBD();
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
            this.getScholarRequestTBD();
          })
        });
      }
    }
  }
</script>

<style scoped>

</style>

<template>
  <div>
    <!--留言列表-->
    <template>
        <el-table :data="msgList" border style="width: 100%" ref="multipleTable" @selection-change="selectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column label="序号" width="70">
            <template scope="scope">
              {{scope.$index + 1}}
</template>
        </el-table-column>
        <el-table-column prop="title" label="标题">
        </el-table-column>
        <el-table-column prop="content" label="内容">
        </el-table-column>
        <el-table-column label="状态">
<template scope="scope">
  <span v-if="scope.row.read==0">未读</span>
  <span v-else>已读</span>
</template>
        </el-table-column>
        <el-table-column label="创建时间">
<template scope="scope">
   {{scope.row.meta.createAt | formattime}}
</template>
        </el-table-column>
        <el-table-column label="操作">
<template scope="scope">
  <el-button size="small" @click="goSet(scope.$index, scope.row)" v-if="scope.row.read==0">
    标记
  </el-button>
  <el-button size="small" v-else>已标记
  </el-button>
  <el-button size="small" type="danger" @click="goDel(scope.$index, scope.row)">删除
  </el-button>
</template>
        </el-table-column>
      </el-table>
    </template>
    <el-pagination layout="prev, pager, next" :total="total" @current-change="currentChange" :current-page.sync="currentPage" class="page-ctrol"></el-pagination>
  </div>
</template>

<script>
  import Vue from 'vue'
  import moment from 'moment'
  export default {
    data() {
      return {
        'currentPage': 1,
        'msgList': [],
        'multipleSelection': [],
        'operateMsg': '',
        'operateIndex': '',
        'total': 0
      }
    },
    mounted() {
      if (localStorage.getItem("user") != "allow") {
       this.$message.error('你没有权限执行本操作~');
        this.$router.push({
          path: '/signin'
        });
      }
      this.getList(1);
    },
    methods: {
      // 获取留言列表
      getList(page) {
        const that = this;
        that.$http.get(that.$home + '/blog/message/list?page=' + page).then(response => {
          if (response.body.errcode == 0) {
            that.msgList = response.body.msg;
            that.total = response.body.count;
            that.loading = false;
          } else {
            that.$message.error('获取留言列表失败~');
          }
        }, response => {
          that.$message.error('获取留言列表失败~');
        })
      },
      // 多选添加目标
      selectionChange(val) {
        this.multipleSelection = val;
      },
      // 设置为已读状态
      goSet(index, row) {
        const that = this;
        that.operateMsg = row;
        that.operateIndex = index;
        if (that.multipleSelection.length > 0) {
          let operateMsgArr = [];
          that.multipleSelection.forEach(item => {
            operateMsgArr.push(item._id)
          });
          that.$http.post(that.$home + '/blog/message/read', {
            _id: operateMsgArr
          }).then(response => {
            if (response.body.errcode == 0) {
              that.$message({
                message: '标记成功~',
                type: 'success'
              });
              operateMsgArr.forEach(_id => {
                that.msgList.forEach((item, _index) => {
                  if (_id == item._id) {
                    Vue.set(item, 'read', 1);
                  }
                })
              })
            } else {
              that.$message.error('标记失败~');
            }
            that.operateMsg = '';
            that.multipleSelection = '';
            that.$refs.multipleTable.clearSelection();
          }, response => {
            that.$message.error('标记失败~');
          });
        } else {
          that.$http.post(that.$home + '/blog/message/read', {
            _id: that.operateMsg._id
          }).then(response => {
            if (response.body.errcode == 0) {
              that.$message({
                message: '标记成功~',
                type: 'success'
              });
              Vue.set(that.msgList[that.operateIndex], 'read', 1);
            } else {
              that.$message.error('标记失败~');
            }
            that.operateMsg = '';
            that.multipleSelection = [];
            that.$refs.multipleTable.clearSelection();
          }, response => {
            that.$message.error('删除失败~');
          });
        }
      },
      // 删除目标
      goDel(index, row) {
        const that = this;
        that.operateMsg = row;
        that.operateIndex = index;
        that.$confirm('确定要删除吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (that.multipleSelection.length > 0) {
            let operateMsgArr = [];
            that.multipleSelection.forEach(item => {
              operateMsgArr.push(item._id)
            });
            that.$http.post(that.$home + '/blog/message/del', {
              _id: operateMsgArr
            }).then(response => {
              if (response.body.errcode == 0) {
                that.$message({
                  message: '删除成功~',
                  type: 'success'
                });
                operateMsgArr.forEach(_id => {
                  that.msgList.forEach((item, _index) => {
                    if (_id == item._id) {
                      that.msgList.splice(_index, 1);
                    }
                  })
                })
              } else {
                that.$message.error('删除失败~');
              }
              that.operateMsg = '';
              that.multipleSelection = '';
              that.$refs.multipleTable.clearSelection();
            }, response => {
              that.$message.error('删除失败~');
            });
          } else {
            that.$http.post(that.$home + '/blog/message/del', {
              _id: that.operateMsg._id
            }).then(response => {
              if (response.body.errcode == 0) {
                that.$message({
                  message: '删除成功~',
                  type: 'success'
                });
                that.msgList.splice(that.operateIndex, 1);
              } else {
                that.$message.error('删除失败~');
              }
              that.operateMsg = '';
              that.multipleSelection = [];
              that.$refs.multipleTable.clearSelection();
            }, response => {
              that.$message.error('删除失败~');
            });
          }
        })
      },
      // 切换页码
      currentChange() {
        this.getList(this.currentPage);
      }
    },
    filters: {
      formattime(value) {
        return moment(value).format('YYYY/MM/DD')
      }
    }
  }
</script>

<style>
  
</style>

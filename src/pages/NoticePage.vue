<template>
  <div>
    <!--公告新增-->
    <el-form :model="newNoticeForm" ref="newNoticeForm" :inline="inlineForm" style="padding: 15px;">
      <el-form-item prop="title" label="新公告" :rules="[{ required: true, message: '公告不能为空'}]">
        <el-input v-model="newNoticeForm.title" placeholder="请输入公告内容"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="createNotice">新增</el-button>
      </el-form-item>
    </el-form>
    <!--编辑窗口-->
    <el-dialog title="编辑" :visible.sync="editDialogVisible" size="tiny" class="edit-form">
      <el-form :model="editNoticeForm" ref="editNoticeForm">
        <el-form-item prop="title" label="公告名" :rules="[{ required: true, message: '公告名不能为空'}]">
          <el-input v-model="editNoticeForm.title" placeholder="请输入标签名"></el-input>
        </el-form-item>
        <el-form-item class="edit-form__btn-group">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="commitEdit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--公告列表-->
      <el-table :data="noticeList" border style="width: 100%" ref="multipleTable" @selection-change="selectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="序号" width="70">
          <template scope="scope">
            {{scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column prop="title" label="公告">
        </el-table-column>
        <el-table-column label="创建时间">
          <template scope="scope">
            {{scope.row.meta.createAt | formattime}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button size="small" @click="goEdit(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="goDel(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    <el-pagination layout="prev, pager, next" :total="total" @current-change="currentChange" :current-page.sync="currentPage" class="page-ctrol"></el-pagination>
  </div>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
export default {
  data() {
    return {
      'editDialogVisible': false,
      'currentPage': 1,
      'inlineForm': true,
      'newNoticeForm': {
        'title': ''
      },
      'editNoticeForm': {
        'title': ''
      },
      'noticeList': [],
      'multipleSelection': [],
      'operateNotice': '',
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
    // 获取公告列表
    getList(page) {
      const that = this;
      that.$http.get(that.$home + '/blog/notice/list?page=' + page).then(response => {
        if (response.body.errcode == 0) {
          that.noticeList = response.body.notice;
          that.total = response.body.count;
          that.loading = false;
        } else {
          that.$message.error('获取标签列表失败~');
        }
      }, response => {
        that.$message.error('获取标签列表失败~');
      })
    },
    // 多选添加目标
    selectionChange(val) {
      this.multipleSelection = val;
    },
    // 编辑目标
    goEdit(index, row) {
      const that = this;
      if (that.multipleSelection.length > 1) {
         that.$message.error('只能编辑单个目标');
         that.$refs.multipleTable.clearSelection();
      } else {
        that.editDialogVisible = true;
        that.operateNotice = row;
        that.operateIndex = index;
        that.editNoticeForm.title = row.title;
      }
    },
    // 提交编辑
    commitEdit() {
      const that = this;
        that.$http.post(that.$home + '/blog/notice/edit', {
          '_id': that.operateNotice._id,
          'title': that.editNoticeForm.title
        }).then(response => {
          if (response.body.errcode == 0) {
            that.$message({
              message: '更新成功~',
              type: 'success'
            });
            Vue.set(that.noticeList[that.operateIndex], 'title', that.editNoticeForm.title);
            that.editDialogVisible = false;
            that.$refs.editNoticeForm.resetFields();
          } else {
            that.$message.error('更新失败~');
          }
          this.operateNotice = '';
          this.multipleSelection = [];
        }, response => {
          that.$message.error('更新失败~');
        });
    },
    // 删除目标
    goDel(index, row) {
      const that = this;
      that.operateNotice = row;
      that.operateIndex = index;
      that.$confirm('确定要删除吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (that.multipleSelection.length > 0) {
          let operateNoticeArr = [];
          that.multipleSelection.forEach(item => {
            operateNoticeArr.push(item._id)
          });
          that.$http.post(that.$home + '/blog/notice/del', {
            _id: operateNoticeArr
          }).then(response => {
            if (response.body.errcode == 0) {
              that.$message({
                message: '删除成功~',
                type: 'success'
              });
              operateNoticeArr.forEach(_id => {
                that.noticeList.forEach((item, _index) => {
                  if (_id == item._id) {
                    that.noticeList.splice(_index, 1);
                  }
                })
              })
            } else {
              that.$message.error('删除失败~');
            }
            that.operateNotice = '';
            that.$refs.multipleTable.clearSelection();
          }, response => {
            that.$message.error('删除失败~');
          });
        } else {
          that.$http.post(that.$home + '/blog/notice/del', {
            _id: that.operateNotice._id
          }).then(response => {
            if (response.body.errcode == 0) {
              that.$message({
                message: '删除成功~',
                type: 'success'
              });
              that.noticeList.splice(that.operateIndex, 1);
            } else {
              that.$message.error('删除失败~');
            }
            that.operateNotice = '';
            that.multipleSelection = [];
            that.$refs.multipleTable.clearSelection();
          }, response => {
            that.$message.error('删除失败~');
          });
        }
      })
    },
    // 新增公告
    createNotice() {
      const that = this;
      that.loading = true;
      that.$refs.newNoticeForm.validate((valid) => {
        if (valid) {
          that.$http.post(that.$home + '/blog/notice/add', {
            title: that.newNoticeForm.title
          }).then(response => {
            if (response.body.errcode == 0) {
              that.$message({
                message: '标签创建成功~',
                type: 'success'
              });
              that.$refs.newNoticeForm.resetFields();
              that.noticeList.unshift(response.body.notice);
              that.loading = false;
            } else {
              that.$message.error('标签创建失败~');
              that.loading = false;
            }
          }, response => {
            that.$message.error('标签创建失败~');
            that.loading = false;
          })
        } else {
          return false;
        }
      });
    },
    // 切换页面
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

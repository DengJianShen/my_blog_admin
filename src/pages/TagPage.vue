<template>
  <div id="TagPage">
    <!--标签新增-->
    <el-button type="primary" @click="newDialogVisible = true" style="margin: 15px;">新增标签</el-button>
    <!--新建窗口-->
    <el-dialog title="新建" :visible.sync="newDialogVisible" size="tiny" class="edit-form">
      <el-form :model="newTagForm" ref="newTagForm">
        <el-form-item class="edit-form__input" prop="title" label="标签名" :rules="[{ required: true, message: '标签名不能为空'}]">
          <el-input v-model="newTagForm.title" placeholder="请输入标签名"></el-input>
        </el-form-item>
        <el-form-item class="edit-form__input" prop="info" label="标签说明" :rules="[{ required: true, message: '标签说明不能为空'}]">
          <el-input type="textarea" v-model="newTagForm.info"></el-input>
        </el-form-item>
        <el-form-item class="edit-form__input" prop="link" label="百科地址" :rules="[{ required: true, message: '地址不能为空'}]">
          <el-input v-model="newTagForm.link" placeholder="请输入链接"></el-input>
        </el-form-item>
        <el-form-item class="edit-form__btn-group">
          <el-button @click="newDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="commitNew">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--编辑窗口-->
    <el-dialog title="编辑" :visible.sync="editDialogVisible" size="tiny" class="edit-form">
      <el-form :model="editTagForm" ref="editTagForm">
        <el-form-item class="edit-form__input" prop="title" label="标签名" :rules="[{ required: true, message: '标签名不能为空'}]">
          <el-input v-model="editTagForm.title" placeholder="请输入标签名"></el-input>
        </el-form-item>
        <el-form-item class="edit-form__input" prop="info" label="标签说明" :rules="[{ required: true, message: '标签说明不能为空'}]">
          <el-input type="textarea" v-model="editTagForm.info"></el-input>
        </el-form-item>
        <el-form-item class="edit-form__input" prop="link" label="百科地址" :rules="[{ required: true, message: '地址不能为空'}]">
          <el-input v-model="editTagForm.link" placeholder="请输入链接"></el-input>
        </el-form-item>
        <el-form-item class="edit-form__btn-group">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="commitEdit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--标签列表-->
    <el-table v-loading="loading" :data="tagList" border style="width: 100%" ref="multipleTable" @selection-change="selectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column label="序号" width="70">
        <template scope="scope">
          {{scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column prop="title" label="名称">
      </el-table-column>
      <el-table-column prop="info" label="内容">
      </el-table-column>
      <el-table-column prop="link" label="百科">
      </el-table-column>
      <el-table-column label="文章数">
        <template scope="scope">
          {{scope.row.articles.length}}
        </template>
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
      'currentPage': 1,
      'inlineForm': true,
      'newTagForm': {
        'title': '',
        'info': '',
        'link': ''
      },
      'editTagForm': {
        'title': '',
        'info': '',
        'link': ''
      },
      'total': 0,
      'loading': true,
      'newDialogVisible': false,
      'editDialogVisible': false,
      'tagList': [],
      'multipleSelection': [],
      'operateTag': '',
      'operateIndex': ''
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
    // 新建标签
    commitNew() {
      const that = this;
      that.loading = true;
      that.$refs.newTagForm.validate((valid) => {
        if (valid) {
          that.$http.post(that.$home + '/blog/tag/add', {
            title: that.newTagForm.title,
            info: that.newTagForm.info,
            link: that.newTagForm.link
          }).then(response => {
            if (response.body.errcode == 0) {
              that.$message({
                message: '标签创建成功~',
                type: 'success'
              });
              that.$refs.newTagForm.resetFields();
              that.newDialogVisible = false;
              that.tagList.unshift(response.body.tag);
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
    // 获取标签列表
    getList(page) {
      const that = this;
      that.$http.get(that.$home + '/blog/tag/list?page=' + page).then(response => {
        if (response.body.errcode == 0) {
          that.tagList = response.body.tag;
          that.total = response.body.count;
          that.loading = false;
        } else {
          that.$message.error('获取标签列表失败~');
        }
      }, response => {
        that.$message.error('获取标签列表失败~');
      })
    },
    // 切换页码
    currentChange() {
      this.getList(this.currentPage);
    },
    // 多选添加目标
    selectionChange(val) {
      this.multipleSelection = val;
    },
    // 删除目标
    goDel(index, row) {
      const that = this;
      that.operateTag = row;
      that.operateIndex = index;
      that.$confirm('确定要删除吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (that.multipleSelection.length > 0) {
          let operateTagArr = [];
          that.multipleSelection.forEach(item => {
            operateTagArr.push(item._id)
          });
          that.$http.post(that.$home + '/blog/tag/del', {
            _id: operateTagArr
          }).then(response => {
            if (response.body.errcode == 0) {
              that.$message({
                message: '删除成功~',
                type: 'success'
              });
              operateTagArr.forEach(_id => {
                that.tagList.forEach((item, _index) => {
                  if (_id == item._id) {
                    that.tagList.splice(_index, 1);
                  }
                })
              })
            } else {
              that.$message.error('删除失败~');
            }
            that.operateTag = '';
            that.$refs.multipleTable.clearSelection();
          }, response => {
            that.$message.error('删除失败~');
          });
        } else {
          that.$http.post(that.$home + '/blog/tag/del', {
            _id: that.operateTag._id
          }).then(response => {
            if (response.body.errcode == 0) {
              that.$message({
                message: '删除成功~',
                type: 'success'
              });
              that.tagList.splice(that.operateIndex, 1);
            } else {
              that.$message.error('删除失败~');
            }
            that.operateTag = '';
            that.multipleSelection = [];
            that.$refs.multipleTable.clearSelection();
          }, response => {
            that.$message.error('删除失败~');
          });
        }
      })
    },
    // 编辑目标
    goEdit(index, row) {
      const that = this;
      if (that.multipleSelection.length > 1) {
         that.$message.error('只能编辑单个目标');
         that.$refs.multipleTable.clearSelection();
      }else{
        that.editDialogVisible = true;
        that.operateTag = row;
        that.operateIndex = index;
        that.editTagForm.title = row.title;
        that.editTagForm.info = row.info;
        that.editTagForm.link = row.link;
      }
    },
    // 提交编辑
    commitEdit() {
      const that = this;
        that.$http.post(that.$home + '/blog/tag/edit', {
          _id: that.operateTag._id,
          title: that.editTagForm.title,
          info: that.editTagForm.info,
          link: that.editTagForm.link
        }).then(response => {
          if (response.body.errcode == 0) {
            that.$message({
              message: '更新成功~',
              type: 'success'
            });
            Vue.set(that.tagList[that.operateIndex], 'title', that.editTagForm.title);
            Vue.set(that.tagList[that.operateIndex], 'info', that.editTagForm.info);
            Vue.set(that.tagList[that.operateIndex], 'link', that.editTagForm.link);
            that.editDialogVisible = false;
            that.$refs.editTagForm.resetFields();
          } else {
            that.$message.error('更新失败~');
          }
          that.operateTag = '';
          that.multipleSelection = [];
        }, response => {
          that.$message.error('更新失败~');
        });
    },
  },
  filters: {
    formattime(value) {
      return moment(value).format('YYYY/MM/DD')
    }
  }
}
</script>
<style>
#TagPage .el-table .cell {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
</style>


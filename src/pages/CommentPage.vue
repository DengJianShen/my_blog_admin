<template>
  <div>
    <!--留言列表-->
    <template>
        <el-table :data="commentList" border style="width: 100%" ref="multipleTable" @selection-change="selectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column label="序号" width="70">
            <template scope="scope">
              {{scope.$index + 1}}
</template>
        </el-table-column>
        <el-table-column prop="article.title" label="文章标题">
        </el-table-column>
        <el-table-column prop="from.ip" label="评论人">
        </el-table-column>
        <el-table-column prop="content" label="评论内容">
        </el-table-column>

        <el-table-column label="创建时间">
<template scope="scope">
   {{scope.row.meta.createAt | formattime}}
</template>
        </el-table-column>
        <el-table-column label="操作">
<template scope="scope">
  <el-button size="small" type="danger" @click="goDel(scope.$index, scope.row)">
    删除
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
        'commentList': [],
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
        that.$http.get(that.$home + '/blog/comment/list?page=' + page).then(response => {
          if (response.body.errcode == 0) {
            that.commentList = response.body.comment;
            that.total = response.body.count;
            that.loading = false;
          } else {
            that.$message.error('获取评论列表失败~');
          }
        }, response => {
          that.$message.error('获取评论列表失败~');
        })
      },
      // 删除目标
      goDel(index, row) {
        const that = this;
        that.operateComment = row;
        that.operateIndex = index;
        that.$confirm('确定要删除吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (that.multipleSelection.length > 0) {
            let operateCommentArr = [];
            that.multipleSelection.forEach(item => {
              operateCommentArr.push(item._id)
            });
            that.$http.post(that.$home + '/blog/comment/del', {
              _id: operateCommentArr
            }).then(response => {
              if (response.body.errcode == 0) {
                that.$message({
                  message: '删除成功~',
                  type: 'success'
                });
                operateCommentArr.forEach(_id => {
                  that.commentList.forEach((item, _index) => {
                    if (_id == item._id) {
                      that.commentList.splice(_index, 1);
                    }
                  })
                })
              } else {
                that.$message.error('删除失败~');
              }
              that.operateComment = '';
              that.multipleSelection = '';
              that.$refs.multipleTable.clearSelection();
            }, response => {
              that.$message.error('删除失败~');
            });
          } else {
            that.$http.post(that.$home + '/blog/comment/del', {
              _id: that.operateComment._id
            }).then(response => {
              if (response.body.errcode == 0) {
                that.$message({
                  message: '删除成功~',
                  type: 'success'
                });
                that.commentList.splice(that.operateIndex, 1);
              } else {
                that.$message.error('删除失败~');
              }
              that.operateComment = '';
              that.multipleSelection = [];
              that.$refs.multipleTable.clearSelection();
            }, response => {
              that.$message.error('删除失败~');
            });
          }
        })
      },
      // 多选添加目标
      selectionChange(val) {
        this.multipleSelection = val;
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

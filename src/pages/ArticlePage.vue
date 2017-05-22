<template>
  <div>
    <el-button type="primary" @click="goCreate()" style="margin: 15px;">新增文章</el-button>
    <!--文章列表-->
    <el-table :data="articleList" border style="width: 100%" ref="multipleTable" @selection-change="selectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column label="序号" width="70">
        <template scope="scope">
          {{scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题">
      </el-table-column>
      <el-table-column label="标签">
        <template scope="scope">
          <span class="cell__tag" v-for="item in scope.row.tag">{{item.title}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="view_count" label="阅读量">
      </el-table-column>
      <el-table-column prop="comment_count" label="评论量">
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
      'articleList': [],
      'multipleSelection': [],
      'operateArticle': '',
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
    const that = this;
    that.getList(1);
    that.$bus.$on('article-add', (article) => {
      that.articleList.unshift(article);
    });
    that.$bus.$on('article-edit', (article) => {
      that.articleList.forEach((item, index) => {
        if (item._id == article._id) {
          Vue.set(item, 'title', article.title);
          Vue.set(item, 'content', article.content);
          Vue.set(item, 'tag', article.tag);
        }
      })
    })
  },
  watch: {
    '$route': function () {
      this.getList(1);
    }
  },
  methods: {
    // 获取文章列表
    getList(page) {
      const that = this;
      that.$http.get(that.$home + '/blog/article/list?page=' + page).then(response => {
        if (response.body.errcode == 0) {
          that.articleList = response.body.article;
          that.total = response.body.count;
          that.loading = false;
        } else {
          that.$message.error('获取文章列表失败~');
        }
      }, response => {
        that.$message.error('获取文章列表失败~');
      })
    },
    // 删除目标
    goDel(index, row) {
      const that = this;
      that.operateArticle = row;
      that.operateIndex = index;
      that.$confirm('确定要删除吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (that.multipleSelection.length > 0) {
          let operateArticleArr = [];
          that.multipleSelection.forEach(item => {
            operateArticleArr.push(item._id)
          });
          that.$http.post(that.$home + '/blog/article/del', {
            _id: operateArticleArr
          }).then(response => {
            if (response.body.errcode == 0) {
              that.$message({
                message: '删除成功~',
                type: 'success'
              });
              operateArticleArr.forEach(_id => {
                that.articleList.forEach((item, _index) => {
                  if (_id == item._id) {
                    that.articleList.splice(_index, 1);
                  }
                })
              })
            } else {
              that.$message.error('删除失败~');
            }
            that.operateArticle = '';
            that.$refs.multipleTable.clearSelection();
          }, response => {
            that.$message.error('删除失败~');
          });
        } else {
          that.$http.post(that.$home + '/blog/article/del', {
            _id: that.operateArticle._id
          }).then(response => {
            if (response.body.errcode == 0) {
              that.$message({
                message: '删除成功~',
                type: 'success'
              });
              that.articleList.splice(that.operateIndex, 1);
            } else {
              that.$message.error('删除失败~');
            }
            that.operateArticle = '';
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
    },
    // 前往编辑文章页
    goEdit(index, row) {
      const that = this;
      if (that.multipleSelection.length > 1) {
        that.$message.error('只能编辑单个目标');
        that.$refs.multipleTable.clearSelection();
      } else {
        that.operateArticle = row;
        that.operateIndex = index;
        that.$router.push({
          path: '/article/edit/' + that.operateArticle._id
        })
      }
    },
    // 前往新建文章页
    goCreate() {
      this.$router.push({
        path: '/article/' + 'new'
      })
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
.el-table .cell .cell__tag {
  display: inline-block;
  margin-left: 10px;
}

.el-table .cell .cell__tag:first-of-type {
  margin: 0;
}
</style>

<template>
  <div>
    <div class="editor-box">
      <el-form label-position="left" :model="editForm" label-width="80px" ref="editTagForm">
        <el-form-item label="博客标题" prop="title" style="margin-bottom: 15px;">
          <el-input v-model="editForm.title"></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox-group v-model="editForm.tag" style="margin-bottom:15px;">
            <el-checkbox-button v-for="tag in tagList" :label="tag._id" :key="tag._id">{{tag.title}}
            </el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <markdown-editor v-model="editForm.content"></markdown-editor>
        <el-button @click="backPage">取 消</el-button>
        <el-button type="primary" @click="submitForm()">提 交</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import marked from 'marked'
  import highlight from 'highlight.js'
  import '../assets/atom-one-dark.css'
  export default {
    data: function() {
      return {
        'editForm': {
          'title': '',
          'content': '',
          'tag': []
        },
        'tagList': [],
      }
    },
    watch: {
      '$route': 'getEdit'
    },
    methods: {
      getEdit() {
        const that = this;
        if (that.$route.params.id) {
          that.$http.get(that.$home + '/blog/article/fetchOne?_id=' + that.$route.params.id).then(response => {
            that.editForm.title = response.body.article.title;
            that.editForm.content = response.body.article.content;
            response.body.article.tag.forEach(item => {
              that.editForm.tag.push(item._id)
            })
          }, response => {
            console.log(response);
          })
        } else {
          that.editForm.title = '';
          that.editForm.content = '';
          that.editForm.tag = [];
        }
      },
      // 获取所有标签
      getTags() {
        const that = this;
        that.$http.get(that.$home + '/blog/tag/list?limit=0&page=1').then(response => {
          if (response.body.errcode == 0) {
            that.tagList = response.body.tag;
          } else {
            that.$message.error('获取标签列表失败~');
          }
        }, response => {
          that.$message.error('获取标签列表失败~');
        })
      },
      // 取消返回上一页
      backPage() {
        this.$router.push({
          path: '/article/' + 'new'
        })
      },
      // 提交
      submitForm() {
        const that = this;
        if(that.editForm.title==''){
            that.$message.error('未填写标题~');
            return false;
        }else if(that.editForm.content==''){
            that.$message.error('未填写内容~');
            return false;
        }else if(that.editForm.tag.length==0){
            that.$message.error('未选择分类~');
            return false;
        }
        if (that.$route.params.id) {
          that.$http.post(that.$home + '/blog/article/edit', {
            _id: that.$route.params.id,
            title: that.editForm.title,
            content: that.editForm.content,
            tag: that.editForm.tag
          }).then(response => {
            if (response.body.errcode == 0) {
              that.$message({
                message: '编辑成功~',
                type: 'success'
              });
              that.$router.back();
              let article = {
                _id: that.$route.params.id,
                title: that.editForm.title,
                content: that.editForm.content,
                tag: that.editForm.tag
              };
              that.$bus.$emit('article-edit', article);
            } else {
              that.$message.error('编辑失败~');
            }
          }, response => {
            that.$message.error('编辑失败~');
          });
        } else {
          that.$http.post(that.$home + '/blog/article/add', {
            title: that.editForm.title,
            content: that.editForm.content,
            tag: that.editForm.tag
          }).then(response => {
            if (response.body.errcode == 0) {
              that.$message({
                message: '新增成功~',
                type: 'success'
              });
              that.$router.push({
                path: '/article'
              });
              that.$bus.$emit('article-add', response.body.article);
            } else {
              that.$message.error('新增失败~');
            }
          }, response => {
            that.$message.error('新增失败~');
          });
        }
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
      that.getTags();
      that.getEdit();
      marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        highlight: function(code) {
          return highlight.highlightAuto(code).value
        }
      })
    }
  };
</script>

<style>
  .editor-box {
    padding: 15px;
  }
</style>

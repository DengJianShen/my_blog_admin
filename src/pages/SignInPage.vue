<template>
    <div id="SignInPage">
        <el-form ref="form" :model="form" label-width="80px">
            <h3>博客管理后台 v1.0</h3>
            <el-form-item label="账号">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input type="password" v-model="form.pwd"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">登录</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                form: {
                    name: '',
                    pwd: ''
                }
            }
        },
        mounted() {
            if (localStorage.getItem("user") == "allow") {
                this.$router.push({
                    path: '/start'
                });
                this.$message({
                    message: '你已登录',
                    type: 'success'
                });
            }
        },
        methods: {
            onSubmit() {
                if (this.form.name != 'JameDeng') {
                    this.$message.error('账号错误~');
                } else if (this.form.pwd != '131452086') {
                    this.$message.error('密码错误~');
                } else {
                    this.$message({
                        message: '登录成功',
                        type: 'success'
                    });
                    localStorage.setItem("user", "allow");
                    this.$router.push({
                        path: '/start'
                    });
                }
            }
        }
    }
</script>

<style>
    #SignInPage h3 {
        text-align: center;
        font-weight: normal;
        font-size: 16px;
        margin-top: 15px;
    }
    
    #SignInPage .el-form {
        width: 400px;
        margin: 0 auto;
    }
    
    #SignInPage .el-form .el-form-item {
        margin: 15px 0;
    }
</style>
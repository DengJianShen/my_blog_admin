<template>
    <div>
        <iframe src="http://djshen.cn/#index" frameborder="no" border="0" marginwidth="0" marginheight="0" style="width: 100%;height: 100vh;"></iframe>
    </div>
</template>

<script>
    export default {
        mounted() {
            if (localStorage.getItem("user") != "allow") {
               this.$message.error('你没有权限执行本操作~');
                this.$router.push({
                    path: '/signin'
                });
                window.location.reload();
            }
        }
    }
</script>
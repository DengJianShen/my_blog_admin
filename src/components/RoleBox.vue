<template>
  <div>
    <div class="role-box">
      <h3>{{role.name}}</h3>
      <span class="role">{{role.role}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      'role': {
        type: Object
      }
    }
  };
</script>

<style scoped>
  .role-box {
    padding: 20px 20px 40px 20px;
  }

  .role-box h3 {
    font-size: 18px;
    font-weight: normal;
    color: #fff;
    margin-top: 20px;
    margin-bottom: 10px;
  }

  .role-box .role {
    background-color: #23c6c8;
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    line-height: 1;
    display: inline-block;
    padding: 4px 10px;
    border-radius: 12px;
  }
</style>

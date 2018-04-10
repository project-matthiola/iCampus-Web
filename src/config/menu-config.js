module.exports = [{
  name: '用户信息管理',
  id: 'userInfoManage',
  iconCls: 'el-icon-location',
  sub: [{
    name: '学生信息',
    componentName: 'studentInfo'
  },{
    name: '教师信息',
    componentName: 'teacherInfo'
  }]
  }, {
  name: '事务管理',
  id: 'txManage',
  iconCls: 'el-icon-menu',
  sub: [{
    name: '奖学金审核',
    componentName: 'scholarApply'
  },{
    name: '请假审核',
    componentName: 'leaveApply'
  }]
  }, {
  name: '信息发布',
  id: 'infoRelease',
  iconCls: 'el-icon-document',
  sub: [{
    name: '校园新闻',
    componentName: 'schoolNews'
  },{
    name: '校园活动',
    componentName: 'schoolActivity'
  }]
}];

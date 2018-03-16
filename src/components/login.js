/**
 * Created by hao.cheng on 2017/4/14.
 */
import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import axios from 'axios';
const FormItem = Form.Item;
import { Router, Route, Link, hashHistory, IndexRoute, Redirect, IndexLink } from 'react-router';

class NormalLoginForm extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // this.props.routes.push('/myTable')
        axios.get('/login', {
          params:{
            name: values.userName,
            password: values.password
          }
         
        }).then(
          (res) => {
            if (res.data.code == 0) {
              this.props.history.push('/myTable')
            }
            else {
              alert(res.data.msg)
            }
          }
        )
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login-box">
        <Form onSubmit={this.handleSubmit} style={{ maxWidth: '300px' }}>
          <FormItem>
            {getFieldDecorator('userName', {
              rules: [{ required: true, message: '请输入用户名!' }],
            })(
              <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码!' }],
            })(
              <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码" />
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit" className="login-form-button" style={{ width: '100%' }}>
              登录
          </Button>

          </FormItem>
        </Form>
      </div>

    );
  }
}

const login = Form.create()(NormalLoginForm);

export default login;
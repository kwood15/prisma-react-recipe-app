import React from 'react';
import { Layout, Menu, Dropdown, Breadcrumb, Icon } from 'antd';
import AllRecipesContainer from './containers/AllRecipesContainer';
import './main.css';

const { Header, Sider, Content, Footer } = Layout;
const { SubMenu } = Menu;

class App extends React.Component {
  state = {
    collapsed: false
  };

  toggle = () => {
    const { collapsed } = this.state;
    this.setState({
      collapsed: !collapsed
    });
  };

  render() {
    const { collapsed } = this.state;

    const menu = (
      <Menu>
        <Menu.Item>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="http://www.alipay.com/"
          >
            1st menu item
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="http://www.taobao.com/"
          >
            2nd menu item
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="http://www.tmall.com/"
          >
            3rd menu item
          </a>
        </Menu.Item>
      </Menu>
    );

    return (
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
              <Icon type="home" />
              <span className="nav-text">Home</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="team" />
              <span className="nav-text">About us</span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="bulb" />
              <span className="nav-text">Our Services</span>
            </Menu.Item>
            <Menu.Item key="4">
              <Icon type="mail" />
              <span className="nav-text">Contact us</span>
            </Menu.Item>
            <SubMenu
              key="5"
              title={(
                <span>
                  <Icon type="info-circle" />
                  <span>Terms and conditions</span>
                </span>
)}
            >
              <Menu.Item key="6">Privacy Policy</Menu.Item>
              <Menu.Item key="7">GDPR</Menu.Item>
              <Menu.Item key="8">Your data</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>

        <Layout style={{ height: '100vh' }}>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
              className="trigger"
              type={collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
            <Dropdown overlay={menu} trigger={['click']} placement="topRight">
              <a className="ant-dropdown-link" href="/">
                Click me 
                {' '}
                <Icon type="down" />
              </a>
            </Dropdown>
          </Header>

          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '12px 0' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>

            <AllRecipesContainer />
          </Content>

          <Footer style={{ textAlign: 'center' }}>&copy; 2019</Footer>
        </Layout>
      </Layout>
    );
  }
}

export default App;

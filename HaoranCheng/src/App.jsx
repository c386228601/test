import React from "react";
import "./styles.css";
import {
  Input,
  Button,
  Layout,
  Row,
  Col,
  Card,
  Breadcrumb,
  PageHeader
} from "antd";

import "antd/dist/antd.css";

const { Header, Content } = Layout;

class Inputs extends React.Component {
  render() {
    return (
      <Row>
        <Col span={16}>
          {/* 添加数据 */}
          <Input
            placeholder="Input something"
            value={this.props.inputValue}
            onChange={this.props.change.bind(this)}
          />
        </Col>
        {/* 提交添加数据 */}
        <Col span={4}>
          <Button type="primary" onClick={this.props.add.bind(this)}>
            Add
          </Button>
        </Col>
        {/* 打开编辑模式 */}
        <Col span={4}>
          <Button type="primary" onClick={this.props.edit.bind(this)}>
            {this.props.switch ? "Edit" : "Back"}
          </Button>
        </Col>
      </Row>
    );
  }
}

class List extends React.Component {
  render() {
    return (
      <div>
        {/* 遍历所有已添加的数据 */}
        {this.props.listItem.map((ele, index) => {
          return (
            <div key={index}>
              {/* 列出所有数据 */}
              {this.props.switch ? (
                <Card>
                  <p>{ele}</p>
                </Card>
              ) : (
                <div>
                  {/* 编辑模式 */}
                  <Row gutter={[16, 32]}>
                    <Col span={16}>
                      {/* 输入要修改的值 */}
                      <Input
                        placeholder={ele}
                        type="text"
                        onChange={this.props.handleEdit.bind(this, index)}
                      />
                    </Col>
                    <Col span={3}>
                      {/* 删除数据 */}
                      <Button
                        type="primary"
                        onClick={this.props.handleRemove.bind(this, index)}
                      >
                        X
                      </Button>
                    </Col>
                    <Col span={3}>
                      {/* 提交更改 */}
                      <Button
                        type="primary"
                        onClick={this.props.confirmEdit.bind(this, index)}
                      >
                        Save
                      </Button>
                    </Col>
                  </Row>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [], //数据组
      inputValue: "", //新添加的数据临时存放
      editValue: [], //修改的数据临时存放
      switch: true //按钮开关
    };
  }

  //加载Localstorage的数据
  componentDidMount() {
    var newList = JSON.parse(localStorage.getItem("list"));
    this.setState({
      list: newList
    });
  }

  //监听输入框
  change = e => {
    this.setState({
      inputValue: e.target.value
    });
  };

  //添加新数据
  add = () => {
    this.state.inputValue === ""
      ? console.log("Input something")
      : this.setState({
          list: [...this.state.list, this.state.inputValue],
          inputValue: "",
          switch: true
        });

    //新数据组放入Localstorage
    localStorage.setItem(
      "list",
      JSON.stringify([...this.state.list, this.state.inputValue])
    );
  };

  //删除数据
  handleRemove = index => {
    var list = [...this.state.list];
    console.log("aaa " + index);

    list.splice(index, 1);
    this.setState({
      list: list
    });
    //新数据组放入Localstorage
    localStorage.setItem("list", JSON.stringify(list));
  };

  //编辑模式切换按钮
  edit = () => {
    var hid = this.state.switch;

    this.setState({
      switch: !hid
    });
  };

  //监听编辑框
  handleEdit = (index, e) => {
    console.log(index);
    var inputValue = { value: e.target.value, key: index };

    this.setState({
      editValue: inputValue
    });
  };

  //提交修改数据
  confirmEdit = index => {
    var hid = this.state.switch;
    var list = [...this.state.list];
    list[index] = this.state.editValue.value;
    var newList = list;

    this.state.editValue === null || this.state.editValue.key !== index
      ? console.log("null")
      : this.setState({
          switch: !hid,
          list: newList,
          editValue: ""
        });
    //新数据组放入Localstorage
    localStorage.setItem("list", JSON.stringify(list));
  };

  render() {
    return (
      <Layout
        style={{ padding: "24px 10px", background: "white" }}
        align="center"
      >
        <PageHeader
          className="site-page-header"
          title="TO-DO LIST"
          subTitle="Author: Haoran Cheng"
        />
        <Header>
          {/* 输入框组件 */}
          <Inputs
            switch={this.state.switch}
            inputValue={this.state.inputValue}
            change={this.change}
            add={this.add}
            edit={this.edit}
          />
        </Header>
        <Breadcrumb style={{ margin: "16px 0" }} />
        <Content className="site-layout-content">
          {/* 列表组件 */}
          <List
            listItem={this.state.list}
            switch={this.state.switch}
            handleEdit={this.handleEdit}
            handleRemove={this.handleRemove}
            confirmEdit={this.confirmEdit}
          />
        </Content>
      </Layout>
    );
  }
}
export default App;

/**
 * Created by hao.cheng on 2017/4/16.
 */
// import { getwuliulist } from '../../axios';
import React from 'react';
import axios from 'axios';
import qs from 'qs'

import { Table, Input, Popconfirm, Row, Col, Card, Tabs, Icon, Radio, Button, Upload,Alert } from 'antd';
const TabPane = Tabs.TabPane;

const props = {
    action: '//jsonplaceholder.typicode.com/posts/',
    onChange({ file, fileList }) {
        if (file.status !== 'uploading') {
            console.log(file, fileList);
        }
    },
    defaultFileList: [{
        uid: 1,
        name: 'xxx.png',
        status: 'done',
        reponse: 'Server Error 500', // custom error message to show
        url: 'http://www.baidu.com/xxx.png',
    }, {
        uid: 2,
        name: 'yyy.png',
        status: 'done',
        url: 'http://www.baidu.com/yyy.png',
    }, {
        uid: 3,
        name: 'zzz.png',
        status: 'error',
        reponse: 'Server Error 500', // custom error message to show
        url: 'http://www.baidu.com/zzz.png',
    }],
};

class EditableCell extends React.Component {
    state = {
        value: this.props.value,
        editable: this.props.editable || false,
    };
    componentWillReceiveProps(nextProps) {
        if (nextProps.editable !== this.state.editable) {
            this.setState({ editable: nextProps.editable });
            if (nextProps.editable) {
                this.cacheValue = this.state.value;
            }
        }
        if (nextProps.status && nextProps.status !== this.props.status) {
            if (nextProps.status === 'save') {
                this.props.onChange(this.state.value);
            } else if (nextProps.status === 'cancel') {
                this.setState({ value: this.cacheValue });
                this.props.onChange(this.cacheValue);
            }
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.editable !== this.state.editable ||
            nextState.value !== this.state.value;
    }
    handleChange(e) {
        const value = e.target.value;
        this.props.onChange(value);
        this.setState({ value });
    }
    render() {
        const { value, editable } = this.state;
        return (
            <div>
                {
                    editable ?
                        <div>
                            <Input
                                value={value}
                                onChange={e => this.handleChange(e)}
                            />
                        </div>
                        :
                        <div className="editable-row-text">
                            {value ? value.toString() : ""}
                        </div>
                }
            </div>
        );
    }
}

class EditableTable extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
            totalPage: '',
            data: [],
            interface:[

            ]
        };
    }

    componentDidMount() {
        //初始化物流信息列表
        this.getlist(1);
    }

    getlist(pageNum) {
    //     var reqData={
    //         pageNum:pageNum
    //     }
    //     let request = new Request('./api', {
    //         method: 'POST', 
    //         mode: 'no-cors',
    //         body:JSON.stringify(reqData),
    //         headers:myHeaders
    //  });
    //     fetch('')
        axios.get('http://42.121.31.148:8080/order/query', { param: { pageNum: pageNum } }).then(response => {
            let res = response.data;
            this.state.totalPage = res.total;
            res.data.forEach((item) => {
                item.editable = false;
            })
            console.log(res.data)
            this.state.data = res.data;
            this.setState(this.state)
        })
    }
    renderColumns(data, index, key, text) {
        var status;
        if (data[index][key]) {
            status = data[index][key];
        }
        // const { status } = data[index][key]||undefined;
        const editable = data[index].editable;
        if (typeof editable === 'undefined') {
            return text;
        }
        return (
            <EditableCell
                editable={editable}
                value={text}
                onChange={value => this.handleChange(key, index, value)}
                status={status}
            />
        );
    }
    handleChange(key, index, value) {
        const { data } = this.state;
        data[index][key] = value;
        this.setState({ data });
    }
    edit(index) {
        const { data } = this.state;
        data[index].editable = true;
        // Object.keys(data[index]).forEach((item) => {
        //     if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
        //         data[index][item].editable = true;
        //     }
        // });
        this.setState({ data });
    }
    delete(index) {
        const { data } = this.state;
        data.splice(index, 1);
        axios.get('http://42.121.31.148:8080/order/delete', {
            params:{
                id: data[index].id
            }
           
        }).then(
            response=>{
                if(response.data.forEachcode!=0){
                    alert(response.data.msg);
                   
                }else{
                    this.getlist(1)
                }
            }

        )
        this.setState(this.state)
    }
    editDone(index, type) {
        const { data } = this.state;
        // Object.keys(data[index]).forEach((item) => {
        //     if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
        //         data[index][item].editable = false;
        //         data[index][item].status = type;
        //     }
        // });

        if (type == "save") {
            //保存
            // alert('保存');
            data.forEach((item) => {
                item.editable = false;
            })
            const reqData = data[index];
            let ajaxData={
                id: reqData.id,
                orderNo: reqData.orderNo,
                date: reqData.date,
                destProvince:reqData.destProvince,
                weight: reqData.weight,
                firstPrice: reqData.firstPrice,
                continuePrice: reqData.continuePrice,
                totalPrice: reqData.totalPrice
            }
            if (!ajaxData.id) delete ajaxData.id;
            axios.get('http://42.121.31.148:8080/order/save', {
                params: ajaxData
            }).then(
                response=>{
                    if(response.code!=0){
                        alert(response.data.msg);
                        
                    }else{
                        this.getlist(1)
                    }
                }

            )
            console.log(data[index])
        } else {
            data.forEach((item) => {
                item.editable = false;
            })
        }

        this.setState({ data });

    }
    changePageNum = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination);
        this.getlist(pagination.current)
    };
    addRecord() {
        const { data } = this.state;
        const addList = {
            editable:true,
            id: "",
            orderNo: "",
            date: "",
            destProvince: "",
            weight: "",
            firstPrice: null,
            continuePrice: null,
            totalPrice: null
        };
        data.splice(0, 0, addList);
        // data.push(addList);
        this.setState(this.state)
    }
    render() {
        const { data } = this.state;

        data.forEach((item) => {
            item.key = item.id;
        })
        const dataSource = data;


        var table = '';
        if (data && data.length > 0) {
            let columns = [{
                title: '日期',
                dataIndex: 'date',
                width: '10%',
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'date', record.date),
            }, {
                title: '单号',
                dataIndex: 'orderNo',
                width: '15%',
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'orderNo', record.orderNo),
            }, {
                title: '目的地省份',
                dataIndex: 'destProvince',
                width: '15%',
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'destProvince', record.destProvince),
            },
            {
                title: '重量',
                dataIndex: 'weight',
                width: '10%',
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'weight', record.weight),
            },
            {
                title: '首重价格',
                dataIndex: 'firstPrice',
                width: '10%',
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'firstPrice', record.firstPrice),
            },
            {
                title: '续重价格',
                dataIndex: 'continuePrice',
                width: '10%',
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'continuePrice', record.continuePrice),
            },
            {
                title: '总价格',
                dataIndex: 'totalPrice',
                width: '10%',
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'totalPrice', record.totalPrice),
            },
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record, index) => {
                    const editable = this.state.data[index].editable;

                    return (
                        <div className="editable-row-operations">
                            {
                                editable ?
                                    <span>
                                        <a onClick={() => this.editDone(index, 'save')}>保存</a>
                                        <Popconfirm title="确定要取消吗?" okText="确定" cancelText="取消" onConfirm={() => this.editDone(index, 'cancel')}>
                                            <a>取消</a>

                                        </Popconfirm>
                                    </span>
                                    :
                                    <span>
                                        <a onClick={() => this.edit(index)}>编辑</a>
                                        <a onClick={() => this.delete(index)}>删除</a>
                                    </span>
                            }
                        </div>
                    );
                },
            }]
            table = <Table bordered dataSource={dataSource} columns={columns} pagination={{ defaultPageSize: 10, total: this.state.totalPage }} onChange={this.changePageNum} />;
        }
        return (
            <div>
                <Upload {...props}>
                    <Button>
                        <Icon type="upload" /> 上传
                    </Button>
                </Upload>
                <Button onClick={this.addRecord.bind(this)}><Icon type="plus" />新增</Button>
                {table}
            </div>
        )

    }
}

export default EditableTable;
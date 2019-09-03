import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb, Icon, Form, Input, Button, Select, Row, Col, AutoComplete } from 'antd';
import md5 from 'md5';
import storage from '../Storage/SaveStorage';


const { SubMenu } = Menu;
const { Option } = Select;


const salt = '19970521';





class MainLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 'translate',
            url: '',
            //oldtranslation: '',
            //newtranslation: ''
            datasource: []
        }
    };
    render() {
        const { getFieldDecorator } = this.props.form;


        return (
            <div>
                <Form>
                    <Form.Item >{
                        getFieldDecorator('original')
                            (

                                <AutoComplete dataSource={this.state.datasource} 
                                              filterOption={(inputValue, option) =>
                                              option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                }>
                                    <Input.TextArea rows={4} style={{ height: 100 }} />
                                </AutoComplete>
                            )
                    }
                    </Form.Item>
                    <Form.Item >{
                        getFieldDecorator('translation')
                            (<Input.TextArea rows={4} style={{ height: 100 }}/>)}
                    </Form.Item>

                    <Row type="flex" >
                        <Col span={4}>
                            <Form.Item>{
                                getFieldDecorator('language')
                                    (<Select initialValue='zh' style={{ width: 160 }}>
                                        <Option value='zh'>Chinese</Option>
                                        <Option value='en'>English</Option>
                                        <Option value='jp'>Japanese</Option>
                                    </Select>)
                            }
                            </Form.Item>
                        </Col>
                        <Col span={4}></Col>
                        <Col span={4}>
                            <Form.Item>{
                                (
                                    <Button onClick={this.handleInput}>翻译</Button>
                                )
                            }
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

                <audio id='voice'></audio>
                <Button onClick={this.ChangeTextToVoice}>
                <Icon type="sound" />
                </Button>
            </div>

        )

    };

    //获取需要翻译的文本值,传入百度api之中
    handleInput = (value) => {

        const language = this.props.form.getFieldValue('language');
        const original = this.props.form.getFieldValue('original');
        const str = '20190817000327144' + original + salt + '0u50SoEtDxTFs0usoIcs';
        const md5text = md5(str);
        const strtwo = '/api/trans/vip/translate?q=' + original + '&from=auto&to=' + language + '&appid=20190817000327144&salt=' + salt + '&sign=' + md5text;
        if (strtwo !== '') {
            fetch(strtwo, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',

                },
                mode: 'cors',
                cache: 'default'
            })
                .then(res => res.json())
                .then((data) => {
                    this.props.form.setFieldsValue({ 'translation': data.trans_result[0].dst });
                    var savedata = {
                        original: data.trans_result[0].src,
                        translation: data.trans_result[0].dst
                    }
                    //保存数据
                    this.saveStorage(savedata);

                    

                })
                .catch(error => {
                    console.log(error)
                })
        }


    };



    //保存数据
    saveStorage = (value) => {

        //判断查询历史中是否有相同记录
        storage.getAllDataForKey('history', value).then(ids => {
            let length = ids.length;
            let i;
            let flag = 1;
            for (i = 0; i < length; i++) {
                if (value.original === ids[i].original && value.translation === ids[i].translation) {
                    flag = 0;
                }
            }

            if (flag === 1) {

                //获取当前的id编号
                storage.load({
                    key: 'currentid'
                }).then(ret => {

                    //保存新的资料

                    storage.save({
                        key: 'history',
                        id: ret,
                        data: value
                    });

                    var newid = ret + 1;
                    //更新currentid
                    storage.save({
                        key: 'currentid',
                        data: newid
                    });

                }).catch(error => {
                    console.log("error");
                })

            }

            //保存通过下拉框显示的模糊查询数据
            this.removeDuplicatedItem4(ids);


        }
        )


    }
    //将译文的文本值转换为语音
    ChangeTextToVoice = (value) => {
        //获取译文的文本值和语言
        let temp = this.props.form.getFieldValue('translation');
        let translation = encodeURI(temp);
        let language = this.props.form.getFieldValue('language');
        let url = 'http://tts.baidu.com/text2audio?lan=' + language + '&ie=UTF-8&spd=2&text=' + translation;
        let voice = document.getElementById('voice');
        voice.src = url
        console.log('tran;' + temp + 'url;' + url);
        voice.play();

    }
    //去重函数，将保存历史记录
    removeDuplicatedItem4 = (ar) => {
        
        var arr = ar,
            result = [],
            i,
            j,
            len = ar.length;

        for (i = 0; i < len; i++) {
            for (j = i + 1; j < len; j++) {
                if (arr[i].original === arr[j].original) {
                    j = ++i;
                }
            }
            result.push(arr[i].original);
        }
        this.setState({
            datasource: result
        });

    }

    //

    removeDuplicatedItem =() =>{
        storage.getAllDataForKey('history').then(ids => {
            let temp = ids,
            result = [],
            i,
            j,
            len = temp.length;

        for (i = 0; i < len; i++) {
            for (j = i + 1; j < len; j++) {
                if (temp[i].original === temp[j].original) {
                    j = ++i;
                }
            }
            result.push(temp[i].original);
        }
        this.setState({
            datasource: result
        });
        })



    }


    componentWillMount() {


        storage.getAllDataForKey('history').then(ids => {

            this.removeDuplicatedItem4(ids);
        }
        )
    }




}
MainLayout = Form.create({})(MainLayout);
export default MainLayout;



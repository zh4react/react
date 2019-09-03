import React, { Component } from 'react';
import { List, Button } from 'antd';
import { AutoComplete } from 'antd';
import storage from '../Storage/SaveStorage';





class History extends Component {
    constructor(props) {
        super(props);
        this.state = {
            datasource : []
        }
    }

    //去重函数
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


    componentWillMount() {

        storage.getAllDataForKey('history').then(ids => {

            this.removeDuplicatedItem4(ids);
        }
        )
    }
    //播放语音
    PlayVoice = (value) => {

        let voice = document.getElementById('voice');
        voice.play();


    }
    //清除存储中重复的数据
    clean = (value) => {
        storage.clearMapForKey('history');
        storage.clearMapForKey('currentid');


    }









    render() {

        return (
            <div>
                <AutoComplete
                    dataSource={this.state.datasource}
                    style={{ width: 200 }}
                    //onSelect={this.onSelect}
                    //onSearch={this.onSearch}
                    placeholder="input here"
                    filterOption={(inputValue, option) =>
                        option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
                />

                <Button onClick={this.clean}></Button>
                <audio id='voice' src='http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=2&text=%E7%8E%8B%E7%82%B8'></audio>

            </div >
        )
    }
}
export default History;
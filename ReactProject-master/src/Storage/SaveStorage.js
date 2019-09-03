import Storage from 'react-native-storage';

     const storage = new Storage({
        //最大数据量
        size : 1000,
        //不设置默认保存在缓存中，web用 window.localStorage
        storageBackend: window.localStorage,
        //单位默认毫秒
        defaultExpires: 7000 * 3600 * 24,
        // 读写时在内存中缓存数据。默认启用。
        enableCache: true,
    })
    storage.load({
        key : 'currentid'
    }).catch(err => {
        storage.save({
            key : 'currentid',
            data : 0
        });
       
    })  



    export default storage;
    global.storage = storage;






